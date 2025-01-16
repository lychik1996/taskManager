import { DATABASE_ID, VERIFICATION_TOKENS_ID } from '@/config';
import { TokenType } from '@/features/auth/types';
import { createAdminClient } from '@/lib/appwrite';
import { CheckSession } from '@/lib/checkSession';
import { NextRequest, NextResponse } from 'next/server';
import { Query } from 'node-appwrite';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { users } = await createAdminClient();
    const context = await CheckSession();

    if (!context) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const { token } = await params;

    const databases = context.databases;
    const user = context.user;
    const tokenDocuments = await databases.listDocuments<TokenType>(
      DATABASE_ID,
      VERIFICATION_TOKENS_ID,
      [Query.equal('token', token)]
    );
    let tokenField: TokenType | null =
      tokenDocuments.total > 0 ? tokenDocuments.documents[0] : null;

    if (!tokenField) {
      return NextResponse.json(
        { message: 'Failed to get checking token' },
        { status: 400 }
      );
    }

    const updateVerification = await users.updateEmailVerification(
      user.$id,
      true
    );

    if (!updateVerification) {
      return NextResponse.json(
        { message: 'Failed to update user verification' },
        { status: 400 }
      );
    }
    await databases.deleteDocument(
      DATABASE_ID,
      VERIFICATION_TOKENS_ID,
      tokenField.$id
    );
    return NextResponse.json({ message: 'User verivication was successfuly' });
  } catch (e) {
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 400 }
    );
  }
}
