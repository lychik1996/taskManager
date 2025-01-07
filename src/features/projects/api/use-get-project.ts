import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Models } from "node-appwrite";
import { Project } from "../types";

interface UseGetProjectProps {
  projectId: string;
}



type ProjectResponse = Project

const getProject = async ({ projectId }: UseGetProjectProps) => {
  const res = await axios.get(`/api/protect/projects/getOne/${projectId}`);
  
  return res.data.project as ProjectResponse;
};

export const useGetProject = ({ projectId }: UseGetProjectProps) => {
  const query = useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      if (!projectId) {
        throw new Error("Project ID is required"); 
      }
      const data = await getProject({ projectId });
      return data;
    },
    retry: 0,
  });
  return query;
};