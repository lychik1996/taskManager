import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { toast } from 'sonner';
import { createTaskSchema } from '../schemas';
import { Models } from 'node-appwrite';
import { useRouter } from 'next/navigation';
import { Task, TaskStatus } from '../types';

type useBulkUpdateTasksRequest = {$id:string;position:number; status:TaskStatus}[];
type useBulkUpdateTasksResponse = Task[]

const bulkUpdateTasks = async (
  data: useBulkUpdateTasksRequest,
  
): Promise<useBulkUpdateTasksResponse> => {
  const res = await axios.post('/api/protect/tasks/bulk-update', data);
  
  return res.data.updatedTasks;
};

export const useBulkUpdateTasks = () => {
  
  const queryClient = useQueryClient();
  return useMutation<useBulkUpdateTasksResponse, Error, useBulkUpdateTasksRequest>({
    mutationFn: async (data) => {
      return await bulkUpdateTasks(data);
    },
    onSuccess: () => {
      toast.success('Tasks updated');
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: () => {
      toast.error('Failed to update tasks');
    },
  });
};
