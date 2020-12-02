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
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from '@interop-ui/react-alert-dialog';

function MyComponent() {
  return (
    <AlertDialog>
      <AlertDialogTrigger>Delete everything</AlertDialogTrigger>
      <AlertDialogOverlay />
      <AlertDialogContent>
        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This will do a very dangerous thing. Thar be dragons!
        </AlertDialogDescription>
        <AlertDialogAction onClick={deleteFiles}>Delete them</AlertDialogAction>
        <AlertDialogCancel>Never mind</AlertDialogCancel>
      </AlertDialogContent>
    </AlertDialog>
  );
}
```
