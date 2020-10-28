// This component is a progressive enhancement that will fallback to a staandard div with overflow:
// scroll for browsers that don't support features we rely on.

// Needs to support:
//  - ResizeObserver
//  - IntersectionObserver
//  - PointerEvents
//  - CSS scrollbar-width OR -webkit-scrollbar

// TODO: Autohide
// TODO: Dragging functionality
// TODO: Test inside popovers
// TODO: Wrap all event props with composeEventHandler
// TODO: Replace all globals with globals relative to the root node
// TODO: RTL language testing for horizontal scrolling

import {
  composeEventHandlers,
  createContext,
  createStyleObj,
  forwardRef,
  memo,
  useCallbackRef,
  useComposedRefs,
  useConstant,
  useLayoutEffect,
  usePrefersReducedMotion,
} from '@interop-ui/react-utils';
import {
  Axis,
  clamp,
  cssReset,
  getResizeObserverEntryBorderBoxSize,
  isMainClick,
} from '@interop-ui/utils';
import * as React from 'react';
import {
  LogicalDirection,
  OverflowBehavior,
  ResizeBehavior,
  ScrollAreaEvent,
  ScrollAreaReducerState,
  ScrollAreaRefs,
  ScrollbarAutoHide,
} from './types';
import { ScrollAreaState, ScrollAreaEvents, reducer } from './scrollAreaState';
import { bezier } from './bezier-easing';
import { Queue } from './queue';
import {
  animate,
  canScroll,
  checkIsScrolling,
  determineScrollDirectionFromTrackClick,
  getActualScrollDirection,
  getButtonRef,
  getClientSize,
  getLogicalRect,
  getNewScrollPosition,
  getPagedScrollDistance,
  getPointerPosition,
  getScrollbarRef,
  getScrollPosition,
  getScrollSize,
  getThumbRef,
  getTrackRef,
  getVisibleToTotalRatio,
  pointerIsOutsideElement,
  pointerIsOutsideElementByAxis,
  round,
  scrollBy,
  setScrollPosition,
  shouldOverflow,
} from './scrollAreaUtils';

const CSS_PROPS = {
  scrollAreaWidth: '--interop-scroll-area-width',
  scrollAreaHeight: '--interop-scroll-area-height',
  positionWidth: '--interop-scroll-area-position-width',
  positionHeight: '--interop-scroll-area-position-height',
  scrollbarXOffset: '--interop-scroll-area-scrollbar-x-offset',
  scrollbarYOffset: '--interop-scroll-area-scrollbar-y-offset',
  scrollbarXSize: '--interop-scroll-area-scrollbar-x-size',
  scrollbarYSize: '--interop-scroll-area-scrollbar-y-size',
  scrollbarThumbWillChange: '--interop-scroll-area-scrollbar-thumb-will-change',
  scrollbarThumbHeight: '--interop-scroll-area-scrollbar-thumb-height',
  scrollbarThumbWidth: '--interop-scroll-area-scrollbar-thumb-width',
  cornerLeft: '--interop-scroll-area-corner-left',
  cornerRight: '--interop-scroll-area-corner-right',
  // cornerCursor: '--interop-scroll-area-corner-cursor',
} as const;

const ROOT_DEFAULT_TAG = 'div';
const ROOT_NAME = 'ScrollArea';

// Keeping refs in a separate context; should be a stable reference throughout the tree
const [ScrollAreaRefsContext, useScrollAreaRefs] = createContext<ScrollAreaRefs>(
  ROOT_NAME + 'RefsContext',
  ROOT_NAME
);

const [ScrollAreaContext, useScrollAreaContext] = createContext<ScrollAreaContextValue>(
  ROOT_NAME + 'Context',
  ROOT_NAME
);

// We render native scrollbars initially and switch to custom scrollbars after hydration if the
// user's browser supports the necessary features. Many internal components will return `null` when
// using native scrollbars, so we keep implementation separate throughout and check support in this
// context during render.
const NativeScrollContext = React.createContext<boolean>(true);
const useNativeScrollArea = () => React.useContext(NativeScrollContext);

const [DispatchContext, useDispatchContext] = createContext<React.Dispatch<ScrollAreaEvent>>(
  'DispatchContext',
  ROOT_NAME
);

/* -------------------------------------------------------------------------------------------------
 * ScrollArea
 * -----------------------------------------------------------------------------------------------*/

type ScrollAreaDOMProps = Omit<React.ComponentPropsWithoutRef<typeof ROOT_DEFAULT_TAG>, 'children'>;
type ScrollAreaOwnProps = {
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
   * Mostly here for debugging, but this might be useful for consumers
   */
  unstable_forceNative?: boolean;
  isRTL?: boolean;
};
type ScrollAreaProps = ScrollAreaDOMProps & ScrollAreaOwnProps;

const ScrollArea = forwardRef<typeof ROOT_DEFAULT_TAG, ScrollAreaProps, ScrollAreaStaticProps>(
  function ScrollArea(props, forwardedRef) {
    const {
      as = ROOT_DEFAULT_TAG,
      children,
      overflowX = 'auto',
      overflowY = 'auto',
      unstable_forceNative: forceNative = false,
      ...domProps
    } = props;
    const [usesNative, setUsesNative] = React.useState(true);
    // Check to make sure the user's browser supports our custom scrollbar features. We use a layout
    // effect here to avoid a visible flash when the custom scroll area replaces the native version.
    useLayoutEffect(() => {
      setUsesNative(forceNative || shouldFallbackToNativeScroll());
    }, [forceNative]);

    const Comp = usesNative ? ScrollAreaNative : ScrollAreaImpl;

    return (
      <Comp
        {...interopDataAttrObj('root')}
        {...domProps}
        as={as}
        overflowX={overflowX}
        overflowY={overflowY}
        ref={forwardedRef}
      >
        <NativeScrollContext.Provider value={usesNative}>{children}</NativeScrollContext.Provider>
      </Comp>
    );
  }
);

type ScrollAreaNativeProps = Omit<ScrollAreaProps, 'unstable_forceNative'> & {
  overflowX: NonNullable<ScrollAreaProps['overflowX']>;
  overflowY: NonNullable<ScrollAreaProps['overflowY']>;
};

const ScrollAreaNative = forwardRef<typeof ROOT_DEFAULT_TAG, ScrollAreaNativeProps>(
  function ScrollAreaNative(props, forwardedRef) {
    const { as: Comp, overflowX, overflowY, ...domProps } = props;
    return (
      <Comp
        ref={forwardedRef}
        {...domProps}
        style={{
          ...domProps.style,
          // For native fallback, the scroll area wrapper itself is scrollable
          overflowX,
          overflowY,

          // Set this inline since we don't currently support resizable scroll areas. This feature
          // will come later.
          resize: 'none',
        }}
      />
    );
  }
);

