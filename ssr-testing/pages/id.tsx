import * as React from 'react';
import Head from 'next/head';
import { IdProvider, useId } from '@radix-ui/react-id';

export default function IdPage() {
  return (
    <>
      <Head>
        <title>Id</title>
      </Head>
      <IdProvider>
        <Foo />
        <Foo />

        <IdProvider>
          <Foo />
          <Foo />
        </IdProvider>
      </IdProvider>
    </>
  );
}

function Foo(props: any) {
  const id = useId(props.id);
  return (
    <div {...props} id={id}>
      Foo {id}
    </div>
  );
}
