import MemberAvatar from '@/features/members/components/member-avatar';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from '@/components/ui/hover-card';
import { useMedia } from 'react-use';

interface TaskHistoriesUserPopoverProps {
  user: {
    name: string;
    email: string;
    role: string;
  };
}

export default function TaskHistoriesUserPopover({
  user,
}: TaskHistoriesUserPopoverProps) {
  const isDesktop = useMedia('(min-width:1024px)', false);

  if (!isDesktop) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <div className="flex items-center gap-x-2 cursor-pointer p-1 border rounded-lg bg-gray-100 min-w-[80px] overflow-hidden">
            <MemberAvatar name={user.name} className="size-6" />
            <p className="text-sm font-medium">{user.name}</p>
          </div>
        </PopoverTrigger>
        <PopoverContent className="bg-gray-100 p-2 rounded-lg flex flex-col max-w-[180px] overflow-hidden cursor-default">
          <p className="text-xs text-muted-foreground">Name: {user.name}</p>
          <p className="text-xs text-muted-foreground">Email: {user.email}</p>
          <p className="text-xs text-muted-foreground">Role: {user.role}</p>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="flex items-center gap-x-2 cursor-pointer p-1 border rounded-lg bg-gray-100 min-w-[80px] overflow-hidden">
          <MemberAvatar name={user.name} className="size-6" />
          <p className="text-sm font-medium">{user.name}</p>
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="bg-gray-100 p-2 rounded-lg flex flex-col max-w-[180px] overflow-hidden cursor-default">
        <p className="text-xs text-muted-foreground">Name: {user.name}</p>
        <p className="text-xs text-muted-foreground">Email: {user.email}</p>
        <p className="text-xs text-muted-foreground">Role: {user.role}</p>
      </HoverCardContent>
    </HoverCard>
  );
}
