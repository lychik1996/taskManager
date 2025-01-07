import { useParams } from "next/navigation"

export const useTaskId = ()=>{
    const params = useParams();
    if (!params || !params.taskId) {
        return "";
      }
    return params.taskId as string;
}