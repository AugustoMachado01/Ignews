"use client";
import { signIn, useSession } from "next-auth/react";
import styles from "./styles.module.scss";
import { api } from "@/services/api";
import { checkout } from "@/services/stripe-js";

interface SubscribeButtonProps {
  priceId: string;
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
  return (
    <button
      type="button"
      onClick={() => {
        checkout({
          lineItems: [{ price: "price_1Ns5aOIHY7irfuQ9O8WpX79M", quantity: 1 }],
        });
      }}
      className={styles.subscribeButton}
    >
      Subscribe now
    </button>
  );
}
