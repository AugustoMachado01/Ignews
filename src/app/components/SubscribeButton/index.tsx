import styles from "./styles.module.scss";

interface SubscribeButtonProps {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  priceId: string;
}

export function SubscribeButton({ onClick, priceId }: SubscribeButtonProps) {
  return (
    <button type="button" onClick={onClick} className={styles.subscribeButton}>
      Subscribe now
    </button>
  );
}
