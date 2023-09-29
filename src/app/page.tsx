"use client";

import styles from "./home.module.scss";
import { getSession } from "next-auth/react";

import Image from "next/image";
import HomeSvg from "../../public/images/avatar.svg";
import { metadata } from "./layout";
import { SubscribeButton } from "./components/SubscribeButton";
import { useEffect, useState } from "react";
import { stripe } from "@/services/pricing";

interface DataProps {
  priceId: string;
  amount: string;
}

export default function Home() {
  const [prices, setPrices] = useState<DataProps | null>(null);

  useEffect(() => {
    fetchPrices();
  }, []);

  async function fetchPrices() {
    const price = await stripe.prices.retrieve(
      "price_1Ns5aOIHY7irfuQ9O8WpX79M",
      { expand: ["product"] }
    );

    const product = {
      priceId: price.id,
      amount: new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(Number(price.unit_amount_decimal)),
    };

    setPrices(product);
  }

  return (
    <main className={styles.contentContainer}>
      <section className={styles.hero}>
        <span>👏 Hey, welcome</span>
        <h1>
          News about the <span>React</span> world
        </h1>
        <p>
          Get acess to all the publicatons <br />
          {prices && <span>for {prices?.amount} month</span>}
        </p>

        {prices && <SubscribeButton priceId={prices!.priceId} />}
      </section>
      <Image src={HomeSvg} alt="Avatar" />
    </main>
  );
}
