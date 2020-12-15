import * as React from 'react';
import { getPartDataAttr, wrapArray } from '@radix-ui/utils';

function useMenuTypeahead() {
  const timerRef = React.useRef(0);
  const searchRef = React.useRef('');

  // Reset `searchRef` 1 second after it was last updated
  const setSearch = React.useCallback((search: string) => {
    searchRef.current = search;
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setSearch(''), 1000);
  }, []);

  return {
    onKeyDownCapture: (event: React.KeyboardEvent) => {
      if (event.key.length === 1 && !(event.ctrlKey || event.altKey || event.metaKey)) {
        const container = event.currentTarget as HTMLElement;
        setSearch(searchRef.current + event.key);

        // Stop activating the item if we're still "searching", essentially preventing
        // the spacebar from selecting the item currently focused.
        // This is also why we use `onKeyDownCapture` rather than `onKeyDown`
        if (event.key === ' ' && !searchRef.current.startsWith(' ')) {
          event.stopPropagation();
        }

        const currentItem = document.activeElement;
        const currentMatch = currentItem ? getValue(currentItem) : undefined;
        const values = Array.from(container.querySelectorAll(`[${ITEM_ATTR}]`)).map(getValue);
        const nextMatch = getNextMatch(values, searchRef.current, currentMatch);
        const newItem = container.querySelector(`[${ITEM_ATTR}="${nextMatch}"]`);

        if (newItem) {
          /**
           * Imperative focus during keydown is risky so we prevent React's batching updates
           * to avoid potential bugs. See: https://github.com/facebook/react/issues/20332
           */
          setTimeout(() => (newItem as HTMLElement).focus());
        }
      }
    },
  };
}

/**
 * This is the "meat" of the matching logic. It takes in all the values,
 * the search and the current match, and returns the next match (or `undefined`).
 *
 * We normalize the search because if a user has repeatedly pressed a character,
 * we want the exact same behavior as if we only had that one character
 * (ie. cycle through options starting with that character)
 *
 * We also reorder the values by wrapping the array around the current match.
 * This is so we always look forward from the current match, and picking the first
 * match will always be the correct one.
 *
 * Finally, if the normalized search is exactly one character, we exclude the
 * current match from the values because otherwise it would be the first to match always
 * and focus would never move. This is as opposed to the regular case, where we
 * don't want focus to move if the current match still matches.
 */
function getNextMatch(values: string[], search: string, currentMatch?: string) {
  const isRepeated = search.length > 1 && Array.from(search).every((char) => char === search[0]);
  const normalizedSearch = isRepeated ? search[0] : search;
  const currentMatchIndex = currentMatch ? values.indexOf(currentMatch) : -1;
  let wrappedValues = wrapArray(values, Math.max(currentMatchIndex, 0));
  const excludeCurrentMatch = normalizedSearch.length === 1;
  if (excludeCurrentMatch) wrappedValues = wrappedValues.filter((v) => v !== currentMatch);
  const nextMatch = wrappedValues.find((value) =>
    value.toLowerCase().startsWith(normalizedSearch.toLowerCase())
  );
  return nextMatch !== currentMatch ? nextMatch : undefined;
}

const getValue = (element: Element) => element.getAttribute(ITEM_ATTR) ?? '';

const ITEM_NAME = 'MenuTypeaheadItem';
const ITEM_ATTR = getPartDataAttr(ITEM_NAME);

type UseMenuTypeaheadItemOptions = { textValue: string; disabled?: boolean };

function useMenuTypeaheadItem({ textValue, disabled }: UseMenuTypeaheadItemOptions) {
  return { [ITEM_ATTR]: disabled ? undefined : textValue };
}

export { useMenuTypeahead, useMenuTypeaheadItem };
