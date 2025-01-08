import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { toast } from 'sonner';

type DeleteWorkSpaceRequest = { param: string };
type DeleteWorkSpaceResponse = { data: { $id: string } };

const deleteWorkSpace = async ({
  param,
}: DeleteWorkSpaceRequest): Promise<DeleteWorkSpaceResponse> => {
  const res = await axios.delete(`/api/protect/workspaces/delete/${param}`);
  return res.data;
};

export const useDeleteWorkSpace = () => {
  const queryClient = useQueryClient();
  return useMutation<DeleteWorkSpaceResponse, Error, DeleteWorkSpaceRequest>({
    mutationFn: async (data) => {
      return await deleteWorkSpace(data);
    },
    onSuccess: ({ data }) => {
      toast.success('Workspace deleted');
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      queryClient.invalidateQueries({ queryKey: ['workspace', data.$id] });
    },
    onError: () => {
      toast.error('Failed to deleted workspace');
    },
  });
};