type ScrollAreaImplProps = Omit<ScrollAreaProps, 'unstable_forceNative'> & {
  overflowX: NonNullable<ScrollAreaProps['overflowX']>;
  overflowY: NonNullable<ScrollAreaProps['overflowY']>;
};

const initialSize = { width: 0, height: 0 };
const initialState: ScrollAreaReducerState = {
  state: ScrollAreaState.Idle,
  explicitResize: 'initial',
  scrollAreaSize: initialSize,
  viewportSize: initialSize,
  positionSize: initialSize,
  scrollbarYSize: initialSize,
  scrollbarXSize: initialSize,
  trackYSize: initialSize,
  trackXSize: initialSize,
  contentIsOverflowingX: false,
  contentIsOverflowingY: false,
};

const ScrollAreaImpl = forwardRef<typeof ROOT_DEFAULT_TAG, ScrollAreaImplProps>(
  function ScrollAreaImpl(props, forwardedRef) {
    const {
      as: Comp,
      children,
      onScroll,
      overflowX,
      overflowY,
      scrollbarAutoHide = 'never',
      isRTL = false,
      scrollbarDragScrolling = false,
      ...domProps
    } = props;

    // That we call `onScroll` in the viewport component is an implementation detail that the
    // consumer probably shouldn't need to think about. Passing it down from the top means that the
    // event handler would work the same way in the native fallback as well.
    const userOnScroll = useCallbackRef(onScroll);

    const buttonDownRef = React.useRef<HTMLDivElement>(null);
    const buttonLeftRef = React.useRef<HTMLDivElement>(null);
    const buttonRightRef = React.useRef<HTMLDivElement>(null);
    const buttonUpRef = React.useRef<HTMLDivElement>(null);
    const viewportRef = React.useRef<HTMLDivElement>(null);
    const positionRef = React.useRef<HTMLDivElement>(null);
    const scrollAreaRef = React.useRef<HTMLDivElement>(null);
    const scrollbarXRef = React.useRef<HTMLDivElement>(null);
    const scrollbarYRef = React.useRef<HTMLDivElement>(null);
    const thumbXRef = React.useRef<HTMLDivElement>(null);
    const thumbYRef = React.useRef<HTMLDivElement>(null);
    const trackXRef = React.useRef<HTMLDivElement>(null);
    const trackYRef = React.useRef<HTMLDivElement>(null);
    const refs: ScrollAreaRefs = React.useMemo(() => {
      return {
        buttonDownRef,
        buttonLeftRef,
        buttonRightRef,
        buttonUpRef,
        viewportRef,
        positionRef,
        scrollAreaRef,
        scrollbarXRef,
        scrollbarYRef,
        thumbXRef,
        thumbYRef,
        trackXRef,
        trackYRef,
      };
    }, []);

    // Animation effects triggered by button and track clicks are managed in a queue to prevent race
    // conditions and invalid DOM measurements when the user clicks faster than the animation is
    // able to be completed
    const scrollAnimationQueue = useConstant(() => new Queue<any>());

    const prefersReducedMotion = usePrefersReducedMotion(scrollAreaRef);

    const [reducerState, _dispatch] = React.useReducer(reducer, initialState);

    const context: ScrollAreaContextValue = {
      ...reducerState,
      isRTL,
      overflowX,
      overflowY,
      prefersReducedMotion,
      scrollAnimationQueue,
      scrollbarAutoHide,
      scrollbarDragScrolling,
      userOnScroll,
    };

    // Attach all refs to each dispatch so we can ensure fresh references in our reducer without
    // changing stateful data.
    const dispatch: React.Dispatch<ScrollAreaEvent> = React.useCallback(
      function dispatch(event: ScrollAreaEvent) {
        return _dispatch({
          ...event,
          // @ts-ignore
          refs,
        });
      },
      [refs]
    );

    const ref = useComposedRefs(forwardedRef, scrollAreaRef);

    // Observe the scroll area for size changes
    const handleResize = React.useCallback(
      (size: ResizeObserverSize) => {
        dispatch({
          type: ScrollAreaEvents.HandleScrollAreaResize,
          width: size.inlineSize,
          height: size.blockSize,
        });
      },
      [dispatch]
    );
    useBorderBoxResizeObserver(scrollAreaRef, handleResize);

    // Adds attribute to the body element so an app can know when a scrollarea is active, so we can
    // disable pointer events on all other elements on the screen until scrolling stops.
    const isScrolling = checkIsScrolling(reducerState.state);
    React.useEffect(() => {
      isScrolling
        ? document.body.setAttribute('data-interop-scrolling', '')
        : document.body.removeAttribute('data-interop-scrolling');
      return function () {
        document.body.removeAttribute('data-interop-scrolling');
      };
    }, [isScrolling]);

    // Defined CSS custom properties to determine styles based on sizes and positioning of child
    // elements.
    //
    // We need an offset value to determine whether or not the content area should add padding to
    // account for the size of the scrollbar.
    //
    // Only offset if:
    //  - overflow is `scroll` and scrollbar autohide is `never`
    //  - overflow is `auto`, scrollbar autohide is `never`, and the axis has overflowing content
    //
    // Do not offset if:
    //  - scrollbar autohide is `scroll` (scrollbars overlap content in this case)
    //  - overflow is `auto` and scrollbar autohide is `never`
    //  - overflow is `hidden` or `visible` (scrollbars are hidden no matter what in either case)
    const shouldOffsetX =
      (overflowX === 'scroll' && scrollbarAutoHide === 'never') ||
      (overflowX === 'auto' && reducerState.contentIsOverflowingX);
    const shouldOffsetY =
      (overflowY === 'scroll' && scrollbarAutoHide === 'never') ||
      (overflowY === 'auto' && reducerState.contentIsOverflowingY);

    const style: any = {
      [CSS_PROPS.scrollbarXOffset]:
        shouldOffsetX && reducerState.scrollbarXSize.height
          ? reducerState.scrollbarXSize.height + 'px'
          : 0,
      [CSS_PROPS.scrollbarYOffset]:
        shouldOffsetY && reducerState.scrollbarYSize.width
          ? reducerState.scrollbarYSize.width + 'px'
          : 0,
      [CSS_PROPS.scrollbarXSize]: reducerState.scrollbarXSize.height
        ? reducerState.scrollbarXSize.height + 'px'
        : 0,
      [CSS_PROPS.scrollbarYSize]: reducerState.scrollbarYSize.width
        ? reducerState.scrollbarYSize.width + 'px'
        : 0,
      [CSS_PROPS.scrollAreaWidth]: reducerState.scrollAreaSize.width
        ? reducerState.scrollAreaSize.width + 'px'
        : 'auto',
      [CSS_PROPS.scrollAreaHeight]: reducerState.scrollAreaSize.height
        ? reducerState.scrollAreaSize.height + 'px'
        : 'auto',
      [CSS_PROPS.positionWidth]: reducerState.positionSize.width
        ? reducerState.positionSize.width + 'px'
        : 'auto',
      [CSS_PROPS.positionHeight]: reducerState.positionSize.height
        ? reducerState.positionSize.height + 'px'
        : 'auto',
    };

    return (
      <ScrollAreaRefsContext.Provider value={refs}>
        <ScrollAreaContext.Provider value={context}>
          <DispatchContext.Provider value={dispatch}>
            <Comp
              {...domProps}
              ref={ref}
              data-scrolling={isScrolling ? '' : undefined}
              style={{
                ...domProps.style,
                ...style,
              }}
            >
              {children}
            </Comp>
          </DispatchContext.Provider>
        </ScrollAreaContext.Provider>
      </ScrollAreaRefsContext.Provider>
    );
  }
);

