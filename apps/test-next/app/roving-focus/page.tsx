import * as React from 'react';
import * as RovingFocus from '@repo/test-registry/components/roving-focus';

export default function Page() {
  return (
    <>
      <h1>Basic</h1>
      <RovingFocus.Basic />
      <h1>Nested</h1>
      <RovingFocus.Nested />
    </>
  );
}
