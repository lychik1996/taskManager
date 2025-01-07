import { getMember } from '@/features/members/utils';

import { CheckSession } from '@/lib/checkSession';
import { NextRequest, NextResponse } from 'next/server';

import { DATABASE_ID, TASKS_ID } from '@/config';
import { ID, Query } from 'node-appwrite';
import { Task, TaskStatus } from '@/features/tasks/types';

export async function POST(req: NextRequest) {
  try {
    const context = await CheckSession();
    if (!context) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const databases = context.databases;
    const user = context.user;
    
    const tasks: { $id: string; status: TaskStatus; position: number }[] = await req.json();
    
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
    
    const workspaceIds = new Set(
      tasksToUpdated.documents.map((task) => task.workspaceId)
    );
    
    if (workspaceIds.size !== 1) {
      return NextResponse.json(
        { message: 'All tasks must belong to the same workspace' },
        { status: 400 }
      );
    }
    
    const workspaceId =workspaceIds.values().next().value

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
    if(!member){
        return NextResponse.json({message:"Unauthorized"},{status:401})
    }
    
    const updatedTasks = await Promise.all(
        tasks.map(async(task)=>{
            const {$id, status, position} = task;
            return databases.updateDocument<Task>(
                DATABASE_ID,
                TASKS_ID,
                $id,
                {status,position}
            )
        })
    );
    return NextResponse.json({updatedTasks})
  } catch {
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 400 }
    );
  }
}