/* -------------------------------------------------------------------------------------------------
 * ScrollAreaViewport
 * -----------------------------------------------------------------------------------------------*/

const VIEWPORT_DEFAULT_TAG = 'div';
const VIEWPORT_NAME = 'ScrollArea.Viewport';
type ScrollAreaViewportDOMProps = React.ComponentPropsWithoutRef<typeof VIEWPORT_DEFAULT_TAG>;
type ScrollAreaViewportOwnProps = {};
type ScrollAreaViewportProps = ScrollAreaViewportDOMProps & ScrollAreaViewportOwnProps;

const ScrollAreaViewportImpl = forwardRef<typeof VIEWPORT_DEFAULT_TAG, ScrollAreaViewportProps>(
  function ScrollAreaViewportImpl(props, forwardedRef) {
    const { as: Comp = VIEWPORT_DEFAULT_TAG, ...domProps } = props;
    const { positionRef, thumbXRef, thumbYRef, viewportRef } = useScrollAreaRefs(VIEWPORT_NAME);
    const { userOnScroll, overflowX, overflowY, ...context } = useScrollAreaContext(VIEWPORT_NAME);
    const dispatch = useDispatchContext(VIEWPORT_NAME);
    const ref = useComposedRefs(forwardedRef, viewportRef);

    const handleResize = React.useCallback(
      (size: ResizeObserverSize) => {
        dispatch({
          type: ScrollAreaEvents.HandleViewportResize,
          width: size.inlineSize,
          height: size.blockSize,
        });
      },
      [dispatch]
    );
    useBorderBoxResizeObserver(viewportRef, handleResize);

    const syncThumbsWithScrollPosition = React.useCallback(
      function syncThumbsWithScrollPosition() {
        const positionElement = positionRef.current;
        const thumbXElement = thumbXRef.current;
        const thumbYElement = thumbYRef.current;
        if (thumbXElement && positionElement) {
          updateThumbPosition({
            thumbElement: thumbXElement,
            axis: 'x',
            positionElement,
          });
        }
        if (thumbYElement && positionElement) {
          updateThumbPosition({
            thumbElement: thumbYElement,
            axis: 'y',
            positionElement,
          });
        }
      },
      [positionRef, thumbXRef, thumbYRef]
    );

    const handleScroll = useCallbackRef(
      composeEventHandlers(userOnScroll, syncThumbsWithScrollPosition)
    );

    // Listen to scroll events and update each thumb's positioning accordingly.
    useLayoutEffect(() => {
      syncThumbsWithScrollPosition();
    }, [dispatch, positionRef, thumbXRef, thumbYRef, handleScroll, syncThumbsWithScrollPosition]);

    // Determine whether or not content is overflowing in either direction and update context
    // accordingly.
    useLayoutEffect(() => {
      const positionElement = positionRef.current;
      if (!positionElement) {
        // TODO:
        throw Error('Place the refs plz');
      }

      const contentIsOverflowingX = shouldOverflow(positionElement, { axis: 'x' });
      const contentIsOverflowingY = shouldOverflow(positionElement, { axis: 'y' });
      if (
        contentIsOverflowingX !== context.contentIsOverflowingX ||
        contentIsOverflowingY !== context.contentIsOverflowingY
      ) {
        dispatch({
          type: ScrollAreaEvents.SetContentOverflowing,
          x: contentIsOverflowingX,
          y: contentIsOverflowingY,
        });
      }
    }, [
      context.contentIsOverflowingX,
      context.contentIsOverflowingY,
      dispatch,
      positionRef,

      // trigger update when any size changes occur
      context.scrollAreaSize,
      context.viewportSize,
      context.positionSize,
      context.scrollbarYSize,
      context.scrollbarXSize,
      context.trackYSize,
      context.trackXSize,
    ]);

    return (
      <div
        data-interop-scroll-area-position=""
        ref={positionRef}
        onScroll={handleScroll}
        style={{
          ...cssReset('div'),
          zIndex: 1,
          width: `var(${CSS_PROPS.positionWidth})`,
          height: `var(${CSS_PROPS.positionHeight})`,
          paddingBottom: `var(${CSS_PROPS.scrollbarXOffset})`,
          paddingRight: `var(${CSS_PROPS.scrollbarYOffset})`,
          scrollbarWidth: 'none',
          overflowScrolling: 'touch',
          resize: 'none',
          overflowX,
          overflowY,
        }}
      >
        <Comp {...interopDataAttrObj('viewport')} ref={ref} {...domProps} />
      </div>
    );
  }
);

const ScrollAreaViewport = forwardRef<typeof VIEWPORT_DEFAULT_TAG, ScrollAreaViewportProps>(
  function ScrollAreaViewport(props, forwardedRef) {
    const { as: Comp = VIEWPORT_DEFAULT_TAG, ...domProps } = props;
    return useNativeScrollArea() ? (
      <Comp {...interopDataAttrObj('viewport')} ref={forwardedRef} {...domProps} />
    ) : (
      <ScrollAreaViewportImpl ref={forwardedRef} as={Comp} {...domProps} />
    );
  }
);

/* -------------------------------------------------------------------------------------------------
 * ScrollAreaScrollbarX / ScrollAreaScrollbarY
 * -----------------------------------------------------------------------------------------------*/

const SCROLLBAR_DEFAULT_TAG = 'div';
const SCROLLBAR_X_NAME = 'ScrollArea.ScrollbarX';
const SCROLLBAR_Y_NAME = 'ScrollArea.ScrollbarY';

type ScrollAreaScrollbarDOMProps = React.ComponentPropsWithoutRef<typeof SCROLLBAR_DEFAULT_TAG>;
type ScrollAreaScrollbarOwnProps = {};
type ScrollAreaScrollbarProps = ScrollAreaScrollbarDOMProps & ScrollAreaScrollbarOwnProps;

type InternalScrollbarProps = ScrollAreaScrollbarProps & {
  axis: Axis;
  name: string;
};

const [ScrollbarContext, useScrollbarContext] = createContext<Axis>(
  'ScrollbarContext',
  'ScrollAreaScrollbarImpl'
);

