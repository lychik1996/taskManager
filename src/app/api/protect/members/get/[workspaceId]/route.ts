import { DATABASE_ID, MEMBERS_ID } from '@/config';
import { getMember } from '@/features/members/utils';
import { createAdminClient } from '@/lib/appwrite';
import { CheckSession } from '@/lib/checkSession';
import { NextRequest, NextResponse } from 'next/server';
import { Query } from 'node-appwrite';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ workspaceId: string }> }
) {
  try {
    const context = await CheckSession();
    if (!context) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const { users } = await createAdminClient();

    const databases = context.databases;
    const user = context.user;

    const { workspaceId } = await params;

    if (!workspaceId) {
      return NextResponse.json(
        { message: 'Failed to get workspaceId' },
        { status: 401 }
      );
    }

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });

    if (!member) {
      return NextResponse.json(
        { message: "You don't have access" },
        { status: 403 }
      );
    }

    const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
      Query.equal('workspaceId', workspaceId),
    ]);

    const populatedMembers = await Promise.all(
      members.documents.map(async (member) => {
        const user = await users.get(member.userId);
        return {
          ...member,
          name: user.name,
          email: user.email,
        };
      })
    );

    return NextResponse.json({ ...members, documents: populatedMembers });
  } catch {
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 401 }
    );
  }
}
