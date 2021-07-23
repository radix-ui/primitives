import * as React from 'react';
import Head from 'next/head';
import { IdProvider } from '@radix-ui/react-id';

export default function App({ Component, pageProps }: any) {
  return (
    <React.StrictMode>
      <Head>
        <title>SSR testing</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <IdProvider>
        <Component {...pageProps} />
      </IdProvider>
    </React.StrictMode>
  );
}
