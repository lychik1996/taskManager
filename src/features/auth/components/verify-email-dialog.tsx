'use client';

import DottedSeparator from '@/components/dotted-separator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { LogOut, Mail, RefreshCcw } from 'lucide-react';
import { useLogout } from '../api/use-logout';
import { usePathname} from 'next/navigation';
import { useVerification } from '../api/use-verification';
import { useEffect } from 'react';
import { useResendToken } from '../api/use-resend';
import { useTokenName } from '../hooks/use-token-name';

export default function VerifyEmailDialog() {
  const { mutate: logout,isPending:isPendingLogout} = useLogout();
  const token = useTokenName();
  const {mutate:checkToken}=useVerification();
  const {mutate:resendToken, isPending:isPendingResendToken} = useResendToken();
  const isPending = isPendingLogout || isPendingResendToken
  useEffect(()=>{
    if(token){
        checkToken({token})
    }   
  },[token])
  const handleResendEmail = () => {
    resendToken();
  };
  return (
    <Dialog open={true}>
      <DialogContent
        hideCloseButton
        onOpenAutoFocus={(e) => e.preventDefault()}
        aria-describedby={undefined}
        className="w-full sm:max-w-lg p-0 border-none overflow-y-auto hide-scrollbar max-h-[85vh]"
      >
        <DialogTitle className="sr-only">Verify your account</DialogTitle>
        <Card className="w-full h-full border-node shadow-none">
          <CardHeader className="flex p-7">
            <CardTitle className="text-xl font-bold">
              Verify your email adress
            </CardTitle>
          </CardHeader>
          <div className="px-7">
            <DottedSeparator />
          </div>
          <CardContent className="p-7">
            <div className="flex flex-col gap-2">
              <p className="text-muted-foreground flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                We have sent a letter to your email address to confirm
                verification!
              </p>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <RefreshCcw className="w-4 h-4 text-muted-foreground" />
                Didn`t receive the email? Check your spam folder or{' '}
                <Button variant="secondary" onClick={handleResendEmail} disabled={isPending}>
                  Resend the email
                </Button>
                .
              </p>
              <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <LogOut className="w-4 h-4 text-muted-foreground" />
                If you entered the wrong email address
                <Button
                className='text-black'
                  variant="ghost"
                  onClick={() => logout()}
                  disabled={isPending}
                >
                  Log out
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
