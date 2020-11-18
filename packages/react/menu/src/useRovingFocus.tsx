import * as React from 'react';
import { getPartDataAttr, getPartDataAttrObj, wrap, clamp } from '@interop-ui/utils';

type UseRovingFocusOptions = {
  orientation?: React.AriaAttributes['aria-orientation'];
  loop: boolean;
};

function useRovingFocus({ orientation, loop = false }: UseRovingFocusOptions) {
  return {
    tabIndex: -1,
    style: { outline: 'none' },
    onKeyDown: (event: React.KeyboardEvent) => {
      const focusIntent = getFocusIntent(event, orientation);

      if (focusIntent !== undefined) {
        event.preventDefault();

        const container = event.currentTarget as HTMLElement;
        const items: HTMLElement[] = Array.from(container.querySelectorAll(ITEM_SELECTOR));
        const nextItem = getNextItem(focusIntent, items, loop);

        if (nextItem) {
          items.forEach((item) => (item.tabIndex = -1));
          container.tabIndex = -1;
          nextItem.tabIndex = 0;
          nextItem.focus();
        }
      }
    },
  };
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
  const limit = loop ? wrap : clamp;
  const nextIndex = limit(map[focusIntent], [0, items.length - 1]);
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
    tabIndex: initiallyTabbable ? 0 : -1,
  };
}

export { useRovingFocus, useRovingFocusItem };
