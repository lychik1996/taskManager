'use client';
import { useGetProjects } from '@/features/projects/api/use-get-projects';
import ProjectAvatar from '@/features/projects/components/project-avatar';
import { useCreateProjectModal } from '@/features/projects/hooks/use-create-project-modal';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { RiAddCircleFill } from 'react-icons/ri';
interface ProjectProps{
  onClose?:Function;
}
export default function Projects({onClose}:ProjectProps) {
  const pathname = usePathname();
  const { open } = useCreateProjectModal();
  const workspaceId = useWorkspaceId();

  const { data } = useGetProjects({
    workspaceId,
  });

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-neutral-500">Projects</p>
        <RiAddCircleFill
          onClick={open}
          className="size-5 text-neutral-500 dark:text-neutral-300 cursor-pointer hover:opacity-75 transition"
        />
      </div>
      {data?.documents?.map((project) => {
        const href = `/workspaces/${workspaceId}/projects/${project.$id}`;
        const isActive = pathname === href;
        return (
          <Link href={href} key={project.$id} onClick={()=>onClose?.(false)}>
            <div
              className={cn(
                'flex items-center gap-2.5 p-2.5 rounded-md hover:opacity-75 dark:hover:text-neutral-100 dark:hover:opacity-100 transition cursor-pointer text-neutral-500',
                isActive && 'bg-white dark:bg-neutral-800 shadow-sm hover:opacity-100 text-primary'
              )}
            >
              <ProjectAvatar image={project.imageUrl} name={project.name} />
              <span className="truncate">{project.name}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
