"use client";
import styles from "./styles.module.scss";
import { FaGithub } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import { signIn, useSession, signOut } from "next-auth/react";
import Image from "next/image";

export function SignInButton() {
  const { data: session, status } = useSession();

  if (status === "authenticated") {
    return (
      <div>
        <button
          type="button"
          onClick={() => signOut()}
          className={styles.signInButton}
        >
          <FaGithub color="#04d361" />
          Augusto Machado
          <FiX color="#737380" className={styles.closeIcon} />
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => signIn("github")}
        className={styles.signInButton}
      >
        <FaGithub color="#eba417" />
        Sign in Github
      </button>
    </div>
  );
}
