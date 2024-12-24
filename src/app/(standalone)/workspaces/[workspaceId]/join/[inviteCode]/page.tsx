import { getCurrent } from '@/features/auth/queries';
import JoinWorkspaceForm from '@/features/workspaces/components/join-workspace-form';
import { getWorkspaceInfo } from '@/features/workspaces/queries';
import { redirect } from 'next/navigation';

interface WorkspaceJoinPageProps {
  params: {
    workspaceId: string;
  };
}

export default async function WorkspaceJoinPage({
  params,
}: WorkspaceJoinPageProps) {
  const { workspaceId } = await params;
  const user = await getCurrent();
  if (!user) redirect('/sign-in');

  const initialValues = await getWorkspaceInfo({
    workspaceId: workspaceId,
  });
  if (!initialValues) redirect('/');
  return (
    <div className="w-full lg:max-w-xl">
      <JoinWorkspaceForm initialValues={initialValues} />
    </div>
  );
}
