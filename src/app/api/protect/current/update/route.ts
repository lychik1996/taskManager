import { createAdminClient } from '@/lib/appwrite';
import { CheckSession } from '@/lib/checkSession';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(req: NextRequest) {
  try {
    const { name, newPassword } = await req.json();
    const context = await CheckSession();
    const { users } = await createAdminClient();
    if (!context) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const acconut = context.account;
    const user = context.user;
    if (name) {
      await acconut.updateName(name);
    }
    if (newPassword && user) {
      await users.updatePassword(user.$id, newPassword);
    }

    return NextResponse.json({ message: 'Update user successed' });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    );
  }
}
