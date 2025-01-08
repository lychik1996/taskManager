import { z } from 'zod';
export const createProjectShcema = z.object({
  name: z.string().trim().min(1, 'Required'),
  image: z
    .union([
      z.instanceof(File),
      z.string().transform((value) => (value === '' ? undefined : value)),
    ])
    .optional(),
  workspaceId: z.string(),
});

export const updateProjectShcema = z.object({
  name: z.string().trim().min(1, 'Must be 1 or more characters').optional(),
  image: z
    .union([
      z.instanceof(File),
      z.string().transform((value) => (value === '' ? undefined : value)),
    ])
    .optional(),
});
