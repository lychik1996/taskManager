import { DATABASE_ID, MEMBERS_ID, PROJECTS_ID, TASKS_HISTORY_ID, TASKS_ID } from '@/config';
import { Project } from '@/features/projects/types';
import {
  Task,
  TaskHistory,
  TaskHistoryParse,
  TaskHistoryValue,
} from '@/features/tasks/types';
import { createAdminClient } from '@/lib/appwrite';
import { CheckSession } from '@/lib/checkSession';
import { NextRequest, NextResponse } from 'next/server';
import { Query } from 'node-appwrite';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const context = await CheckSession();
    if (!context) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const databases = context.databases;
    const userB = context.user;
    const { taskId } = await params;
    const { users } = await createAdminClient();
    
    const task = await databases.getDocument<Task>(
      DATABASE_ID,
      TASKS_ID,
      taskId,
    )
    const projects = (await databases.listDocuments(
      DATABASE_ID,
      PROJECTS_ID,
      [Query.equal('workspaceId',task.workspaceId)]
    )).documents.map(project=>({
      name:project.name,
      imageUrl:project.imageUrl,
      id:project.id,
    }));
    

    const members =await databases.listDocuments(
      DATABASE_ID,
      MEMBERS_ID,
      [Query.equal("workspaceId",task.workspaceId)]
    )
    

    let currentUser ={
      name:userB.name || userB.email,
      email:userB.email,
      id:userB.$id,
      role:undefined,
    }
    

    const assignees:any[] = [];
    
    for(let member of members.documents){
      if(member.userId===userB.$id){
        currentUser={
          ...currentUser,
          role:member.role,
        }
      }
      const assignee = await users.get(member.userId);
      assignees.push({
        name: assignee.name || assignee.email,
        email: assignee.email,
        id:assignee.$id,
        role:member.role,
      })
    }
    console.log(assignees);
    console.log(currentUser);

    const taskHistories = await databases.listDocuments<TaskHistory>(
      DATABASE_ID,
      TASKS_HISTORY_ID,
      [Query.equal('taskId', taskId), Query.orderDesc('$createdAt')]
    );
    const taskHistoriesParse = taskHistories.documents.map((history) => ({
      ...history,
      oldValue: JSON.parse(history.oldValue) as TaskHistoryValue,
      newValue: JSON.parse(history.newValue) as TaskHistoryValue,
    }));
    console.log(taskHistoriesParse);
    return NextResponse.json({ taskHistoriesParse });
  } catch {
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 400 }
    );
  }
}
