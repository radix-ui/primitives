import * as React from 'react';
import { composeEventHandlers } from '@radix-ui/primitive';
import { createCollection } from '@radix-ui/react-collection';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import { createContext } from '@radix-ui/react-context';
import { useId } from '@radix-ui/react-id';
import { Primitive } from '@radix-ui/react-primitive';
import { useCallbackRef } from '@radix-ui/react-use-callback-ref';
import { useControllableState } from '@radix-ui/react-use-controllable-state';

import type * as Polymorphic from '@radix-ui/react-polymorphic';

const ENTRY_FOCUS = 'rovingFocusGroup.onEntryFocus';
const EVENT_OPTIONS = { bubbles: false, cancelable: true };

type ItemData = { id: string; focusable: boolean; active: boolean };
const [CollectionSlot, CollectionItemSlot, useCollection] = createCollection<
  HTMLSpanElement,
  ItemData
>();

/* -------------------------------------------------------------------------------------------------
 * RovingFocusGroup
 * -----------------------------------------------------------------------------------------------*/

const GROUP_NAME = 'RovingFocusGroup';
const GROUP_DEFAULT_TAG = 'span';

type Orientation = React.AriaAttributes['aria-orientation'];
type Direction = 'ltr' | 'rtl';

type RovingFocusGroupOptions = {
  /**
   * The orientation of the group.
   * Mainly so arrow navigation is done accordingly (left & right vs. up & down)
   */
  orientation?: Orientation;
  /**
   * The direction of navigation between items.
   * @defaultValue ltr
   */
  dir?: Direction;
  /**
   * Whether keyboard navigation should loop around
   * @defaultValue false
   */
  loop?: boolean;
};

type RovingContextValue = RovingFocusGroupOptions & {
  currentTabStopId: string | null;
  onItemFocus(tabStopId: string): void;
  onItemShiftTab(): void;
};

const [RovingFocusProvider, useRovingFocusContext] = createContext<RovingContextValue>(GROUP_NAME);

type RovingFocusGroupOwnProps = Polymorphic.OwnProps<typeof RovingFocusGroupImpl>;

type RovingFocusGroupPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof RovingFocusGroupImpl>,
  RovingFocusGroupOwnProps
>;

const RovingFocusGroup = React.forwardRef((props, forwardedRef) => {
  return (
    <CollectionSlot>
      <RovingFocusGroupImpl {...props} ref={forwardedRef} />
    </CollectionSlot>
  );
}) as RovingFocusGroupPrimitive;

RovingFocusGroup.displayName = GROUP_NAME;

type RovingFocusGroupImplOwnProps = Polymorphic.Merge<
  Polymorphic.OwnProps<typeof Primitive>,
  RovingFocusGroupOptions & {
    currentTabStopId?: string | null;
    defaultCurrentTabStopId?: string;
    onCurrentTabStopIdChange?: (tabStopId: string | null) => void;
    onEntryFocus?: (event: Event) => void;
  }
>;

type RovingFocusGroupImplPrimitive = Polymorphic.ForwardRefComponent<
  typeof GROUP_DEFAULT_TAG,
  RovingFocusGroupImplOwnProps
>;

const RovingFocusGroupImpl = React.forwardRef((props, forwardedRef) => {
  const {
    as = GROUP_DEFAULT_TAG,
    orientation,
    dir = 'ltr',
    loop = false,
    currentTabStopId: currentTabStopIdProp,
    defaultCurrentTabStopId,
    onCurrentTabStopIdChange,
    onEntryFocus,
    ...groupProps
  } = props;
  const ref = React.useRef<React.ElementRef<typeof RovingFocusGroup>>(null);
  const composedRefs = useComposedRefs(forwardedRef, ref);
  const [currentTabStopId = null, setCurrentTabStopId] = useControllableState({
    prop: currentTabStopIdProp,
    defaultProp: defaultCurrentTabStopId,
    onChange: onCurrentTabStopIdChange,
  });
  const [isTabbingBackOut, setIsTabbingBackOut] = React.useState(false);
  const handleEntryFocus = useCallbackRef(onEntryFocus);
  const { getItems } = useCollection();

  React.useEffect(() => {
    const node = ref.current;
    if (node) {
      node.addEventListener(ENTRY_FOCUS, handleEntryFocus);
      return () => node.removeEventListener(ENTRY_FOCUS, handleEntryFocus);
    }
  }, [handleEntryFocus]);

  return (
    <RovingFocusProvider
      orientation={orientation}
      dir={dir}
      loop={loop}
      currentTabStopId={currentTabStopId}
      onItemFocus={React.useCallback((tabStopId) => setCurrentTabStopId(tabStopId), [
        setCurrentTabStopId,
      ])}
      onItemShiftTab={React.useCallback(() => setIsTabbingBackOut(true), [])}
    >
      <Primitive
        tabIndex={isTabbingBackOut ? -1 : 0}
        aria-orientation={orientation}
        data-orientation={orientation}
        {...groupProps}
        as={as}
        ref={composedRefs}
        onFocus={composeEventHandlers(props.onFocus, (event) => {
          if (event.target === event.currentTarget && !isTabbingBackOut) {
            const entryFocusEvent = new Event(ENTRY_FOCUS, EVENT_OPTIONS);
            event.currentTarget.dispatchEvent(entryFocusEvent);

            if (!entryFocusEvent.defaultPrevented) {
              const items = getItems().filter((item) => item.focusable);
              const activeItem = items.find((item) => item.active);
              const currentItem = items.find((item) => item.id === currentTabStopId);
              const candidateItems = [activeItem, currentItem, ...items].filter(
                Boolean
              ) as typeof items;
              const candidateNodes = candidateItems.map((item) => item.ref.current!);
              focusFirst(candidateNodes);
            }
          }
        })}
        onBlur={composeEventHandlers(props.onBlur, () => setIsTabbingBackOut(false))}
      />
    </RovingFocusProvider>
  );
}) as RovingFocusGroupImplPrimitive;

