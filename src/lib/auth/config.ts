import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { authCallbacks } from "./callback";

export const authConfig: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: authCallbacks,
};