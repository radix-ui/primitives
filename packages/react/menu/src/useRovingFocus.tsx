import * as React from 'react';
import { getPartDataAttr, wrap, clamp } from '@interop-ui/utils';
import { createContext, useId } from '@interop-ui/react-utils';

/* -------------------------------------------------------------------------------------------------
 * RovingFocusGroup
 * -----------------------------------------------------------------------------------------------*/
type Orientation = React.AriaAttributes['aria-orientation'];
type Direction = 'ltr' | 'rtl';
type RovingContextValue = {
  id: string;
  orientation?: Orientation;
  dir?: Direction;
  loop?: boolean;
};

const GROUP_NAME = 'RovingFocusGroup';

const [RovingFocusContext, useRovingFocusContext] = createContext<RovingContextValue>(
  GROUP_NAME + 'Context',
  GROUP_NAME
);

type RovingFocusGroupProps = Omit<RovingContextValue, 'id'> & { children: React.ReactNode };
type RovingFocusGroupAPI = {
  focus: (item?: HTMLElement) => void;
  focusFirst: () => void;
  focusLast: () => void;
};

const RovingFocusGroup = React.forwardRef<RovingFocusGroupAPI, RovingFocusGroupProps>(
  (props, forwardedRef) => {
    const { children, orientation, loop, dir } = props;
    const id = String(useId());
    // prettier-ignore
    const context = React.useMemo(() => ({ id, orientation, dir, loop }), [id, orientation, dir, loop]);

    // expose public API on ref
    React.useImperativeHandle(
      forwardedRef,
      () => ({
        focus: (node?: HTMLElement) => focusItem(id, node),
        focusFirst: () => {
          const [firstItem] = getRovingFocusItems(id);
          focusItem(id, firstItem);
        },
        focusLast: () => {
          const [lastItem] = getRovingFocusItems(id).reverse();
          focusItem(id, lastItem);
        },
      }),
      [id]
    );

    // make sure we have a tab stop when the component first renders
    React.useEffect(() => {
      if (getTabStop(id) === null) {
        const [firstItem] = getRovingFocusItems(id);
        if (firstItem) firstItem.tabIndex = 0;
      }
    }, [id]);

    return <RovingFocusContext.Provider value={context}>{children}</RovingFocusContext.Provider>;
  }
);

RovingFocusGroup.displayName = GROUP_NAME;

/* -------------------------------------------------------------------------------------------------
 * useRovingFocus
 * -----------------------------------------------------------------------------------------------*/
const ITEM_NAME = 'RovingFocusItem';

type UseRovingFocusItemOptions = { disabled?: boolean; isDefaultTabStop?: boolean };

function useRovingFocus({ disabled, isDefaultTabStop }: UseRovingFocusItemOptions) {
  const { id, orientation, dir, loop } = useRovingFocusContext(ITEM_NAME);

  if (disabled) {
    return {
      tabIndex: -1,
      // we prevent focusing disabled items on `mousedown`. Even though the item has tabIndex={-1},
      // that only means take it out of the tabbable order
      onMouseDown: (event: React.MouseEvent) => event.preventDefault(),
    };
  }

  return {
    [getPartDataAttr(ITEM_NAME)]: id,
    tabIndex: isDefaultTabStop ? 0 : -1,
    onKeyDown: (event: React.KeyboardEvent) => {
      const focusIntent = getFocusIntent(event, orientation, dir);

      // stop key events from propagating to parent in case we're in a nested roving focus group
      if (KEYS.includes(event.key)) event.stopPropagation();

      if (focusIntent !== undefined) {
        event.preventDefault();

        const items = getRovingFocusItems(id);
        const count = items.length;
        const currentTabStop = getTabStop(id);
        const currentIndex = currentTabStop ? items.indexOf(currentTabStop) : -1;
        const map = { first: 0, last: count - 1, prev: currentIndex - 1, next: currentIndex + 1 };
        let nextIndex = map[focusIntent];
        nextIndex = loop ? wrap(nextIndex, count) : clamp(nextIndex, [0, count - 1]);
        focusItem(id, items[nextIndex]);
      }
    },
  };
}

/* -----------------------------------------------------------------------------------------------*/

// prettier-ignore
const MAP_KEY_TO_FOCUS_INTENT: Record<string, FocusIntent> = {
  ArrowLeft: 'prev', ArrowUp: 'prev',
  ArrowRight: 'next', ArrowDown: 'next',
  PageUp: 'first', Home: 'first',
  PageDown: 'last', End: 'last',
};
const KEYS = Object.keys(MAP_KEY_TO_FOCUS_INTENT);

function getDirectionAwareKey(key: string, dir?: Direction) {
  if (dir !== 'rtl') return key;
  return key === 'ArrowLeft' ? 'ArrowRight' : key === 'ArrowRight' ? 'ArrowLeft' : key;
}

type FocusIntent = 'first' | 'last' | 'prev' | 'next';

function getFocusIntent(event: React.KeyboardEvent, orientation?: Orientation, dir?: Direction) {
  const key = getDirectionAwareKey(event.key, dir);
  if (orientation === 'vertical' && ['ArrowLeft', 'ArrowRight'].includes(key)) return undefined;
  if (orientation === 'horizontal' && ['ArrowUp', 'ArrowDown'].includes(key)) return undefined;
  return MAP_KEY_TO_FOCUS_INTENT[key];
}

const makeItemSelector = (id: string) => `[${getPartDataAttr(ITEM_NAME)}="${id}"]`;

function getRovingFocusItems(id: string): HTMLElement[] {
  return Array.from(document.querySelectorAll(makeItemSelector(id)));
}

function getTabStop(id: string): HTMLElement | null {
  return document.querySelector(`${makeItemSelector(id)}[tabIndex="0"]`);
}

function focusItem(id: string, item?: HTMLElement) {
  if (item) {
    const tabStop = getTabStop(id);
    if (tabStop) tabStop.tabIndex = -1;
    item.tabIndex = 0;
    item.focus();
  }
}

export { RovingFocusGroup, useRovingFocus };
export type { RovingFocusGroupProps, RovingFocusGroupAPI };
