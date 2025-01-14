import { TaskField } from '../types';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { FaInfoCircle } from 'react-icons/fa';
import { format } from 'date-fns';
import { ResponseTaskHistories } from '../api/use-get-histories';
import TaskHistoriesUserPopover from './task-histories-user-popover';
import TaskHistoriesFieldChangeDetails from './task-histories-field';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface TaskHistoryItemProps {
  history: ResponseTaskHistories;
}

export default function TaskHistoryItem({ history }: TaskHistoryItemProps) {
  const isCreate = history.fields.some((field) => field === TaskField.CREATE);

  return (
    <div className="flex flex-row gap-x-2 items-center justify-between">
      <div className="flex items-center gap-x-2">
        <p className="text-muted-foreground text-sm">User</p>
        <TaskHistoriesUserPopover user={history.changedBy} />
      </div>
      <div
        className={cn(
          'hidden text-xs text-muted-foreground p-2 text-center min-w-[68px]',
          isCreate && 'block'
        )}
      >
        Created!
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <div
            className={cn(
              'flex flex-row items-center gap-1 p-2 text-xs cursor-pointer text-muted-foreground min-w-[68px] text-center',
              isCreate && 'hidden'
            )}
          >
            Details
            <FaInfoCircle />
          </div>
        </PopoverTrigger>
        <PopoverContent className='bg-gray-100 max-w-fit p-0' align='start'>
          <ScrollArea>
            <div className=" rounded-lg flex flex-col cursor-default  max-h-[300px] max-w-[190px] p-2">
              <TaskHistoriesFieldChangeDetails history={history} />
            </div>
            <ScrollBar orientation="vertical" />
          </ScrollArea>
        </PopoverContent>
      </Popover>
      <div className="text-xs font-medium min-w-[110px] text-muted-foreground ">
        {format(history.$createdAt, 'dd MMM yyyy HH:mm')}
      </div>
    </div>
  );
}
