/// <reference types="resize-observer-browser" />

// This component is a progressive enhancement that will fallback to a staandard div with overflow:
// scroll for browsers that don't support features we rely on.

// Needs to support:
//  - ResizeObserver
//  - PointerEvents
//  - CSS scrollbar-width OR -webkit-scrollbar

import * as React from 'react';
import { clamp } from '@radix-ui/number';
import { composeEventHandlers } from '@radix-ui/primitive';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import { createContext } from '@radix-ui/react-context';
import { useCallbackRef } from '@radix-ui/react-use-callback-ref';
import { useLayoutEffect } from '@radix-ui/react-use-layout-effect';
import { getOwnerGlobals } from '@radix-ui/react-utils';
import { Primitive } from '@radix-ui/react-primitive';
import { bezier } from './bezier-easing';
import { Queue } from './queue';
import { useHover } from './useHover';

import type * as Polymorphic from '@radix-ui/react-polymorphic';

const SCROLL_AREA_CSS_PROPS_LIST = [
  'positionWidth',
  'positionHeight',
  'scrollbarXOffset',
  'scrollbarYOffset',
  'scrollbarXSize',
  'scrollbarYSize',
  'scrollbarThumbWillChange',
  'scrollbarThumbHeight',
  'scrollbarThumbWidth',
  'cornerLeft',
  'cornerRight',
  'cornerWidth',
  'cornerHeight',
] as const;
const SCROLL_AREA_CSS_PROPS = SCROLL_AREA_CSS_PROPS_LIST.reduce(reduceToCssProperties, {} as any);

enum ScrollAreaState {
  Idle = 'Idle',
  Thumbing = 'Thumbing',
  Tracking = 'Tracking',
  ButtonScrolling = 'ButtonScrolling',
}

enum ScrollAreaEvents {
  DeriveStateFromProps,
  HandleScrollAreaResize,
  HandleViewportResize,
  HandleScrollbarResize,
  HandleTrackResize,
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

const ROOT_NAME = 'ScrollArea';
const ROOT_DEFAULT_PROPS = {
  overflowX: 'auto',
  overflowY: 'auto',
  scrollbarVisibility: 'hover',
  scrollbarVisibilityRestTimeout: 600,
  dir: 'ltr',
  trackClickBehavior: 'relative',
  unstable_prefersReducedMotion: false,
} as const;

interface ScrollAreaRefs {
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
}

// Keeping refs in a separate context; should be a stable reference throughout the tree
const [ScrollAreaRefsProvider, useScrollAreaRefs] = createContext<ScrollAreaRefs>(ROOT_NAME);

interface ScrollAreaContextValue {
  dir?: TextDirection;
  overflowX: OverflowBehavior;
  overflowY: OverflowBehavior;
  prefersReducedMotion: boolean;
  scrollbarVisibility: ScrollbarVisibility;
  scrollbarVisibilityRestTimeout: number;
  trackClickBehavior: TrackClickBehavior;
  onScroll: React.ComponentProps<'div'>['onScroll'];
  isHovered: boolean;
}

const [ScrollAreaProvider, useScrollAreaContext] = createContext<ScrollAreaContextValue>(ROOT_NAME);

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

const [DispatchProvider, useDispatchContext] = createContext<{
  dispatch: React.Dispatch<ScrollAreaEvent>;
}>(ROOT_NAME);

/* -------------------------------------------------------------------------------------------------
 * ScrollArea
 * -----------------------------------------------------------------------------------------------*/

type ScrollAreaOwnProps = Polymorphic.Merge<
  Polymorphic.OwnProps<typeof Primitive>,
  {
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
     * Describes the nature of scrollbar visibility, similar to how the scrollbar preferences in MacOS
     * control visibility of native scrollbars.
     * - `"always"`: Scrollbars are always visible when content is overflowing
     * - `"scroll"`: Scrollbars are visible when the user is scrolling along its corresponding axis
     * - `"hover"`: Scrollbars are visible when the user is scrolling along its corresponding axis and
     *   when the user is hovering over scrollable area
     *
     * (default: `"hover"`)
     */
    scrollbarVisibility?: ScrollbarVisibility;
    /**
     * If `scrollbarVisibility` is set to either `"scroll"`, this prop determines the length of time,
     * in milliseconds, before the scrollbars are hidden after the user stops interacting with
     * scrollbars.
     *
     * (default: 600)
     */
    scrollbarVisibilityRestTimeout?: number;
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
    dir?: TextDirection;
  }
>;

type ScrollAreaPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof Primitive>,
  ScrollAreaOwnProps
>;

const ScrollArea = React.forwardRef(function ScrollArea(props, forwardedRef) {
  const { unstable_forceNative: forceNative = false, ...restProps } = {
    ...ROOT_DEFAULT_PROPS,
    ...props,
  };
  const [usesNative, setUsesNative] = React.useState(true);
  // Check to make sure the user's browser supports our custom scrollbar features. We use a layout
  // effect here to avoid a visible flash when the custom scroll area replaces the native version.
  useLayoutEffect(() => {
    setUsesNative(forceNative || shouldFallbackToNativeScroll());
  }, [forceNative]);

  const ScrollAreaCustomOrNative = usesNative ? ScrollAreaNative : ScrollAreaImpl;

  const positionRef = React.useRef<HTMLDivElement>(null);
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);

  useExtendedScrollAreaRef(forwardedRef as any, scrollAreaRef, positionRef);

  return (
    <NativeScrollContext.Provider value={usesNative}>
      <ScrollAreaCustomOrNative
        positionRef={positionRef}
        scrollAreaRef={scrollAreaRef}
        {...restProps}
        ref={forwardedRef}
      />
    </NativeScrollContext.Provider>
  );
}) as ScrollAreaPrimitive;

