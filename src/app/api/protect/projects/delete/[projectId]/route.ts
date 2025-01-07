import {
  DATABASE_ID,
  IMAGES_BUCKET_ID,
  PROJECTS_ID,
  WORKSPACES_ID,
} from '@/config';
import { MemberRole } from '@/features/members/types';
import { getMember } from '@/features/members/utils';
import { Project } from '@/features/projects/types';
import { CheckSession } from '@/lib/checkSession';
import { NextRequest, NextResponse } from 'next/server';


export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;
    console.log(projectId)
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
    //TODO: Delete  tasks
    await databases.deleteDocument(DATABASE_ID, PROJECTS_ID, projectId);

    return NextResponse.json({ data: { $id: existingProject.workspaceId } });
  } catch {
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 401 }
    );
  }
}
