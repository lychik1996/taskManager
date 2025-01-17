import {
  DATABASE_ID,
  MEMBERS_ID,
  PROJECTS_ID,
  PUBLIC_APP,
  TASKS_HISTORY_ID,
  TASKS_ID,
  WORKSPACES_ID,
} from '@/config';

import { getMember } from '@/features/members/utils';
import {
  Task,
  TaskField,
  TaskHistory,
  TaskHistoryValue,
} from '@/features/tasks/types';
import { createAdminClient } from '@/lib/appwrite';
import { CheckSession } from '@/lib/checkSession';
import { sendEmail } from '@/lib/nodemailer';
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
    const { users } = await createAdminClient();
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
    const memberAssignee = await databases.getDocument(
      DATABASE_ID,
      MEMBERS_ID,
      existingTask.assigneeId
    );

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

    try {
      const workspace = await databases.getDocument(
        DATABASE_ID,
        WORKSPACES_ID,
        task.workspaceId
      );
      const project = await databases.getDocument(
        DATABASE_ID,
        PROJECTS_ID,
        task.projectId
      );
      const assigneeUser = await users.get(memberAssignee.userId);
      const newMemberAssignee =
        existingTask.assigneeId !== assigneeId
          ? await databases.getDocument(
              DATABASE_ID,
              MEMBERS_ID,
              task.assigneeId
            )
          : null;
      const newAssigneeUser =
        existingTask.assigneeId !== assigneeId
          ? await users.get(newMemberAssignee?.userId)
          : null;
      const href = `${PUBLIC_APP}workspaces/${workspace.$id}/tasks/${task.$id}`;
      if (newAssigneeUser) {
        const htmlNewUser = `<p>User: name:${user.name} email:${user.email} appointed you as the main person in ${project.name} for this task:${task.name}, ${href}"</p>`;

        await sendEmail({
          to: newAssigneeUser.email,
          subject: 'New task',
          html: htmlNewUser,
        });
        if (user.$id !== assigneeUser.$id) {
          const htmlOldUser = `<p>User: name: ${user.name} email: ${user.email} pushed you away in ${project.name} task:${task.name},  ${href}</p>`;
          await sendEmail({
            to: assigneeUser.email,
            subject: 'Pushed you away in task',
            html: htmlOldUser,
          });
        }
      } else if (user.$id !== assigneeUser.$id) {
        const html = `<p>User: name: ${user.name} email: ${user.email} has changed your task in ${project.name} task:${task.name}, ${href}</p>`;
        await sendEmail({
          to: assigneeUser.email,
          subject: 'Changed your task',
          html: html,
        });
      }
    } catch (e) {
      console.error('Failed to send mail', e);
    }

    return NextResponse.json({ task });
  } catch {
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 400 }
    );
  }
}
