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

const useBulkUpdateTasks = async (
  data: useBulkUpdateTasksRequest,
  
): Promise<useBulkUpdateTasksResponse> => {
  const res = await axios.post('/api/protect/tasks/bulk-update', data);
  
  return res.data.updatedTasks;
};

export const useuseBulkUpdateTasks = () => {
  
  const queryClient = useQueryClient();
  return useMutation<useBulkUpdateTasksResponse, Error, useBulkUpdateTasksRequest>({
    mutationFn: async (data) => {
      return await useBulkUpdateTasks(data);
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
