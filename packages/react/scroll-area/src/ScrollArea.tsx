/// <reference types="resize-observer-browser" />

import * as React from 'react';
import { Primitive } from '@radix-ui/react-primitive';
import { Presence } from '@radix-ui/react-presence';
import { createContext } from '@radix-ui/react-context';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import { useCallbackRef } from '@radix-ui/react-use-callback-ref';
import { useDirection } from '@radix-ui/react-use-direction';
import { clamp, linearScale } from '@radix-ui/number';
import { useStateMachine } from './useStateMachine';

import type * as Polymorphic from '@radix-ui/react-polymorphic';
import { composeEventHandlers } from '@radix-ui/primitive';

type ScrollAreaElement = React.ElementRef<typeof ScrollArea>;
type ViewportElement = React.ElementRef<typeof ScrollAreaViewport>;
type ScrollbarElement = React.ElementRef<typeof ScrollAreaScrollbar>;
type ThumbElement = React.ElementRef<typeof ScrollAreaThumb>;
type Direction = 'ltr' | 'rtl';
type Sizes = {
  content: number;
  viewport: number;
  scrollbar: {
    size: number;
    paddingStart: number;
    paddingEnd: number;
  };
};

const MAIN_POINTER = 0;
const INITIAL_SIZES = {
  content: 0,
  viewport: 0,
  scrollbar: { size: 0, paddingStart: 0, paddingEnd: 0 },
};

/* -------------------------------------------------------------------------------------------------
 * ScrollArea
 * -----------------------------------------------------------------------------------------------*/

const SCROLL_AREA_NAME = 'ScrollArea';

type ScrollAreaContextValue = {
  type: 'auto' | 'always' | 'scroll' | 'hover';
  dir: Direction;
  scrollHideDelay: number;
  scrollArea: ScrollAreaElement | null;
  viewport: ViewportElement | null;
  onViewportChange(viewport: ViewportElement | null): void;
  content: HTMLDivElement | null;
  onContentChange(content: HTMLDivElement): void;
  scrollbarX: ScrollbarElement | null;
  onScrollbarXChange(scrollbar: ScrollbarElement | null): void;
  scrollbarXEnabled: boolean;
  onScrollbarXEnabledChange(rendered: boolean): void;
  scrollbarY: ScrollbarElement | null;
  onScrollbarYChange(scrollbar: ScrollbarElement | null): void;
  scrollbarYEnabled: boolean;
  onScrollbarYEnabledChange(rendered: boolean): void;
  onCornerWidthChange(width: number): void;
  onCornerHeightChange(height: number): void;
};

const [ScrollAreaProvider, useScrollAreaContext] = createContext<ScrollAreaContextValue>(
  SCROLL_AREA_NAME
);

type ScrollAreaOwnProps = Polymorphic.Merge<
  Polymorphic.OwnProps<typeof Primitive>,
  {
    type?: ScrollAreaContextValue['type'];
    dir?: ScrollAreaContextValue['dir'];
    scrollHideDelay?: number;
  }
>;

type ScrollAreaPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof Primitive>,
  ScrollAreaOwnProps
>;

const ScrollArea = React.forwardRef((props, forwardedRef) => {
  const { type = 'hover', scrollHideDelay = 600, ...scrollAreaProps } = props;
  const [scrollArea, setScrollArea] = React.useState<ScrollAreaElement | null>(null);
  const [viewport, setViewport] = React.useState<ViewportElement | null>(null);
  const [content, setContent] = React.useState<HTMLDivElement | null>(null);
  const [scrollbarX, setScrollbarX] = React.useState<ScrollbarElement | null>(null);
  const [scrollbarY, setScrollbarY] = React.useState<ScrollbarElement | null>(null);
  const [cornerWidth, setCornerWidth] = React.useState(0);
  const [cornerHeight, setCornerHeight] = React.useState(0);
  const [scrollbarXEnabled, setScrollbarXEnabled] = React.useState(false);
  const [scrollbarYEnabled, setScrollbarYEnabled] = React.useState(false);
  const composedRefs = useComposedRefs(forwardedRef, (node) => setScrollArea(node));
  const computedDirection = useDirection(scrollArea, scrollAreaProps.dir);

  return (
    <ScrollAreaProvider
      type={type}
      dir={computedDirection}
      scrollHideDelay={scrollHideDelay}
      scrollArea={scrollArea}
      viewport={viewport}
      onViewportChange={setViewport}
      content={content}
      onContentChange={setContent}
      scrollbarX={scrollbarX}
      onScrollbarXChange={setScrollbarX}
      scrollbarXEnabled={scrollbarXEnabled}
      onScrollbarXEnabledChange={setScrollbarXEnabled}
      scrollbarY={scrollbarY}
      onScrollbarYChange={setScrollbarY}
      scrollbarYEnabled={scrollbarYEnabled}
      onScrollbarYEnabledChange={setScrollbarYEnabled}
      onCornerWidthChange={setCornerWidth}
      onCornerHeightChange={setCornerHeight}
    >
      <Primitive
        {...scrollAreaProps}
        ref={composedRefs}
        style={{
          position: 'relative',
          ['--radix-scroll-area-corner-width' as any]: cornerWidth + 'px',
          ['--radix-scroll-area-corner-height' as any]: cornerHeight + 'px',
          ...props.style,
        }}
      />
    </ScrollAreaProvider>
  );
}) as ScrollAreaPrimitive;

