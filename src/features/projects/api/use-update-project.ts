import axios from "axios";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { toast } from "sonner";
import { updateProjectShcema } from "../schemas";
import { Models } from "node-appwrite";
import { useRouter } from "next/navigation";



type UpdateProjectRequest = {data:z.infer<typeof updateProjectShcema>,param:string};
type UpdateProjectResponse = Models.Document&{name:string,imageUrl:string|undefined}

const postUpdateProject = async (data:UpdateProjectRequest):Promise<UpdateProjectResponse>=>{
   
  const validData = updateProjectShcema.parse(data.data);
    
    const formData = new FormData();
    if(validData.name){
      
      formData.append("name",validData.name);
    }
    // formData.append("workspaceId",validData.workspaceId);
    if(validData.image instanceof File){
      formData.append("image",validData.image);
    }
    const res = await axios.patch(`/api/protect/projects/update/${data.param}`, formData);
    return res.data;
}

export const useUpdateProject = () => {
  
  const queryClient = useQueryClient();
  return useMutation<UpdateProjectResponse,Error, UpdateProjectRequest>({
    mutationFn:async(data)=>{
      return await postUpdateProject(data);
    },
    onSuccess:(data)=>{
      toast.success("Project updated");
      queryClient.invalidateQueries({queryKey:['projects']});
      queryClient.invalidateQueries({queryKey:['project',data.$id]})
    },
    onError:()=>{
      toast.error("Failed to update project")
    }
  })
};
