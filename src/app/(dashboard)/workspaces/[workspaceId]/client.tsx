'use client';

import Analitycs from '@/components/analitycs';
import DottedSeparator from '@/components/dotted-separator';
import PageError from '@/components/page-error';
import PageLoader from '@/components/page-loader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useGetMembers } from '@/features/members/api/use-get-members';
import MemberAvatar from '@/features/members/components/member-avatar';
import { Member } from '@/features/members/types';
import { useGetProjects } from '@/features/projects/api/use-get-projects';
import ProjectAvatar from '@/features/projects/components/project-avatar';
import { useCreateProjectModal } from '@/features/projects/hooks/use-create-project-modal';
import { Project } from '@/features/projects/types';
import { useGetTasks } from '@/features/tasks/api/use-get-tasks';
import { useCreateTaskModal } from '@/features/tasks/hooks/use-create-task-modal';
import { Task } from '@/features/tasks/types';
import { useGetWorkspaceAnalitycs } from '@/features/workspaces/api/use-get-workspace-analitycs';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { formatDistanceToNow } from 'date-fns';
import { CalendarIcon, PlusIcon, SettingsIcon } from 'lucide-react';
import Link from 'next/link';

export default function WorkspaceIdClient() {
  const workspaceId = useWorkspaceId();
  const { data: analitycs, isLoading: isLoadingAnalitycs } =
    useGetWorkspaceAnalitycs({ workspaceId });
  const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({
    workspaceId,
  });
  const { data: projects, isLoading: isLoadingProjects } = useGetProjects({
    workspaceId,
  });
  const { data: members, isLoading: isLoadingMember } = useGetMembers({
    workspaceId,
  });

  const isLoading =
    isLoadingAnalitycs ||
    isLoadingTasks ||
    isLoadingProjects ||
    isLoadingMember;
  if (isLoading) {
    return <PageLoader />;
  }
  if (!analitycs || !tasks || !projects || !members) {
    return <PageError message="Falied to load workspace data" />;
  }
  return (
    <div className="h-full flex flex-col space-y-4">
      <Analitycs data={analitycs} />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <TasksList data={tasks.documents} total={tasks.total} />
        <ProjectsList data={projects.documents} total={projects.total} />
        <MembersList data={members.documents} total={members.total} />
      </div>
    </div>
  );
}

interface TasksListProps {
  data: Task[];
  total: number;
}

const TasksList = ({ data, total }: TasksListProps) => {
  const workspaceId = useWorkspaceId();
  const { open: createTask } = useCreateTaskModal();
  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-muted rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Tasks({total})</p>
          <Button variant="muted" size="icon" onClick={() => createTask()}>
            <PlusIcon className="size-4 text-neutral-400 dark:text-white" />
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <ul className="flex flex-col gap-y-4">
          {data.map((task) => (
            <li key={task.$id}>
              <Link href={`/workspaces/${workspaceId}/tasks/${task.$id}`}>
                <Card className="shadow-none rounded-lg hover:opacity-75 transition dark:bg-neutral-900 hover:dark:opacity-85">
                  <CardContent className="p-4">
                    <p className="text-lg font-medium truncate">{task.name}</p>
                    <div className="flex items-center gap-x-2">
                      <p>{task.project?.name}</p>
                      <div className="size-1 rounded-full bg-neutral-300" />
                      <div className="text-sm text-muted-foreground flex items-center">
                        <CalendarIcon className="size-3 mr-1" />
                        <span className="truncate">
                          {formatDistanceToNow(new Date(task.dueDate))}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
          <li className="text-sm text-muted-foreground text-center hidden first-of-type:block">
            No tasks found
          </li>
        </ul>
        <Button variant="muted" className="mt-4 w-full" asChild>
          <Link href={`/workspaces/${workspaceId}/tasks`}>Show All</Link>
        </Button>
      </div>
    </div>
  );
};

interface ProjectsListProps {
  data: Project[];
  total: number;
}

const ProjectsList = ({ data, total }: ProjectsListProps) => {
  const workspaceId = useWorkspaceId();
  const { open: createProject } = useCreateProjectModal();
  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-white dark:bg-muted border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Projects({total})</p>
          <Button variant="secondary" size="icon" onClick={createProject}>
            <PlusIcon className="size-4 text-neutral-400" />
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {data.map((project) => (
            <li key={project.$id}>
              <Link href={`/workspaces/${workspaceId}/projects/${project.$id}`}>
                <Card className="shadow-none rounded-lg hover:opacity-75 transition dark:bg-neutral-900 hover:dark:opacity-85">
                  <CardContent className="p-4 flex items-center gap-x-2.5">
                    <ProjectAvatar
                      name={project.name}
                      fallbackClassName="text-lg"
                      className="size-12 "
                      image={project.imageUrl}
                    />
                    <p className="text-lg font-medium truncate">
                      {project.name}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
          <li className="text-sm text-muted-foreground text-center hidden first-of-type:block">
            No projects found
          </li>
        </ul>
      </div>
    </div>
  );
};

interface MembersListProps {
  data: Member[];
  total: number;
}

const MembersList = ({ data, total }: MembersListProps) => {
  const workspaceId = useWorkspaceId();

  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-white dark:bg-muted border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Members({total})</p>
          <Button variant="secondary" size="icon" asChild>
            <Link href={`/workspaces/${workspaceId}/members`}>
              <SettingsIcon className="size-4 text-neutral-400" />
            </Link>
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <ul className="flex flex-col md:flex-row flex-wrap gap-4">
          {data.map((member) => (
            <li key={member.$id} className="flex-1">
              <Card className="shadow-none border rounded-md overflow-auto dark:bg-neutral-900">
                <CardContent className="p-3 flex items-center gap-x-2">
                  <MemberAvatar name={member.name} className="size-14" />
                  <div className="flex flex-col min-w-48">
                    <p className="text-lg font-medium line-clamp-1">
                      {member.name}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {member.email}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {member.role}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
          <li className="text-sm text-muted-foreground text-center hidden first-of-type:block">
            No members found
          </li>
        </ul>
      </div>
    </div>
  );
};
