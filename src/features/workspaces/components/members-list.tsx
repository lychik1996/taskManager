'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useWorkspaceId } from '../hooks/use-workspace-id';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon, MoreVerticalIcon } from 'lucide-react';
import Link from 'next/link';
import DottedSeparator from '@/components/dotted-separator';
import { useGetMembers } from '@/features/members/api/use-get-members';
import { Fragment } from 'react';
import MemberAvatar from '@/features/members/components/member-avatar';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDeleteMember } from '@/features/members/api/use-delete-member';
import { useUpdateMember } from '@/features/members/api/use-update-member';
import { MemberRole } from '@/features/members/types';
import { useConfirm } from '@/hooks/use-confirm';
import { Models } from 'node-appwrite';

interface MemberListProps {
  user?: Models.User<Models.Preferences>;
}
export default function MembersList({ user }: MemberListProps) {
  const workspaceId = useWorkspaceId();

  const [ConfirmDialog, confirm] = useConfirm(
    'Remove member',
    'this member will be removed from the workspace',
    'destructive'
  );
  const { data } = useGetMembers({ workspaceId });
  const isAdmin = data?.documents.some((member) => {
    return member.userId === user?.$id && member.role === MemberRole.ADMIN;
  });

  const { mutate: deleteMember, isPending: isDeletingMember } =
    useDeleteMember();
  const { mutate: updateMember, isPending: isUpdatingMember } =
    useUpdateMember();

  const handleUpdateMember = async (memberId: string, role: MemberRole) => {
    updateMember({
      param: memberId,
      role,
    });
  };
  const handleDeleteMember = async (memberId: string) => {
    const ok = await confirm();
    if (!ok) return;

    deleteMember(
      { param: memberId },
      {
        onSuccess: () => {
          window.location.reload();
        },
      }
    );
  };
  return (
    <Card className="w-full h-full border-none shadow-none">
      <ConfirmDialog />
      <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
        <Button asChild variant="secondary" size="sm">
          <Link href={`/workspaces/${workspaceId}`}>
            <ArrowLeftIcon className="size-4 mr-2" />
            Back
          </Link>
        </Button>
        <CardTitle className="text-xl font-bold">Members list</CardTitle>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        {data?.documents.map((member, index) => {
          const isCurrentUser = member.userId === user?.$id;
          return (
            <Fragment key={member.$id}>
              <div className="flex items-center gap-2">
                <MemberAvatar
                  name={member.name}
                  className="size-14"
                  fallbackClassName="text-lg"
                />
                <div className="flex flex-col">
                  <p className="text-sm font-medium">{member.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {member.email}
                  </p>
                  <p className="text-xs text-muted-foreground">{member.role}</p>
                </div>
                {isAdmin ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        className="ml-auto focus-visible:ring-0 "
                        variant="secondary"
                        size="icon"
                        autoFocus={false}
                      >
                        <MoreVerticalIcon className="size-4 text-muted-foreground" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="bottom" align="end">
                      <DropdownMenuItem
                        className="font-medium cursor-pointer"
                        onClick={() =>
                          handleUpdateMember(member.$id, MemberRole.ADMIN)
                        }
                        disabled={isUpdatingMember}
                      >
                        Set as administrator
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="font-medium cursor-pointer"
                        onClick={() =>
                          handleUpdateMember(member.$id, MemberRole.MEMBER)
                        }
                        disabled={isUpdatingMember}
                      >
                        Set as Member
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        className="font-medium cursor-pointer text-amber-700 focus:text-amber-700"
                        onClick={() => handleDeleteMember(member.$id)}
                        disabled={isDeletingMember}
                      >
                        Remove {member.name}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  isCurrentUser && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          className="ml-auto focus-visible:ring-0 "
                          variant="secondary"
                          size="icon"
                          autoFocus={false}
                        >
                          <MoreVerticalIcon className="size-4 text-muted-foreground" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="bottom" align="end">
                        <DropdownMenuItem
                          className="font-medium cursor-pointer text-amber-700 focus:text-amber-700"
                          onClick={() => handleDeleteMember(member.$id)}
                          disabled={isDeletingMember}
                        >
                          Remove {member.name}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )
                )}
              </div>
              {index < data.documents.length - 1 && (
                <Separator className="my-2.5" />
              )}
            </Fragment>
          );
        })}
      </CardContent>
    </Card>
  );
}
