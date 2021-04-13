import * as React from 'react';
import { getPlacementData } from '@radix-ui/popper';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import { createContext } from '@radix-ui/react-context';
import { useRect } from '@radix-ui/react-use-rect';
import { useSize } from '@radix-ui/react-use-size';
import { Primitive } from '@radix-ui/react-primitive';
import * as ArrowPrimitive from '@radix-ui/react-arrow';

import type * as Polymorphic from '@radix-ui/react-polymorphic';
import type { Side, Align } from '@radix-ui/popper';
import type { Measurable } from '@radix-ui/rect';

/* -------------------------------------------------------------------------------------------------
 * Popper
 * -----------------------------------------------------------------------------------------------*/

const POPPER_NAME = 'Popper';

type PopperContextValue = {
  anchorRef: React.MutableRefObject<Measurable | null>;
};
const [PopperProvider, usePopperContext] = createContext<PopperContextValue>(POPPER_NAME);

const Popper: React.FC = ({ children }) => {
  const anchorRef = React.useRef<Measurable | null>(null);
  return <PopperProvider anchorRef={anchorRef}>{children}</PopperProvider>;
};

Popper.displayName = POPPER_NAME;

/* -------------------------------------------------------------------------------------------------
 * PopperAnchor
 * -----------------------------------------------------------------------------------------------*/

const ANCHOR_NAME = 'PopperAnchor';

type PopperAnchorOwnProps = Polymorphic.Merge<
  Polymorphic.OwnProps<typeof Primitive>,
  { virtualRef?: React.RefObject<Measurable> }
>;
type PopperAnchorPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof Primitive>,
  PopperAnchorOwnProps
>;

const PopperAnchor = React.forwardRef((props, forwardedRef) => {
  const { virtualRef, children, ...anchorProps } = props;
  const context = usePopperContext(ANCHOR_NAME);
  const ref = React.useRef<React.ElementRef<typeof Primitive>>(null);
  const composedRefs = useComposedRefs(
    forwardedRef,
    ref,
    context.anchorRef as React.MutableRefObject<React.ElementRef<typeof Primitive>>
  );

  React.useEffect(() => {
    // Consumer can anchor the popper to something that isn't
    // a DOM node e.g. pointer position, so we override the
    // `anchorRef` with their virtual ref in this case.
    if (virtualRef?.current) {
      context.anchorRef.current = virtualRef.current;
    }
  });

  return virtualRef ? null : (
    <Primitive {...anchorProps} ref={composedRefs}>
      {children}
    </Primitive>
  );
}) as PopperAnchorPrimitive;

PopperAnchor.displayName = ANCHOR_NAME;

