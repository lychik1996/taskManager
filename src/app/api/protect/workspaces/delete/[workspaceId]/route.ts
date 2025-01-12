import {
  DATABASE_ID,
  IMAGES_BUCKET_ID,
  MEMBERS_ID,
  PROJECTS_ID,
  TASKS_HISTORY_ID,
  TASKS_ID,
  WORKSPACES_ID,
} from '@/config';
import { MemberRole } from '@/features/members/types';
import { getMember } from '@/features/members/utils';
import { CheckSession } from '@/lib/checkSession';
import { NextRequest, NextResponse } from 'next/server';
import { Query } from 'node-appwrite';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ workspaceId: string }> }
) {
  try {
    const { workspaceId } = await params;

    if (!workspaceId) {
      return NextResponse.json(
        { message: 'WorkspaceId is missing' },
        { status: 401 }
      );
    }

    const context = await CheckSession();
    if (!context) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const databases = context.databases;

    const user = context.user;

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });

    if (!member || member.role !== MemberRole.ADMIN) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    
    const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
      Query.equal('workspaceId', workspaceId),
    ]);
    for (const member of members.documents) {
      try {
        await databases.deleteDocument(DATABASE_ID, MEMBERS_ID, member.$id);
      } catch (e) {
        console.error(`Failed to delete member: ${member.$id}`, e);
      }
    }

    const projects = await databases.listDocuments(DATABASE_ID, PROJECTS_ID, [
      Query.equal('workspaceId', workspaceId),
    ]);
    for (const project of projects.documents) {
      try {
        const tasks = await databases.listDocuments(DATABASE_ID, TASKS_ID, [
          Query.equal('projectId', project.$id),
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
        await databases.deleteDocument(DATABASE_ID, PROJECTS_ID, project.$id);
      } catch (e) {
        console.error(`Failed to delete project: ${project.$id}`, e);
      }
    }

    await databases.deleteDocument(DATABASE_ID, WORKSPACES_ID, workspaceId);

    return NextResponse.json({ data: { $id: workspaceId } });
  } catch {
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 401 }
    );
  }
}
