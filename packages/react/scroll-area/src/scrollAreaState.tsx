import { Axis, Size, ResizeBehavior, ScrollAreaRefs } from './types';
import { canScroll, getScrollSize, getClientSize, scrollBy } from './scrollAreaUtils';

export enum ScrollAreaState {
  Idle,
  Thumbing,
  Tracking,
  ButtonScrolling,
}

export enum ScrollAreaEvents {
  DeriveStateFromProps,
  HandleScrollAreaResize,
  HandleContentAreaResize,
  HandleScrollbarResize,
  HandleThumbResize,
  HandleTrackResize,
  MoveThumbWithPointer,
  SetContentOverflowing,
  SetExplicitResize,
  StartTracking,
  StopTracking,
  StartThumbing,
  StopThumbing,
  StartButtonPress,
  StopButtonPress,
}

// prettier-ignore
export type ScrollAreaEvent =
  | { type: ScrollAreaEvents.SetExplicitResize; value: ResizeBehavior }
  | { type: ScrollAreaEvents.HandleScrollAreaResize; width: number; height: number }
  | { type: ScrollAreaEvents.HandleContentAreaResize; width: number; height: number }
  | { type: ScrollAreaEvents.HandleScrollbarResize; axis: Axis; width: number; height: number }
  | { type: ScrollAreaEvents.HandleThumbResize; axis: Axis; width: number; height: number }
  | { type: ScrollAreaEvents.HandleTrackResize; axis: Axis; width: number; height: number }
  | { type: ScrollAreaEvents.MoveThumbWithPointer; axis: Axis; pointerPosition: number; pointerStartPointRef: React.MutableRefObject<number> }
  | { type: ScrollAreaEvents.StartTracking }
  | { type: ScrollAreaEvents.StopTracking }
  | { type: ScrollAreaEvents.StartThumbing }
  | { type: ScrollAreaEvents.StopThumbing }
  | { type: ScrollAreaEvents.StartButtonPress }
  | { type: ScrollAreaEvents.StopButtonPress }
  | { type: ScrollAreaEvents.SetContentOverflowing; x: boolean; y: boolean }

export type ScrollAreaReducerState = {
  state: ScrollAreaState;
  scrollAreaSize: Size;
  contentAreaSize: Size;
  positionSize: Size;
  scrollbarYSize: Size;
  scrollbarXSize: Size;
  trackYSize: Size;
  trackXSize: Size;
  explicitResize: ResizeBehavior;
  contentIsOverflowingX: boolean;
  contentIsOverflowingY: boolean;
};

export function reducer(
  context: ScrollAreaReducerState,
  event: ScrollAreaEvent
): ScrollAreaReducerState {
  const refs: ScrollAreaRefs = (event as any).refs;
  const positionElement = refs.positionRef.current!;
  const scrollAreaElement = refs.scrollAreaRef.current!;

  switch (event.type) {
    case ScrollAreaEvents.SetExplicitResize: {
      return {
        ...context,
        explicitResize: event.value,
      };
    }
    case ScrollAreaEvents.HandleScrollAreaResize: {
      // We need a fixed width for the position element based on the content box size of the scroll
      // area. Since the inner elements rely on some absolute positioning, technically the content
      // box size will always be zero so we need to calculate it ourselves with computed styles.
      // Since scroll area doesn't update React state in response to events, it shouldn't re-render
      // very often in a real app so I don't think this will be a bottleneck for us. The
      // computations will be more critical in the composer where we need style changes to trigger
      // re-renders.
      const computedStyle = window.getComputedStyle(scrollAreaElement);
      const borderTopWidth = parseInt(computedStyle.borderTopWidth);
      const borderRightWidth = parseInt(computedStyle.borderRightWidth);
      const borderBottomWidth = parseInt(computedStyle.borderBottomWidth);
      const borderLeftWidth = parseInt(computedStyle.borderLeftWidth);
      const paddingTop = parseInt(computedStyle.paddingTop);
      const paddingRight = parseInt(computedStyle.paddingRight);
      const paddingBottom = parseInt(computedStyle.paddingBottom);
      const paddingLeft = parseInt(computedStyle.paddingLeft);

      return {
        ...context,
        scrollAreaSize: {
          width: event.width,
          height: event.height,
        },
        positionSize: {
          width: event.width - borderLeftWidth - borderRightWidth - paddingLeft - paddingRight,
          height: event.height - borderTopWidth - borderBottomWidth - paddingTop - paddingBottom,
        },
      };
    }
    case ScrollAreaEvents.SetContentOverflowing: {
      return {
        ...context,
        contentIsOverflowingX: event.x,
        contentIsOverflowingY: event.y,
      };
    }
    case ScrollAreaEvents.HandleContentAreaResize: {
      return {
        ...context,
        contentAreaSize: {
          width: event.width,
          height: event.height,
        },
      };
    }
    case ScrollAreaEvents.HandleScrollbarResize: {
      return {
        ...context,
        [event.axis === 'x' ? 'scrollbarXSize' : 'scrollbarYSize']: {
          height: event.height,
          width: event.width,
        },
      };
    }
    case ScrollAreaEvents.HandleThumbResize: {
      return context;
    }
    case ScrollAreaEvents.HandleTrackResize: {
      return {
        ...context,
        [event.axis === 'x' ? 'trackYSize' : 'trackXSize']: {
          height: event.height,
          width: event.width,
        },
      };
    }
    case ScrollAreaEvents.StartTracking: {
      return {
        ...context,
        state: ScrollAreaState.Tracking,
      };
    }
    case ScrollAreaEvents.StopTracking: {
      return {
        ...context,
        state: ScrollAreaState.Idle,
      };
    }
    case ScrollAreaEvents.StartThumbing: {
      return {
        ...context,
        state: ScrollAreaState.Thumbing,
      };
    }
    case ScrollAreaEvents.MoveThumbWithPointer: {
      const { axis, pointerStartPointRef, pointerPosition } = event;
      const delta = pointerPosition - pointerStartPointRef.current;
      if (canScroll(positionElement, { axis, delta })) {
        const totalScrollSize = getScrollSize(positionElement, { axis });
        const visibleSize = getClientSize(positionElement, { axis });
        const visibleToTotalRatio = visibleSize / totalScrollSize;

        scrollBy(positionElement, { axis, value: delta / visibleToTotalRatio });
        pointerStartPointRef.current = pointerPosition;

        return {
          ...context,
          state: ScrollAreaState.Thumbing,
        };
      }

      return context;
    }
    case ScrollAreaEvents.StopThumbing: {
      return {
        ...context,
        state: ScrollAreaState.Idle,
      };
    }
    case ScrollAreaEvents.StartButtonPress: {
      return {
        ...context,
        state: ScrollAreaState.ButtonScrolling,
      };
    }
    case ScrollAreaEvents.StopButtonPress: {
      return {
        ...context,
        state: ScrollAreaState.Idle,
      };
    }
  }

  return context;
}
