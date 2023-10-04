import { loadStripe } from "@stripe/stripe-js";

interface Props {
  lineItems: { price: string | undefined; quantity: number | undefined }[];
}
export async function checkout({ lineItems }: Props) {
  let stripePromise = null;

  function getStripeJs() {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

    return stripePromise;
  }

  const stripe = await getStripeJs();

  await stripe?.redirectToCheckout({
    mode: "subscription",
    lineItems,
    successUrl: `${window.location.origin}?session_id={CHECKOUT_SESSION_ID}`,
    cancelUrl: window.location.origin,
  });
}
