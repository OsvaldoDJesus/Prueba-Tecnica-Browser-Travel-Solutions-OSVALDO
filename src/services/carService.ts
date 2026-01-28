import { Car } from '@/models/Car';
import { SearchParams } from '@/models/SearchParams';
import { getMockCars } from './mockData';

// abstracción para el fetching de datos de flota.
// Implementa una estrategia híbrida: ejecución directa en servidor para SSR
// y llamadas via fetch en el cliente para interacciones post-hidración.
export const searchCars = async (params: SearchParams): Promise<Car[]> => {
  // Si estamos en el servidor, llamar directamente a la función mock
  if (typeof window === 'undefined') {
    return getMockCars(params);
  }

  // Si estamos en el cliente, usar fetch
  const queryParams = new URLSearchParams({
    city: params.city,
    pickupDate: params.pickupDate,
    dropoffDate: params.dropoffDate,
  });

  const response = await fetch(`/api/search-cars?${queryParams.toString()}`);

  if (!response.ok) {
    throw new Error('Error al buscar vehículos');
  }

  const data = await response.json();
  return data.cars;
};
