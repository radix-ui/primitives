import * as React from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogOverlay,
  DialogContent,
  DialogClose,
} from '@radix-ui/react-dialog';

export default function DialogPage() {
  return (
    <Dialog>
      <DialogTrigger>open</DialogTrigger>
      <DialogOverlay />
      <DialogContent>
        <DialogClose>close</DialogClose>
      </DialogContent>
    </Dialog>
  );
}
