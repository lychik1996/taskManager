import { DATABASE_ID, MEMBERS_ID, WORKSPACES_ID } from '@/config';
import { MemberRole } from '@/features/members/types';
import { getMember } from '@/features/members/utils';
import { Workspace } from '@/features/workspaces/types';
import { CheckSession } from '@/lib/checkSession';
import { NextRequest, NextResponse } from 'next/server';
import { ID } from 'node-appwrite';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ workspaceId: string }> }
) {
  try {
    const { workspaceId } = await params;
   
    if (!workspaceId) {
      return NextResponse.json(
        { message: 'WorkspaceId is missing' },
        { status: 401 }
      );
    }

    const { code } = await req.json();
    if (!code) {
      throw new Error('Something went wrong');
    }
    
    const context = await CheckSession();
    if (!context) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const databases = context.databases;
    const user = context.user;
    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });
    if (member) {
      return NextResponse.json(
        { message: 'Already a member' },
        { status: 400 }
      );
    }
    const workspace = await databases.getDocument<Workspace>(
      DATABASE_ID,
      WORKSPACES_ID,
      workspaceId
    );
    if (workspace.inviteCode !== code) {
      return NextResponse.json(
        { message: 'Invalid invite code' },
        { status: 400 }
      );
    }
    await databases.createDocument(DATABASE_ID, MEMBERS_ID, ID.unique(), {
      workspaceId,
      userId: user.$id,
      role: MemberRole.MEMBER,
    });
    return NextResponse.json({ workspace });
  } catch {
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 401 }
    );
  }
}
