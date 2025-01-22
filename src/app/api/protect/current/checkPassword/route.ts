import { createAdminClient } from '@/lib/appwrite';
import { CheckSession } from '@/lib/checkSession';
import { NextRequest, NextResponse } from 'next/server';
import argon2 from 'argon2';

export async function POST(req: NextRequest) {
  try {
    const { oldPassword } = await req.json();
    
    const context = await CheckSession();
    const { users } = await createAdminClient();
    if (!context) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const user = context.user;

    const userDb = await users.get(user.$id);
    const hashedPassfromDb = userDb.password;
    if (!hashedPassfromDb) {
      return NextResponse.json({ isPasswordValid: false});
    }
    const isPasswordValid = await argon2.verify(hashedPassfromDb, oldPassword);
    return NextResponse.json({ isPasswordValid });
  } catch {
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 400 }
    );
  }
}
