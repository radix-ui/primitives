import * as React from 'react';
import { Primitive } from '@radix-ui/react-primitive';
import { Presence } from '@radix-ui/react-presence';
import { createContextScope } from '@radix-ui/react-context';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import { useCallbackRef } from '@radix-ui/react-use-callback-ref';
import { useDirection } from '@radix-ui/react-direction';
import { useLayoutEffect } from '@radix-ui/react-use-layout-effect';
import { clamp } from '@radix-ui/number';
import { composeEventHandlers } from '@radix-ui/primitive';
import { useStateMachine } from './use-state-machine';

import type { Scope } from '@radix-ui/react-context';

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

/* -------------------------------------------------------------------------------------------------
 * ScrollArea
 * -----------------------------------------------------------------------------------------------*/

const SCROLL_AREA_NAME = 'ScrollArea';

type ScopedProps<P> = P & { __scopeScrollArea?: Scope };
const [createScrollAreaContext, createScrollAreaScope] = createContextScope(SCROLL_AREA_NAME);

type ScrollAreaContextValue = {
  type: 'auto' | 'always' | 'scroll' | 'hover';
  dir: Direction;
  scrollHideDelay: number;
  scrollArea: ScrollAreaElement | null;
  viewport: ScrollAreaViewportElement | null;
  onViewportChange(viewport: ScrollAreaViewportElement | null): void;
  content: HTMLDivElement | null;
  onContentChange(content: HTMLDivElement): void;
  scrollbarX: ScrollAreaScrollbarElement | null;
  onScrollbarXChange(scrollbar: ScrollAreaScrollbarElement | null): void;
  scrollbarXEnabled: boolean;
  onScrollbarXEnabledChange(rendered: boolean): void;
  scrollbarY: ScrollAreaScrollbarElement | null;
  onScrollbarYChange(scrollbar: ScrollAreaScrollbarElement | null): void;
  scrollbarYEnabled: boolean;
  onScrollbarYEnabledChange(rendered: boolean): void;
  onCornerWidthChange(width: number): void;
  onCornerHeightChange(height: number): void;
};

const [ScrollAreaProvider, useScrollAreaContext] =
  createScrollAreaContext<ScrollAreaContextValue>(SCROLL_AREA_NAME);

type ScrollAreaElement = React.ElementRef<typeof Primitive.div>;
type PrimitiveDivProps = React.ComponentPropsWithoutRef<typeof Primitive.div>;
interface ScrollAreaProps extends PrimitiveDivProps {
  type?: ScrollAreaContextValue['type'];
  dir?: ScrollAreaContextValue['dir'];
  scrollHideDelay?: number;
}

const ScrollArea = React.forwardRef<ScrollAreaElement, ScrollAreaProps>(
  (props: ScopedProps<ScrollAreaProps>, forwardedRef) => {
    const {
      __scopeScrollArea,
      type = 'hover',
      dir,
      scrollHideDelay = 600,
      ...scrollAreaProps
    } = props;
    const [scrollArea, setScrollArea] = React.useState<ScrollAreaElement | null>(null);
    const [viewport, setViewport] = React.useState<ScrollAreaViewportElement | null>(null);
    const [content, setContent] = React.useState<HTMLDivElement | null>(null);
    const [scrollbarX, setScrollbarX] = React.useState<ScrollAreaScrollbarElement | null>(null);
    const [scrollbarY, setScrollbarY] = React.useState<ScrollAreaScrollbarElement | null>(null);
    const [cornerWidth, setCornerWidth] = React.useState(0);
    const [cornerHeight, setCornerHeight] = React.useState(0);
    const [scrollbarXEnabled, setScrollbarXEnabled] = React.useState(false);
    const [scrollbarYEnabled, setScrollbarYEnabled] = React.useState(false);
    const composedRefs = useComposedRefs(forwardedRef, (node) => setScrollArea(node));
    const direction = useDirection(dir);

    return (
      <ScrollAreaProvider
        scope={__scopeScrollArea}
        type={type}
        dir={direction}
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
        <Primitive.div
          dir={direction}
          {...scrollAreaProps}
          ref={composedRefs}
          style={{
            position: 'relative',
            // Pass corner sizes as CSS vars to reduce re-renders of context consumers
            ['--radix-scroll-area-corner-width' as any]: cornerWidth + 'px',
            ['--radix-scroll-area-corner-height' as any]: cornerHeight + 'px',
            ...props.style,
          }}
        />
      </ScrollAreaProvider>
    );
  }
);

