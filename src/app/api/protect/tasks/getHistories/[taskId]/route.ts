import {
  DATABASE_ID,
  MEMBERS_ID,
  PROJECTS_ID,
  TASKS_HISTORY_ID,
  TASKS_ID,
} from '@/config';

import {
  Task,
  TaskField,
  TaskHistory,
  TaskHistoryParse,
  TaskHistoryValue,
} from '@/features/tasks/types';
import { createAdminClient } from '@/lib/appwrite';
import { CheckSession } from '@/lib/checkSession';
import { NextRequest, NextResponse } from 'next/server';
import { Query } from 'node-appwrite';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const context = await CheckSession();
    if (!context) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const databases = context.databases;
    const userB = context.user;
    const { taskId } = await params;
    const { users } = await createAdminClient();

    const task = await databases.getDocument<Task>(
      DATABASE_ID,
      TASKS_ID,
      taskId
    );
    const projects = (
      await databases.listDocuments(DATABASE_ID, PROJECTS_ID, [
        Query.equal('workspaceId', task.workspaceId),
      ])
    ).documents.map((project) => ({
      name: project.name,
      imageUrl: project.imageUrl,
      id: project.$id,
    }));

    const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
      Query.equal('workspaceId', task.workspaceId),
    ]);

    //get assignees and currentUser
    let currentUser = {
      name: userB.name || userB.email,
      email: userB.email,
      id: userB.$id,
      role: '',
    };
    const assignees: any[] = [];
    for (let member of members.documents) {
      if (member.userId === userB.$id) {
        currentUser = {
          ...currentUser,
          role: member.role,
        };
      }
      const assignee = await users.get(member.userId);
      assignees.push({
        name: assignee.name || assignee.email,
        email: assignee.email,
        id: member.$id,
        role: member.role,
      });
    }

    //get and parse task histories
    const taskHistories = await databases.listDocuments<TaskHistory>(
      DATABASE_ID,
      TASKS_HISTORY_ID,
      [Query.equal('taskId', taskId), Query.orderDesc('$createdAt')]
    );
    const taskHistoriesPreParse: TaskHistoryParse[] =
      taskHistories.documents.map((history) => ({
        ...history,
        oldValue: JSON.parse(history.oldValue) as TaskHistoryValue,
        newValue: JSON.parse(history.newValue) as TaskHistoryValue,
      }));

    const taskHistoriesParse = taskHistoriesPreParse.map((history) => {
      const oldValueAssignee = assignees.find(
        (assignee) => assignee.id === history.oldValue.assigneeId
      );
      const newValueAssignee = assignees.find(
        (assignee) => assignee.id === history.newValue.assigneeId
      );
      const oldValueProject = projects.find(
        (project) => project.id === history.oldValue.projectId
      );
      const newValueProject = projects.find(
        (project) => project.id === history.newValue.projectId
      );
      return {
        ...history,
        changedBy: currentUser,
        oldValue: {
          ...history.oldValue,
          assigneeId: oldValueAssignee,
          projectId: oldValueProject,
        },
        newValue: {
          ...history.newValue,
          assigneeId: newValueAssignee,
          projectId: newValueProject,
        },
      };
    });

    const allowedFields = Object.values(TaskField); // Масив дозволених полів з TaskField

const filterTaskHistories = taskHistoriesParse.map((history) => {
  const { fields } = history; // Поля, які треба залишити
  const allowedInCurrentFields = fields.includes(TaskField.CREATE) ? [] : fields;

  const filterFields = (
    obj: Record<string, any>,
    allowedFields: string[]
  ) => {
    if (allowedInCurrentFields.length === 0) {
      return {}; // Якщо поле `create` і ніякі інші, повертаємо порожній об'єкт
    }

    return Object.keys(obj).reduce((acc, key) => {
      if (allowedFields.includes(key)) {
        acc[key] = obj[key];
      }
      return acc;
    }, {} as Record<string, any>);
  };

  return {
    ...history,
    oldValue: filterFields(history.oldValue, allowedInCurrentFields),
    newValue: filterFields(history.newValue, allowedInCurrentFields),
  };
});
    console.log(filterTaskHistories);
    return NextResponse.json({ filterTaskHistories });
  } catch {
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 400 }
    );
  }
}
