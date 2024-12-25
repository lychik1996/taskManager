import axios from "axios";
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { toast } from "sonner";



type UpdateMemberRequest =  {param:string,role:string};
type UpdateMemberResponse = {data:{$id:string}}

const updateMember = async ({param,role}:UpdateMemberRequest):Promise<UpdateMemberResponse>=>{
   
    const res = await axios.patch(`/api/protect/members/update/${param}`,{role});
    return res.data;
}

export const useUpdateMember = () => {
  const queryClient = useQueryClient();
  return useMutation<UpdateMemberResponse,Error, UpdateMemberRequest>({
    mutationFn:async(data)=>{
      return await updateMember(data)
    },
    onSuccess:()=>{
      toast.success("Member updated")
      queryClient.invalidateQueries({queryKey:['members']})
      
    },
    onError:()=>{
      toast.error("Failed to updated member")
    }
  })
};