ScrollArea.displayName = SCROLL_AREA_NAME;

/* -------------------------------------------------------------------------------------------------
 * ScrollAreaViewport
 * -----------------------------------------------------------------------------------------------*/

const VIEWPORT_NAME = 'ScrollAreaViewport';

type ScrollAreaViewportOwnProps = Polymorphic.OwnProps<typeof Primitive>;

type ScrollAreaViewportPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof Primitive>,
  ScrollAreaViewportOwnProps
>;

const ScrollAreaViewport = React.forwardRef((props, forwardedRef) => {
  const { children, ...viewportProps } = props;
  const context = useScrollAreaContext(VIEWPORT_NAME);
  const ref = React.useRef<React.ElementRef<typeof Primitive>>(null);
  const composedRefs = useComposedRefs(forwardedRef, ref, context.onViewportChange);
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `[data-radix-scroll-area-viewport]{-ms-overflow-style:none;-webkit-overflow-scrolling:touch;}[data-radix-scroll-area-viewport]::-webkit-scrollbar{display:none}`,
        }}
      />
      <Primitive
        data-radix-scroll-area-viewport=""
        {...viewportProps}
        ref={composedRefs}
        style={{
          /**
           * We don't support `visible` because the intention is to have at least one scrollbar
           * if this component is used and `visible` will behave like `auto` in that case
           * https://developer.mozilla.org/en-US/docs/Web/CSS/overflowed#description
           *
           * We don't handle `auto` because the intention is for the native implementation
           * to be hidden if using this component. We just want to ensure the node is scrollable
           * so could have used either `scroll` or `auto` here. We picked `scroll` to prevent
           * the browser from having to work out whether to render native scrollbars or not,
           * we tell it to with the intention of hiding them in CSS.
           */
          overflowX: context.scrollbarXEnabled ? 'scroll' : 'hidden',
          overflowY: context.scrollbarYEnabled ? 'scroll' : 'hidden',
          scrollbarWidth: 'none',
          ...props.style,
        }}
      >
        <div ref={context.onContentChange}>{children}</div>
      </Primitive>
    </>
  );
}) as ScrollAreaViewportPrimitive;

ScrollAreaViewport.displayName = VIEWPORT_NAME;

/* -------------------------------------------------------------------------------------------------
 * ScrollAreaScrollbar
 * -----------------------------------------------------------------------------------------------*/

const SCROLLBAR_NAME = 'ScrollAreaScrollbar';

type ScrollAreaScrollbarOwnProps =
  | Polymorphic.OwnProps<typeof ScrollAreaScrollbarAuto>
  | Polymorphic.OwnProps<typeof ScrollAreaScrollbarHover>
  | Polymorphic.OwnProps<typeof ScrollAreaScrollbarScroll>
  | Polymorphic.OwnProps<typeof ScrollAreaScrollbarVisible>;

type ScrollAreaScrollbarPrimitive = Polymorphic.ForwardRefComponent<
  | Polymorphic.IntrinsicElement<typeof ScrollAreaScrollbarAuto>
  | Polymorphic.IntrinsicElement<typeof ScrollAreaScrollbarHover>
  | Polymorphic.IntrinsicElement<typeof ScrollAreaScrollbarScroll>
  | Polymorphic.IntrinsicElement<typeof ScrollAreaScrollbarVisible>,
  ScrollAreaScrollbarOwnProps
>;

const ScrollAreaScrollbar = React.forwardRef((props, forwardedRef) => {
  const context = useScrollAreaContext(SCROLLBAR_NAME);
  const { onScrollbarXEnabledChange, onScrollbarYEnabledChange } = context;
  const isHorizontal = props.orientation === 'horizontal';

  React.useEffect(() => {
    isHorizontal ? onScrollbarXEnabledChange(true) : onScrollbarYEnabledChange(true);
    return () => {
      isHorizontal ? onScrollbarXEnabledChange(false) : onScrollbarYEnabledChange(false);
    };
  }, [isHorizontal, onScrollbarXEnabledChange, onScrollbarYEnabledChange]);

  return context.type === 'hover' ? (
    <ScrollAreaScrollbarHover {...props} ref={forwardedRef} />
  ) : context.type === 'scroll' ? (
    <ScrollAreaScrollbarScroll {...props} ref={forwardedRef} />
  ) : context.type === 'auto' ? (
    <ScrollAreaScrollbarAuto {...props} ref={forwardedRef} />
  ) : context.type === 'always' ? (
    <ScrollAreaScrollbarVisible {...props} ref={forwardedRef} />
  ) : null;
}) as ScrollAreaScrollbarPrimitive;