/* -------------------------------------------------------------------------------------------------
 * PopperContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = 'PopperContent';

type PopperContentContextValue = {
  arrowRef: React.RefObject<HTMLElement>;
  arrowStyles: React.CSSProperties;
  onArrowOffsetChange(offset?: number): void;
};

const [PopperContentProvider, useContentContext] = createContext<PopperContentContextValue>(
  CONTENT_NAME
);

type PopperContentOwnProps = Polymorphic.Merge<
  Polymorphic.OwnProps<typeof Primitive>,
  {
    side?: Side;
    sideOffset?: number;
    align?: Align;
    alignOffset?: number;
    collisionTolerance?: number;
    avoidCollisions?: boolean;
  }
>;

type PopperContentPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof Primitive>,
  PopperContentOwnProps
>;

const PopperContent = React.forwardRef((props, forwardedRef) => {
  const {
    side = 'bottom',
    sideOffset,
    align = 'center',
    alignOffset,
    collisionTolerance,
    avoidCollisions = true,
    ...contentProps
  } = props;

  const context = usePopperContext(CONTENT_NAME);
  const [arrowOffset, setArrowOffset] = React.useState<number>();
  const anchorRect = useRect(context.anchorRef);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const contentSize = useSize(contentRef);
  const arrowRef = React.useRef<HTMLSpanElement>(null);
  const arrowSize = useSize(arrowRef);

  const composedRefs = useComposedRefs(forwardedRef, contentRef);

  const windowSize = useWindowSize();
  const collisionBoundariesRect = windowSize
    ? DOMRect.fromRect({ ...windowSize, x: 0, y: 0 })
    : undefined;

  const { popperStyles, arrowStyles, placedSide, placedAlign } = getPlacementData({
    anchorRect,
    popperSize: contentSize,
    arrowSize,

    // config
    arrowOffset,
    side,
    sideOffset,
    align,
    alignOffset,
    shouldAvoidCollisions: avoidCollisions,
    collisionBoundariesRect,
    collisionTolerance,
  });
  const isPlaced = placedSide !== undefined;

  return (
    <div style={popperStyles} data-radix-popper-content-wrapper="">
      <PopperContentProvider
        arrowRef={arrowRef}
        arrowStyles={arrowStyles}
        onArrowOffsetChange={setArrowOffset}
      >
        <Primitive
          data-side={placedSide}
          data-align={placedAlign}
          {...contentProps}
          style={{
            ...contentProps.style,
            // if the PopperContent hasn't been placed yet (not all measurements done)
            // we prevent animations so that users's animation don't kick in too early referring wrong sides
            animation: !isPlaced ? 'none' : undefined,
          }}
          ref={composedRefs}
        />
      </PopperContentProvider>
    </div>
  );
}) as PopperContentPrimitive;

PopperContent.displayName = CONTENT_NAME;

/* -------------------------------------------------------------------------------------------------
 * PopperArrow
 * -----------------------------------------------------------------------------------------------*/

const ARROW_NAME = 'PopperArrow';

type PopperArrowOwnProps = Polymorphic.Merge<
  Polymorphic.OwnProps<typeof ArrowPrimitive.Root>,
  { offset?: number }
>;

type PopperArrowPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof ArrowPrimitive.Root>,
  PopperArrowOwnProps
>;

const PopperArrow = React.forwardRef(function PopperArrow(props, forwardedRef) {
  const { offset, ...arrowProps } = props;
  const context = useContentContext(ARROW_NAME);
  const { onArrowOffsetChange } = context;

  // send the Arrow's offset up to Popper
  React.useEffect(() => onArrowOffsetChange(offset), [onArrowOffsetChange, offset]);

  return (
    <span style={{ ...context.arrowStyles, pointerEvents: 'none' }}>
      <span
        // we have to use an extra wrapper because `ResizeObserver` (used by `useSize`)
        // doesn't report size as we'd expect on SVG elements.
        // it reports their bounding box which is effectively the largest path inside the SVG.
        ref={context.arrowRef}
        style={{
          display: 'inline-block',
          verticalAlign: 'top',
          pointerEvents: 'auto',
        }}
      >
        <ArrowPrimitive.Root
          {...arrowProps}
          ref={forwardedRef}
          style={{
            ...arrowProps.style,
            // ensures the element can be measured correctly (mostly for if SVG)
            display: 'block',
          }}
        />
      </span>
    </span>
  );
}) as PopperArrowPrimitive;

PopperArrow.displayName = ARROW_NAME;

/* -----------------------------------------------------------------------------------------------*/

const WINDOW_RESIZE_DEBOUNCE_WAIT_IN_MS = 100;

function useWindowSize() {
  const [windowSize, setWindowSize] = React.useState<{ width: number; height: number } | undefined>(
    undefined
  );

  React.useEffect(() => {
    let debounceTimerId: number;

    function updateWindowSize() {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }

    function handleResize() {
      window.clearTimeout(debounceTimerId);
      debounceTimerId = window.setTimeout(updateWindowSize, WINDOW_RESIZE_DEBOUNCE_WAIT_IN_MS);
    }

    updateWindowSize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}

const Root = Popper;
const Anchor = PopperAnchor;
const Content = PopperContent;
const Arrow = PopperArrow;

export {
  Popper,
  PopperAnchor,
  PopperContent,
  PopperArrow,
  //
  Root,
  Anchor,
  Content,
  Arrow,
};
