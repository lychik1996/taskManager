import { getCurrent } from '@/features/auth/queries';

import { redirect } from 'next/navigation';
import WorkspaceIdSettingsClient from './client';

export default async function WorkSpaceIdSettingsPage() {
  const user = await getCurrent();

  if (!user) redirect('/sign-in');

  if (!user.emailVerification) {
    redirect('/verify-email');
  }
  return <WorkspaceIdSettingsClient />;
}
