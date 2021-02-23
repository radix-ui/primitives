import * as React from 'react';
import { IdProvider, useId } from '@radix-ui/react-id';

export default function IdPage() {
  return (
    <>
      <Foo />
      <Foo />

      <IdProvider>
        <Foo />
        <Foo />
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
