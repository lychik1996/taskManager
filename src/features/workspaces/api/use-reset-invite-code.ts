import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { toast } from 'sonner';
import { Models } from 'node-appwrite';

type ResetInviteCodeRequest = { param: string };
type ResetInviteCodeResponse = { workspace: Models.Document };

const resetInviteCodeSpace = async ({
  param,
}: ResetInviteCodeRequest): Promise<ResetInviteCodeResponse> => {
  const res = await axios.post(
    `/api/protect/workspaces/reset-invite-code/${param}`
  );

  return res.data;
};

export const useResetInviteCode = () => {
  const queryClient = useQueryClient();
  return useMutation<ResetInviteCodeResponse, Error, ResetInviteCodeRequest>({
    mutationFn: async (data: ResetInviteCodeRequest) => {
      return await resetInviteCodeSpace(data);
    },
    onSuccess: (data) => {
      toast.success('Ivnite code reset');
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      queryClient.invalidateQueries({
        queryKey: ['workspace', data.workspace.$id],
      });
    },
    onError: () => {
      toast.error('Failed to reset invite code');
    },
  });
};