ScrollAreaScrollbar.displayName = SCROLLBAR_NAME;

/* -----------------------------------------------------------------------------------------------*/

type ScrollAreaScrollbarOptionalOwnProps = Polymorphic.Merge<
  Polymorphic.OwnProps<typeof ScrollAreaScrollbarVisible>,
  { forceMount?: true }
>;
type ScrollAreaScrollbarOptionalPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof ScrollAreaScrollbarVisible>,
  ScrollAreaScrollbarOptionalOwnProps
>;

const ScrollAreaScrollbarHover = React.forwardRef((props, forwardedRef) => {
  const { forceMount, ...scrollbarProps } = props;
  const context = useScrollAreaContext(SCROLLBAR_NAME);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const scrollArea = context.scrollArea;
    let hideTimer = 0;
    if (scrollArea) {
      const handlePointerEnter = () => {
        window.clearTimeout(hideTimer);
        setVisible(true);
      };
      const handlePointerLeave = () => {
        hideTimer = window.setTimeout(() => setVisible(false), context.scrollHideDelay);
      };
      scrollArea.addEventListener('pointerenter', handlePointerEnter);
      scrollArea.addEventListener('pointerleave', handlePointerLeave);
      return () => {
        scrollArea.removeEventListener('pointerenter', handlePointerEnter);
        scrollArea.removeEventListener('pointerleave', handlePointerLeave);
      };
    }
  }, [context.scrollArea, context.scrollHideDelay]);

  return (
    <Presence present={forceMount || visible}>
      <ScrollAreaScrollbarAuto {...scrollbarProps} ref={forwardedRef} />
    </Presence>
  );
}) as ScrollAreaScrollbarOptionalPrimitive;

const ScrollAreaScrollbarScroll = React.forwardRef((props, forwardedRef) => {
  const { forceMount, ...scrollbarProps } = props;
  const context = useScrollAreaContext(SCROLLBAR_NAME);
  const isHorizontal = props.orientation === 'horizontal';
  const debounceScrollEnd = useDebounceCallback(() => send('SCROLL_END'), 100);
  const [state, send] = useStateMachine('hidden', {
    hidden: {
      SCROLL: 'scrolling',
    },
    scrolling: {
      SCROLL_END: 'idle',
      POINTER_ENTER: 'interacting',
    },
    interacting: {
      SCROLL: 'interacting',
      POINTER_LEAVE: 'idle',
    },
    idle: {
      HIDE: 'hidden',
      SCROLL: 'scrolling',
      POINTER_ENTER: 'interacting',
    },
  });

  React.useEffect(() => {
    if (state === 'idle') {
      const hideTimer = window.setTimeout(() => send('HIDE'), context.scrollHideDelay);
      return () => window.clearTimeout(hideTimer);
    }
  }, [state, context.scrollHideDelay, send]);

  React.useEffect(() => {
    const viewport = context.viewport;
    const scrollDirection = isHorizontal ? 'scrollLeft' : 'scrollTop';

    if (viewport) {
      let prevScrollPos = viewport[scrollDirection];
      const handleScroll = () => {
        const scrollPos = viewport[scrollDirection];
        const hasScrollInDirectionChanged = prevScrollPos !== scrollPos;
        if (hasScrollInDirectionChanged) {
          send('SCROLL');
          debounceScrollEnd();
        }
        prevScrollPos = scrollPos;
      };
      viewport.addEventListener('scroll', handleScroll);
      return () => viewport.removeEventListener('scroll', handleScroll);
    }
  }, [context.viewport, isHorizontal, send, debounceScrollEnd]);

  return (
    <Presence present={forceMount || state !== 'hidden'}>
      <ScrollAreaScrollbarVisible
        {...scrollbarProps}
        ref={forwardedRef}
        onPointerEnter={composeEventHandlers(props.onPointerEnter, () => send('POINTER_ENTER'))}
        onPointerLeave={composeEventHandlers(props.onPointerLeave, () => send('POINTER_LEAVE'))}
      />
    </Presence>
  );
}) as ScrollAreaScrollbarOptionalPrimitive;

const ScrollAreaScrollbarAuto = React.forwardRef((props, forwardedRef) => {
  const context = useScrollAreaContext(SCROLLBAR_NAME);
  const { forceMount, ...scrollbarProps } = props;
  const [visible, setVisible] = React.useState(false);
  const isHorizontal = props.orientation === 'horizontal';

  useResizeObserver(context.viewport, () => {
    if (context.viewport) {
      const isOverflowX = context.viewport.offsetWidth < context.viewport.scrollWidth;
      const isOverflowY = context.viewport.offsetHeight < context.viewport.scrollHeight;
      setVisible(isHorizontal ? isOverflowX : isOverflowY);
    }
  });

  return (
    <Presence present={forceMount || visible}>
      <ScrollAreaScrollbarVisible {...scrollbarProps} ref={forwardedRef} />
    </Presence>
  );
}) as ScrollAreaScrollbarOptionalPrimitive;

