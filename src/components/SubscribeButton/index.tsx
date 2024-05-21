"use client";
import { signIn, useSession, signOut } from "next-auth/react";

import styles from "./styles.module.scss";
import { api } from "../../app/services/api";
import { getStripeJs } from "../../app/services/stripe-js";
import { headers } from "next/headers";

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

    const { data } = await api.post("/subscribe");

    console.log("test data ===", data);

    // window.location.assign(data);

    // const stripe = await getStripeJs();

    // await stripe?.redirectToCheckout(data);
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
