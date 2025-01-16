import { DATABASE_ID, VERIFICATION_TOKENS_ID } from '@/config';
import { TokenType } from '@/features/auth/types';
import { CheckSession } from '@/lib/checkSession';
import { NextRequest, NextResponse } from 'next/server';
import { Query } from 'node-appwrite';

export async function GET(
  req: NextRequest,
) {
  try {
    const context = await CheckSession();

    if (!context) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const databases = context.databases;
    const user = context.user;
    const tokenDocuments = await databases.listDocuments<TokenType>(
      DATABASE_ID,
      VERIFICATION_TOKENS_ID,
      [Query.equal('userId', user.$id)]
    );
    let tokenField: TokenType | null | undefined =
      tokenDocuments.total > 0 ? tokenDocuments.documents[0] : null;

    if (!tokenField) {
      return NextResponse.json(
        { message: 'Failed to get checking token' },
        { status: 400 }
      );
    }
    let updateAt = new Date(tokenField.$updatedAt);
    let now = new Date();
    let diffTime = now.getTime() - updateAt.getTime();
    let timeDiffSeconds = Math.floor(diffTime/1000); 
    if(timeDiffSeconds>120){
        return NextResponse.json({message:"Time diff more then 2 mins"},{status:400});
    }
    return NextResponse.json({timeDiffSeconds});
  } catch (e) {
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 400 }
    );
  }
}
