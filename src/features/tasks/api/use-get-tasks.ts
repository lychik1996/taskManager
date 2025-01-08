import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { TaskStatus } from '../types';

type Nullable<T> = {
  [K in keyof T]?: T[K] | null;
};
type TasksRequest = Nullable<{
  search: string;
  dueDate: string;
  status: TaskStatus;
  workspaceId: string;
  projectId: string;
  assigneeId: string;
}>;

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
    name: string;
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

      return res;
    },
    retry: 0,
  });
  return query;
};