type ScrollAreaNoNativeFallbackOwnProps = Polymorphic.Merge<
  Polymorphic.OwnProps<typeof Primitive>,
  Omit<ScrollAreaOwnProps, 'unstable_forceNative'>
>;

type ScrollAreaNoNativeFallbackPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof Primitive>,
  ScrollAreaNoNativeFallbackOwnProps
>;

const ScrollAreaNoNativeFallback = React.forwardRef(function ScrollArea(props, forwardedRef) {
  const restProps = {
    ...ROOT_DEFAULT_PROPS,
    ...props,
  };
  const positionRef = React.useRef<HTMLDivElement>(null);
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);
  return (
    <NativeScrollContext.Provider value={false}>
      <ScrollAreaImpl
        positionRef={positionRef}
        scrollAreaRef={scrollAreaRef}
        {...restProps}
        ref={forwardedRef}
      />
    </NativeScrollContext.Provider>
  );
}) as ScrollAreaNoNativeFallbackPrimitive;

type ScrollAreaInternalProps = {
  positionRef: React.RefObject<HTMLDivElement>;
  scrollAreaRef: React.RefObject<HTMLDivElement>;
};

type ScrollAreaNativeOwnProps = Polymorphic.Merge<
  Polymorphic.OwnProps<typeof Primitive>,
  (ScrollAreaInternalProps & Omit<ScrollAreaOwnProps, 'unstable_forceNative'>) & {
    overflowX: NonNullable<ScrollAreaOwnProps['overflowX']>;
    overflowY: NonNullable<ScrollAreaOwnProps['overflowY']>;
  }
>;

type ScrollAreaNativePrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof Primitive>,
  ScrollAreaNativeOwnProps
>;

