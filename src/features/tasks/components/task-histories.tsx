import DottedSeparator from '@/components/dotted-separator';

import { ResponseTaskHistories } from '../api/use-get-histories';
import TaskHistoryItem from './task-histories-item';

interface TaskHistoriesProps {
  taskHistories: ResponseTaskHistories[];
}

export default function TaskHistories({ taskHistories }: TaskHistoriesProps) {
  return (
    <div className="flex flex-col gap-y-4 col-span-1 select-none">
      <div className="bg-muted rounded-lg p-4">
        <p className="text-lg font-semibold">Task Histories</p>
        <DottedSeparator className="my-4" />
        <div className="flex flex-col gap-2">
          {taskHistories.map((history) => (
            <TaskHistoryItem key={history.$id} history={history} />
          ))}
        </div>
      </div>
    </div>
  );
}
