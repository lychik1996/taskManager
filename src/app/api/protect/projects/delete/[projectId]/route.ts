import { DATABASE_ID, PROJECTS_ID, TASKS_HISTORY_ID, TASKS_ID } from '@/config';
import { getMember } from '@/features/members/utils';
import { Project } from '@/features/projects/types';
import { CheckSession } from '@/lib/checkSession';
import { NextRequest, NextResponse } from 'next/server';
import { Query } from 'node-appwrite';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;
    
    if (!projectId) {
      return NextResponse.json(
        { message: 'projectId is missing' },
        { status: 401 }
      );
    }
    const context = await CheckSession();
    if (!context) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const databases = context.databases;

    const user = context.user;

    const existingProject = await databases.getDocument<Project>(
      DATABASE_ID,
      PROJECTS_ID,
      projectId
    );

    const member = await getMember({
      databases,
      workspaceId: existingProject.workspaceId,
      userId: user.$id,
    });

    if (!member) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const tasks = await databases.listDocuments(DATABASE_ID, TASKS_ID, [
      Query.equal('projectId', projectId),
    ]);

    for (const task of tasks.documents) {
      try {
        const taskHistories = await databases.listDocuments(
          DATABASE_ID,
          TASKS_HISTORY_ID,
          [Query.equal('taskId', task.$id)]
        );
        for (const history of taskHistories.documents) {
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
        await databases.deleteDocument(DATABASE_ID, TASKS_ID, task.$id);
      } catch (e) {
        console.error(`Failed to delete task: ${task.$id}`, e);
      }
    }

    await databases.deleteDocument(DATABASE_ID, PROJECTS_ID, projectId);

    return NextResponse.json({ data: { $id: existingProject.workspaceId } });
  } catch {
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 401 }
    );
  }
}
