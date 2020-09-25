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
import { Dialog, styles } from '@interop-ui/react-dialog';

function MyComponent(props) {
  return (
    <Dialog>
      <Dialog.Trigger style={styles.trigger}>Open the dialog</Dialog.Trigger>
      <Dialog.Overlay style={styles.overlay} />
      <Dialog.Content style={styles.content}>
        <p>Some really cool dialog content!</p>
        <Dialog.Close style={styles.close}>Close the dialog</Dialog.Close>
      </Dialog.Content>
    </Dialog>
  );
}
```
