// TODO: Reenable this rule, just keeping out the added noise for now.
// I've got some helpers defined that I haven't used just yet.
/* eslint-disable @typescript-eslint/no-unused-vars */

// NOTES:
//  - How much does the scroll area scroll when a user presses spacebar or PageDown on a native
//    scrollbar? The answer is: depends! It's 100% of the viewport heiht minus ... some mysterious
//    value that differs from env to env. Whatever this value is should be the same value that is
//    scrolled when the user presses the scrollbar track. Several env's do roughly 100% of the
//    viewport height minus ~40px, so that's what I used to recreate the track functionality.
//    https://vasilis.nl/nerd/high-scroll-height-scrolling-space-bar/
//  - The above logic applies to the initial response to clickin the scroll track, but if the user
//    holds the pointer down for a short period of time the scroll area will move further in the
//    same direction to some position that correlates with the percentage of the track that the
//    pointer rests upon. I have not figured this out just yet, but this too appears to differ
//    slightly on different platforms.

// Component API:
//
// <ScrollArea>
//   <ScrollArea.Scrollbar axis="y">
//     <ScrollArea.Button direction="up">
//       <Arrow />
//     </ScrollArea.Button>
//     <ScrollArea.Track>
//       <ScrollArea.Thumb />
//     </ScrollArea.Track>
//     <ScrollArea.Button direction="down">
//       <Arrow />
//     </ScrollArea.Button>
//   </ScrollArea.Scrollbar>
//
//   <ScrollArea.Scrollbar axis="x">
//     <ScrollArea.Button direction="left">
//       <Arrow />
//     </ScrollArea.Button>
//     <ScrollArea.Track>
//       <ScrollArea.Thumb />
//     </ScrollArea.Track>
//     <ScrollArea.Button direction="right">
//       <Arrow />
//     </ScrollArea.Button>
//   </ScrollArea.Scrollbar>
//
//   <ScrollArea.Position>
//     <ScrollArea.ContentArea>
//       {children}
//     </ScrollArea.ContentArea>
//   </ScrollArea.Position>
//
// </ScrollArea>

// This component is a progressive enhancement that will fallback to a staandard div with overflow:
// scroll for browsers that don't support features we rely on.

// Needs to support:
//  - ResizeObserver
//  - IntersectionObserver
//  - PointerEvents
//  - CSS scrollbar-width OR -webkit-scrollbar

// TODO: General todos:
//  - Check size of scrollbars and offset the content area

import React from 'react';
import {
  forwardRef,
  createContext,
  createStyleObj,
  useLayoutEffect,
  useComposedRefs,
  useDocumentRef,
} from '@interop-ui/react-utils';
import {
  cssReset,
  isRightClick,
  Axis,
  getResizeObserverEntryBorderBoxSize,
  getResizeObserverEntryContentBoxSize,
} from '@interop-ui/utils';

const ROOT_DEFAULT_TAG = 'div';
const ROOT_NAME = 'ScrollArea';

// DOM property key map based on the scroll axis
// Should minify a bit better and hopefully make some repeated logic a bit simpler to follow.
const DOM_PROPS = {
  size: { x: 'width', y: 'height' },
  scrollSize: { x: 'scrollWidth', y: 'scrollHeight' },
  clientSize: { x: 'clientWidth', y: 'clientHeight' },
  clientCoord: { x: 'clientX', y: 'clientY' },
  scrollPos: { x: 'scrollLeft', y: 'scrollTop' },
  offsetPos: { x: 'offsetLeft', y: 'offsetTop' },
  pos: { x: 'left', y: 'top' },
} as const;

const CSS_PROPS = {
  // TODO: Might not need these, TBD
  borderRight: '--interop-scroll-area-border-right',
  borderBottom: '--interop-scroll-area-border-bottom',
  scrollAreaWidth: '--interop-scroll-area-width',
  scrollAreaHeight: '--interop-scroll-area-height',
  scrollbarXOffset: '--interop-scroll-area-scrollbar-x-offset',
  scrollbarYOffset: '--interop-scroll-area-scrollbar-y-offset',
} as const;

// TODO: RTL language testing for horizontal scrolling

