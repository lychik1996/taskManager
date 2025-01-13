import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { TaskField, TaskHistoryParse, TaskStatus } from '../types';
import { Models } from 'node-appwrite';

type ResponseTaskHistoryValue = {
  name?: string | null;
  projectId?: { imageUrl: string | null; name: string; id:string};
  status?: TaskStatus;
  dueDate?: string | null;
  assigneeId?:{ name: string; role: string; email:string; id:string};
  description?: string | null;
} & {};
export type ResponseTaskHistories = Models.Document & {
  taskId: string;
  changedBy:{ name: string; role: string; email:string; id:string};
  fields: TaskField[];
  oldValue: ResponseTaskHistoryValue;
  newValue: ResponseTaskHistoryValue;
};

const getHistories = async (param: string) => {
  const res = await axios.get(`/api/protect/tasks/getHistories/${param}`);
  return res.data.filterTaskHistories as ResponseTaskHistories[];
};

export const useGetHistories = (taskId: string) => {
  const query = useQuery({
    queryKey: ['task-histories', taskId],
    queryFn: async () => {
      const res = await getHistories(taskId);
      return res;
    },
    retry: 0,
  });
  return query;
};