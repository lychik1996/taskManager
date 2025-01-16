import { getCurrent } from '@/features/auth/queries';
import CreateWorkSpaceForm from '@/features/workspaces/components/create-workspace-form';
import { redirect } from 'next/navigation';

export default async function WorkspaceCreatePage() {
  const user = await getCurrent();
  if (!user) {
    redirect('/sign-in');
  }
  if (!user.emailVerification) {
    redirect('/verify-email');
  }
  return (
    <div className="w-full lg:max-w-xl">
      <CreateWorkSpaceForm />
    </div>
  );
}
