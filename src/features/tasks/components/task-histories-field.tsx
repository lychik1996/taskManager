import ProjectAvatar from '@/features/projects/components/project-avatar';
import MemberAvatar from '@/features/members/components/member-avatar';
import DottedSeparator from '@/components/dotted-separator';
import { cn } from '@/lib/utils';
import { ResponseTaskHistories } from '../api/use-get-histories';
import { TaskField } from '../types';
import { format } from 'date-fns';

interface TaskHistoriesFieldChangeDetailsProps {
  history: ResponseTaskHistories;
}

export default function TaskHistoriesFieldChangeDetails({
  history,
}: TaskHistoriesFieldChangeDetailsProps) {
  return (
    <>
      {history.fields.map((field, i) => {
        const isAssignee = field === TaskField.ASSIGNEE_ID;
        const isProject = field === TaskField.PROJECT_ID;
        const isDate = field === TaskField.DUE_DATE;
        
        const oldValue: string = history.oldValue[
          field as keyof typeof history.oldValue
        ]
          ? String(
              history.oldValue[field as keyof typeof history.oldValue]
            ).toLowerCase()
          : '';
          
        const newValue: string = history.newValue[
          field as keyof typeof history.newValue
        ]
          ? String(
              history.newValue[field as keyof typeof history.newValue]
            ).toLowerCase()
          : '';
        const formattedField = field.toLowerCase().endsWith('id')
          ? field.toLowerCase().slice(0, -2)
          : field.toLowerCase();
        return (
          <div key={i} className="flex flex-col gap-1 p-2 text-xs">
            <div className="text-muted-foreground">
              Changed task {formattedField} from:{' '}
              <span
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
                <p className="text-muted-foreground ">
                  {history.oldValue.projectId?.name}
                </p>
              </span>
              <span
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
                <p className="text-muted-foreground">
                  {history.oldValue.assigneeId?.name}
                </p>
              </span>
              <span
                className={cn(' text-muted-foreground', {
                  hidden: isProject || isAssignee,
                })}
              >
                {isDate
                ? format(new Date(history.oldValue.dueDate as string), 'PPP')
                  : oldValue
                }
              </span>
            </div>
            <p className=" text-muted-foreground">to</p>
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
              <p className="text-muted-foreground">
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
              <p className="text-muted-foreground">
                {history.newValue.assigneeId?.name}
              </p>
            </div>
            <p
              className={cn('text-muted-foreground', {
                hidden: isProject || isAssignee,
              })}
            >
              {isDate
                ? format(new Date(history.newValue.dueDate as string), 'PPP')
                  : newValue
                }
            </p>
            <DottedSeparator className="w-full" />
          </div>
        );
      })}
    </>
  );
}
