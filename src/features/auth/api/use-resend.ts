import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
const resendToken = async () => {
  const res = await axios.patch('/api/users/verification/resend');
  return res.data;
};

export const useResendToken = () => {
  return useMutation({
    mutationFn: async () => {
      return await resendToken();
    },
    onSuccess: () => {
      toast.success('Resend token successful');
    },
    onError: () => {
      toast.error('Failed to resend token');
    },
  });
};
