import * as React from 'react';
import { getPlacementData } from '@radix-ui/popper';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import { createContext } from '@radix-ui/react-context';
import { useRect } from '@radix-ui/react-use-rect';
import { useSize } from '@radix-ui/react-use-size';
import { Primitive } from '@radix-ui/react-primitive';
import * as ArrowPrimitive from '@radix-ui/react-arrow';

import type * as Radix from '@radix-ui/react-primitive';
import type { Side, Align } from '@radix-ui/popper';
import type { Measurable } from '@radix-ui/rect';

/* -------------------------------------------------------------------------------------------------
 * Popper
 * -----------------------------------------------------------------------------------------------*/

const POPPER_NAME = 'Popper';

type PopperContextValue = {
  anchor: Measurable | null;
  onAnchorChange(anchor: Measurable | null): void;
};
const [PopperProvider, usePopperContext] = createContext<PopperContextValue>(POPPER_NAME);

const Popper: React.FC = ({ children }) => {
  const [anchor, setAnchor] = React.useState<Measurable | null>(null);
  return (
    <PopperProvider anchor={anchor} onAnchorChange={setAnchor}>
      {children}
    </PopperProvider>
  );
};

Popper.displayName = POPPER_NAME;

/* -------------------------------------------------------------------------------------------------
 * PopperAnchor
 * -----------------------------------------------------------------------------------------------*/

const ANCHOR_NAME = 'PopperAnchor';

type PopperAnchorElement = React.ElementRef<typeof Primitive.div>;
type PrimitiveDivProps = Radix.ComponentPropsWithoutRef<typeof Primitive.div>;
interface PopperAnchorProps extends PrimitiveDivProps {
  virtualRef?: React.RefObject<Measurable>;
}

const PopperAnchor = React.forwardRef<PopperAnchorElement, PopperAnchorProps>(
  (props, forwardedRef) => {
    const { virtualRef, ...anchorProps } = props;
    const context = usePopperContext(ANCHOR_NAME);
    const ref = React.useRef<PopperAnchorElement>(null);
    const composedRefs = useComposedRefs(forwardedRef, ref);

    React.useEffect(() => {
      // Consumer can anchor the popper to something that isn't
      // a DOM node e.g. pointer position, so we override the
      // `anchorRef` with their virtual ref in this case.
      context.onAnchorChange(virtualRef?.current || ref.current);
    });

    return virtualRef ? null : <Primitive.div {...anchorProps} ref={composedRefs} />;
  }
);

PopperAnchor.displayName = ANCHOR_NAME;

/* -------------------------------------------------------------------------------------------------
 * PopperContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = 'PopperContent';

type PopperContentContextValue = {
  arrowStyles: React.CSSProperties;
  onArrowChange(arrow: HTMLSpanElement | null): void;
  onArrowOffsetChange(offset?: number): void;
};

const [PopperContentProvider, useContentContext] =
  createContext<PopperContentContextValue>(CONTENT_NAME);

type PopperContentElement = React.ElementRef<typeof Primitive.div>;
interface PopperContentProps extends PrimitiveDivProps {
  side?: Side;
  sideOffset?: number;
  align?: Align;
  alignOffset?: number;
  collisionTolerance?: number;
  avoidCollisions?: boolean;
}

const PopperContent = React.forwardRef<PopperContentElement, PopperContentProps>(
  (props, forwardedRef) => {
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
    const anchorRect = useRect(context.anchor);
    const [content, setContent] = React.useState<HTMLDivElement | null>(null);
    const contentSize = useSize(content);
    const [arrow, setArrow] = React.useState<HTMLSpanElement | null>(null);
    const arrowSize = useSize(arrow);

    const composedRefs = useComposedRefs(forwardedRef, (node) => setContent(node));

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
          arrowStyles={arrowStyles}
          onArrowChange={setArrow}
          onArrowOffsetChange={setArrowOffset}
        >
          <Primitive.div
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
  }
);

PopperContent.displayName = CONTENT_NAME;

/* -------------------------------------------------------------------------------------------------
 * PopperArrow
 * -----------------------------------------------------------------------------------------------*/

const ARROW_NAME = 'PopperArrow';

type PopperArrowElement = React.ElementRef<typeof ArrowPrimitive.Root>;
type ArrowProps = Radix.ComponentPropsWithoutRef<typeof ArrowPrimitive.Root>;
interface PopperArrowProps extends ArrowProps {
  offset?: number;
}

const PopperArrow = React.forwardRef<PopperArrowElement, PopperArrowProps>(function PopperArrow(
  props,
  forwardedRef
) {
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
        ref={context.onArrowChange}
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
});

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
export type { PopperAnchorProps, PopperContentProps, PopperArrowProps };
