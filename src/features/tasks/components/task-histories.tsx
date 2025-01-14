import DottedSeparator from '@/components/dotted-separator';

import { ResponseTaskHistories } from '../api/use-get-histories';
import TaskHistoryItem from './task-histories-item';
import { Separator } from '@/components/ui/separator';
import { Fragment } from 'react';

interface TaskHistoriesProps {
  taskHistories: ResponseTaskHistories[];
}

export default function TaskHistories({ taskHistories }: TaskHistoriesProps) {
  return (
    <div className="flex flex-col gap-y-4 col-span-1 select-none">
      <div className="bg-muted rounded-lg p-4">
        <p className="text-lg font-semibold">Task Histories</p>
        <DottedSeparator className="my-4" />
        <div className="flex flex-col gap-3">
          {taskHistories.map((history, i) => {
            const isLast = i === taskHistories.length - 1;
            return (
              <Fragment key={history.$id}>
                <TaskHistoryItem history={history} />
                {!isLast && <Separator className="w-full" />}
              </Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
