import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Models } from "node-appwrite";

interface UseGetMembersProps {
  workspaceId: string;
}

interface PopulatedMember {
  name: string;
  email: string;
  $id: string;
  $collectionId: string;
  $databaseId: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
}

type MembersResponse = Omit<Models.DocumentList<Models.Document>, "documents"> & {
  documents: PopulatedMember[];
};

const getMembers = async ({ workspaceId }: UseGetMembersProps) => {
  const res = await axios.get(`/api/protect/members/get/${workspaceId}`);
  return res.data as MembersResponse;
};

export const useGetMembers = ({ workspaceId }: UseGetMembersProps) => {
  const query = useQuery({
    queryKey: ["members", workspaceId],
    queryFn: async () => {
      if (!workspaceId) {
        throw new Error("Workspace ID is required"); 
      }
      const members = await getMembers({ workspaceId });
      return members; 
    },
    retry: 0,
  });
  return query;
};