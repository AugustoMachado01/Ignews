import { headers } from "next/headers";
import { stripe } from "@/services/pricing";
import { Readable } from "stream";
import Stripe from "stripe";

const relevantEvents = new Set(["checkout.session.completed"]);

async function handler(req: Request) {
  const body = await req.text();

  const signature = headers().get("Stripe-Signature") ?? "";

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOKS_SECRET
    );
  } catch (err: any) {
    return new Response(
      `webhooks Error: ${err instanceof Error ? err.message : "Unknown Error"}`,
      { status: 404 }
    );
  }
  const session = event.data.object as Stripe.Checkout.Session;
}
