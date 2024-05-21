import styles from "./styles/home.module.scss";
import Image from "next/image";
import HomeSvg from "../../public/images/avatar.svg";
// import { SubscribeButton } from "../components/SubscribeButton";

import { stripe } from "../app/services/pricing";
import { SubscribeButton } from "../components/SubscribeButton";

interface HomeProps {
  product: {
    priceId: string;
    amount: string;
  };
}

export const getQuotes = async () => {
  const price = await stripe.prices.retrieve("price_1Ns5aOIHY7irfuQ9O8WpX79M");

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Number(price.unit_amount_decimal)),
  };

  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24,
  };
};

export default async function Home() {
  const { props } = await getQuotes();
  return (
    <main className={styles.contentContainer}>
      <section className={styles.hero}>
        <span>👏 Hey, welcome</span>
        <h1>
          News about the <span>React</span> world
        </h1>
        <p>
          Get acess to all the publicatons <br />
          <span>for {props.product.amount} month</span>
        </p>

        {props && <SubscribeButton priceId={props.product.priceId} />}
      </section>
      <Image src={HomeSvg} alt="Avatar" />
    </main>
  );
}
