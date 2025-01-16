import { getCurrent } from '@/features/auth/queries';
import TaskViewSwitcher from '@/features/tasks/components/task-view-switcher';
import { redirect } from 'next/navigation';

export default async function TaskPage() {
  const user = await getCurrent();
  if (!user) redirect('/sign-in');
  if (!user.emailVerification) {
    redirect('/verify-email');
  }
  return (
    <div className="h-full flex flex-col">
      <TaskViewSwitcher />
    </div>
  );
}
