import * as React from 'react';
import { wrap, clamp } from '@radix-ui/number';
import { createContextObj, useControlledState } from '@radix-ui/react-utils';
import { useId } from '@radix-ui/react-id';

/* -------------------------------------------------------------------------------------------------
 * RovingFocusGroup
 * -----------------------------------------------------------------------------------------------*/
type Orientation = React.AriaAttributes['aria-orientation'];
type Direction = 'ltr' | 'rtl';

type RovingFocusGroupOptions = {
  orientation?: Orientation;
  dir?: Direction;
  loop?: boolean;
};

type RovingContextValue = {
  groupId: string;
  tabStopId: string | null;
  onTabStopIdChange(itemId: string, active?: boolean): void;
  reachable: boolean;
  onReachableChange(reachable: boolean): void;
} & RovingFocusGroupOptions;

const GROUP_NAME = 'RovingFocusGroup';

const [RovingFocusProvider, useRovingFocusContext] = createContextObj<RovingContextValue>(
  GROUP_NAME
);

type RovingFocusGroupProps = RovingFocusGroupOptions & {
  children?: React.ReactNode;
  reachable?: boolean;
  defaultReachable?: boolean;
  onReachableChange?: (reachable: boolean) => void;
};

function RovingFocusGroup(props: RovingFocusGroupProps) {
  const { children, orientation, loop, dir } = props;
  const [reachable = true, setReachable] = useControlledState({
    prop: props.reachable,
    defaultProp: props.defaultReachable,
    onChange: props.onReachableChange,
  });
  const [tabStopId, setTabStopId] = React.useState<string | null>(null);
  const handleTabStopIdChange = React.useCallback(
    (itemId, active) => {
      setTabStopId((prevTabStopId) => {
        const nextTabStopId = active || !prevTabStopId ? itemId : prevTabStopId;
        return reachable ? nextTabStopId : null;
      });
    },
    [reachable]
  );

  return (
    <RovingFocusProvider
      groupId={useId()}
      orientation={orientation}
      dir={dir}
      loop={loop}
      tabStopId={tabStopId}
      onTabStopIdChange={handleTabStopIdChange}
      reachable={reachable}
      onReachableChange={setReachable}
    >
      {children}
    </RovingFocusProvider>
  );
}

RovingFocusGroup.displayName = GROUP_NAME;

/* -------------------------------------------------------------------------------------------------
 * useRovingFocus
 * -----------------------------------------------------------------------------------------------*/
const ITEM_NAME = 'RovingFocusItem';

type UseRovingFocusItemOptions = { disabled?: boolean; active?: boolean };

function useRovingFocus({ disabled, active }: UseRovingFocusItemOptions) {
  const itemId = useId();
  const context = useRovingFocusContext(ITEM_NAME);
  const isTabStop = itemId === context.tabStopId;

  // keep `context.tabStopId` in sync
  const { onTabStopIdChange } = context;
  React.useEffect(() => {
    onTabStopIdChange(itemId, active);
  }, [active, itemId, onTabStopIdChange]);

  if (disabled) {
    return {
      tabIndex: -1,
      // we prevent focusing disabled items on `mousedown`. Even though the item has tabIndex={-1},
      // that only means take it out of the tabbable order
      onMouseDown: (event: React.MouseEvent) => event.preventDefault(),
    };
  }

  return {
    [GROUP_ID_DATA_ATTR]: context.groupId,
    tabIndex: isTabStop ? 0 : -1,
    onFocus: () => {
      context.onReachableChange(true);
      context.onTabStopIdChange(itemId);
    },
    onKeyDown: (event: React.KeyboardEvent) => {
      const focusIntent = getFocusIntent(event, context.orientation, context.dir);

      // stop key events from propagating to parent in case we're in a nested roving focus group
      if (KEYS.includes(event.key)) event.stopPropagation();

      if (focusIntent !== undefined) {
        event.preventDefault();

        const items = getRovingFocusItems(context.groupId);
        const count = items.length;
        const currentItem = document.activeElement as HTMLElement | null;
        const currentIndex = currentItem ? items.indexOf(currentItem) : -1;
        const map = { first: 0, last: count - 1, prev: currentIndex - 1, next: currentIndex + 1 };
        let nextIndex = map[focusIntent];
        nextIndex = context.loop ? wrap(nextIndex, count) : clamp(nextIndex, [0, count - 1]);
        const nextItem = items[nextIndex];
        if (nextItem) {
          /**
           * Imperative focus during keydown is risky so we prevent React's batching updates
           * to avoid potential bugs. See: https://github.com/facebook/react/issues/20332
           */
          setTimeout(() => nextItem.focus());
        }
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

const GROUP_ID_DATA_ATTR = 'data-radix-roving-focus-group-id';

function getRovingFocusItems(groupId: string): HTMLElement[] {
  return Array.from(document.querySelectorAll(`[${GROUP_ID_DATA_ATTR}="${groupId}"]`));
}

const Root = RovingFocusGroup;

export {
  RovingFocusGroup,
  //
  Root,
  //
  useRovingFocus,
};
