import { headers } from "next/headers";
import { stripe } from "@/services/pricing";

import Stripe from "stripe";
import { NextResponse } from "next/server";
import { saveSubscription } from "../manageSubscription";

export async function POST(req: Request) {
  const payload = await req.text();
  const secret = headers().get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      secret!,
      process.env.STRIPE_WEBHOOKS_SECRET
    );

    const { type } = event;

    if (type) {
      switch (type) {
        case "checkout.session.completed":
          const checkoutSession = event.data.object as Stripe.Checkout.Session;
          if (checkoutSession.subscription && checkoutSession.customer) {
            await saveSubscription(
              checkoutSession.subscription.toString(),
              checkoutSession.customer.toString()
            );
          }
          break;
        default:
          throw Error("Unhandled event.");
      }
    }
  } catch (err: any) {
    return NextResponse.json({ error: "webhook handler failed" });
  }
  return new NextResponse("received", { status: 200 });
}

// async function handler(req: NextRequest) {
//   // const buf = await buffer(req.text());

//   const payload = await req.text();
//   const secret = headers().get("stripe-signature") as string;

//   let event: Stripe.Event | null = null

//   try {
//     event = stripe.webhooks.constructEvent(
//       payload,
//       secret!,
//       process.env.STRIPE_WEBHOOKS_SECRET
//     );

//     if (event?.type) {
//       console.log("event recebido", event);
//     }
//   } catch (err: any) {
//     if (err instanceof Error) {
//       console.log(err.message);

//       return new Response(
//         `webhook signature verification failed ${err.message}`,
//         { status: 400 }
//       );
//     }
//   }

//   return new NextResponse("received", { status: 200 });
// }
// export default handler;
