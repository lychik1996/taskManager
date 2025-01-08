import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { loginSchema } from '../schemas';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

type LoginRequest = z.infer<typeof loginSchema>;
type LoginResponse = { success: boolean } | { message: string };

const postLogin = async (data: LoginRequest): Promise<LoginResponse> => {
  const validData = loginSchema.parse(data);
  const res = await axios.post('/api/users/sign-in', validData);
  return res.data;
};

export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: async (data: LoginRequest) => {
      return await postLogin(data);
    },
    onSuccess: () => {
      toast.success('Logged in');
      router.refresh();
      queryClient.invalidateQueries({ queryKey: ['current'] });
    },
    onError: () => {
      toast.error('Failed to log in');
    },
  });
};