const ScrollAreaScrollbarImpl = forwardRef<typeof SCROLLBAR_DEFAULT_TAG, InternalScrollbarProps>(
  function ScrollAreaScrollbarImpl(props, forwardedRef) {
    const { as: Comp = SCROLLBAR_DEFAULT_TAG, axis, name, ...domProps } = props;
    const dispatch = useDispatchContext(name);
    const {
      [axis === 'x' ? 'contentIsOverflowingX' : 'contentIsOverflowingY']: contentIsOverflowing,
    } = useScrollAreaContext(name);
    const refsContext = useScrollAreaRefs(name);
    const scrollbarRef = getScrollbarRef(axis, refsContext);
    const ref = useComposedRefs(scrollbarRef, forwardedRef);

    const handleResize = React.useCallback(
      (size: ResizeObserverSize) => {
        dispatch({
          type: ScrollAreaEvents.HandleScrollbarResize,
          width: size.inlineSize,
          height: size.blockSize,
          axis,
        });
      },
      [dispatch, axis]
    );
    useBorderBoxResizeObserver(scrollbarRef, handleResize);

    return (
      <ScrollbarContext.Provider value={axis}>
        <Comp
          ref={ref}
          {...domProps}
          style={{
            ...domProps.style,
            display: !contentIsOverflowing ? 'none' : undefined,
          }}
        />
      </ScrollbarContext.Provider>
    );
  }
);

type ScrollAreaScrollbarXProps = ScrollAreaScrollbarProps;

const ScrollAreaScrollbarX = memo(
  forwardRef<typeof SCROLLBAR_DEFAULT_TAG, ScrollAreaScrollbarXProps>(function ScrollAreaScrollbarX(
    props,
    forwardedRef
  ) {
    return useNativeScrollArea() ? null : (
      <ScrollAreaScrollbarImpl
        {...interopDataAttrObj('scrollbarX')}
        ref={forwardedRef}
        {...props}
        axis="x"
        name={SCROLLBAR_X_NAME}
      />
    );
  })
);

type ScrollAreaScrollbarYProps = ScrollAreaScrollbarProps;

const ScrollAreaScrollbarY = memo(
  forwardRef<typeof SCROLLBAR_DEFAULT_TAG, ScrollAreaScrollbarYProps>(function ScrollAreaScrollbarY(
    props,
    forwardedRef
  ) {
    return useNativeScrollArea() ? null : (
      <ScrollAreaScrollbarImpl
        {...interopDataAttrObj('scrollbarY')}
        ref={forwardedRef}
        {...props}
        axis="y"
        name={SCROLLBAR_Y_NAME}
      />
    );
  })
);

/* -------------------------------------------------------------------------------------------------
 * ScrollAreaTrack
 * -----------------------------------------------------------------------------------------------*/

const TRACK_DEFAULT_TAG = 'div';
const TRACK_NAME = 'ScrollArea.Track';
type ScrollAreaTrackDOMProps = React.ComponentPropsWithoutRef<typeof TRACK_DEFAULT_TAG>;
type ScrollAreaTrackOwnProps = {};
type ScrollAreaTrackProps = ScrollAreaTrackDOMProps & ScrollAreaTrackOwnProps;

