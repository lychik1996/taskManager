import { DATABASE_ID, WWORKSPACES_ID } from '@/config';
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

    const user = context.user;

    const { name } = await req.json();
    const workspace = await databases.createDocument(
      DATABASE_ID,
      WWORKSPACES_ID,
      ID.unique(),
      {
        name,
        userId: user.$id,
      }
    );
    return NextResponse.json({ data: workspace });
  } catch {
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 401 }
    );
  }
}
