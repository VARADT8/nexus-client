import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import fs from 'fs';
import path from 'path';

// Local JSON file-based user storage (replaces @vercel/postgres for local development)
const USERS_FILE = path.join(process.cwd(), 'users.json');

function getUsers(): Array<{ email: string; password: string; answer: string; id: number }> {
  try {
    if (fs.existsSync(USERS_FILE)) {
      const data = fs.readFileSync(USERS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading users file:', error);
  }
  return [];
}

const handler = NextAuth({
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/pages/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    // Google, Facebook, Twitter OAuth removed for local development
    // (they require valid client IDs/secrets from their respective developer consoles)

    CredentialsProvider({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const users = getUsers();
        const user = users.find((u) => u.email === credentials?.email);

        if (!user) {
          console.log('User not found:', credentials?.email);
          return null;
        }

        const passwordCorrect = await compare(
          credentials?.password || '',
          user.password
        );
        console.log({ passwordCorrect });

        if (passwordCorrect) {
          return {
            id: String(user.id),
            email: user.email,
          };
        }
        return null;
      },
    }),
  ],
});

export { handler as GET, handler as POST };