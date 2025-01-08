import { useParams } from 'next/navigation';

export const useInviteCode = () => {
  const params = useParams();

  if (!params || !params.inviteCode) {
    return '';
  }
  return params.inviteCode as string;
};
