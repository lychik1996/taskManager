import { EmailContent, EmailVarian } from '@/components/email/email-content';
import { DATABASE_ID, MEMBERS_ID, PUBLIC_APP, WORKSPACES_ID } from '@/config';
import { MemberRole } from '@/features/members/types';
import { getMember } from '@/features/members/utils';
import { createAdminClient } from '@/lib/appwrite';
import { CheckSession } from '@/lib/checkSession';
import { sendEmail } from '@/lib/nodemailer';
import { render } from '@react-email/components';
import { NextRequest, NextResponse } from 'next/server';
import { Query } from 'node-appwrite';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ memberId: string }> }
) {
  try {
    const { memberId } = await params;
    const { users } = await createAdminClient();
    if (!memberId) {
      return NextResponse.json(
        { message: 'Failed to get memberId' },
        { status: 401 }
      );
    }

    const context = await CheckSession();
    if (!context) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const user = context.user;
    const databases = context.databases;

    const memberToDelete = await databases.getDocument(
      DATABASE_ID,
      MEMBERS_ID,
      memberId
    );

    const allMemberInWorkspace = await databases.listDocuments(
      DATABASE_ID,
      MEMBERS_ID,
      [Query.equal('workspaceId', memberToDelete.workspaceId)]
    );
    const member = await getMember({
      databases,
      workspaceId: memberToDelete.workspaceId,
      userId: user.$id,
    });

    if (!member) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    if (member.$id !== memberToDelete.$id && member.role !== MemberRole.ADMIN) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    if (allMemberInWorkspace.total === 1) {
      return NextResponse.json(
        { message: 'Cannot delete the only member' },
        { status: 400 }
      );
    }

    await databases.deleteDocument(DATABASE_ID, MEMBERS_ID, memberId);

    //send mail to team in current workspace
    try {
      const userToDelete = await users.get(memberToDelete.userId);
      const workspace = await databases.getDocument(
        DATABASE_ID,
        WORKSPACES_ID,
        memberToDelete.workspaceId
      );
      const emailDelete = allMemberInWorkspace.documents.map(
        async (memberInWorspace) => {
          const userMember = await users.get(memberInWorspace.userId);
          if (!userMember) return null;
          const href = `${PUBLIC_APP}workspaces/${workspace.$id}`;
          const component =
            userMember.$id === memberToDelete.userId
              ? EmailContent({
                  name: userToDelete.name,
                  workspaceName: workspace.name,
                  variant: EmailVarian.REMOVE_MEMBER,
                  forU: true,
                })
              : EmailContent({
                  name: userMember.name,
                  appointingName: userToDelete.name,
                  forU: false,
                  appointingEmail: userToDelete.email,
                  workspaceName: workspace.name,
                  href,
                  variant: EmailVarian.REMOVE_MEMBER,
                });
          const html = await render(component);
          return await sendEmail({
            to: userMember.email,
            subject: 'Left from team',
            html,
          });
        }
      );
      await Promise.all(emailDelete);
    } catch (e) {
      console.error('Failed to send email', e);
    }

    return NextResponse.json({ data: { $id: memberToDelete.$id } });
  } catch {
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 401 }
    );
  }
}
