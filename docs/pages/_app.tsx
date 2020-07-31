import React from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { createGlobalStyle } from 'styled-components';
import * as Radix from '@modulz/radix';

const GlobalStyles = createGlobalStyle`

`;

function App({ Component, pageProps }: AppProps) {
  const isDarkMode =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches;

  return (
    <Radix.RadixProvider>
      <Head>
        <title>Modulz</title>
        <link rel="icon" href={isDarkMode ? '/favicon-light.png' : '/favicon-dark.png'} />

        <link rel="stylesheet" href="https://develop.modulz.app/fonts/fonts.css" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <GlobalStyles />

      <Component {...pageProps} />
    </Radix.RadixProvider>
  );
}

export default App;
