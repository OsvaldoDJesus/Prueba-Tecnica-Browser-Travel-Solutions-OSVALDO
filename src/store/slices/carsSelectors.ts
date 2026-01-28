import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../index';


 //Selector memoizado para obtener el precio del vehículo seleccionado
 
export const selectSelectedCarPrice = createSelector(
  (state: RootState) => state.cars.selectedCar,
  (car) => car ? car.pricePerDay : 0
);

// validacion del selector memoizado para verificar si hay un vehículo seleccionado
export const selectHasSelectedCar = createSelector(
  (state: RootState) => state.cars.selectedCar,
  (car) => car !== null
);
