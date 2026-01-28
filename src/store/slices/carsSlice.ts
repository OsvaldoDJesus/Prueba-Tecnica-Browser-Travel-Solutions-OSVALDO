import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Car } from '@/models/Car';
import { SearchParams } from '@/models/SearchParams';
import { searchCars } from '@/services/carService';

// La lógica de obtención de datos se mantiene fuera de los componentes
// para facilitar pruebas y evitar acoplamiento con la UI (esto esta aqui, pero facilmente pude ir en un archivo de documentacion)

interface CarsState {
  results: Car[];
  selectedCar: Car | null;
  loading: boolean;
  error: string | null;
}

const initialState: CarsState = {
  results: [],
  selectedCar: null,
  loading: false,
  error: null,
};

//Acción asíncrona para buscar vehículos
export const fetchCars = createAsyncThunk(
  'cars/fetchCars',
  async (params: SearchParams, { rejectWithValue }) => {
    try {
      const cars = await searchCars(params);
      return { cars };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Error al buscar vehículos'
      );
    }
  }
);

const carsSlice = createSlice({
  name: 'cars',
  initialState,
  reducers: {
    selectCar: (state, action: PayloadAction<Car>) => {
      state.selectedCar = action.payload;
    },
    clearSelection: (state) => {
      state.selectedCar = null;
    },
    clearResults: (state) => {
      state.results = [];
      state.selectedCar = null;
      state.error = null;
    },
    hydrateFromSSR: (
      state,
      action: PayloadAction<{ cars: Car[] }>
    ) => {
      state.results = action.payload.cars;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCars.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCars.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload.cars;
        state.error = null;
      })
      .addCase(fetchCars.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.results = [];
      });
  },
});

export const { selectCar, clearSelection, clearResults, hydrateFromSSR } =
  carsSlice.actions;
export default carsSlice.reducer;