const ScrollAreaTrack = forwardRef<typeof TRACK_DEFAULT_TAG, ScrollAreaTrackProps>(
  function ScrollAreaTrack(props, forwardedRef) {
    const { as: Comp = TRACK_DEFAULT_TAG, ...domProps } = props;
    const axis = useScrollbarContext(TRACK_NAME);
    const dispatch = useDispatchContext(TRACK_NAME);
    const refsContext = useScrollAreaRefs(TRACK_NAME);
    const { prefersReducedMotion, scrollAnimationQueue } = useScrollAreaContext(TRACK_NAME);
    const { positionRef } = refsContext;
    const trackRef = getTrackRef(axis, refsContext);
    const thumbRef = getThumbRef(axis, refsContext);
    const ref = useComposedRefs(trackRef, forwardedRef);

    const handleResize = React.useCallback(
      (size: ResizeObserverSize) => {
        dispatch({
          type: ScrollAreaEvents.HandleTrackResize,
          width: size.inlineSize,
          height: size.blockSize,
          axis,
        });
      },
      [axis, dispatch]
    );
    useBorderBoxResizeObserver(trackRef, handleResize);
    const rafIdRef = React.useRef<number>();

    React.useEffect(() => {
      let trackPointerDownTimeoutId: number | null = null;
      let trackPointerUpTimeoutId: number | null = null;
      const trackElement = trackRef.current!;
      const thumbElement = thumbRef.current!;
      const positionElement = positionRef.current!;

      if (!trackElement || !thumbElement || !positionElement) {
        // TODO:
        throw Error('PAPA NEEDS SOME REFS!');
      }

      trackElement.addEventListener('pointerdown', handlePointerDown);
      return function () {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        window.cancelAnimationFrame(rafIdRef.current!);
        window.clearTimeout(trackPointerDownTimeoutId!);
        window.clearTimeout(trackPointerUpTimeoutId!);
        trackElement.removeEventListener('pointerdown', handlePointerDown);
        document.removeEventListener('pointermove', handlePointerMove);
        document.removeEventListener('pointerup', handlePointerUp);
        dispatch({ type: ScrollAreaEvents.StopTracking });
        scrollAnimationQueue.stop();
      };

      function handlePointerDown(event: PointerEvent) {
        if (!isMainClick(event)) return;

        const direction = determineScrollDirectionFromTrackClick({
          event,
          axis,
          thumbEl: thumbElement,
        });

        document.addEventListener('pointermove', handlePointerMove);
        document.addEventListener('pointerup', handlePointerUp);

        dispatch({ type: ScrollAreaEvents.StartTracking });
        trackElement.setPointerCapture(event.pointerId);
        window.clearTimeout(trackPointerUpTimeoutId!);

        const visibleSize = getClientSize(positionElement, { axis });
        if (prefersReducedMotion) {
          // Scroll immediately
          const distance = getPagedScrollDistance({ direction, visibleSize });
          const value = getNewScrollPosition(positionElement, { direction, distance, axis });
          setScrollPosition(positionElement, { axis, value });
        } else {
          // Queue scroll animation
          scrollAnimationQueue.enqueue(() => {
            let totalScrollDistance = getPagedScrollDistance({ direction, visibleSize });
            return animate({
              duration: 200,
              timing: bezier(0.16, 0, 0.73, 1),
              draw(progress) {
                const distance = totalScrollDistance * Math.min(progress, 1);
                const value = getNewScrollPosition(positionElement, {
                  direction,
                  distance,
                  axis,
                });
                totalScrollDistance -= distance;
                setScrollPosition(positionElement, { axis, value });
              },
              rafIdRef,
            });
          });
        }

        // After some time 400ms, if the user still has the pointer down we'll start to scroll
        // further to some relative distance near the pointer in relation to the track.
        trackPointerDownTimeoutId = window.setTimeout(() => {
          const pointerPosition = getPointerPosition(event);
          const { position: trackPosition, size: trackSize } = getLogicalRect(trackElement, {
            axis,
          });
          const pointerPositionRelativeToTrack = Math.round(pointerPosition[axis] - trackPosition);
          const viewportRatioFromPointer =
            Math.round((pointerPositionRelativeToTrack / trackSize) * 100) / 100;
          const scrollSize = getScrollSize(positionElement, { axis });
          const visibleSize = getClientSize(positionElement, { axis });
          const destScrollPosition =
            direction === 'start'
              ? viewportRatioFromPointer * scrollSize
              : viewportRatioFromPointer * scrollSize - visibleSize;

          const startPosition = getScrollPosition(positionElement, { axis });

          let totalScrollDistance =
            destScrollPosition < startPosition
              ? destScrollPosition - startPosition - visibleSize / 2
              : destScrollPosition - startPosition + visibleSize / 2;

          const durationBasis = Math.round(Math.abs(totalScrollDistance));
          const duration = clamp(durationBasis, [100, 500]);

          // If the initial scroll event already moved us past the point where we need to go
          if (
            (direction === 'start' && totalScrollDistance > 0) ||
            (direction === 'end' && totalScrollDistance < 0)
          ) {
            return;
          }

          if (prefersReducedMotion) {
            const newPosition = getNewScrollPosition(positionElement, {
              direction,
              distance: totalScrollDistance,
              axis,
            });
            setScrollPosition(positionElement, { axis, value: newPosition });
          } else {
            scrollAnimationQueue.enqueue(() =>
              animate({
                duration,
                timing: (n) => n,
                draw(progress) {
                  const distance = round(totalScrollDistance * Math.min(progress, 1), 3);
                  const newPosition = getNewScrollPosition(positionElement, {
                    direction,
                    distance,
                    axis,
                  });
                  totalScrollDistance -= distance;
                  setScrollPosition(positionElement, { axis, value: newPosition });
                },
                rafIdRef,
              })
            );
          }
          window.clearTimeout(trackPointerDownTimeoutId!);
        }, 400);

        return function () {
          window.clearTimeout(trackPointerDownTimeoutId!);
        };
      }

      /**
       * If a mouse pointer leaves the bounds of the track before the track pointer timeout has been
       * executed, we need to clear the timeout as if the pointer was released.
       * @param event
       */
      function handlePointerMove(event: PointerEvent) {
        if (event.pointerType === 'mouse' && pointerIsOutsideElement(event, trackElement)) {
          window.clearTimeout(trackPointerDownTimeoutId!);
          document.removeEventListener('pointermove', handlePointerMove);
          scrollAnimationQueue.stop();
        }
      }

      function handlePointerUp(event: PointerEvent) {
        trackElement.releasePointerCapture(event.pointerId);
        window.clearTimeout(trackPointerDownTimeoutId!);
        document.removeEventListener('pointermove', handlePointerMove);
        document.removeEventListener('pointerup', handlePointerUp);
        // scrollAnimationQueue.stop();
        dispatch({ type: ScrollAreaEvents.StopTracking });

        // Rapid clicks on the track will result in janky repeat animation if we stop the queue
        // immediately. Set a short timeout to make sure the user is finished clicking and then stop
        // the queue.
        trackPointerUpTimeoutId = window.setTimeout(() => {
          scrollAnimationQueue.stop();
        }, 200);
      }
    }, [
      axis,
      dispatch,
      positionRef,
      prefersReducedMotion,
      scrollAnimationQueue,
      thumbRef,
      trackRef,
    ]);

    return <Comp {...interopDataAttrObj('track')} ref={ref} {...domProps} data-axis={axis} />;
  }
);

/* -------------------------------------------------------------------------------------------------
 * ScrollAreaThumb
 * -----------------------------------------------------------------------------------------------*/

const THUMB_DEFAULT_TAG = 'div';
const THUMB_NAME = 'ScrollArea.Thumb';
type ScrollAreaThumbDOMProps = React.ComponentPropsWithoutRef<typeof THUMB_DEFAULT_TAG>;
type ScrollAreaThumbOwnProps = {};
type ScrollAreaThumbProps = ScrollAreaThumbDOMProps & ScrollAreaThumbOwnProps;

const ScrollAreaThumb = forwardRef<typeof THUMB_DEFAULT_TAG, ScrollAreaThumbProps>(
  function ScrollAreaThumb(props, forwardedRef) {
    const { as: Comp = THUMB_DEFAULT_TAG, ...domProps } = props;
    const axis = useScrollbarContext(THUMB_NAME);
    const refsContext = useScrollAreaRefs(THUMB_NAME);
    const dispatch = useDispatchContext(THUMB_NAME);
    const { positionRef } = refsContext;
    const thumbRef = getThumbRef(axis, refsContext);
    const ref = useComposedRefs(thumbRef, forwardedRef);
    const context = useScrollAreaContext(THUMB_NAME);

    const pointerStartPointRef = React.useRef<number>(0);
    const pointerThumbRelationshipPointRef = React.useRef<number>(0);

    const handleResize = React.useCallback(
      (size: ResizeObserverSize) => {
        dispatch({
          type: ScrollAreaEvents.HandleThumbResize,
          width: size.inlineSize,
          height: size.blockSize,
          axis,
        });
      },
      [dispatch, axis]
    );
    useBorderBoxResizeObserver(thumbRef, handleResize);

    const mounted = React.useRef(false);

    // Update the thumb's size and position anytime any element in the scroll area tree is resized.
    useLayoutEffect(() => {
      if (!mounted.current) {
        mounted.current = true;
        return;
      }

      const thumbElement = thumbRef.current;
      const positionElement = positionRef.current;
      if (!thumbElement || !positionElement) {
        // TODO:
        throw Error('why no refs 😢');
      }

      updateThumbSize({ thumbElement, positionElement, axis });
      updateThumbPosition({ thumbElement, positionElement, axis });
    }, [
      thumbRef,
      positionRef,
      axis,

      // trigger update when any size changes occur
      context.scrollAreaSize,
      context.viewportSize,
      context.positionSize,
      context.scrollbarYSize,
      context.scrollbarXSize,
      context.trackYSize,
      context.trackXSize,
    ]);

    React.useEffect(() => {
      const thumbElement = thumbRef.current!;
      const trackElement = thumbRef.current!;
      if (!thumbElement || !trackElement) {
        // TODO:
        throw Error('why no refs 😢');
      }

      thumbElement.addEventListener('pointerdown', handlePointerDown);
      return function () {
        thumbElement.removeEventListener('pointerdown', handlePointerDown);
        stopThumbing();
      };

      function stopThumbing() {
        document.removeEventListener('pointermove', handlePointerMove);
        document.removeEventListener('pointerup', handlePointerUp);
        dispatch({ type: ScrollAreaEvents.StopThumbing });
      }

      function handlePointerDown(event: PointerEvent) {
        if (!isMainClick(event)) return;

        const pointerPosition = getPointerPosition(event)[axis];
        event.stopPropagation();
        pointerStartPointRef.current = pointerPosition;
        thumbElement.setPointerCapture(event.pointerId);
        document.addEventListener('pointerup', handlePointerUp);
        document.addEventListener('pointermove', handlePointerMove);
        dispatch({ type: ScrollAreaEvents.StartThumbing });
      }

      function handlePointerMove(event: PointerEvent) {
        const pointerPosition = getPointerPosition(event)[axis];
        dispatch({
          type: ScrollAreaEvents.MoveThumbWithPointer,
          axis,
          pointerPosition,
          pointerStartPointRef,
        });
      }

      function handlePointerUp(event: PointerEvent) {
        thumbElement.releasePointerCapture(event.pointerId);
        stopThumbing();
      }
    }, [axis, dispatch, thumbRef]);

    return (
      <Comp
        {...interopDataAttrObj('thumb')}
        ref={ref}
        {...domProps}
        data-axis={axis}
        style={{
          ...domProps.style,
          // @ts-ignore
          ...(axis === 'x'
            ? {
                [CSS_PROPS.scrollbarThumbWillChange]: 'left',
                [CSS_PROPS.scrollbarThumbHeight]: '100%',
                [CSS_PROPS.scrollbarThumbWidth]: 'auto',
              }
            : {
                [CSS_PROPS.scrollbarThumbWillChange]: 'top',
                [CSS_PROPS.scrollbarThumbHeight]: 'auto',
                [CSS_PROPS.scrollbarThumbWidth]: '100%',
              }),
        }}
      />
    );
  }
);

