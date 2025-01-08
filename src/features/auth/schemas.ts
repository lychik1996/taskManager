import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Write min 8 symbol'),
});

export const registerSchema = z.object({
  name: z.string().trim().min(1, 'Required'),
  email: z.string().email(),
  password: z.string().min(8, 'Write min 8 symbol'),
});
