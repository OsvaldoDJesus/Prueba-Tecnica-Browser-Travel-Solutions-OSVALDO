import styles from './Loading.module.css';

export function Loading() {
  return (
    <div className={styles.container} role="status" aria-label="Cargando">
      <div className={styles.spinner}></div>
      <p className={styles.text}>Buscando vehículos disponibles...</p>
    </div>
  );
}
