import * as React from 'react';
import { getPartDataAttr, getPartDataAttrObj, wrap, clamp } from '@interop-ui/utils';

type UseRovingFocusOptions = {
  orientation?: React.AriaAttributes['aria-orientation'];
  loop?: boolean;
  makeFirstItemTabbable?: boolean;
};

function useRovingFocus({
  orientation,
  loop = false,
  makeFirstItemTabbable = true,
}: UseRovingFocusOptions) {
  return {
    ref: (container: HTMLElement | null) => {
      if (makeFirstItemTabbable && container) {
        const items = getRovingFocusItems(container);
        const firstItem = items[0];
        if (firstItem) firstItem.tabIndex = 0;
      }
    },
    onKeyDown: (event: React.KeyboardEvent) => {
      const focusIntent = getFocusIntent(event, orientation);

      if (focusIntent !== undefined) {
        event.preventDefault();

        const container = event.currentTarget as HTMLElement;
        const items = getRovingFocusItems(container);
        const nextItem = getNextItem(focusIntent, items, loop);

        if (nextItem) {
          items.forEach((item) => (item.tabIndex = -1));
          nextItem.tabIndex = 0;
          nextItem.focus();
        }
      }
    },
  };
}

function getRovingFocusItems(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll(ITEM_SELECTOR));
}

type FocusIntent = 'first' | 'last' | 'prev' | 'next';

function getFocusIntent(
  event: React.KeyboardEvent,
  orientation?: UseRovingFocusOptions['orientation']
): FocusIntent | undefined {
  const { key, currentTarget: container } = event;
  const orientationToKeys = {
    none: { next: ['ArrowRight', 'ArrowDown'], prev: ['ArrowLeft', 'ArrowUp'] },
    horizontal: { next: ['ArrowRight'], prev: ['ArrowLeft'] },
    vertical: { next: ['ArrowDown'], prev: ['ArrowUp'] },
  };
  const keys = orientationToKeys[orientation || 'none'];

  if (keys.prev.includes(key)) {
    const isContainerFocused = document.activeElement === container;
    // if the container is focused and the prev key is pressed, we need to start at the end
    return isContainerFocused ? 'last' : 'prev';
  }
  if (keys.next.includes(key)) return 'next';
  if (key === 'PageUp' || key === 'Home') return 'first';
  if (key === 'PageDown' || key === 'End') return 'last';
}

function getNextItem(focusIntent: FocusIntent, items: HTMLElement[], loop?: boolean) {
  const currentIndex = items.findIndex((item) => item.tabIndex === 0);
  const map = { first: 0, last: items.length - 1, prev: currentIndex - 1, next: currentIndex + 1 };
  let nextIndex = map[focusIntent];
  nextIndex = loop ? wrap(nextIndex, items.length) : clamp(nextIndex, [0, items.length - 1]);
  return items[nextIndex] as HTMLElement | undefined;
}

const ITEM_NAME = 'RovingFocusItem';
const ITEM_SELECTOR = `[${getPartDataAttr(ITEM_NAME)}]`;

type UseRovingFocusItemOptions = {
  disabled?: boolean;
  initiallyTabbable?: boolean;
};

function useRovingFocusItem({ disabled, initiallyTabbable }: UseRovingFocusItemOptions) {
  return {
    ...(disabled ? {} : getPartDataAttrObj(ITEM_NAME)),
    tabIndex: !disabled && initiallyTabbable ? 0 : -1,
  };
}

export { useRovingFocus, useRovingFocusItem };
