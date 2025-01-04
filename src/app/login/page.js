import { useSession, signIn, signOut } from "next-auth/react";

export default function loginPage() {
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

