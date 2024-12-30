import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { createTaskSchema } from '../schemas';
import { z } from 'zod';

type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};

type TasksRequest = Omit<Nullable<z.infer<typeof createTaskSchema>> , "description" | "dueDate" |"name"> & { 
  search?: string | null,
  dueDate?:string | null 
};
type TaskDocument = {
  workspaceId: string;
  name: string;
  projectId: string;
  assigneeId: string;
  description: string | null;
  dueDate: string;
  status: string;
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

type TasksResponse = {
  total: number;
  documents: TaskDocument[];
};

const getTasks = async (data: TasksRequest) => {
  // const queryParams = new URLSearchParams(data as Record<string, string>).toString();

  const res = await axios.get('/api/protect/tasks/get/', {
    params: data,
  });
  return res.data as TasksResponse;
};

export const useGetTasks = (data: TasksRequest) => {
  const { workspaceId, projectId, status, assigneeId, search, dueDate } = data;
  const query = useQuery({
    queryKey: [
      'tasks',
      workspaceId,
      projectId,
      status,
      search,
      assigneeId,
      dueDate,
    ],
    queryFn: async () => {
      const res = await getTasks(data);
      console.log(res);
      return res;
    },
    retry: 0,
  });
  return query;
};
