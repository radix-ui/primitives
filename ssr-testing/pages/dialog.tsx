import * as React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogDescription,
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
        <DialogTitle>Title</DialogTitle>
        <DialogDescription>Description</DialogDescription>
        <DialogClose>close</DialogClose>
      </DialogContent>
    </Dialog>
  );
}
