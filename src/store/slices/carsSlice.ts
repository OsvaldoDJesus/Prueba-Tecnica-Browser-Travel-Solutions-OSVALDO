import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Car } from '@/models/Car';
import { SearchParams } from '@/models/SearchParams';
import { searchCars } from '@/services/carService';

/**
 * Estado inicial del slice de vehículos
 */
interface CarsState {
  results: Car[];
  selectedCar: Car | null;
  loading: boolean;
  error: string | null;
  searchParams: SearchParams | null;
}

const initialState: CarsState = {
  results: [],
  selectedCar: null,
  loading: false,
  error: null,
  searchParams: null,
};

/**
 * fetchCars: Thunk asíncrono que orquesta la búsqueda de vehículos.
 * Implementa manejo de errores granular via rejectWithValue.
 */
export const fetchCars = createAsyncThunk(
  'cars/fetchCars',
  async (params: SearchParams, { rejectWithValue }) => {
    try {
      const cars = await searchCars(params);
      return { cars, params };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Error al buscar vehículos'
      );
    }
  }
);

/**
 * carsSlice: Dominio de estado para la gestión de flota y selección de usuario.
 */
const carsSlice = createSlice({
  name: 'cars',
  initialState,
  reducers: {
    /**
     * Selecciona un vehículo de los resultados
     */
    selectCar: (state, action: PayloadAction<Car>) => {
      state.selectedCar = action.payload;
    },
    /**
     * Limpia la selección actual
     */
    clearSelection: (state) => {
      state.selectedCar = null;
    },
    /**
     * Limpia los resultados y el estado de búsqueda
     */
    clearResults: (state) => {
      state.results = [];
      state.selectedCar = null;
      state.searchParams = null;
      state.error = null;
    },
    /**
     * Persiste los datos inyectados desde el servidor (SSR) al store del cliente.
     */
    hydrateFromSSR: (
      state,
      action: PayloadAction<{ cars: Car[]; params: SearchParams }>
    ) => {
      state.results = action.payload.cars;
      state.searchParams = action.payload.params;
      state.loading = false;
      state.error = null;
    },
  },
  /**
   * extraReducers: Manejo de estados del ciclo de vida de promesas (Thunks).
   */
  extraReducers: (builder) => {
    builder
      .addCase(fetchCars.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCars.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload.cars;
        state.searchParams = action.payload.params;
        state.error = null;
      })
      .addCase(fetchCars.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.results = [];
      });
  },
});

//selectCar, clearSelection, clearResults, hydrateFromSSR

export const { selectCar, clearSelection, clearResults, hydrateFromSSR } =
  carsSlice.actions;


export default carsSlice.reducer;
