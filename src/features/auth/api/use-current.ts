import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Models } from 'node-appwrite';

const getCurrent = async () => {
  const res = await axios.get('/api/protect/current/get');
  return res.data as Models.User<Models.Preferences>;
};

export const useCurrent = () => {
  const query = useQuery({
    queryKey: ['current'],
    queryFn: async () => {
      const data = await getCurrent();
      return data ? data : null;
    },
    retry: 0,
  });
  return query;
};
