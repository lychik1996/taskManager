
import { DATABASE_ID, IMAGES_BUCKET_ID, WORKSPACES_ID } from '@/config';
import { MemberRole } from '@/features/members/types';
import { getMember } from '@/features/members/utils';
import { CheckSession } from '@/lib/checkSession';
import { generateInviteCode } from '@/lib/utils';
import { NextRequest, NextResponse } from 'next/server';



export async function POST(
  req: NextRequest,
  { params }: { params: { workspaceId: string } }
) {
  try {
   
    const { workspaceId } = await params;
    if (!workspaceId) {
      return NextResponse.json(
        { message: 'WorkspaceId is missing' },
        { status: 401 }
      );
    }
    const context = await CheckSession(req);
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

    if (!member || member.role !== MemberRole.ADMIN) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    

    const workspace = await databases.updateDocument(
      DATABASE_ID,
      WORKSPACES_ID,
      workspaceId,
      {
        inviteCode: generateInviteCode(10)
      }
    )
    
    return NextResponse.json({workspace});
  } catch {
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 401 }
    );
  }
}
