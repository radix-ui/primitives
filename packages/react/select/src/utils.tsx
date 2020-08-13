import * as React from 'react';
import { useControlledState } from '@interop-ui/react-utils';
import { makeId } from '@interop-ui/utils';

export type Item = any;

export function useSelfResettingState<T>(initialValue?: T, waitInMs = 1000) {
  const [value, setValue] = React.useState(initialValue);

  // we setup an effect with a timer which resets the value after `waitInMs` expires
  // we make sure whenever `initialValue` or `waitInMs` change,
  // but most importantly if `value` changes, we clean up and re-run the effect
  // effectively clearing the timer and re-setting a new one.
  React.useEffect(() => {
    let mounted = true;
    const timerId = window.setTimeout(() => {
      if (mounted) {
        setValue(initialValue);
      }
    }, waitInMs);
    return () => {
      mounted = false;
      window.clearTimeout(timerId);
    };
  }, [value, initialValue, waitInMs]);

  return [value, setValue] as const;
}

export function useSelectValueState(
  items: Item[],
  props: {
    isValueControlled: boolean;
    value?: string;
    defaultValue?: string;
    onValueChange?: (value?: string) => void;
  }
) {
  const { value: valueProp, defaultValue, onValueChange } = props;
  // we need to check if the user is passing a value even if it's `undefined`, because `undefined`
  // is allowed but could still mean we want to control the value
  const isValueControlled = 'value' in props;
  return useControlledState({
    prop: isValueControlled ? getDefaultValue(items, valueProp) : valueProp,
    defaultProp: getDefaultValue(items, defaultValue),
    onChange: onValueChange,
    unstable__isControlled: isValueControlled,
  });
}

export function getDefaultValue(items: Item[], value?: string) {
  const allItemValues = items.map((item) => item.value);
  const selectableItems = getSelectableItems(items);
  const selectableItemValues = selectableItems.map((item) => item.value);
  const firstSelectableItemValue = selectableItemValues[0];
  // we use the first value (amongst all, even disabled ones) if:
  // - there's no defined value
  // - all options are disabled
  if (value === undefined && items.every((item) => item.isDisabled)) {
    return allItemValues[0];
  }

  // we use the first selectable value if:
  // - there's no defined value
  // - there are no item (at all, even disabled ones) with a value that matches the value
  if (value === undefined || !allItemValues.includes(value)) {
    return firstSelectableItemValue;
  }
  return value;
}

export function isSelectableItem(item: Item) {
  return (
    // disabled items are not selectable
    !item.isDisabled &&
    // undefined items are not selectable
    !(item.value === undefined && item.label === undefined)
  );
}

export function getSelectableItems(items: Item[]) {
  return items.filter(isSelectableItem);
}

export function getItemLabelForValue(items: Item[], value?: string) {
  const item = items.find((item) => item.value === value);
  return item ? item.label : '';
}

export function getItemIndexForValue(items: Item[], value?: string) {
  return items.findIndex((item) => item.value === value);
}

export function canProcessTypeahead(event: React.KeyboardEvent): boolean {
  const isOneChar = event.key.length === 1;
  return isOneChar && !hasModifierKey(event);
}

export function getMatchingItems(items: Item[], searchString: string) {
  return items.filter((item) => item.label.toLowerCase().startsWith(searchString.toLowerCase()));
}

/**
 * In a typeahead scenario (select, menu, …), this functions gets the item index to select next based on:
 * - all items available
 * - the currently selected index (if any)
 * - the current search buffer in use (ie. "unit" when searching for "United Kingdom")
 *
 * The behaviour it mimics is as follows:
 * - when typing the same letter in intervals, cycles through the items starting with this letter
 * - when typing a few letters in a row, attempt to match an item that starts with that buffer
 */
