import * as React from 'react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverClose,
  PopoverArrow,
} from '@radix-ui/react-popover';

export default function PopoverPage() {
  return (
    <Popover>
      <PopoverTrigger>open</PopoverTrigger>
      <PopoverContent sideOffset={5}>
        <PopoverClose>close</PopoverClose>
        <PopoverArrow width={20} height={10} />
      </PopoverContent>
    </Popover>
  );
}
