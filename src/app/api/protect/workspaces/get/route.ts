import { DATABASE_ID, WWORKSPACES_ID } from '@/config';
import { CheckSession } from '@/lib/checkSession';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const context = await CheckSession(req);
    if (!context) {
      return NextResponse.json({ message: 'Unautarized' }, { status: 401 });
    }
    const databases = context.databases;

    const workspaces = await databases.listDocuments(
        DATABASE_ID,
        WWORKSPACES_ID
    )
    return NextResponse.json({workspaces})
  } catch {
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 401 }
    );
  }
}
