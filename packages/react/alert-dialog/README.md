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
import { AlertDialog } from '@interop-ui/react-alert-dialog';

function MyComponent() {
  return (
    <AlertDialog>
      <AlertDialog.Trigger>Delete everything</AlertDialog.Trigger>
      <AlertDialog.Overlay />
      <AlertDialog.Content>
        <AlertDialog.Title>Are you sure?</AlertDialog.Title>
        <AlertDialog.Description>
          This will do a very dangerous thing. Thar be dragons!
        </AlertDialog.Description>
        <AlertDialog.Action onClick={deleteFiles}>Delete them</AlertDialog.Action>
        <AlertDialog.Cancel>Never mind</AlertDialog.Cancel>
      </AlertDialog.Content>
    </AlertDialog>
  );
}
```