const ScrollAreaNative = React.forwardRef(function ScrollAreaNative(props, forwardedRef) {
  const {
    overflowX,
    overflowY,
    scrollbarVisibility,
    scrollbarVisibilityRestTimeout,
    trackClickBehavior,
    unstable_prefersReducedMotion,
    scrollAreaRef,
    positionRef,
    ...domProps
  } = { ...ROOT_DEFAULT_PROPS, ...props };

  const ref = useComposedRefs(scrollAreaRef, forwardedRef);

  return (
    <Primitive
      {...domProps}
      ref={ref}
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
}) as ScrollAreaNativePrimitive;

type ScrollAreaImplProps = Polymorphic.Merge<
  Polymorphic.OwnProps<typeof Primitive>,
  ScrollAreaInternalProps & Omit<ScrollAreaOwnProps, 'unstable_forceNative'>
>;

type ScrollAreaImplPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof Primitive>,
  ScrollAreaImplProps
>;

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

const ScrollAreaImpl = React.forwardRef(function ScrollAreaImpl(props, forwardedRef) {
  const {
    onScroll,
    overflowX,
    overflowY,
    scrollbarVisibility,
    scrollbarVisibilityRestTimeout,
    trackClickBehavior,
    unstable_prefersReducedMotion,
    positionRef,
    scrollAreaRef,
    ...domProps
  } = { ...ROOT_DEFAULT_PROPS, ...props };

  // That we call `onScroll` in the viewport component is an implementation detail that the
  // consumer probably shouldn't need to think about. Passing it down from the top means that the
  // event handler would work the same way in the native fallback as well.
  const handleScroll = useCallbackRef(onScroll);

  const buttonDownRef = React.useRef<HTMLDivElement>(null);
  const buttonLeftRef = React.useRef<HTMLDivElement>(null);
  const buttonRightRef = React.useRef<HTMLDivElement>(null);
  const buttonUpRef = React.useRef<HTMLDivElement>(null);
  const viewportRef = React.useRef<HTMLDivElement>(null);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const _prefersReducedMotion = usePrefersReducedMotion(scrollAreaRef);
  const prefersReducedMotion = unstable_prefersReducedMotion ?? _prefersReducedMotion;

  const [reducerState, dispatch] = React.useReducer(scrollAreaStateReducer, {
    ...initialState,
    scrollbarIsVisibleX: scrollbarVisibility === 'always',
    scrollbarIsVisibleY: scrollbarVisibility === 'always',
  });

  const {
    hoverProps: { onPointerEnter, onPointerLeave },
    isHovered,
  } = useHover();
  const ref = useComposedRefs(forwardedRef, scrollAreaRef);

  useBorderBoxResizeObserver(scrollAreaRef, (size, scrollAreaElement) => {
    const { ownerWindow } = getOwnerGlobals(scrollAreaRef);
    const scrollAreaComputedStyle = ownerWindow.getComputedStyle(scrollAreaElement);
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
    <DispatchProvider dispatch={dispatch}>
      <ScrollAreaRefsProvider {...refs}>
        <ScrollAreaProvider
          dir={props.dir}
          isHovered={isHovered}
          onScroll={handleScroll}
          overflowX={overflowX}
          overflowY={overflowY}
          prefersReducedMotion={prefersReducedMotion}
          scrollbarVisibility={scrollbarVisibility}
          scrollbarVisibilityRestTimeout={scrollbarVisibilityRestTimeout}
          trackClickBehavior={trackClickBehavior}
        >
          <ScrollAreaStateContext.Provider value={reducerState}>
            <Primitive
              {...domProps}
              ref={ref}
              style={{
                ...domProps.style,
                ...style,
              }}
              onPointerEnter={composeEventHandlers(props.onPointerEnter, onPointerEnter)}
              onPointerLeave={composeEventHandlers(props.onPointerLeave, onPointerLeave)}
            />
          </ScrollAreaStateContext.Provider>
        </ScrollAreaProvider>
      </ScrollAreaRefsProvider>
    </DispatchProvider>
  );
}) as ScrollAreaImplPrimitive;

/* -------------------------------------------------------------------------------------------------
 * ScrollAreaViewport
 * -----------------------------------------------------------------------------------------------*/

const VIEWPORT_NAME = 'ScrollAreaViewport';

type ScrollAreaViewportImplOwnProps = Polymorphic.OwnProps<typeof Primitive>;
type ScrollAreaViewportImplPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof Primitive>,
  ScrollAreaViewportImplOwnProps
>;

const ScrollAreaViewportImpl = React.forwardRef(function ScrollAreaViewportImpl(
  props,
  forwardedRef
) {
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
  const { dispatch } = useDispatchContext(VIEWPORT_NAME);
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
      data-radix-scroll-area-viewport-position=""
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
        data-radix-scroll-area-viewport-position-inner=""
        style={{
          // The browser won’t add right padding of the viewport when you scroll to the end of the
          // x axis if we put the scrollbar offset padding directly on the position element. We
          // get around this with an extra wrapper with `display: table`.
          // https://blog.alexandergottlieb.com/overflow-scroll-and-the-right-padding-problem-a-css-only-solution-6d442915b3f4
          display: 'table',
          width: '100%',
          paddingBottom: `var(${SCROLL_AREA_CSS_PROPS.scrollbarXOffset})`,
          paddingRight: `var(${SCROLL_AREA_CSS_PROPS.scrollbarYOffset})`,
        }}
      >
        <Primitive {...props} ref={ref} />
      </div>
    </div>
  );
}) as ScrollAreaViewportImplPrimitive;

type ScrollAreaViewportOwnProps = Polymorphic.OwnProps<typeof ScrollAreaViewportImpl>;
type ScrollAreaViewportPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof ScrollAreaViewportImpl>,
  ScrollAreaViewportOwnProps
>;

const ScrollAreaViewport = React.forwardRef(function ScrollAreaViewport(props, forwardedRef) {
  return useNativeScrollArea() ? (
    <Primitive {...props} ref={forwardedRef} />
  ) : (
    <ScrollAreaViewportImpl {...props} ref={forwardedRef} />
  );
}) as ScrollAreaViewportPrimitive;

ScrollAreaViewport.displayName = VIEWPORT_NAME;

/* -------------------------------------------------------------------------------------------------
 * ScrollAreaScrollbarX / ScrollAreaScrollbarY
 * -----------------------------------------------------------------------------------------------*/

const SCROLLBAR_X_NAME = 'ScrollAreaScrollbarX';
const SCROLLBAR_Y_NAME = 'ScrollAreaScrollbarY';

type ScrollAreaScrollbarOwnProps = Polymorphic.Merge<
  Polymorphic.OwnProps<typeof Primitive>,
  {
    axis: Axis;
    name: string;
  }
>;

type ScrollAreaScrollbarPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof Primitive>,
  ScrollAreaScrollbarOwnProps
>;

interface ScrollbarContextValue {
  axis: Axis;
  scrollAnimationQueue: Queue<any>;
}

const [ScrollbarProvider, useScrollbarContext] = createContext<ScrollbarContextValue>(
  'ScrollAreaScrollbar'
);

const ScrollAreaScrollbar = React.forwardRef(function ScrollAreaScrollbar(props, forwardedRef) {
  const { axis, name, onWheel, onPointerDown, onPointerUp, onPointerMove, ...domProps } = props;
  const { dispatch } = useDispatchContext(name);
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

  const timeoutId = React.useRef<any>();
  React.useEffect(() => {
    if (scrollbarIsVisible) {
      timeoutId.current = setTimeout(() => {
        dispatch({
          type: ScrollAreaEvents.SetScrollbarIsVisible,
          scrollbarVisibility,
          [axis]: false,
        });
      }, scrollbarVisibilityRestTimeout);
      return function () {
        clearTimeout(timeoutId.current);
      };
    }
  }, [axis, dispatch, scrollbarIsVisible, scrollbarVisibility, scrollbarVisibilityRestTimeout]);

  function resetInteractiveTimer() {
    clearTimeout(timeoutId.current);
    timeoutId.current = setTimeout(() => {
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
    clearTimeout(timeoutId.current);
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
    <ScrollbarProvider axis={axis} scrollAnimationQueue={scrollAnimationQueue}>
      <Primitive
        {...domProps}
        ref={ref}
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
    </ScrollbarProvider>
  );
}) as ScrollAreaScrollbarPrimitive;

type ScrollAreaScrollbarXOwnProps = Polymorphic.OwnProps<typeof Primitive>;
type ScrollAreaScrollbarXPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof Primitive>,
  ScrollAreaScrollbarXOwnProps
>;

const ScrollAreaScrollbarX = React.forwardRef(function ScrollAreaScrollbarX(props, forwardedRef) {
  const { domSizes } = useScrollAreaStateContext();
  return useNativeScrollArea() ? null : (
    <ScrollAreaScrollbar
      {...props}
      ref={forwardedRef}
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
}) as ScrollAreaScrollbarXPrimitive;

ScrollAreaScrollbarX.displayName = SCROLLBAR_X_NAME;

type ScrollAreaScrollbarYOwnProps = Polymorphic.OwnProps<typeof Primitive>;
type ScrollAreaScrollbarYPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof Primitive>,
  ScrollAreaScrollbarYOwnProps
>;

const ScrollAreaScrollbarY = React.forwardRef(function ScrollAreaScrollbarY(props, forwardedRef) {
  const { domSizes } = useScrollAreaStateContext();
  return useNativeScrollArea() ? null : (
    <ScrollAreaScrollbar
      {...props}
      ref={forwardedRef}
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
}) as ScrollAreaScrollbarYPrimitive;

ScrollAreaScrollbarY.displayName = SCROLLBAR_Y_NAME;

/* -------------------------------------------------------------------------------------------------
 * ScrollAreaTrack
 * -----------------------------------------------------------------------------------------------*/

const TRACK_NAME = 'ScrollAreaTrack';

type ScrollAreaTrackOwnProps = Polymorphic.OwnProps<typeof Primitive>;
type ScrollAreaTrackPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof Primitive>,
  ScrollAreaTrackOwnProps
>;

const ScrollAreaTrack = React.forwardRef(function ScrollAreaTrack(props, forwardedRef) {
  const { onPointerDown: onPointerDownProp, ...domProps } = props;
  const { axis, scrollAnimationQueue } = useScrollbarContext(TRACK_NAME);
  const { dispatch } = useDispatchContext(TRACK_NAME);
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
    let trackPointerDownTimeoutId: any = null;
    let trackPointerUpTimeoutId: any = null;

    const trackElement = getTrackElementFromRef(trackRef);
    const thumbElement = getThumbElementFromRef(thumbRef);
    const positionElement = getPositionElementFromRef(positionRef);
    const { ownerDocument } = getOwnerGlobals(positionRef);

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
        clearTimeout(trackPointerUpTimeoutId);

        if (trackClickBehavior === 'page') {
          dispatch({ type: ScrollAreaEvents.StartTracking });
          ownerDocument.addEventListener('pointermove', handlePointerMove);
          ownerDocument.addEventListener('pointerup', handlePointerUp);
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
          trackPointerDownTimeoutId = setTimeout(() => {
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
            clearTimeout(trackPointerDownTimeoutId!);
          }, 400);

          return function () {
            clearTimeout(trackPointerDownTimeoutId!);
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
          requestAnimationFrame(() => {
            thumbElement.dispatchEvent(thumbPointerDown);
          });
        }
      }
    );

    trackElement.addEventListener('pointerdown', handlePointerDown);
    return function () {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      cancelAnimationFrame(rafIdRef.current!);
      clearTimeout(trackPointerDownTimeoutId!);
      clearTimeout(trackPointerUpTimeoutId!);
      trackElement.removeEventListener('pointerdown', handlePointerDown);
      ownerDocument.removeEventListener('pointermove', handlePointerMove);
      ownerDocument.removeEventListener('pointerup', handlePointerUp);
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
        clearTimeout(trackPointerDownTimeoutId!);
        ownerDocument.removeEventListener('pointermove', handlePointerMove);
        scrollAnimationQueue.stop();
      }
    }

    function handlePointerUp(event: PointerEvent) {
      trackElement.releasePointerCapture(event.pointerId);
      clearTimeout(trackPointerDownTimeoutId!);
      ownerDocument.removeEventListener('pointermove', handlePointerMove);
      ownerDocument.removeEventListener('pointerup', handlePointerUp);
      scrollAnimationQueue.stop();
      dispatch({ type: ScrollAreaEvents.StopTracking });

      // Rapid clicks on the track will result in janky repeat animation if we stop the queue
      // immediately. Set a short timeout to make sure the user is finished clicking and then stop
      // the queue.
      trackPointerUpTimeoutId = setTimeout(() => {
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

  return <Primitive {...domProps} ref={ref} data-axis={axis} />;
}) as ScrollAreaTrackPrimitive;

ScrollAreaTrack.displayName = TRACK_NAME;

/* -------------------------------------------------------------------------------------------------
 * ScrollAreaThumb
 * -----------------------------------------------------------------------------------------------*/

const THUMB_NAME = 'ScrollAreaThumb';

type ScrollAreaThumbOwnProps = Polymorphic.OwnProps<typeof Primitive>;
type ScrollAreaThumbPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof Primitive>,
  ScrollAreaThumbOwnProps
>;

const ScrollAreaThumb = React.forwardRef(function ScrollAreaThumb(props, forwardedRef) {
  const { onPointerDown: onPointerDownProp, ...domProps } = props;
  const { axis } = useScrollbarContext(THUMB_NAME);
  const refsContext = useScrollAreaRefs(THUMB_NAME);
  const { dispatch } = useDispatchContext(THUMB_NAME);
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

    const thumbElement = getThumbElementFromRef(thumbRef);
    const trackElement = getTrackElementFromRef(trackRef);
    const positionElement = getPositionElementFromRef(positionRef);

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
    const thumbElement = getThumbElementFromRef(thumbRef);
    const trackElement = getTrackElementFromRef(trackRef);
    const positionElement = getPositionElementFromRef(positionRef);
    const { ownerDocument } = getOwnerGlobals(positionRef);

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
        ownerDocument.addEventListener('pointerup', handlePointerUp);
        ownerDocument.addEventListener('pointermove', handlePointerMove);
        dispatch({ type: ScrollAreaEvents.StartThumbing });
      }
    );

    thumbElement.addEventListener('pointerdown', handlePointerDown);
    return function () {
      thumbElement.removeEventListener('pointerdown', handlePointerDown);
      stopThumbing();
    };

    function stopThumbing() {
      ownerDocument.removeEventListener('pointermove', handlePointerMove);
      ownerDocument.removeEventListener('pointerup', handlePointerUp);
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
    positionRef,
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
    <Primitive
      {...domProps}
      ref={ref}
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
}) as ScrollAreaThumbPrimitive;

ScrollAreaThumb.displayName = THUMB_NAME;

/* -------------------------------------------------------------------------------------------------
 * ScrollAreaButtonStart / ScrollAreaButtonEnd
 * -----------------------------------------------------------------------------------------------*/

const BUTTON_START_NAME = 'ScrollAreaButtonStart';
const BUTTON_END_NAME = 'ScrollAreaButtonEnd';

// For directional scroll buttons, we emulate native Windows behavior as closely as possible. There,
// when a user presses a scroll button, the browser triggers 9 separate scroll events in ~16
// millisecond intervals, moving scrollTop by a short value with each scroll event. This array
// represents the differences between the element's scrollTop value at each of these intervals. I
// will likely rethink this approach tactically as it gets much more complicated for track clicks.
// We are concerned more about the bezier curve effect this creates vs. the actual values.
const BUTTON_SCROLL_TIME = 135;

type ScrollAreaButtonProps = Polymorphic.Merge<
  Polymorphic.OwnProps<typeof Primitive>,
  {
    direction: LogicalDirection;
    name: string;
  }
>;

type ScrollAreaButtonPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof Primitive>,
  ScrollAreaButtonProps
>;

const ScrollAreaButton = React.forwardRef(function ScrollAreaButton(props, forwardedRef) {
  const { direction, name, onPointerDown: onPointerDownProp, ...domProps } = props;
  const { axis, scrollAnimationQueue } = useScrollbarContext(name);
  const { dispatch } = useDispatchContext(name);
  const refsContext = useScrollAreaRefs(name);
  const { prefersReducedMotion } = useScrollAreaContext(name);
  const { positionRef } = refsContext;
  const buttonRef = getButtonRef(direction, axis, refsContext);
  const ref = useComposedRefs(buttonRef, forwardedRef);
  const rafIdRef = React.useRef<number>();
  const onPointerDown = useCallbackRef(onPointerDownProp);

  React.useEffect(() => {
    const buttonElement = getButtonElementFromRef(buttonRef, direction);
    const positionElement = getPositionElementFromRef(positionRef);
    const { ownerDocument } = getOwnerGlobals(positionRef);

    let buttonPointerDownTimeoutId: any;

    let buttonIntervalId: any = null;
    const handlePointerDown = composeEventHandlers(
      onPointerDown as any,
      function handlePointerDown(event: PointerEvent) {
        if (!isMainClick(event)) return;

        buttonElement.setPointerCapture(event.pointerId);
        ownerDocument.addEventListener('pointerup', handlePointerUp);
        ownerDocument.addEventListener('pointermove', handlePointerMove);
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
        buttonPointerDownTimeoutId = setTimeout(() => {
          if (prefersReducedMotion) {
            buttonIntervalId = setInterval(() => {
              if (canScroll(positionElement, { axis, delta })) {
                scrollBy(positionElement, { axis, value: 60 * delta });
              } else {
                clearInterval(buttonIntervalId);
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
          clearTimeout(buttonPointerDownTimeoutId!);
        }, 400);
      }
    );

    buttonElement.addEventListener('pointerdown', handlePointerDown);

    return function () {
      buttonElement.removeEventListener('pointerdown', handlePointerDown);
      ownerDocument.removeEventListener('pointerup', handlePointerUp);
      ownerDocument.removeEventListener('pointermove', handlePointerMove);
      clearTimeout(buttonPointerDownTimeoutId!);
      clearInterval(buttonIntervalId);
      // eslint-disable-next-line react-hooks/exhaustive-deps
      cancelAnimationFrame(rafIdRef.current!);
      dispatch({ type: ScrollAreaEvents.StopButtonPress });
    };

    /**
     * If a mouse pointer leaves the bounds of the button before the track pointer timeout has been
     * executed, we need to clear the timeout as if the pointer was released.
     * @param event
     */
    function handlePointerMove(event: PointerEvent) {
      if (event.pointerType === 'mouse' && pointerIsOutsideElement(event, buttonElement)) {
        clearTimeout(buttonPointerDownTimeoutId!);
        ownerDocument.removeEventListener('pointermove', handlePointerMove);
      }
    }

    function handlePointerUp(event: PointerEvent) {
      clearTimeout(buttonPointerDownTimeoutId!);
      clearInterval(buttonIntervalId);
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

  return <Primitive {...domProps} ref={ref} data-axis={axis} />;
}) as ScrollAreaButtonPrimitive;

type ScrollAreaButtonStartOwnProps = Omit<
  Polymorphic.OwnProps<typeof ScrollAreaButton>,
  'direction' | 'name'
>;

type ScrollAreaButtonStartPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof ScrollAreaButton>,
  ScrollAreaButtonStartOwnProps
>;

const ScrollAreaButtonStart = React.forwardRef(function ScrollAreaButtonStart(props, forwardedRef) {
  return (
    <ScrollAreaButton {...props} ref={forwardedRef} name={BUTTON_START_NAME} direction="start" />
  );
}) as ScrollAreaButtonStartPrimitive;

ScrollAreaButtonStart.displayName = BUTTON_START_NAME;

type ScrollAreaButtonEndOwnProps = Omit<
  Polymorphic.OwnProps<typeof ScrollAreaButton>,
  'direction' | 'name'
>;

type ScrollAreaButtonEndPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof ScrollAreaButton>,
  ScrollAreaButtonEndOwnProps
>;

const ScrollAreaButtonEnd = React.forwardRef(function ScrollAreaButtonEnd(props, forwardedRef) {
  return <ScrollAreaButton {...props} ref={forwardedRef} name={BUTTON_END_NAME} direction="end" />;
}) as ScrollAreaButtonEndPrimitive;

ScrollAreaButtonEnd.displayName = BUTTON_END_NAME;

/* -------------------------------------------------------------------------------------------------
 * ScrollAreaCorner
 * -----------------------------------------------------------------------------------------------*/

const CORNER_NAME = 'ScrollAreaCorner';

type ScrollAreaCornerImplOwnProps = Polymorphic.OwnProps<typeof Primitive>;
type ScrollAreaCornerImplPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof Primitive>,
  ScrollAreaCornerImplOwnProps
>;

const ScrollAreaCornerImpl = React.forwardRef(function ScrollAreaCornerImpl(props, forwardedRef) {
  const { positionRef } = useScrollAreaRefs(CORNER_NAME);
  const { dispatch } = useDispatchContext(CORNER_NAME);
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
      const { ownerWindow } = getOwnerGlobals(positionRef);
      const computedStyles = ownerWindow.getComputedStyle(positionRef.current);
      dispatch({
        type: ScrollAreaEvents.SetExplicitResize,
        value: computedStyles.resize as ResizeBehavior,
      });
    }
  }, [dispatch, positionRef]);

  return (
    <Primitive
      {...props}
      ref={forwardedRef}
      style={{
        ...props.style,
        ...style,
      }}
    />
  );
}) as ScrollAreaCornerImplPrimitive;

type ScrollAreaCornerOwnProps = Polymorphic.OwnProps<typeof ScrollAreaCornerImpl>;
type ScrollAreaCornerPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof ScrollAreaCornerImpl>,
  ScrollAreaCornerOwnProps
>;

const ScrollAreaCorner = React.forwardRef(function ScrollAreaCorner(props, forwardedRef) {
  return useNativeScrollArea() ? null : <ScrollAreaCornerImpl {...props} ref={forwardedRef} />;
}) as ScrollAreaCornerPrimitive;

ScrollAreaCorner.displayName = CORNER_NAME;

/* ------------------------------------------------------------------------------------------------*/

const Root = ScrollArea;
const Viewport = ScrollAreaViewport;
const ScrollbarX = ScrollAreaScrollbarX;
const ScrollbarY = ScrollAreaScrollbarY;
const ButtonStart = ScrollAreaButtonStart;
const ButtonEnd = ScrollAreaButtonEnd;
const Track = ScrollAreaTrack;
const Thumb = ScrollAreaThumb;
const Corner = ScrollAreaCorner;
const unstable_ScrollAreaNoNativeFallback = ScrollAreaNoNativeFallback;

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
  unstable_ScrollAreaNoNativeFallback,
  //
  Root,
  Viewport,
  ScrollbarX,
  ScrollbarY,
  ButtonStart,
  ButtonEnd,
  Track,
  Thumb,
  Corner,
  //
  SCROLL_AREA_CSS_PROPS,
};

/* -------------------------------------------------------------------------------------------------
   Utils
   ---------------------------------------------------------------------------------------------- */

function scrollAreaStateReducer(
  context: ScrollAreaReducerState,
  event: ScrollAreaEvent
): ScrollAreaReducerState {
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
      const computedStyle = event.scrollAreaComputedStyle;
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

// We don't expose the position element directly, so we should assume that if consumers want to
// do anything to the scroll position with imperative DOM APIs that those properties should
// target the positionRef's element. Unfortunately I don't think there's a good way to override
// the actual properties of a DOM node, so the solution here provides new properties
// ([prop]Intent) that users can target for imperative handling of the scroll position.
//
// NOTE: I don't think we can add these types properly with the current implementation of
// forwardRefWithAs, but I do think this will be incredibly useful. Should we consider removing
// this and exposing this functionality some other way? useImperativeHandle is super awkward
// anyway but this seemed like a reasonable approach for this particular challenge.
// Alternatively we could reconsider exposing the Position component, or we could allow users to
// pass their own positionRef with a prop.
function useExtendedScrollAreaRef(
  forwardedRef: React.Ref<any>,
  scrollAreaRef: React.RefObject<HTMLElement | null | undefined>,
  positionRef: React.RefObject<HTMLElement | null | undefined>
) {
  React.useImperativeHandle(forwardedRef, () => {
    const scrollAreaElement = scrollAreaRef.current!;
    const positionElement = positionRef.current;
    const elementToHandle = positionElement || scrollAreaElement;

    const handles = {
      scrollIntent(...args: Parameters<HTMLElement['scroll']>) {
        elementToHandle.scroll.call(elementToHandle, ...args);
      },
      scrollByIntent(...args: Parameters<HTMLElement['scrollBy']>) {
        elementToHandle.scrollBy.call(elementToHandle, ...args);
      },
      scrollIntoViewIntent(...args: Parameters<HTMLElement['scrollIntoView']>) {
        elementToHandle.scrollIntoView.call(elementToHandle, ...args);
      },
      scrollToIntent(...args: Parameters<HTMLElement['scrollTo']>) {
        elementToHandle.scrollTo.call(elementToHandle, ...args);
      },
      get scrollTopIntent() {
        return elementToHandle.scrollTop;
      },
      set scrollTopIntent(val: number) {
        elementToHandle.scrollTop = val;
      },
      get scrollLeftIntent() {
        return elementToHandle.scrollLeft;
      },
      set scrollLeftIntent(val: number) {
        elementToHandle.scrollLeft = val;
      },
      get scrollHeightIntent() {
        return elementToHandle.scrollHeight;
      },
      get scrollWidthIntent() {
        return elementToHandle.scrollWidth;
      },
      addScrollListener(...args: any[]) {
        // @ts-ignore
        elementToHandle.addEventListener('scroll', ...args);
      },
      removeScrollListener(...args: any[]) {
        // @ts-ignore
        elementToHandle.removeEventListener('scroll', ...args);
      },
    };

    return Object.assign(scrollAreaElement, handles);
  });
}

function useBorderBoxResizeObserver(
  ref: React.RefObject<HTMLElement>,
  callback: (size: ResizeObserverSize, targetElement: Element) => void
) {
  const onResize = useCallbackRef(callback);
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
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
    observer.observe?.(element);

    return function () {
      observer.disconnect();
    };
  }, [onResize, ref]);
}

function usePrefersReducedMotion(nodeRef: React.RefObject<Element>) {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

  React.useEffect(() => {
    const globalWindow = nodeRef.current?.ownerDocument.defaultView || window;

    function handleChange(event: MediaQueryListEvent) {
      setPrefersReducedMotion(!event.matches);
    }
    const mediaQueryList = globalWindow.matchMedia('(prefers-reduced-motion: no-preference)');
    mediaQueryList.addEventListener('change', handleChange);

    return () => {
      mediaQueryList.removeEventListener('change', handleChange);
    };
  }, [nodeRef]);

  return prefersReducedMotion;
}

/**
 * React hook for creating a value exactly once.
 * @see https://github.com/Andarist/use-constant
 */
function useConstant<ValueType>(fn: () => ValueType): ValueType {
  const ref = React.useRef<{ v: ValueType }>();
  if (!ref.current) {
    ref.current = { v: fn() };
  }
  return ref.current.v;
}

function animate({ duration, draw, timing, done, rafIdRef }: AnimationOptions) {
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
function getPagedDraw({
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

function getLongPagedDraw({
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

function getButtonRef(direction: LogicalDirection, axis: Axis, ctx: ScrollAreaRefs) {
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

function getScrollbarRef(axis: Axis, ctx: ScrollAreaRefs) {
  return axis === 'x' ? ctx.scrollbarXRef : ctx.scrollbarYRef;
}

function getThumbRef(axis: Axis, ctx: ScrollAreaRefs) {
  return axis === 'x' ? ctx.thumbXRef : ctx.thumbYRef;
}

function getTrackRef(axis: Axis, ctx: ScrollAreaRefs) {
  return axis === 'x' ? ctx.trackXRef : ctx.trackYRef;
}

function assertRequiredElement(element: any, error: string): asserts element is HTMLElement {
  if (element == null) {
    throw new Error(error);
  }
}

function getElementFromRef(
  ref: React.RefObject<HTMLElement | null | undefined>,
  error: string
): HTMLElement {
  const { current: element } = ref;
  assertRequiredElement(element, error);
  return element;
}

function getTrackElementFromRef(ref: React.RefObject<HTMLElement | null | undefined>): HTMLElement {
  return getElementFromRef(
    ref,
    `A ref for ${TRACK_NAME} was not placed as expected. ${TRACK_NAME} should always be used within a ${ROOT_NAME} component, and it should not be rendered conditionally.`
  );
}

function getThumbElementFromRef(ref: React.RefObject<HTMLElement | null | undefined>): HTMLElement {
  return getElementFromRef(
    ref,
    `A ref for ${THUMB_NAME} was not placed as expected. ${THUMB_NAME} should always be used within a ${ROOT_NAME} component, and it should not be rendered conditionally.`
  );
}

function getPositionElementFromRef(
  ref: React.RefObject<HTMLElement | null | undefined>
): HTMLElement {
  return getElementFromRef(
    ref,
    `A ref for an internal component in ${VIEWPORT_NAME} was not placed as expected. ${VIEWPORT_NAME} should always be used within a ${ROOT_NAME} component, and it should not be rendered conditionally.`
  );
}

function getButtonElementFromRef(
  ref: React.RefObject<HTMLElement | null | undefined>,
  direction: LogicalDirection
): HTMLElement {
  const name = direction === 'end' ? BUTTON_END_NAME : BUTTON_START_NAME;
  return getElementFromRef(
    ref,
    `A ref for ${name} was not placed as expected. ${name} should always be used within a ${ROOT_NAME} component, and it should not be rendered conditionally.`
  );
}

/**
 * Gets the distance of needed to move a scroll area when a the user holds the pointer down on a
 * track for and extended period of time, and the scroll handle jumps to the pointer.
 */
function getLongPagedScrollDistance({
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
function getPagedScrollDistance({
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

function getVisibleToTotalRatio(positionElement: HTMLElement, { axis }: { axis: Axis }) {
  const totalScrollSize = getScrollSize(positionElement, { axis });
  const visibleSize = getClientSize(positionElement, { axis });
  return visibleSize / totalScrollSize;
}

function getScrollPosition(element: Element, { axis }: { axis: Axis }) {
  return element[axis === 'x' ? 'scrollLeft' : 'scrollTop'];
}

function setScrollPosition(element: Element, { axis, value }: { axis: Axis; value: number }) {
  element[axis === 'x' ? 'scrollLeft' : 'scrollTop'] = value;
}

function getClientSize(element: Element, { axis }: { axis: Axis }) {
  return element[axis === 'x' ? 'clientWidth' : 'clientHeight'];
}

function getScrollSize(element: Element, { axis }: { axis: Axis }) {
  return element[axis === 'x' ? 'scrollWidth' : 'scrollHeight'];
}

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

function getLogicalRect(element: Element, { axis }: { axis: Axis }) {
  const {
    [axis]: coord,
    [axis === 'y' ? 'top' : 'left']: positionStart,
    [axis === 'y' ? 'bottom' : 'right']: positionEnd,
    [axis === 'y' ? 'height' : 'width']: size,
  } = element.getBoundingClientRect();
  return { coord, positionStart, positionEnd, size };
}

function getPointerPosition(event: PointerEvent): PointerPosition {
  return {
    x: event.clientX,
    y: event.clientY,
  };
}

function scrollBy(element: Element, { axis, value }: { axis: Axis; value: number }) {
  element[axis === 'x' ? 'scrollLeft' : 'scrollTop'] += value;
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

/**
 * Determines whether or not the user is scrolling towards the end or start of a scrollbar when they
 * click the track. Direction is determined by their click position in relation to the scroll thumb.
 * @param props
 */
function determineScrollDirectionFromTrackClick({
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

/**
 * Determines the new scroll position (scrollTop/scrollLeft depending on the axis) for the scroll
 * area based on a given distance we want to scroll.
 * @param props
 */
function getNewScrollPosition(
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

function getValuesFromSizeObjects(obj: Record<string, Size>) {
  const sizes: number[] = [];
  for (const k of Object.keys(obj)) {
    const o = obj[k];
    sizes.push(o.height, o.width);
  }
  return sizes;
}

function makeCssProperty(name: string) {
  const cssProp = name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  return `--radix-scroll-area-${cssProp}`;
}

function reduceToCssProperties(
  prev: Record<typeof SCROLL_AREA_CSS_PROPS_LIST[number], string>,
  cur: typeof SCROLL_AREA_CSS_PROPS_LIST[number]
): Record<typeof SCROLL_AREA_CSS_PROPS_LIST[number], string> {
  return {
    ...prev,
    [cur]: makeCssProperty(cur),
  };
}

function pointerIsOutsideElement(event: PointerEvent, element: Element, rect?: DOMRect) {
  rect = rect || element.getBoundingClientRect();
  const pos = getPointerPosition(event);
  return pos.x < rect.left || pos.x > rect.right || pos.y < rect.top || pos.y > rect.bottom;
}

function shouldOverflow(positionElement: HTMLElement, { axis }: { axis: Axis }) {
  return getVisibleToTotalRatio(positionElement, { axis }) < 1;
}

function canScroll(element: Element, { axis, delta }: { axis: Axis; delta: number }) {
  return !(
    delta === 0 || // No relevant directional change
    // Scroll area is already scrolled to the furthest possible point in the pointer movement's direction
    (delta < 0 && (axis === 'x' ? isScrolledToLeft : isScrolledToTop)(element)) ||
    (delta > 0 && (axis === 'x' ? isScrolledToRight : isScrolledToBottom)(element))
  );
}

function shouldFallbackToNativeScroll() {
  return !('ResizeObserver' in window && supportsCustomScrollbars());
}

function supportsCustomScrollbars() {
  if (!Boolean(globalThis?.document)) return false;
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

function getResizeObserverEntryBorderBoxSize(entry: ResizeObserverEntry): ResizeObserverSize {
  if ('borderBoxSize' in entry) {
    return Array.isArray(entry.borderBoxSize) ? entry.borderBoxSize[0] : entry.borderBoxSize;
  }

  // for browsers that don't support `borderBoxSize` we calculate a rect ourselves to get the
  // correct border box.
  const rect = (entry as ResizeObserverEntry).target.getBoundingClientRect();
  return {
    inlineSize: rect.width,
    blockSize: rect.height,
  };
}

function isMainClick(event: MouseEvent | PointerEvent) {
  return event.button === 0;
}

/* -------------------------------------------------------------------------------------------------
   Types
   ---------------------------------------------------------------------------------------------- */

type Axis = 'x' | 'y';
type Size = { width: number; height: number };
type LogicalDirection = 'start' | 'end';
type OverflowBehavior = 'auto' | 'hidden' | 'scroll' | 'visible';
type PointerPosition = { x: number; y: number };
type ResizeBehavior = 'none' | 'both' | 'horizontal' | 'vertical' | 'initial' | 'inherit';
type ScrollbarVisibility = 'always' | 'scroll' | 'hover';
type ScrollDirection = 'up' | 'down' | 'left' | 'right';
type TrackClickBehavior = 'page' | 'relative';

// prettier-ignore
type ScrollAreaEvent =
  | { type: ScrollAreaEvents.SetExplicitResize; value: ResizeBehavior }
  | { type: ScrollAreaEvents.HandleScrollAreaResize; width: number; height: number; scrollAreaComputedStyle: CSSStyleDeclaration }
  | { type: ScrollAreaEvents.HandleViewportResize; width: number; height: number }
  | { type: ScrollAreaEvents.HandleScrollbarResize; axis: Axis; width: number; height: number }
  | { type: ScrollAreaEvents.HandleTrackResize; axis: Axis; width: number; height: number }
  | { type: ScrollAreaEvents.StartTracking }
  | { type: ScrollAreaEvents.StopTracking }
  | { type: ScrollAreaEvents.StartThumbing }
  | { type: ScrollAreaEvents.StopThumbing }
  | { type: ScrollAreaEvents.StartButtonPress }
  | { type: ScrollAreaEvents.StopButtonPress }
  | { type: ScrollAreaEvents.SetContentOverflowing; x: boolean; y: boolean }
  | { type: ScrollAreaEvents.SetScrollbarIsVisible; scrollbarVisibility: ScrollbarVisibility; x?: boolean; y?: boolean; }

type ScrollAreaDomSizes = Record<
  'scrollArea' | 'viewport' | 'position' | 'scrollbarY' | 'scrollbarX' | 'trackY' | 'trackX',
  Size
>;

interface ScrollAreaReducerState {
  state: ScrollAreaState;
  explicitResize: ResizeBehavior;
  contentIsOverflowingX: boolean;
  contentIsOverflowingY: boolean;
  scrollbarIsVisibleX: boolean;
  scrollbarIsVisibleY: boolean;
  domSizes: ScrollAreaDomSizes;
}

interface AnimationOptions {
  duration: number;
  draw(progress: number): any;
  timing(frac: number): number;
  done?(): any;
  rafIdRef: React.MutableRefObject<number | undefined>;
}

type TextDirection = 'ltr' | 'rtl';
