# `react-alert-dialog`

## Installation

```sh
$ yarn add @interop-ui/react-alert-dialog
# or
$ npm install @interop-ui/react-alert-dialog
```

## Usage

```js
import * as React from 'react';
import { AlertDialog, styles } from '@interop-ui/react-alert-dialog';

function MyComponent(props) {
  return (
    <AlertDialog>
      <AlertDialog.Trigger style={styles.trigger}>Delete everything</AlertDialog.Trigger>
      <AlertDialog.Overlay style={styles.overlay} />
      <AlertDialog.Content style={styles.content}>
        <AlertDialog.Title style={styles.title}>Are you sure?</AlertDialog.Title>
        <AlertDialog.Description style={styles.description}>
          This will do a very dangerous thing. Thar be dragons!
        </AlertDialog.Description>
        <AlertDialog.Action style={styles.action} onClick={deleteFiles}>
          Delete them
        </AlertDialog.Action>
        <AlertDialog.Cancel style={styles.cancel}>Never mind</AlertDialog.Cancel>
      </AlertDialog.Content>
    </AlertDialog>
  );
}
```
