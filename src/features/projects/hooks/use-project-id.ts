import { useParams } from "next/navigation"

export const useProjectId = ()=>{
    const params = useParams();
    if (!params || !params.projectId) {
        return "";
      }
    return params.projectId as string;
}