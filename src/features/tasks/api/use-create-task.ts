import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { toast } from 'sonner';
import { createTaskSchema } from '../schemas';
import { Models } from 'node-appwrite';

type CreateTaskRequest = z.infer<typeof createTaskSchema>;
type CreateTaskResponse = Models.Document & {
  name: string;
  imageUrl: string | undefined;
  workspaceId: string;
};

const postCreateTask = async (
  data: CreateTaskRequest
): Promise<CreateTaskResponse> => {
  const validData = createTaskSchema.parse(data);

  const res = await axios.post('/api/protect/tasks/create', validData);
  return res.data.task;
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation<CreateTaskResponse, Error, CreateTaskRequest>({
    mutationFn: async (data) => {
      return await postCreateTask(data);
    },
    onSuccess: () => {
      toast.success('Task created');
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: () => {
      toast.error('Failed to create task');
    },
  });
};
