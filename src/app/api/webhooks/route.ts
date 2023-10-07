import { headers } from "next/headers";
import { stripe } from "@/services/pricing";

import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { buffer } from "node:stream/consumers";
import { NextApiRequest, NextApiResponse } from "next";
// import { Buffer } from "buffer";

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

    if (event.type) {
      console.log(event);
    }
  } catch (err: any) {
    return new NextResponse(
      `webhook signature verification failed ${err.message}`,
      { status: 400 }
    );
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
