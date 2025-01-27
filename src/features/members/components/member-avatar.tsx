import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface MemberAvatarProps {
  name: string;
  className?: string;
  fallbackClassName?: string;
}

export default function MemberAvatar({
  name,
  className,
  fallbackClassName,
}: MemberAvatarProps) {
  return (
    <Avatar
      className={cn(
        'size-5 transition border border-neutral-300 dark:border-none rounded-full',
        className
      )}
    >
      <AvatarFallback
        className={cn(
          'bg-neutral-200 dark:bg-white font-medium text-neutral-500 dark:text-black flex items-center justify-center',
          fallbackClassName
        )}
      >
        {name.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}
