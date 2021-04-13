import * as React from 'react';
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
  HoverCardArrow,
} from '@radix-ui/react-hover-card';

export default function PopoverPage() {
  return (
    <HoverCard>
      <HoverCardTrigger>Hover me</HoverCardTrigger>

      <HoverCardContent>
        <HoverCardArrow width={20} height={10} />
        Nicely done!
      </HoverCardContent>
    </HoverCard>
  );
}
