import { CheckSession } from '@/lib/checkSession';

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const context = await CheckSession();
    if (!context) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const account = context.account;

    await account.deleteSession('current');
    const response = NextResponse.json({ success: 'true' });
    response.cookies.delete('session');
    return response;
  } catch {
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 401 }
    );
  }
}
