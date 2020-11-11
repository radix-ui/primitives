import { Axis, clamp, getResizeObserverEntryBorderBoxSize, canUseDOM } from '@interop-ui/utils';
import { useCallbackRef, useLayoutEffect } from '@interop-ui/react-utils';
import { ScrollDirection, LogicalDirection, PointerPosition, ScrollAreaRefs } from './types';

export function supportsCustomScrollbars() {
  if (!canUseDOM()) return false;
  let supportsWebkitScrollbarSelector = false;
  try {
    // We cannot rely on `CSS.supports('selector(::-webkit-scrollbar)')` because the selector syntax
    // isn't supported in Safari. document.querySelector will throw if it receives an invalid
    // selector, so we can use that instead and swallow the error.
    document.querySelector('::-webkit-scrollbar');
    supportsWebkitScrollbarSelector = true;
  } catch (error) {}

  return !!(window.CSS?.supports?.('scrollbar-width: none') || supportsWebkitScrollbarSelector);
}

export function shouldFallbackToNativeScroll() {
  return !('ResizeObserver' in window && supportsCustomScrollbars());
}

export function getPointerPosition(event: PointerEvent): PointerPosition {
  return {
    x: event.clientX,
    y: event.clientY,
  };
}

export function getScrollbarRef(axis: Axis, ctx: ScrollAreaRefs) {
  return axis === 'x' ? ctx.scrollbarXRef : ctx.scrollbarYRef;
}

export function getThumbRef(axis: Axis, ctx: ScrollAreaRefs) {
  return axis === 'x' ? ctx.thumbXRef : ctx.thumbYRef;
}

export function getTrackRef(axis: Axis, ctx: ScrollAreaRefs) {
  return axis === 'x' ? ctx.trackXRef : ctx.trackYRef;
}

export function getButtonRef(direction: LogicalDirection, axis: Axis, ctx: ScrollAreaRefs) {
  const actualDirection = getActualScrollDirection(direction, axis);
  switch (actualDirection) {
    case 'down':
      return ctx.buttonDownRef;
    case 'up':
      return ctx.buttonUpRef;
    case 'left':
      return ctx.buttonLeftRef;
    case 'right':
      return ctx.buttonRightRef;
  }
}

export function pointerIsOutsideElement(event: PointerEvent, element: Element, rect?: DOMRect) {
  rect = rect || element.getBoundingClientRect();
  const pos = getPointerPosition(event);
  return pos.x < rect.left || pos.x > rect.right || pos.y < rect.top || pos.y > rect.bottom;
}

/**
 * Gets the distance of needed to move a scroll area when a PageUp/PageDown event occurs, which we
 * need to determine when the user clicks on the scroll track.
 *
 * So how much does the scroll area scroll when a user presses spacebar or PageDown on a native
 * scrollbar? The answer is: depends! It's 100% of the viewport heiht minus ... some mysterious
 * value that differs from env to env. Whatever this value is should be the same value that is
 * scrolled when the user presses the scrollbar track. Several env's do roughly 100% of the viewport
 * height minus ~40px, so that's what I used to recreate the track functionality.
 *
 * @see https://vasilis.nl/nerd/high-scroll-height-scrolling-space-bar/
 */
export function getPagedScrollDistance({
  axis,
  direction,
  positionElement,
}: {
  axis: Axis;
  direction: LogicalDirection;
  positionElement: Element;
}) {
  const visibleSize = getClientSize(positionElement, { axis });
  return (visibleSize - 40) * (direction === 'end' ? 1 : -1);
}

/**
 * Gets the distance of needed to move a scroll area when a the user holds the pointer down on a
 * track for and extended period of time, and the scroll handle jumps to the pointer.
 */
export function getLongPagedScrollDistance({
  axis,
  direction,
  pointerPosition,
  positionElement,
  trackElement,
}: {
  axis: Axis;
  direction: LogicalDirection;
  pointerPosition: PointerPosition;
  positionElement: Element;
  trackElement: Element;
}) {
  const startPosition = getScrollPosition(positionElement, { axis });
  const scrollSize = getScrollSize(positionElement, { axis });
  const visibleSize = getClientSize(positionElement, { axis });
  const { positionStart: trackPosition, size: trackSize } = getLogicalRect(trackElement, {
    axis,
  });
  const pointerPositionRelativeToTrack = Math.round(pointerPosition[axis] - trackPosition);
  const viewportRatioFromPointer =
    Math.round((pointerPositionRelativeToTrack / trackSize) * 100) / 100;
  const destScrollPosition =
    direction === 'start'
      ? viewportRatioFromPointer * scrollSize
      : viewportRatioFromPointer * scrollSize - visibleSize;
  return destScrollPosition < startPosition
    ? destScrollPosition - startPosition - visibleSize / 2
    : destScrollPosition - startPosition + visibleSize / 2;
}

