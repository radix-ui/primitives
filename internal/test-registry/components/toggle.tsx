import * as React from 'react';
import { FontItalicIcon } from '@radix-ui/react-icons';
import { Toggle } from 'radix-ui';

export function Basic() {
  return (
    <Toggle.Root className="Toggle" aria-label="Toggle italic">
      <FontItalicIcon />
    </Toggle.Root>
  );
}
