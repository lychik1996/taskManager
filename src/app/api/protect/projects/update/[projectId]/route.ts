import { DATABASE_ID, IMAGES_BUCKET_ID, PROJECTS_ID } from '@/config';
import { getMember } from '@/features/members/utils';
import { Project } from '@/features/projects/types';
import { CheckSession } from '@/lib/checkSession';
import { NextRequest, NextResponse } from 'next/server';
import { ID } from 'node-appwrite';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;
    const formData = await req.formData();
    const name = formData.get('name') as string;
    const image = formData.get('image') as File;
    if (!projectId) {
      return NextResponse.json(
        { message: 'ProjectId is missing' },
        { status: 401 }
      );
    }
    const context = await CheckSession();
    if (!context) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const databases = context.databases;
    const storage = context.storage;
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

    let uploadedImageUrl: string | undefined;
    if (image instanceof File) {
      const file = await storage.createFile(
        IMAGES_BUCKET_ID,
        ID.unique(),
        image
      );
      const arrayBuffer = await storage.getFilePreview(
        IMAGES_BUCKET_ID,
        file.$id
      );
      uploadedImageUrl = `data:image/png;base64,${Buffer.from(
        arrayBuffer
      ).toString('base64')}`;
    } else if (image === null) {
      uploadedImageUrl = '';
    } else {
      uploadedImageUrl = existingProject.imageUrl;
    }

    const project = await databases.updateDocument(
      DATABASE_ID,
      PROJECTS_ID,
      projectId,
      {
        name,
        imageUrl: uploadedImageUrl,
      }
    );
    return NextResponse.json(project);
  } catch {
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 401 }
    );
  }
}
