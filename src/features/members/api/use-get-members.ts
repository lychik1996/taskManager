import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { Member } from '../types';

interface UseGetMembersProps {
  workspaceId: string;
}

type MembersResponse = {
  total: number;
  documents: Member[];
};

const getMembers = async ({ workspaceId }: UseGetMembersProps) => {
  const res = await axios.get(`/api/protect/members/get/${workspaceId}`);
  return res.data as MembersResponse;
};

export const useGetMembers = ({ workspaceId }: UseGetMembersProps) => {
  const query = useQuery({
    queryKey: ['members', workspaceId],
    queryFn: async () => {
      if (!workspaceId) {
        throw new Error('Workspace ID is required');
      }
      const members = await getMembers({ workspaceId });
      return members;
    },
    retry: 0,
  });
  return query;
};
