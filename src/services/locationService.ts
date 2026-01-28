//LocationService: Orquesta la búsqueda y recuperación de puntos de atención (Ciudades/Aeropuertos).

export interface Location {
  id: string;
  name: string;
  type: 'city' | 'airport';
  code?: string; // Código de aeropuerto (ej: MIA, LAX)
}

// localidades simuladas
const mockLocations: Location[] = [
  // Ciudades
  { id: '1', name: 'Miami, Florida', type: 'city' },
  { id: '2', name: 'Los Angeles, California', type: 'city' },
  { id: '3', name: 'New York, New York', type: 'city' },
  { id: '4', name: 'Orlando, Florida', type: 'city' },
  { id: '5', name: 'Las Vegas, Nevada', type: 'city' },
  { id: '6', name: 'Chicago, Illinois', type: 'city' },
  { id: '7', name: 'San Francisco, California', type: 'city' },
  { id: '8', name: 'Houston, Texas', type: 'city' },
  { id: '9', name: 'Phoenix, Arizona', type: 'city' },
  { id: '10', name: 'Dallas, Texas', type: 'city' },
  // Aeropuertos
  { id: '11', name: 'Aeropuerto Internacional de Miami (MIA)', type: 'airport', code: 'MIA' },
  { id: '12', name: 'Aeropuerto Internacional de Los Angeles (LAX)', type: 'airport', code: 'LAX' },
  { id: '13', name: 'Aeropuerto Internacional John F. Kennedy (JFK)', type: 'airport', code: 'JFK' },
  { id: '14', name: 'Aeropuerto Internacional de Orlando (MCO)', type: 'airport', code: 'MCO' },
  { id: '15', name: 'Aeropuerto Internacional McCarran (LAS)', type: 'airport', code: 'LAS' },
  { id: '16', name: 'Aeropuerto Internacional O\'Hare (ORD)', type: 'airport', code: 'ORD' },
  { id: '17', name: 'Aeropuerto Internacional de San Francisco (SFO)', type: 'airport', code: 'SFO' },
  { id: '18', name: 'Aeropuerto Intercontinental George Bush (IAH)', type: 'airport', code: 'IAH' },
  { id: '19', name: 'Aeropuerto Internacional Sky Harbor (PHX)', type: 'airport', code: 'PHX' },
  { id: '20', name: 'Aeropuerto Internacional de Dallas/Fort Worth (DFW)', type: 'airport', code: 'DFW' },
  { id: '21', name: 'Aeropuerto Internacional de la Ciudad de Kansas (MCI)', type: 'airport', code: 'MCI' },
];


 //Búsqueda semántica por nombre o código OACI/IATA.
 
export function searchLocations(searchTerm: string): Location[] {
  if (!searchTerm || searchTerm.trim().length === 0) {
    return [];
  }

  const term = searchTerm.toLowerCase().trim();

  return mockLocations.filter((location) => {
    const nameMatch = location.name.toLowerCase().includes(term);
    const codeMatch = location.code?.toLowerCase().includes(term);
    return nameMatch || codeMatch;
  });
}

// Lookup de localidad por identificador nominal. 

export function getLocationByName(locationName: string): Location | null {
  return mockLocations.find((loc) => loc.name === locationName) || null;
}
