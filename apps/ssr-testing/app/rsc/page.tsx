import * as React from 'react';
import { AspectRatio, Label, Separator, Slot, VisuallyHidden } from 'radix-ui';

// IMPORTANT: This is intentionally a Server Component. This page is a
// build-time guard against import-time RSC regressions.

const ServerSlot = Slot.createSlot('SsrTest.Slot');
const ServerSlottable = Slot.createSlottable('SsrTest.Slottable');

export default function Page() {
  return (
    <div>
      <p>
        Server Components can import <code>Slot</code> and call{' '}
        <code>{ServerSlot.displayName}</code> / <code>{ServerSlottable.displayName}</code> at module
        scope without a client boundary.
      </p>

      {/*
        `Primitive`-based components render as host elements on the server. Their
        modules call `createSlot` at module scope during evaluation, which must
        not throw when pulled into a Server Component's graph.
      */}
      <Separator.Root />
      <Label.Root>Label</Label.Root>
      <AspectRatio.Root ratio={16 / 9}>
        <span>aspect ratio content</span>
      </AspectRatio.Root>
      <VisuallyHidden.Root>hidden text</VisuallyHidden.Root>
    </div>
  );
}
