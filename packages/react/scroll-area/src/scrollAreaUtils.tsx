import { Axis, clamp } from '@interop-ui/utils';
import { ScrollAreaState } from './scrollAreaState';
import { ScrollDirection, LogicalDirection, PointerPosition, ScrollAreaRefs } from './types';

export function isScrolledToBottom(node: Element | null) {
  return !!(node && node.scrollTop === getMaxScrollTopValue(node));
}

export function getDistanceFromTop(el: Element) {
  return window.pageYOffset + el.getBoundingClientRect().top;
}

export function isScrolledToRight(node: Element | null) {
  return !!(node && node.scrollLeft === getMaxScrollLeftValue(node));
}

export function isScrolledToTop(node: Element | null) {
  return !!(node && node.scrollTop === 0);
}

export function isScrolledToLeft(node: Element | null) {
  return !!(node && node.scrollLeft === 0);
}

export function getMaxScrollTopValue(node: Element) {
  return node.scrollHeight - node.clientHeight;
}

export function getMaxScrollLeftValue(node: Element) {
  return node.scrollWidth - node.clientWidth;
}

export function getMaxScrollStartValue(node: Element, axis: Axis) {
  return axis === 'x' ? getMaxScrollLeftValue(node) : getMaxScrollTopValue(node);
}

export function getActualScrollDirection(dir: LogicalDirection, axis: Axis): ScrollDirection {
  if (dir === 'start') {
    return axis === 'x' ? 'left' : 'up';
  }
  return axis === 'x' ? 'right' : 'down';
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

export function pointerIsOutsideElement(event: PointerEvent, element: Element) {
  const pos = getPointerPosition(event);
  const bounds = element.getBoundingClientRect();
  return pos.x < bounds.left || pos.x > bounds.right || pos.y < bounds.top || pos.y > bounds.bottom;
}

export function getButtonRef(actualDirection: ScrollDirection, ctx: ScrollAreaRefs) {
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
 *
 * @param props
 */
export function getPagedScrollDistance({
  direction,
  visibleSize,
}: {
  direction: LogicalDirection;
  visibleSize: number;
}) {
  return (visibleSize - 40) * (direction === 'end' ? 1 : -1);
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
  if (canScroll(element, { axis, delta: Math.round(clamp(value, [-1, 1])) })) {
    element[axis === 'x' ? 'scrollLeft' : 'scrollTop'] += Math.round(value);
  }
}

export function getLogicalRect(element: Element, { axis }: { axis: Axis }) {
  const {
    [axis]: coord,
    [axis === 'y' ? 'top' : 'left']: position,
    [axis === 'y' ? 'height' : 'width']: size,
  } = element.getBoundingClientRect();
  return { coord, position, size };
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
  thumbEl,
}: {
  event: PointerEvent;
  axis: Axis;
  thumbEl: Element;
}): LogicalDirection {
  const { [axis]: scrollPosition } = getPointerPosition(event);
  return scrollPosition < thumbEl.getBoundingClientRect()[axis === 'y' ? 'top' : 'left']
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
    rafIdRef.current = window.requestAnimationFrame(function animate(time: number) {
      // In some cases there are discrepencies between performance.now() and the timestamp in rAF.
      // In those cases we reset the start time to the timestamp in the first frame.
      // https://stackoverflow.com/questions/38360250/requestanimationframe-now-vs-performance-now-time-discrepancy
      start = time < start ? time : start;
      const timeFraction = clamp((time - start) / duration, [0, 1]);
      draw(timing(timeFraction));

      if (timeFraction < 1) {
        // If we haven't cancelled, keep the animation going
        !stopped && (rafIdRef.current = window.requestAnimationFrame(animate));
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

export function checkIsScrolling(state: ScrollAreaState) {
  return state !== ScrollAreaState.Idle;
}

export function canScroll(element: Element, { axis, delta }: { axis: Axis; delta: number }) {
  return !(
    delta === 0 || // No relevant directional change
    // Scroll area is already scrolled to the furthest possible point in the pointer movement's direction
    (delta < 0 && (axis === 'x' ? isScrolledToLeft : isScrolledToTop)(element)) ||
    (delta > 0 && (axis === 'x' ? isScrolledToRight : isScrolledToBottom)(element))
  );
}

export function round(value: number, precision: number) {
  const multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
}
