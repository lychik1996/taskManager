import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const deleteUser = async () => {
  const res = await axios.delete('/api/protect/current/delete');
  return res.data;
};

export const useDeleteUser = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      return await deleteUser();
    },
    onSuccess: () => {
      toast.success('User deleted');
      queryClient.invalidateQueries({ queryKey: ['current'] });
      router.push('/sign-in');
    },
    onError: () => {
      toast.error('Failed to deleted user');
    },
  });
};
