
import { DATABASE_ID, PROJECTS_ID } from '@/config';
import { getMember } from '@/features/members/utils';
import { CheckSession } from '@/lib/checkSession';
import { NextRequest, NextResponse } from 'next/server';
import { Query } from 'node-appwrite';


export async function GET(req: NextRequest,{ params }: { params: { workspaceId: string }}) {
  try {
    const context = await CheckSession(req);
    if (!context) {
      return NextResponse.json({ message: 'Unautarized' }, { status: 401 });
    }
    const user = context.user;
    const databases = context.databases;

    const {workspaceId} = await params;
    if(!workspaceId){
      return NextResponse.json({message:"Failed to get workspaceId"},{status:400})
    }
    const member = await getMember({
      databases,
      workspaceId,
      userId:user.$id
    })
    if(!member){
      return NextResponse.json({ message: "You don't have access" }, { status: 403 });
    };
    const projects = await databases.listDocuments(
      DATABASE_ID,
      PROJECTS_ID,
      [
        Query.equal("workspaceId",workspaceId),
        Query.orderDesc("$createdAt")
      ]
    );
    return NextResponse.json({projects})
    
  } catch {
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 401 }
    );
  }
}