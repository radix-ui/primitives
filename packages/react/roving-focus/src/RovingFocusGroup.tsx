import * as React from 'react';
import { composeEventHandlers } from '@radix-ui/primitive';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import { createContext } from '@radix-ui/react-context';
import { Primitive } from '@radix-ui/react-primitive';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { useId } from '@radix-ui/react-id';

import type * as Polymorphic from '@radix-ui/react-polymorphic';

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
   * The direction of navigation between toolbar items.
   * @defaultValue ltr
   */
  dir?: Direction;
  /**
   * Whether keyboard navigation should loop around
   * @defaultValue false
   */
  loop?: boolean;
};

type Item = { ref: React.RefObject<HTMLElement>; id: string; focusable: boolean; active: boolean };
type RovingContextValue = RovingFocusGroupOptions & {
  itemMap: Map<string, Item>;
  currentTabStopId: string | null;
  onInteract(): void;
  onItemFocus(tabStopId: string): void;
  onItemShiftTab(): void;
};

const [RovingFocusProvider, useRovingFocusContext] = createContext<RovingContextValue>(GROUP_NAME);

type RovingFocusGroupOwnProps = Polymorphic.Merge<
  Polymorphic.OwnProps<typeof Primitive>,
  RovingFocusGroupOptions & {
    reachable?: boolean;
    defaultReachable?: boolean;
    onReachableChange?: (reachable: boolean) => void;
  }
>;

type RovingFocusGroupPrimitive = Polymorphic.ForwardRefComponent<
  typeof GROUP_DEFAULT_TAG,
  RovingFocusGroupOwnProps
>;

const RovingFocusGroup = React.forwardRef((props, forwardedRef) => {
  const { as = GROUP_DEFAULT_TAG, orientation, dir = 'ltr', loop = false, ...groupProps } = props;
  const itemMap = React.useRef<RovingContextValue['itemMap']>(new Map()).current;
  const [currentTabStopId, setCurrentTabStopId] = React.useState<string | null>(null);
  const [reachable = true, setReachable] = useControllableState({
    prop: props.reachable,
    defaultProp: props.defaultReachable,
    onChange: props.onReachableChange,
  });
  const [hasInteracted, setHasInteracted] = React.useState(false);
  const [isTabbingBackOut, setIsTabbingBackOut] = React.useState(false);

  React.useEffect(() => {
    if (!reachable) setCurrentTabStopId(null);
  }, [reachable]);

  return (
    <RovingFocusProvider
      orientation={orientation}
      dir={dir}
      loop={loop}
      itemMap={itemMap}
      currentTabStopId={currentTabStopId}
      onInteract={React.useCallback(() => setHasInteracted(true), [])}
      onItemFocus={React.useCallback(
        (tabStopId) => {
          setCurrentTabStopId(tabStopId);
          setReachable(true);
        },
        [setReachable]
      )}
      onItemShiftTab={React.useCallback(() => setIsTabbingBackOut(true), [])}
    >
      <Primitive
        tabIndex={reachable && !isTabbingBackOut ? 0 : undefined}
        aria-orientation={orientation}
        data-orientation={orientation}
        {...groupProps}
        as={as}
        ref={forwardedRef}
        onFocus={composeEventHandlers(props.onFocus, (event) => {
          if (!isTabbingBackOut && event.target === event.currentTarget) {
            const items = Array.from(itemMap.values()).filter((item) => item.focusable);
            const activeItem = items.find((item) => item.active);
            const currentItem = hasInteracted
              ? items.find((item) => item.id === currentTabStopId)
              : undefined;
            const candidateItems = [activeItem, currentItem, ...items].filter(Boolean) as Item[];
            const candidateNodes = candidateItems.map((item) => item.ref.current!);
            focusFirst(candidateNodes);
          }
        })}
        onBlur={composeEventHandlers(props.onBlur, () => setIsTabbingBackOut(false))}
      />
    </RovingFocusProvider>
  );
}) as RovingFocusGroupPrimitive;

RovingFocusGroup.displayName = GROUP_NAME;

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
  const ref = React.useRef<HTMLElement>(null);
  const composedRefs = useComposedRefs(forwardedRef, ref);
  const context = useRovingFocusContext(ITEM_NAME);
  const isCurrentTabStop = context.currentTabStopId === id;
  const isCurrentTabStopRef = React.useRef(isCurrentTabStop);
  React.useEffect(() => void (isCurrentTabStopRef.current = isCurrentTabStop));

  // We keep an up to date map of every item. We do this on every render
  // to make sure the map insertion order reflects the DOM order.
  React.useEffect(() => {
    context.itemMap.set(id, { ref, id, focusable, active });
    return () => void context.itemMap.delete(id);
  });

  return (
    <Primitive
      tabIndex={isCurrentTabStop ? 0 : -1}
      data-orientation={context.orientation}
      {...itemProps}
      as={as}
      ref={composedRefs}
      onMouseDown={composeEventHandlers(props.onMouseDown, (event) => {
        // We prevent focusing non-focusable items on `mousedown`.
        // Even though the item has tabIndex={-1}, that only means take it out of the tab order.
        if (!focusable) event.preventDefault();
        else context.onInteract();
      })}
      onFocus={composeEventHandlers(props.onFocus, () => context.onItemFocus(id))}
      onKeyDown={composeEventHandlers(props.onKeyDown, (event) => {
        if (event.key === 'Tab' && event.shiftKey) {
          context.onItemShiftTab();
          return;
        }

        if (event.target !== event.currentTarget) return;

        // stop key events from propagating to parent in case we're in a nested roving focus group
        if (KEYS.includes(event.key)) event.stopPropagation();

        const focusIntent = getFocusIntent(event, context.orientation, context.dir);

        if (focusIntent !== undefined) {
          event.preventDefault();
          context.onInteract();
          const items = Array.from(context.itemMap.values()).filter((item) => item.focusable);
          let candidateNodes = items.map((item) => item.ref.current!);

          if (focusIntent === 'first' || focusIntent === 'last') {
            if (focusIntent === 'last') candidateNodes.reverse();
          }

          if (focusIntent === 'prev' || focusIntent === 'next') {
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
  );
}) as RovingFocusItemPrimitive;

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
