
import { createAdminClient } from '@/lib/appwrite';
import { ID } from 'node-appwrite';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req:NextRequest) {
    try {
      const { name, email, password } = await req.json();
      const { account } = await createAdminClient();
      const user = await account.create(ID.unique(), email, password, name);
      const session = await account.createEmailPasswordSession(email, password);

      const res = NextResponse.json({data:user});
      res.cookies.set('session', session.secret,{
        maxAge: 60 * 60 * 24 * 30,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
      });
      return res;  
    } catch (error) {
      console.error("Error in registration:", error);
      return NextResponse.json({ message: 'Something went wrong' },{status:401});
    }
  }
