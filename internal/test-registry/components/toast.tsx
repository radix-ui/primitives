import * as React from 'react';
import { Toast } from 'radix-ui';

export function Basic() {
  return (
    <Toast.Provider>
      <Toast.Root>
        <Toast.Title>Toast</Toast.Title>
        <Toast.Description>This is a toast message.</Toast.Description>
        <Toast.Action altText="Do something">Do something</Toast.Action>
        <Toast.Close>Close</Toast.Close>
      </Toast.Root>
      <Toast.Viewport />
    </Toast.Provider>
  );
}