ScrollArea.displayName = SCROLL_AREA_NAME;

/* -------------------------------------------------------------------------------------------------
 * ScrollAreaViewport
 * -----------------------------------------------------------------------------------------------*/

const VIEWPORT_NAME = 'ScrollAreaViewport';

type ScrollAreaViewportElement = React.ElementRef<typeof Primitive.div>;
interface ScrollAreaViewportProps extends PrimitiveDivProps {
  nonce?: string;
}

const ScrollAreaViewport = React.forwardRef<ScrollAreaViewportElement, ScrollAreaViewportProps>(
  (props: ScopedProps<ScrollAreaViewportProps>, forwardedRef) => {
    const { __scopeScrollArea, children, nonce, ...viewportProps } = props;
    const context = useScrollAreaContext(VIEWPORT_NAME, __scopeScrollArea);
    const ref = React.useRef<ScrollAreaViewportElement>(null);
    const composedRefs = useComposedRefs(forwardedRef, ref, context.onViewportChange);
    return (
      <>
        {/* Hide scrollbars cross-browser and enable momentum scroll for touch devices */}
        <style
          dangerouslySetInnerHTML={{
            __html: `[data-radix-scroll-area-viewport]{scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch;}[data-radix-scroll-area-viewport]::-webkit-scrollbar{display:none}`,
          }}
          nonce={nonce}
        />
        <Primitive.div
          data-radix-scroll-area-viewport=""
          {...viewportProps}
          ref={composedRefs}
          style={{
            /**
             * We don't support `visible` because the intention is to have at least one scrollbar
             * if this component is used and `visible` will behave like `auto` in that case
             * https://developer.mozilla.org/en-US/docs/Web/CSS/overflow#description
             *
             * We don't handle `auto` because the intention is for the native implementation
             * to be hidden if using this component. We just want to ensure the node is scrollable
             * so could have used either `scroll` or `auto` here. We picked `scroll` to prevent
             * the browser from having to work out whether to render native scrollbars or not,
             * we tell it to with the intention of hiding them in CSS.
             */
            overflowX: context.scrollbarXEnabled ? 'scroll' : 'hidden',
            overflowY: context.scrollbarYEnabled ? 'scroll' : 'hidden',
            ...props.style,
          }}
        >
          {/**
           * `display: table` ensures our content div will match the size of its children in both
           * horizontal and vertical axis so we can determine if scroll width/height changed and
           * recalculate thumb sizes. This doesn't account for children with *percentage*
           * widths that change. We'll wait to see what use-cases consumers come up with there
           * before trying to resolve it.
           */}
          <div ref={context.onContentChange} style={{ minWidth: '100%', display: 'table' }}>
            {children}
          </div>
        </Primitive.div>
      </>
    );
  }
);

ScrollAreaViewport.displayName = VIEWPORT_NAME;

/* -------------------------------------------------------------------------------------------------
 * ScrollAreaScrollbar
 * -----------------------------------------------------------------------------------------------*/

const SCROLLBAR_NAME = 'ScrollAreaScrollbar';

type ScrollAreaScrollbarElement = ScrollAreaScrollbarVisibleElement;
interface ScrollAreaScrollbarProps extends ScrollAreaScrollbarVisibleProps {
  forceMount?: true;
}

