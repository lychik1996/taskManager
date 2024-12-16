
import { createAdminClient } from "@/lib/appwrite";

import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    try{
        const {email, password} =await req.json()
        const {account} = await createAdminClient();
        const session = await account.createEmailPasswordSession(
            email,
            password
        )
        const res = NextResponse.json({success:true});
        res.cookies.set('session',session.secret,{
            maxAge: 60 * 60 * 24 * 30,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
          })
          return res; 
    }catch{
        return NextResponse.json({message:"Something went wrong"},{status:401})
    }
}