import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { authCallbacks } from "./callback";

export const authConfig: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          redirect_url: `${process.env.NEXTAUTH_URL}/api/auth/callback/google`,
        },
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: authCallbacks,
};