import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Models } from "node-appwrite";
import { createTaskSchema } from "../schemas";
import { z } from "zod";




type TasksRequest =z.infer<typeof createTaskSchema>;
type TasksResponse = Models.DocumentList<Models.Document>

const getTasks = async (data: TasksRequest) => {
  const validData = createTaskSchema.parse(data)
  const res = await axios.post('/api/protect/tasks/get',validData);
  return res.data.Tasks as TasksResponse;
};

export const useGetTasks = (data: TasksRequest) => {
  const query = useQuery({
    queryKey: ["tasks", data.workspaceId],
    queryFn: async () => {
      
      const res = await getTasks(data);
      return res;
    },
    retry: 0,
  });
  return query;
};