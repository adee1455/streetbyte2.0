import { JWT } from "next-auth/jwt"; // Import JWT type
import { User } from "next-auth"; // Import User type

export const authCallbacks = {
  async jwt({ token, user }: { token: JWT; user?: User }) { // Specify types here
    if (user) {
      token.id = user.id; // Ensure user.id is defined in your User type
      token.image = user.image;
    }
    return token;
  },
  // Other callbacks...
};