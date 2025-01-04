"use client"; // This component is a client component

import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";

interface SessionProviderWrapperProps {
  children: ReactNode;
}

const SessionProviderWrapper = ({ children }: SessionProviderWrapperProps) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default SessionProviderWrapper;
