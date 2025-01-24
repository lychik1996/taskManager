import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { contactUsSchema } from '../schemas';
import { toast } from 'sonner';

type contactUsResponse = z.infer<typeof contactUsSchema>;
type contactUsRequest = { message: string };

const contactUs = async (data: contactUsResponse) => {
  const validData = contactUsSchema.parse(data);
  const res = await axios.post('/api/users/contactUs', validData);
  return res.data as contactUsRequest;
};

export const useContactUs = () => {
  return useMutation({
    mutationFn: async (data: contactUsResponse) => {
      return await contactUs(data);
    },
    onSuccess: () => {
      toast.success('Send question');
    },
    onError: () => {
      toast.error('Failed to send question');
    },
  });
};
