import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { Project } from "../types";

interface UseGetProjectAnalyticsProps {
  projectId: string;
}



  type ProjectAnalitycs = {
  taskCount:number,
  taskDifference:number,
  assigneeTaskCount:number,
  assigneeTaskDifference:number,
  completedTaskCount:number,
  completedTaskDifference:number,
  incomleteTaskCount:number,
  incompleteTaskDifference:number,
  overdueTaskCount:number,
  overdueTaskDifference:number,
}

const getProjectAnalitycs = async ({ projectId }: UseGetProjectAnalyticsProps) => {
  const res = await axios.get(`/api/protect/projects/analytics/get/${projectId}`);
  
  return res.data.data as ProjectAnalitycs;
};

export const useGetProjectAnalitycs = ({ projectId }: UseGetProjectAnalyticsProps) => {
  const query = useQuery({
    queryKey: ["project-analytics", projectId],
    queryFn: async () => {
      if (!projectId) {
        throw new Error("Project ID is required"); 
      }
      const data = await getProjectAnalitycs({ projectId });
      return data;
    },
    retry: 0,
  });
  return query;
};