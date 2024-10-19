import NextAuth, { DefaultUser } from "next-auth";
import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

type User = {
  id: string;
  authProvider: string;
  googleId: string;
  username: string;
  email: string;
  name: string;
  phoneNumber: string;
};

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user?: {
      id: string;
      authProvider: string;
      googleId: string;
      username: string;
      email: string;
      name: string;
      phoneNumber: string;
    };
  }

  interface User extends DefaultUser {
    accessToken?: string;
    user?: {
      id: string;
      authProvider: string;
      googleId: string;
      username: string;
      email: string;
      name: string;
      phoneNumber: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
  }
}

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account }) {
      const res = await fetch("http://localhost:3030/api/v1/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: account?.id_token }),
      });
      const data = await res.json();

      if (data.accessToken) {
        user.accessToken = data.accessToken;
        user.user = data.user;
        return true;
      } else {
        return false;
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.user = user.user;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.user = token.user as User;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