/* -------------------------------------------------------------------------------------------------
 * ScrollAreaButtonStart / ScrollAreaButtonEnd
 * -----------------------------------------------------------------------------------------------*/

const BUTTON_DEFAULT_TAG = 'div';
const BUTTON_START_NAME = 'ScrollArea.ButtonStart';
const BUTTON_END_NAME = 'ScrollArea.ButtonEnd';
type ScrollAreaButtonDOMProps = React.ComponentPropsWithoutRef<typeof BUTTON_DEFAULT_TAG>;
type ScrollAreaButtonOwnProps = {};
type ScrollAreaButtonProps = ScrollAreaButtonDOMProps & ScrollAreaButtonOwnProps;

// For directional scroll buttons, we emulate native Windows behavior as closely as possible. There,
// when a user presses a scroll button, the browser triggers 9 separate scroll events in ~16
// millisecond intervals, moving scrollTop by a short value with each scroll event. This array
// represents the differences between the element's scrollTop value at each of these intervals. I
// will likely rethink this approach tactically as it gets much more complicated for track clicks.
// We are concerned more about the bezier curve effect this creates vs. the actual values.
const BUTTON_SCROLL_TIME = 135;

type ScrollAreaButtonInternalProps = ScrollAreaButtonStartProps & {
  direction: LogicalDirection;
  name: string;
};

const ScrollAreaButton = forwardRef<typeof BUTTON_DEFAULT_TAG, ScrollAreaButtonInternalProps>(
  function ScrollAreaButton(props, forwardedRef) {
    const { as: Comp = BUTTON_DEFAULT_TAG, direction, name, ...domProps } = props;
    const axis = useScrollbarContext(name);
    const dispatch = useDispatchContext(name);
    const refsContext = useScrollAreaRefs(name);
    const { prefersReducedMotion, scrollAnimationQueue } = useScrollAreaContext(name);
    const actualDirection = getActualScrollDirection(direction, axis);
    const { positionRef } = refsContext;
    const buttonRef = getButtonRef(actualDirection, refsContext);
    const ref = useComposedRefs(buttonRef, forwardedRef);
    const rafIdRef = React.useRef<number>();

    React.useEffect(() => {
      const buttonElement = buttonRef.current!;
      const positionElement = positionRef.current!;
      if (!buttonElement || !positionElement) {
        // TODO:
        throw Error('arrrrg ref feed me');
      }

      let buttonPointerDownTimeoutId: number;
      buttonElement.addEventListener('pointerdown', handlePointerDown);

      return function () {
        buttonElement.removeEventListener('pointerdown', handlePointerDown);
        document.removeEventListener('pointerup', handlePointerUp);
        document.removeEventListener('pointermove', handlePointerMove);
        window.clearTimeout(buttonPointerDownTimeoutId!);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        window.cancelAnimationFrame(rafIdRef.current!);
        dispatch({ type: ScrollAreaEvents.StopButtonPress });
      };

      function handlePointerDown(event: PointerEvent) {
        if (!isMainClick(event)) return;

        buttonElement.setPointerCapture(event.pointerId);
        document.addEventListener('pointerup', handlePointerUp);
        document.addEventListener('pointermove', handlePointerMove);
        dispatch({ type: ScrollAreaEvents.StartButtonPress });

        if (prefersReducedMotion) {
          const delta = direction === 'start' ? -1 : 1;
          scrollBy(positionElement, { axis, value: 51 * delta });
        } else {
          const delta = direction === 'start' ? -1 : 1;

          if (
            canScroll(positionElement, { axis, delta }) //  &&
            // Only queue new animation if the queue's state isn't already adding to the queue or
            // pending a current animation. The prevents fast button clicks from creating an effect
            // where the last queued animation stops too long after the user has stopped clicking.
            // !scrollAnimationQueue.isBusy
          ) {
            scrollAnimationQueue.enqueue(() =>
              animate({
                duration: BUTTON_SCROLL_TIME,
                timing: bezier(0.16, 0, 0.73, 1),
                draw(progress) {
                  scrollBy(positionElement, { axis, value: progress * 15 * delta });
                },
                rafIdRef,
              })
            );
          }
        }

        // Handle case for user holding down the button, in which case we will repeat the
        // `scrollAfterButtonPress` call on a ~300 ms interval until they release the pointer.
        // Scrolling will also need to pause if the pointer leaves the button, but it should resume
        // should they mouse back over it before releasing the pointer. After some time (~400ms?),
        // if the user still has the pointer down we'll start to scroll further to some relative
        // distance near the pointer in relation to the track.
        buttonPointerDownTimeoutId = window.setTimeout(() => {
          if (prefersReducedMotion) {
            // TODO:
          } else {
            const pointerId = event.pointerId;
            (function keepScrolling() {
              const delta = direction === 'start' ? -1 : 1;
              if (canScroll(positionElement, { axis, delta })) {
                scrollAnimationQueue.enqueue(() =>
                  animate({
                    duration: BUTTON_SCROLL_TIME,
                    timing: (n) => n,
                    draw(progress) {
                      scrollBy(positionElement, { axis, value: progress * 15 * delta });
                    },
                    done: buttonElement.hasPointerCapture(pointerId) ? keepScrolling : undefined,
                    rafIdRef,
                  })
                );
              }
            })();
          }
          window.clearTimeout(buttonPointerDownTimeoutId!);
        }, 400);
      }

      /**
       * If a mouse pointer leaves the bounds of the button before the track pointer timeout has been
       * executed, we need to clear the timeout as if the pointer was released.
       * @param event
       */
      function handlePointerMove(event: PointerEvent) {
        if (event.pointerType === 'mouse' && pointerIsOutsideElement(event, buttonElement)) {
          window.clearTimeout(buttonPointerDownTimeoutId!);
          document.removeEventListener('pointermove', handlePointerMove);
        }
      }

      function handlePointerUp(event: PointerEvent) {
        window.clearTimeout(buttonPointerDownTimeoutId!);
        buttonElement.releasePointerCapture(event.pointerId);
        buttonElement.removeEventListener('pointerup', handlePointerUp);
        dispatch({ type: ScrollAreaEvents.StopButtonPress });
      }
    }, [
      buttonRef,
      axis,
      direction,
      dispatch,
      prefersReducedMotion,
      scrollAnimationQueue,
      positionRef,
    ]);

    return <Comp {...domProps} ref={ref} data-axis={axis} />;
  }
);

