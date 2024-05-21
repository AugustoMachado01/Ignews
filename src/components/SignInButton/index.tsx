"use client";
import styles from "./styles.module.scss";
import { FaGithub } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import { signIn, useSession, signOut } from "next-auth/react";

export function SignInButton() {
  const { data: session, status } = useSession();

  if (status === "authenticated") {
    return (
      <button
        type="button"
        onClick={() => signOut()}
        className={styles.signInButton}
      >
        <FaGithub color="#04d361" />
        {session.user?.name}
        <FiX color="#737380" className={styles.closeIcon} />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => signIn("github")}
      className={styles.signInButton}
    >
      <FaGithub color="#eba417" />
      Sign in Github
    </button>
  );
}
