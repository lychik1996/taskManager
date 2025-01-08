import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const postLogout = async () => {
  const res = await axios.post('/api/protect/logout');
  return res.data;
};

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      return await postLogout();
    },
    onSuccess: () => {
      toast.success('Logged out');
      router.refresh();
      queryClient.invalidateQueries({ queryKey: ['current'] });
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
    },
    onError: () => {
      toast.error('Failed to log out');
    },
  });
};
