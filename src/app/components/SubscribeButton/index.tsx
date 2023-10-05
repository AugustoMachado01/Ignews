"use client";
import { signIn, useSession } from "next-auth/react";
import styles from "./styles.module.scss";

import { stripe } from "@/services/pricing";

import { query as q } from "faunadb";
import { fauna } from "@/services/fauna";
import { checkout } from "@/app/api/subscribe";

interface SubscribeButtonProps {
  priceId: string;
}

type User = {
  ref: {
    id: string;
  };
  data: {
    stripe_customer_id: string;
  };
};

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
  const { data: session } = useSession();

  async function handleSubscribe() {
    const user = await fauna.query<User>(
      q.Get(
        q.Match(q.Index("user_by_email"), q.Casefold(session!.user!.email!))
      )
    );

    let customerId = user.data.stripe_customer_id;

    if (!customerId) {
      const stripeCustomer = await stripe.customers.create({
        email: session?.user?.email!,
      });

      await fauna.query(
        q.Update(q.Ref(q.Collection("users"), user.ref.id), {
          data: { stripe_customer_id: stripeCustomer.id },
        })
      );

      customerId = stripeCustomer.id;
    }

    checkout({
      customer: customerId,
      payment_method_types: ["card"],
      billing_address_collection: "required",
      lineItems: [{ price: "price_1Ns5aOIHY7irfuQ9O8WpX79M", quantity: 1 }],
    });
  }

  return (
    <button
      type="button"
      onClick={handleSubscribe}
      className={styles.subscribeButton}
    >
      Subscribe now
    </button>
  );
}
