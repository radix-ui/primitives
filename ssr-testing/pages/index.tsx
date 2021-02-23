import * as React from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Home</title>
      </Head>

      <main>
        <h1>Components</h1>
        <ul>
          <li>
            <Link href="/id">Id</Link>
          </li>
        </ul>
      </main>
    </>
  );
}
