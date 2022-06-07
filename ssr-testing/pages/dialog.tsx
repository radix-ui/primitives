import * as React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogClose,
} from '@radix-ui/react-dialog';

export default function DialogPage() {
  return (
    <Dialog>
      <DialogTrigger>open</DialogTrigger>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent>
          <DialogTitle>Title</DialogTitle>
          <DialogDescription>Description</DialogDescription>
          <DialogClose>close</DialogClose>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
