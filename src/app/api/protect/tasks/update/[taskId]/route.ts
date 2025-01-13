import { DATABASE_ID, TASKS_HISTORY_ID, TASKS_ID } from '@/config';

import { getMember } from '@/features/members/utils';
import {
  Task,
  TaskField,
  TaskHistory,
  TaskHistoryValue,
} from '@/features/tasks/types';
import { CheckSession } from '@/lib/checkSession';
import { isEqual, parseISO } from 'date-fns';
import { NextRequest, NextResponse } from 'next/server';
import { ID, Query } from 'node-appwrite';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const context = await CheckSession();
    if (!context) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const databases = context.databases;
    const user = context.user;

    const { name, status, description, projectId, dueDate, assigneeId } =
      await req.json();
    const { taskId } = await params;
    const existingTask = await databases.getDocument<Task>(
      DATABASE_ID,
      TASKS_ID,
      taskId
    );
    const member = await getMember({
      databases,
      workspaceId: existingTask.workspaceId,
      userId: user.$id,
    });
    if (!member) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
      const taskHistories = await databases.listDocuments<TaskHistory>(
        DATABASE_ID,
        TASKS_HISTORY_ID,
        [
          Query.equal('taskId', taskId),
          Query.orderDesc('$createdAt'),
          Query.limit(1),
        ]
      );
      const oldValueJSON = taskHistories.documents[0].newValue;
      const oldValue: TaskHistoryValue = oldValueJSON
        ? JSON.parse(oldValueJSON)
        : null;
      let fields: TaskField[] = [];
      let newValue: TaskHistoryValue = { ...oldValue };

      const fieldMappings: {
        key: keyof TaskHistoryValue;
        value: any;
        taskField: TaskField;
      }[] = [
        { key: 'name', value: name, taskField: TaskField.NAME },
        { key: 'status', value: status, taskField: TaskField.STATUS },
        {
          key: 'description',
          value: description,
          taskField: TaskField.DESCRIPTION,
        },
        { key: 'projectId', value: projectId, taskField: TaskField.PROJECT_ID },
        { key: 'dueDate', value: dueDate, taskField: TaskField.DUE_DATE },
        {
          key: 'assigneeId',
          value: assigneeId,
          taskField: TaskField.ASSIGNEE_ID,
        },
      ];

      for (const { key, value, taskField } of fieldMappings) {
        if (key === 'dueDate') {
          const existingDate = existingTask.dueDate
            ? parseISO(existingTask.dueDate)
            : null;
          const newDate = value ? parseISO(value) : existingDate;

          if (newDate && existingDate && !isEqual(newDate, existingDate)) {
            fields.push(taskField);
            (newValue as any)[key] = value;
          }
        } else if (value !== undefined && value !== existingTask[key]) {
          fields.push(taskField);
          (newValue as any)[key] = value;
        }
      }

      if (fields.length > 0) {
         await databases.createDocument<TaskHistory>(
          DATABASE_ID,
          TASKS_HISTORY_ID,
          ID.unique(),
          {
            taskId,
            changedBy: user.$id,
            fields,
            oldValue: oldValueJSON,
            newValue: JSON.stringify(newValue),
          }
        );
      }
    } catch (e) {
      console.error(`Failed to create taskHistory: ${taskId}`, e);
    }

    const task = await databases.updateDocument<Task>(
      DATABASE_ID,
      TASKS_ID,
      taskId,
      {
        name,
        status,
        projectId,
        dueDate,
        assigneeId,
        description,
      }
    );

    return NextResponse.json({ task });
  } catch {
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 400 }
    );
  }
}
