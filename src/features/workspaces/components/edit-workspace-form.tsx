'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { updateWorkspaceShcema } from '../schemas';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DottedSeparator from '@/components/dotted-separator';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Avatar, AvatarFallback } from '@radix-ui/react-avatar';
import { ArrowLeftIcon, CopyIcon, ImageIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Workspace } from '../types';
import { useUpdateWorkSpace } from '../api/use-update-workspace';
import { useConfirm } from '@/hooks/use-confirm';
import { useDeleteWorkSpace } from '../api/use-delete-workspace';
import { toast } from 'sonner';
import { useResetInviteCode } from '../api/use-reset-invite-code';

interface EditWorkSpaceFormProps {
  onCancel?: () => void;
  initialValues: Workspace;
}

export default function EditWorkSpaceForm({
  onCancel,
  initialValues,
}: EditWorkSpaceFormProps) {
  const router = useRouter();
  const { mutate, isPending } = useUpdateWorkSpace();
  const { mutate: deleteWorkspace, isPending: isDeletingWorkspace } =
    useDeleteWorkSpace();
  const { mutate: resetInviteCode, isPending: isResettingInviteCode } =
    useResetInviteCode();

  const [DeleteDialog, confirmDelete] = useConfirm(
    'Delete Workspace',
    'This action cannot be undone.',
    'destructive'
  );
  const [ResetDialog, confirmReset] = useConfirm(
    'Reset invite link',
    'This will invalidate the current invite link.',
    'destructive'
  );

  const inputRef = useRef<HTMLInputElement>(null);
  const form = useForm<z.infer<typeof updateWorkspaceShcema>>({
    resolver: zodResolver(updateWorkspaceShcema),
    defaultValues: {
      ...initialValues,
      image: initialValues.imageUrl ?? '',
    },
  });
  const [fullInviteLink, setFullInviteLink] = useState('');
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setFullInviteLink(
        `${window.location.origin}/workspaces/${initialValues.$id}/join/${initialValues.inviteCode}`
      );
    }
  }, [initialValues.$id, initialValues.inviteCode]);

  const handleDelete = async () => {
    const ok = await confirmDelete();
    if (!ok) return;
    deleteWorkspace(
      { param: initialValues.$id },
      {
        onSuccess: ({ data }) => {
          console.log(data);
          router.push('/');
        },
      }
    );
  };

  const onSubmit = (values: z.infer<typeof updateWorkspaceShcema>) => {
    const finalValue = {
      data: {
        ...values,
        image: values.image instanceof File ? values.image : '',
      },
      param: initialValues.$id,
    };

    mutate(finalValue, {
      onSuccess: (data) => {
        // form.reset();
        // router.push(`/workspaces/${data?.$id}`);
      },
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue('image', file);
    }
  };

  const handleCopyInviteLink = () => {
    if (!fullInviteLink) {
      toast.error('Invite link is not available yet');
      return;
    }
    navigator.clipboard
      .writeText(fullInviteLink)
      .then(() => toast.success('Invite link copied to clipboard'));
  };
  const handleResetInviteCode = async () => {
    const ok = await confirmReset();
    if (!ok) return;
    resetInviteCode(
      { param: initialValues.$id },
      {
        onSuccess: () => {},
      }
    );
  };
  return (
    <div className="flex flex-col gap-y-4">
      <DeleteDialog />
      <ResetDialog />
      <Card className="w-full h-full border-node shadow-none">
        <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
          <Button
            size="sm"
            variant="secondary"
            onClick={
              onCancel
                ? onCancel
                : () => router.push(`/workspaces/${initialValues.$id}`)
            }
          >
            <ArrowLeftIcon className="size-4 mr-2" />
            Back
          </Button>
          <CardTitle className="text-xl font-bold">
            {initialValues.name}
          </CardTitle>
        </CardHeader>
        <div className="px-7">
          <DottedSeparator />
        </div>
        <CardContent className="p-7">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className=" flex flex-col gap-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Workspace Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          placeholder="Enter workspace name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <div className="flex flex-col gap-y-2">
                      <div className="flex items-center gap-x-5">
                        {field.value ? (
                          <div className="size-[72px] relative rounded-md overflow-hidden">
                            <Image
                              alt="Logo"
                              fill
                              className="object-cover"
                              src={
                                field.value instanceof File
                                  ? URL.createObjectURL(field.value)
                                  : field.value
                              }
                            />
                          </div>
                        ) : (
                          <Avatar className="size-[72px] flex items-center justify-center">
                            <AvatarFallback>
                              <ImageIcon className="size-[36px] text-neutral-400" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className="flex flex-col">
                          <p className="text-sm">Workspace Icon</p>
                          <p className="text-sm text-muted-foreground">
                            JPG, PNG,SVG or JPEG, max 1MB
                          </p>
                          <input
                            className="hidden"
                            type="file"
                            accept=".jpg, .png, .svg, .jpeg"
                            ref={inputRef}
                            onChange={handleImageChange}
                            disabled={isPending}
                          />
                          {field.value ? (
                            <Button
                              type="button"
                              disabled={isPending}
                              variant="destructive"
                              size="xs"
                              className="w-fit mt-2"
                              onClick={() => {
                                field.onChange('');
                                if (inputRef.current) {
                                  inputRef.current.value = '';
                                }
                              }}
                            >
                              Remove Image
                            </Button>
                          ) : (
                            <Button
                              type="button"
                              disabled={isPending}
                              variant="teritrary"
                              size="xs"
                              className="w-fit mt-2"
                              onClick={() => inputRef.current?.click()}
                            >
                              Upload Image
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                />
              </div>
              <DottedSeparator className="py-7" />
              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  size="lg"
                  variant="secondary"
                  onClick={onCancel}
                  disabled={isPending}
                  className={cn(!onCancel && 'invisible')}
                >
                  Cancel
                </Button>
                <Button type="submit" size="lg" disabled={isPending}>
                  Save Changes
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card className="w-full h-full border-node shadow-none">
        <CardContent className="p-7">
          <div className="flex flex-col">
            <h3 className="font-bold">Invite members</h3>
            <p className="text-sm text-muted-foreground">
              Use the invite link to add members to your workspace.
            </p>
            <div className="mt-4">
              <div className="flex items-center gap-x-2">
                <Input disabled value={fullInviteLink} />
                <Button
                  onClick={handleCopyInviteLink}
                  variant="secondary"
                  className="size-12"
                >
                  <CopyIcon className="size-5" />
                </Button>
              </div>
            </div>
            <DottedSeparator className="py-7" />
            <Button
              className="mt-6 w-fit ml-auto"
              size="sm"
              variant="destructive"
              type="button"
              disabled={isPending || isResettingInviteCode}
              onClick={handleResetInviteCode}
            >
              Reset invite link
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card className="w-full h-full border-node shadow-none">
        <CardContent className="p-7">
          <div className="flex flex-col">
            <h3 className="font-bold">Danger zone</h3>
            <p className="text-sm text-muted-foreground">
              Deleting a workspace is irreversible and will remove all
              associated data.
            </p>
            <DottedSeparator className="py-7" />
            <Button
              className="mt-6 w-fit ml-auto"
              size="sm"
              variant="destructive"
              type="button"
              disabled={isPending || isDeletingWorkspace}
              onClick={handleDelete}
            >
              Delete a Workspace
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