type ScrollAreaContextValue = {
  buttonUpRef: NullableRefObject<HTMLDivElement>;
  buttonDownRef: NullableRefObject<HTMLDivElement>;
  buttonLeftRef: NullableRefObject<HTMLDivElement>;
  buttonRightRef: NullableRefObject<HTMLDivElement>;
  positionRef: NullableRefObject<HTMLDivElement>;
  scrollAreaRef: NullableRefObject<HTMLDivElement>;
  scrollbarYThumbRef: NullableRefObject<HTMLDivElement>;
  scrollbarXThumbRef: NullableRefObject<HTMLDivElement>;
  visibleToTotalHeightRatioRef: React.MutableRefObject<number>;
  visibleToTotalWidthRatioRef: React.MutableRefObject<number>;
  supportsCustomScrollbars: boolean;
  overflowX: OverflowBehavior;
  overflowY: OverflowBehavior;
};

const [ScrollAreaContext, useScrollAreaContext] = createContext<ScrollAreaContextValue>(
  ROOT_NAME + 'Context',
  ROOT_NAME
);

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

    const scrollAreaRef = useRef<HTMLDivElement>();
    const scrollbarYThumbRef = useRef<HTMLDivElement>();
    const scrollbarXThumbRef = useRef<HTMLDivElement>();

    const buttonRightRef = useRef<HTMLDivElement>();
    const buttonLeftRef = useRef<HTMLDivElement>();
    const buttonUpRef = useRef<HTMLDivElement>();
    const buttonDownRef = useRef<HTMLDivElement>();

    const positionRef = useRef<HTMLDivElement>();
    const contentAreaRef = useRef<HTMLDivElement>();

    const visibleToTotalHeightRatioRef = React.useRef(0);
    const visibleToTotalWidthRatioRef = React.useRef(0);

    const [supportsCustomScrollbars, setSupportsCustomScrollbars] = React.useState(false);

    const documentRef = useDocumentRef(scrollAreaRef);

    useLayoutEffect(function () {
      const scrollAreaEl = scrollAreaRef.current;
      if (scrollAreaEl) {
        scrollAreaEl.style.setProperty(CSS_PROPS.scrollbarXOffset, '0px');
        scrollAreaEl.style.setProperty(CSS_PROPS.scrollbarYOffset, '0px');
      }
    }, []);

    useLayoutEffect(
      function () {
        const doc = documentRef.current;
        const win = doc.defaultView || window;

        if (
          !forceNative &&
          'ResizeObserver' in win &&
          'IntersectionObserver' in win &&
          (('CSS' in win && 'supports' in win.CSS && win.CSS.supports('scrollbar-width: none')) ||
            // I don't think it's possible to use CSS.supports to detect if a pseudo element is
            // supported. We need to make sure `::-webkit-scrollbar` is valid if possible.
            // TODO: Replace true with valid check or remove the block altogether
            true)
        ) {
          setSupportsCustomScrollbars(true);
        }
      },
      [documentRef, forceNative]
    );

    useLayoutEffect(function () {
      const scrollAreaEl = scrollAreaRef.current;
      if (scrollAreaEl) {
        const doc = documentRef.current;
        const win = doc.defaultView || window;
        const computedStyle = win.getComputedStyle(scrollAreaEl);

        scrollAreaEl.style.setProperty(CSS_PROPS.borderRight, computedStyle.borderRightWidth);
        scrollAreaEl.style.setProperty(CSS_PROPS.borderBottom, computedStyle.borderBottomWidth);
      }
    });

    useLayoutEffect(
      function () {
        let initialUpdateDone = false;
        const scrollAreaEl = scrollAreaRef.current!;

        if (!scrollAreaEl) {
          return;
        }

        const observer = new ResizeObserver((entries) => {
          // Skip initial update, that's handled directly in the effect to prevent jank
          if (!initialUpdateDone) {
            initialUpdateDone = true;
            return;
          }

          // No need to loop, we're only observing a single element.
          const entry = entries[0];
          const borderBoxSize = getResizeObserverEntryBorderBoxSize(entry);
          updateScrollAreaSizeProperties(borderBoxSize.inlineSize, borderBoxSize.blockSize);
        });

        const { width, height } = scrollAreaEl.getBoundingClientRect();
        updateScrollAreaSizeProperties(width, height);
        observer.observe(scrollAreaEl);

        function updateScrollAreaSizeProperties(width: number, height: number) {
          scrollAreaEl.style.setProperty(CSS_PROPS.scrollAreaWidth, width + 'px');
          scrollAreaEl.style.setProperty(CSS_PROPS.scrollAreaHeight, height + 'px');
        }

        return function () {
          observer.disconnect();
        };
      },
      [documentRef]
    );

    useLayoutEffect(
      function () {
        let initialUpdateDone = false;
        const scrollAreaEl = scrollAreaRef.current!;
        const positionEl = positionRef.current!;

        if (!scrollAreaEl || !positionEl || !supportsCustomScrollbars) {
          // TODO: dev warnings, these parts are all required
          return;
        }

        // TODO: Need some resize observers to calculate changed sizes of the viewport and associated elements

        // Scroll listeners can be expensive, and something outside of our control may scroll content
        // while it's out of view. We only need to respond to those events when a scroll area is
        // visibile in the viewport.
        const observer = new IntersectionObserver(
          function handleScrollAreaViewChange(entries) {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                positionEl.addEventListener('scroll', updateThumbs);
                // Skip initial update, that's handled directly in the effect to prevent jank
                if (!initialUpdateDone) {
                  initialUpdateDone = true;
                  return;
                }
                updateThumbs();
                return;
              }
              // Scroll area not in view, clean up scroll listener
              removeListeners();
            });
          },
          {
            root: null,
            rootMargin: '0px',
            threshold: [0, 1],
          }
        );

        updateThumbs();
        observer.observe(scrollAreaEl);

        return function cleanup() {
          observer.disconnect();
          removeScrollingAttributes(scrollAreaEl);
          removeListeners();
        };

        function removeListeners() {
          positionEl.removeEventListener('scroll', updateThumbs);
        }

        function updateThumb(axis: Axis) {
          const thumbEl = axis === 'x' ? scrollbarXThumbRef.current : scrollbarYThumbRef.current;

          if (positionEl && thumbEl && scrollAreaEl) {
            const totalSize = positionEl[DOM_PROPS.scrollSize[axis]];
            const visibleSize = positionEl[DOM_PROPS.clientSize[axis]];
            const scrollPos = positionEl[DOM_PROPS.scrollPos[axis]];
            const visibleToTotalRatioRef =
              axis === 'x' ? visibleToTotalWidthRatioRef : visibleToTotalHeightRatioRef;
            const thumbPos = scrollPos / totalSize;
            visibleToTotalRatioRef.current = visibleSize / totalSize;

            if (visibleToTotalRatioRef.current >= 1) {
              // We're at 100% visible area, no need to show the scroll thumb:
              thumbEl.style[DOM_PROPS.size[axis]] = '0px';
            } else {
              // Set the thumb top/left to the scroll percent:
              thumbEl.style[DOM_PROPS.pos[axis]] = `${thumbPos * 100}%`;
              // Set the thumb size based on the scroll ratio:
              thumbEl.style[DOM_PROPS.size[axis]] = `${Math.max(
                visibleToTotalRatioRef.current * 100,
                10
              )}%`;
            }
          }
        }

        function updateThumbs() {
          updateThumb('x');
          updateThumb('y');
        }
      },
      [documentRef, supportsCustomScrollbars]
    );

    // Add and cleanup after global listeners

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

    const ctx: ScrollAreaContextValue = React.useMemo(() => {
      return {
        buttonLeftRef,
        buttonRightRef,
        buttonUpRef,
        buttonDownRef,
        overflowX,
        overflowY,
        positionRef,
        scrollAreaRef,
        scrollbarYThumbRef,
        scrollbarXThumbRef,
        visibleToTotalHeightRatioRef,
        visibleToTotalWidthRatioRef,
        supportsCustomScrollbars,
      };
    }, [overflowX, overflowY, supportsCustomScrollbars]);

    return (
      <ScrollAreaContext.Provider value={ctx}>
        <Comp
          ref={ref}
          {...domProps}
          style={
            supportsCustomScrollbars
              ? domProps.style
              : {
                  ...domProps.style,
                  overflowX,
                  overflowY,
                }
          }
        >
          {children}
        </Comp>
      </ScrollAreaContext.Provider>
    );
  }
);

