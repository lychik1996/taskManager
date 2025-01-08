import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface UseGetWorkspaceAnalyticsProps {
  workspaceId: string;
}

type WorkspaceAnalitycs = {
  taskCount: number;
  taskDifference: number;
  assigneeTaskCount: number;
  assigneeTaskDifference: number;
  completedTaskCount: number;
  completedTaskDifference: number;
  incomleteTaskCount: number;
  incompleteTaskDifference: number;
  overdueTaskCount: number;
  overdueTaskDifference: number;
};

const getWorkspaceAnalitycs = async ({
  workspaceId,
}: UseGetWorkspaceAnalyticsProps) => {
  const res = await axios.get(
    `/api/protect/workspaces/analytics/get/${workspaceId}`
  );

  return res.data.data as WorkspaceAnalitycs;
};

export const useGetWorkspaceAnalitycs = ({
  workspaceId,
}: UseGetWorkspaceAnalyticsProps) => {
  const query = useQuery({
    queryKey: ['workspace-analytics', workspaceId],
    queryFn: async () => {
      if (!workspaceId) {
        throw new Error('Workspace ID is required');
      }
      const data = await getWorkspaceAnalitycs({ workspaceId });
      return data;
    },
    retry: 0,
  });
  return query;
};
