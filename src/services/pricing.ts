import Stripe from "stripe";
import { version } from "../../package.json";

export const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_API_KEY, {
  apiVersion: "2023-08-16",
  appInfo: {
    name: "Ignews",
    version,
  },
});
