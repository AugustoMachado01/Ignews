import { getSession } from "next-auth/react";
// import getSession from "next-auth/next";
import { stripe } from "../../services/pricing";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { fauna } from "../../services/fauna";
import { query as q } from "faunadb";
import { NextApiRequest, NextApiResponse } from "next";
import { auth } from "../../utils/auth";
import { authOptions } from "../../lib/auth";

type User = {
  ref: {
    id: string;
  };
};

export async function POST(req: NextApiRequest) {
  // console.log("props da request 123 ===", req);

  // const { req, res } = request;

  const session = await getServerSession(authOptions);

  console.log("session email =====", session);

  // console.log("props do request ===", request);

  // const session = await auth(req);

  // if (session) {
  //   console.log("entrou ====", session);
  // }

  // const stripeCustomer = await stripe.customers.create({
  //   email: session?.user?.email!,
  // });

  // const user = await fauna.query<User>(
  //   q.Get(q.Match(q.Index("user_by_email"), q.Casefold(session!.user!.email!)))
  // );

  // await fauna.query(
  //   q.Update(q.Ref(q.Collection("users"), user.ref.id), {
  //     data: { stripe_Customer_id: stripeCustomer.id },
  //   })
  // );

  const stripecheckoutSession = await stripe.checkout.sessions.create({
    // customer: stripeCustomer.id,
    payment_method_types: ["card"],
    billing_address_collection: "required",
    line_items: [{ price: "price_1Ns5aOIHY7irfuQ9O8WpX79M", quantity: 1 }],
    mode: "subscription",
    allow_promotion_codes: true,
    success_url: "http://localhost:3000",
    cancel_url: "http://localhost:3000",
  });

  // console.log("stripecheckoutSession ====", stripecheckoutSession);

  return NextResponse.json(stripecheckoutSession.url);
}
