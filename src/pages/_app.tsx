import type { AppProps } from 'next/app';
import { Provider } from '@/store/Provider';
import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider>
      <Component {...pageProps} />
    </Provider>
  );
}
