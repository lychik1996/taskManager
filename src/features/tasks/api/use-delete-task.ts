import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { toast } from 'sonner';

type DeleteTaskRequest = { param: string };
type DeleteTaskResponse = {
  data: { $id: string; projectId: string; workspaceId: string };
};

const deleteTask = async ({
  param,
}: DeleteTaskRequest): Promise<DeleteTaskResponse> => {
  const res = await axios.delete(`/api/protect/tasks/delete/${param}`);
  return res.data;
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation<DeleteTaskResponse, Error, DeleteTaskRequest>({
    mutationFn: async (data) => {
      return await deleteTask(data);
    },
    onSuccess: ({ data }) => {
      toast.success('Task deleted');
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task', data.$id] });
      queryClient.invalidateQueries({
        queryKey: ['project-analytics'],
      });
      queryClient.invalidateQueries({
        queryKey: ['workspace-analytics'],
      });
      queryClient.invalidateQueries({
        queryKey:['task-histories']
      })
    },
    onError: () => {
      toast.error('Failed to deleted task');
    },
  });
};
