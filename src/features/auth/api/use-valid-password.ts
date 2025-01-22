import axios from 'axios';
import { useMutation} from '@tanstack/react-query';
import { z } from 'zod';
import { validPasswordSchema } from '../schemas';


type ValidPasswordRequest = z.infer<typeof validPasswordSchema>
type ValidPasswordResponse = { isPasswordValid: boolean }

const validPassword= async (data:ValidPasswordRequest)=> {
  const oldPassword = validPasswordSchema.parse(data);
  const res = await axios.post('/api/protect/current/checkPassword', {oldPassword});
  console.log(res.data.isPasswordValid);
  return res.data as ValidPasswordResponse
};

export const useValidPassword = () => {
  
  return useMutation({
    mutationFn: async (data: ValidPasswordRequest) => {
      return await validPassword(data);
    },
  });
};