'use client';
import * as React from 'react';
import { DocumentContext } from 'radix-ui/internal';

export function Child() {
  const document = DocumentContext.useDocument();
  React.useEffect(() => {
    console.log(document);
  }, [document]);
  return <p>Open the console to see the document context.</p>;
}
