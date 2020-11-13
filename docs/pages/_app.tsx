import React from 'react';
import { AppProps } from 'next/app';
import { MDXProvider } from '@mdx-js/react';
import Head from 'next/head';
import { createGlobalStyle } from 'styled-components';
import * as Radix from '@modulz/radix';
import { DocsPageLayout } from '../components/DocsPageLayout';
import MDXComponents from '../components/mdx';

const GlobalStyles = createGlobalStyle`
  ::selection {
		background-color: ${Radix.theme.colors.blue600};
		color: ${Radix.theme.colors.white};
	}

	/* reset selection for live code blocks */
	.react-live-code-block textarea {
		outline: none;

		&::selection {
			background-color: ${Radix.theme.colors.blue300};
		}
	}

  svg { vertical-align: middle }
`;

function App({ Component, pageProps, router }: AppProps) {
  const isDarkMode =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches;

  const isRoot = router.pathname === '/';

  return (
    <Radix.RadixProvider>
      <Head>
        <title>Radix</title>
        <meta name="description" content="White-label components for building design systems." />
        <link rel="icon" href={isDarkMode ? '/favicon-light.png' : '/favicon-dark.png'} />
        <link rel="stylesheet" href="https://develop.modulz.app/fonts/fonts.css" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <GlobalStyles />

      <MDXProvider components={MDXComponents}>
        {isRoot ? (
          <Component {...pageProps} />
        ) : (
          <DocsPageLayout>
            <Component {...pageProps} />
          </DocsPageLayout>
        )}
      </MDXProvider>
    </Radix.RadixProvider>
  );
}

export default App;