/* -----------------------------------------------------------------------------------------------*/

type ScrollAreaScrollbarVisibleOwnProps = Polymorphic.Merge<
  Omit<
    | Polymorphic.OwnProps<typeof ScrollAreaScrollbarX>
    | Polymorphic.OwnProps<typeof ScrollAreaScrollbarY>,
    keyof ScrollAreaScrollbarAxisPrivateProps
  >,
  { orientation?: 'horizontal' | 'vertical' }
>;

type ScrollAreaScrollbarVisiblePrimitive = Polymorphic.ForwardRefComponent<
  | Polymorphic.IntrinsicElement<typeof ScrollAreaScrollbarX>
  | Polymorphic.IntrinsicElement<typeof ScrollAreaScrollbarY>,
  ScrollAreaScrollbarVisibleOwnProps
>;

const ScrollAreaScrollbarVisible = React.forwardRef((props, forwardedRef) => {
  const { orientation = 'vertical', ...scrollbarProps } = props;
  const context = useScrollAreaContext(SCROLLBAR_NAME);
  const [sizes, setSizes] = React.useState<Sizes>(INITIAL_SIZES);
  const pointerOffsetRef = React.useRef(0);
  const thumbRatio = getThumbRatio(sizes.viewport, sizes.content);

  const commonProps = {
    ...scrollbarProps,
    ref: forwardedRef,
    sizes,
    onSizesChange: setSizes,
    hasThumb: thumbRatio > 0 && thumbRatio < 1,
    onThumbPointerUp: () => (pointerOffsetRef.current = 0),
    onThumbPointerDown: (pointerPosition: number) => (pointerOffsetRef.current = pointerPosition),
  };

  function getScrollPosition(pointerPosition: number, dir?: Direction) {
    return getScrollPositionFromPointer(pointerPosition, pointerOffsetRef.current, sizes, dir);
  }

  if (orientation === 'horizontal') {
    return (
      <ScrollAreaScrollbarX
        {...commonProps}
        onThumbPositionChange={(thumb, offset) => {
          if (thumb) thumb.style.transform = `translate3d(${offset}px, 0, 0)`;
        }}
        onWheelScroll={(scrollPos) => {
          if (context.viewport) context.viewport.scrollLeft = scrollPos;
        }}
        onDragScroll={(pointerPosition) => {
          if (context.viewport) {
            context.viewport.scrollLeft = getScrollPosition(pointerPosition, context.dir);
          }
        }}
      />
    );
  }

  if (orientation === 'vertical') {
    return (
      <ScrollAreaScrollbarY
        {...commonProps}
        onThumbPositionChange={(thumb, offset) => {
          if (thumb) thumb.style.transform = `translate3d(0, ${offset}px, 0)`;
        }}
        onWheelScroll={(scrollPos) => {
          if (context.viewport) context.viewport.scrollTop = scrollPos;
        }}
        onDragScroll={(pointerPosition) => {
          if (context.viewport) context.viewport.scrollTop = getScrollPosition(pointerPosition);
        }}
      />
    );
  }

  return null;
}) as ScrollAreaScrollbarVisiblePrimitive;

/* -----------------------------------------------------------------------------------------------*/

type ScrollbarAxisContext = {
  hasThumb: boolean;
  onThumbPointerDown(pointerPosition: { x: number; y: number }): void;
  onThumbPointerUp(): void;
  onThumbPositionChange(thumb: ThumbElement): void;
};

const [ScrollbarAxisProvider, useScrollbarAxisContext] = createContext<ScrollbarAxisContext>(
  SCROLLBAR_NAME
);

type ScrollAreaScrollbarAxisPrivateProps = {
  hasThumb: boolean;
  sizes: Sizes;
  onSizesChange(sizes: Sizes): void;
  onThumbPointerDown(pointerPos: number): void;
  onThumbPointerUp(): void;
  onThumbPositionChange(thumb: ThumbElement, offset: number): void;
  onWheelScroll(scrollPos: number): void;
  onDragScroll(pointerPos: number): void;
};

type ScrollAreaScrollbarXOwnProps = Polymorphic.Merge<
  Omit<Polymorphic.OwnProps<typeof ScrollAreaScrollbarImpl>, 'onResize'>,
  ScrollAreaScrollbarAxisPrivateProps
>;

type ScrollAreaScrollbarXPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof ScrollAreaScrollbarImpl>,
  ScrollAreaScrollbarXOwnProps
>;

