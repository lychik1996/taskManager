import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { updateUserSchema } from '../schemas';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

type updateUserRequest = z.infer<typeof updateUserSchema>;
type updateUserResponse = {
  message: 'Update successed';
};

const updateUser = async (data: updateUserRequest) => {
  const validData = updateUserSchema.parse(data);

  const res = await axios.patch(`/api/protect/current/update`, validData);
  return res.data as updateUserResponse;
};

export const useUpdateUser = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: updateUserRequest) => {
      return await updateUser(data);
    },
    onSuccess: (data) => {
      toast.success('User updated');
      router.refresh();
      queryClient.invalidateQueries({ queryKey: ['current'] });
    },
    onError: () => {
      toast.error('Failed to update user');
    },
  });
};