const ScrollAreaScrollbar = React.forwardRef<ScrollAreaScrollbarElement, ScrollAreaScrollbarProps>(
  (props: ScopedProps<ScrollAreaScrollbarProps>, forwardedRef) => {
    const { forceMount, ...scrollbarProps } = props;
    const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
    const { onScrollbarXEnabledChange, onScrollbarYEnabledChange } = context;
    const isHorizontal = props.orientation === 'horizontal';

    React.useEffect(() => {
      isHorizontal ? onScrollbarXEnabledChange(true) : onScrollbarYEnabledChange(true);
      return () => {
        isHorizontal ? onScrollbarXEnabledChange(false) : onScrollbarYEnabledChange(false);
      };
    }, [isHorizontal, onScrollbarXEnabledChange, onScrollbarYEnabledChange]);

    return context.type === 'hover' ? (
      <ScrollAreaScrollbarHover {...scrollbarProps} ref={forwardedRef} forceMount={forceMount} />
    ) : context.type === 'scroll' ? (
      <ScrollAreaScrollbarScroll {...scrollbarProps} ref={forwardedRef} forceMount={forceMount} />
    ) : context.type === 'auto' ? (
      <ScrollAreaScrollbarAuto {...scrollbarProps} ref={forwardedRef} forceMount={forceMount} />
    ) : context.type === 'always' ? (
      <ScrollAreaScrollbarVisible {...scrollbarProps} ref={forwardedRef} />
    ) : null;
  }
);

ScrollAreaScrollbar.displayName = SCROLLBAR_NAME;

/* -----------------------------------------------------------------------------------------------*/

type ScrollAreaScrollbarHoverElement = ScrollAreaScrollbarAutoElement;
interface ScrollAreaScrollbarHoverProps extends ScrollAreaScrollbarAutoProps {
  forceMount?: true;
}

const ScrollAreaScrollbarHover = React.forwardRef<
  ScrollAreaScrollbarHoverElement,
  ScrollAreaScrollbarHoverProps
>((props: ScopedProps<ScrollAreaScrollbarHoverProps>, forwardedRef) => {
  const { forceMount, ...scrollbarProps } = props;
  const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
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
        window.clearTimeout(hideTimer);
        scrollArea.removeEventListener('pointerenter', handlePointerEnter);
        scrollArea.removeEventListener('pointerleave', handlePointerLeave);
      };
    }
  }, [context.scrollArea, context.scrollHideDelay]);

  return (
    <Presence present={forceMount || visible}>
      <ScrollAreaScrollbarAuto
        data-state={visible ? 'visible' : 'hidden'}
        {...scrollbarProps}
        ref={forwardedRef}
      />
    </Presence>
  );
});

type ScrollAreaScrollbarScrollElement = ScrollAreaScrollbarVisibleElement;
interface ScrollAreaScrollbarScrollProps extends ScrollAreaScrollbarVisibleProps {
  forceMount?: true;
}

const ScrollAreaScrollbarScroll = React.forwardRef<
  ScrollAreaScrollbarScrollElement,
  ScrollAreaScrollbarScrollProps
>((props: ScopedProps<ScrollAreaScrollbarScrollProps>, forwardedRef) => {
  const { forceMount, ...scrollbarProps } = props;
  const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
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
        data-state={state === 'hidden' ? 'hidden' : 'visible'}
        {...scrollbarProps}
        ref={forwardedRef}
        onPointerEnter={composeEventHandlers(props.onPointerEnter, () => send('POINTER_ENTER'))}
        onPointerLeave={composeEventHandlers(props.onPointerLeave, () => send('POINTER_LEAVE'))}
      />
    </Presence>
  );
});

type ScrollAreaScrollbarAutoElement = ScrollAreaScrollbarVisibleElement;
interface ScrollAreaScrollbarAutoProps extends ScrollAreaScrollbarVisibleProps {
  forceMount?: true;
}

const ScrollAreaScrollbarAuto = React.forwardRef<
  ScrollAreaScrollbarAutoElement,
  ScrollAreaScrollbarAutoProps
>((props: ScopedProps<ScrollAreaScrollbarAutoProps>, forwardedRef) => {
  const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
  const { forceMount, ...scrollbarProps } = props;
  const [visible, setVisible] = React.useState(false);
  const isHorizontal = props.orientation === 'horizontal';
  const handleResize = useDebounceCallback(() => {
    if (context.viewport) {
      const isOverflowX = context.viewport.offsetWidth < context.viewport.scrollWidth;
      const isOverflowY = context.viewport.offsetHeight < context.viewport.scrollHeight;
      setVisible(isHorizontal ? isOverflowX : isOverflowY);
    }
  }, 10);

  useResizeObserver(context.viewport, handleResize);
  useResizeObserver(context.content, handleResize);

  return (
    <Presence present={forceMount || visible}>
      <ScrollAreaScrollbarVisible
        data-state={visible ? 'visible' : 'hidden'}
        {...scrollbarProps}
        ref={forwardedRef}
      />
    </Presence>
  );
});

