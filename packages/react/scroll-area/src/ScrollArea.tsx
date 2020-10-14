// TODO: Reenable this rule, just keeping out the added noise for now.
// I've got some helpers defined that I haven't used just yet.
/* eslint-disable @typescript-eslint/no-unused-vars */

// This component is a progressive enhancement that will fallback to a staandard div with overflow:
// scroll for browsers that don't support features we rely on.

// Needs to support:
//  - ResizeObserver
//  - IntersectionObserver
//  - PointerEvents
//  - CSS scrollbar-width OR -webkit-scrollbar

// TODO: Implement resize handle
// TODO: Wrap event props with composeEventHandler

import React from 'react';
import {
  forwardRef,
  createContext,
  createStyleObj,
  useLayoutEffect,
  useComposedRefs,
  usePrefersReducedMotion,
  getOwnerGlobals,
  useConstant,
  useCallbackRef,
} from '@interop-ui/react-utils';
import {
  cssReset,
  isMainClick,
  Axis,
  getResizeObserverEntryBorderBoxSize,
} from '@interop-ui/utils';
import { bezier } from './bezier-easing';
import { Queue } from './queue';

const ROOT_DEFAULT_TAG = 'div';
const ROOT_NAME = 'ScrollArea';

// DOM property key map based on the scroll axis
// Should minify a bit better and hopefully make some repeated logic a bit simpler to follow.
const DOM_PROPS = {
  size: { x: 'width', y: 'height' },
  clientSize: { x: 'clientWidth', y: 'clientHeight' },
  scrollPos: { x: 'scrollLeft', y: 'scrollTop' },
  offsetPos: { x: 'offsetLeft', y: 'offsetTop' },
  pos: { x: 'left', y: 'top' },
} as const;

const CSS_PROPS = {
  scrollAreaWidth: '--interop-scroll-area-width',
  scrollAreaHeight: '--interop-scroll-area-height',
  positionWidth: '--interop-scroll-area-position-width',
  positionHeight: '--interop-scroll-area-position-height',
  scrollbarXOffset: '--interop-scroll-area-scrollbar-x-offset',
  scrollbarYOffset: '--interop-scroll-area-scrollbar-y-offset',
  scrollbarThumbWillChange: '--interop-scroll-area-scrollbar-thumb-will-change',
  scrollbarThumbHeight: '--interop-scroll-area-scrollbar-thumb-height',
  scrollbarThumbWidth: '--interop-scroll-area-scrollbar-thumb-width',
} as const;

// TODO: RTL language testing for horizontal scrolling

type ScrollAreaContextValue = {
  overflowX: OverflowBehavior;
  overflowY: OverflowBehavior;
  prefersReducedMotion: boolean;
  scrollAnimationQueue: Queue<any>;
};

type ScrollAreaRefs = {
  buttonUpRef: React.RefObject<HTMLDivElement>;
  buttonDownRef: React.RefObject<HTMLDivElement>;
  buttonLeftRef: React.RefObject<HTMLDivElement>;
  buttonRightRef: React.RefObject<HTMLDivElement>;
  positionRef: React.RefObject<HTMLDivElement>;
  scrollAreaRef: React.RefObject<HTMLDivElement>;
  scrollbarYThumbRef: React.RefObject<HTMLDivElement>;
  scrollbarXThumbRef: React.RefObject<HTMLDivElement>;
};

const [ScrollAreaContext, useScrollAreaContext] = createContext<ScrollAreaContextValue>(
  ROOT_NAME + 'Context',
  ROOT_NAME
);

const [ScrollAreaRefsContext, useScrollAreaRefs] = createContext<ScrollAreaRefs>(
  ROOT_NAME + 'RefsContext',
  ROOT_NAME
);

// We render native scrollbars initially and switch to custom scrollbars after hydration if the
// user's browser supports the neccessary features. Many internal components will return `null` when
// using native scrollbars, so we keep implementation separate throughout and check support in this
// context during render.
const NativeScrollContext = React.createContext<boolean>(true);
const useNativeScrollArea = () => React.useContext(NativeScrollContext);

const DispatchContext = React.createContext<(event: ScrollAreaEvent) => void>(() => void null);
const useDispatchContext = () => React.useContext(DispatchContext);

/* -------------------------------------------------------------------------------------------------
 * ScrollArea
 * -----------------------------------------------------------------------------------------------*/

type ScrollAreaDOMProps = Omit<React.ComponentPropsWithoutRef<typeof ROOT_DEFAULT_TAG>, 'children'>;
type ScrollAreaOwnProps = {
  children: React.ReactNode;
  overflowX?: OverflowBehavior;
  overflowY?: OverflowBehavior;
  /**
   * Mostly here for debugging, but this might be useful for consumers
   */
  unstable_forceNative?: boolean;
};
type ScrollAreaProps = ScrollAreaDOMProps & ScrollAreaOwnProps;

