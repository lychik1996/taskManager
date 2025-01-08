import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { toast } from 'sonner';

type DeleteMemberRequest = { param: string };
type DeleteMemberResponse = { data: { $id: string } };

const deleteMember = async ({
  param,
}: DeleteMemberRequest): Promise<DeleteMemberResponse> => {
  const res = await axios.delete(`/api/protect/members/delete/${param}`);
  return res.data;
};

export const useDeleteMember = () => {
  const queryClient = useQueryClient();
  return useMutation<DeleteMemberResponse, Error, DeleteMemberRequest>({
    mutationFn: async (data) => {
      return await deleteMember(data);
    },
    onSuccess: () => {
      toast.success('Member deleted');
      queryClient.invalidateQueries({ queryKey: ['members'] });
    },
    onError: () => {
      toast.error('Failed to deleted Member');
    },
  });
};
