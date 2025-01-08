import { useParams } from 'next/navigation';

export const useWorkspaceId = () => {
  const params = useParams();

  if (!params || !params.workspaceId) {
    return '';
  }
  return params.workspaceId as string;
};
