import { Car } from '@/models/Car';
import { SearchParams } from '@/models/SearchParams';
import { getLocationByName } from './locationService';

// Data Provider: Simula la persistencia y recuperación de datos de flota.
// Implementa lógica de filtrado por geolocalización y disponibilidad.
export function getMockCars(params: SearchParams): Car[] {
  // Verificar si la localidad existe
  const location = getLocationByName(params.city);

  if (!location) {
    return [];
  }

  // Datos mock realistas para un rent-a-car 
  const allMockCars: Car[] = [
    {
      id: '1',
      name: 'Toyota Corolla 2024',
      pricePerDay: 45.99,
      currency: 'USD',
      available: true,
      category: 'Económico',
      features: ['Aire acondicionado', 'Bluetooth', '4 puertas'],
      location: 'Miami, Florida',
    },
    {
      id: '2',
      name: 'Honda Civic 2024',
      pricePerDay: 49.99,
      currency: 'USD',
      available: true,
      category: 'Económico',
      features: ['Aire acondicionado', 'Bluetooth', 'Cámara de reversa'],
      location: 'Miami, Florida',
    },
    {
      id: '3',
      name: 'Nissan Sentra 2024',
      pricePerDay: 47.99,
      currency: 'USD',
      available: true,
      category: 'Económico',
      features: ['Aire acondicionado', 'Bluetooth', 'Sistema de navegación'],
      location: 'Miami, Florida',
    },
    {
      id: '4',
      name: 'Chevrolet Malibu 2024',
      pricePerDay: 52.99,
      currency: 'USD',
      available: true,
      category: 'Intermedio',
      features: ['Aire acondicionado', 'Bluetooth', 'Cámara de reversa', 'Sistema de navegación'],
      location: 'Aeropuerto Internacional de Miami (MIA)',
    },
    {
      id: '5',
      name: 'Ford Fusion 2024',
      pricePerDay: 54.99,
      currency: 'USD',
      available: true,
      category: 'Intermedio',
      features: ['Aire acondicionado', 'Bluetooth', 'Cámara de reversa'],
      location: 'Los Angeles, California',
    },
    {
      id: '6',
      name: 'Hyundai Elantra 2024',
      pricePerDay: 48.99,
      currency: 'USD',
      available: true,
      category: 'Económico',
      features: ['Aire acondicionado', 'Bluetooth', '4 puertas'],
      location: 'Aeropuerto Internacional de Los Angeles (LAX)',
    },
  ];

  // Validar fechas
  const pickupDateObj = new Date(params.pickupDate);
  const dropoffDateObj = new Date(params.dropoffDate);

  if (isNaN(pickupDateObj.getTime()) || isNaN(dropoffDateObj.getTime())) {
    return [];
  }

  // Filtrar vehículos por localidad y disponibilidad
  const normalizedSearchCity = params.city.toLowerCase().trim();

  const availableCars = allMockCars.filter((car) => {
    const carLocation = car.location.toLowerCase();
    return car.available &&
      (carLocation === normalizedSearchCity ||
        carLocation.includes(normalizedSearchCity) ||
        normalizedSearchCity.includes(carLocation));
  });

  return availableCars;
}
