// This component is a progressive enhancement that will fallback to a staandard div with overflow:
// scroll for browsers that don't support features we rely on.

/* eslint-disable @typescript-eslint/no-unused-vars */

// Needs to support:
//  - ResizeObserver
//  - IntersectionObserver
//  - PointerEvents
//  - CSS scrollbar-width OR -webkit-scrollbar

// TODO: Dragging functionality
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
import { clamp, cssReset, isMainClick } from '@interop-ui/utils';
import * as React from 'react';
import {
  Axis,
  LogicalDirection,
  ResizeBehavior,
  ScrollAreaContextValue,
  ScrollAreaEvent,
  ScrollAreaOwnProps,
  ScrollAreaReducerState,
  ScrollAreaRefs,
  Size,
} from './types';
import { ScrollAreaState, ScrollAreaEvents, reducer } from './scrollAreaState';
import { bezier } from './bezier-easing';
import { Queue } from './queue';
import {
  animate,
  canScroll,
  determineScrollDirectionFromTrackClick,
  getButtonRef,
  getClientSize,
  getLogicalRect,
  getLongPagedDraw,
  getLongPagedScrollDistance,
  getNewScrollPosition,
  getPagedDraw,
  getPagedScrollDistance,
  getPointerPosition,
  getScrollbarRef,
  getScrollPosition,
  getScrollSize,
  getThumbRef,
  getTrackRef,
  getVisibleToTotalRatio,
  pointerIsOutsideElement,
  scrollBy,
  setScrollPosition,
  shouldFallbackToNativeScroll,
  shouldOverflow,
  useBorderBoxResizeObserver,
} from './scrollAreaUtils';
import { useHover } from './useHover';

const SCROLLING_BODY_ATTR = 'data-interop-scrolling';

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
  cornerWidth: '--interop-scroll-area-corner-width',
  cornerHeight: '--interop-scroll-area-corner-height',
} as const;

const ROOT_DEFAULT_TAG = 'div';
const ROOT_NAME = 'ScrollArea';

// Keeping refs in a separate context; should be a stable reference throughout the tree
const [ScrollAreaRefsContext, useScrollAreaRefs] = createContext<ScrollAreaRefs>(
  'ScrollAreaRefsContext',
  ROOT_NAME
);

const [ScrollAreaContext, useScrollAreaContext] = createContext<ScrollAreaContextValue>(
  'ScrollAreaContext',
  ROOT_NAME
);