const ScrollAreaScrollbarX = React.forwardRef((props, forwardedRef) => {
  const {
    sizes,
    onSizesChange,
    hasThumb,
    onThumbPointerDown,
    onThumbPointerUp,
    onThumbPositionChange,
    ...scrollbarProps
  } = props;
  const context = useScrollAreaContext(SCROLLBAR_NAME);
  const [computedStyle, setComputedStyle] = React.useState<CSSStyleDeclaration>();
  const ref = React.useRef<ScrollbarElement>(null);
  const composeRefs = useComposedRefs(forwardedRef, ref, context.onScrollbarXChange);
  const handleThumbPositionChange = useCallbackRef((thumb) => {
    if (context.viewport) {
      const offset = getThumbOffsetFromScroll(context.viewport.scrollLeft, sizes, context.dir);
      onThumbPositionChange(thumb, offset);
    }
  });

  React.useEffect(() => {
    if (ref.current) setComputedStyle(getComputedStyle(ref.current));
  }, [ref]);

  return (
    <ScrollbarAxisProvider
      hasThumb={hasThumb}
      onThumbPointerUp={useCallbackRef(onThumbPointerUp)}
      onThumbPositionChange={handleThumbPositionChange}
      onThumbPointerDown={useCallbackRef((pointerPosition) => {
        onThumbPointerDown(pointerPosition.x);
      })}
    >
      <ScrollAreaScrollbarImpl
        {...scrollbarProps}
        ref={composeRefs}
        style={{
          bottom: 0,
          left: context.dir === 'rtl' ? 'var(--radix-scroll-area-corner-width)' : 0,
          right: context.dir === 'ltr' ? 'var(--radix-scroll-area-corner-width)' : 0,
          ['--radix-scroll-area-thumb-width' as any]: getThumbSize(sizes) + 'px',
          ...scrollbarProps.style,
        }}
        onDragScroll={(pointerPosition) => scrollbarProps.onDragScroll(pointerPosition.x)}
        onWheelScroll={(event) => {
          if (context.viewport) {
            const scrollPos = context.viewport.scrollLeft + event.deltaX;
            const maxScrollPos = sizes.content - sizes.viewport;
            scrollbarProps.onWheelScroll(scrollPos);
            // prevent window scroll when wheeling on scrollbar
            if (scrollingWithinScrollbarBounds(scrollPos, maxScrollPos)) {
              event.preventDefault();
            }
          }
        }}
        onResize={() => {
          if (ref.current && context.viewport && computedStyle) {
            onSizesChange({
              content: context.viewport.scrollWidth,
              viewport: context.viewport.offsetWidth,
              scrollbar: {
                size: ref.current.clientWidth,
                paddingStart: toInt(computedStyle.paddingLeft),
                paddingEnd: toInt(computedStyle.paddingRight),
              },
            });
          }
        }}
      />
    </ScrollbarAxisProvider>
  );
}) as ScrollAreaScrollbarXPrimitive;

type ScrollAreaScrollbarYOwnProps = Polymorphic.Merge<
  Omit<Polymorphic.OwnProps<typeof ScrollAreaScrollbarImpl>, 'onResize'>,
  ScrollAreaScrollbarAxisPrivateProps
>;

type ScrollAreaScrollbarYPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof ScrollAreaScrollbarImpl>,
  ScrollAreaScrollbarYOwnProps
>;

const ScrollAreaScrollbarY = React.forwardRef((props, forwardedRef) => {
  const {
    sizes,
    onSizesChange,
    hasThumb,
    onThumbPointerDown,
    onThumbPointerUp,
    onThumbPositionChange,
    ...scrollbarProps
  } = props;
  const context = useScrollAreaContext(SCROLLBAR_NAME);
  const [computedStyle, setComputedStyle] = React.useState<CSSStyleDeclaration>();
  const ref = React.useRef<ScrollbarElement>(null);
  const composeRefs = useComposedRefs(forwardedRef, ref, context.onScrollbarYChange);
  const handleThumbPositionChange = useCallbackRef((thumb) => {
    if (context.viewport) {
      const offset = getThumbOffsetFromScroll(context.viewport.scrollTop, sizes);
      onThumbPositionChange(thumb, offset);
    }
  });

  React.useEffect(() => {
    if (ref.current) setComputedStyle(getComputedStyle(ref.current));
  }, [ref]);

  return (
    <ScrollbarAxisProvider
      hasThumb={hasThumb}
      onThumbPointerUp={useCallbackRef(onThumbPointerUp)}
      onThumbPositionChange={handleThumbPositionChange}
      onThumbPointerDown={useCallbackRef((pointerPosition) => {
        onThumbPointerDown(pointerPosition.y);
      })}
    >
      <ScrollAreaScrollbarImpl
        {...scrollbarProps}
        ref={composeRefs}
        style={{
          top: 0,
          right: context.dir === 'ltr' ? 0 : undefined,
          left: context.dir === 'rtl' ? 0 : undefined,
          bottom: 'var(--radix-scroll-area-corner-height)',
          ['--radix-scroll-area-thumb-height' as any]: getThumbSize(sizes) + 'px',
          ...scrollbarProps.style,
        }}
        onDragScroll={(pointerPosition) => scrollbarProps.onDragScroll(pointerPosition.y)}
        onWheelScroll={(event) => {
          if (context.viewport) {
            const scrollPos = context.viewport.scrollTop + event.deltaY;
            const maxScrollPos = sizes.content - sizes.viewport;
            scrollbarProps.onWheelScroll(scrollPos);
            // prevent window scroll when wheeling on scrollbar
            if (scrollingWithinScrollbarBounds(scrollPos, maxScrollPos)) {
              event.preventDefault();
            }
          }
        }}
        onResize={() => {
          if (ref.current && context.viewport && computedStyle) {
            onSizesChange({
              content: context.viewport.scrollHeight,
              viewport: context.viewport.offsetHeight,
              scrollbar: {
                size: ref.current.clientHeight,
                paddingStart: toInt(computedStyle.paddingTop),
                paddingEnd: toInt(computedStyle.paddingBottom),
              },
            });
          }
        }}
      />
    </ScrollbarAxisProvider>
  );
}) as ScrollAreaScrollbarYPrimitive;