const POSITION_DEFAULT_TAG = 'div';
const POSITION_NAME = 'ScrollArea.Position';
type ScrollAreaPositionDOMProps = React.ComponentPropsWithoutRef<typeof POSITION_DEFAULT_TAG>;
type ScrollAreaPositionOwnProps = {};
type ScrollAreaPositionProps = ScrollAreaPositionDOMProps & ScrollAreaPositionOwnProps;

const ScrollAreaPositionImpl = forwardRef<typeof POSITION_DEFAULT_TAG, ScrollAreaPositionProps>(
  function ScrollAreaPositionImpl(props, forwardedRef) {
    const { as: Comp = POSITION_DEFAULT_TAG, ...domProps } = props;
    const { positionRef, overflowX, overflowY } = useScrollAreaContext(POSITION_NAME);
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
    const { supportsCustomScrollbars } = useScrollAreaContext(POSITION_NAME);
    return supportsCustomScrollbars ? (
      <ScrollAreaPositionImpl ref={forwardedRef} {...props} />
    ) : (
      <React.Fragment>{props.children}</React.Fragment>
    );
  }
);

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

const SCROLLBAR_DEFAULT_TAG = 'div';
const SCROLLBAR_NAME = 'ScrollArea.Scrollbar';

type ScrollAreaScrollbarDOMProps = React.ComponentPropsWithoutRef<typeof SCROLLBAR_DEFAULT_TAG>;
type ScrollAreaScrollbarOwnProps = {
  axis: Axis;
};
type ScrollAreaScrollbarProps = ScrollAreaScrollbarDOMProps & ScrollAreaScrollbarOwnProps;

