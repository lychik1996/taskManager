import { AdditionalContext, CheckSession } from '@/lib/checkSession';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {

  const context = await CheckSession();
  if (!context) {
    return NextResponse.json({message:"Unauthorized"},{status:401})
  }
  return NextResponse.json(context.user);
}