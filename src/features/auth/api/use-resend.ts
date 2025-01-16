import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
const resendToken = async () => {
  const res = await axios.patch('/api/users/verification/resend');
  return res.data;
};

export const useResendToken = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      return await resendToken();
    },
    onSuccess: () => {
      toast.success('Resend token successful');
      queryClient.invalidateQueries({ queryKey: ['time-verification'] });
    },
    onError: () => {
      toast.error('Failed to resend token');
    },
  });
};