export function getTypeaheadIndex({
  items,
  currentIndex = getFirstSelectableIndex(items),
  searchBuffer,
}: GetTypeahedIndexOptions) {
  if (searchBuffer === undefined) {
    return currentIndex;
  }

  // these are the items that can actually be selected
  // no undefined, no disabled items
  const selectableItems = getSelectableItems(items);

  // because the typeahead matching takes into account the current index
  // we reorder the items by slicing at the current index and switching left and right side of the array
  // this way we can always pick the first item that matches
  const currentItem = currentIndex === undefined ? undefined : items[currentIndex];
  const currentSelectableIndex = currentItem ? selectableItems.indexOf(currentItem) : -1;
  const reorderedItems = changeArrayStartIndex(selectableItems, currentSelectableIndex);

  // if the buffer is just the same character repeated (ie. uuuuu)
  // we cycle through the items with labels which start with that given character
  // we start at the first match which exists below the `currentSelectableIndex`
  if (isRepeatedChar(searchBuffer)) {
    const firstBufferChar = searchBuffer[0];
    const matchingItems = getMatchingItems(reorderedItems, firstBufferChar);

    if (matchingItems.length > 0) {
      const matchingIndex = currentItem ? matchingItems.indexOf(currentItem) : -1;
      const nextIndex = (matchingIndex + 1) % matchingItems.length;
      const matchingItem = matchingItems[nextIndex];
      return items.indexOf(matchingItem);
    }
  }

  // else, we try and match an item based on the buffer
  // ie. a buffer of "fr" would match and select "France" in a country list
  else {
    const matchingItems = getMatchingItems(reorderedItems, searchBuffer);
    if (matchingItems.length > 0) {
      const matchingItem = matchingItems[0];
      return items.indexOf(matchingItem);
    }
  }

  // in all other case, we stay on the current item
  return currentIndex;
}

export function getFirstSelectableIndex(items: Item[]) {
  const selectableItems = getSelectableItems(items);
  if (selectableItems.length === 0) {
    return undefined;
  }
  const firstSelectableItem = selectableItems[0];
  return items.indexOf(firstSelectableItem);
}

export function getLastSelectableIndex(items: Item[]) {
  const selectableItems = getSelectableItems(items);
  if (selectableItems.length === 0) {
    return undefined;
  }
  const lastSelectableItem = selectableItems[selectableItems.length - 1];
  return items.indexOf(lastSelectableItem);
}

export function hasModifierKey(event: React.KeyboardEvent) {
  return event.shiftKey || event.ctrlKey || event.altKey || event.metaKey;
}

/**
 * Generates a new array where the start index is changed.
 * ie. changeArrayStartIndex(['a', 'b', 'c', 'd', 'e'], 3) => ['d', 'e', 'a', 'b', 'c']
 */
export function changeArrayStartIndex<T>(array: T[], indexToPutFirst: number) {
  const start = array.slice(0, indexToPutFirst);
  const end = array.slice(indexToPutFirst, array.length);
  return end.concat(start);
}

/**
 * Returns whether a string is just the same character repeated all over
 * ie. eeeee or EEEEE but not eeeEEE
 */
export function isRepeatedChar(value: string) {
  return value.length > 1 && Array.from(value).every((char, index, array) => char === array[0]);
}

export function makeItemId(menuId: string, index: number) {
  return makeId(menuId, 'item', index);
}

export function getNextSelectableIndex({
  items,
  currentIndex,
  key,
}: GetNextSelectableIndexOptions) {
  if (currentIndex === undefined) {
    // we start at the top / bottom based on the arrow key pressed
    return key === 'ArrowDown' ? getFirstSelectableIndex(items) : getLastSelectableIndex(items);
  }

  const increment = key === 'ArrowDown' ? 1 : -1;

  // we start looking down / up
  let nextIndex = currentIndex + increment;

  // while we're still in bounds
  while (nextIndex >= 0 && nextIndex <= items.length - 1) {
    const nextItem = items[nextIndex];
    // we have found our next selectable item
    // we can exit
    if (isSelectableItem(nextItem)) {
      return nextIndex;
    }
    nextIndex += increment;
  }

  // we couldn't find the next selectable index so we return the current one.
  return currentIndex;
}

type GetNextSelectableIndexOptions = {
  items: Item[];
  currentIndex?: number;
  key: 'ArrowUp' | 'ArrowDown';
};

type GetTypeahedIndexOptions = {
  /** all items to check against */
  items: Item[];
  /** the current index (selected/highlighted) in the list (menu/select) if any */
  currentIndex?: number;
  /** the current search buffer in use (ie. "unit" when searching for "United Kingdom") */
  searchBuffer?: string;
};

export type CalculateMenuPositionOptions = {
  anchorRect?: ClientRect | null;
  anchorText?: HTMLSpanElement | null;
  menuWrapper?: HTMLDivElement | null;
  menu?: HTMLDivElement | null;
  menuItemsWrapper?: HTMLDivElement | null;
  scrollIndicator?: HTMLDivElement | null;
  referenceItem?: HTMLDivElement | null;
  referenceItemText?: HTMLSpanElement | null;
  viewportGap: number;
};

export type MenuPosition = {
  x: number;
  y: number;
  width?: number;
  scrollPaneHeight: number;
  scrollTop?: number;
};
