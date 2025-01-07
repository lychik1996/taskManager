
import { DATABASE_ID, IMAGES_BUCKET_ID, TASKS_ID, WORKSPACES_ID } from '@/config';
import { MemberRole } from '@/features/members/types';
import { getMember } from '@/features/members/utils';
import { Task } from '@/features/tasks/types';
import { CheckSession } from '@/lib/checkSession';
import { NextRequest, NextResponse } from 'next/server';



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
    )
    const member = await getMember({
      databases,
      workspaceId:task.workspaceId,
      userId:user.$id

    })
    if (!member ) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    await databases.deleteDocument(
      DATABASE_ID,
      TASKS_ID,
      taskId
    )
   
    return NextResponse.json({data:{$id:task.$id}});
  } catch {
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 401 }
    );
  }
}
