import { Queue } from './queue';
import { ScrollAreaReducerState, ScrollAreaEvent } from './scrollAreaState';
import type { Axis, Size } from '@interop-ui/utils';
export type { Axis, Size, ScrollAreaReducerState, ScrollAreaEvent };
export type LogicalDirection = 'start' | 'end';
export type OverflowBehavior = 'auto' | 'hidden' | 'scroll' | 'visible';
export type PointerPosition = { x: number; y: number };
export type ResizeBehavior = 'none' | 'both' | 'horizontal' | 'vertical' | 'initial' | 'inherit';
export type ScrollbarAutoHide = 'never' | 'scroll';
export type ScrollDirection = 'up' | 'down' | 'left' | 'right';
export type TrackClickBehavior = 'page' | 'relative';
export type ScrollAreaRefs = {
  buttonLeftRef: React.RefObject<HTMLDivElement>;
  buttonRightRef: React.RefObject<HTMLDivElement>;
  buttonUpRef: React.RefObject<HTMLDivElement>;
  buttonDownRef: React.RefObject<HTMLDivElement>;
  viewportRef: React.RefObject<HTMLDivElement>;
  positionRef: React.RefObject<HTMLDivElement>;
  scrollAreaRef: React.RefObject<HTMLDivElement>;
  scrollbarYRef: React.RefObject<HTMLDivElement>;
  scrollbarXRef: React.RefObject<HTMLDivElement>;
  thumbYRef: React.RefObject<HTMLDivElement>;
  thumbXRef: React.RefObject<HTMLDivElement>;
  trackYRef: React.RefObject<HTMLDivElement>;
  trackXRef: React.RefObject<HTMLDivElement>;
};

export type ScrollAreaOwnProps = {
  children: React.ReactNode;
  /**
   * Overflow behavior for the x axis. Mirrors the `overflow-x` CSS property.
   *
   * (default: `"auto"`)
   */
  overflowX?: OverflowBehavior;
  /**
   * Overflow behavior for the y axis. Mirrors the `overflow-y` CSS property.
   *
   * (default: `"auto"`)
   */
  overflowY?: OverflowBehavior;
  /**
   * Describes the nature of auto-hide, similar to how
   * - `"never"`: Never hide automatically.
   * - `"scroll"`: Hide automatically after scrolling stops.
   *
   * (default: `"never"`)
   */
  scrollbarAutoHide?: ScrollbarAutoHide;
  /**
   * Whether or not the user can scroll by dragging.
   *
   * (default: `false`)
   */
  scrollbarDragScrolling?: boolean;
  /**
   * Describes the action that occurs when a user clicks on the scroll track. When `"relative"`, the
   * scroll area will jump to a spot relative to where the user has clicked in relation to the
   * track. When `"page"`, the scroll area will initially jump to the next or previous page of
   * the viewable area, depending on which direction on the track is clicked.
   *
   * (default: `"relative"`)
   */
  trackClickBehavior?: TrackClickBehavior;
  /**
   * Mostly here for debugging, but these might be useful for consumers
   */
  unstable_forceNative?: boolean;
  unstable_prefersReducedMotion?: boolean;
  isRTL?: boolean;
};

export type ScrollAreaContextValue = ScrollAreaReducerState & {
  isRTL: boolean;
  overflowX: OverflowBehavior;
  overflowY: OverflowBehavior;
  prefersReducedMotion: boolean;
  scrollAnimationQueue: Queue<any>;
  scrollbarAutoHide: ScrollbarAutoHide;
  scrollbarDragScrolling: boolean;
  trackClickBehavior: TrackClickBehavior;
  userOnScroll: React.ComponentProps<'div'>['onScroll'];
};
