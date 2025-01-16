import { useEffect, useState } from 'react';
import { useTimeDiffVerification } from '../api/use-time-diff';
import { Button } from '@/components/ui/button';
import { useResendToken } from '../api/use-resend';
import { useConfirm } from '@/hooks/use-confirm';

export default function VerifyEmailTime() {
  const [time, setTime] = useState<number>(0);
  const { data: timeDiffSec } = useTimeDiffVerification();
  const { mutate: resendToken, isPending } = useResendToken();
  const [ConfirmDialog, confirmResend] = useConfirm(
    'Resend letter',
    'This action cannot be undone.',
    'destructive'
  );

  useEffect(() => {
    if (timeDiffSec && timeDiffSec > 0) {
      setTime(120 - timeDiffSec);
    }
  }, [timeDiffSec]);

  useEffect(() => {
    if (time > 0) {
      const interval = setInterval(() => {
        setTime((prev) => prev - 1);
      }, 1000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [time]);
  const handleResendEmail = async () => {
    const ok = await confirmResend();
    if (!ok) return;
    resendToken();
    setTime(120);
  };
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60).toString().padStart(2, '0'); 
    const remainingSeconds = (seconds % 60).toString().padStart(2, '0'); 
    return `${minutes}:${remainingSeconds}`;
  };
  return (
    <div>
      <ConfirmDialog />
      {time < 1 ? (
        <Button
          variant="secondary"
          onClick={handleResendEmail}
          disabled={isPending}
        >
          Resend the email
        </Button>
      ) : (
        <div className="text-sm text-muted-foreground">
          Please wait <span className="inline-block w-[44px] text-center">{formatTime(time)}</span> before resending the email.
        </div>
      )}
    </div>
  );
}
