
import VerifyEmailDialog from '@/features/auth/components/verify-email-dialog';
import { getCurrent } from '@/features/auth/queries';
import { redirect } from 'next/navigation';
export default async function VerifyEmail() {
  const user = await getCurrent();
  if(!user){
    redirect('/sign-in')
  }
  if(!user.emailVerification){
    return <VerifyEmailDialog/>
  }
  if(user.emailVerification){
    redirect('/')
  }
}
