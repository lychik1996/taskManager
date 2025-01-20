import { EmailContent, EmailVarian } from '@/components/email/email-content';
import { DATABASE_ID, PUBLIC_APP, VERIFICATION_TOKENS_ID } from '@/config';
import { TokenType } from '@/features/auth/types';
import { CheckSession } from '@/lib/checkSession';
import { sendEmail } from '@/lib/nodemailer';
import { generateVerifyToken } from '@/lib/utils';
import { render } from '@react-email/components';
import { NextRequest, NextResponse } from 'next/server';
import { Query } from 'node-appwrite';

export async function PATCH(req: NextRequest) {
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
    let tokenField: TokenType | null =
      tokenDocuments.total > 0 ? tokenDocuments.documents[0] : null;

    if (!tokenField) {
      return NextResponse.json(
        { message: 'Failed to checking token' },
        { status: 400 }
      );
    }
    const token = generateVerifyToken();
    await databases.updateDocument(
      DATABASE_ID,
      VERIFICATION_TOKENS_ID,
      tokenField.$id,
      {
        token,
      }
    );
    const verificationUrl = `${PUBLIC_APP}verify-email/${token}`;
    const html = await render(
      EmailContent({
        name: user.name,
        href: verificationUrl,
        variant: EmailVarian.RESEND_VERIFICATION,
      })
    );
    await sendEmail({
      subject: 'Verfication account',
      to: user.email,
      html,
    });
    return NextResponse.json({ message: 'Succesfully resend token' });
  } catch (e) {
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 400 }
    );
  }
}