type ScrollbarContextValue = {
  axis: Axis;
};

const [ScrollbarContext, useScrollbarContext] = createContext<ScrollbarContextValue>(
  'ScrollbarContext',
  SCROLLBAR_NAME
);

const ScrollAreaScrollbarImpl = forwardRef<typeof SCROLLBAR_DEFAULT_TAG, ScrollAreaScrollbarProps>(
  function ScrollAreaScrollbarImpl(props, forwardedRef) {
    const { as: Comp = SCROLLBAR_DEFAULT_TAG, axis, ...domProps } = props;
    const { supportsCustomScrollbars, scrollAreaRef } = useScrollAreaContext(SCROLLBAR_NAME);
    const ctx = React.useMemo(() => ({ axis }), [axis]);
    const ownRef = useRef<HTMLDivElement>();
    const ref = useComposedRefs(ownRef, forwardedRef);

    useLayoutEffect(
      function () {
        let initialUpdateDone = false;
        const scrollAreaEl = scrollAreaRef.current!;
        const scrollbarEl = ownRef.current!;

        if (!scrollAreaEl || !scrollbarEl) {
          return;
        }

        const observer = new ResizeObserver((entries) => {
          // Skip initial update, that's handled directly in the effect to prevent jank
          if (!initialUpdateDone) {
            initialUpdateDone = true;
            return;
          }

          // No need to loop, we're only observing a single element.
          const entry = entries[0];
          const borderBoxSize = getResizeObserverEntryBorderBoxSize(entry);
          updateScrollbarSizeProperties(borderBoxSize.inlineSize, borderBoxSize.blockSize);
        });

        const { width, height } = scrollbarEl.getBoundingClientRect();
        updateScrollbarSizeProperties(width, height);
        observer.observe(scrollbarEl);

        function updateScrollbarSizeProperties(width: number, height: number) {
          if (axis === 'x') {
            scrollAreaEl.style.setProperty(CSS_PROPS.scrollbarXOffset, height + 'px');
          } else if (axis === 'y') {
            scrollAreaEl.style.setProperty(CSS_PROPS.scrollbarYOffset, width + 'px');
          }
        }
      },
      [scrollAreaRef, axis]
    );

    return (
      <ScrollbarContext.Provider value={ctx}>
        <Comp {...domProps} {...interopDataAttrObj('scrollBar')} ref={ref} data-axis={axis} />
      </ScrollbarContext.Provider>
    );
  }
);

const ScrollAreaScrollbar = forwardRef<typeof SCROLLBAR_DEFAULT_TAG, ScrollAreaScrollbarProps>(
  function ScrollAreaScrollbar(props, forwardedRef) {
    const { supportsCustomScrollbars } = useScrollAreaContext(SCROLLBAR_NAME);
    if (!props.axis || !['x', 'y'].includes(props.axis)) {
      return null;
    }

    return supportsCustomScrollbars ? (
      <ScrollAreaScrollbarImpl {...props} ref={forwardedRef} />
    ) : null;
  }
);

const TRACK_DEFAULT_TAG = 'div';
const TRACK_NAME = 'ScrollArea.Track';
type ScrollAreaTrackDOMProps = React.ComponentPropsWithoutRef<typeof TRACK_DEFAULT_TAG>;
type ScrollAreaTrackOwnProps = {};
type ScrollAreaTrackProps = ScrollAreaTrackDOMProps & ScrollAreaTrackOwnProps;

