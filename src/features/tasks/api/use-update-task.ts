import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { toast } from 'sonner';
import { createTaskSchema } from '../schemas';
import { Models } from 'node-appwrite';


type UpdateTaskRequest = Partial<z.infer<typeof createTaskSchema>>&{param:string};
type UpdateTaskResponse = Models.Document & {
  name: string;
  imageUrl: string | undefined;
  workspaceId: string;
  description?: string | null ;
};

const updateTask = async (
  data: UpdateTaskRequest,
  
): Promise<UpdateTaskResponse> => {
  const res = await axios.patch(`/api/protect/tasks/update/${data.param}`, data);
  
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
      queryClient.invalidateQueries({ queryKey: ['task',data.$id] });
    },
    onError: () => {
      toast.error('Failed to update task');
    },
  });
};
