import { useQuery } from "@tanstack/react-query"
import axios from "axios";
interface Workspace {
    $id: string;
    name: string;
    userId: string;
    imageUrl: string | null; 
    $createdAt: string;
  }
  
  // Тип для відповіді API (містить масив робочих просторів)
  interface WorkspacesResponse {
    documents: Workspace[];
    total:number;
  }
const getWorkspaces= async()=>{
    const res = await axios.get('/api/protect/workspaces/get');
    return res.data;
}

export const useGetWorkspaces = ()=>{
    const query =useQuery({
        queryKey:['workspaces'],
        queryFn:async()=>{
            const data = await getWorkspaces();
            const workspaces:WorkspacesResponse | null | undefined = data?data.workspaces:null
            return workspaces;
        },
        retry:0
    })
    return query;
}