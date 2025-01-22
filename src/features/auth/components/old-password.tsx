import { useEffect, useState } from 'react';
import { validPasswordSchema } from '../schemas';
import { useDebounce } from '@/hooks/use-debounce';
import { useValidPassword } from '../api/use-valid-password';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface OldPasswordProps{
    setPasswordValid:(data:boolean)=>void
    isOldPassword:boolean
}

export default function OldPassword({setPasswordValid, isOldPassword}:OldPasswordProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const debouncePassword = useDebounce(password, 300);
  const { mutate, data } = useValidPassword();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    if (value.trim() === '') {
      setError(null);
      return;
    }
    const result = validPasswordSchema.safeParse(value);
    if (!result.success) {
      const firstError = result.error.issues[0]?.message;
      setError(firstError || 'Invalid input');
    } else {
      setError(null);
    }
  };
  useEffect(()=>{
    if (data) {
        setPasswordValid(data.isPasswordValid);
      } else {
        setPasswordValid(false);
      }
  },[data, setPasswordValid])
  useEffect(() => {
    if (debouncePassword) {
      mutate(debouncePassword);
    }
  }, [debouncePassword, mutate]);
  return (
    <Label>
      <p className="text-sm font-medium mb-2 select-none">Current Password</p>
      <Input
        placeholder="Enter current password"
        type="password"
        onChange={handleChange}
        value={password}
        disabled={!isOldPassword}
      />
      {error && <div className="pt-2 text-red-500">{error}</div>}
    </Label>
  );
}
