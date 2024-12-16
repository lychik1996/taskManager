import {z} from"zod";
export const createWorkspaceShcema = z.object({
    name:z.string().trim().min(1,"Required"),
    
})