'use client';

import DottedSeparator from '@/components/dotted-separator';
import PageError from '@/components/page-error';
import PageLoader from '@/components/page-loader';
import { useGetTask } from '@/features/tasks/api/use-get-task';
import TaskDescription from '@/features/tasks/components/task-description';
import TaskBreadcrumbs from '@/features/tasks/components/task-breadcrumbs';
import TaskOverview from '@/features/tasks/components/task-overview';
import { useTaskId } from '@/features/tasks/hooks/use-task-id';
import { useGetHistories } from '@/features/tasks/api/use-get-histories';
import TaskHistories from '@/features/tasks/components/task-histories';

export default function TaskIdClient() {
  const taskId = useTaskId();
  const { data, isLoading } = useGetTask(taskId);
  const {data:taskHistories, isLoading:isLoadingTaskHistories} = useGetHistories(taskId);
  if (isLoading || isLoadingTaskHistories) {
    return <PageLoader />;
  }
  if (!data || !taskHistories) {
    return <PageError message="Task not found" />;
  }
  return (
    <div className="flex flex-col ">
      <TaskBreadcrumbs project={data.project} task={data} />
      <DottedSeparator className="my-6 " />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TaskOverview task={data} />
        <TaskDescription task={data} />
        <TaskHistories taskHistories={taskHistories}/>
      </div>
    </div>
  );
}
