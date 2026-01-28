import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectCar, hydrateFromSSR, clearSelection, clearResults } from '@/store/slices/carsSlice';
import { CarList } from '@/components/CarList/CarList';
import { Summary } from '@/components/Summary/Summary';
import { Loading } from '@/components/Loading/Loading';
import { Error } from '@/components/Error/Error';
import { SearchParams } from '@/models/SearchParams';
import { Car } from '@/models/Car';
import { searchCars } from '@/services/carService';
import styles from '@/styles/Results.module.css';

//Props que recibe la página desde getServerSideProps

interface ResultsPageProps {
  initialCars: Car[];
  searchParams: SearchParams;
  initialError?: string | null;
}

//Página de resultados de búsqueda
//Implementa SSR para cargar datos iniciales desde el servidor
//Hidrata el estado de Redux con los resultados obtenidos

export default function Results({ initialCars, searchParams, initialError }: ResultsPageProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { results, selectedCar, loading, error } = useAppSelector(
    (state) => state.cars
  );

  /**
   * Client-side hydration: Sincroniza los datos obtenidos via SSR con el store global de Redux.
   * Se ejecuta siempre que cambien los datos del servidor para asegurar consistencia del estado.
   * Evita duplicidad de peticiones al inicializar el estado del cliente con el 'initialCars' provisto.
   */

  useEffect(() => {
    dispatch(
      hydrateFromSSR({
        cars: initialCars,
        params: searchParams,
        error: initialError,
      })
    );
  }, [dispatch, initialCars, searchParams, initialError]);


  const handleSelectCar = (car: Car) => {
    dispatch(selectCar(car));
  };

  //limpiador
  const handleClearSelection = () => {
    dispatch(clearSelection());
  };

  //Limpia el estado global y retorna al flujo de búsqueda inicial.
  const handleNewSearch = () => {
    dispatch(clearResults());
    router.push('/');
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <main className={styles.main}>
          <Loading />
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <main className={styles.main}>
          <Error message={error} />
          <button onClick={handleNewSearch} className={styles.backButton}>
            Nueva Búsqueda
          </button>
        </main>
      </div>
    );
  }

  // Intersección de datos entre el store (cliente) y props (servidor)
  const carsToShow = results.length > 0 ? results : initialCars;

  // Handler para click fuera del summary y de las cards
  const handleClickOutside = (e: React.MouseEvent) => {
    if (!selectedCar) return;

    const target = e.target as HTMLElement;
    const isSummary = target.closest(`.${styles.summarySection}`);
    const isCard = target.closest('[role="listitem"]');
    const isButton = target.closest('button');

    // Solo cancelar si no se hace click en summary, card o botón
    if (!isSummary && !isCard && !isButton) {
      handleClearSelection();
    }
  };

  return (
    <div className={styles.container} onClick={handleClickOutside}>
      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>Vehículos Disponibles</h1>
          <button onClick={handleNewSearch} className={styles.backButton}>
            Nueva Búsqueda
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.resultsSection}>
            <p className={styles.location}>
              Ubicación: <strong>{searchParams.city}</strong>
            </p>
            <p className={styles.dates}>
              {new Date(searchParams.pickupDate).toLocaleDateString('es-ES')} -{' '}
              {new Date(searchParams.dropoffDate).toLocaleDateString('es-ES')}
            </p>
            {carsToShow.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <Error
                  icon="🚗💨"
                  message="¡Lo sentimos!"
                  description={`Actualmente no tenemos vehículos disponibles en "${searchParams.city}" para las fechas seleccionadas.`}
                />
                <button
                  onClick={handleNewSearch}
                  style={{
                    padding: '0.75rem 2rem',
                    background: '#0f172a',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)'
                  }}
                >
                  Realizar Nueva Búsqueda
                </button>
              </div>
            ) : (
              <CarList
                cars={carsToShow}
                onSelectCar={handleSelectCar}
                selectedCarId={selectedCar?.id}
              />
            )}
          </div>

          {selectedCar && (
            <div className={styles.summarySection}>
              <Summary
                selectedCar={selectedCar}
                searchParams={searchParams}
                onCancel={handleClearSelection}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

/**
 * getServerSideProps: Implementación de Server-Side Rendering de Next.js.
 * Orquestamos la carga de datos en tiempo de ejecución de la solicitud antes del renderizado en cliente.
 *  
 * Flujo:
 * 1. Extracción de parámetros de búsqueda desde el context query.
 * 2. Validación de pre-condiciones.
 * 3. Fetching de datos via 'carService' (ejecución directa en server para evitar latencia HTTP mock).
 * 4. Inyección de props para hidratación inmediata del DOM.
 */
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { city, pickupDate, dropoffDate } = context.query;

  // Validamos que los parámetros requeridos estén presentes
  if (!city || !pickupDate || !dropoffDate) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  try {
    // parámetros de búsqueda
    const searchParams: SearchParams = {
      city: city as string,
      pickupDate: pickupDate as string,
      dropoffDate: dropoffDate as string,
    };

    try {
      const cars = await searchCars(searchParams);

      return {
        props: {
          initialCars: cars,
          searchParams,
          initialError: null,
        },
      };
    } catch (error: any) {

      const errorMessage = error?.message || 'Error al buscar vehículos';
      return {
        props: {
          initialCars: [],
          searchParams,
          initialError: errorMessage,
        },
      };
    }
  } catch (error) {
    return {
      redirect: {
        destination: '/?error=invalid_params',
        permanent: false,
      },
    };
  }
};
