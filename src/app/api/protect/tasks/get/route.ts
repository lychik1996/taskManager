import { DATABASE_ID, MEMBERS_ID, PROJECTS_ID, TASKS_ID } from '@/config';
import { getMember } from '@/features/members/utils';
import { Project } from '@/features/projects/types';
import { Task, TaskStatus } from '@/features/tasks/types';
import { createAdminClient } from '@/lib/appwrite';
import { CheckSession } from '@/lib/checkSession';
import { NextRequest, NextResponse } from 'next/server';
import { Query } from 'node-appwrite';
import { z } from 'zod';

const ReqZ = z.object({
  workspaceId: z.string(),
  projectId: z.string().nullish(),
  assigneeId: z.string().nullish(),
  status: z.nativeEnum(TaskStatus).nullish(),
  search: z.string().nullish(),
  dueDate: z.string().nullish(),
});

export async function GET(req: NextRequest) {
  try {
    const { users } = await createAdminClient();
    const context = await CheckSession();

    if (!context) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const databases = context.databases;
    const user = context.user;
    const params = Object.fromEntries(req.nextUrl.searchParams.entries());
    const { workspaceId, projectId, status, search, assigneeId, dueDate } =
      ReqZ.parse(params);

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });

    if (!member) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const query = [
      Query.equal('workspaceId', workspaceId),
      Query.orderDesc('$createdAt'),
    ];
    if (projectId) {
      console.log('projectId: ', projectId);
      query.push(Query.equal('projectId', projectId));
    }
    if (status) {
      console.log('status: ', status);
      query.push(Query.equal('status', status));
    }
    if (assigneeId) {
      console.log('assigneeId: ', assigneeId);
      query.push(Query.equal('assigneeId', assigneeId));
    }
    if (dueDate) {
      console.log('dueDate: ', dueDate);
      query.push(Query.equal('dueDate', dueDate));
    }
    if (search) {
      console.log('search: ', search);
      query.push(Query.search('name', search)); 
    }

    const tasks = await databases.listDocuments<Task>(
      DATABASE_ID,
      TASKS_ID,
      query
    );

    const projectIds = tasks.documents.map((task) => task.projectId);
    const assigneeIds = tasks.documents.map((task) => task.assigneeId);

    const projects = await databases.listDocuments<Project>(
      DATABASE_ID,
      PROJECTS_ID,
      projectIds.length > 0 ? [Query.contains('$id', projectIds)] : []
    );

    const members = await databases.listDocuments(
      DATABASE_ID,
      MEMBERS_ID,
      assigneeIds.length > 0 ? [Query.contains('$id', assigneeIds)] : []
    );

    const assignees = await Promise.all(
      members.documents.map(async (member) => {
        const user = await users.get(member.userId);

        return {
          ...member,
          name: user.name || user.email,
          email: user.email,
        };
      })
    );
    const populatedTasks = tasks.documents.map((task) => {
      const project = projects.documents.find(
        (project) => project.$id === task.projectId
      );
      const assignee = assignees.find(
        (assignee) => assignee.$id === task.assigneeId
      );
      return {
        ...task,
        project,
        assignee,
      };
    });

    return NextResponse.json({ ...tasks, documents: populatedTasks });
  } catch {
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 400 }
    );
  }
}