const [ScrollAreaStateContext, useScrollAreaStateContext] = createContext<ScrollAreaReducerState>(
  'ScrollAreaStateContext',
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
type ScrollAreaProps = ScrollAreaDOMProps & ScrollAreaOwnProps;

const ScrollArea = forwardRef<typeof ROOT_DEFAULT_TAG, ScrollAreaProps, ScrollAreaStaticProps>(
  function ScrollArea(props, forwardedRef) {
    const {
      as = ROOT_DEFAULT_TAG,
      children,
      overflowX = 'auto',
      overflowY = 'auto',
      scrollbarVisibility = 'always',
      scrollbarVisibilityRestTimeout = 600,
      isRTL = false,
      scrollbarDragScrolling = false,
      trackClickBehavior = 'relative',
      unstable_forceNative: forceNative = false,
      unstable_prefersReducedMotion = false,
      ...domProps
    } = props;
    const [usesNative, setUsesNative] = React.useState(true);
    // Check to make sure the user's browser supports our custom scrollbar features. We use a layout
    // effect here to avoid a visible flash when the custom scroll area replaces the native version.
    useLayoutEffect(() => {
      setUsesNative(forceNative || shouldFallbackToNativeScroll());
    }, [forceNative]);

    const ScrollAreaCustomOrNative = usesNative ? ScrollAreaNative : ScrollAreaImpl;

    return (
      <ScrollAreaCustomOrNative
        {...interopDataAttrObj('root')}
        {...domProps}
        as={as}
        overflowX={overflowX}
        overflowY={overflowY}
        scrollbarVisibility={scrollbarVisibility}
        scrollbarVisibilityRestTimeout={scrollbarVisibilityRestTimeout}
        isRTL={isRTL}
        scrollbarDragScrolling={scrollbarDragScrolling}
        trackClickBehavior={trackClickBehavior}
        unstable_prefersReducedMotion={unstable_prefersReducedMotion}
        ref={forwardedRef}
      >
        <NativeScrollContext.Provider value={usesNative}>{children}</NativeScrollContext.Provider>
      </ScrollAreaCustomOrNative>
    );
  }
);

type ScrollAreaNativeProps = Omit<ScrollAreaProps, 'unstable_forceNative'> & {
  overflowX: NonNullable<ScrollAreaProps['overflowX']>;
  overflowY: NonNullable<ScrollAreaProps['overflowY']>;
};

const ScrollAreaNative = forwardRef<typeof ROOT_DEFAULT_TAG, ScrollAreaNativeProps>(
  function ScrollAreaNative(props, forwardedRef) {
    const {
      as: Comp = ROOT_DEFAULT_TAG,
      overflowX,
      overflowY,
      scrollbarVisibility,
      scrollbarVisibilityRestTimeout,
      isRTL,
      scrollbarDragScrolling,
      trackClickBehavior,
      unstable_prefersReducedMotion,
      ...domProps
    } = props;
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

type ScrollAreaImplProps = ScrollAreaDOMProps &
  Required<Omit<ScrollAreaOwnProps, 'unstable_forceNative'>>;

const initialSize = { width: 0, height: 0 };
const initialState: ScrollAreaReducerState = {
  state: ScrollAreaState.Idle,
  explicitResize: 'initial',
  contentIsOverflowingX: false,
  contentIsOverflowingY: false,
  scrollbarIsVisibleX: false,
  scrollbarIsVisibleY: false,
  domSizes: {
    scrollArea: initialSize,
    viewport: initialSize,
    position: initialSize,
    scrollbarY: initialSize,
    scrollbarX: initialSize,
    trackY: initialSize,
    trackX: initialSize,
  },
};

const ScrollAreaImpl = forwardRef<typeof ROOT_DEFAULT_TAG, ScrollAreaImplProps>(
  function ScrollAreaImpl(props, forwardedRef) {
    const {
      as: Comp = ROOT_DEFAULT_TAG,
      children,
      onScroll,
      overflowX,
      overflowY,
      scrollbarVisibility,
      scrollbarVisibilityRestTimeout,
      isRTL,
      scrollbarDragScrolling,
      trackClickBehavior,
      unstable_prefersReducedMotion,
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

    const _prefersReducedMotion = usePrefersReducedMotion(scrollAreaRef);
    const prefersReducedMotion = unstable_prefersReducedMotion ?? _prefersReducedMotion;

    const [reducerState, _dispatch] = React.useReducer(reducer, {
      ...initialState,
      scrollbarIsVisibleX: scrollbarVisibility === 'always',
      scrollbarIsVisibleY: scrollbarVisibility === 'always',
    });

    const {
      hoverProps: { onPointerEnter, onPointerLeave },
      isHovered,
    } = useHover();

    const context: ScrollAreaContextValue = React.useMemo(() => {
      return {
        isHovered,
        isRTL,
        overflowX,
        overflowY,
        prefersReducedMotion,
        scrollAnimationQueue,
        scrollbarVisibility,
        scrollbarVisibilityRestTimeout,
        scrollbarDragScrolling,
        trackClickBehavior,
        userOnScroll,
      };
    }, [
      isHovered,
      isRTL,
      overflowX,
      overflowY,
      prefersReducedMotion,
      scrollAnimationQueue,
      scrollbarVisibility,
      scrollbarVisibilityRestTimeout,
      scrollbarDragScrolling,
      trackClickBehavior,
      userOnScroll,
    ]);

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

    useBorderBoxResizeObserver(
      scrollAreaRef,
      React.useCallback(
        (size: ResizeObserverSize) => {
          dispatch({
            type: ScrollAreaEvents.HandleScrollAreaResize,
            width: size.inlineSize,
            height: size.blockSize,
          });
        },
        [dispatch]
      )
    );

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
      scrollbarVisibility === 'always' &&
      (overflowX === 'scroll' || (overflowX === 'auto' && reducerState.contentIsOverflowingX));
    const shouldOffsetY =
      scrollbarVisibility === 'always' &&
      (overflowY === 'scroll' || (overflowY === 'auto' && reducerState.contentIsOverflowingY));

    const { domSizes } = reducerState;

    const style: any = {
      [CSS_PROPS.scrollbarXOffset]:
        shouldOffsetX && domSizes.scrollbarX.height ? domSizes.scrollbarX.height + 'px' : 0,
      [CSS_PROPS.scrollbarYOffset]:
        shouldOffsetY && domSizes.scrollbarY.width ? domSizes.scrollbarY.width + 'px' : 0,
      [CSS_PROPS.scrollbarXSize]: domSizes.scrollbarX.height
        ? domSizes.scrollbarX.height + 'px'
        : 0,
      [CSS_PROPS.scrollbarYSize]: domSizes.scrollbarY.width ? domSizes.scrollbarY.width + 'px' : 0,
      [CSS_PROPS.cornerHeight]: domSizes.scrollbarX.height
        ? domSizes.scrollbarX.height + 'px'
        : domSizes.scrollbarY.width
        ? domSizes.scrollbarY.width + 'px'
        : '16px',
      [CSS_PROPS.cornerWidth]: domSizes.scrollbarY.width
        ? domSizes.scrollbarY.width + 'px'
        : domSizes.scrollbarX.height
        ? domSizes.scrollbarX.height + 'px'
        : '16px',
      [CSS_PROPS.scrollAreaWidth]: domSizes.scrollArea.width
        ? domSizes.scrollArea.width + 'px'
        : 'auto',
      [CSS_PROPS.scrollAreaHeight]: domSizes.scrollArea.height
        ? domSizes.scrollArea.height + 'px'
        : 'auto',
      [CSS_PROPS.positionWidth]: domSizes.position.width ? domSizes.position.width + 'px' : 'auto',
      [CSS_PROPS.positionHeight]: domSizes.position.height
        ? domSizes.position.height + 'px'
        : 'auto',
    };

    return (
      <DispatchContext.Provider value={dispatch}>
        <ScrollAreaRefsContext.Provider value={refs}>
          <ScrollAreaContext.Provider value={context}>
            <ScrollAreaStateContext.Provider value={reducerState}>
              <Comp
                {...domProps}
                ref={ref}
                style={{
                  ...domProps.style,
                  ...style,
                }}
                onPointerEnter={composeEventHandlers(props.onPointerEnter, onPointerEnter)}
                onPointerLeave={composeEventHandlers(props.onPointerLeave, onPointerLeave)}
              >
                {children}
              </Comp>
            </ScrollAreaStateContext.Provider>
          </ScrollAreaContext.Provider>
        </ScrollAreaRefsContext.Provider>
      </DispatchContext.Provider>
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
    const {
      positionRef,
      thumbXRef,
      thumbYRef,
      trackXRef,
      trackYRef,
      viewportRef,
    } = useScrollAreaRefs(VIEWPORT_NAME);
    const {
      userOnScroll,
      overflowX,
      overflowY,
      scrollbarVisibility,
      ...context
    } = useScrollAreaContext(VIEWPORT_NAME);
    const stateContext = useScrollAreaStateContext(VIEWPORT_NAME);
    const dispatch = useDispatchContext(VIEWPORT_NAME);
    const ref = useComposedRefs(forwardedRef, viewportRef);

    useBorderBoxResizeObserver(
      viewportRef,
      React.useCallback(
        (size: ResizeObserverSize) => {
          dispatch({
            type: ScrollAreaEvents.HandleViewportResize,
            width: size.inlineSize,
            height: size.blockSize,
          });
        },
        [dispatch]
      )
    );

    // Update the scrollbar thumb position as the user scrolls. This is simpler to execute here with
    // the scroll handler rather than in the thumb components.
    const updateThumbsWithScrollPosition = React.useCallback(
      function updateThumbsWithScrollPosition() {
        const positionElement = positionRef.current;
        const thumbXElement = thumbXRef.current;
        const thumbYElement = thumbYRef.current;
        const trackXElement = trackXRef.current;
        const trackYElement = trackYRef.current;
        if (thumbXElement && trackXElement && positionElement) {
          updateThumbPosition({
            thumbElement: thumbXElement,
            trackElement: trackXElement,
            axis: 'x',
            positionElement,
          });
        }
        if (thumbYElement && trackYElement && positionElement) {
          updateThumbPosition({
            thumbElement: thumbYElement,
            trackElement: trackYElement,
            axis: 'y',
            positionElement,
          });
        }
      },
      [positionRef, thumbXRef, thumbYRef, trackXRef, trackYRef]
    );

    // When the user scrolls we need to update the visibility of scrollbars. This, too, is simpler
    // to execute here with the scroll handler rather than in the scrollbar components.
    const lastScrollTop = React.useRef(0);
    const lastScrollLeft = React.useRef(0);
    function setScrollbarVisibilityOnScroll() {
      if (!positionRef.current) return;
      const scrollTop = positionRef.current.scrollTop;
      const scrollLeft = positionRef.current.scrollLeft;
      const scrollbarIsVisibleY = scrollTop !== lastScrollTop.current;
      const scrollbarIsVisibleX = scrollLeft !== lastScrollLeft.current;

      if (
        scrollbarIsVisibleY !== stateContext.scrollbarIsVisibleY ||
        scrollbarIsVisibleX !== stateContext.scrollbarIsVisibleX
      ) {
        dispatch({
          type: ScrollAreaEvents.SetScrollbarIsVisible,
          scrollbarVisibility,
          x: scrollbarIsVisibleX,
          y: scrollbarIsVisibleY,
        });
      }
      lastScrollTop.current = scrollTop <= 0 ? 0 : scrollTop;
      lastScrollLeft.current = scrollLeft <= 0 ? 0 : scrollLeft;
    }

    const handleScroll = composeEventHandlers(userOnScroll, function handleScroll() {
      if (!positionRef.current) return;
      updateThumbsWithScrollPosition();
      setScrollbarVisibilityOnScroll();
    });

    useLayoutEffect(() => {
      updateThumbsWithScrollPosition();
    }, [updateThumbsWithScrollPosition]);

    // Determine whether or not content is overflowing in either direction and update context
    // accordingly.
    useLayoutEffect(
      function handleContentOverflow() {
        const positionElement = positionRef.current;
        if (!positionElement) return;

        const contentIsOverflowingX = shouldOverflow(positionElement, { axis: 'x' });
        const contentIsOverflowingY = shouldOverflow(positionElement, { axis: 'y' });
        if (
          contentIsOverflowingX !== stateContext.contentIsOverflowingX ||
          contentIsOverflowingY !== stateContext.contentIsOverflowingY
        ) {
          dispatch({
            type: ScrollAreaEvents.SetContentOverflowing,
            x: contentIsOverflowingX,
            y: contentIsOverflowingY,
          });
        }
      },
      [
        stateContext.contentIsOverflowingX,
        stateContext.contentIsOverflowingY,
        dispatch,
        positionRef,

        // trigger update when any size changes occur
        // eslint-disable-next-line react-hooks/exhaustive-deps
        ...getValuesFromSizeObjects(stateContext.domSizes),
      ]
    );

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
          scrollbarWidth: 'none',
          overflowScrolling: 'touch',
          resize: 'none',
          overflowX,
          overflowY,
        }}
      >
        <div
          data-interop-scroll-area-position-inner=""
          style={{
            ...cssReset('div'),
            // The browser won’t add right padding of the viewport when you scroll to the end of the
            // x axis if we put the scrollbar offset padding directly on the position element. We
            // get around this with an extra wrapper with `display: table`.
            // https://blog.alexandergottlieb.com/overflow-scroll-and-the-right-padding-problem-a-css-only-solution-6d442915b3f4
            display: 'table',
            paddingBottom: `var(${CSS_PROPS.scrollbarXOffset})`,
            paddingRight: `var(${CSS_PROPS.scrollbarYOffset})`,
          }}
        >
          <Comp {...interopDataAttrObj('viewport')} ref={ref} {...domProps} />
        </div>
      </div>
    );
  }
);

const ScrollAreaViewport = memo(
  forwardRef<typeof VIEWPORT_DEFAULT_TAG, ScrollAreaViewportProps>(function ScrollAreaViewport(
    props,
    forwardedRef
  ) {
    const { as: Comp = VIEWPORT_DEFAULT_TAG, ...domProps } = props;
    return useNativeScrollArea() ? (
      <Comp {...interopDataAttrObj('viewport')} ref={forwardedRef} {...domProps} />
    ) : (
      <ScrollAreaViewportImpl ref={forwardedRef} as={Comp} {...domProps} />
    );
  })
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
type ScrollAreaScrollbarXProps = ScrollAreaScrollbarProps;
type ScrollAreaScrollbarYProps = ScrollAreaScrollbarProps;
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
    const {
      as: Comp = SCROLLBAR_DEFAULT_TAG,
      axis,
      name,
      onWheel,
      onPointerDown,
      onPointerUp,
      onPointerMove,
      ...domProps
    } = props;
    const dispatch = useDispatchContext(name);
    const { scrollbarVisibility, scrollbarVisibilityRestTimeout, isHovered } = useScrollAreaContext(
      name
    );
    const {
      [axis === 'x' ? 'contentIsOverflowingX' : 'contentIsOverflowingY']: contentIsOverflowing,
      [axis === 'x' ? 'scrollbarIsVisibleX' : 'scrollbarIsVisibleY']: scrollbarIsVisible,
    } = useScrollAreaStateContext(name);
    const refsContext = useScrollAreaRefs(name);
    const { positionRef } = refsContext;
    const scrollbarRef = getScrollbarRef(axis, refsContext);
    const ref = useComposedRefs(scrollbarRef, forwardedRef);

    useBorderBoxResizeObserver(
      scrollbarRef,
      React.useCallback(
        (size: ResizeObserverSize) => {
          dispatch({
            type: ScrollAreaEvents.HandleScrollbarResize,
            width: size.inlineSize,
            height: size.blockSize,
            axis,
          });
        },
        [dispatch, axis]
      )
    );

    const handleWheel = composeEventHandlers(onWheel, function handleWheel(event) {
      const absoluteDeltaX = Math.abs(event.deltaX);
      const absoluteDeltaY = Math.abs(event.deltaY);
      if (positionRef.current) {
        if (absoluteDeltaX > 0 && absoluteDeltaX > absoluteDeltaY) {
          positionRef.current.scrollLeft += event.deltaX;
        }
        if (absoluteDeltaY > 0 && absoluteDeltaY > absoluteDeltaX) {
          positionRef.current.scrollTop += event.deltaY;
        }
      }
    });

    const timeoutId = React.useRef<number>(undefined!);
    React.useEffect(() => {
      if (scrollbarIsVisible) {
        timeoutId.current = window.setTimeout(() => {
          dispatch({
            type: ScrollAreaEvents.SetScrollbarIsVisible,
            scrollbarVisibility,
            [axis]: false,
          });
        }, scrollbarVisibilityRestTimeout);
        return function () {
          window.clearTimeout(timeoutId.current);
        };
      }
    }, [axis, dispatch, scrollbarVisibility, scrollbarVisibilityRestTimeout, scrollbarIsVisible]);

    function resetInteractiveTimer() {
      window.clearTimeout(timeoutId.current);
      timeoutId.current = window.setTimeout(() => {
        dispatch({
          type: ScrollAreaEvents.SetScrollbarIsVisible,
          scrollbarVisibility,
          [axis]: false,
        });
      }, scrollbarVisibilityRestTimeout);
    }

    // Not capturing the pointer because the user may be clicking on the thumb, but we need to know
    // whether or not it's down on pointer move so we just use a ref.
    const pointerDown = React.useRef(false);

    const handlePointerDown = composeEventHandlers(onPointerDown, (event) => {
      pointerDown.current = true;
      window.clearTimeout(timeoutId.current);
    });

    const handlePointerUp = composeEventHandlers(onPointerUp, (event) => {
      pointerDown.current = false;
      resetInteractiveTimer();
    });

    const handlePointerMove = composeEventHandlers(onPointerMove, (event) => {
      if (!pointerDown.current) {
        resetInteractiveTimer();
      }
    });

    const opacity = (function () {
      const defaultVisible = domProps.style?.opacity || 1;
      switch (scrollbarVisibility) {
        case 'always':
          return domProps.style?.opacity;
        case 'scroll':
          return scrollbarIsVisible ? defaultVisible : 0;
        case 'hover':
          return isHovered ? defaultVisible : scrollbarIsVisible ? defaultVisible : 0;
      }
    })();

    const pointerEvents = (function () {
      const defaultVisible = domProps.style?.pointerEvents || 'auto';
      switch (scrollbarVisibility) {
        case 'always':
          return domProps.style?.pointerEvents;
        case 'scroll':
          return scrollbarIsVisible ? defaultVisible : 'none';
        case 'hover':
          return isHovered ? defaultVisible : scrollbarIsVisible ? defaultVisible : 'none';
      }
    })();

    return (
      <ScrollbarContext.Provider value={axis}>
        <Comp
          ref={ref}
          {...domProps}
          style={{
            ...domProps.style,
            display: !contentIsOverflowing ? 'none' : domProps.style?.display,
            opacity,
            pointerEvents,
          }}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerMove={handlePointerMove}
          onWheel={handleWheel}
        />
      </ScrollbarContext.Provider>
    );
  }
);

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
    const { as: Comp = TRACK_DEFAULT_TAG, onPointerDown: onPointerDownProp, ...domProps } = props;
    const axis = useScrollbarContext(TRACK_NAME);
    const dispatch = useDispatchContext(TRACK_NAME);
    const refsContext = useScrollAreaRefs(TRACK_NAME);
    const { trackClickBehavior, prefersReducedMotion, scrollAnimationQueue } = useScrollAreaContext(
      TRACK_NAME
    );
    const { positionRef } = refsContext;
    const trackRef = getTrackRef(axis, refsContext);
    const thumbRef = getThumbRef(axis, refsContext);
    const ref = useComposedRefs(trackRef, forwardedRef);

    const onPointerDown = useCallbackRef(onPointerDownProp);

    useBorderBoxResizeObserver(
      trackRef,
      React.useCallback(
        (size: ResizeObserverSize) => {
          dispatch({
            type: ScrollAreaEvents.HandleTrackResize,
            width: size.inlineSize,
            height: size.blockSize,
            axis,
          });
        },
        [axis, dispatch]
      )
    );
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

      const handlePointerDown = composeEventHandlers(
        onPointerDown as any,
        function handlePointerDown(event: PointerEvent) {
          if (
            !isMainClick(event) ||
            // We don't want to stop propogation because we need the scrollbar itself to fire pointer
            // events, but we don't want pointer events on the thumb to trigger events on the track.
            event.target === thumbElement ||
            thumbElement.contains(event.target as HTMLElement)
          ) {
            return;
          }

          const direction = determineScrollDirectionFromTrackClick({
            event,
            axis,
            thumbElement,
          });
          window.clearTimeout(trackPointerUpTimeoutId!);

          if (trackClickBehavior === 'page') {
            dispatch({ type: ScrollAreaEvents.StartTracking });
            document.addEventListener('pointermove', handlePointerMove);
            document.addEventListener('pointerup', handlePointerUp);
            trackElement.setPointerCapture(event.pointerId);

            // Handle immediate scroll event.
            if (prefersReducedMotion) {
              // Scroll immediately
              const distance = getPagedScrollDistance({ direction, positionElement, axis });
              const value = getNewScrollPosition(positionElement, { direction, distance, axis });
              setScrollPosition(positionElement, { axis, value });
            } else {
              // Queue scroll animation
              scrollAnimationQueue.enqueue(() => {
                return animate({
                  duration: 200,
                  timing: bezier(0.16, 0, 0.73, 1),
                  draw: getPagedDraw({ positionElement, direction, axis }),
                  rafIdRef,
                });
              });
            }

            // After some time 400ms, if the user still has the pointer down we'll start to scroll
            // further to some relative distance near the pointer in relation to the track.
            trackPointerDownTimeoutId = window.setTimeout(() => {
              const pointerPosition = getPointerPosition(event);
              const totalScrollDistance = getLongPagedScrollDistance({
                axis,
                direction,
                pointerPosition,
                positionElement,
                trackElement,
              });

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
                const durationBasis = Math.round(Math.abs(totalScrollDistance));
                const duration = clamp(durationBasis, [100, 500]);
                scrollAnimationQueue.enqueue(() =>
                  animate({
                    duration,
                    timing: (n) => n,
                    draw: getLongPagedDraw({
                      axis,
                      direction,
                      pointerPosition,
                      positionElement,
                      trackElement,
                    }),
                    rafIdRef,
                  })
                );
              }
              window.clearTimeout(trackPointerDownTimeoutId!);
            }, 400);

            return function () {
              window.clearTimeout(trackPointerDownTimeoutId!);
            };
          } else {
            const pointerPosition = getPointerPosition(event);
            const totalScrollDistance = getLongPagedScrollDistance({
              axis,
              direction,
              pointerPosition,
              positionElement,
              trackElement,
            });
            const newPosition = getNewScrollPosition(positionElement, {
              direction,
              distance: totalScrollDistance,
              axis,
            });
            setScrollPosition(positionElement, { axis, value: newPosition });
            const thumbPointerDown = new PointerEvent('pointerdown', event);

            // Wait a tick for the DOM measurements to update, then fire event on the thumb to
            // immediately shift to a thumbing state.
            window.requestAnimationFrame(() => {
              thumbElement.dispatchEvent(thumbPointerDown);
            });
          }
        }
      );

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
        scrollAnimationQueue.stop();
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
      prefersReducedMotion,
      trackClickBehavior,
      // these should be stable references
      dispatch,
      onPointerDown,
      positionRef,
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
    const { as: Comp = THUMB_DEFAULT_TAG, onPointerDown: onPointerDownProp, ...domProps } = props;
    const axis = useScrollbarContext(THUMB_NAME);
    const refsContext = useScrollAreaRefs(THUMB_NAME);
    const dispatch = useDispatchContext(THUMB_NAME);
    const { positionRef } = refsContext;
    const thumbRef = getThumbRef(axis, refsContext);
    const trackRef = getTrackRef(axis, refsContext);
    const ref = useComposedRefs(thumbRef, forwardedRef);
    const context = useScrollAreaContext(THUMB_NAME);
    const stateContext = useScrollAreaStateContext(THUMB_NAME);
    const onPointerDown = useCallbackRef(onPointerDownProp);

    const pointerInitialStartPointRef = React.useRef<number>(0);
    const pointerStartPointRef = React.useRef<number>(0);
    const thumbInitialData = React.useRef({ size: 0, positionStart: 0 });
    const trackInitialData = React.useRef({ size: 0, positionStart: 0 });

    // Update the thumb's size and position anytime any element in the scroll area tree is resized.
    const mounted = React.useRef(false);
    useLayoutEffect(() => {
      if (!mounted.current) {
        mounted.current = true;
        return;
      }

      const thumbElement = thumbRef.current;
      const trackElement = trackRef.current;
      const positionElement = positionRef.current;
      if (!thumbElement || !positionElement || !trackElement) {
        // TODO:
        throw Error('why no refs 😢');
      }

      updateThumbPosition({ thumbElement, trackElement, positionElement, axis });
    }, [
      thumbRef,
      trackRef,
      positionRef,
      axis,

      // trigger update when any size changes occur
      // eslint-disable-next-line react-hooks/exhaustive-deps
      ...getValuesFromSizeObjects(stateContext.domSizes),
    ]);

    React.useEffect(() => {
      const thumbElement = thumbRef.current!;
      const trackElement = trackRef.current!;
      if (!thumbElement || !trackElement) {
        // TODO:
        throw Error('why no refs 😢');
      }

      const handlePointerDown = composeEventHandlers(
        onPointerDown as any,
        function handlePointerDown(event: PointerEvent) {
          if (!isMainClick(event)) return;

          // const pointerPosition = getPointerPosition(event)[axis];

          const pointerPosition = getPointerPosition(event)[axis];

          // As the user moves the pointer, we want the thumb to stay positioned relative to the
          // pointer position at the time of the initial pointerdown event. We'll store some data in a
          // few refs that the pointermove handler can access to calculate this properly.
          thumbInitialData.current = getLogicalRect(thumbElement, { axis });
          trackInitialData.current = getLogicalRect(trackElement, { axis });

          pointerStartPointRef.current = pointerPosition;
          pointerInitialStartPointRef.current = pointerPosition;

          thumbElement.setPointerCapture(event.pointerId);
          document.addEventListener('pointerup', handlePointerUp);
          document.addEventListener('pointermove', handlePointerMove);
          dispatch({ type: ScrollAreaEvents.StartThumbing });
        }
      );

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

      function handlePointerMove(event: PointerEvent) {
        const pointerPosition = getPointerPosition(event)[axis];

        dispatch({
          type: ScrollAreaEvents.MoveThumbWithPointer,
          axis,
          pointerPosition,
          pointerStartPointRef,
          pointerInitialStartPointRef,
          thumbInitialData,
          trackInitialData,
        });
      }

      function handlePointerUp(event: PointerEvent) {
        thumbElement.releasePointerCapture(event.pointerId);
        stopThumbing();
      }
    }, [
      axis,
      // these should be stable references
      onPointerDown,
      dispatch,
      thumbRef,
      trackRef,
    ]);

    const [thumbStyles, setThumbStyles] = React.useState<React.CSSProperties>({});

    useLayoutEffect(() => {
      const positionElement = positionRef.current;
      const trackElement = trackRef.current;
      setThumbStyles(getThumbSize({ positionElement, trackElement, axis }));
    }, [
      axis,
      positionRef,
      trackRef,

      // trigger update when any size changes occur
      // eslint-disable-next-line react-hooks/exhaustive-deps
      ...getValuesFromSizeObjects(stateContext.domSizes),
    ]);

    return (
      <Comp
        {...interopDataAttrObj('thumb')}
        ref={ref}
        {...domProps}
        data-axis={axis}
        style={{
          ...domProps.style,
          ...thumbStyles,
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
type ScrollAreaButtonStartProps = ScrollAreaButtonProps;
type ScrollAreaButtonEndProps = ScrollAreaButtonProps;

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
    const {
      as: Comp = BUTTON_DEFAULT_TAG,
      direction,
      name,
      onPointerDown: onPointerDownProp,
      ...domProps
    } = props;
    const axis = useScrollbarContext(name);
    const dispatch = useDispatchContext(name);
    const refsContext = useScrollAreaRefs(name);
    const { prefersReducedMotion, scrollAnimationQueue } = useScrollAreaContext(name);
    const { positionRef } = refsContext;
    const buttonRef = getButtonRef(direction, axis, refsContext);
    const ref = useComposedRefs(buttonRef, forwardedRef);
    const rafIdRef = React.useRef<number>();
    const onPointerDown = useCallbackRef(onPointerDownProp);

    React.useEffect(() => {
      const buttonElement = buttonRef.current!;
      const positionElement = positionRef.current!;
      if (!buttonElement || !positionElement) {
        // TODO:
        throw Error('arrrrg ref feed me');
      }

      let buttonPointerDownTimeoutId: number;

      let buttonIntervalId: number = null!;
      const handlePointerDown = composeEventHandlers(
        onPointerDown as any,
        function handlePointerDown(event: PointerEvent) {
          if (!isMainClick(event)) return;

          buttonElement.setPointerCapture(event.pointerId);
          document.addEventListener('pointerup', handlePointerUp);
          document.addEventListener('pointermove', handlePointerMove);
          dispatch({ type: ScrollAreaEvents.StartButtonPress });

          const delta = direction === 'start' ? -1 : 1;
          if (prefersReducedMotion) {
            scrollBy(positionElement, { axis, value: 51 * delta });
          } else {
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
              buttonIntervalId = window.setInterval(() => {
                if (canScroll(positionElement, { axis, delta })) {
                  scrollBy(positionElement, { axis, value: 60 * delta });
                } else {
                  window.clearInterval(buttonIntervalId);
                }
              }, BUTTON_SCROLL_TIME);
            } else {
              const pointerId = event.pointerId;
              (function keepScrolling() {
                if (canScroll(positionElement, { axis, delta })) {
                  scrollAnimationQueue.enqueue(() =>
                    animate({
                      duration: BUTTON_SCROLL_TIME,
                      timing: (n) => n,
                      draw(progress) {
                        scrollBy(positionElement, { axis, value: progress * (15 * delta) });
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
      );

      buttonElement.addEventListener('pointerdown', handlePointerDown);

      return function () {
        buttonElement.removeEventListener('pointerdown', handlePointerDown);
        document.removeEventListener('pointerup', handlePointerUp);
        document.removeEventListener('pointermove', handlePointerMove);
        window.clearTimeout(buttonPointerDownTimeoutId!);
        window.clearInterval(buttonIntervalId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        window.cancelAnimationFrame(rafIdRef.current!);
        dispatch({ type: ScrollAreaEvents.StopButtonPress });
      };

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
        window.clearInterval(buttonIntervalId);
        buttonElement.releasePointerCapture(event.pointerId);
        buttonElement.removeEventListener('pointerup', handlePointerUp);
        dispatch({ type: ScrollAreaEvents.StopButtonPress });
      }
    }, [
      axis,
      direction,
      prefersReducedMotion,
      // these should be stable references
      buttonRef,
      dispatch,
      onPointerDown,
      scrollAnimationQueue,
      positionRef,
    ]);

    return <Comp {...domProps} ref={ref} data-axis={axis} />;
  }
);

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
      // TODO: This code will be useful when resize handles are properly supported. We can safely
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

/* ------------------------------------------------------------------------------------------------*/

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
    maxWidth: '100%',
    maxHeight: '100%',
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
    right: `var(${CSS_PROPS.scrollbarXSize}, 0)`,
    flexDirection: 'row',
  },
  scrollbarY: {
    ...cssReset(SCROLLBAR_DEFAULT_TAG),
    ...commonScrollbarStyles,
    width: '16px',
    right: 0,
    top: 0,
    bottom: `var(${CSS_PROPS.scrollbarYSize}, 0)`,
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
    width: `var(${CSS_PROPS.cornerWidth})`,
    height: `var(${CSS_PROPS.cornerHeight})`,
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

function getThumbSize(args: {
  trackElement: HTMLElement | null | undefined;
  positionElement: HTMLElement | null | undefined;
  axis: Axis;
}): React.CSSProperties {
  const { trackElement, positionElement, axis } = args;
  if (!trackElement || !positionElement) {
    return {};
  }

  const visibleRatio = getVisibleToTotalRatio(positionElement, { axis });
  const trackSize = getClientSize(trackElement, { axis });
  const thumbSize = visibleRatio * trackSize;

  if (!shouldOverflow(positionElement, { axis })) {
    // We're at 100% visible area, no need to show the scroll thumb:
    return {
      display: 'none',
      width: 0,
      height: 0,
    };
  }
  return {
    [axis === 'x' ? 'width' : 'height']: thumbSize,
  };
}

function updateThumbPosition(args: {
  thumbElement: HTMLElement;
  trackElement: HTMLElement;
  positionElement: HTMLElement;
  axis: Axis;
}) {
  const { thumbElement, trackElement, positionElement, axis } = args;

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

function getValuesFromSizeObjects(obj: Record<string, Size>) {
  const sizes: number[] = [];
  for (const k of Object.keys(obj)) {
    const o = obj[k];
    sizes.push(o.height, o.width);
  }
  return sizes;
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

declare class ResizeObserver {
  constructor(callback: ResizeObserverCallback);
  observe: (target: Element, options?: ResizeObserverOptions) => void;
  unobserve: (target: Element) => void;
  disconnect: () => void;
}

type ResizeObserverBoxOptions = 'border-box' | 'content-box' | 'device-pixel-content-box';

interface ResizeObserverOptions {
  box?: ResizeObserverBoxOptions;
}

type ResizeObserverCallback = (entries: ResizeObserverEntry[], observer: ResizeObserver) => void;
