import { getMember } from '@/features/members/utils';

import { CheckSession } from '@/lib/checkSession';
import { NextRequest, NextResponse } from 'next/server';

import { DATABASE_ID, TASKS_HISTORY_ID, TASKS_ID } from '@/config';
import { ID, Query } from 'node-appwrite';
import { Task, TaskField, TaskHistory, TaskHistoryValue } from '@/features/tasks/types';

export async function POST(req: NextRequest) {
  try {
    const context = await CheckSession();
    if (!context) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const databases = context.databases;
    const user = context.user;
    const { name, status, workspaceId, projectId, dueDate, assigneeId } =
      await req.json();

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });
    if (!member) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const highestPositionTask = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal('status', status),
        Query.equal('workspaceId', workspaceId),
        Query.orderAsc('position'),
        Query.limit(1),
      ]
    );

    const newPosition =
      highestPositionTask.documents.length > 0
        ? highestPositionTask.documents[0].position + 1000
        : 1000;

    const task = await databases.createDocument<Task>(
      DATABASE_ID,
      TASKS_ID,
      ID.unique(),
      {
        name,
        status,
        workspaceId,
        projectId,
        dueDate,
        assigneeId,
        position: newPosition,
      }
    );
    const newValue : TaskHistoryValue = {
      name,
      projectId,
      status,
      dueDate,
      assigneeId,
      description:null,
    };
    await databases.createDocument<TaskHistory>(
      DATABASE_ID,
      TASKS_HISTORY_ID,
      ID.unique(),
      {
        taskId:task.$id,
        changedBy:user.$id,
        fields:[TaskField.CREATE],
        oldValue:JSON.stringify(newValue),
        newValue: JSON.stringify(newValue),
      }
    )
    return NextResponse.json({ task });
  } catch {
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 400 }
    );
  }
}
