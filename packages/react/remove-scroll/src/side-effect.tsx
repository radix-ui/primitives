// Fork of https://github.com/theKashey/react-remove-scroll
// MIT License, Copyright (c) Anton Korzunov
import * as React from 'react';
import type { TouchEvent } from 'react';
import { RemoveScrollBar } from './lib/react-remove-scroll-bar/index.js';
import { styleSingleton } from './lib/react-style-singleton/index.js';
import { nonPassive } from './aggresive-capture.js';
import { handleScroll, locationCouldBeScrolled } from './handle-scroll.js';
import type { Axis, IRemoveScrollEffectProps } from './types.js';

export const getTouchXY = (event: TouchEvent | WheelEvent) =>
  'changedTouches' in event
    ? [event.changedTouches[0]!.clientX, event.changedTouches[0]!.clientY]
    : [0, 0];

export const getDeltaXY = (event: WheelEvent) => [event.deltaX, event.deltaY];

const extractRef = (ref: React.RefObject<any> | HTMLElement): HTMLElement =>
  ref && 'current' in ref ? ref.current : ref;

const deltaCompare = (x: number[], y: number[]) => x[0] === y[0] && x[1] === y[1];

const generateStyle = (id: number) => `
  .block-interactivity-${id} {pointer-events: none;}
  .allow-interactivity-${id} {pointer-events: all;}
`;

let idCounter = 0;
let lockStack: any[] = [];

