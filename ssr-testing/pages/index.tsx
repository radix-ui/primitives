import * as React from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Head>
        <title>Home</title>
      </Head>

      <main>
        <h1>Components</h1>
        <ul>
          <li>
            <Link href="/ssr">SSR</Link>
          </li>
        </ul>
      </main>
    </>
  );
}
