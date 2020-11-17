# `react-dialog`

## Installation

```sh
$ yarn add @interop-ui/react-dialog
# or
$ npm install @interop-ui/react-dialog
```

## Usage

```js
import * as React from 'react';
import { Dialog } from '@interop-ui/react-dialog';

function MyComponent() {
  return (
    <Dialog>
      <Dialog.Trigger>Open the dialog</Dialog.Trigger>
      <Dialog.Overlay />
      <Dialog.Content>
        <p>Some really cool dialog content!</p>
        <Dialog.Close>Close the dialog</Dialog.Close>
      </Dialog.Content>
    </Dialog>
  );
}
```
