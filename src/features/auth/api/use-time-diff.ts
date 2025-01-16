import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const timeDiff = async () => {
  const res = await axios.get('/api/users/verification/time');
  return res.data.timeDiffSeconds as number;
};

export const useTimeDiffVerification = () => {
  const query = useQuery({
    queryKey: ['time-verification'],
    queryFn: async () => {
      return await timeDiff();
    },
    retry: 0,
  });
  return query;
};
