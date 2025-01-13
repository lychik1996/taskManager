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



export type TaskHistoryValue = {
  name: string | null;
  projectId: string | { imageUrl: string | null; name: string; id:string};
  status: TaskStatus;
  dueDate: string | null;
  assigneeId:
    | string
    | { name: string; role: string; email:string; id:string};
  description: string | null;
};

export enum TaskField {
  CREATE = 'create',
  STATUS = 'status',
  NAME = 'name',
  PROJECT_ID = 'project',
  DUE_DATE = 'dueDate',
  ASSIGNEE_ID = 'assignee',
  DESCRIPTION = 'description',
}

export type TaskHistory = Models.Document & {
  taskId: string;
  changedBy: string;
  fields: TaskField[];
  oldValue: string;
  newValue: string;
};
export type TaskHistoryParse = Models.Document & {
  taskId: string;
  changedBy:
    | string
    | { name: string; role: string; email:string; id:string};
  fields: TaskField[];
  oldValue: TaskHistoryValue;
  newValue: TaskHistoryValue;
};
