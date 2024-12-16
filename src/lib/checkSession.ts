
import { NextRequest } from 'next/server';
import {
  Client,
  Account,
  Databases,
  Storage,
  type Account as AccountType,
  type Databases as DatabasesType,
  type Storage as StoregeType,
  Models,
} from 'node-appwrite';

export type AdditionalContext = {
  account: AccountType;
  databases: DatabasesType;
  storage: StoregeType;
  user: Models.User<Models.Preferences>;
};

export async function CheckSession(req:NextRequest): Promise<AdditionalContext | null> {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

  const session = req.cookies.get('session');

  if (!session) {
    return null;
  }

  client.setSession(session.value);

  const account = new Account(client);
  const databases = new Databases(client);
  const storage = new Storage(client);

  try {
    const user = await account.get();
    const context: AdditionalContext = {
      user,
      account,
      databases,
      storage,
    };
    return context;
  } catch {
    return null
  }
}