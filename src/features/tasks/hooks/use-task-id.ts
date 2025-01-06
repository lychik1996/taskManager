import { useParams } from "next/navigation"

export const useTaskId = ()=>{
    const params = useParams();
    if (!params || !params.workspaceId) {
        return "";
      }
    return params.taskId as string;
}