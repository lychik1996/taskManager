import axios from "axios";
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { toast } from "sonner";
import { Models } from "node-appwrite";



type JoinWorkspaceRequest =  {param:string, code:string};
type JoinWorkspaceResponse = {workspace: Models.Document}

const joinWorkspcae = async ({param, code}:JoinWorkspaceRequest ):Promise<JoinWorkspaceResponse>=>{
 
    const res = await axios.post(`/api/protect/workspaces/join/${param}`, {code});
   
    return res.data;
}

export const useJoinWorkspace = () => {
  const queryClient = useQueryClient();
  return useMutation<JoinWorkspaceResponse,Error, JoinWorkspaceRequest >({
    mutationFn:async(data)=>{
      return await joinWorkspcae(data)
    },
    onSuccess:(data)=>{
      toast.success("Joined workspace")
      queryClient.invalidateQueries({queryKey:['workspaces']})
      queryClient.invalidateQueries({queryKey:["workspace",data.workspace.$id]})
    },
    onError:()=>{
      toast.error("Failed to join workspace")
    }
  })
};
