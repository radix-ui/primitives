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
  AlertDialogPortal,
} from '@radix-ui/react-alert-dialog';

export default function Page() {
  return (
    <AlertDialog>
      <AlertDialogTrigger>delete everything</AlertDialogTrigger>
      <AlertDialogPortal>
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will do a very dangerous thing. Thar be dragons!
          </AlertDialogDescription>
          <AlertDialogAction>yolo, do it</AlertDialogAction>
          <AlertDialogCancel>maybe not</AlertDialogCancel>
        </AlertDialogContent>
      </AlertDialogPortal>
    </AlertDialog>
  );
}
