import axios from "axios";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { toast } from "sonner";
import { createProjectShcema } from "../schemas";
import { Models } from "node-appwrite";



type CreateProjectRequest = z.infer<typeof createProjectShcema>;
type CreateProjectResponse = Models.Document

const postCreateProject = async (data:CreateProjectRequest):Promise<CreateProjectResponse>=>{
    const validData = createProjectShcema.parse(data);
    
    const formData = new FormData();
    formData.append("name",validData.name);
    formData.append("workspaceId",validData.workspaceId);
    if(validData.image instanceof File){
      formData.append("image",validData.image);
    }
    const res = await axios.post('/api/protect/projects/create', formData);
    return res.data;
}

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation<CreateProjectResponse,Error, CreateProjectRequest>({
    mutationFn:async(data)=>{
      return await postCreateProject(data)
    },
    onSuccess:()=>{
      toast.success("Project created")
      queryClient.invalidateQueries({queryKey:['projects']})
    },
    onError:()=>{
      toast.error("Failed to create project")
    }
  })
};
