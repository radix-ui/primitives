import * as React from 'react';
import { describe, expect, it } from 'vitest';
import { createSlot, createSlottable } from './create-slot';
import { unstable_mergeProps } from './merge-props';
import { useSlotContext } from './slot-context';

/**
 * Regression tests for https://github.com/radix-ui/primitives/issues/4072
 *
 * Runs under React's `react-server` build. `createSlot` should be called at
 * module scope by every primitive-based component, so it and everything it imports
 * must evaluate on the server without touching context. Only the `"use client"`
 * `Slot` / `Slot.Provider` may use context.
 */

const ServerSlot = createSlot('Server');
const ServerSlottable = createSlottable('Server');

describe('Slot in React Server Components', () => {
  it('runs under the `react-server` condition', () => {
    // If this fails, the rest of this suite would pass for the wrong reasons.
    expect(React.createContext).toBeUndefined();
  });

  it.each([
    ['@radix-ui/react-slot', () => import('./index')],
    ['@radix-ui/react-slot/create-slot', () => import('./create-slot')],
    ['@radix-ui/react-slot/merge-props', () => import('./merge-props')],
    ['radix-ui/slot', () => import('../../radix-ui/src/slot')],
    ['radix-ui/slot/create-slot', () => import('../../radix-ui/src/slot/create-slot')],
    ['radix-ui/slot/merge-props', () => import('../../radix-ui/src/slot/merge-props')],
  ])('imports `%s` without throwing', async (_entrypoint, importEntrypoint) => {
    await expect(importEntrypoint()).resolves.toBeDefined();
  });

  it('creates slots at module scope', () => {
    expect(ServerSlot.displayName).toBe('Server.Slot');
    expect(ServerSlottable.displayName).toBe('Server.Slottable');
  });

  it('keeps `Slot` and `Slot.Provider` behind a client boundary', async () => {
    const Slot = await import('./index');
    for (const clientComponent of [Slot.Slot, Slot.Root, Slot.Provider, Slot.SlotProvider]) {
      expect(() => (clientComponent as () => unknown)()).toThrow(/is on the client/);
    }
  });

  it('falls back to the default merge strategy without reading context', () => {
    expect(useSlotContext()).toBe(unstable_mergeProps);
  });
});
