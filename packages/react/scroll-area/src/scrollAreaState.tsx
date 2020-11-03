import { Axis, Size, ResizeBehavior, ScrollAreaRefs, ScrollbarVisibility } from './types';
import {
  canScroll,
  getScrollSize,
  setScrollPosition,
  getTrackRef,
  getThumbRef,
} from './scrollAreaUtils';

export enum ScrollAreaState {
  Idle,
  Thumbing,
  Tracking,
  ButtonScrolling,
}

export enum ScrollAreaEvents {
  DeriveStateFromProps,
  HandleScrollAreaResize,
  HandleViewportResize,
  HandleScrollbarResize,
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
  SetScrollbarIsVisible,
}

// prettier-ignore
export type ScrollAreaEvent =
  | { type: ScrollAreaEvents.SetExplicitResize; value: ResizeBehavior }
  | { type: ScrollAreaEvents.HandleScrollAreaResize; width: number; height: number }
  | { type: ScrollAreaEvents.HandleViewportResize; width: number; height: number }
  | { type: ScrollAreaEvents.HandleScrollbarResize; axis: Axis; width: number; height: number }
  | { type: ScrollAreaEvents.HandleTrackResize; axis: Axis; width: number; height: number }
  | { type: ScrollAreaEvents.MoveThumbWithPointer; axis: Axis; pointerPosition: number; pointerStartPointRef: React.MutableRefObject<number>; pointerInitialStartPointRef: React.MutableRefObject<number>; thumbInitialData: React.MutableRefObject<{ size: number; positionStart: number }>; trackInitialData: React.MutableRefObject<{ size: number; positionStart: number }> }
  | { type: ScrollAreaEvents.StartTracking }
  | { type: ScrollAreaEvents.StopTracking }
  | { type: ScrollAreaEvents.StartThumbing }
  | { type: ScrollAreaEvents.StopThumbing }
  | { type: ScrollAreaEvents.StartButtonPress }
  | { type: ScrollAreaEvents.StopButtonPress }
  | { type: ScrollAreaEvents.SetContentOverflowing; x: boolean; y: boolean }
  | { type: ScrollAreaEvents.SetScrollbarIsVisible; scrollbarVisibility: ScrollbarVisibility; x?: boolean; y?: boolean; }

export type ScrollAreaReducerState = {
  state: ScrollAreaState;
  explicitResize: ResizeBehavior;
  contentIsOverflowingX: boolean;
  contentIsOverflowingY: boolean;
  scrollbarIsVisibleX: boolean;
  scrollbarIsVisibleY: boolean;
  domSizes: {
    scrollArea: Size;
    viewport: Size;
    position: Size;
    scrollbarY: Size;
    scrollbarX: Size;
    trackY: Size;
    trackX: Size;
  };
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
        domSizes: {
          ...context.domSizes,
          scrollArea: {
            width: event.width,
            height: event.height,
          },
          position: {
            width: event.width - borderLeftWidth - borderRightWidth - paddingLeft - paddingRight,
            height: event.height - borderTopWidth - borderBottomWidth - paddingTop - paddingBottom,
          },
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
    case ScrollAreaEvents.SetScrollbarIsVisible: {
      if (event.scrollbarVisibility === 'always') {
        return {
          ...context,
          scrollbarIsVisibleX: true,
          scrollbarIsVisibleY: true,
        };
      }
      return {
        ...context,
        scrollbarIsVisibleX: event.x ?? context.scrollbarIsVisibleX,
        scrollbarIsVisibleY: event.y ?? context.scrollbarIsVisibleY,
      };
    }
    case ScrollAreaEvents.HandleViewportResize: {
      return {
        ...context,
        domSizes: {
          ...context.domSizes,
          viewport: {
            width: event.width,
            height: event.height,
          },
        },
      };
    }
    case ScrollAreaEvents.HandleScrollbarResize: {
      return {
        ...context,
        domSizes: {
          ...context.domSizes,
          [event.axis === 'x' ? 'scrollbarX' : 'scrollbarY']: {
            height: event.height,
            width: event.width,
          },
        },
      };
    }
    case ScrollAreaEvents.HandleTrackResize: {
      return {
        ...context,
        domSizes: {
          ...context.domSizes,
          [event.axis === 'x' ? 'trackX' : 'trackY']: {
            height: event.height,
            width: event.width,
          },
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
      const {
        axis,
        pointerStartPointRef,
        pointerInitialStartPointRef,
        thumbInitialData,
        trackInitialData,
        pointerPosition,
      } = event;
      const trackElement = getTrackRef(axis, refs).current;
      const thumbElement = getThumbRef(axis, refs).current;

      if (!trackElement || !thumbElement) {
        return context;
      }

      const delta = pointerPosition - pointerStartPointRef.current;

      if (canScroll(positionElement, { axis, delta })) {
        // Offset by the distance between the initial pointer's distance from the initial
        // position of the thumb
        const { positionStart: trackPosition } = trackInitialData.current;
        const { positionStart: thumbInitialPosition } = thumbInitialData.current;
        const pointerOffset = pointerInitialStartPointRef.current - thumbInitialPosition;

        const trackSize =
          axis === 'x' ? context.domSizes.trackX.width : context.domSizes.trackY.height;
        const pointerPositionRelativeToTrack = Math.round(pointerPosition - trackPosition);
        const viewportRatioFromPointer =
          Math.round(((pointerPositionRelativeToTrack - pointerOffset) / trackSize) * 100) / 100;
        const scrollSize = getScrollSize(positionElement, { axis });
        const value = viewportRatioFromPointer * scrollSize;
        setScrollPosition(positionElement, { axis, value });

        // Reset the pointer start point for the next pointer movement
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
