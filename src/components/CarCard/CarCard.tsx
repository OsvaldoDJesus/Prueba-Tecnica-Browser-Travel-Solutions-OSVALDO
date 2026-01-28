import { Car } from '@/models/Car';
import styles from './CarCard.module.css';


interface CarCardProps {
  car: Car;
  onSelect: (car: Car) => void;
  isSelected: boolean;
}

export function CarCard({ car, onSelect, isSelected }: CarCardProps) {
  const handleSelect = () => {
    onSelect(car);
  };

  return (
    <div
      className={`${styles.card} ${isSelected ? styles.selected : ''}`}
      role="listitem"
    >
      <div className={styles.header}>
        <h3 className={styles.name}>{car.name}</h3>
        {car.category && (
          <span className={styles.category}>{car.category}</span>
        )}
      </div>

      {car.location && (
        <div className={styles.location}>
          📍 {car.location}
        </div>
      )}

      {car.features && car.features.length > 0 && (
        <ul className={styles.features}>
          {car.features.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
      )}

      <div className={styles.footer}>
        <div className={styles.price}>
          <span className={styles.amount}>
            {car.currency} {car.pricePerDay.toFixed(2)}
          </span>
          <span className={styles.period}>/ día</span>
        </div>
        <button
          onClick={handleSelect}
          className={styles.button}
          aria-pressed={isSelected}
        >
          {isSelected ? 'Seleccionado' : 'Seleccionar'}
        </button>
      </div>
    </div>
  );
}
