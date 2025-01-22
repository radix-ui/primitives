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

export default function Page() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>Open</DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuContent sideOffset={5}>
          <DropdownMenuItem>Undo</DropdownMenuItem>
          <DropdownMenuItem>Redo</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled>Cut</DropdownMenuItem>
          <DropdownMenuItem>Copy</DropdownMenuItem>
          <DropdownMenuItem>Paste</DropdownMenuItem>
          <DropdownMenuArrow />
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
}
