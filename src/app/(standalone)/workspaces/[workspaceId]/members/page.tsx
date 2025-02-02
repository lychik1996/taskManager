import { getCurrent } from '@/features/auth/queries';
import MembersList from '@/features/workspaces/components/members-list';
import { redirect } from 'next/navigation';

export default async function WorkspaceIdMemberspage() {
  const user = await getCurrent();
  if (!user) redirect('/sign-in');
  
  if (!user.emailVerification) {
    redirect('/verify-email');
  }
  return (
    <div className="w-full lg:max-w-xl">
      <MembersList user={user} />
    </div>
  );
}