/* -----------------------------------------------------------------------------------------------*/

type ScrollAreaScrollbarImplOwnProps = Polymorphic.Merge<
  Polymorphic.OwnProps<typeof Primitive>,
  {
    onWheelScroll(event: WheelEvent): void;
    onDragScroll(pointerPosition: { x: number; y: number }): void;
    onResize(): void;
  }
>;

type ScrollAreaScrollbarImplPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof Primitive>,
  ScrollAreaScrollbarImplOwnProps
>;

const ScrollAreaScrollbarImpl = React.forwardRef((props, forwardedRef) => {
  const { onDragScroll, onWheelScroll, onResize, ...scrollbarProps } = props;
  const context = useScrollAreaContext(SCROLLBAR_NAME);
  const [scrollbar, setScrollbar] = React.useState<ScrollbarElement | null>(null);
  const composeRefs = useComposedRefs(forwardedRef, (node) => setScrollbar(node));
  const rectRef = React.useRef<ClientRect | null>(null);
  const prevWebkitUserSelectRef = React.useRef<string>('');
  const viewport = context.viewport;
  const handleWheelScroll = useCallbackRef(onWheelScroll);
  const debounceResize = useDebounceCallback(onResize, 10);

  /**
   * We bind wheel event imperatively so we can switch off passive
   * mode for document wheel event to allow it to be prevented
   */
  React.useEffect(() => {
    const opts: AddEventListenerOptions = { passive: false };
    const handleWheel = (event: WheelEvent) => {
      const element = event.target as HTMLElement;
      const isScrollbarWheel = scrollbar?.contains(element);
      if (isScrollbarWheel) handleWheelScroll(event);
    };
    document.addEventListener('wheel', handleWheel, opts);
    return () => document.removeEventListener('wheel', handleWheel, opts);
  }, [viewport, scrollbar, handleWheelScroll]);

  function handleDragScroll(event: React.PointerEvent<HTMLElement>) {
    if (rectRef.current) {
      const x = event.clientX - rectRef.current.left;
      const y = event.clientY - rectRef.current.top;
      onDragScroll({ x, y });
    }
  }

  useResizeObserver(context.viewport, debounceResize);
  useResizeObserver(context.content, debounceResize);

  return (
    <Primitive
      {...scrollbarProps}
      ref={composeRefs}
      style={{
        position: 'absolute',
        ...scrollbarProps.style,
      }}
      onPointerDown={composeEventHandlers(props.onPointerDown, (event) => {
        if (event.button === MAIN_POINTER) {
          const element = event.target as HTMLElement;
          element.setPointerCapture(event.pointerId);
          rectRef.current = scrollbar!.getBoundingClientRect();
          // pointer capture doesn't prevent text selection in Safari
          // so we remove text selection manually when scrolling
          prevWebkitUserSelectRef.current = document.body.style.webkitUserSelect;
          document.body.style.webkitUserSelect = 'none';
          handleDragScroll(event);
        }
      })}
      onPointerMove={composeEventHandlers(props.onPointerMove, handleDragScroll)}
      onPointerUp={composeEventHandlers(props.onPointerUp, (event) => {
        const element = event.target as HTMLElement;
        element.releasePointerCapture(event.pointerId);
        document.body.style.webkitUserSelect = prevWebkitUserSelectRef.current;
        rectRef.current = null;
      })}
    />
  );
}) as ScrollAreaScrollbarImplPrimitive;

/* -------------------------------------------------------------------------------------------------
 * ScrollAreaThumb
 * -----------------------------------------------------------------------------------------------*/

const THUMB_NAME = 'ScrollbarThumb';

type ScrollAreaThumbOwnProps = Polymorphic.OwnProps<typeof Primitive>;
type ScrollAreaThumbPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof Primitive>,
  ScrollAreaThumbOwnProps
>;

