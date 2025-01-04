"use client";

import { useSession, signIn, signOut } from "next-auth/react";

const LoginPage = () => {
  const { data: session } = useSession();

  return (
    <div>
      {!session ? (
        <>
          <p>You are not logged in</p>
          <button onClick={() => signIn()}>Sign in</button>
        </>
      ) : (
        <>
          <p>Welcome, {session.user.name}</p>
          <button onClick={() => signOut()}>Sign out</button>
        </>
      )}
    </div>
  );
};

export default LoginPage;
