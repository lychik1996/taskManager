import { DATABASE_ID, MEMBERS_ID, WWORKSPACES_ID } from '@/config';
import { cookies } from 'next/headers';
import { Account, Client, Databases, Query } from 'node-appwrite';

export const getWorkspaces = async () => {
  try {
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

    const session = await cookies();

    const cookie = session.get('session');

    if (!cookie) {
      return { documents: [], total: 0 };
    }
    client.setSession(cookie.value);
    const databases = new Databases(client);
    const account = new Account(client);
    const user = await account.get();

    const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
      Query.equal('userId', user.$id),
    ]);
    if (members.total === 0) {
      return { documents: [], total: 0 };
    }
    const workspaceIds = members.documents.map((member) => member.workspaceId);

    const workspaces = await databases.listDocuments(
      DATABASE_ID,
      WWORKSPACES_ID,
      [Query.orderDesc('$createdAt'), Query.contains('$id', workspaceIds)]
    );
    return workspaces;
  } catch {
    return { documents: [], total: 0 };
  }
};
