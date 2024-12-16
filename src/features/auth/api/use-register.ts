import { z } from 'zod';
import { registerSchema } from '../schemas';
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Models } from 'node-appwrite';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

type SignUpRequest = z.infer<typeof registerSchema>;
type SignUpResponse = { data: Models.User<{}> };

const postRegister = async (data: SignUpRequest) => {
  const validData = registerSchema.parse(data);
  const res = await axios.post('/api/users/sign-up', validData);
  return res.data;
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation<SignUpResponse, Error, SignUpRequest>({
    mutationFn: async (data: SignUpRequest) => {
      return await postRegister(data);
    },
    onSuccess: () => {
      toast.success('Registered');
      router.refresh();
      queryClient.invalidateQueries({ queryKey: ['current'] });
    },

    onError: () => {
      toast.error('Failed to register');
    },
  });
};
