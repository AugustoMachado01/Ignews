import Stripe from "stripe";

export const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_API_KEY, {
  apiVersion: "2023-08-16",
  appInfo: {
    name: "Ignews",
  },
  typescript: true,
});
