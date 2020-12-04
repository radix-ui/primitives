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
import {
  Dialog,
  DialogTrigger,
  DialogOverlay,
  DialogContent,
  DialogClose,
} from '@interop-ui/react-dialog';

function MyComponent() {
  return (
    <Dialog>
      <DialogTrigger>Open the dialog</DialogTrigger>
      <DialogOverlay />
      <DialogContent>
        <p>Some really cool dialog content!</p>
        <DialogClose>Close the dialog</DialogClose>
      </DialogContent>
    </Dialog>
  );
}
```