/* -------------------------------------------------------------------------------------------------
 * RovingFocusItem
 * -----------------------------------------------------------------------------------------------*/

const ITEM_NAME = 'RovingFocusItem';
const ITEM_DEFAULT_TAG = 'span';

type RovingFocusItemOwnProps = Polymorphic.Merge<
  Polymorphic.OwnProps<typeof Primitive>,
  {
    focusable?: boolean;
    active?: boolean;
  }
>;

type RovingFocusItemPrimitive = Polymorphic.ForwardRefComponent<
  typeof ITEM_DEFAULT_TAG,
  RovingFocusItemOwnProps
>;

const RovingFocusItem = React.forwardRef((props, forwardedRef) => {
  const { as = ITEM_DEFAULT_TAG, focusable = true, active = false, ...itemProps } = props;
  const id = useId();
  const context = useRovingFocusContext(ITEM_NAME);
  const isCurrentTabStop = context.currentTabStopId === id;
  const { getItems } = useCollection();

  return (
    <CollectionItemSlot id={id} focusable={focusable} active={active}>
      <Primitive
        tabIndex={isCurrentTabStop ? 0 : -1}
        data-orientation={context.orientation}
        {...itemProps}
        as={as}
        ref={forwardedRef}
        onMouseDown={composeEventHandlers(props.onMouseDown, (event) => {
          // We prevent focusing non-focusable items on `mousedown`.
          // Even though the item has tabIndex={-1}, that only means take it out of the tab order.
          if (!focusable) event.preventDefault();
        })}
        onFocus={composeEventHandlers(props.onFocus, () => context.onItemFocus(id))}
        onKeyDown={composeEventHandlers(props.onKeyDown, (event) => {
          if (event.key === 'Tab' && event.shiftKey) {
            context.onItemShiftTab();
            return;
          }

          if (event.target !== event.currentTarget) return;

          const focusIntent = getFocusIntent(event, context.orientation, context.dir);

          if (focusIntent !== undefined) {
            event.preventDefault();
            const items = getItems().filter((item) => item.focusable);
            let candidateNodes = items.map((item) => item.ref.current!);

            if (focusIntent === 'last') candidateNodes.reverse();
            else if (focusIntent === 'prev' || focusIntent === 'next') {
              if (focusIntent === 'prev') candidateNodes.reverse();
              const currentIndex = candidateNodes.indexOf(event.currentTarget);
              candidateNodes = context.loop
                ? wrapArray(candidateNodes, currentIndex + 1)
                : candidateNodes.slice(currentIndex + 1);
            }

            /**
             * Imperative focus during keydown is risky so we prevent React's batching updates
             * to avoid potential bugs. See: https://github.com/facebook/react/issues/20332
             */
            setTimeout(() => focusFirst(candidateNodes));
          }
        })}
      />
    </CollectionItemSlot>
  );
}) as RovingFocusItemPrimitive;

RovingFocusItem.displayName = ITEM_NAME;

/* -----------------------------------------------------------------------------------------------*/

// prettier-ignore
const MAP_KEY_TO_FOCUS_INTENT: Record<string, FocusIntent> = {
  ArrowLeft: 'prev', ArrowUp: 'prev',
  ArrowRight: 'next', ArrowDown: 'next',
  PageUp: 'first', Home: 'first',
  PageDown: 'last', End: 'last',
};

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

function focusFirst(candidates: HTMLElement[]) {
  const PREVIOUSLY_FOCUSED_ELEMENT = document.activeElement;
  for (const candidate of candidates) {
    // if focus is already where we want to go, we don't want to keep going through the candidates
    if (candidate === PREVIOUSLY_FOCUSED_ELEMENT) return;
    candidate.focus();
    if (document.activeElement !== PREVIOUSLY_FOCUSED_ELEMENT) return;
  }
}

/**
 * Wraps an array around itself at a given start index
 * Example: `wrapArray(['a', 'b', 'c', 'd'], 2) === ['c', 'd', 'a', 'b']`
 */
function wrapArray<T>(array: T[], startIndex: number) {
  return array.map((_, index) => array[(startIndex + index) % array.length]);
}

const Root = RovingFocusGroup;
const Item = RovingFocusItem;

export {
  RovingFocusGroup,
  RovingFocusItem,
  //
  Root,
  Item,
};
