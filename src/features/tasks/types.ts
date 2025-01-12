import { Models } from 'node-appwrite';

export enum TaskStatus {
  BACKLOG = 'BACKLOG',
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  IN_REVIEW = 'IN_REVIEW',
  DONE = 'DONE',
}

export type Task = Models.Document & {
  name: string;
  status: TaskStatus;
  assigneeId: string;
  projectId: string;
  position: number;
  dueDate: string;
  workspaceId: string;
  description?: string | null;
  project: {
    workspaceId: string;
    imageUrl: string | null;
    name: string;
    $id: string;
    $createdAt: string;
    $updatedAt: string;
  };
  assignee: {
    name: string;
    userId: string;
    workspaceId: string;
    role: string;
    $id: string;
    $createdAt: string;
    $updatedAt: string;
  };
};

type T = string | null;
export type TaskHistoryValue = null | {
  name:T,
  projectId:T,
  status:TaskStatus,
  dueDate:T,
  assigneeId:T,
  description:T,
  [key: string]: T
}

export enum TaskField {
  CREATE = "CREATE",
  STATUS = "STATUS",
  NAME = "NAME",
  PROJECT_ID = "PROJECT_ID",
  DUE_DATE = "DUE_DATE",
  ASSIGNEE_ID = "ASSIGNEE_ID",
  DESCRIPTION = "DESCRIPTION",
}

export type TaskHistory = Models.Document &{
  taskId:string,
  changedBy:string,
  fields:TaskField[],
  oldValue:string | null,
  newValue:string,
}