const ScrollAreaTrackImpl = forwardRef<typeof TRACK_DEFAULT_TAG, ScrollAreaTrackProps>(
  function ScrollAreaTrackImpl(props, forwardedRef) {
    const { as: Comp = TRACK_DEFAULT_TAG, ...domProps } = props;
    const { axis } = useScrollbarContext(TRACK_NAME);
    const ctx = useScrollAreaContext(TRACK_NAME);
    const { scrollAreaRef, positionRef } = ctx;
    const ownRef = useRef<HTMLDivElement>();
    const ref = useComposedRefs(ownRef, forwardedRef);
    const documentRef = useDocumentRef(scrollAreaRef);

    React.useEffect(
      function () {
        let trackPointerDownTimeoutId: number | null = null;
        const doc = documentRef.current;
        const win = doc.defaultView || window;
        const positionEl = positionRef.current!;
        const trackEl = ownRef.current!;
        const scrollAreaEl = scrollAreaRef.current!;

        console.log(positionEl);

        if (!positionEl || !trackEl || !scrollAreaEl) {
          // TODO: dev warnings
          return;
        }

        console.log('adding track listener');
        trackEl.addEventListener('pointerdown', handlePointerDown);
        return function () {
          trackEl.removeEventListener('pointerdown', handlePointerDown);
          doc.removeEventListener('pointerup', handlePointerUp);
        };

        // fn's

        function handlePointerUp(event: PointerEvent) {
          trackEl && trackEl.releasePointerCapture(event.pointerId);
          removeScrollingAttributes(scrollAreaEl);
          win.clearTimeout(trackPointerDownTimeoutId!);
          doc.removeEventListener('pointerup', handlePointerUp);
        }

        function handlePointerDown(event: PointerEvent) {
          if (isRightClick(event)) return;

          console.log('track down');

          // Handle track

          trackEl.setPointerCapture(event.pointerId);
          addScrollingAttributes(scrollAreaEl);

          // const clickPos = event[propMap.clientCoord[axis]];
          // const trackStartPos = trackEl[propMap.offsetPos[axis]];
          // const trackSize = trackEl[propMap.clientSize[axis]];
          // const relativeClickPos = clickPos - trackStartPos;

          // 1. TODO: Check to see if clicking above or below the thumb, bail if neither

          // let trackHeight = trackEl[propMap.clientSize[axis]];
          // let trackTop = trackEl[propMap.clientPos[axis]];
          // let clickedPositionRatio = trackTop - event[propMap.clientCoord[axis]];
          // console.log(trackTop);
          // //console.log(clickedPositionRatio);
          // let totalHeight = positionEl[propMap.scrollSize[axis]];
          // let visibleHeight = positionEl[propMap.clientSize[axis]];
          // let scrollPos = positionEl[propMap.scrollPos[axis]];
          // let thumbTop = scrollPos / totalHeight;
          // visibleToTotalHeightRatio.current = visibleHeight / totalHeight;

          // 2. Listen for pointerup
          doc.addEventListener('pointerup', handlePointerUp);

          // 3. TODO: Immediately scroll up/down by X%
          //   (same percentage as a spacebar scroll)

          // MAYBE DON'T DO THIS BUT.......
          // 4. Set timeout ~400ms after which:
          trackPointerDownTimeoutId = win.setTimeout(function () {
            // - TODO: scrolls to a point near the pointer
            // - TODO: clears itself after scroll
            win.clearTimeout(trackPointerDownTimeoutId!);
          }, 400);
        }
      },
      // All dependencies are refs we only need to setup/teardown if the axis changes for whatever
      // reason.
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [axis]
    );

    return <Comp {...domProps} {...interopDataAttrObj('track')} data-axis={axis} ref={ref} />;
  }
);

const ScrollAreaTrack = forwardRef<typeof TRACK_DEFAULT_TAG, ScrollAreaTrackProps>(
  function ScrollAreaTrack(props, ref) {
    const { supportsCustomScrollbars } = useScrollAreaContext(THUMB_NAME);
    return supportsCustomScrollbars ? <ScrollAreaTrackImpl {...props} ref={ref} /> : null;
  }
);

const THUMB_DEFAULT_TAG = 'div';
const THUMB_NAME = 'ScrollArea.Thumb';
type ScrollAreaThumbDOMProps = React.ComponentPropsWithoutRef<typeof THUMB_DEFAULT_TAG>;
type ScrollAreaThumbOwnProps = {};
type ScrollAreaThumbProps = ScrollAreaThumbDOMProps & ScrollAreaThumbOwnProps;

