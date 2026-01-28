'use client';

import { Provider as ReduxProvider } from 'react-redux';
import { store } from './index';
import { ReactNode } from 'react';

// Permite que todos los componentes accedan al store mediante hooks

interface ProviderProps {
  children: ReactNode;
}

export function Provider({ children }: ProviderProps) {
  // Inyecta el store global en el árbol de componentes.
  return <ReduxProvider store={store}>{children}</ReduxProvider>;
}
