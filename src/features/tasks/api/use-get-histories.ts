import { useQuery } from '@tanstack/react-query';
import axios from 'axios';



const getHistories = async (param: string) => {
  const res = await axios.get(`/api/protect/tasks/getHistories/${param}`);
  return res.data.taskHistoriesParse;
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