const ScrollArea = forwardRef<typeof ROOT_DEFAULT_TAG, ScrollAreaProps, ScrollAreaStaticProps>(
  function ScrollArea(props, forwardedRef) {
    const {
      as: Comp = ROOT_DEFAULT_TAG,
      children,
      overflowX = 'auto',
      overflowY = 'auto',
      unstable_forceNative: forceNative = false,
      ...domProps
    } = props;

    // Animation effects triggered by button and track clicks are managed in a queue to prevent race
    // conditions and invalid DOM measurements when the user clicks faster than the animation is
    // able to be completed
    const scrollAnimationQueue = useConstant(() => new Queue<any>());

    const scrollAreaRef = React.useRef<HTMLDivElement>(null);
    const scrollbarYThumbRef = React.useRef<HTMLDivElement>(null);
    const scrollbarXThumbRef = React.useRef<HTMLDivElement>(null);

    const buttonRightRef = React.useRef<HTMLDivElement>(null);
    const buttonLeftRef = React.useRef<HTMLDivElement>(null);
    const buttonUpRef = React.useRef<HTMLDivElement>(null);
    const buttonDownRef = React.useRef<HTMLDivElement>(null);

    const positionRef = React.useRef<HTMLDivElement>(null);

    const prefersReducedMotion = usePrefersReducedMotion(scrollAreaRef);

    const [usesNative, setUsesNative] = React.useState(true);

    // This is a useReducer-esque dispatch function, but we aren't using React state for our logic
    // so we can opt-out of potentially expensive state comparisons in our events. This can probably
    // be better expressed as a state machine, but I wanted to keep the implementation as simple as
    // possible to start.
    const dispatch = React.useCallback(function dispatch(event: ScrollAreaEvent) {
      // We attach all refs to each dispatch event so that the reducer has access to (and can
      // update) their current values
      const refs: ScrollAreaRefs = {
        buttonLeftRef,
        buttonRightRef,
        buttonUpRef,
        buttonDownRef,
        positionRef,
        scrollAreaRef,
        scrollbarYThumbRef,
        scrollbarXThumbRef,
      };

      eventManager({
        ...event,
        // @ts-ignore
        refs,
      });
    }, []);

    const ctx: ScrollAreaContextValue = React.useMemo(() => {
      return {
        overflowX,
        overflowY,
        prefersReducedMotion,
        scrollAnimationQueue,
      };
    }, [overflowX, overflowY, prefersReducedMotion, scrollAnimationQueue]);

    const refsContext: ScrollAreaRefs = React.useMemo(() => {
      return {
        buttonLeftRef,
        buttonRightRef,
        buttonUpRef,
        buttonDownRef,
        positionRef,
        scrollAreaRef,
        scrollbarYThumbRef,
        scrollbarXThumbRef,
      };
    }, []);

    // Check to make sure the user's browser supports our custom scrollbar features. We use a layout
    // effect here to avoid a visible flash when the custom scrollarea replaces the native version.
    useLayoutEffect(() => {
      const { win } = getOwnerGlobals(scrollAreaRef);
      setUsesNative(forceNative || shouldFallbackToNativeScroll(win));
    }, [forceNative]);

    // Set initial values for CSS properties so they are defined in all circumstances. This is a bit
    // more resiliant than leaving them undefined so we can still use them in CSS functions like
    // `calc` or `max`.
    useLayoutEffect(() => {
      dispatch({ type: 'UNSET_CSS_VARS' });
    }, [dispatch]);

    // Observe the scroll area for changes and update computation variables used for components in
    // the sub-tree.
    useLayoutEffect(() => {
      if (usesNative) return;

      const scrollAreaEl = scrollAreaRef.current!;
      if (!scrollAreaEl) {
        return;
      }

      const observer = new ResizeObserver((entries) => {
        // No need to loop, we're only observing a single element.
        const entry = entries[0];
        const borderBoxSize = getResizeObserverEntryBorderBoxSize(entry);
        dispatch({
          type: 'HANDLE_SCROLL_AREA_RESIZE',
          width: borderBoxSize.inlineSize,
          height: borderBoxSize.blockSize,
        });
      });
      observer.observe(scrollAreaEl);

      return function () {
        observer.disconnect();
      };
    }, [usesNative, dispatch]);

    // Listen to scroll events and update the thumb's positioning accordingly. This also adds a data
    // attribute to the body element so an app can know when a scrollarea is active so we can
    // disable pointer events on all other elements on the screen until scrolling stops.
    useLayoutEffect(() => {
      if (usesNative) return;

      const scrollAreaEl = scrollAreaRef.current!;
      const positionEl = positionRef.current!;

      if (!scrollAreaEl || !positionEl) {
        // TODO: dev warnings, these parts are all required
        return;
      }

      // Scroll listeners can be expensive, and something outside of our control may scroll content
      // while it's out of view. We only need to respond to those events when a scroll area is
      // visibile in the viewport.
      const observer = new IntersectionObserver(
        function handleScrollAreaViewChange(entries) {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              positionEl.addEventListener('scroll', handleScroll);
              handleScroll();
              return;
            }
            // Scroll area not in view, clean up scroll listener
            positionEl.removeEventListener('scroll', handleScroll);
          });
        },
        {
          root: null,
          rootMargin: '0px',
          threshold: [0, 1],
        }
      );

      handleScroll();
      observer.observe(scrollAreaEl);

      return function cleanup() {
        observer.disconnect();
        positionEl.removeEventListener('scroll', handleScroll);
        dispatch({ type: 'REMOVE_SCROLLING_ATTRIBUTES' });
      };

      function handleScroll() {
        dispatch({ type: 'UPDATE_THUMBS' });
      }
    }, [usesNative, dispatch]);

    // NOTE: experiemtal, ignore for now plz!
    React.useImperativeHandle(forwardedRef, () => ({
      ...scrollAreaRef.current!,
      set scrollTop(val: number) {
        if (positionRef.current) {
          positionRef.current.scrollTop = val;
        }
      },
      get scrollTop() {
        return positionRef.current!.scrollTop;
      },
    }));

    const ref = useComposedRefs(scrollAreaRef, forwardedRef);

    // TODO: Remove
    const count = React.useRef(0);
    React.useEffect(() => {
      console.log('re-rendered ', count.current++);
    });

    return (
      <NativeScrollContext.Provider value={usesNative}>
        <ScrollAreaRefsContext.Provider value={refsContext}>
          <ScrollAreaContext.Provider value={ctx}>
            <DispatchContext.Provider value={dispatch}>
              <Comp
                {...interopDataAttrObj('root')}
                ref={ref}
                {...domProps}
                style={
                  // For native fallback, the scrollarea wrapper itself is scrollable rather than
                  // the position element.
                  usesNative
                    ? {
                        ...domProps.style,
                        overflowX,
                        overflowY,
                      }
                    : domProps.style
                }
              >
                {children}
              </Comp>
            </DispatchContext.Provider>
          </ScrollAreaContext.Provider>
        </ScrollAreaRefsContext.Provider>
      </NativeScrollContext.Provider>
    );
  }
);

/* -------------------------------------------------------------------------------------------------
 * ScrollAreaPosition
 * -----------------------------------------------------------------------------------------------*/

const POSITION_DEFAULT_TAG = 'div';
const POSITION_NAME = 'ScrollArea.Position';
type ScrollAreaPositionDOMProps = React.ComponentPropsWithoutRef<typeof POSITION_DEFAULT_TAG>;
type ScrollAreaPositionOwnProps = {};
type ScrollAreaPositionProps = ScrollAreaPositionDOMProps & ScrollAreaPositionOwnProps;

