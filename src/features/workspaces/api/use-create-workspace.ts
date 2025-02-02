import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { createWorkspaceShcema } from '../schemas';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

type CreateWorkSpaceRequest = z.infer<typeof createWorkspaceShcema>;
type CreateWorkSpaceResponse = { data: { $id: string } };

const postCreateWorkSpace = async (
  data: CreateWorkSpaceRequest
): Promise<CreateWorkSpaceResponse> => {
  const validData = createWorkspaceShcema.parse(data);

  const formData = new FormData();
  formData.append('name', validData.name);
  if (validData.image instanceof File) {
    formData.append('image', validData.image);
  }
  const res = await axios.post('/api/protect/workspaces/create', formData);
  return res.data;
};

export const useCreateWorkSpace = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation<CreateWorkSpaceResponse, Error, CreateWorkSpaceRequest>({
    mutationFn: async (data: CreateWorkSpaceRequest) => {
      return await postCreateWorkSpace(data);
    },
    onSuccess: () => {
      toast.success('Workspace created');
      router.refresh();
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
    },
    onError: () => {
      toast.error('Failed to create workspace');
    },
  });
};