type ScrollAreaButtonStartProps = ScrollAreaButtonProps;

const ScrollAreaButtonStart = forwardRef<typeof BUTTON_DEFAULT_TAG, ScrollAreaButtonStartProps>(
  function ScrollAreaButtonStart(props, forwardedRef) {
    return (
      <ScrollAreaButton
        {...props}
        name={BUTTON_START_NAME}
        direction="start"
        {...interopDataAttrObj('buttonStart')}
        ref={forwardedRef}
      />
    );
  }
);

type ScrollAreaButtonEndProps = ScrollAreaButtonProps;

const ScrollAreaButtonEnd = forwardRef<typeof BUTTON_DEFAULT_TAG, ScrollAreaButtonEndProps>(
  function ScrollAreaButtonEnd(props, forwardedRef) {
    return (
      <ScrollAreaButton
        {...props}
        name={BUTTON_END_NAME}
        direction="end"
        {...interopDataAttrObj('buttonEnd')}
        ref={forwardedRef}
      />
    );
  }
);

/* -------------------------------------------------------------------------------------------------
 * ScrollAreaCorner
 * -----------------------------------------------------------------------------------------------*/

const CORNER_DEFAULT_TAG = 'div';
const CORNER_NAME = 'ScrollArea.Corner';
type ScrollAreaCornerDOMProps = React.ComponentPropsWithoutRef<typeof CORNER_DEFAULT_TAG>;
type ScrollAreaCornerOwnProps = {};
type ScrollAreaCornerProps = ScrollAreaCornerDOMProps & ScrollAreaCornerOwnProps;

const ScrollAreaCornerImpl = forwardRef<typeof CORNER_DEFAULT_TAG, ScrollAreaCornerProps>(
  function ScrollAreaCornerImpl(props, forwardedRef) {
    const { as: Comp = CORNER_DEFAULT_TAG, ...domProps } = props;

    const { positionRef } = useScrollAreaRefs(CORNER_NAME);
    const dispatch = useDispatchContext(CORNER_NAME);
    const { isRTL } = useScrollAreaContext(CORNER_NAME);

    const style: any = {
      // The resize handle is placed, by default, in the bottom right corner of the scroll area. In
      // RTL writing mode it should be placed on the bottom left. Vertical reading modes have no
      // impact on handle placement.
      [CSS_PROPS.cornerLeft]: isRTL ? 0 : 'unset',
      [CSS_PROPS.cornerRight]: isRTL ? 'unset' : 0,

      // Cursor depends on the direction in which the user is able to resize the container. If the
      // container can be resized in either direction, the cursor will be either 'sw-resize' or
      // 'se-resize' depending on the writing mode.
      //
      // TODO:L This code will be useful when resize handles are properly supported. We can safely
      // remove this before merging but keeping it for now for my own reference!

      // [CSS_PROPS.cornerCursor]:
      //   resize === 'horizontal'
      //     ? 'ew-resize'
      //     : resize === 'vertical'
      //     ? 'ns-resize'
      //     : resize === 'both'
      //     ? isRTL
      //       ? 'sw-resize'
      //       : 'se-resize'
      //     : 'initial',
    };

    /**
     * The corner element is placed, by default, in the bottom right corner of the scroll area. In
     * RTL writing mode it should be placed on the bottom left. Its cursor depends on the direction
     * in which the user is able to resize the container.
     *
     * We rely on computed styles because the `resize` prop value can be `initial` or `inherit`
     * which don't give us the direct information we need to derive the correct style for the
     * cursor.
     */
    useLayoutEffect(() => {
      if (positionRef.current) {
        const computedStyles = window.getComputedStyle(positionRef.current);
        dispatch({
          type: ScrollAreaEvents.SetExplicitResize,
          value: computedStyles.resize as ResizeBehavior,
        });
      }
    }, [isRTL, dispatch, positionRef]);

    return (
      <Comp
        {...interopDataAttrObj('corner')}
        ref={forwardedRef}
        {...domProps}
        style={{
          ...domProps.style,
          ...style,
        }}
      />
    );
  }
);

const ScrollAreaCorner = memo(
  forwardRef<typeof CORNER_DEFAULT_TAG, ScrollAreaCornerProps>(function ScrollAreaCorner(
    props,
    forwardedRef
  ) {
    return useNativeScrollArea() ? null : <ScrollAreaCornerImpl ref={forwardedRef} {...props} />;
  })
);

interface ScrollAreaStaticProps {
  Viewport: typeof ScrollAreaViewport;
  ScrollbarX: typeof ScrollAreaScrollbarX;
  ScrollbarY: typeof ScrollAreaScrollbarY;
  Track: typeof ScrollAreaTrack;
  Thumb: typeof ScrollAreaThumb;
  ButtonStart: typeof ScrollAreaButtonStart;
  ButtonEnd: typeof ScrollAreaButtonEnd;
  Corner: typeof ScrollAreaCorner;
}

ScrollArea.Viewport = ScrollAreaViewport;
ScrollArea.ScrollbarX = ScrollAreaScrollbarX;
ScrollArea.ScrollbarY = ScrollAreaScrollbarY;
ScrollArea.Track = ScrollAreaTrack;
ScrollArea.Thumb = ScrollAreaThumb;
ScrollArea.ButtonStart = ScrollAreaButtonStart;
ScrollArea.ButtonEnd = ScrollAreaButtonEnd;
ScrollArea.Corner = ScrollAreaCorner;

