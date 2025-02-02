'use client';

import { useLogout } from '@/features/auth/api/use-logout';
import DottedSeparator from './dotted-separator';
import { Avatar, AvatarFallback } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useCurrent } from '@/features/auth/api/use-current';
import { Loader, LogOut, Settings } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function UserButton() {
  const { data: user, isLoading } = useCurrent();
  const { mutate: logout } = useLogout();
  const [open, setOpen] = useState(false);
  if (isLoading) {
    return (
      <div className="size-10 rounded-full flex items-center justify-center bg-neutral-200 border border-neutral-300">
        <Loader className="size-4 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (!user) {
    return null;
  }
  const { name, email } = user;
  const avatarFallback = name
    ? name.charAt(0).toUpperCase()
    : email.charAt(0).toUpperCase() ?? 'U';
  return (
    <DropdownMenu modal={false} open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger className="outline-none relative">
        <Avatar className="size-10 hover:opacity-75 hover:dark:opacity-90 transition border border-neutral-300 dark:border-none ">
          <AvatarFallback className="bg-neutral-200 dark:bg-white dark:text-black font-medium text-neutral-500 flex items-center justify-center">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        side="bottom"
        className="w-60"
        sideOffset={10}
      >
        <div className="flex flex-col items-center justify-center gap-2 px-2.5 py-4">
          <Avatar className="size-[52px]  border border-neutral-300 dark:border-none">
            <AvatarFallback className="bg-neutral-200 dark:bg-white  text-xl font-medium text-neutral-500 flex items-center justify-center">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-center justify-center">
            <p className="text-sm font-medium">
              {name || 'User'}
            </p>
            <p className="text-xs text-neutral-500">{email}</p>
            
              <Link
                href="/user"
                className="flex flex-row items-center text-muted-foreground gap-1"
                onClick={()=>setOpen(false)}
              >
                {' '}
                <p className="text-sm">Setting</p>{' '}
                <Settings className="size-4" />
              </Link>
            
          </div>
        </div>
        <DottedSeparator className="mb-1" />
        <DropdownMenuItem
          onClick={() => {
            setOpen(false);
            logout();
          }}
          className="h-10 flex items-center justify-center text-amber-700 font-medium cursor-pointer"
        >
          <LogOut className="size-4 mr-2" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