const ScrollAreaPositionImpl = forwardRef<typeof POSITION_DEFAULT_TAG, ScrollAreaPositionProps>(
  function ScrollAreaPositionImpl(props, forwardedRef) {
    const { as: Comp = POSITION_DEFAULT_TAG, ...domProps } = props;
    const { positionRef } = useScrollAreaRefs(POSITION_NAME);
    const { overflowX, overflowY } = useScrollAreaContext(POSITION_NAME);
    const ref = useComposedRefs(positionRef, forwardedRef);
    return (
      <Comp
        {...interopDataAttrObj('position')}
        ref={ref}
        {...domProps}
        style={{
          ...domProps.style,
          overflowX,
          overflowY,
        }}
      />
    );
  }
);

const ScrollAreaPosition = forwardRef<typeof POSITION_DEFAULT_TAG, ScrollAreaPositionProps>(
  function ScrollAreaPosition(props, forwardedRef) {
    return useNativeScrollArea() ? (
      <React.Fragment>{props.children}</React.Fragment>
    ) : (
      <ScrollAreaPositionImpl ref={forwardedRef} {...props} />
    );
  }
);

/* -------------------------------------------------------------------------------------------------
 * ScrollAreaContentArea
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_AREA_DEFAULT_TAG = 'div';
const CONTENT_AREA_NAME = 'ScrollArea.ContentArea';
type ScrollAreaContentAreaDOMProps = React.ComponentPropsWithoutRef<
  typeof CONTENT_AREA_DEFAULT_TAG
>;
type ScrollAreaContentAreaOwnProps = {};
type ScrollAreaContentAreaProps = ScrollAreaContentAreaDOMProps & ScrollAreaContentAreaOwnProps;

const ScrollAreaContentArea = forwardRef<
  typeof CONTENT_AREA_DEFAULT_TAG,
  ScrollAreaContentAreaProps
>(function ScrollAreaContentArea(props, forwardedRef) {
  const { as: Comp = CONTENT_AREA_DEFAULT_TAG, ...domProps } = props;
  return <Comp {...interopDataAttrObj('contentArea')} ref={forwardedRef} {...domProps} />;
});

/* -------------------------------------------------------------------------------------------------
 * ScrollAreaScrollbarX / ScrollAreaScrollbarY
 * -----------------------------------------------------------------------------------------------*/

const SCROLLBAR_DEFAULT_TAG = 'div';
const SCROLLBAR_X_NAME = 'ScrollArea.ScrollbarX';
const SCROLLBAR_Y_NAME = 'ScrollArea.ScrollbarY';

type ScrollAreaScrollbarDOMProps = React.ComponentPropsWithoutRef<typeof SCROLLBAR_DEFAULT_TAG>;
type ScrollAreaScrollbarOwnProps = {};
type ScrollAreaScrollbarProps = ScrollAreaScrollbarDOMProps & ScrollAreaScrollbarOwnProps;

type ScrollbarContextValue = {
  axis: Axis;
};

type InternalScrollbarProps = ScrollAreaScrollbarProps & {
  axis: Axis;
};

const [ScrollbarContext, useScrollbarContext] = createContext<ScrollbarContextValue>(
  'ScrollbarContext',
  'ScrollAreaScrollbarImpl'
);

const ScrollAreaScrollbarImpl = forwardRef<typeof SCROLLBAR_DEFAULT_TAG, InternalScrollbarProps>(
  function ScrollAreaScrollbarImpl(props, forwardedRef) {
    const { as: Comp = SCROLLBAR_DEFAULT_TAG, axis, ...domProps } = props;

    const dispatch = useDispatchContext();
    const { scrollAreaRef } = useScrollAreaRefs(axis === 'x' ? SCROLLBAR_X_NAME : SCROLLBAR_Y_NAME);

    const ctx = React.useMemo(() => ({ axis }), [axis]);
    const ownRef = React.useRef<HTMLDivElement>(null);
    const ref = useComposedRefs(ownRef, forwardedRef);

    useLayoutEffect(() => {
      const scrollAreaEl = scrollAreaRef.current!;
      const scrollbarEl = ownRef.current!;
      if (!scrollAreaEl || !scrollbarEl) {
        return;
      }

      const observer = new ResizeObserver((entries) => {
        // No need to loop, we're only observing a single element.
        const entry = entries[0];
        const borderBoxSize = getResizeObserverEntryBorderBoxSize(entry);
        dispatch({
          type: 'HANDLE_SCROLLBAR_AREA_RESIZE',
          width: borderBoxSize.inlineSize,
          height: borderBoxSize.blockSize,
          axis,
        });
      });
      observer.observe(scrollbarEl);
    }, [scrollAreaRef, axis, dispatch]);

    return (
      <ScrollbarContext.Provider value={ctx}>
        <Comp ref={ref} {...domProps} />
      </ScrollbarContext.Provider>
    );
  }
);

type ScrollAreaScrollbarXProps = ScrollAreaScrollbarProps;

const ScrollAreaScrollbarX = forwardRef<typeof SCROLLBAR_DEFAULT_TAG, ScrollAreaScrollbarXProps>(
  function ScrollAreaScrollbarX(props, forwardedRef) {
    return useNativeScrollArea() ? null : (
      <ScrollAreaScrollbarImpl
        {...interopDataAttrObj('scrollBarX')}
        ref={forwardedRef}
        {...props}
        axis="x"
      />
    );
  }
);

type ScrollAreaScrollbarYProps = ScrollAreaScrollbarProps;

