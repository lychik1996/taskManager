import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Models } from 'node-appwrite';
import { Project } from '../types';

interface UseGetProjectsProps {
  workspaceId: string;
}

type ProjectsResponse = Models.DocumentList<Project>;

const getProjects = async ({ workspaceId }: UseGetProjectsProps) => {
  const res = await axios.get(`/api/protect/projects/get/${workspaceId}`);
  return res.data.projects as ProjectsResponse;
};

export const useGetProjects = ({ workspaceId }: UseGetProjectsProps) => {
  const query = useQuery({
    queryKey: ['projects', workspaceId],
    queryFn: async () => {
      if (!workspaceId) {
        throw new Error('Workspace ID is required');
      }
      const data = await getProjects({ workspaceId });
      return data;
    },
    retry: 0,
  });
  return query;
};
