import { DATABASE_ID, MEMBERS_ID, WORKSPACES_ID } from '@/config';
import { CheckSession } from '@/lib/checkSession';
import { NextRequest, NextResponse } from 'next/server';
import { Query } from 'node-appwrite';

export async function GET(req: NextRequest) {
  try {
    const context = await CheckSession();
    if (!context) {
      return NextResponse.json({ message: 'Unautarized' }, { status: 401 });
    }
    const user = context.user;
    const databases = context.databases;
    const members = await databases.listDocuments(
      DATABASE_ID,
      MEMBERS_ID,
      [Query.equal("userId",user.$id)]
    )
    if(members.total ===0){
      return NextResponse.json({workspaces:{documents:[],total:0}})
    }
    const workspaceIds = members.documents.map((member)=>member.workspaceId);

    const workspaces = await databases.listDocuments(
        DATABASE_ID,
        WORKSPACES_ID,
        [
          Query.orderDesc("$createdAt"),
          Query.contains("$id",workspaceIds)
        ]
    )
    return NextResponse.json({workspaces})
  } catch {
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 401 }
    );
  }
}
