'use client';
import DottedSeparator from '@/components/dotted-separator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeftIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateUserSchema, validPasswordSchema } from '../schemas';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Models } from 'node-appwrite';
import { useConfirm } from '@/hooks/use-confirm';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

import OldPassword from './old-password';
import { useUpdateUser } from '../api/use-update-user';
import { useDeleteUser } from '../api/use-delete-user';

interface EditUserFormProps {
  user: Models.User<Models.Preferences>;
}

export default function EditUserForm({ user }: EditUserFormProps) {
  const userPassword = !!user.passwordUpdate;
  const router = useRouter();
  const [DeleteUser, confirmDelete] = useConfirm(
    'Delete User',
    'This action cannot be undone.',
    'destructive'
  );
  const { mutate, isPending } = useUpdateUser();
  const { mutate: onDeleteUser, isPending: isDeleteUserPending } =
    useDeleteUser();
  const form = useForm<z.infer<typeof updateUserSchema>>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: user.name || '',
      newPassword: '',
    },
  });
  const [isPasswordValidForm, setIsPasswordValidForm] = useState(false);
  const [resetOldPassword, setResetOldPassword] = useState<() => void>(
    () => () => {}
  );
  const [isPasswordValidDelete, setIsPasswordValidDelete] = useState(false);
  const onSubmit = (values: z.infer<typeof updateUserSchema>) => {
    mutate(values, {
      onSuccess: () => {
        form.reset();
        resetOldPassword();
      },
    });
  };
  const handleDeleteUser = async () => {
    const ok = await confirmDelete();
    if (!ok) return null;
    onDeleteUser();
  };
  return (
    <div className="flex flex-col gap-y-4">
      <DeleteUser />
      <Card className="w-full h-full border-node shadow-none">
        <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
          <Button size="sm" variant="secondary" onClick={() => router.back()}>
            <ArrowLeftIcon className="size-4 mr-2" />
            Back
          </Button>
          <CardTitle className="text-xl font-bold">{user.name}</CardTitle>
        </CardHeader>
        <DottedSeparator className="px-7" />
        <CardContent className="p-7">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className=" flex flex-col gap-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Edit Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          placeholder="Enter new user name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <OldPassword
                  setPasswordValid={setIsPasswordValidForm}
                  isOldPassword={!!user.passwordUpdate}
                  isPending={isPending}
                  setResetHandler={setResetOldPassword}
                />
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter new password"
                          type="password"
                          disabled={
                            isPending || (userPassword && !isPasswordValidForm)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DottedSeparator className="py-7" />
              <div className="flex items-center justify-end">
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
            <h3 className="font-bold">Danger zone</h3>
            <p className="text-sm text-muted-foreground">
              Deleting a user is irreversible and will remove all associated
              data.
            </p>
            <DottedSeparator className="py-7" />
            <OldPassword
              setPasswordValid={setIsPasswordValidDelete}
              isOldPassword={!!user.passwordUpdate}
              isPending={isDeleteUserPending}
            />
            <Button
              className="mt-6 w-fit ml-auto"
              size="sm"
              variant="destructive"
              type="button"
              disabled={
                isDeleteUserPending || (userPassword && !isPasswordValidDelete)
              }
              onClick={handleDeleteUser}
            >
              Delete User
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
