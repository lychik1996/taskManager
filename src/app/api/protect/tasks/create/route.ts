import { getMember } from '@/features/members/utils';
import { EmailContent, EmailVarian } from '@/components/email/email-content';
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
} from '@/features/tasks/types';

import { sendEmail } from '@/lib/nodemailer';
import { render } from '@react-email/components';
import { createAdminClient } from '@/lib/appwrite';

export async function POST(req: NextRequest) {
  try {
    const context = await CheckSession();
    const { users } = await createAdminClient();
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

    //send mail to assignee user
    try {
      const memberAssignee = await databases.getDocument(
        DATABASE_ID,
        MEMBERS_ID,
        assigneeId
      );

      const assigneeUser = await users.get(memberAssignee.userId);

      if (assigneeUser.$id !== user.$id) {
        const project = await databases.getDocument(
          DATABASE_ID,
          PROJECTS_ID,
          projectId
        );

        const workspace = await databases.getDocument(
          DATABASE_ID,
          WORKSPACES_ID,
          project.workspaceId
        );

        const href = `${PUBLIC_APP}workspaces/${workspace.$id}/tasks/${task.$id}`;
        const html = await render(
          EmailContent({
            name: assigneeUser.name,
            appointingName: user.name,
            appointingEmail: user.email,
            taskName: task.name,
            projectName: project.name,
            href,
            variant: EmailVarian.CREATE_TASK,
          })
        );
        await sendEmail({
          to: assigneeUser.email,
          subject: 'Create task',
          html,
        });
      }
    } catch (e) {
      console.error('Failed t send email', e);
    }

    //task histories
    const newValue: TaskHistoryValue = {
      name,
      projectId,
      status,
      dueDate,
      assigneeId,
      description: null,
    };
    await databases.createDocument<TaskHistory>(
      DATABASE_ID,
      TASKS_HISTORY_ID,
      ID.unique(),
      {
        taskId: task.$id,
        changedBy: user.$id,
        fields: [TaskField.CREATE],
        oldValue: JSON.stringify(newValue),
        newValue: JSON.stringify(newValue),
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