ScrollArea.Viewport.displayName = VIEWPORT_NAME;
ScrollArea.ScrollbarX.displayName = SCROLLBAR_X_NAME;
ScrollArea.ScrollbarY.displayName = SCROLLBAR_Y_NAME;
ScrollArea.Track.displayName = TRACK_NAME;
ScrollArea.Thumb.displayName = THUMB_NAME;
ScrollArea.ButtonStart.displayName = BUTTON_START_NAME;
ScrollArea.ButtonEnd.displayName = BUTTON_END_NAME;
ScrollArea.Corner.displayName = CORNER_NAME;

const commonScrollbarStyles = {
  zIndex: 2,
  position: 'absolute',
  display: 'flex',
  userSelect: 'none',
} as const;

const commonButtonStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexGrow: 0,
  flexShrink: 0,
  flexBasis: 'auto',
} as const;

const [styles, interopDataAttrObj] = createStyleObj(ROOT_NAME, {
  root: {
    ...cssReset(ROOT_DEFAULT_TAG),
    position: 'relative',
    // Root z-index set to 0 so we can set a new baseline for its children Apps may need to override
    // this if they have higher z-indices that conflict with their scrollbars, but they should not
    // need to change the z-indices for other elements in the tree. We'll want to document this
    // well!
    zIndex: 0,
    '&[data-dragging], &[data-scrolling]': {
      pointerEvents: 'auto !important',
    },
    '& [data-interop-scroll-area-position]::-webkit-scrollbar': {
      display: 'none',
    },
  },
  viewport: {
    ...cssReset(VIEWPORT_DEFAULT_TAG),
    zIndex: 1,
    position: 'relative',

    '&[data-dragging], &[data-scrolling]': {
      // Remove pointer events from the content area while dragging or scrolling
      pointerEvents: 'none !important',
    },
  },
  scrollbarX: {
    ...cssReset(SCROLLBAR_DEFAULT_TAG),
    ...commonScrollbarStyles,
    height: `16px`,
    left: 0,
    bottom: 0,
    right: `var(${CSS_PROPS.scrollbarYOffset}, 0)`,
    flexDirection: 'row',
  },
  scrollbarY: {
    ...cssReset(SCROLLBAR_DEFAULT_TAG),
    ...commonScrollbarStyles,
    width: '16px',
    right: 0,
    top: 0,
    bottom: `var(${CSS_PROPS.scrollbarXOffset}, 0)`,
    flexDirection: 'column',
  },
  track: {
    ...cssReset(TRACK_DEFAULT_TAG),
    zIndex: -1,
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  thumb: {
    ...cssReset(THUMB_DEFAULT_TAG),
    position: 'absolute',
    top: '0',
    left: '0',
    userSelect: 'none',
    willChange: `var(${CSS_PROPS.scrollbarThumbWillChange})`,
    height: `var(${CSS_PROPS.scrollbarThumbHeight})`,
    width: `var(${CSS_PROPS.scrollbarThumbWidth})`,
  },
  buttonStart: {
    ...cssReset(BUTTON_DEFAULT_TAG),
    ...commonButtonStyles,
  },
  buttonEnd: {
    ...cssReset(BUTTON_DEFAULT_TAG),
    ...commonButtonStyles,
  },
  corner: {
    ...cssReset(CORNER_DEFAULT_TAG),
    userSelect: 'none',
    zIndex: 2,
    position: 'absolute',
    bottom: '0',
    right: `var(${CSS_PROPS.cornerRight})`,
    left: `var(${CSS_PROPS.cornerLeft})`,
    // cursor: `var(${CSS_PROPS.cornerCursor})`,
    width: `max(var(${CSS_PROPS.scrollbarYSize}, 0), var(${CSS_PROPS.scrollbarXSize}))`,
    height: `max(var(${CSS_PROPS.scrollbarXSize}, 0), var(${CSS_PROPS.scrollbarYSize}))`,
  },
});

export { ScrollArea, styles };
export type {
  ScrollAreaProps,
  ScrollAreaViewportProps,
  ScrollAreaScrollbarXProps,
  ScrollAreaScrollbarYProps,
  ScrollAreaButtonStartProps,
  ScrollAreaButtonEndProps,
  ScrollAreaTrackProps,
  ScrollAreaThumbProps,
};

/* ---------------------------------------------------------------------------------------------- */

function shouldFallbackToNativeScroll() {
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

type ScrollAreaContextValue = ScrollAreaReducerState & {
  isRTL: boolean;
  overflowX: OverflowBehavior;
  overflowY: OverflowBehavior;
  prefersReducedMotion: boolean;
  scrollAnimationQueue: Queue<any>;
  scrollbarAutoHide: ScrollbarAutoHide;
  scrollbarDragScrolling: boolean;
  userOnScroll: React.ComponentProps<'div'>['onScroll'];
};

// Ignore this, saving for my reference but I don't think we'll need them
// const BUTTON_SCROLL_INTERVAL_VALUES = [5, 7, 8, 9, 7, 7, 5, 2, 1];
// const BUTTON_SCROLL_INTERVAL = 15;
// const TRACK_SCROLL_INTERVAL_VALUES = [8, 38, 52, 52, 53, 49, 38, 38, 24];

function updateThumbSize(args: {
  thumbElement: HTMLElement | null | undefined;
  positionElement: HTMLElement;
  axis: Axis;
}) {
  const { thumbElement, positionElement, axis } = args;
  if (!thumbElement) {
    return;
  }

  const visibleToTotalRatio = getVisibleToTotalRatio(positionElement, { axis });

  if (!shouldOverflow(positionElement, { axis })) {
    // We're at 100% visible area, no need to show the scroll thumb:
    thumbElement.style.display = 'none';
    thumbElement.style.width = '0px';
    thumbElement.style.height = '0px';
  } else if (axis === 'x') {
    thumbElement.style.width = `${visibleToTotalRatio * 100}%`;
  } else if (axis === 'y') {
    thumbElement.style.height = `${visibleToTotalRatio * 100}%`;
  }
}

function updateThumbPosition(args: {
  thumbElement: HTMLElement;
  positionElement: HTMLElement;
  axis: Axis;
}) {
  const { thumbElement, positionElement, axis } = args;
  const totalScrollSize = getScrollSize(positionElement, { axis });
  const visibleSize = getClientSize(positionElement, { axis });
  const scrollPos = getScrollPosition(positionElement, { axis });
  const visibleToTotalRatio = visibleSize / totalScrollSize;
  const thumbPos = scrollPos / totalScrollSize;

  if (visibleToTotalRatio >= 1) {
    // We're at 100% visible area, the scroll thumb is invisible so we don't need to do anything:
  } else if (axis === 'x') {
    thumbElement.style.left = `${thumbPos * 100}%`;
  } else if (axis === 'y') {
    thumbElement.style.top = `${thumbPos * 100}%`;
  }
}

function useBorderBoxResizeObserver(
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
