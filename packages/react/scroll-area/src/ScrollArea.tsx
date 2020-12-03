// This component is a progressive enhancement that will fallback to a staandard div with overflow:
// scroll for browsers that don't support features we rely on.

// Needs to support:
//  - ResizeObserver
//  - PointerEvents
//  - CSS scrollbar-width OR -webkit-scrollbar

// TODO: Replace all globals with globals relative to the root node
// TODO: RTL language testing for horizontal scrolling

import {
  composeEventHandlers,
  createContext,
  useCallbackRef,
  useComposedRefs,
  useConstant,
  useLayoutEffect,
  usePrefersReducedMotion,
} from '@interop-ui/react-utils';
import { forwardRefWithAs } from '@interop-ui/react-polymorphic';
import { clamp, getPartDataAttrObj, isMainClick } from '@interop-ui/utils';
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
  ScrollbarContextValue,
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

const SCROLL_AREA_CSS_PROPS = {
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

const ScrollAreaStateContext = React.createContext<ScrollAreaReducerState>({} as any);
ScrollAreaStateContext.displayName = 'ScrollAreaStateContext';
function useScrollAreaStateContext() {
  return React.useContext(ScrollAreaStateContext);
}

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

const ScrollArea = forwardRefWithAs<typeof ROOT_DEFAULT_TAG, ScrollAreaProps>(function ScrollArea(
  props,
  forwardedRef
) {
  const {
    as = ROOT_DEFAULT_TAG,
    children,
    overflowX = 'auto',
    overflowY = 'auto',
    scrollbarVisibility = 'always',
    scrollbarVisibilityRestTimeout = 600,
    dir,
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
      {...getPartDataAttrObj(ROOT_NAME)}
      {...domProps}
      as={as}
      overflowX={overflowX}
      overflowY={overflowY}
      scrollbarVisibility={scrollbarVisibility}
      scrollbarVisibilityRestTimeout={scrollbarVisibilityRestTimeout}
      dir={dir!}
      trackClickBehavior={trackClickBehavior}
      unstable_prefersReducedMotion={unstable_prefersReducedMotion}
      ref={forwardedRef}
    >
      <NativeScrollContext.Provider value={usesNative}>{children}</NativeScrollContext.Provider>
    </ScrollAreaCustomOrNative>
  );
});

type ScrollAreaNativeProps = Omit<ScrollAreaProps, 'unstable_forceNative'> & {
  overflowX: NonNullable<ScrollAreaProps['overflowX']>;
  overflowY: NonNullable<ScrollAreaProps['overflowY']>;
};

const ScrollAreaNative = forwardRefWithAs<typeof ROOT_DEFAULT_TAG, ScrollAreaNativeProps>(
  function ScrollAreaNative(props, forwardedRef) {
    const {
      as: Comp = ROOT_DEFAULT_TAG,
      overflowX,
      overflowY,
      scrollbarVisibility,
      scrollbarVisibilityRestTimeout,
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

const ScrollAreaImpl = forwardRefWithAs<typeof ROOT_DEFAULT_TAG, ScrollAreaImplProps>(
  function ScrollAreaImpl(props, forwardedRef) {
    const {
      as: Comp = ROOT_DEFAULT_TAG,
      children,
      onScroll,
      overflowX,
      overflowY,
      scrollbarVisibility,
      scrollbarVisibilityRestTimeout,
      trackClickBehavior,
      unstable_prefersReducedMotion,
      ...domProps
    } = props;

    // That we call `onScroll` in the viewport component is an implementation detail that the
    // consumer probably shouldn't need to think about. Passing it down from the top means that the
    // event handler would work the same way in the native fallback as well.
    const handleScroll = useCallbackRef(onScroll);

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

    const _prefersReducedMotion = usePrefersReducedMotion(scrollAreaRef);
    const prefersReducedMotion = unstable_prefersReducedMotion ?? _prefersReducedMotion;

    const [reducerState, dispatch] = React.useReducer(reducer, {
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
        dir: props.dir || 'ltr',
        isHovered,
        onScroll: handleScroll,
        overflowX,
        overflowY,
        prefersReducedMotion,
        scrollbarVisibility,
        scrollbarVisibilityRestTimeout,
        trackClickBehavior,
      };
    }, [
      props.dir,
      handleScroll,
      isHovered,
      overflowX,
      overflowY,
      prefersReducedMotion,
      scrollbarVisibility,
      scrollbarVisibilityRestTimeout,
      trackClickBehavior,
    ]);

    const ref = useComposedRefs(forwardedRef, scrollAreaRef);
    useBorderBoxResizeObserver(scrollAreaRef, (size, scrollAreaElement) => {
      const scrollAreaComputedStyle = window.getComputedStyle(scrollAreaElement);
      dispatch({
        type: ScrollAreaEvents.HandleScrollAreaResize,
        scrollAreaComputedStyle,
        width: size.inlineSize,
        height: size.blockSize,
      });
    });

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
      [SCROLL_AREA_CSS_PROPS.scrollbarXOffset]:
        shouldOffsetX && domSizes.scrollbarX.height ? domSizes.scrollbarX.height + 'px' : 0,
      [SCROLL_AREA_CSS_PROPS.scrollbarYOffset]:
        shouldOffsetY && domSizes.scrollbarY.width ? domSizes.scrollbarY.width + 'px' : 0,
      [SCROLL_AREA_CSS_PROPS.positionWidth]: domSizes.position.width
        ? domSizes.position.width + 'px'
        : 'auto',
      [SCROLL_AREA_CSS_PROPS.positionHeight]: domSizes.position.height
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

const ScrollAreaViewportImpl = forwardRefWithAs<
  typeof VIEWPORT_DEFAULT_TAG,
  ScrollAreaViewportProps
>(function ScrollAreaViewportImpl(props, forwardedRef) {
  const { as: Comp = VIEWPORT_DEFAULT_TAG, ...domProps } = props;
  const {
    positionRef,
    thumbXRef,
    thumbYRef,
    trackXRef,
    trackYRef,
    viewportRef,
  } = useScrollAreaRefs(VIEWPORT_NAME);
  const { onScroll, overflowX, overflowY, scrollbarVisibility } = useScrollAreaContext(
    VIEWPORT_NAME
  );
  const stateContext = useScrollAreaStateContext();
  const dispatch = useDispatchContext(VIEWPORT_NAME);
  const ref = useComposedRefs(forwardedRef, viewportRef);

  useBorderBoxResizeObserver(viewportRef, (size: ResizeObserverSize) => {
    dispatch({
      type: ScrollAreaEvents.HandleViewportResize,
      width: size.inlineSize,
      height: size.blockSize,
    });
  });

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

  const handleScroll = composeEventHandlers(onScroll, function handleScroll() {
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
      stateContext.domSizes.position.height,
      stateContext.domSizes.position.width,
      stateContext.domSizes.viewport.height,
      stateContext.domSizes.viewport.width,
    ]
  );

  return (
    <div
      {...getPartDataAttrObj('ScrollAreaPosition')}
      ref={positionRef}
      onScroll={handleScroll}
      style={{
        zIndex: 1,
        width: `var(${SCROLL_AREA_CSS_PROPS.positionWidth})`,
        height: `var(${SCROLL_AREA_CSS_PROPS.positionHeight})`,
        scrollbarWidth: 'none',
        // @ts-ignore
        overflowScrolling: 'touch',
        resize: 'none',
        overflowX,
        overflowY,
      }}
    >
      <div
        {...getPartDataAttrObj('ScrollAreaPositionInner')}
        style={{
          // The browser won’t add right padding of the viewport when you scroll to the end of the
          // x axis if we put the scrollbar offset padding directly on the position element. We
          // get around this with an extra wrapper with `display: table`.
          // https://blog.alexandergottlieb.com/overflow-scroll-and-the-right-padding-problem-a-css-only-solution-6d442915b3f4
          display: 'table',
          paddingBottom: `var(${SCROLL_AREA_CSS_PROPS.scrollbarXOffset})`,
          paddingRight: `var(${SCROLL_AREA_CSS_PROPS.scrollbarYOffset})`,
        }}
      >
        <Comp {...getPartDataAttrObj(VIEWPORT_NAME)} ref={ref} {...domProps} />
      </div>
    </div>
  );
});

const ScrollAreaViewport = forwardRefWithAs<typeof VIEWPORT_DEFAULT_TAG, ScrollAreaViewportProps>(
  function ScrollAreaViewport(props, forwardedRef) {
    const { as: Comp = VIEWPORT_DEFAULT_TAG, ...domProps } = props;
    return useNativeScrollArea() ? (
      <Comp {...getPartDataAttrObj(VIEWPORT_NAME)} ref={forwardedRef} {...domProps} />
    ) : (
      <ScrollAreaViewportImpl ref={forwardedRef} as={Comp} {...domProps} />
    );
  }
);
ScrollAreaViewport.displayName = VIEWPORT_NAME;

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

const [ScrollbarContext, useScrollbarContext] = createContext<ScrollbarContextValue>(
  'ScrollbarContext',
  'ScrollAreaScrollbarImpl'
);

const ScrollAreaScrollbarImpl = forwardRefWithAs<
  typeof SCROLLBAR_DEFAULT_TAG,
  InternalScrollbarProps
>(function ScrollAreaScrollbarImpl(props, forwardedRef) {
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
  } = useScrollAreaStateContext();
  const refsContext = useScrollAreaRefs(name);
  const { positionRef } = refsContext;
  const scrollbarRef = getScrollbarRef(axis, refsContext);
  const ref = useComposedRefs(scrollbarRef, forwardedRef);

  // Animation effects triggered by button and track clicks are managed in a queue to prevent race
  // conditions and invalid DOM measurements when the user clicks faster than the animation is
  // able to be completed
  const scrollAnimationQueue = useConstant(() => new Queue<any>());

  useBorderBoxResizeObserver(scrollbarRef, (size: ResizeObserverSize) => {
    dispatch({
      type: ScrollAreaEvents.HandleScrollbarResize,
      width: size.inlineSize,
      height: size.blockSize,
      axis,
    });
  });

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

  const context: ScrollbarContextValue = React.useMemo(() => {
    return {
      axis,
      scrollAnimationQueue,
    };
  }, [axis, scrollAnimationQueue]);

  return (
    <ScrollbarContext.Provider value={context}>
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
});

const ScrollAreaScrollbarX = forwardRefWithAs<
  typeof SCROLLBAR_DEFAULT_TAG,
  ScrollAreaScrollbarXProps
>(function ScrollAreaScrollbarX(props, forwardedRef) {
  const { domSizes } = useScrollAreaStateContext();
  return useNativeScrollArea() ? null : (
    <ScrollAreaScrollbarImpl
      {...getPartDataAttrObj(SCROLLBAR_X_NAME)}
      ref={forwardedRef}
      {...props}
      axis="x"
      name={SCROLLBAR_X_NAME}
      style={{
        ...props.style,
        // @ts-ignore
        [SCROLL_AREA_CSS_PROPS.scrollbarXSize]: domSizes.scrollbarX.height
          ? domSizes.scrollbarX.height + 'px'
          : 0,
      }}
    />
  );
});
ScrollAreaScrollbarX.displayName = SCROLLBAR_X_NAME;

const ScrollAreaScrollbarY = forwardRefWithAs<
  typeof SCROLLBAR_DEFAULT_TAG,
  ScrollAreaScrollbarYProps
>(function ScrollAreaScrollbarY(props, forwardedRef) {
  const { domSizes } = useScrollAreaStateContext();
  return useNativeScrollArea() ? null : (
    <ScrollAreaScrollbarImpl
      {...getPartDataAttrObj(SCROLLBAR_Y_NAME)}
      ref={forwardedRef}
      {...props}
      axis="y"
      name={SCROLLBAR_Y_NAME}
      style={{
        ...props.style,
        // @ts-ignore
        [SCROLL_AREA_CSS_PROPS.scrollbarYSize]: domSizes.scrollbarY.width
          ? domSizes.scrollbarY.width + 'px'
          : 0,
      }}
    />
  );
});
ScrollAreaScrollbarY.displayName = SCROLLBAR_Y_NAME;

/* -------------------------------------------------------------------------------------------------
 * ScrollAreaTrack
 * -----------------------------------------------------------------------------------------------*/

const TRACK_DEFAULT_TAG = 'div';
const TRACK_NAME = 'ScrollArea.Track';
type ScrollAreaTrackDOMProps = React.ComponentPropsWithoutRef<typeof TRACK_DEFAULT_TAG>;
type ScrollAreaTrackOwnProps = {};
type ScrollAreaTrackProps = ScrollAreaTrackDOMProps & ScrollAreaTrackOwnProps;

const ScrollAreaTrack = forwardRefWithAs<typeof TRACK_DEFAULT_TAG, ScrollAreaTrackProps>(
  function ScrollAreaTrack(props, forwardedRef) {
    const { as: Comp = TRACK_DEFAULT_TAG, onPointerDown: onPointerDownProp, ...domProps } = props;
    const { axis, scrollAnimationQueue } = useScrollbarContext(TRACK_NAME);
    const dispatch = useDispatchContext(TRACK_NAME);
    const refsContext = useScrollAreaRefs(TRACK_NAME);
    const { trackClickBehavior, prefersReducedMotion } = useScrollAreaContext(TRACK_NAME);
    const { positionRef } = refsContext;
    const trackRef = getTrackRef(axis, refsContext);
    const thumbRef = getThumbRef(axis, refsContext);
    const ref = useComposedRefs(trackRef, forwardedRef);

    const onPointerDown = useCallbackRef(onPointerDownProp);

    useBorderBoxResizeObserver(trackRef, (size: ResizeObserverSize) => {
      dispatch({
        type: ScrollAreaEvents.HandleTrackResize,
        width: size.inlineSize,
        height: size.blockSize,
        axis,
      });
    });
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

    return <Comp {...getPartDataAttrObj(TRACK_NAME)} ref={ref} {...domProps} data-axis={axis} />;
  }
);

ScrollAreaTrack.displayName = TRACK_NAME;

/* -------------------------------------------------------------------------------------------------
 * ScrollAreaThumb
 * -----------------------------------------------------------------------------------------------*/

const THUMB_DEFAULT_TAG = 'div';
const THUMB_NAME = 'ScrollArea.Thumb';
type ScrollAreaThumbDOMProps = React.ComponentPropsWithoutRef<typeof THUMB_DEFAULT_TAG>;
type ScrollAreaThumbOwnProps = {};
type ScrollAreaThumbProps = ScrollAreaThumbDOMProps & ScrollAreaThumbOwnProps;

const ScrollAreaThumb = forwardRefWithAs<typeof THUMB_DEFAULT_TAG, ScrollAreaThumbProps>(
  function ScrollAreaThumb(props, forwardedRef) {
    const { as: Comp = THUMB_DEFAULT_TAG, onPointerDown: onPointerDownProp, ...domProps } = props;
    const { axis } = useScrollbarContext(THUMB_NAME);
    const refsContext = useScrollAreaRefs(THUMB_NAME);
    const dispatch = useDispatchContext(THUMB_NAME);
    const { positionRef } = refsContext;
    const thumbRef = getThumbRef(axis, refsContext);
    const trackRef = getTrackRef(axis, refsContext);
    const ref = useComposedRefs(thumbRef, forwardedRef);
    const stateContext = useScrollAreaStateContext();
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

    // We need a stable reference to the track size so that changes don't detach the mousemove
    // listener while the user is moving the thumb.
    const trackSize =
      axis === 'x' ? stateContext.domSizes.trackX.width : stateContext.domSizes.trackY.height;
    const trackSizeRef = React.useRef(trackSize);
    useLayoutEffect(() => {
      trackSizeRef.current = trackSize;
    });

    React.useEffect(() => {
      const thumbElement = thumbRef.current!;
      const trackElement = trackRef.current!;
      const positionElement = refsContext.positionRef.current!;
      if (!thumbElement || !trackElement || !positionElement) {
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
        const delta = pointerPosition - pointerStartPointRef.current;
        const trackSize = trackSizeRef.current;

        if (canScroll(positionElement, { axis, delta })) {
          // Offset by the distance between the initial pointer's distance from the initial
          // position of the thumb
          const { positionStart: trackPosition } = trackInitialData.current;
          const { positionStart: thumbInitialPosition } = thumbInitialData.current;
          const pointerOffset = pointerInitialStartPointRef.current - thumbInitialPosition;

          const pointerPositionRelativeToTrack = Math.round(pointerPosition - trackPosition);
          const viewportRatioFromPointer =
            Math.round(((pointerPositionRelativeToTrack - pointerOffset) / trackSize) * 100) / 100;
          const scrollSize = getScrollSize(positionElement, { axis });
          const value = viewportRatioFromPointer * scrollSize;
          setScrollPosition(positionElement, { axis, value });

          // Reset the pointer start point for the next pointer movement
          pointerStartPointRef.current = pointerPosition;

          dispatch({ type: ScrollAreaEvents.StartThumbing });
        }
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
      refsContext,
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
        {...getPartDataAttrObj(THUMB_NAME)}
        ref={ref}
        {...domProps}
        data-axis={axis}
        style={{
          ...domProps.style,
          ...thumbStyles,
          // @ts-ignore
          ...(axis === 'x'
            ? {
                [SCROLL_AREA_CSS_PROPS.scrollbarThumbWillChange]: 'left',
                [SCROLL_AREA_CSS_PROPS.scrollbarThumbHeight]: '100%',
                [SCROLL_AREA_CSS_PROPS.scrollbarThumbWidth]: 'auto',
              }
            : {
                [SCROLL_AREA_CSS_PROPS.scrollbarThumbWillChange]: 'top',
                [SCROLL_AREA_CSS_PROPS.scrollbarThumbHeight]: 'auto',
                [SCROLL_AREA_CSS_PROPS.scrollbarThumbWidth]: '100%',
              }),
        }}
      />
    );
  }
);

ScrollAreaThumb.displayName = THUMB_NAME;

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

const ScrollAreaButton = forwardRefWithAs<typeof BUTTON_DEFAULT_TAG, ScrollAreaButtonInternalProps>(
  function ScrollAreaButton(props, forwardedRef) {
    const {
      as: Comp = BUTTON_DEFAULT_TAG,
      direction,
      name,
      onPointerDown: onPointerDownProp,
      ...domProps
    } = props;
    const { axis, scrollAnimationQueue } = useScrollbarContext(name);
    const dispatch = useDispatchContext(name);
    const refsContext = useScrollAreaRefs(name);
    const { prefersReducedMotion } = useScrollAreaContext(name);
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

const ScrollAreaButtonStart = forwardRefWithAs<
  typeof BUTTON_DEFAULT_TAG,
  ScrollAreaButtonStartProps
>(function ScrollAreaButtonStart(props, forwardedRef) {
  return (
    <ScrollAreaButton
      {...props}
      name={BUTTON_START_NAME}
      direction="start"
      {...getPartDataAttrObj(BUTTON_START_NAME)}
      ref={forwardedRef}
    />
  );
});

ScrollAreaButtonStart.displayName = BUTTON_START_NAME;

const ScrollAreaButtonEnd = forwardRefWithAs<typeof BUTTON_DEFAULT_TAG, ScrollAreaButtonEndProps>(
  function ScrollAreaButtonEnd(props, forwardedRef) {
    return (
      <ScrollAreaButton
        {...props}
        name={BUTTON_END_NAME}
        direction="end"
        {...getPartDataAttrObj(BUTTON_END_NAME)}
        ref={forwardedRef}
      />
    );
  }
);

ScrollAreaButtonEnd.displayName = BUTTON_END_NAME;

/* -------------------------------------------------------------------------------------------------
 * ScrollAreaCorner
 * -----------------------------------------------------------------------------------------------*/

const CORNER_DEFAULT_TAG = 'div';
const CORNER_NAME = 'ScrollArea.Corner';
type ScrollAreaCornerDOMProps = React.ComponentPropsWithoutRef<typeof CORNER_DEFAULT_TAG>;
type ScrollAreaCornerOwnProps = {};
type ScrollAreaCornerProps = ScrollAreaCornerDOMProps & ScrollAreaCornerOwnProps;

const ScrollAreaCornerImpl = forwardRefWithAs<typeof CORNER_DEFAULT_TAG, ScrollAreaCornerProps>(
  function ScrollAreaCornerImpl(props, forwardedRef) {
    const { as: Comp = CORNER_DEFAULT_TAG, ...domProps } = props;

    const { positionRef } = useScrollAreaRefs(CORNER_NAME);
    const dispatch = useDispatchContext(CORNER_NAME);
    const { dir } = useScrollAreaContext(CORNER_NAME);
    const { domSizes } = useScrollAreaStateContext();
    const isRTL = dir === 'rtl';

    const style: any = {
      // The resize handle is placed, by default, in the bottom right corner of the scroll area. In
      // RTL writing mode it should be placed on the bottom left. Vertical reading modes have no
      // impact on handle placement.
      [SCROLL_AREA_CSS_PROPS.cornerLeft]: isRTL ? 0 : 'unset',
      [SCROLL_AREA_CSS_PROPS.cornerRight]: isRTL ? 'unset' : 0,

      [SCROLL_AREA_CSS_PROPS.cornerHeight]: domSizes.scrollbarX.height
        ? domSizes.scrollbarX.height + 'px'
        : domSizes.scrollbarY.width
        ? domSizes.scrollbarY.width + 'px'
        : '16px',
      [SCROLL_AREA_CSS_PROPS.cornerWidth]: domSizes.scrollbarY.width
        ? domSizes.scrollbarY.width + 'px'
        : domSizes.scrollbarX.height
        ? domSizes.scrollbarX.height + 'px'
        : '16px',

      position: 'absolute',

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
    }, [dispatch, positionRef]);

    return (
      <Comp
        {...getPartDataAttrObj(CORNER_NAME)}
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

const ScrollAreaCorner = forwardRefWithAs<typeof CORNER_DEFAULT_TAG, ScrollAreaCornerProps>(
  function ScrollAreaCorner(props, forwardedRef) {
    return useNativeScrollArea() ? null : <ScrollAreaCornerImpl ref={forwardedRef} {...props} />;
  }
);
ScrollAreaCorner.displayName = CORNER_NAME;

/* ------------------------------------------------------------------------------------------------*/

export {
  ScrollArea,
  ScrollAreaViewport,
  ScrollAreaScrollbarX,
  ScrollAreaScrollbarY,
  ScrollAreaButtonStart,
  ScrollAreaButtonEnd,
  ScrollAreaTrack,
  ScrollAreaThumb,
  ScrollAreaCorner,
  SCROLL_AREA_CSS_PROPS,
};
export type {
  ScrollAreaProps,
  ScrollAreaViewportProps,
  ScrollAreaScrollbarXProps,
  ScrollAreaScrollbarYProps,
  ScrollAreaButtonStartProps,
  ScrollAreaButtonEndProps,
  ScrollAreaTrackProps,
  ScrollAreaThumbProps,
  ScrollAreaCornerProps,
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