export function getClientSize(element: Element, { axis }: { axis: Axis }) {
  return element[axis === 'x' ? 'clientWidth' : 'clientHeight'];
}

export function getScrollSize(element: Element, { axis }: { axis: Axis }) {
  return element[axis === 'x' ? 'scrollWidth' : 'scrollHeight'];
}

export function getScrollPosition(element: Element, { axis }: { axis: Axis }) {
  return element[axis === 'x' ? 'scrollLeft' : 'scrollTop'];
}

export function setScrollPosition(
  element: Element,
  { axis, value }: { axis: Axis; value: number }
) {
  element[axis === 'x' ? 'scrollLeft' : 'scrollTop'] = value;
}

export function scrollBy(element: Element, { axis, value }: { axis: Axis; value: number }) {
  element[axis === 'x' ? 'scrollLeft' : 'scrollTop'] += value;
}

export function getLogicalRect(element: Element, { axis }: { axis: Axis }) {
  const {
    [axis]: coord,
    [axis === 'y' ? 'top' : 'left']: positionStart,
    [axis === 'y' ? 'bottom' : 'right']: positionEnd,
    [axis === 'y' ? 'height' : 'width']: size,
  } = element.getBoundingClientRect();
  return { coord, positionStart, positionEnd, size };
}

export function getVisibleToTotalRatio(positionElement: HTMLElement, { axis }: { axis: Axis }) {
  const totalScrollSize = getScrollSize(positionElement, { axis });
  const visibleSize = getClientSize(positionElement, { axis });
  return visibleSize / totalScrollSize;
}

export function shouldOverflow(positionElement: HTMLElement, { axis }: { axis: Axis }) {
  return getVisibleToTotalRatio(positionElement, { axis }) < 1;
}

/**
 * Determines the new scroll position (scrollTop/scrollLeft depending on the axis) for the scroll
 * area based on a given distance we want to scroll.
 * @param props
 */
export function getNewScrollPosition(
  element: Element,
  {
    direction,
    distance,
    axis,
  }: {
    direction: LogicalDirection;
    distance: number;
    axis: Axis;
  }
) {
  const { [axis === 'x' ? 'scrollLeft' : 'scrollTop']: scrollPosition } = element;
  const calculatedScrollPosition = scrollPosition + distance;
  const boundary = direction === 'end' ? getMaxScrollStartValue(element, axis) : 0;
  return direction === 'end'
    ? Math.min(boundary, calculatedScrollPosition)
    : Math.max(boundary, calculatedScrollPosition);
}

/**
 * Determines whether or not the user is scrolling towards the end or start of a scrollbar when they
 * click the track. Direction is determined by their click position in relation to the scroll thumb.
 * @param props
 */
export function determineScrollDirectionFromTrackClick({
  event,
  axis,
  thumbElement,
}: {
  event: PointerEvent;
  axis: Axis;
  thumbElement: Element;
}): LogicalDirection {
  const { [axis]: scrollPosition } = getPointerPosition(event);
  return scrollPosition < thumbElement.getBoundingClientRect()[axis === 'y' ? 'top' : 'left']
    ? 'start'
    : 'end';
}

type AnimationOptions = {
  duration: number;
  draw(progress: number): any;
  timing(frac: number): number;
  done?(): any;
  rafIdRef: React.MutableRefObject<number | undefined>;
};

export function animate({ duration, draw, timing, done, rafIdRef }: AnimationOptions) {
  return new Promise((resolve) => {
    let start = performance.now();
    let stopped = false;
    rafIdRef.current = requestAnimationFrame(function animate(time: number) {
      // In some cases there are discrepencies between performance.now() and the timestamp in rAF.
      // In those cases we reset the start time to the timestamp in the first frame.
      // https://stackoverflow.com/questions/38360250/requestanimationframe-now-vs-performance-now-time-discrepancy
      start = time < start ? time : start;
      const timeFraction = clamp((time - start) / duration, [0, 1]);
      draw(timing(timeFraction));

      if (timeFraction < 1) {
        // If we haven't cancelled, keep the animation going
        !stopped && (rafIdRef.current = requestAnimationFrame(animate));
      } else {
        // Callback to `done` only if the animation wasn't cancelled early
        cleanup();
        resolve('done');
        done && done();
      }
    });

    function cleanup() {
      stopped = true;
      cancelAnimationFrame(rafIdRef.current!);
    }
  });
}

/**
 * Returns the animation draw function for PageUp/PageDown movements
 * @param param0
 */
