import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

type checkVerificationRequest= { token:string} ;

const checkVerification = async ({token}:checkVerificationRequest) => {
  const res = await axios.get(`/api/users/verification/get/${token}`);
  return res.data;
};

export const useVerification = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data:checkVerificationRequest) => {
      return await checkVerification(data);
    },
    onSuccess: () => {
      toast.success("Verification successful");
      router.push('/');
      queryClient.invalidateQueries({ queryKey: ['current'] });
    },
    onError: () => {
      toast.error('Failed to verification');
    },
  });
};
