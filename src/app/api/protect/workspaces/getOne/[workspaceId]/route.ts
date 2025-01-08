import {
  DATABASE_ID,
  WORKSPACES_ID,
} from '@/config';
import { getMember } from '@/features/members/utils';

import { Workspace } from '@/features/workspaces/types';

import { CheckSession } from '@/lib/checkSession';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ workspaceId: string }> }
) {
  try {
    const { workspaceId } = await params;
    const context = await CheckSession();

    if (!context) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const databases = context.databases;
    const user = context.user;

    const workspace = await databases.getDocument<Workspace>(
      DATABASE_ID,
      WORKSPACES_ID,
      workspaceId
    );

    const member = await getMember({
      databases,
      workspaceId: workspace.$id,
      userId: user.$id,
    });

    if (!member) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({ workspace });
  } catch {
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 400 }
    );
  }
}
