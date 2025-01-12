import { DATABASE_ID, TASKS_HISTORY_ID, TASKS_ID } from '@/config';

import { getMember } from '@/features/members/utils';
import { Task, TaskHistory } from '@/features/tasks/types';
import { CheckSession } from '@/lib/checkSession';
import { NextRequest, NextResponse } from 'next/server';

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

    // const taskHistory = await databases.createDocument<TaskHistory>(
    //   DATABASE_ID,
    //   TASKS_HISTORY_ID,
    //   ID.unique(),
    //   {
    //     taskId,
    //     changedBy: user.$id,
    //     field: 'status',
    //     oldValue: oldValueJSON,
    //     newValue: JSON.stringify(newValue),
    //   }
    // );

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
