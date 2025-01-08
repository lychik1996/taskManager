import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Workspace } from '../types';

interface WorkspaceRequest {
  workspaceId: string;
}

const getWorkspace = async ({ workspaceId }: WorkspaceRequest) => {
  const res = await axios.get(`/api/protect/workspaces/getOne/${workspaceId}`);
  return res.data.workspace as Workspace;
};

export const useGetWorkspace = ({ workspaceId }: WorkspaceRequest) => {
  const query = useQuery({
    queryKey: ['workspace', workspaceId],
    queryFn: async () => {
      if (!workspaceId) {
        throw new Error('Workspace ID is required');
      }
      return await getWorkspace({ workspaceId });
    },
    retry: 0,
  });
  return query;
};
