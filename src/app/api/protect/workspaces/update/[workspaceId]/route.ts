import { DATABASE_ID, IMAGES_BUCKET_ID, WORKSPACES_ID } from '@/config';
import { MemberRole } from '@/features/members/types';
import { getMember } from '@/features/members/utils';
import { CheckSession } from '@/lib/checkSession';
import { NextRequest, NextResponse } from 'next/server';
import { ID } from 'node-appwrite';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ workspaceId: string }> }
) {
  try {
    const formData = await req.formData();
    const name = formData.get('name') as string;
    const image = formData.get('image');
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

    const { databases, storage, user } = context;

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });

    if (!member || member.role !== MemberRole.ADMIN) {
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
      const currentWorkspace = await databases.getDocument(
        DATABASE_ID,
        WORKSPACES_ID,
        workspaceId
      );
      uploadedImageUrl = currentWorkspace.imageUrl;
    }

    const workspace = await databases.updateDocument(
      DATABASE_ID,
      WORKSPACES_ID,
      workspaceId,
      {
        name,
        imageUrl: uploadedImageUrl,
      }
    );

    return NextResponse.json(workspace);
  } catch (error) {
    console.error('Error updating workspace:', error);
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    );
  }
}
