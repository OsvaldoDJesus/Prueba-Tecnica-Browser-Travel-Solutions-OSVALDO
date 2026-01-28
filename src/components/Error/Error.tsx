import styles from './Error.module.css';

interface ErrorProps {
  message: string;
  description?: string;
  icon?: string;
}

export function Error({ message, description, icon = '⚠️' }: ErrorProps) {
  return (
    <div className={styles.container} role="alert" aria-live="polite">
      <div className={styles.icon}>{icon}</div>
      <h2 className={styles.message}>{message}</h2>
      {description && <p className={styles.description}>{description}</p>}
    </div>
  );
}