const ScrollAreaThumbImpl = forwardRef<typeof THUMB_DEFAULT_TAG, ScrollAreaThumbProps>(
  function ScrollAreaThumbImpl(props, forwardedRef) {
    const { as: Comp = THUMB_DEFAULT_TAG, ...domProps } = props;
    const { axis } = useScrollbarContext(THUMB_NAME);
    const ctx = useScrollAreaContext(THUMB_NAME);
    const {
      scrollAreaRef,
      positionRef,
      visibleToTotalHeightRatioRef,
      visibleToTotalWidthRatioRef,
    } = ctx;
    const thumbRef: React.MutableRefObject<null | HTMLDivElement> = (ctx as any)[
      `scrollbar${axis.toUpperCase()}ThumbRef`
    ];
    const ref = useComposedRefs(thumbRef || null, forwardedRef);
    const documentRef = useDocumentRef(scrollAreaRef);

    React.useEffect(
      function () {
        let pointerStartPoint = 0;
        const doc = documentRef.current;
        const positionEl = positionRef.current!;
        const thumbEl = thumbRef.current!;
        const scrollAreaEl = scrollAreaRef.current!;

        const visibleToTotalRatio =
          axis === 'x' ? visibleToTotalWidthRatioRef.current : visibleToTotalHeightRatioRef.current;

        if (!thumbEl || !positionEl || !scrollAreaEl) {
          return;
        }

        thumbEl.addEventListener('pointerdown', handlePointerDown);
        return function () {
          thumbEl.removeEventListener('pointerdown', handlePointerDown);
          doc.removeEventListener('pointermove', handlePointerMove);
          doc.removeEventListener('pointerup', handlePointerUp);
        };

        function handlePointerMove(event: PointerEvent) {
          const delta = pointerStartPoint - event[DOM_PROPS.clientCoord[axis]];
          if (delta === 0) {
            pointerStartPoint = event[DOM_PROPS.clientCoord[axis]];
            return;
          } else if (
            (delta > 0 && (axis === 'x' ? isScrolledToLeft : isScrolledToTop)(positionEl)) ||
            (delta < 0 && (axis === 'x' ? isScrolledToRight : isScrolledToBottom)(positionEl))
          ) {
            return;
          }

          positionEl[DOM_PROPS.scrollPos[axis]] -= Math.round(delta / visibleToTotalRatio);
          pointerStartPoint = event[DOM_PROPS.clientCoord[axis]];
        }

        function handlePointerDown(event: PointerEvent) {
          if (isRightClick(event)) return;

          console.log('thumb down');

          event.stopPropagation();
          addScrollingAttributes(scrollAreaEl);
          pointerStartPoint = event[DOM_PROPS.clientCoord[axis]];
          thumbEl.setPointerCapture(event.pointerId);
          doc.addEventListener('pointerup', handlePointerUp);
          doc.addEventListener('pointermove', handlePointerMove);
        }

        function handlePointerUp(event: PointerEvent) {
          removeScrollingAttributes(scrollAreaEl);
          thumbEl && thumbEl.releasePointerCapture(event.pointerId);
          doc.removeEventListener('pointermove', handlePointerMove);
          doc.removeEventListener('pointerup', handlePointerUp);
        }
      },
      // All dependencies are refs we only need to setup/teardown if the axis changes for whatever
      // reason.
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [axis]
    );

    // I don't think we'll ever reach this case, because if axis is invalid the parent scrollbar
    // will render null, and thumb should always be rendered inside of a scrollbar. Keeping for now
    // as an extra safeguard but consider removing.
    if (!thumbRef) {
      return null;
    }

    return <Comp {...domProps} {...interopDataAttrObj('thumb')} data-axis={axis} ref={ref} />;
  }
);

const ScrollAreaThumb = forwardRef<typeof THUMB_DEFAULT_TAG, ScrollAreaThumbProps>(
  function ScrollAreaThumb(props, ref) {
    const { supportsCustomScrollbars } = useScrollAreaContext(THUMB_NAME);
    return supportsCustomScrollbars ? <ScrollAreaThumbImpl {...props} ref={ref} /> : null;
  }
);

const BUTTON_DEFAULT_TAG = 'div';
const BUTTON_NAME = 'ScrollArea.Button';
type ScrollAreaButtonDOMProps = React.ComponentPropsWithoutRef<typeof BUTTON_DEFAULT_TAG>;
type ScrollAreaButtonOwnProps = {
  direction: ScrollDirection;
};
type ScrollAreaButtonProps = ScrollAreaButtonDOMProps & ScrollAreaButtonOwnProps;

// For directional scroll buttons, we emulate native Windows behavior as closely as possible. There,
// when a user presses a scroll button, the browser triggers 9 separate scroll events in ~16
// millisecond intervals, moving scrollTop by a short value with each scroll event. This array
// represents the differences between the element's scrollTop value at each of these intervals. I
// will likely rethink this approach tactically as it gets much more complicated for track clicks.
// We are concerned more about the bezier curve effect this creates vs. the actual values.
const BUTTON_SCROLL_INTERVAL_VALUES = [5, 7, 8, 9, 7, 7, 5, 2, 1];
const BUTTON_SCROLL_INTERVAL = 16;

