import { signIn, useSession } from "next-auth/react";
import styles from "./styles.module.scss";

interface SubscribeButtonProps {
  //   onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  priceId: string;
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
  const { data: session, status } = useSession();
  if (status !== "authenticated") {
    signIn("github");
    return;
  }
  function handleSubsribe() {}
  return (
    <button
      type="button"
      onClick={handleSubsribe}
      className={styles.subscribeButton}
    >
      Subscribe now
    </button>
  );
}
