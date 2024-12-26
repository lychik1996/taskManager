import axios from "axios";
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { toast } from "sonner";



type DeleteProjectRequest =  {param:string};
type DeleteProjectResponse = {data:{$id:string}}

const deleteProject = async ({param}:DeleteProjectRequest):Promise<DeleteProjectResponse>=>{
   
    const res = await axios.delete(`/api/protect/projects/delete/${param}`);
    return res.data;
}

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  return useMutation<DeleteProjectResponse,Error, DeleteProjectRequest>({
    mutationFn:async(data)=>{
      return await deleteProject(data)
    },
    onSuccess:(data)=>{
      toast.success("Project deleted")
      queryClient.invalidateQueries({queryKey:['projects']})
      queryClient.invalidateQueries({queryKey:["project",data.data.$id]})
    },
    onError:()=>{
      toast.error("Failed to deleted project")
    }
  })
};
