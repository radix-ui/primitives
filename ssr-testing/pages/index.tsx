import * as React from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Head>
        <title>Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Components</h1>
        <ul>
          <li>
            <Link href="/radio-group">RadioGroup</Link>
          </li>
        </ul>
      </main>
    </>
  );
}
