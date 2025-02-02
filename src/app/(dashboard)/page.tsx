import { getCurrent } from '@/features/auth/queries';
import { getWorkspaces } from '@/features/workspaces/queries';

import { redirect } from 'next/navigation';

export default async function Home() {
  const user = await getCurrent();
  if (!user) {
    redirect('/sign-in');
  }
  if (!user.emailVerification) {
    redirect('/verify-email');
  }
  const workspaces = await getWorkspaces();
  if (workspaces.total === 0) {
    redirect('/workspaces/create');
  } else {
    redirect(`/workspaces/${workspaces.documents[0].$id}`);
  }
}
