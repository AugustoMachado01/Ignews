import { stripe } from "../../services/pricing";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { fauna } from "../../services/fauna";
import { query as q } from "faunadb";
import { authOptions } from "../../lib/auth";

type User = {
  ref: {
    id: string;
  };
  data: {
    stripe_Customer_id: string;
  };
};

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  const user = await fauna.query<User>(
    q.Get(q.Match(q.Index("user_by_email"), q.Casefold(session!.user!.email!)))
  );

  let customerId = user.data.stripe_Customer_id;

  if (!customerId) {
    const stripeCustomer = await stripe.customers.create({
      email: session?.user?.email!,
    });

    await fauna.query(
      q.Update(q.Ref(q.Collection("users"), user.ref.id), {
        data: { stripe_Customer_id: stripeCustomer.id },
      })
    );

    customerId = stripeCustomer.id;
  }

  const stripecheckoutSession = await stripe.checkout.sessions.create({
    customer: stripeCustomer.id,
    payment_method_types: ["card"],
    billing_address_collection: "required",
    line_items: [{ price: "price_1Ns5aOIHY7irfuQ9O8WpX79M", quantity: 1 }],
    mode: "subscription",
    allow_promotion_codes: true,
    success_url: "http://localhost:3000",
    cancel_url: "http://localhost:3000",
  });

  return NextResponse.json({ sessionId: stripecheckoutSession.id });
}