const ScrollAreaThumb = React.forwardRef((props, forwardedRef) => {
  const { style, ...thumbProps } = props;
  const scrollAreaContext = useScrollAreaContext(THUMB_NAME);
  const scrollbarContext = useScrollbarAxisContext(THUMB_NAME);
  const { onThumbPositionChange } = scrollbarContext;
  const [thumb, setThumb] = React.useState<React.ElementRef<typeof Primitive> | null>(null);
  const composedRef = useComposedRefs(forwardedRef, (node) => setThumb(node));
  const removeUnlinkedScrollListenerRef = React.useRef<() => void>();
  const debounceScrollEnd = useDebounceCallback(() => {
    if (removeUnlinkedScrollListenerRef.current) {
      removeUnlinkedScrollListenerRef.current();
      removeUnlinkedScrollListenerRef.current = undefined;
    }
  }, 100);

  React.useEffect(() => {
    const viewport = scrollAreaContext.viewport;
    if (viewport && thumb) {
      const handleThumbPositionChange = () => onThumbPositionChange(thumb);
      const handleScroll = () => {
        debounceScrollEnd();
        if (!removeUnlinkedScrollListenerRef.current) {
          const listener = addUnlinkedScrollListener(viewport, handleThumbPositionChange);
          removeUnlinkedScrollListenerRef.current = listener;
          handleThumbPositionChange();
        }
      };
      handleThumbPositionChange();
      viewport.addEventListener('scroll', handleScroll);
      return () => viewport.removeEventListener('scroll', handleScroll);
    }
  }, [scrollAreaContext.viewport, thumb, debounceScrollEnd, onThumbPositionChange]);

  useResizeObserver(scrollAreaContext.viewport, () => {
    if (thumb) onThumbPositionChange(thumb);
  });

  return scrollbarContext.hasThumb ? (
    <Primitive
      {...thumbProps}
      ref={composedRef}
      style={{
        width: 'var(--radix-scroll-area-thumb-width)',
        height: 'var(--radix-scroll-area-thumb-height)',
        ...style,
      }}
      onPointerDownCapture={composeEventHandlers(props.onPointerDownCapture, (event) => {
        const thumb = event.target as HTMLElement;
        const thumbRect = thumb.getBoundingClientRect();
        const x = event.clientX - thumbRect.left;
        const y = event.clientY - thumbRect.top;
        scrollbarContext.onThumbPointerDown({ x, y });
      })}
      onPointerUp={composeEventHandlers(props.onPointerUp, scrollbarContext.onThumbPointerUp)}
    />
  ) : null;
}) as ScrollAreaThumbPrimitive;

ScrollAreaThumb.displayName = THUMB_NAME;

/* -------------------------------------------------------------------------------------------------
 * ScrollAreaCorner
 * -----------------------------------------------------------------------------------------------*/

const CORNER_NAME = 'ScrollAreaCorner';

type ScrollAreaCornerOwnProps = Polymorphic.OwnProps<typeof ScrollAreaCornerImpl>;
type ScrollAreaCornerPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof ScrollAreaCornerImpl>,
  ScrollAreaCornerOwnProps
>;

const ScrollAreaCorner = React.forwardRef((props, forwardedRef) => {
  const context = useScrollAreaContext(CORNER_NAME);
  const hasBothScrollbarsVisible = Boolean(context.scrollbarX && context.scrollbarY);
  const hasCorner = context.type !== 'scroll' && hasBothScrollbarsVisible;
  return hasCorner ? <ScrollAreaCornerImpl {...props} ref={forwardedRef} /> : null;
}) as ScrollAreaCornerPrimitive;

ScrollAreaCorner.displayName = CORNER_NAME;

/* -----------------------------------------------------------------------------------------------*/

type ScrollAreaCornerImplOwnProps = Polymorphic.OwnProps<typeof Primitive>;
type ScrollAreaCornerImplPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof Primitive>,
  ScrollAreaCornerImplOwnProps
>;

const ScrollAreaCornerImpl = React.forwardRef((props, forwardedRef) => {
  const context = useScrollAreaContext(CORNER_NAME);
  const [width, setWidth] = React.useState<number>();
  const [height, setHeight] = React.useState<number>();
  const hasSize = Boolean(width && height);

  useResizeObserver(context.scrollbarX, () => {
    const height = context.scrollbarX?.offsetHeight;
    context.onCornerHeightChange(height || 0);
    setHeight(height);
  });

  useResizeObserver(context.scrollbarY, () => {
    const width = context.scrollbarY?.offsetWidth;
    context.onCornerWidthChange(width || 0);
    setWidth(width);
  });

  return hasSize ? (
    <Primitive
      {...props}
      ref={forwardedRef}
      style={{
        width,
        height,
        position: 'absolute',
        right: context.dir === 'ltr' ? 0 : undefined,
        left: context.dir === 'rtl' ? 0 : undefined,
        bottom: 0,
        ...props.style,
      }}
    />
  ) : null;
}) as ScrollAreaCornerImplPrimitive;