export function getPagedDraw({
  axis,
  direction,
  positionElement,
}: {
  axis: Axis;
  direction: LogicalDirection;
  positionElement: Element;
}) {
  let totalScrollDistance = getPagedScrollDistance({ axis, direction, positionElement });
  return function draw(progress: number) {
    const distance = totalScrollDistance * Math.min(progress, 1);
    const value = getNewScrollPosition(positionElement, {
      direction,
      distance,
      axis,
    });
    totalScrollDistance -= distance;
    setScrollPosition(positionElement, { axis, value });
  };
}

export function getLongPagedDraw({
  axis,
  direction,
  pointerPosition,
  positionElement,
  trackElement,
}: {
  axis: Axis;
  direction: LogicalDirection;
  pointerPosition: PointerPosition;
  positionElement: Element;
  trackElement: Element;
}) {
  let totalScrollDistance = getLongPagedScrollDistance({
    axis,
    direction,
    pointerPosition,
    positionElement,
    trackElement,
  });
  return function draw(progress: number) {
    const multiplier = Math.pow(10, 3 || 0);
    const distance =
      Math.round(totalScrollDistance * Math.min(progress, 1) * multiplier) / multiplier;
    const newPosition = getNewScrollPosition(positionElement, {
      direction,
      distance,
      axis,
    });
    totalScrollDistance -= distance;
    setScrollPosition(positionElement, { axis, value: newPosition });
  };
}

export function canScroll(element: Element, { axis, delta }: { axis: Axis; delta: number }) {
  return !(
    delta === 0 || // No relevant directional change
    // Scroll area is already scrolled to the furthest possible point in the pointer movement's direction
    (delta < 0 && (axis === 'x' ? isScrolledToLeft : isScrolledToTop)(element)) ||
    (delta > 0 && (axis === 'x' ? isScrolledToRight : isScrolledToBottom)(element))
  );
}

export function useBorderBoxResizeObserver(
  ref: React.RefObject<HTMLElement>,
  callback: (size: ResizeObserverSize, targetElement: Element) => void
) {
  const onResize = useCallbackRef(callback);
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) {
      // TODO:
      throw Error('GIMME DAT REF');
    }

    // @ts-ignore
    const observer = new ResizeObserver(([entry]) => {
      const borderBoxSize = getResizeObserverEntryBorderBoxSize(entry);
      onResize(borderBoxSize, entry.target);
    });

    const initialRect = element.getBoundingClientRect();
    onResize(
      {
        inlineSize: initialRect.width,
        blockSize: initialRect.height,
      },
      element
    );
    observer.observe(element);

    return function () {
      observer.disconnect();
    };
  }, [onResize, ref]);
}

function isScrolledToTop(element: Element | null) {
  return !!(element && element.scrollTop === 0);
}

function isScrolledToRight(element: Element | null) {
  return !!(element && element.scrollLeft === getMaxScrollLeftValue(element));
}

function isScrolledToBottom(element: Element | null) {
  return !!(element && element.scrollTop === getMaxScrollTopValue(element));
}

function isScrolledToLeft(element: Element | null) {
  return !!(element && element.scrollLeft === 0);
}

function getMaxScrollTopValue(element: Element) {
  return element.scrollHeight - element.clientHeight;
}

function getMaxScrollLeftValue(element: Element) {
  return element.scrollWidth - element.clientWidth;
}

function getMaxScrollStartValue(element: Element, axis: Axis) {
  return axis === 'x' ? getMaxScrollLeftValue(element) : getMaxScrollTopValue(element);
}

function getActualScrollDirection(dir: LogicalDirection, axis: Axis): ScrollDirection {
  if (dir === 'start') {
    return axis === 'x' ? 'left' : 'up';
  }
  return axis === 'x' ? 'right' : 'down';
}

// TODO: Currently parcel does not recognize global types in our type root directories. Patching
// here until we can address it properly. Move these back to types/index.d.ts
interface ResizeObserverSize {
  readonly inlineSize: number;
  readonly blockSize: number;
}

interface ResizeObserverEntry {
  readonly target: Element;
  readonly contentRect: DOMRectReadOnly;
  readonly borderBoxSize: ResizeObserverSize[] | ResizeObserverSize;
  readonly contentBoxSize: ResizeObserverSize[] | ResizeObserverSize;
  readonly devicePixelContentBoxSize: ResizeObserverSize[];
}

type ResizeObserverBoxOptions = 'border-box' | 'content-box' | 'device-pixel-content-box';

interface ResizeObserverOptions {
  box?: ResizeObserverBoxOptions;
}

type ResizeObserverCallback = (entries: ResizeObserverEntry[], observer: ResizeObserver) => void;
