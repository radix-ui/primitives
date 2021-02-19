import * as React from 'react';
import Head from 'next/head';
import { SSRProvider, useSSRSafeId } from '@radix-ui/react-ssr';

export default function SSRPage() {
  return (
    <>
      <Head>
        <title>SSR</title>
      </Head>
      <SSRProvider>
        <Foo />
        <Foo />

        <SSRProvider>
          <Foo />
          <Foo />
        </SSRProvider>
      </SSRProvider>
    </>
  );
}

function Foo(props: any) {
  const id = useSSRSafeId(props.id);
  return (
    <div {...props} id={id}>
      Foo {id}
    </div>
  );
}
