import { DATABASE_ID, MEMBERS_ID } from "@/config";
import { MemberRole } from "@/features/members/types";
import { getMember } from "@/features/members/utils";
import { CheckSession } from "@/lib/checkSession";
import { NextRequest, NextResponse } from "next/server";
import { Query } from "node-appwrite";

export async function PATCH(req:NextRequest,{ params }: { params: { memberId: string } }) {
        try{
            const {memberId} = await params;
            if(!memberId){
                return NextResponse.json({message:"Failed to get memberId"},{status:401})
            }
            const {role} = await req.json();
            if(!role){
                return NextResponse.json({message:"Failed to get role"},{status:401})
            }
            const context= await CheckSession(req);
            if(!context){
                return NextResponse.json({message:"Unauthorized"},{status:401})
            }
            const user = context.user;
            const databases = context.databases;

            const memberToUpdate = await databases.getDocument(
                DATABASE_ID,
                MEMBERS_ID,
                memberId,
            );
            
            const allMemberInWorkspace = await databases.listDocuments(
                DATABASE_ID,
                MEMBERS_ID,
                [Query.equal("workspaceId",memberToUpdate.workspaceId)]
            );
            const member = await getMember({
                databases,
                workspaceId:memberToUpdate.workspaceId,
                userId:user.$id
            });

            if(!member){
                return NextResponse.json({message:"Unauthorized"},{status:401})
            }

            if(member.role !==MemberRole.ADMIN){
                return NextResponse.json({message:"Unauthorized"},{status:401})
            }
            if(allMemberInWorkspace.total===1){
                return NextResponse.json({message:"Cannot downgrade the only member"},{status:400})
            }
            await databases.updateDocument(
                DATABASE_ID,
                MEMBERS_ID,
                memberId,{
                    role,
                }
            )
            return NextResponse.json({data:{$id:memberToUpdate.$id}})
        }catch{
            return NextResponse.json({message:"Something went wrong"},{status:401})
        }
}