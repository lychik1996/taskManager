'use client';
import DottedSeparator from '@/components/dotted-separator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeftIcon, Pencil, PencilOff } from 'lucide-react';
import { Models } from 'node-appwrite';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { contactUsSchema } from '../schemas';
import { useRouter } from 'next/navigation';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { useContactUs } from '../api/use-contact-us';
import { toast } from 'sonner';

interface ContactUsFormProps {
  user?: Models.User<Models.Preferences> | null;
}
export default function ContactUsForm({ user }: ContactUsFormProps) {
  const router = useRouter();
  const [editEmail, setEditEmail] = useState(!!user ? false : true);
  const { mutate, isPending } = useContactUs();
  const form = useForm<z.infer<typeof contactUsSchema>>({
    resolver: zodResolver(contactUsSchema),
    defaultValues: {
      email: user?.email || '',
      description: '',
    },
  });

  const onSubmit = (values: z.infer<typeof contactUsSchema>) => {
    mutate(values, {
      onSuccess: () => {
        form.reset();
      },
    });
  };

  return (
    <div className="flex flex-col gap-y-4">
      <Card className="w-full h-full border-node shadow-none">
        <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
          <Button size="sm" variant="secondary" onClick={() => router.back()}>
            <ArrowLeftIcon className="size-4 mr-2" />
            Back
          </Button>
          <CardTitle className="text-xl font-bold">Contact us</CardTitle>
        </CardHeader>
        <DottedSeparator className="px-7" />
        <CardContent className="p-7">
          <p className="text-muted-foreground mb-2">
            You can ask any question that interests you!
          </p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className=" flex flex-col gap-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <div className="flex flex-row items-center gap-2">
                        <FormControl>
                          <Input
                            {...field}
                            disabled={!editEmail || isPending}
                            placeholder="Enter email adress"
                          />
                        </FormControl>
                        {user && (
                          <Button
                            variant="outline"
                            disabled={isPending}
                            type="button"
                            className="text-muted-foreground shadow-none border-none"
                            onClick={() => setEditEmail((prev) => !prev)}
                          >
                            {editEmail ? (
                              <>
                                <p>Cancel</p>
                                <PencilOff />
                              </>
                            ) : (
                              <>
                                <p>Edit</p>
                                <Pencil />
                              </>
                            )}
                          </Button>
                        )}
                      </div>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Add your question..."
                          rows={5}
                          {...field}
                          disabled={isPending}
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
                  Send Question
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
