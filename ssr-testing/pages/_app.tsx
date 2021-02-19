import * as React from 'react';
import Head from 'next/head';

export default function App({ Component, pageProps }: any) {
  return (
    <>
      <Head>
        <title>Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
