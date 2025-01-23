import { createAdminClient } from '@/lib/appwrite';
import { CheckSession } from '@/lib/checkSession';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(req: NextRequest) {
  try {
    const context = await CheckSession();
    const { users } = await createAdminClient();
    if (!context) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const user = context.user;
    const account = context.account;

    await account.deleteSession('current');
    await users.delete(user.$id);

    const response = NextResponse.json({
      message: 'User deleted successfully',
    });
    response.cookies.delete('session');

    return response;
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 401 }
    );
  }
}