const ScrollAreaScrollbarY = forwardRef<typeof SCROLLBAR_DEFAULT_TAG, ScrollAreaScrollbarYProps>(
  function ScrollAreaScrollbarY(props, forwardedRef) {
    return useNativeScrollArea() ? null : (
      <ScrollAreaScrollbarImpl
        {...interopDataAttrObj('scrollBarY')}
        ref={forwardedRef}
        {...props}
        axis="y"
      />
    );
  }
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
    const { axis } = useScrollbarContext(TRACK_NAME);
    const { scrollAnimationQueue, prefersReducedMotion } = useScrollAreaContext(TRACK_NAME);
    const dispatch = useDispatchContext();
    const refsContext = useScrollAreaRefs(TRACK_NAME);
    const { scrollAreaRef, positionRef } = refsContext;
    const thumbRef = getThumbRef(axis, refsContext);

    const ownRef = React.useRef<HTMLDivElement>(null);
    const ref = useComposedRefs(ownRef, forwardedRef);

    React.useEffect(() => {
      let trackPointerDownTimeoutId: number | null = null;
      let stopAnimationRaf: number;
      const { doc, win } = getOwnerGlobals(scrollAreaRef);
      const positionEl = positionRef.current!;
      const trackEl = ownRef.current!;
      const scrollAreaEl = scrollAreaRef.current!;
      const thumbEl = thumbRef.current!;

      if (!positionEl || !trackEl || !scrollAreaEl || !thumbEl) {
        // TODO: dev warnings
        return;
      }

      trackEl.addEventListener('pointerdown', handlePointerDown);
      return function () {
        trackEl.removeEventListener('pointerdown', handlePointerDown);
        doc.removeEventListener('pointerup', handlePointerUp);
        win.cancelAnimationFrame(stopAnimationRaf);
      };

      function handlePointerDown(event: PointerEvent) {
        if (!isMainClick(event)) return;

        const direction = determineScrollDirectionFromTrackClick({ event, axis, thumbEl });

        dispatch({ type: 'ADD_SCROLLING_ATTRIBUTES' });
        trackEl.setPointerCapture(event.pointerId);
        doc.addEventListener('pointerup', handlePointerUp);

        if (prefersReducedMotion) {
          dispatch({ type: 'SCROLL_BY_PAGE_IMMEDIATELY', axis, direction });
        } else {
          dispatch({
            type: 'SCROLL_BY_PAGE_QUEUE_ANIMATION',
            axis,
            direction,
            scrollAnimationQueue,
          });
        }

        // TODO: After some time (~400ms?), if the user still has the pointer down we'll start to
        //       scroll further to some relative distance near the pointer in relation to the track.
        trackPointerDownTimeoutId = win.setTimeout(() => {
          dispatch({
            type: 'SCROLL_RELATIVE_TO_POINTER_ON_TRACK',
            axis,
            direction,
            pointerPosition: getPointerPosition(event),
          });
          win.clearTimeout(trackPointerDownTimeoutId!);
        }, 400);

        return function () {
          win.clearTimeout(trackPointerDownTimeoutId!);
          win.cancelAnimationFrame(stopAnimationRaf!);
        };
      }

      function handlePointerUp(event: PointerEvent) {
        dispatch({ type: 'REMOVE_SCROLLING_ATTRIBUTES' });
        trackEl && trackEl.releasePointerCapture(event.pointerId);
        win.clearTimeout(trackPointerDownTimeoutId!);
        doc.removeEventListener('pointerup', handlePointerUp);

        // After the user has stopped clicking the track, we wan't to stop any queued animations
        // from further updating the scroll position (after the current animation is finished).
        stopAnimationRaf = win.requestAnimationFrame(
          scrollAnimationQueue.stop.bind(scrollAnimationQueue)
        );
      }
    }, [
      axis,
      prefersReducedMotion,

      // these references should be stable
      dispatch,
      positionRef,
      scrollAnimationQueue,
      scrollAreaRef,
      thumbRef,
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
    const { axis } = useScrollbarContext(THUMB_NAME);
    const refsContext = useScrollAreaRefs(THUMB_NAME);
    const { scrollAreaRef, positionRef } = refsContext;
    const thumbRef = getThumbRef(axis, refsContext);
    const ref = useComposedRefs(thumbRef || null, forwardedRef);
    const dispatch = useDispatchContext();
    const pointerStartPointRef = React.useRef<number>(0);

    React.useEffect(
      () => {
        const { doc } = getOwnerGlobals(scrollAreaRef);
        const positionEl = positionRef.current!;
        const thumbEl = thumbRef.current!;
        const scrollAreaEl = scrollAreaRef.current!;

        if (!thumbEl || !positionEl || !scrollAreaEl) {
          return;
        }

        thumbEl.addEventListener('pointerdown', handlePointerDown);
        return function () {
          dispatch({ type: 'REMOVE_SCROLLING_ATTRIBUTES' });
          thumbEl.removeEventListener('pointerdown', handlePointerDown);
          doc.removeEventListener('pointermove', handlePointerMove);
          doc.removeEventListener('pointerup', handlePointerUp);
        };

        function handlePointerDown(event: PointerEvent) {
          if (!isMainClick(event)) return;

          event.stopPropagation();

          const pointerPosition = getPointerPosition(event)[axis];
          dispatch({ type: 'ADD_SCROLLING_ATTRIBUTES' });
          pointerStartPointRef.current = pointerPosition;
          thumbEl.setPointerCapture(event.pointerId);
          doc.addEventListener('pointerup', handlePointerUp);
          doc.addEventListener('pointermove', handlePointerMove);
        }

        function handlePointerMove(event: PointerEvent) {
          const pointerPosition = getPointerPosition(event)[axis];
          dispatch({
            type: 'MOVE_THUMB_WITH_POINTER',
            axis,
            pointerPosition,
            pointerStartPointRef,
          });
        }

        function handlePointerUp(event: PointerEvent) {
          dispatch({ type: 'REMOVE_SCROLLING_ATTRIBUTES' });
          thumbEl && thumbEl.releasePointerCapture(event.pointerId);
          doc.removeEventListener('pointermove', handlePointerMove);
          doc.removeEventListener('pointerup', handlePointerUp);
        }
      },
      // All dependencies are refs we only need to setup/teardown if the axis changes for whatever
      // reason.
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [axis, dispatch]
    );

    // I don't think we'll ever reach this case, because if axis is invalid the parent scrollbar
    // will render null, and thumb should always be rendered inside of a scrollbar. Keeping for now
    // as an extra safeguard but consider removing.
    if (!thumbRef) {
      return null;
    }

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

function useScrollbarButton(
  direction: LogicalDirection,
  name: string,
  props: ScrollAreaButtonStartProps
) {
  const { axis } = useScrollbarContext(name);
  const actualDirection = getActualScrollDirection(direction, axis);
  const { prefersReducedMotion } = useScrollAreaContext(name);
  const refsContext = useScrollAreaRefs(name);
  const { positionRef, scrollAreaRef } = refsContext;
  const buttonRef = getButtonRef(actualDirection, refsContext);

  const dispatch = useDispatchContext();

  React.useEffect(() => {
    const { doc } = getOwnerGlobals(scrollAreaRef);
    const positionEl = positionRef.current!;
    const buttonEl = buttonRef.current!;
    const scrollAreaEl = scrollAreaRef.current!;
    let buttonPressCleanup: (() => void) | undefined;

    if (!positionEl || !buttonEl || !scrollAreaEl) {
      return;
    }

    buttonEl.addEventListener('pointerdown', handlePointerDown);
    return function () {
      buttonPressCleanup && buttonPressCleanup();
      buttonEl.removeEventListener('pointerdown', handlePointerDown);
      doc.removeEventListener('pointerup', handlePointerUp);
    };

    function scrollAfterButtonPress() {
      const delta = direction === 'start' ? -1 : 1;

      if (!canScroll({ element: positionEl, axis, delta })) {
        return () => void null;
      }

      // TODO: Clean up for better readability
      return prefersReducedMotion
        ? (() => {
            // dispatch({ type: 'SCROLL_AFTER_BUTTON_PRESS_IMMEDIATELY' });
            scrollBy({ element: positionEl, axis, value: 51 * delta });
            return () => void null;
          })()
        : animate({
            duration: BUTTON_SCROLL_TIME,
            timing: bezier(0.16, 0, 0.73, 1),
            draw(progress) {
              scrollBy({ element: positionEl, axis, value: progress * 15 * delta });
              // scrollPositionElement(progress * 15 * n);
            },
          });
    }

    function handlePointerDown(event: PointerEvent) {
      if (!isMainClick(event)) return;
      const start = performance.now();

      buttonEl.setPointerCapture(event.pointerId);
      doc.addEventListener('pointerup', handlePointerUp);
      dispatch({ type: 'ADD_SCROLLING_ATTRIBUTES' });
      buttonPressCleanup = scrollAfterButtonPress();

      // TODO: Handle case for user holding down the button, in which case
      // we will repeat the `scrollAfterButtonPress` call on a ~300 ms
      // interval until they release the pointer. Scrolling will
      // also need to pause if the pointer leaves the button, but
      // it should resume should they mouse back over it before releasing
      // the pointer.
    }

    function handlePointerUp(event: PointerEvent) {
      buttonEl && buttonEl.releasePointerCapture(event.pointerId);
      dispatch({ type: 'REMOVE_SCROLLING_ATTRIBUTES' });

      buttonEl.removeEventListener('pointerup', handlePointerUp);
    }
  }, [axis, buttonRef, direction, dispatch, positionRef, prefersReducedMotion, scrollAreaRef]);

  // @ts-ignore
  const { as, ...restProps } = props;
  const buttonProps = { ...restProps, 'data-axis': axis };

  return {
    buttonRef,
    buttonProps,
  };
}

type ScrollAreaButtonStartProps = ScrollAreaButtonProps;

const ScrollAreaButtonStart = forwardRef<typeof BUTTON_DEFAULT_TAG, ScrollAreaButtonStartProps>(
  function ScrollAreaButtonStart(props, forwardedRef) {
    const { as: Comp = BUTTON_DEFAULT_TAG } = props;
    const { buttonRef, buttonProps } = useScrollbarButton('start', BUTTON_START_NAME, props);
    const ref = useComposedRefs(buttonRef, forwardedRef);
    return <Comp {...interopDataAttrObj('buttonStart')} ref={ref} {...buttonProps} />;
  }
);

type ScrollAreaButtonEndProps = ScrollAreaButtonProps;

const ScrollAreaButtonEnd = forwardRef<typeof BUTTON_DEFAULT_TAG, ScrollAreaButtonEndProps>(
  function ScrollAreaButtonEnd(props, forwardedRef) {
    const { as: Comp = BUTTON_DEFAULT_TAG } = props;
    const { buttonRef, buttonProps } = useScrollbarButton('end', BUTTON_END_NAME, props);
    const ref = useComposedRefs(buttonRef, forwardedRef);
    return <Comp {...interopDataAttrObj('buttonEnd')} ref={ref} {...buttonProps} />;
  }
);

/* -------------------------------------------------------------------------------------------------
 * ScrollAreaResizeHandle
 * -----------------------------------------------------------------------------------------------*/

const RESIZE_HANDLE_DEFAULT_TAG = 'div';
const RESIZE_HANDLE_NAME = 'ScrollArea.ResizeHandle';
type ScrollAreaResizeHandleDOMProps = React.ComponentPropsWithoutRef<
  typeof RESIZE_HANDLE_DEFAULT_TAG
>;
type ScrollAreaResizeHandleOwnProps = {};
type ScrollAreaResizeHandleProps = ScrollAreaResizeHandleDOMProps & ScrollAreaResizeHandleOwnProps;

const ScrollAreaResizeHandle = forwardRef<
  typeof RESIZE_HANDLE_DEFAULT_TAG,
  ScrollAreaResizeHandleProps
>(function ScrollAreaResizeHandle(props, forwardedRef) {
  const { as: Comp = RESIZE_HANDLE_DEFAULT_TAG, ...domProps } = props;
  return <Comp {...interopDataAttrObj('resizeHandle')} ref={forwardedRef} {...domProps} />;
});

interface ScrollAreaStaticProps {
  Position: typeof ScrollAreaPosition;
  ContentArea: typeof ScrollAreaContentArea;
  ScrollbarX: typeof ScrollAreaScrollbarX;
  ScrollbarY: typeof ScrollAreaScrollbarY;
  Track: typeof ScrollAreaTrack;
  Thumb: typeof ScrollAreaThumb;
  ButtonStart: typeof ScrollAreaButtonStart;
  ButtonEnd: typeof ScrollAreaButtonEnd;
  ResizeHandle: typeof ScrollAreaResizeHandle;
}

ScrollArea.Position = ScrollAreaPosition;
ScrollArea.ContentArea = ScrollAreaContentArea;
ScrollArea.ScrollbarX = ScrollAreaScrollbarX;
ScrollArea.ScrollbarY = ScrollAreaScrollbarY;
ScrollArea.Track = ScrollAreaTrack;
ScrollArea.Thumb = ScrollAreaThumb;
ScrollArea.ButtonStart = ScrollAreaButtonStart;
ScrollArea.ButtonEnd = ScrollAreaButtonEnd;
ScrollArea.ResizeHandle = ScrollAreaResizeHandle;

ScrollArea.Position.displayName = POSITION_NAME;
ScrollArea.ContentArea.displayName = CONTENT_AREA_NAME;
ScrollArea.ScrollbarX.displayName = SCROLLBAR_X_NAME;
ScrollArea.ScrollbarY.displayName = SCROLLBAR_Y_NAME;
ScrollArea.Track.displayName = TRACK_NAME;
ScrollArea.Thumb.displayName = THUMB_NAME;
ScrollArea.ButtonStart.displayName = BUTTON_START_NAME;
ScrollArea.ButtonEnd.displayName = BUTTON_END_NAME;
ScrollArea.ResizeHandle.displayName = RESIZE_HANDLE_NAME;

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
  },
  position: {
    ...cssReset(POSITION_DEFAULT_TAG),
    zIndex: 1,
    width: `var(${CSS_PROPS.positionWidth})`,
    height: `var(${CSS_PROPS.positionHeight})`,
    paddingBottom: `var(${CSS_PROPS.scrollbarXOffset})`,
    paddingRight: `var(${CSS_PROPS.scrollbarYOffset})`,
    scrollbarWidth: 'none',
    overflowScrolling: 'touch',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
  contentArea: {
    ...cssReset(CONTENT_AREA_DEFAULT_TAG),
    zIndex: 1,
    position: 'relative',

    '&[data-dragging], &[data-scrolling]': {
      // Remove pointer events from the content area while dragging or scrolling
      pointerEvents: 'none !important',
    },
  },
  scrollBarX: {
    ...cssReset(SCROLLBAR_DEFAULT_TAG),
    ...commonScrollbarStyles,
    height: `16px`,
    left: 0,
    bottom: 0,
    right: 0,
    flexDirection: 'row',
  },
  scrollBarY: {
    ...cssReset(SCROLLBAR_DEFAULT_TAG),
    ...commonScrollbarStyles,
    width: '16px',
    right: 0,
    top: 0,
    bottom: 0,
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
  resizeHandle: {
    ...cssReset(RESIZE_HANDLE_DEFAULT_TAG),
  },
});

export { ScrollArea, styles };
export type {
  ScrollAreaProps,
  ScrollAreaPositionProps,
  ScrollAreaContentAreaProps,
  ScrollAreaScrollbarXProps,
  ScrollAreaScrollbarYProps,
  ScrollAreaButtonStartProps,
  ScrollAreaButtonEndProps,
  ScrollAreaTrackProps,
  ScrollAreaThumbProps,
};

/* ---------------------------------------------------------------------------------------------- */

function isScrolledToBottom(node: Element | null) {
  return !!(node && node.scrollTop === getMaxScrollTopValue(node));
}

function isScrolledToRight(node: Element | null) {
  return !!(node && node.scrollLeft === getMaxScrollLeftValue(node));
}

function isScrolledToTop(node: Element | null) {
  return !!(node && node.scrollTop === 0);
}

function isScrolledToLeft(node: Element | null) {
  return !!(node && node.scrollLeft === 0);
}

function getMaxScrollTopValue(node: Element) {
  return node.scrollHeight - node.clientHeight;
}

function getMaxScrollLeftValue(node: Element) {
  return node.scrollWidth - node.clientWidth;
}

function getMaxScrollStartValue(node: Element, axis: Axis) {
  return axis === 'x' ? getMaxScrollLeftValue(node) : getMaxScrollTopValue(node);
}

function ucFirst(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function getActualScrollDirection(dir: LogicalDirection, axis: Axis): ScrollDirection {
  if (dir === 'start') {
    return axis === 'x' ? 'left' : 'up';
  }
  return axis === 'x' ? 'right' : 'down';
}

function getPointerPosition(event: PointerEvent): PointerPosition {
  return {
    x: event.clientX,
    y: event.clientY,
  };
}

function getNewScrollRatio(
  pointerPosition: { x: number; y: number } | false,
  track: HTMLElement | null,
  axis: Axis
) {
  if (!track || !pointerPosition) {
    return null;
  }
  const { left, width, bottom, height } = track.getBoundingClientRect();
  const delta = axis === 'y' ? bottom - pointerPosition.y : pointerPosition.x - left;
  return delta / (axis === 'y' ? height : width);
}

function percentToValue(percent: number, min: number, max: number) {
  return (max - min) * percent + min;
}

function clamp(val: number, min: number, max: number) {
  return val > max ? max : val < min ? min : val;
}

function getThumbRef(axis: Axis, ctx: ScrollAreaRefs) {
  return axis === 'x' ? ctx.scrollbarXThumbRef : ctx.scrollbarYThumbRef;
}

function getButtonRef(actualDirection: ScrollDirection, ctx: ScrollAreaRefs) {
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

// prettier-ignore
type ScrollAreaEvent =  (
  | { type: 'ADD_SCROLLING_ATTRIBUTES' }
  | { type: 'REMOVE_SCROLLING_ATTRIBUTES' }
  | { type: 'UNSET_CSS_VARS' }
  | { type: 'HANDLE_SCROLL_AREA_RESIZE', width: number; height: number }
  | { type: 'HANDLE_SCROLLBAR_AREA_RESIZE', width: number; height: number; axis: Axis }
  | { type: 'UPDATE_THUMBS' }
  | { type: 'MOVE_THUMB_WITH_POINTER'; axis: Axis; pointerPosition: number; pointerStartPointRef: React.MutableRefObject<number> }
  | { type: 'SCROLL_BY_PAGE_IMMEDIATELY'; axis: Axis; direction: LogicalDirection }
  | { type: 'SCROLL_BY_PAGE_QUEUE_ANIMATION'; scrollAnimationQueue: Queue; axis: Axis; direction: LogicalDirection }
  | { type: 'SCROLL_AFTER_BUTTON_PRESS_IMMEDIATELY'; }
  | { type: 'SCROLL_AFTER_BUTTON_PRESS_QUEUE_ANIMATION'; }
  | { type: 'SCROLL_RELATIVE_TO_POINTER_ON_TRACK'; axis: Axis; direction: LogicalDirection; pointerPosition: PointerPosition });

function eventManager(event: ScrollAreaEvent): void {
  const refs: ScrollAreaRefs = (event as any).refs;
  const positionEl = refs.positionRef.current!;
  const scrollAreaEl = refs.scrollAreaRef.current!;
  const { doc, win } = getOwnerGlobals(refs.scrollAreaRef);

  if (!positionEl || !scrollAreaEl) {
    return;
  }

  switch (event.type) {
    case 'ADD_SCROLLING_ATTRIBUTES': {
      doc.body.setAttribute('data-interop-scrolling', '');
      scrollAreaEl.setAttribute('data-scrolling', '');
      break;
    }
    case 'REMOVE_SCROLLING_ATTRIBUTES': {
      doc.body.removeAttribute('data-interop-scrolling');
      scrollAreaEl.removeAttribute('data-scrolling');
      break;
    }
    case 'UNSET_CSS_VARS': {
      scrollAreaEl.style.setProperty(CSS_PROPS.scrollbarXOffset, '0px');
      scrollAreaEl.style.setProperty(CSS_PROPS.scrollbarYOffset, '0px');
      scrollAreaEl.style.setProperty(CSS_PROPS.scrollAreaWidth, 'auto');
      scrollAreaEl.style.setProperty(CSS_PROPS.scrollAreaHeight, 'auto');
      scrollAreaEl.style.setProperty(CSS_PROPS.positionWidth, 'auto');
      scrollAreaEl.style.setProperty(CSS_PROPS.positionHeight, 'auto');
      break;
    }
    case 'HANDLE_SCROLL_AREA_RESIZE': {
      // We need a fixed width for the position element based on the content box size of the scroll
      // area. Since the inner elements rely on some absolute positioning, technically the content
      // box size will always be zero so we need to calculate it ourselves with computed styles.
      // Since scroll area doesn't update React state in response to events, it shouldn't re-render
      // very often in a real app so I don't think this will be a bottleneck for us. The
      // computations will be more critical in the composer where we need style changes to trigger
      // re-renders.
      const computedStyle = win.getComputedStyle(scrollAreaEl);
      const borderTopWidth = parseInt(computedStyle.borderTopWidth);
      const borderLeftWidth = parseInt(computedStyle.borderLeftWidth);
      const borderRightWidth = parseInt(computedStyle.borderRightWidth);
      const borderBottomWidth = parseInt(computedStyle.borderBottomWidth);

      scrollAreaEl.style.setProperty(CSS_PROPS.scrollAreaWidth, event.width + 'px');
      scrollAreaEl.style.setProperty(CSS_PROPS.scrollAreaHeight, event.height + 'px');
      scrollAreaEl.style.setProperty(
        CSS_PROPS.positionWidth,
        event.width - borderLeftWidth - borderRightWidth + 'px'
      );
      scrollAreaEl.style.setProperty(
        CSS_PROPS.positionHeight,
        event.height - borderTopWidth - borderBottomWidth + 'px'
      );
      break;
    }
    case 'HANDLE_SCROLLBAR_AREA_RESIZE': {
      if (event.axis === 'x') {
        scrollAreaEl.style.setProperty(CSS_PROPS.scrollbarXOffset, event.height + 'px');
      } else {
        scrollAreaEl.style.setProperty(CSS_PROPS.scrollbarYOffset, event.width + 'px');
      }
      break;
    }
    case 'UPDATE_THUMBS': {
      function updateThumb(axis: Axis) {
        const thumbEl = (axis === 'x'
          ? refs.scrollbarXThumbRef.current
          : refs.scrollbarYThumbRef.current)!;

        const totalScrollSize = getScrollSize({ element: positionEl, axis });
        const visibleSize = getClientSize({ element: positionEl, axis });
        const visibleToTotalRatio = visibleSize / totalScrollSize;
        const scrollPos = positionEl[DOM_PROPS.scrollPos[axis]];
        const thumbPos = scrollPos / totalScrollSize;

        if (visibleToTotalRatio >= 1) {
          // We're at 100% visible area, no need to show the scroll thumb:
          thumbEl.style[DOM_PROPS.size[axis]] = '0px';
        } else {
          // Set the thumb top/left to the scroll percent:
          thumbEl.style[DOM_PROPS.pos[axis]] = `${thumbPos * 100}%`;
          // Set the thumb size based on the scroll ratio:
          thumbEl.style[DOM_PROPS.size[axis]] = `${Math.max(visibleToTotalRatio * 100, 10)}%`;
        }
      }

      if (refs.scrollbarXThumbRef.current) {
        updateThumb('x');
      }

      if (refs.scrollbarYThumbRef.current) {
        updateThumb('y');
      }

      break;
    }

    case 'MOVE_THUMB_WITH_POINTER': {
      const { axis, pointerStartPointRef, pointerPosition } = event;
      const delta = pointerPosition - pointerStartPointRef.current;
      const totalScrollSize = getScrollSize({ element: positionEl, axis });
      const visibleSize = getClientSize({ element: positionEl, axis });
      const visibleToTotalRatio = visibleSize / totalScrollSize;

      if (!canScroll({ element: positionEl, axis, delta })) {
        return;
      }

      scrollBy({ element: positionEl, axis, value: delta / visibleToTotalRatio });
      pointerStartPointRef.current = pointerPosition;
      break;
    }
    case 'SCROLL_BY_PAGE_IMMEDIATELY': {
      const axis = event.axis;
      const direction = event.direction;
      const visibleSize = getClientSize({ element: positionEl, axis });
      const distance = getPagedScrollDistance({ direction, visibleSize });
      const newPosition = getNewScrollPosition({ direction, distance, axis, positionEl });
      positionEl.scrollTop = newPosition;
      break;
    }
    case 'SCROLL_BY_PAGE_QUEUE_ANIMATION': {
      const axis = event.axis;
      const direction = event.direction;
      const visibleSize = getClientSize({ element: positionEl, axis });
      event.scrollAnimationQueue.enqueue(() => {
        let totalScrollDistance = getPagedScrollDistance({ direction, visibleSize });
        return asyncAnimate({
          duration: 200,
          timing: bezier(0.16, 0, 0.73, 1),
          draw(progress) {
            const distance = totalScrollDistance * Math.min(progress, 1);
            const newPosition = getNewScrollPosition({
              direction,
              distance,
              axis,
              positionEl,
            });

            totalScrollDistance -= distance;
            positionEl.scrollTop = newPosition;
          },
        });
      });
      break;
    }
    case 'SCROLL_RELATIVE_TO_POINTER_ON_TRACK': {
      // TODO
      break;
    }
    case 'SCROLL_AFTER_BUTTON_PRESS_IMMEDIATELY': {
      break;
    }
    case 'SCROLL_AFTER_BUTTON_PRESS_QUEUE_ANIMATION': {
      break;
    }
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
function getPagedScrollDistance({
  direction,
  visibleSize,
}: {
  direction: LogicalDirection;
  visibleSize: number;
}) {
  return (visibleSize - 40) * (direction === 'end' ? 1 : -1);
}

function getClientSize({ element, axis }: { element: Element; axis: Axis }) {
  return element[axis === 'x' ? 'clientWidth' : 'clientHeight'];
}

function getScrollSize({ element, axis }: { element: Element; axis: Axis }) {
  return element[axis === 'x' ? 'scrollWidth' : 'scrollHeight'];
}

function getScrollPosition({ element, axis }: { element: Element; axis: Axis }) {
  return element[axis === 'x' ? 'scrollLeft' : 'scrollTop'];
}

function setScrollPosition({
  element,
  axis,
  value,
}: {
  element: Element;
  axis: Axis;
  value: number;
}) {
  element[axis === 'x' ? 'scrollLeft' : 'scrollTop'] = value;
}

function scrollBy({ element, axis, value }: { element: Element; axis: Axis; value: number }) {
  if (canScroll({ element: element, axis, delta: Math.round(clamp(value, -1, 1)) })) {
    element[axis === 'x' ? 'scrollLeft' : 'scrollTop'] += Math.round(value);
  }
}

/**
 * Determines the new scroll position (scrollTop/scrollLeft depending on the axis) for the scroll
 * area based on a given distance we want to scroll.
 * @param props
 */
function getNewScrollPosition({
  direction,
  distance,
  axis,
  positionEl,
}: {
  direction: LogicalDirection;
  distance: number;
  axis: Axis;
  positionEl: Element;
}) {
  const { [axis === 'x' ? 'scrollLeft' : 'scrollTop']: scrollPosition } = positionEl;
  const calculatedScrollPosition = scrollPosition + distance;
  const boundary = direction === 'end' ? getMaxScrollStartValue(positionEl, axis) : 0;
  return direction === 'end'
    ? Math.min(boundary, calculatedScrollPosition)
    : Math.max(boundary, calculatedScrollPosition);
}

/**
 * Determines whether or not the user is scrolling towards the end or start of a scrollbar when they
 * click the track. Direction is determined by their click position in relation to the scroll thumb.
 * @param props
 */
function determineScrollDirectionFromTrackClick({
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

function animate({ duration, draw, timing, done }: AnimationOptions) {
  let start = performance.now();
  let stopped = false;
  let rafId = requestAnimationFrame(function animate(time: number) {
    // In some cases there are discrepencies between performance.now() and the timestamp in rAF. In
    // those cases we reset the start time to the timestamp in the first frame.
    // https://stackoverflow.com/questions/38360250/requestanimationframe-now-vs-performance-now-time-discrepancy
    start = time < start ? time : start;

    const timeFraction = clamp((time - start) / duration, 0, 1);
    draw(timing(timeFraction));

    if (timeFraction < 1) {
      // If we haven't cancelled, keep the animation going
      !stopped && (rafId = requestAnimationFrame(animate));
    } else {
      // Callback to `done` only if the animation wasn't cancelled early
      done && done();
      cleanup();
    }
  });

  function cleanup() {
    stopped = true;
    cancelAnimationFrame(rafId);
  }

  return cleanup;
}

function asyncAnimate(opts: Omit<AnimationOptions, 'done'>) {
  return new Promise((resolve) => {
    animate({
      ...opts,
      done() {
        resolve('done');
      },
    });
  });
}

function shouldFallbackToNativeScroll(win: Window & typeof globalThis) {
  return !(
    'ResizeObserver' in win &&
    'IntersectionObserver' in win &&
    (('CSS' in win && 'supports' in win.CSS && win.CSS.supports('scrollbar-width: none')) ||
      // I don't think it's possible to use CSS.supports to detect if a pseudo element is
      // supported. We need to make sure `::-webkit-scrollbar` is valid if possible.
      // TODO: Replace true with valid check or remove the block altogether
      true)
  );
}

function canScroll({ element, axis, delta }: { element: Element; axis: Axis; delta: number }) {
  return !(
    delta === 0 || // No relevant directional change
    // Scroll area is already scrolled to the furthest possible point in the pointer movement's direction
    (delta < 0 && (axis === 'x' ? isScrolledToLeft : isScrolledToTop)(element)) ||
    (delta > 0 && (axis === 'x' ? isScrolledToRight : isScrolledToBottom)(element))
  );
}

type PointerPosition = { x: number; y: number };
type LogicalDirection = 'start' | 'end';
type ScrollDirection = 'up' | 'down' | 'left' | 'right';
type OverflowBehavior = 'auto' | 'hidden' | 'scroll' | 'visible';
type AnimationOptions = {
  duration: number;
  draw(progress: number): any;
  timing(frac: number): number;
  done?(): any;
};

// Ignore this, saving for my reference but I don't think we'll need them
// const BUTTON_SCROLL_INTERVAL_VALUES = [5, 7, 8, 9, 7, 7, 5, 2, 1];
// const BUTTON_SCROLL_INTERVAL = 15;
// const TRACK_SCROLL_INTERVAL_VALUES = [8, 38, 52, 52, 53, 49, 38, 38, 24];
