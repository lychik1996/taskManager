import { useQuery } from '@tanstack/react-query';
import axios from 'axios';


import { TaskStatus } from '../types';



type TaskDocument = {
  workspaceId: string;
  name: string;
  projectId: string;
  assigneeId: string;
  description: string | null;
  dueDate: string;
  status: TaskStatus;
  position: number;
  $id: string;
  $collectionId: string;
  $databaseId: string;
  $permissions: string[];
  $createdAt: string;
  $updatedAt: string;
  assignee: {
    userId: string;
    workspaceId: string;
    role: string;
    $id: string;
    $createdAt: string;
    $updatedAt: string;
    name:string;
  };
  project: {
    workspaceId: string;
    imageUrl: string | null;
    name: string;
    $id: string;
    $createdAt: string;
    $updatedAt: string;
  };
};



const getTask = async (param: string) => {
 

  const res = await axios.get(`/api/protect/tasks/getOne/${param}`);
  return res.data as TaskDocument;
};

export const useGetTask = (taskId: string) => {
  const query = useQuery({
    queryKey: [
      'task',
      taskId
    ],
    queryFn: async () => {
      const res = await getTask(taskId);
      
      return res;
    },
    retry: 0,
  });
  return query;
};
