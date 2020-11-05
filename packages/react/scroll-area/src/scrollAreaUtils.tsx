import { Axis, getResizeObserverEntryBorderBoxSize } from '@interop-ui/utils';
import { useLayoutEffect } from '@interop-ui/react-utils';
import { ScrollDirection, LogicalDirection, PointerPosition, ScrollAreaRefs } from './types';

export function shouldFallbackToNativeScroll() {
  return !(
    'ResizeObserver' in window &&
    'IntersectionObserver' in window &&
    (('CSS' in window &&
      'supports' in window.CSS &&
      window.CSS.supports('scrollbar-width: none')) ||
      // I don't think it's possible to use CSS.supports to detect if a pseudo element is
      // supported. We need to make sure `::-webkit-scrollbar` is valid if possible.
      // TODO: Replace true with valid check or remove the block altogether
      true)
  );
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
  callback: (size: ResizeObserverSize) => void
) {
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) {
      // TODO:
      throw Error('GIMME DAT REF');
    }

    const observer = new ResizeObserver(([entry]) => {
      const borderBoxSize = getResizeObserverEntryBorderBoxSize(entry);
      callback(borderBoxSize);
    });

    const initialRect = element.getBoundingClientRect();
    callback({
      inlineSize: initialRect.width,
      blockSize: initialRect.height,
    });
    observer.observe(element);

    return function () {
      observer.disconnect();
    };
  }, [callback, ref]);
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