const ScrollAreaButtonImpl = forwardRef<typeof BUTTON_DEFAULT_TAG, ScrollAreaButtonProps>(
  function ScrollAreaButtonImpl(props, forwardedRef) {
    const { as: Comp = BUTTON_DEFAULT_TAG, direction, ...domProps } = props;
    const ctx = useScrollAreaContext(BUTTON_NAME);
    const buttonRef = (ctx as any)[`button${ucFirst(direction)}Ref`];
    const ref = useComposedRefs(buttonRef || null, forwardedRef);
    const { positionRef, scrollAreaRef } = ctx;
    const documentRef = useDocumentRef(scrollAreaRef);

    React.useEffect(() => {
      const doc = documentRef.current;
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
        // Based on native Windows scroll behavior. See notes at the
        // top of the doc for more background.
        // TODO: Check for prefers-reduced-motion and use a single
        // scroll event for users with that preference.
        let i = -1;

        const cleanup = repeat(
          BUTTON_SCROLL_INTERVAL_VALUES.length,
          BUTTON_SCROLL_INTERVAL,
          function () {
            if (positionEl === undefined) {
              return;
            }

            const distance = BUTTON_SCROLL_INTERVAL_VALUES[++i];
            const startingPos = positionEl && positionEl.scrollTop;

            switch (direction) {
              case 'up':
                if (isScrolledToTop(positionEl)) return;
                positionEl.scrollTop = Math.max(0, startingPos - distance);
                break;

              case 'down':
                if (isScrolledToBottom(positionEl)) return;
                positionEl.scrollTop = Math.min(
                  getBottomScrollTopValue(positionEl),
                  startingPos + distance
                );
                break;

              case 'left':
              case 'right':
              default:
                return;
            }
          }
        );
        return cleanup;
      }

      function handlePointerDown(event: PointerEvent) {
        if (isRightClick(event)) return;

        console.log('button down');

        buttonEl.setPointerCapture(event.pointerId);
        doc.addEventListener('pointerup', handlePointerUp);
        addScrollingAttributes(scrollAreaEl);
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
        removeScrollingAttributes(scrollAreaEl);
        buttonEl.removeEventListener('pointerup', handlePointerUp);
      }
    }, [buttonRef, positionRef, direction, documentRef, scrollAreaRef]);

    const { axis } = useScrollbarContext(BUTTON_NAME);

    // buttonRef will only be undefined if an invalid value was passed to `direction`. We can handle
    // dev warnings in propTypes and simply return `null` instead of throwing an error.
    if (!buttonRef) return null;

    return (
      <Comp
        {...domProps}
        {...interopDataAttrObj('button')}
        data-axis={axis}
        data-direction={direction}
        ref={ref}
      />
    );
  }
);

const ScrollAreaButton = forwardRef<typeof BUTTON_DEFAULT_TAG, ScrollAreaButtonProps>(
  function ScrollAreaButton(props, ref) {
    const { supportsCustomScrollbars } = useScrollAreaContext(THUMB_NAME);
    return supportsCustomScrollbars ? <ScrollAreaButtonImpl {...props} ref={ref} /> : null;
  }
);

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

type Point = {
  x: number;
  y: number;
};

type Vector = {
  dx: number;
  dy: number;
};

interface ScrollAreaStaticProps {
  Position: typeof ScrollAreaPosition;
  ContentArea: typeof ScrollAreaContentArea;
  Scrollbar: typeof ScrollAreaScrollbar;
  Track: typeof ScrollAreaTrack;
  Thumb: typeof ScrollAreaThumb;
  Button: typeof ScrollAreaButton;
  ResizeHandle: typeof ScrollAreaResizeHandle;
}

ScrollArea.Position = ScrollAreaPosition;
ScrollArea.ContentArea = ScrollAreaContentArea;
ScrollArea.Scrollbar = ScrollAreaScrollbar;
ScrollArea.Track = ScrollAreaTrack;
ScrollArea.Thumb = ScrollAreaThumb;
ScrollArea.Button = ScrollAreaButton;
ScrollArea.ResizeHandle = ScrollAreaResizeHandle;

