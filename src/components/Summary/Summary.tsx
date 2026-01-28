import { Car } from '@/models/Car';
import { SearchParams } from '@/models/SearchParams';
import styles from './Summary.module.css';


interface SummaryProps {
  selectedCar: Car | null;
  searchParams: SearchParams | null;
  onCancel?: () => void;
}

export function Summary({ selectedCar, searchParams, onCancel }: SummaryProps) {
  if (!selectedCar || !searchParams) {
    return null;
  }

 //calculo de renta
 
  const pickupDate = new Date(searchParams.pickupDate);
  const dropoffDate = new Date(searchParams.dropoffDate);


  const diffTime = dropoffDate.getTime() - pickupDate.getTime();
  const calculatedDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));


  const days = calculatedDays <= 0 ? 1 : calculatedDays;
  const isMinimumApplied = calculatedDays <= 0;


  const totalPrice = selectedCar.pricePerDay * days;

  const handleCancelClick = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div
      className={styles.summary}
      role="complementary"
      aria-label="Resumen de reserva"
      onClick={(e) => e.stopPropagation()} // Prevenir que clicks dentro del summary cancelen la selección
    >
      <div className={styles.header}>
        <h2 className={styles.title}>Resumen de tu Reserva</h2>
        {onCancel && (
          <button
            onClick={handleCancelClick}
            className={styles.cancelButton}
            aria-label="Cancelar selección"
          >
            ✕
          </button>
        )}
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Vehículo Seleccionado</h3>
        <p className={styles.carName}>{selectedCar.name}</p>
        {selectedCar.category && (
          <p className={styles.category}>{selectedCar.category}</p>
        )}
        {selectedCar.location && (
          <p className={styles.location}>📍 {selectedCar.location}</p>
        )}
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Detalles de Renta</h3>
        <div className={styles.detail}>
          <span>Ubicación:</span>
          <span>{searchParams.city}</span>
        </div>
        <div className={styles.detail}>
          <span>Recogida:</span>
          <span>{new Date(searchParams.pickupDate).toLocaleDateString('es-ES')}</span>
        </div>
        <div className={styles.detail}>
          <span>Devolución:</span>
          <span>{new Date(searchParams.dropoffDate).toLocaleDateString('es-ES')}</span>
        </div>
        <div className={styles.detail}>
          <span>Días:</span>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span>{days}</span>
            {isMinimumApplied && (
              <span className={styles.minDaysNotice}>(Mínimo 1 día)</span>
            )}
          </div>
        </div>
      </div>

      <div className={styles.total}>
        <span className={styles.totalLabel}>Precio Total:</span>
        <span className={styles.totalAmount}>
          {selectedCar.currency} {totalPrice.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
