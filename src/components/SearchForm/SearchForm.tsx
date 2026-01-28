import { useState, FormEvent, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { searchLocations, Location } from '@/services/locationService';
import { useAppDispatch } from '@/store/hooks';
import { clearResults } from '@/store/slices/carsSlice';
import styles from './SearchForm.module.css';


export function SearchForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [city, setCity] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [dropoffDate, setDropoffDate] = useState('');
  const [suggestions, setSuggestions] = useState<Location[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Manejar cambios en el input de ciudad
  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCity(value);
    setSelectedLocation(null);

    if (value.length > 0) {
      const results = searchLocations(value);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Seleccionar una sugerencia
  const handleSelectLocation = (location: Location) => {
    setCity(location.name);
    setSelectedLocation(location);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  // Cerrar sugerencias al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Usar la localidad seleccionada o el texto ingresado
    const finalCity = selectedLocation ? selectedLocation.name : city;

    if (!finalCity || !pickupDate || !dropoffDate) {
      return;
    }

    // Limpiar estado previo antes de iniciar nueva navegación
    dispatch(clearResults());

    // Navegar a la página de resultados con los parámetros de búsqueda
    router.push({
      pathname: '/results',
      query: {
        city: finalCity,
        pickupDate,
        dropoffDate,
      },
    });
  };

  // Obtener fecha mínima (hoy)
  const today = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit} className={styles.form} role="search" aria-label="Formulario de búsqueda de vehículos">
      <div className={styles.field}>
        <label htmlFor="city" className={styles.label}>
          Localidad de Recogida
        </label>
        <div className={styles.autocompleteWrapper}>
          <input
            ref={inputRef}
            id="city"
            type="text"
            value={city}
            onChange={handleCityChange}
            className={styles.input}
            placeholder="Ej: Miami, Florida o MIA"
            required
            aria-required="true"
            aria-label="Ciudad o aeropuerto de recogida"
            autoComplete="off"
          />
          {showSuggestions && suggestions.length > 0 && (
            <div ref={suggestionsRef} className={styles.suggestions}>
              {suggestions.map((location) => (
                <div
                  key={location.id}
                  className={styles.suggestionItem}
                  onClick={() => handleSelectLocation(location)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSelectLocation(location);
                    }
                  }}
                >
                  <span className={styles.suggestionName}>{location.name}</span>
                  {location.code && (
                    <span className={styles.suggestionCode}>{location.code}</span>
                  )}
                  <span className={styles.suggestionType}>
                    {location.type === 'airport' ? 'Aeropuerto' : 'Ciudad'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="pickupDate" className={styles.label}>
          Fecha de Recogida
        </label>
        <input
          id="pickupDate"
          type="date"
          value={pickupDate}
          onChange={(e) => setPickupDate(e.target.value)}
          className={styles.input}
          min={today}
          required
          aria-required="true"
          aria-label="Fecha de recogida del vehículo"
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="dropoffDate" className={styles.label}>
          Fecha de Devolución
        </label>
        <input
          id="dropoffDate"
          type="date"
          value={dropoffDate}
          onChange={(e) => setDropoffDate(e.target.value)}
          className={styles.input}
          min={pickupDate || today}
          required
          aria-required="true"
          aria-label="Fecha de devolución del vehículo"
        />
      </div>

      <button type="submit" className={styles.button} aria-label="Buscar vehículos disponibles">
        Buscar Vehículos
      </button>
    </form>
  );
}
