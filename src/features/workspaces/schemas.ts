import {z} from"zod";
export const createWorkspaceShcema = z.object({
    name:z.string().trim().min(1,"Required"),
    image:z.union([
        z.instanceof(File),
        z.string().transform((value)=>value===""?undefined:value)
    ])
    .optional(),
})