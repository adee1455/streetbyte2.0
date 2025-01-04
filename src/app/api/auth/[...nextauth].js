   // pages/api/auth/[...nextauth].js
   import NextAuth from "next-auth";
   import GoogleProvider from "next-auth/providers/google";

   export default NextAuth({
     providers: [
       GoogleProvider({
         clientId: process.env.GOOGLE_CLIENT_ID,
         clientSecret: process.env.GOOGLE_CLIENT_SECRET,
       }),
       // Add more providers as needed
     ],
     // Optional: Add a database adapter if you want to store users
     // database: process.env.DATABASE_URL,
   });