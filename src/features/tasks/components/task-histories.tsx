import DottedSeparator from '@/components/dotted-separator';

import MemberAvatar from '@/features/members/components/member-avatar';
import { ResponseTaskHistories } from '../api/use-get-histories';

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { cn } from '@/lib/utils';
import { TaskField } from '../types';
import { format } from 'date-fns';
import ProjectAvatar from '@/features/projects/components/project-avatar';

interface TaskHistoriesProps {
  taskHistories: ResponseTaskHistories[];
}
export default function TaskHistories({ taskHistories }: TaskHistoriesProps) {
  console.log(taskHistories);
  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-muted rounded-lg p-4">
        <p className="text-lg font-semibold"> Task Histories</p>
        <DottedSeparator className="my-4" />
        <div className="flex flex-col gap-2">
          {taskHistories.map((history) => {
            const isCreate = history.fields.some(
              (field) => field === TaskField.CREATE
            );
            return (
              <div
                key={history.$id}
                className="flex flex-row gap-x-2 items-end justify-between"
              >
                <div className="flex items-center gap-x-2">
                  <p className=" text-muted-foreground">User</p>
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <div className="flex items-center gap-x-2 cursor-pointer p-1 border rounded-lg bg-white min-w-[80px] overflow-hidden">
                        <MemberAvatar
                          name={history.changedBy.name}
                          className="size-6"
                        />
                        <p className="text-sm font-medium">
                          {history.changedBy.name}
                        </p>
                      </div>
                    </HoverCardTrigger>
                    <HoverCardContent
                      align="start"
                      className="bg-gray-100 p-2 rounded-lg flex flex-col max-w-[180px]  overflow-hidden cursor-default"
                    >
                      <p className="text-xs text-muted-foreground">
                        Name: {history.changedBy.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Email: {history.changedBy.email}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Role: {history.changedBy.role}
                      </p>
                    </HoverCardContent>
                  </HoverCard>
                </div>
                <div
                  className={cn(
                    'hidden text-xs text-muted-foreground',
                    isCreate && 'block'
                  )}
                >
                  Created task!
                </div>
                <div className={cn('flex flex-col gap-2 p-2 border rounded bg-white', isCreate && 'hidden')}>
                  {history.fields.map((field, i) => {
                    const isAssignee = field === TaskField.ASSIGNEE_ID;
                    const isProject = field === TaskField.PROJECT_ID;
                    return (
                      <div key={i} className="flex flex-col gap-1 border rounded-sm p-2">
                        <p className='text-sm text-muted-foreground'>Change task {field.toLowerCase()} from</p>
                        <div
                          className={cn(
                            'flex flex-row gap-2 items-center',
                            !isProject && 'hidden'
                          )}
                        >
                          <ProjectAvatar
                            name={
                              history.oldValue.projectId?.name
                                ? history.oldValue.projectId.name
                                : ''
                            }
                            className="size-6"
                            image={history.oldValue.projectId?.imageUrl}
                          />
                          <p className="text-muted-foreground text-sm">
                            {history.oldValue.projectId?.name}
                          </p>
                        </div>
                        <div
                          className={cn(
                            'flex flex-row gap-2 items-center',
                            !isAssignee && 'hidden'
                          )}
                        >
                          <MemberAvatar
                            name={
                              history.oldValue.assigneeId?.name
                                ? history.oldValue.assigneeId.name
                                : ''
                            }
                            className="size-6"
                          />
                          <p className="text-muted-foreground text-sm">
                            {history.oldValue.assigneeId?.name}
                          </p>
                        </div>
                        <p
                          className={cn("text-sm text-muted-foreground",{
                            'hidden': isProject || isAssignee,
                          })}
                        >
                          {JSON.stringify(history.oldValue[field])}
                        </p>
                        <p className='text-sm text-muted-foreground'>to</p>
                        <div
                          className={cn(
                            'flex flex-row gap-2 items-center',
                            !isProject && 'hidden'
                          )}
                        >
                          <ProjectAvatar
                            name={
                              history.newValue.projectId?.name
                                ? history.newValue.projectId.name
                                : ''
                            }
                            className="size-6"
                            image={history.newValue.projectId?.imageUrl}
                          />
                          <p className="text-muted-foreground text-sm">
                            {history.newValue.projectId?.name}
                          </p>
                        </div>
                        <div
                          className={cn(
                            'flex flex-row gap-2 items-center',
                            !isAssignee && 'hidden'
                          )}
                        >
                          <MemberAvatar
                            name={
                              history.newValue.assigneeId?.name
                                ? history.newValue.assigneeId.name
                                : ''
                            }
                            className="size-6"
                          />
                          <p className="text-muted-foreground text-sm">
                            {history.newValue.assigneeId?.name}
                          </p>
                        </div>
                        <p
                          className={cn("text-sm text-muted-foreground",{
                            'hidden': isProject || isAssignee,
                          })}
                        >
                          {JSON.stringify(history.newValue[field])}
                        </p>
                      </div>
                    );
                  })}
                </div>
                <div className="text-sm font-medium">
                  {' '}
                  {format(history.$createdAt, 'dd MMM yyyy HH:mm')}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
