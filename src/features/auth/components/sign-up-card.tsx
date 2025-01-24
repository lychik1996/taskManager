'use client';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { z } from 'zod';
import DottedSeparator from '@/components/dotted-separator';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '../schemas';
import { useRegister } from '../api/use-register';
import { signUpWithGithub, signUpWithGoogle } from '@/lib/oauth';
import { cn } from '@/lib/utils';

export default function SignUpCard() {
  const { mutate, isPending } = useRegister();
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });
  const onSubmit = (values: z.infer<typeof registerSchema>) => {
    mutate(values, {
      onSuccess: (data) => {},
    });
  };
  return (
    <Card className="w-full h-full md:w-[487px] border-none shadow-none">
      <CardHeader className="flex items-center justify-center text-center p-7">
        <CardTitle className="text-2xl ">Sign Up</CardTitle>
        <CardDescription>
          {' '}
          By signing up, you agree to our{' '}
          <Link href="/privacy">
            <span className="text-blue-700">Privacy Policy</span>
          </Link>{' '}
          and{' '}
          <Link href="/terms">
            <span className="text-blue-700">Terms of Service</span>
          </Link>{' '}
        </CardDescription>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      type="text"
                      placeholder="Enter your name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      type="email"
                      placeholder="Enter email adress"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      type="password"
                      placeholder="Enter password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={isPending} size={'lg'} className="w-full">
              Register
            </Button>
          </form>
        </Form>
      </CardContent>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7 flex flex-col gap-y-4">
        <Button
          variant="secondary"
          size={'lg'}
          className="w-full"
          disabled={isPending}
          onClick={() => signUpWithGoogle()}
        >
          <FcGoogle
            className={cn(
              'mr-2 size-5',
              isPending && 'text-muted-foreground opacity-30'
            )}
          />
          Login with Google
        </Button>
        <Button
          variant="secondary"
          size={'lg'}
          className="w-full"
          disabled={isPending}
          onClick={() => signUpWithGithub()}
        >
          <FaGithub className="mr-2 size-5" />
          Login with Githhub
        </Button>
      </CardContent>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7 flex flex-col gap-2 items-center justify-center">
        <p>
          Already have an account?{' '}
          <Link href="/sign-in">
            <span className="text-blue-700">Sign In</span>
          </Link>
        </p>
        <p className="text-xs text-muted-foreground">
          Do you have a question?{'  '}
          <Link
            href="contact-us"
            className="text-blue-400 hover:text-blue-700 text-sm"
          >
            Contac Us
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
