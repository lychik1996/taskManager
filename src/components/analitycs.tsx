import AnalitycsCard from './analitycs-card';
import DottedSeparator from './dotted-separator';
import { ScrollArea, ScrollBar } from './ui/scroll-area';

interface AnalitycsProps {
  data: {
    taskCount: number;
    taskDifference: number;
    projectCount?: number;
    projectDifference?: number;
    assigneeTaskCount: number;
    assigneeTaskDifference: number;
    completedTaskCount: number;
    completedTaskDifference: number;
    incomleteTaskCount?: number;
    incompleteTaskDifference?: number;
    overdueTaskCount: number;
    overdueTaskDifference: number;
  };
}
export default function Analitycs({ data }: AnalitycsProps) {
  const showIncomplete =
    typeof data.incomleteTaskCount === 'number' &&
    typeof data.incompleteTaskDifference === 'number';
  return (
    <ScrollArea className="border rounded-lg w-full whitespace-nowrap shrink-0 " >
      <div className="w-full flex flex-row">
        <div className="flex items-center flex-1">
          <AnalitycsCard
            title="Total Tasks"
            value={data.taskCount}
            variant={data.taskDifference > 0 ? 'up' : 'down'}
            increaseValue={data.taskDifference}
          />
          <DottedSeparator direction="vertical" />
        </div>
        <div className="flex items-center flex-1">
          <AnalitycsCard
            title="Assigned Tasks"
            value={data.assigneeTaskCount}
            variant={data.assigneeTaskDifference > 0 ? 'up' : 'down'}
            increaseValue={data.assigneeTaskDifference}
          />
          <DottedSeparator direction="vertical" />
        </div>
        <div className="flex items-center flex-1">
          <AnalitycsCard
            title="Completed Tasks"
            value={data.completedTaskCount}
            variant={data.completedTaskDifference > 0 ? 'up' : 'down'}
            increaseValue={data.completedTaskDifference}
          />
          <DottedSeparator direction="vertical" />
        </div>
        <div className="flex items-center flex-1">
          <AnalitycsCard
            title="Overdue Tasks"
            value={data.overdueTaskCount}
            variant={data.overdueTaskDifference > 0 ? 'up' : 'down'}
            increaseValue={data.overdueTaskDifference}
          />
          <DottedSeparator direction="vertical" />
        </div>
        {showIncomplete && (
          <div className="flex items-center flex-1">
            <AnalitycsCard
              title="Incomplete Tasks"
              value={data.incomleteTaskCount ?? 0}
              variant={(data.incompleteTaskDifference ?? 0) > 0 ? 'up' : 'down'}
              increaseValue={data.incompleteTaskDifference ?? 0}
            />
          </div>
        )}
      </div>
      <ScrollBar orientation='horizontal'/>
    </ScrollArea>
  );
}
