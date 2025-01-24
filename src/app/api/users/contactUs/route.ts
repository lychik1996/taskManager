import { CONTACT_US, DATABASE_ID } from '@/config';
import { contactUsSchema } from '@/features/auth/schemas';
import { createAdminClient } from '@/lib/appwrite';

import { NextRequest, NextResponse } from 'next/server';
import { ID } from 'node-appwrite';
import { z } from 'zod';

export async function POST(req: NextRequest) {
  try {
    const { email, description }: z.infer<typeof contactUsSchema> =
      await req.json();

    if (!email || !description) {
      return NextResponse.json(
        { message: 'Failed to get email or description' },
        { status: 400 }
      );
    }
    const { databases } = await createAdminClient();
    await databases.createDocument(DATABASE_ID, CONTACT_US, ID.unique(), {
      email,
      description,
    });
    return NextResponse.json({ message: 'Sucessed send question' });
  } catch {
    return NextResponse.json(
      { message: 'something went wrong' },
      { status: 400 }
    );
  }
}