export function RemoveScrollSideCar(props: IRemoveScrollEffectProps) {
  const shouldPreventQueue = React.useRef<
    Array<{
      name: string;
      delta: number[];
      target: any;
      should: boolean;
      shadowParent?: HTMLElement | null;
    }>
  >([]);
  const touchStartRef = React.useRef([0, 0]);
  const activeAxis = React.useRef<Axis | undefined>(undefined);
  const [id] = React.useState(idCounter++);
  const [Style] = React.useState(styleSingleton);
  const lastProps = React.useRef<IRemoveScrollEffectProps>(props);

  React.useEffect(() => {
    lastProps.current = props;
  }, [props]);

  React.useEffect(() => {
    if (props.inert) {
      document.body.classList.add(`block-interactivity-${id}`);

      const allow = [props.lockRef.current, ...(props.shards || []).map(extractRef)].filter(
        Boolean,
      );
      allow.forEach((el) => el!.classList.add(`allow-interactivity-${id}`));

      return () => {
        document.body.classList.remove(`block-interactivity-${id}`);
        allow.forEach((el) => el!.classList.remove(`allow-interactivity-${id}`));
      };
    }

    return;
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [props.inert, props.lockRef.current, props.shards]);

  const shouldCancelEvent = React.useCallback(
    (event: WheelEvent | TouchEvent, parent: HTMLElement) => {
      if (
        ('touches' in event && event.touches.length === 2) ||
        (event.type === 'wheel' && event.ctrlKey)
      ) {
        return !lastProps.current.allowPinchZoom;
      }

      const touch = getTouchXY(event);
      const touchStart = touchStartRef.current;
      const deltaX = 'deltaX' in event ? event.deltaX : touchStart[0]! - touch[0]!;
      const deltaY = 'deltaY' in event ? event.deltaY : touchStart[1]! - touch[1]!;

      let currentAxis: Axis | undefined;
      const target: HTMLElement = event.target as any;

      const moveDirection: Axis = Math.abs(deltaX) > Math.abs(deltaY) ? 'h' : 'v';

      // allow horizontal touch move on Range inputs. They will not cause any scroll
      if (
        'touches' in event &&
        moveDirection === 'h' &&
        (target as HTMLInputElement).type === 'range'
      ) {
        return false;
      }

      // allow drag selection (iOS); check if selection's anchorNode is the same as target or contains target
      const selection = window.getSelection();
      const anchorNode = selection && selection.anchorNode;
      const isTouchingSelection = anchorNode
        ? anchorNode === target || anchorNode.contains(target)
        : false;

      if (isTouchingSelection) {
        return false;
      }

      let canBeScrolledInMainDirection = locationCouldBeScrolled(moveDirection, target);

      if (!canBeScrolledInMainDirection) {
        return true;
      }

      if (canBeScrolledInMainDirection) {
        currentAxis = moveDirection;
      } else {
        currentAxis = moveDirection === 'v' ? 'h' : 'v';
        canBeScrolledInMainDirection = locationCouldBeScrolled(moveDirection, target);
        // other axis might be not scrollable
      }

      if (!canBeScrolledInMainDirection) {
        return false;
      }

      if (!activeAxis.current && 'changedTouches' in event && (deltaX || deltaY)) {
        activeAxis.current = currentAxis;
      }

      if (!currentAxis) {
        return true;
      }

      const cancelingAxis = activeAxis.current || currentAxis;

      return handleScroll(
        cancelingAxis,
        parent,
        event,
        cancelingAxis === 'h' ? deltaX : deltaY,
        true,
      );
    },
    [],
  );

  const shouldPrevent = React.useCallback((_event: Event) => {
    const event: WheelEvent | TouchEvent = _event as any;

    if (!lockStack.length || lockStack[lockStack.length - 1] !== Style) {
      // not the last active
      return;
    }

    const delta = 'deltaY' in event ? getDeltaXY(event) : getTouchXY(event);
    const sourceEvent = shouldPreventQueue.current.filter(
      (e) =>
        e.name === event.type &&
        (e.target === event.target || event.target === e.shadowParent) &&
        deltaCompare(e.delta, delta),
    )[0];

    // self event, and should be canceled
    if (sourceEvent && sourceEvent.should) {
      if (event.cancelable) {
        event.preventDefault();
      }

      return;
    }

    // outside or shard event
    if (!sourceEvent) {
      const shardNodes = (lastProps.current.shards || [])
        .map(extractRef)
        .filter(Boolean)
        .filter((node) => node.contains(event.target as any));

      const shouldStop =
        shardNodes.length > 0
          ? shouldCancelEvent(event, shardNodes[0]!)
          : !lastProps.current.noIsolation;

      if (shouldStop) {
        if (event.cancelable) {
          event.preventDefault();
        }
      }
    }
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const shouldCancel = React.useCallback(
    (name: string, delta: number[], target: any, should: boolean) => {
      const event = { name, delta, target, should, shadowParent: getOutermostShadowParent(target) };
      shouldPreventQueue.current.push(event);

      setTimeout(() => {
        shouldPreventQueue.current = shouldPreventQueue.current.filter((e) => e !== event);
      }, 1);
    },
    [],
  );

  const scrollTouchStart = React.useCallback((event: any) => {
    touchStartRef.current = getTouchXY(event);
    activeAxis.current = undefined;
  }, []);

  const scrollWheel = React.useCallback((event: WheelEvent) => {
    shouldCancel(
      event.type,
      getDeltaXY(event),
      event.target,
      shouldCancelEvent(event, props.lockRef.current as any),
    );
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollTouchMove = React.useCallback((event: TouchEvent<HTMLDivElement>) => {
    shouldCancel(
      event.type,
      getTouchXY(event),
      event.target,
      shouldCancelEvent(event, props.lockRef.current as any),
    );
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    lockStack.push(Style);

    props.setCallbacks({
      onScrollCapture: scrollWheel,
      onWheelCapture: scrollWheel,
      onTouchMoveCapture: scrollTouchMove,
    });

    document.addEventListener('wheel', shouldPrevent, nonPassive);
    document.addEventListener('touchmove', shouldPrevent, nonPassive);
    document.addEventListener('touchstart', scrollTouchStart, nonPassive);

    return () => {
      lockStack = lockStack.filter((inst) => inst !== Style);

      document.removeEventListener('wheel', shouldPrevent, nonPassive as any);
      document.removeEventListener('touchmove', shouldPrevent, nonPassive as any);
      document.removeEventListener('touchstart', scrollTouchStart, nonPassive as any);
    };
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { removeScrollBar, inert } = props;

  return (
    <React.Fragment>
      {inert ? <Style styles={generateStyle(id)} /> : null}
      {removeScrollBar ? (
        <RemoveScrollBar noRelative={props.noRelative} gapMode={props.gapMode} />
      ) : null}
    </React.Fragment>
  );
}

function getOutermostShadowParent(node: Node | null): HTMLElement | null {
  let shadowParent: HTMLElement | null = null;
  while (node !== null) {
    if (node instanceof ShadowRoot) {
      shadowParent = node.host as HTMLElement;
      node = node.host;
    }
    node = node.parentNode;
  }
  return shadowParent;
}
