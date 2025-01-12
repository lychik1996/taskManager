import { DATABASE_ID, TASKS_HISTORY_ID, TASKS_ID } from '@/config';
import { getMember } from '@/features/members/utils';
import { Task } from '@/features/tasks/types';
import { CheckSession } from '@/lib/checkSession';
import { NextRequest, NextResponse } from 'next/server';
import { Query } from 'node-appwrite';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const { taskId } = await params;

    if (!taskId) {
      return NextResponse.json(
        { message: 'TasksId is missing' },
        { status: 401 }
      );
    }
    const context = await CheckSession();
    if (!context) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const databases = context.databases;

    const user = context.user;

    const task = await databases.getDocument<Task>(
      DATABASE_ID,
      TASKS_ID,
      taskId
    );
    const member = await getMember({
      databases,
      workspaceId: task.workspaceId,
      userId: user.$id,
    });
    if (!member) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const tasksHistories = await databases.listDocuments(
      DATABASE_ID,
      TASKS_HISTORY_ID,
      [Query.equal('taskId', taskId)]
    );

    for (const history of tasksHistories.documents) {
      try {
        await databases.deleteDocument(
          DATABASE_ID,
          TASKS_HISTORY_ID,
          history.$id
        );
      } catch (e) {
        console.error(`Failed to delete taskHistory: ${history.id}`, e);
      }
    }
    await databases.deleteDocument(DATABASE_ID, TASKS_ID, taskId);
    return NextResponse.json({
      data: {
        $id: task.$id,
        projectId: task.projectId,
        workspaceId: task.workspaceId,
      },
    });
  } catch {
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 401 }
    );
  }
}
