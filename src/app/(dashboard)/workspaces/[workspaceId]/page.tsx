import { getCurrent } from '@/features/auth/queries';
import { redirect } from 'next/navigation';
import WorkspaceIdClient from './client';

export default async function WorkspaceId() {
  const user = await getCurrent();
  if (!user) {
    redirect('/sign-in');
  }
  if (!user.emailVerification) {
    redirect('/verify-email');
  }
  return <WorkspaceIdClient />;
}
