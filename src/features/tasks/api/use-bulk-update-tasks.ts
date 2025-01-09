import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { toast } from 'sonner';

import { Task, TaskStatus } from '../types';
import { useProjectId } from '@/features/projects/hooks/use-project-id';

type useBulkUpdateTasksRequest = {
  $id: string;
  position: number;
  status: TaskStatus;
}[];
type useBulkUpdateTasksResponse = Task[];

const bulkUpdateTasks = async (
  data: useBulkUpdateTasksRequest
): Promise<useBulkUpdateTasksResponse> => {
  const res = await axios.post('/api/protect/tasks/bulk-update', data);

  return res.data.updatedTasks;
};

export const useBulkUpdateTasks = () => {
  const projectId = useProjectId();
  const queryClient = useQueryClient();
  return useMutation<
    useBulkUpdateTasksResponse,
    Error,
    useBulkUpdateTasksRequest
  >({
    mutationFn: async (data) => {
      return await bulkUpdateTasks(data);
    },
    onSuccess: (data) => {
      toast.success('Tasks updated');
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({
        queryKey: ['project-analytics'],
      });
      queryClient.invalidateQueries({
        queryKey: ['workspace-analytics'],
      });
    },
    onError: () => {
      toast.error('Failed to update tasks');
    },
  });
};
