import { useParams } from 'next/navigation';

export const useTokenName = () => {
  const params = useParams();
  if (!params || !params.token) {
    return '';
  }
  return params.token as string;
};