/* -----------------------------------------------------------------------------------------------*/

function toInt(value?: string) {
  return value ? parseInt(value, 10) : 0;
}

function getThumbRatio(viewportSize: number, contentSize: number) {
  const ratio = viewportSize / contentSize;
  return isNaN(ratio) ? 0 : ratio;
}

function getThumbSize(sizes: Sizes) {
  const ratio = getThumbRatio(sizes.viewport, sizes.content);
  const scrollbarPadding = sizes.scrollbar.paddingStart + sizes.scrollbar.paddingEnd;
  const thumbSize = (sizes.scrollbar.size - scrollbarPadding) * ratio;
  // minimum of 18 matches macOS minimum
  return Math.max(thumbSize, 18);
}

function getScrollPositionFromPointer(
  pointerPos: number,
  pointerOffset: number,
  sizes: Sizes,
  dir: Direction = 'ltr'
) {
  const thumbSizePx = getThumbSize(sizes);
  const thumbCenter = thumbSizePx / 2;
  const offset = pointerOffset || thumbCenter;
  const thumbOffsetFromEnd = thumbSizePx - offset;
  const minPointerPos = sizes.scrollbar.paddingStart + offset;
  const maxPointerPos = sizes.scrollbar.size - sizes.scrollbar.paddingEnd - thumbOffsetFromEnd;
  const maxScrollPos = sizes.content - sizes.viewport;
  const scrollRange = dir === 'ltr' ? [0, maxScrollPos] : [maxScrollPos * -1, 0];
  const interpolate = linearScale([minPointerPos, maxPointerPos], scrollRange as [number, number]);
  return interpolate(pointerPos);
}

function getThumbOffsetFromScroll(scrollPos: number, sizes: Sizes, dir: Direction = 'ltr') {
  const thumbSizePx = getThumbSize(sizes);
  const scrollbarPadding = sizes.scrollbar.paddingStart + sizes.scrollbar.paddingEnd;
  const scrollbar = sizes.scrollbar.size - scrollbarPadding;
  const maxScrollPos = sizes.content - sizes.viewport;
  const maxThumbPos = scrollbar - thumbSizePx;
  const scrollClampRange = dir === 'ltr' ? [0, maxScrollPos] : [maxScrollPos * -1, 0];
  const scrollWithoutMomentum = clamp(scrollPos, scrollClampRange as [number, number]);
  const interpolate = linearScale([0, maxScrollPos], [0, maxThumbPos]);
  return interpolate(scrollWithoutMomentum);
}

function scrollingWithinScrollbarBounds(scrollPos: number, maxScrollPos: number) {
  return scrollPos > 0 && scrollPos < maxScrollPos;
}

// Custom scroll handler to avoid scroll-linked effects
// https://developer.mozilla.org/en-US/docs/Mozilla/Performance/Scroll-linked_effects
const addUnlinkedScrollListener = (node: HTMLElement, handler = () => {}) => {
  let prevPosition = { left: node.scrollLeft, top: node.scrollTop };
  let rAF = 0;
  (function loop() {
    const position = { left: node.scrollLeft, top: node.scrollTop };
    const isHorizontalScroll = prevPosition.left !== position.left;
    const isVerticalScroll = prevPosition.top !== position.top;
    if (isHorizontalScroll || isVerticalScroll) handler();
    prevPosition = position;
    rAF = window.requestAnimationFrame(loop);
  })();
  return () => window.cancelAnimationFrame(rAF);
};

function useDebounceCallback(callback: () => void, delay: number) {
  const handleCallback = useCallbackRef(callback);
  const debounceTimerRef = React.useRef(0);
  React.useEffect(() => () => window.clearTimeout(debounceTimerRef.current), []);
  return React.useCallback(() => {
    window.clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = window.setTimeout(handleCallback, delay);
  }, [handleCallback, delay]);
}

function useResizeObserver(element: HTMLElement | null, onResize: () => void) {
  // debounce to prevent error `ResizeObserver loop completed with undelivered notifications`
  const handleResize = useDebounceCallback(onResize, 10);
  React.useEffect(() => {
    if (element) {
      const resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(element);
      return () => {
        handleResize();
        resizeObserver.unobserve(element);
      };
    }
  }, [element, handleResize]);
}

/* -----------------------------------------------------------------------------------------------*/

const Root = ScrollArea;
const Viewport = ScrollAreaViewport;
const Scrollbar = ScrollAreaScrollbar;
const Thumb = ScrollAreaThumb;
const Corner = ScrollAreaCorner;

export {
  ScrollArea,
  ScrollAreaViewport,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaCorner,
  //
  Root,
  Viewport,
  Scrollbar,
  Thumb,
  Corner,
};
export type {
  ScrollAreaPrimitive,
  ScrollAreaViewportPrimitive,
  ScrollAreaScrollbarPrimitive,
  ScrollAreaThumbPrimitive,
  ScrollAreaCornerPrimitive,
};
