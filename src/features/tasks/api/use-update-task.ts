import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { toast } from 'sonner';
import { createTaskSchema } from '../schemas';

import { Task } from '../types';

type UpdateTaskRequest = Partial<z.infer<typeof createTaskSchema>> & {
  param: string;
};

type UpdateTaskResponse = Task;

const updateTask = async (
  data: UpdateTaskRequest
): Promise<UpdateTaskResponse> => {
  const res = await axios.patch(
    `/api/protect/tasks/update/${data.param}`,
    data
  );

  return res.data.task;
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  return useMutation<UpdateTaskResponse, Error, UpdateTaskRequest>({
    mutationFn: async (data) => {
      return await updateTask(data);
    },
    onSuccess: (data) => {
      toast.success('Task updated');
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task', data.$id] });
      queryClient.invalidateQueries({
        queryKey: ['project-analytics'],
      });
      queryClient.invalidateQueries({
        queryKey: ['workspace-analytics'],
      });
    },
    onError: () => {
      toast.error('Failed to update task');
    },
  });
};
