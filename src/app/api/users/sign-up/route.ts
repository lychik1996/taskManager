import { createAdminClient} from '@/lib/appwrite';
import { ID } from 'node-appwrite';
import { NextRequest, NextResponse } from 'next/server';
import { generateVerifyToken } from '@/lib/utils';
import { DATABASE_ID, PUBLIC_APP, VERIFICATION_TOKENS_ID } from '@/config';
import { sendEmail } from '@/lib/nodemailer';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();
    const { account,databases } = await createAdminClient();
   
    const user = await account.create(ID.unique(), email, password, name);
    const session = await account.createEmailPasswordSession(email, password);
    
    const token = generateVerifyToken();
    
    const tokenField = await databases.createDocument(
      DATABASE_ID,
      VERIFICATION_TOKENS_ID,
      ID.unique(),
      {
        userId:user.$id,
        token,
      }
    );
    const verificationUrl = `${PUBLIC_APP}verify-email/${token}`;
    await sendEmail({
      subject:"Verfication account",
      to:user.email,
      html:`<p>Copy your link for verification:</p><p>${verificationUrl}</p>`
    });
    const res = NextResponse.json({ data: user });
    res.cookies.set('session', session.secret, {
      maxAge: 60 * 60 * 24 * 30,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });
    return res;
  } catch (error) {
    console.error('Error in registration:', error);
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 401 }
    );
  }
}
