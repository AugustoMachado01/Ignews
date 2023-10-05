import { stripe } from "@/services/pricing";
import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from "stream";
import Stripe from "stripe";

async function buffer(readable: Readable) {
  const chunks = [];

  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export const config = {
  api: {
    ReportBody: false,
  },
};

const relevantEvents = new Set(["checkout.session.completed"]);

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const buf = await buffer(req);
    const secret = req.headers["stripe-signature"];

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        buf,
        secret!,
        process.env.STRIPE_WEBHOOKS_SECRET
      );
    } catch (error: any) {
      return res.status(400).send(`webhooks error: ${error.message}`);
    }

    const { type } = event;

    if (relevantEvents.has(type)) {
      console.log("evento recebido", event);
    }

    res?.json({ received: true });
  } else {
    res?.setHeader("Allow", "POST");
    res?.status(405).end();
  }
}

export default handler;
