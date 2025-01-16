import { getCurrent } from '@/features/auth/queries';

import { redirect } from 'next/navigation';
import ProjectIdClient from './client';

export default async function ProjectIdPage() {
  const user = await getCurrent();
  if (!user) redirect('/sign-in');
  if (!user.emailVerification) {
    redirect('/verify-email');
  }
  return <ProjectIdClient />;
}
