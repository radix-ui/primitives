import * as React from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuPortal,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuArrow,
} from '@radix-ui/react-dropdown-menu';

export default function DropdownMenuPage() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>Open</DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuContent sideOffset={5}>
          <DropdownMenuItem onSelect={() => console.log('undo')}>Undo</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => console.log('redo')}>Redo</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled onSelect={() => console.log('cut')}>
            Cut
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => console.log('copy')}>Copy</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => console.log('paste')}>Paste</DropdownMenuItem>
          <DropdownMenuArrow />
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
}
