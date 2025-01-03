import { Card, CardContent } from '@/components/ui/card';
import { useGetMembers } from '@/features/members/api/use-get-members';
import { useGetProjects } from '@/features/projects/api/use-get-projects';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { Loader } from 'lucide-react';
import CreateTaskForm from './create-task-form';
import { useGetTask } from '../api/use-get-task';
import EditTaskForm from './edit-task-form';

interface EditTaskWrapperProps {
  onCancel: () => void;
  id:string;
}

export default function EditTaskFormWrapper({
  onCancel,
  id
}: EditTaskWrapperProps) {
  const workspaceId = useWorkspaceId();

  const {data:initialValues,isLoading:isLoadingTask} = useGetTask(id)
  const { data: projects, isLoading: isLoadingProjects } = useGetProjects({
    workspaceId,
  });
  const { data: members, isLoading: isLoadingMembers } = useGetMembers({
    workspaceId,
  });

  const projectOptions = projects?.documents.map((project) => ({
    id: project.$id,
    name: project.name,
    imageUrl: project.imageUrl,
  }));

  const memberOptions = members?.documents.map((member) => ({
    id: member.$id,
    name: member.name,
  }));
  const isLoading = isLoadingMembers || isLoadingProjects || isLoadingTask;

  if (isLoading) {
    return (
      <Card className="w-full h-[714px] border-none shadow-none">
        <CardContent className="flex items-center justify-center h-full">
          <Loader className="size-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }
  if(!initialValues){
    return null
  }
  return(
    <EditTaskForm
    memberOptions={memberOptions ?? []}
    projectOptions={projectOptions ?? []}
    onCancel={onCancel}
    initialValues={initialValues}
    />
  )
}