import { Car } from '@/models/Car';
import { CarCard } from '../CarCard/CarCard';
import styles from './CarList.module.css';


interface CarListProps {
  cars: Car[];
  onSelectCar: (car: Car) => void;
  selectedCarId?: string | null;
}

export function CarList({ cars, onSelectCar, selectedCarId }: CarListProps) {
  // El mensaje de "no hay vehículos" se maneja en la página de resultados
  // Este componente solo renderiza la lista si hay vehículos
  if (cars.length === 0) {
    return null;
  }

  return (
    <div className={styles.list} role="list">
      {cars.map((car) => (
        <CarCard
          key={car.id}
          car={car}
          onSelect={onSelectCar}
          isSelected={selectedCarId === car.id}
        />
      ))}
    </div>
  );
}
