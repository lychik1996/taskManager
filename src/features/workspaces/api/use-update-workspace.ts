import axios from "axios";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import {updateWorkspaceShcema} from '../schemas';
import { toast } from "sonner";



type updateWorkSpaceRequest = {
  data:z.infer<typeof updateWorkspaceShcema>;
  param:string;
};
type updateWorkSpaceResponse = {
  $id:string,
}&Required<z.infer<typeof updateWorkspaceShcema>>

const updateWorkSpace = async ({data,param}:updateWorkSpaceRequest):Promise<updateWorkSpaceResponse>=>{
    const validData = updateWorkspaceShcema.parse(data);
    
    const formData = new FormData();
    if(validData.name)formData.append("name",validData.name);
    if(validData.image instanceof File){
      formData.append("image",validData.image);
    }
    
    const res = await axios.patch(`/api/protect/workspaces/update/${param}`, formData);
    return res.data;
}

export const useUpdateWorkSpace = () => {
  const queryClient = useQueryClient();
  return useMutation<updateWorkSpaceResponse,Error, updateWorkSpaceRequest>({
    mutationFn:async(reqData)=>{
      return await updateWorkSpace(reqData)
    },
    onSuccess:(data)=>{
      toast.success("Workspace updated")
      queryClient.invalidateQueries({queryKey:['workspaces']})
      queryClient.invalidateQueries({queryKey:['workspace',data.$id]})
    },
    onError:()=>{
      toast.error("Failed to update workspace")
    }
  })
};