/* -----------------------------------------------------------------------------------------------*/

type ScrollAreaScrollbarVisibleElement = ScrollAreaScrollbarAxisElement;
interface ScrollAreaScrollbarVisibleProps
  extends Omit<ScrollAreaScrollbarAxisProps, keyof ScrollAreaScrollbarAxisPrivateProps> {
  orientation?: 'horizontal' | 'vertical';
}

const ScrollAreaScrollbarVisible = React.forwardRef<
  ScrollAreaScrollbarVisibleElement,
  ScrollAreaScrollbarVisibleProps
>((props: ScopedProps<ScrollAreaScrollbarVisibleProps>, forwardedRef) => {
  const { orientation = 'vertical', ...scrollbarProps } = props;
  const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
  const thumbRef = React.useRef<ScrollAreaThumbElement | null>(null);
  const pointerOffsetRef = React.useRef(0);
  const [sizes, setSizes] = React.useState<Sizes>({
    content: 0,
    viewport: 0,
    scrollbar: { size: 0, paddingStart: 0, paddingEnd: 0 },
  });
  const thumbRatio = getThumbRatio(sizes.viewport, sizes.content);

  type UncommonProps = 'onThumbPositionChange' | 'onDragScroll' | 'onWheelScroll';
  const commonProps: Omit<ScrollAreaScrollbarAxisPrivateProps, UncommonProps> = {
    ...scrollbarProps,
    sizes,
    onSizesChange: setSizes,
    hasThumb: Boolean(thumbRatio > 0 && thumbRatio < 1),
    onThumbChange: (thumb) => (thumbRef.current = thumb),
    onThumbPointerUp: () => (pointerOffsetRef.current = 0),
    onThumbPointerDown: (pointerPos) => (pointerOffsetRef.current = pointerPos),
  };

  function getScrollPosition(pointerPos: number, dir?: Direction) {
    return getScrollPositionFromPointer(pointerPos, pointerOffsetRef.current, sizes, dir);
  }

  if (orientation === 'horizontal') {
    return (
      <ScrollAreaScrollbarX
        {...commonProps}
        ref={forwardedRef}
        onThumbPositionChange={() => {
          if (context.viewport && thumbRef.current) {
            const scrollPos = context.viewport.scrollLeft;
            const offset = getThumbOffsetFromScroll(scrollPos, sizes, context.dir);
            thumbRef.current.style.transform = `translate3d(${offset}px, 0, 0)`;
          }
        }}
        onWheelScroll={(scrollPos) => {
          if (context.viewport) context.viewport.scrollLeft = scrollPos;
        }}
        onDragScroll={(pointerPos) => {
          if (context.viewport) {
            context.viewport.scrollLeft = getScrollPosition(pointerPos, context.dir);
          }
        }}
      />
    );
  }

  if (orientation === 'vertical') {
    return (
      <ScrollAreaScrollbarY
        {...commonProps}
        ref={forwardedRef}
        onThumbPositionChange={() => {
          if (context.viewport && thumbRef.current) {
            const scrollPos = context.viewport.scrollTop;
            const offset = getThumbOffsetFromScroll(scrollPos, sizes);
            thumbRef.current.style.transform = `translate3d(0, ${offset}px, 0)`;
          }
        }}
        onWheelScroll={(scrollPos) => {
          if (context.viewport) context.viewport.scrollTop = scrollPos;
        }}
        onDragScroll={(pointerPos) => {
          if (context.viewport) context.viewport.scrollTop = getScrollPosition(pointerPos);
        }}
      />
    );
  }

  return null;
});

/* -----------------------------------------------------------------------------------------------*/

type ScrollAreaScrollbarAxisPrivateProps = {
  hasThumb: boolean;
  sizes: Sizes;
  onSizesChange(sizes: Sizes): void;
  onThumbChange(thumb: ScrollAreaThumbElement | null): void;
  onThumbPointerDown(pointerPos: number): void;
  onThumbPointerUp(): void;
  onThumbPositionChange(): void;
  onWheelScroll(scrollPos: number): void;
  onDragScroll(pointerPos: number): void;
};

