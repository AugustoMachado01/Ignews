"use client";
import { signIn, useSession, signOut } from "next-auth/react";

import styles from "./styles.module.scss";
import { api } from "../../app/services/api";
import { getStripeJs } from "../../app/services/stripe-js";

interface SubscribeButtonProps {
  priceId: string;
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
  const { data: session } = useSession();

  async function handleSubscribe() {
    if (!session) {
      signIn("github");
      return;
    }

    try {
      const response = await api.post("/subscribe");

      const { sessionId } = response.data;

      console.log("session ==", sessionId);

      // window.location.assign(data);

      const stripe = await getStripeJs();

      await stripe?.redirectToCheckout({ sessionId });
    } catch (error: any) {
      console.log("erro in subscribe", error.message);
      alert(error.message);
    }
  }
  return (
    <button
      type="button"
      className={styles.subscribeButton}
      onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  );
}
