import { getMember } from '@/features/members/utils';

import { CheckSession } from '@/lib/checkSession';
import { NextRequest, NextResponse } from 'next/server';

import {
  DATABASE_ID,
  MEMBERS_ID,
  PROJECTS_ID,
  PUBLIC_APP,
  TASKS_HISTORY_ID,
  TASKS_ID,
  WORKSPACES_ID,
} from '@/config';
import { ID, Query } from 'node-appwrite';
import {
  Task,
  TaskField,
  TaskHistory,
  TaskHistoryValue,
  TaskStatus,
} from '@/features/tasks/types';
import { createAdminClient } from '@/lib/appwrite';
import { sendEmail } from '@/lib/nodemailer';

export async function POST(req: NextRequest) {
  try {
    const context = await CheckSession();
    if (!context) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const databases = context.databases;
    const user = context.user;
    const { users } = await createAdminClient();
    const tasks: { $id: string; status: TaskStatus; position: number }[] =
      await req.json();

    const tasksToUpdated = await databases.listDocuments<Task>(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.contains(
          '$id',
          tasks.map((task) => task.$id)
        ),
      ]
    );
    const taskWithDifferentStatus = tasksToUpdated.documents.find((task) => {
      const updatedTask = tasks.find((t) => t.$id === task.$id);
      return updatedTask && updatedTask.status !== task.status;
    });
    const workspaceIds = new Set(
      tasksToUpdated.documents.map((task) => task.workspaceId)
    );

    if (workspaceIds.size !== 1) {
      return NextResponse.json(
        { message: 'All tasks must belong to the same workspace' },
        { status: 400 }
      );
    }

    const workspaceId = workspaceIds.values().next().value;

    if (!workspaceId) {
      return NextResponse.json(
        { message: 'No valid workspace found' },
        { status: 400 }
      );
    }

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });
    if (!member) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const updatedTasks = await Promise.all(
      tasks.map(async (task) => {
        const { $id, status, position } = task;
        try {
          const taskHistories = await databases.listDocuments<TaskHistory>(
            DATABASE_ID,
            TASKS_HISTORY_ID,
            [
              Query.equal('taskId', $id),
              Query.orderDesc('$createdAt'),
              Query.limit(1),
            ]
          );
          const oldValueJSON = taskHistories.documents[0].newValue;
          const oldValue: TaskHistoryValue = oldValueJSON
            ? JSON.parse(oldValueJSON)
            : null;
          if (oldValue && status !== oldValue.status) {
            const newValue: TaskHistoryValue = {
              ...oldValue,
              status,
            };
            await databases.createDocument<TaskHistory>(
              DATABASE_ID,
              TASKS_HISTORY_ID,
              ID.unique(),
              {
                taskId: $id,
                changedBy: user.$id,
                fields: [TaskField.STATUS],
                oldValue: oldValueJSON,
                newValue: JSON.stringify(newValue),
              }
            );
          }
        } catch (e) {
          console.error(`Failed to add new taskHistory: ${$id}`, e);
        }

        return databases.updateDocument<Task>(DATABASE_ID, TASKS_ID, $id, {
          status,
          position,
        });
      })
    );

    //send mail 
    if (taskWithDifferentStatus) {
      try {
        const memberAssignee = await databases.getDocument(
          DATABASE_ID,
          MEMBERS_ID,
          taskWithDifferentStatus.assigneeId
        );
        const assigneeUser = await users.get(memberAssignee.userId);
        if (assigneeUser.$id !== user.$id) {
          const workspace = await databases.getDocument(
            DATABASE_ID,
            WORKSPACES_ID,
            taskWithDifferentStatus.workspaceId
          );
          const project = await databases.getDocument(
            DATABASE_ID,
            PROJECTS_ID,
            taskWithDifferentStatus.projectId
          );
          const href = `${PUBLIC_APP}workspaces/${workspace.$id}/tasks/${taskWithDifferentStatus.$id}`;
          const html = `<p>User: name: ${user.name} email: ${user.email} has changed your task in ${project.name} task:${taskWithDifferentStatus.name},${href}</p>`;
          await sendEmail({
            to: assigneeUser.email,
            subject: 'Changed your task',
            html: html,
          });
        }
      } catch (e) {
        console.error('Failed to send mail', e);
      }
    }

    return NextResponse.json({ updatedTasks });
  } catch {
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 400 }
    );
  }
}