type ScrollAreaScrollbarAxisElement = ScrollAreaScrollbarImplElement;
interface ScrollAreaScrollbarAxisProps
  extends Omit<ScrollAreaScrollbarImplProps, keyof ScrollAreaScrollbarImplPrivateProps>,
    ScrollAreaScrollbarAxisPrivateProps {}

const ScrollAreaScrollbarX = React.forwardRef<
  ScrollAreaScrollbarAxisElement,
  ScrollAreaScrollbarAxisProps
>((props: ScopedProps<ScrollAreaScrollbarAxisProps>, forwardedRef) => {
  const { sizes, onSizesChange, ...scrollbarProps } = props;
  const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
  const [computedStyle, setComputedStyle] = React.useState<CSSStyleDeclaration>();
  const ref = React.useRef<ScrollAreaScrollbarAxisElement>(null);
  const composeRefs = useComposedRefs(forwardedRef, ref, context.onScrollbarXChange);

  React.useEffect(() => {
    if (ref.current) setComputedStyle(getComputedStyle(ref.current));
  }, [ref]);

  return (
    <ScrollAreaScrollbarImpl
      data-orientation="horizontal"
      {...scrollbarProps}
      ref={composeRefs}
      sizes={sizes}
      style={{
        bottom: 0,
        left: context.dir === 'rtl' ? 'var(--radix-scroll-area-corner-width)' : 0,
        right: context.dir === 'ltr' ? 'var(--radix-scroll-area-corner-width)' : 0,
        ['--radix-scroll-area-thumb-width' as any]: getThumbSize(sizes) + 'px',
        ...props.style,
      }}
      onThumbPointerDown={(pointerPos) => props.onThumbPointerDown(pointerPos.x)}
      onDragScroll={(pointerPos) => props.onDragScroll(pointerPos.x)}
      onWheelScroll={(event, maxScrollPos) => {
        if (context.viewport) {
          const scrollPos = context.viewport.scrollLeft + event.deltaX;
          props.onWheelScroll(scrollPos);
          // prevent window scroll when wheeling on scrollbar
          if (isScrollingWithinScrollbarBounds(scrollPos, maxScrollPos)) {
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
  );
});

const ScrollAreaScrollbarY = React.forwardRef<
  ScrollAreaScrollbarAxisElement,
  ScrollAreaScrollbarAxisProps
>((props: ScopedProps<ScrollAreaScrollbarAxisProps>, forwardedRef) => {
  const { sizes, onSizesChange, ...scrollbarProps } = props;
  const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
  const [computedStyle, setComputedStyle] = React.useState<CSSStyleDeclaration>();
  const ref = React.useRef<ScrollAreaScrollbarAxisElement>(null);
  const composeRefs = useComposedRefs(forwardedRef, ref, context.onScrollbarYChange);

  React.useEffect(() => {
    if (ref.current) setComputedStyle(getComputedStyle(ref.current));
  }, [ref]);

  return (
    <ScrollAreaScrollbarImpl
      data-orientation="vertical"
      {...scrollbarProps}
      ref={composeRefs}
      sizes={sizes}
      style={{
        top: 0,
        right: context.dir === 'ltr' ? 0 : undefined,
        left: context.dir === 'rtl' ? 0 : undefined,
        bottom: 'var(--radix-scroll-area-corner-height)',
        ['--radix-scroll-area-thumb-height' as any]: getThumbSize(sizes) + 'px',
        ...props.style,
      }}
      onThumbPointerDown={(pointerPos) => props.onThumbPointerDown(pointerPos.y)}
      onDragScroll={(pointerPos) => props.onDragScroll(pointerPos.y)}
      onWheelScroll={(event, maxScrollPos) => {
        if (context.viewport) {
          const scrollPos = context.viewport.scrollTop + event.deltaY;
          props.onWheelScroll(scrollPos);
          // prevent window scroll when wheeling on scrollbar
          if (isScrollingWithinScrollbarBounds(scrollPos, maxScrollPos)) {
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
  );
});

/* -----------------------------------------------------------------------------------------------*/

type ScrollbarContext = {
  hasThumb: boolean;
  scrollbar: ScrollAreaScrollbarElement | null;
  onThumbChange(thumb: ScrollAreaThumbElement | null): void;
  onThumbPointerUp(): void;
  onThumbPointerDown(pointerPos: { x: number; y: number }): void;
  onThumbPositionChange(): void;
};

const [ScrollbarProvider, useScrollbarContext] =
  createScrollAreaContext<ScrollbarContext>(SCROLLBAR_NAME);

type ScrollAreaScrollbarImplElement = React.ElementRef<typeof Primitive.div>;
type ScrollAreaScrollbarImplPrivateProps = {
  sizes: Sizes;
  hasThumb: boolean;
  onThumbChange: ScrollbarContext['onThumbChange'];
  onThumbPointerUp: ScrollbarContext['onThumbPointerUp'];
  onThumbPointerDown: ScrollbarContext['onThumbPointerDown'];
  onThumbPositionChange: ScrollbarContext['onThumbPositionChange'];
  onWheelScroll(event: WheelEvent, maxScrollPos: number): void;
  onDragScroll(pointerPos: { x: number; y: number }): void;
  onResize(): void;
};
interface ScrollAreaScrollbarImplProps
  extends Omit<PrimitiveDivProps, keyof ScrollAreaScrollbarImplPrivateProps>,
    ScrollAreaScrollbarImplPrivateProps {}

const ScrollAreaScrollbarImpl = React.forwardRef<
  ScrollAreaScrollbarImplElement,
  ScrollAreaScrollbarImplProps
>((props: ScopedProps<ScrollAreaScrollbarImplProps>, forwardedRef) => {
  const {
    __scopeScrollArea,
    sizes,
    hasThumb,
    onThumbChange,
    onThumbPointerUp,
    onThumbPointerDown,
    onThumbPositionChange,
    onDragScroll,
    onWheelScroll,
    onResize,
    ...scrollbarProps
  } = props;
  const context = useScrollAreaContext(SCROLLBAR_NAME, __scopeScrollArea);
  const [scrollbar, setScrollbar] = React.useState<ScrollAreaScrollbarElement | null>(null);
  const composeRefs = useComposedRefs(forwardedRef, (node) => setScrollbar(node));
  const rectRef = React.useRef<DOMRect | null>(null);
  const prevWebkitUserSelectRef = React.useRef<string>('');
  const viewport = context.viewport;
  const maxScrollPos = sizes.content - sizes.viewport;
  const handleWheelScroll = useCallbackRef(onWheelScroll);
  const handleThumbPositionChange = useCallbackRef(onThumbPositionChange);
  const handleResize = useDebounceCallback(onResize, 10);

  function handleDragScroll(event: React.PointerEvent<HTMLElement>) {
    if (rectRef.current) {
      const x = event.clientX - rectRef.current.left;
      const y = event.clientY - rectRef.current.top;
      onDragScroll({ x, y });
    }
  }

  /**
   * We bind wheel event imperatively so we can switch off passive
   * mode for document wheel event to allow it to be prevented
   */
  React.useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      const element = event.target as HTMLElement;
      const isScrollbarWheel = scrollbar?.contains(element);
      if (isScrollbarWheel) handleWheelScroll(event, maxScrollPos);
    };
    document.addEventListener('wheel', handleWheel, { passive: false });
    return () => document.removeEventListener('wheel', handleWheel, { passive: false } as any);
  }, [viewport, scrollbar, maxScrollPos, handleWheelScroll]);

  /**
   * Update thumb position on sizes change
   */
  React.useEffect(handleThumbPositionChange, [sizes, handleThumbPositionChange]);

  useResizeObserver(scrollbar, handleResize);
  useResizeObserver(context.content, handleResize);

  return (
    <ScrollbarProvider
      scope={__scopeScrollArea}
      scrollbar={scrollbar}
      hasThumb={hasThumb}
      onThumbChange={useCallbackRef(onThumbChange)}
      onThumbPointerUp={useCallbackRef(onThumbPointerUp)}
      onThumbPositionChange={handleThumbPositionChange}
      onThumbPointerDown={useCallbackRef(onThumbPointerDown)}
    >
      <Primitive.div
        {...scrollbarProps}
        ref={composeRefs}
        style={{ position: 'absolute', ...scrollbarProps.style }}
        onPointerDown={composeEventHandlers(props.onPointerDown, (event) => {
          const mainPointer = 0;
          if (event.button === mainPointer) {
            const element = event.target as HTMLElement;
            element.setPointerCapture(event.pointerId);
            rectRef.current = scrollbar!.getBoundingClientRect();
            // pointer capture doesn't prevent text selection in Safari
            // so we remove text selection manually when scrolling
            prevWebkitUserSelectRef.current = document.body.style.webkitUserSelect;
            document.body.style.webkitUserSelect = 'none';
            if (context.viewport) context.viewport.style.scrollBehavior = 'auto';
            handleDragScroll(event);
          }
        })}
        onPointerMove={composeEventHandlers(props.onPointerMove, handleDragScroll)}
        onPointerUp={composeEventHandlers(props.onPointerUp, (event) => {
          const element = event.target as HTMLElement;
          if (element.hasPointerCapture(event.pointerId)) {
            element.releasePointerCapture(event.pointerId);
          }
          document.body.style.webkitUserSelect = prevWebkitUserSelectRef.current;
          if (context.viewport) context.viewport.style.scrollBehavior = '';
          rectRef.current = null;
        })}
      />
    </ScrollbarProvider>
  );
});

/* -------------------------------------------------------------------------------------------------
 * ScrollAreaThumb
 * -----------------------------------------------------------------------------------------------*/

const THUMB_NAME = 'ScrollAreaThumb';

type ScrollAreaThumbElement = ScrollAreaThumbImplElement;
interface ScrollAreaThumbProps extends ScrollAreaThumbImplProps {
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: true;
}

const ScrollAreaThumb = React.forwardRef<ScrollAreaThumbElement, ScrollAreaThumbProps>(
  (props: ScopedProps<ScrollAreaThumbProps>, forwardedRef) => {
    const { forceMount, ...thumbProps } = props;
    const scrollbarContext = useScrollbarContext(THUMB_NAME, props.__scopeScrollArea);
    return (
      <Presence present={forceMount || scrollbarContext.hasThumb}>
        <ScrollAreaThumbImpl ref={forwardedRef} {...thumbProps} />
      </Presence>
    );
  }
);

type ScrollAreaThumbImplElement = React.ElementRef<typeof Primitive.div>;
interface ScrollAreaThumbImplProps extends PrimitiveDivProps {}

const ScrollAreaThumbImpl = React.forwardRef<ScrollAreaThumbImplElement, ScrollAreaThumbImplProps>(
  (props: ScopedProps<ScrollAreaThumbImplProps>, forwardedRef) => {
    const { __scopeScrollArea, style, ...thumbProps } = props;
    const scrollAreaContext = useScrollAreaContext(THUMB_NAME, __scopeScrollArea);
    const scrollbarContext = useScrollbarContext(THUMB_NAME, __scopeScrollArea);
    const { onThumbPositionChange } = scrollbarContext;
    const composedRef = useComposedRefs(forwardedRef, (node) =>
      scrollbarContext.onThumbChange(node)
    );
    const removeUnlinkedScrollListenerRef = React.useRef<() => void>(undefined);
    const debounceScrollEnd = useDebounceCallback(() => {
      if (removeUnlinkedScrollListenerRef.current) {
        removeUnlinkedScrollListenerRef.current();
        removeUnlinkedScrollListenerRef.current = undefined;
      }
    }, 100);

    React.useEffect(() => {
      const viewport = scrollAreaContext.viewport;
      if (viewport) {
        /**
         * We only bind to native scroll event so we know when scroll starts and ends.
         * When scroll starts we start a requestAnimationFrame loop that checks for
         * changes to scroll position. That rAF loop triggers our thumb position change
         * when relevant to avoid scroll-linked effects. We cancel the loop when scroll ends.
         * https://developer.mozilla.org/en-US/docs/Mozilla/Performance/Scroll-linked_effects
         */
        const handleScroll = () => {
          debounceScrollEnd();
          if (!removeUnlinkedScrollListenerRef.current) {
            const listener = addUnlinkedScrollListener(viewport, onThumbPositionChange);
            removeUnlinkedScrollListenerRef.current = listener;
            onThumbPositionChange();
          }
        };
        onThumbPositionChange();
        viewport.addEventListener('scroll', handleScroll);
        return () => viewport.removeEventListener('scroll', handleScroll);
      }
    }, [scrollAreaContext.viewport, debounceScrollEnd, onThumbPositionChange]);

    return (
      <Primitive.div
        data-state={scrollbarContext.hasThumb ? 'visible' : 'hidden'}
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
    );
  }
);

ScrollAreaThumb.displayName = THUMB_NAME;

/* -------------------------------------------------------------------------------------------------
 * ScrollAreaCorner
 * -----------------------------------------------------------------------------------------------*/

const CORNER_NAME = 'ScrollAreaCorner';

type ScrollAreaCornerElement = ScrollAreaCornerImplElement;
interface ScrollAreaCornerProps extends ScrollAreaCornerImplProps {}

const ScrollAreaCorner = React.forwardRef<ScrollAreaCornerElement, ScrollAreaCornerProps>(
  (props: ScopedProps<ScrollAreaCornerProps>, forwardedRef) => {
    const context = useScrollAreaContext(CORNER_NAME, props.__scopeScrollArea);
    const hasBothScrollbarsVisible = Boolean(context.scrollbarX && context.scrollbarY);
    const hasCorner = context.type !== 'scroll' && hasBothScrollbarsVisible;
    return hasCorner ? <ScrollAreaCornerImpl {...props} ref={forwardedRef} /> : null;
  }
);

ScrollAreaCorner.displayName = CORNER_NAME;

/* -----------------------------------------------------------------------------------------------*/

type ScrollAreaCornerImplElement = React.ElementRef<typeof Primitive.div>;
interface ScrollAreaCornerImplProps extends PrimitiveDivProps {}

const ScrollAreaCornerImpl = React.forwardRef<
  ScrollAreaCornerImplElement,
  ScrollAreaCornerImplProps
>((props: ScopedProps<ScrollAreaCornerImplProps>, forwardedRef) => {
  const { __scopeScrollArea, ...cornerProps } = props;
  const context = useScrollAreaContext(CORNER_NAME, __scopeScrollArea);
  const [width, setWidth] = React.useState(0);
  const [height, setHeight] = React.useState(0);
  const hasSize = Boolean(width && height);

  useResizeObserver(context.scrollbarX, () => {
    const height = context.scrollbarX?.offsetHeight || 0;
    context.onCornerHeightChange(height);
    setHeight(height);
  });

  useResizeObserver(context.scrollbarY, () => {
    const width = context.scrollbarY?.offsetWidth || 0;
    context.onCornerWidthChange(width);
    setWidth(width);
  });

  return hasSize ? (
    <Primitive.div
      {...cornerProps}
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
});

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

// https://github.com/tmcw-up-for-adoption/simple-linear-scale/blob/master/index.js
function linearScale(input: readonly [number, number], output: readonly [number, number]) {
  return (value: number) => {
    if (input[0] === input[1] || output[0] === output[1]) return output[0];
    const ratio = (output[1] - output[0]) / (input[1] - input[0]);
    return output[0] + ratio * (value - input[0]);
  };
}

function isScrollingWithinScrollbarBounds(scrollPos: number, maxScrollPos: number) {
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
  const handleResize = useCallbackRef(onResize);
  useLayoutEffect(() => {
    let rAF = 0;
    if (element) {
      /**
       * Resize Observer will throw an often benign error that says `ResizeObserver loop
       * completed with undelivered notifications`. This means that ResizeObserver was not
       * able to deliver all observations within a single animation frame, so we use
       * `requestAnimationFrame` to ensure we don't deliver unnecessary observations.
       * Further reading: https://github.com/WICG/resize-observer/issues/38
       */
      const resizeObserver = new ResizeObserver(() => {
        cancelAnimationFrame(rAF);
        rAF = window.requestAnimationFrame(handleResize);
      });
      resizeObserver.observe(element);
      return () => {
        window.cancelAnimationFrame(rAF);
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
  createScrollAreaScope,
  //
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
  ScrollAreaProps,
  ScrollAreaViewportProps,
  ScrollAreaScrollbarProps,
  ScrollAreaThumbProps,
  ScrollAreaCornerProps,
};