ScrollArea.Position.displayName = POSITION_NAME;
ScrollArea.ContentArea.displayName = CONTENT_AREA_NAME;
ScrollArea.Scrollbar.displayName = SCROLLBAR_NAME;
ScrollArea.Track.displayName = TRACK_NAME;
ScrollArea.Thumb.displayName = THUMB_NAME;
ScrollArea.Button.displayName = BUTTON_NAME;
ScrollArea.ResizeHandle.displayName = RESIZE_HANDLE_NAME;

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
    width: `var(${CSS_PROPS.scrollAreaWidth})`,
    height: `var(${CSS_PROPS.scrollAreaHeight})`,
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
  scrollBar: {
    ...cssReset(SCROLLBAR_DEFAULT_TAG),
    zIndex: 2,
    position: 'absolute',
    display: 'flex',
    userSelect: 'none',
    '&[data-axis="x"]': {
      height: `16px`,
      left: 0,
      bottom: 0,
      right: 0,
      flexDirection: 'row',
    },
    '&[data-axis="y"]': {
      width: '16px',
      right: 0,
      top: 0,
      bottom: 0,
      flexDirection: 'column',
    },
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
    '&[data-axis="x"]': {
      height: `100%`,
      willChange: 'left',
    },
    '&[data-axis="y"]': {
      width: `100%`,
      willChange: 'top',
    },
  },
  button: {
    ...cssReset(BUTTON_DEFAULT_TAG),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: 'auto',
    '&[data-axis="x"]': {
      height: `100%`,
    },
    '&[data-axis="y"]': {
      width: `100%`,
    },
  },
  resizeHandle: {
    ...cssReset(RESIZE_HANDLE_DEFAULT_TAG),
  },
});

export { ScrollArea, styles };

function addScrollingAttributes(scrollArea: HTMLElement) {
  const root = scrollArea.ownerDocument;
  root.body.setAttribute('data-interop-scrolling', '');
  scrollArea.setAttribute('data-scrolling', '');
}

function removeScrollingAttributes(scrollArea: HTMLElement) {
  const root = scrollArea.ownerDocument;
  root.body.removeAttribute('data-interop-scrolling');
  scrollArea.removeAttribute('data-scrolling');
}

/**
 * @param {number} count
 * @param {number} interval
 * @param {Function} fn
 */
function repeat<Fn extends (...args: any[]) => any>(count: number, interval: number, fn: Fn) {
  if (count < 1 || isNaN(count)) return;

  fn();
  let counter = 1;
  const id = setInterval(function () {
    fn();
    if (++counter === count) {
      clear();
    }
  }, interval);
  return clear;
  function clear() {
    clearInterval(id);
  }
}

function isScrolledToBottom(node: Element | null) {
  return !!(node && node.scrollTop === getBottomScrollTopValue(node));
}

function isScrolledToRight(node: Element | null) {
  return !!(node && node.scrollLeft === getRightScrollLeftValue(node));
}

function isScrolledToTop(node: Element | null) {
  return !!(node && node.scrollTop === 0);
}

function isScrolledToLeft(node: Element | null) {
  return !!(node && node.scrollLeft === 0);
}

function getBottomScrollTopValue(node: Element) {
  return node.scrollHeight - node.clientHeight;
}

function getRightScrollLeftValue(node: Element) {
  return node.scrollWidth - node.clientWidth;
}

function ucFirst(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function getPointerPosition(event: TouchEvent, touchId: number): { x: number; y: number };
function getPointerPosition(event: PointerEvent): { x: number; y: number };

function getPointerPosition(event: PointerEvent | TouchEvent, touchId?: number) {
  if (event instanceof TouchEvent) {
    if (touchId === undefined) {
      throw Error('getPointerPosition requires touchId if a touch event is passed');
    }

    for (let i = 0; i < event.changedTouches.length; i += 1) {
      const touch = event.changedTouches[i];
      if (touch.identifier === touchId) {
        return {
          x: touch.clientX,
          y: touch.clientY,
        };
      }
    }
    return false;
  }

  return {
    x: event.clientX,
    y: event.clientY,
  };
}

function getScrollbarOffset(doc: Document) {
  const win = doc.defaultView || window;
  try {
    if (win.innerWidth > doc.documentElement.clientWidth) {
      return win.innerWidth - doc.documentElement.clientWidth;
    }
  } catch (err) {}
  return 0;
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

type ScrollDirection = 'up' | 'down' | 'left' | 'right';
type ScrollAxisDirection = {
  x: 'left' | 'right';
  y: 'down' | 'up';
};

// Shortens and normalizes typing to consistently get a nullable MutableRefObject
function useRef<T = any>(initial: null | T = null) {
  return React.useRef<null | T>(null);
}

type NullableRefObject<T> = React.MutableRefObject<null | T>;

type HTMLEl<T extends keyof HTMLElementTagNameMap> = HTMLElementTagNameMap[T];

type OverflowBehavior = 'auto' | 'hidden' | 'scroll' | 'visible';
