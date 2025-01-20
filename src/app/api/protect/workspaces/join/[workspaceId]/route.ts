import { EmailContent, EmailVarian } from '@/components/email/email-content';
import { DATABASE_ID, MEMBERS_ID, PUBLIC_APP, WORKSPACES_ID } from '@/config';
import { MemberRole } from '@/features/members/types';
import { getMember } from '@/features/members/utils';
import { Workspace } from '@/features/workspaces/types';
import { createAdminClient } from '@/lib/appwrite';
import { CheckSession } from '@/lib/checkSession';
import { sendEmail } from '@/lib/nodemailer';
import { render } from '@react-email/components';
import { NextRequest, NextResponse } from 'next/server';
import { ID, Models, Query } from 'node-appwrite';

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
    const { users } = await createAdminClient();
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

    ///send mail to team in current workspace
    try {
      const members = await databases.listDocuments<
        Models.Document & { userId: string }
      >(DATABASE_ID, MEMBERS_ID, [Query.equal('workspaceId', workspaceId)]);
      const emailInvite = members.documents.map(async (member) => {
        const userMember = await users.get(member.userId);
        if (!userMember) return null;
        const href = `${PUBLIC_APP}workspaces/${workspaceId}`;
        const component =
          userMember.$id !== user.$id
            ? EmailContent({
                variant: EmailVarian.JOIN_WORKSPACE,
                name: userMember.name,
                forU: false,
                appointingName: user.name,
                appointingEmail: user.email,
                workspaceName: workspace.name,
                href,
              })
            : EmailContent({
                variant: EmailVarian.JOIN_WORKSPACE,
                name: user.name,
                forU: true,
                workspaceName: workspace.name,
                href,
              });
        const html = await render(component);
        return await sendEmail({
          to: userMember.email,
          subject: 'Invite to team',
          html,
        });
      });
      await Promise.all(emailInvite);
    } catch (e) {
      console.error('Failed to send email', e);
    }
    return NextResponse.json({ workspace });
  } catch {
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 401 }
    );
  }
}
