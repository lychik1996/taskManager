import { DATABASE_ID, IMAGES_BUCKET_ID, WWORKSPACES_ID } from '@/config';
import { CheckSession } from '@/lib/checkSession';
import { NextRequest, NextResponse } from 'next/server';
import { ID } from 'node-appwrite';

export async function POST(req: NextRequest) {
  try {
    const context = await CheckSession(req);
    if (!context) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const databases = context.databases;
    const storage = context.storage;
    const user = context.user;

    const formData = await req.formData();
    const  name = formData.get("name") as string;
    const image = formData.get("image") as File;
    
    console.log(name)
    let uploadedImageUrl:string|undefined;
    if(image instanceof File){
      console.log(image)
      const file = await storage.createFile(
        IMAGES_BUCKET_ID,
        ID.unique(),
        image
      );
      const arrayBuffer = await storage.getFilePreview(
        IMAGES_BUCKET_ID,
        file.$id
      );
      uploadedImageUrl =`data:image/png;base64,${Buffer.from(arrayBuffer).toString("base64")}`
    }
    
    const workspace = await databases.createDocument(
      DATABASE_ID,
      WWORKSPACES_ID,
      ID.unique(),
      {
        name,
        userId: user.$id,
        imageUrl:uploadedImageUrl,
      }
    );
    console.log(2)
    return NextResponse.json({ data: workspace });
  } catch {
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 401 }
    );
  }
}
