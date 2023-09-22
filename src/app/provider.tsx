"use client";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

interface NNextAuthProviderProps {
  children: ReactNode | JSX.Element;
}

export const NextAuthProvider = ({ children }: NNextAuthProviderProps) => {
  return <SessionProvider>{children}</SessionProvider>;
};
