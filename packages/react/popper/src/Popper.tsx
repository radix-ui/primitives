import * as React from 'react';
import {
  useFloating,
  autoUpdate,
  offset,
  shift,
  limitShift,
  arrow as arrowMiddleware,
  flip,
} from '@floating-ui/react-dom';
import * as ArrowPrimitive from '@radix-ui/react-arrow';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import { createContextScope } from '@radix-ui/react-context';
import { Primitive } from '@radix-ui/react-primitive';
import { useLayoutEffect } from '@radix-ui/react-use-layout-effect';
import { useSize } from '@radix-ui/react-use-size';

import type { Placement, Strategy, Middleware } from '@floating-ui/react-dom';
import type * as Radix from '@radix-ui/react-primitive';
import type { Scope } from '@radix-ui/react-context';
import type { Side, Align } from '@radix-ui/popper';
import type { Measurable } from '@radix-ui/rect';

/* -------------------------------------------------------------------------------------------------
 * Popper
 * -----------------------------------------------------------------------------------------------*/

const POPPER_NAME = 'Popper';

type ScopedProps<P> = P & { __scopePopper?: Scope };
const [createPopperContext, createPopperScope] = createContextScope(POPPER_NAME);

type PopperContextValue = {
  anchor: Measurable | null;
  onAnchorChange(anchor: Measurable | null): void;
};
const [PopperProvider, usePopperContext] = createPopperContext<PopperContextValue>(POPPER_NAME);

interface PopperProps {
  children?: React.ReactNode;
}
const Popper: React.FC<PopperProps> = (props: ScopedProps<PopperProps>) => {
  const { __scopePopper, children } = props;
  const [anchor, setAnchor] = React.useState<Measurable | null>(null);
  return (
    <PopperProvider scope={__scopePopper} anchor={anchor} onAnchorChange={setAnchor}>
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
  (props: ScopedProps<PopperAnchorProps>, forwardedRef) => {
    const { __scopePopper, virtualRef, ...anchorProps } = props;
    const context = usePopperContext(ANCHOR_NAME, __scopePopper);
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
  strategy: 'absolute' | 'fixed';
  placedSide: Side;
  onArrowChange(arrow: HTMLSpanElement | null): void;
  arrowX: number | undefined;
  arrowY: number | undefined;
  shouldHideArrow: boolean;
};

const [PopperContentProvider, useContentContext] =
  createPopperContext<PopperContentContextValue>(CONTENT_NAME);

type PopperContentElement = React.ElementRef<typeof Primitive.div>;
interface PopperContentProps extends PrimitiveDivProps {
  strategy?: Strategy;
  side?: Side;
  sideOffset?: number;
  align?: Align;
  alignOffset?: number;
  collisionTolerance?: number;
  avoidCollisions?: boolean;
}

const PopperContent = React.forwardRef<PopperContentElement, PopperContentProps>(
  (props: ScopedProps<PopperContentProps>, forwardedRef) => {
    const {
      __scopePopper,
      strategy: strategyProp,
      side = 'bottom',
      sideOffset = 0,
      align = 'center',
      alignOffset = 0,
      collisionTolerance = 0,
      avoidCollisions = true,
      ...contentProps
    } = props;

    const context = usePopperContext(CONTENT_NAME, __scopePopper);

    const [content, setContent] = React.useState<HTMLDivElement | null>(null);
    const composedRefs = useComposedRefs(forwardedRef, (node) => setContent(node));

    const [arrow, setArrow] = React.useState<HTMLSpanElement | null>(null);
    const arrowSize = useSize(arrow);
    const arrowWidth = arrowSize?.width ?? 0;
    const arrowHeight = arrowSize?.height ?? 0;

    const desiredPlacement = (side + (align !== 'center' ? '-' + align : '')) as Placement;

    const middleware = [
      offset({ mainAxis: sideOffset + arrowHeight, crossAxis: alignOffset }),
      avoidCollisions
        ? shift({
            mainAxis: true,
            crossAxis: false,
            padding: collisionTolerance,
            limiter: limitShift(),
          })
        : undefined,
      arrow ? arrowMiddleware({ element: arrow }) : undefined,
      avoidCollisions ? flip({ padding: collisionTolerance }) : undefined,
      transformOrigin({ arrowWidth, arrowHeight }),
    ].filter(isDefined);

    const { reference, floating, strategy, x, y, placement, middlewareData } = useFloating({
      strategy: strategyProp,
      placement: desiredPlacement,
      whileElementsMounted: autoUpdate,
      middleware,
    });

    useLayoutEffect(() => {
      reference(context.anchor);
    }, [reference, context.anchor]);

    const isPlaced = x !== null && y !== null;
    const [placedSide, placedAlign] = getSideAndAlignFromPlacement(placement);
    const { arrow: { x: arrowX, y: arrowY } = {} } = middlewareData;
    const cannotCenterArrow = middlewareData.arrow?.centerOffset !== 0;

    const [contentZIndex, setContentZIndex] = React.useState<string>();
    useLayoutEffect(() => {
      if (content) setContentZIndex(window.getComputedStyle(content).zIndex);
    }, [content]);

    return (
      <div
        ref={floating}
        style={{
          position: strategy,
          left: 0,
          top: 0,
          transform: isPlaced
            ? `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)`
            : 'translate3d(0, -200vh, 0)',
          minWidth: 'max-content',
          zIndex: contentZIndex,
          ['--radix-popper-transform-origin' as any]: [
            middlewareData.transformOrigin?.x,
            middlewareData.transformOrigin?.y,
          ].join(' '),
        }}
        data-radix-popper-content-wrapper=""
      >
        <PopperContentProvider
          scope={__scopePopper}
          strategy={strategy}
          placedSide={placedSide}
          onArrowChange={setArrow}
          arrowX={arrowX}
          arrowY={arrowY}
          shouldHideArrow={cannotCenterArrow}
        >
          <Primitive.div
            data-side={placedSide}
            data-align={placedAlign}
            {...contentProps}
            ref={composedRefs}
            style={{
              ...contentProps.style,
              // if the PopperContent hasn't been placed yet (not all measurements done)
              // we prevent animations so that users's animation don't kick in too early referring wrong sides
              animation: !isPlaced ? 'none' : undefined,
            }}
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

const OPPOSITE_SIDE: Record<Side, Side> = {
  top: 'bottom',
  right: 'left',
  bottom: 'top',
  left: 'right',
};

type PopperArrowElement = React.ElementRef<typeof ArrowPrimitive.Root>;
type ArrowProps = Radix.ComponentPropsWithoutRef<typeof ArrowPrimitive.Root>;
interface PopperArrowProps extends ArrowProps {
  offset?: number;
}

const PopperArrow = React.forwardRef<PopperArrowElement, PopperArrowProps>(function PopperArrow(
  props: ScopedProps<PopperArrowProps>,
  forwardedRef
) {
  const { __scopePopper, offset, ...arrowProps } = props;
  const contentContext = useContentContext(ARROW_NAME, __scopePopper);
  const baseSide = OPPOSITE_SIDE[contentContext.placedSide];

  return (
    // we have to use an extra wrapper because `ResizeObserver` (used by `useSize`)
    // doesn't report size as we'd expect on SVG elements.
    // it reports their bounding box which is effectively the largest path inside the SVG.
    <span
      ref={contentContext.onArrowChange}
      style={{
        position: contentContext.strategy,
        left: contentContext.arrowX,
        top: contentContext.arrowY,
        [baseSide]: 0,
        transformOrigin: {
          top: '',
          right: '0 0',
          bottom: 'center 0',
          left: '100% 0',
        }[contentContext.placedSide],
        transform: {
          top: 'translateY(100%)',
          right: 'translateY(50%) rotate(90deg) translateX(-50%)',
          bottom: `rotate(180deg)`,
          left: 'translateY(50%) rotate(-90deg) translateX(50%)',
        }[contentContext.placedSide],
        visibility: contentContext.shouldHideArrow ? 'hidden' : undefined,
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
  );
});

PopperArrow.displayName = ARROW_NAME;

/* -----------------------------------------------------------------------------------------------*/

function isDefined<T>(value: T | undefined): value is T {
  return value !== undefined;
}

const transformOrigin = (options: { arrowWidth: number; arrowHeight: number }): Middleware => ({
  name: 'transformOrigin',
  options,
  fn(data) {
    const { placement, rects, middlewareData } = data;

    const cannotCenterArrow = middlewareData.arrow?.centerOffset !== 0;
    const isArrowHidden = cannotCenterArrow;
    const arrowWidth = isArrowHidden ? 0 : options.arrowWidth;
    const arrowHeight = isArrowHidden ? 0 : options.arrowHeight;

    const [placedSide, placedAlign] = getSideAndAlignFromPlacement(placement);
    const noArrowAlign = { start: '0%', center: '50%', end: '100%' }[placedAlign];

    const arrowXCenter = (middlewareData.arrow?.x ?? 0) + arrowWidth / 2;
    const arrowYCenter = (middlewareData.arrow?.y ?? 0) + arrowHeight / 2;

    let x = '';
    let y = '';

    if (placedSide === 'bottom') {
      x = isArrowHidden ? noArrowAlign : `${arrowXCenter}px`;
      y = `${-arrowHeight}px`;
    } else if (placedSide === 'top') {
      x = isArrowHidden ? noArrowAlign : `${arrowXCenter}px`;
      y = `${rects.floating.height + arrowHeight}px`;
    } else if (placedSide === 'right') {
      x = `${-arrowHeight}px`;
      y = isArrowHidden ? noArrowAlign : `${arrowYCenter}px`;
    } else if (placedSide === 'left') {
      x = `${rects.floating.width + arrowHeight}px`;
      y = isArrowHidden ? noArrowAlign : `${arrowYCenter}px`;
    }
    return { data: { x, y } };
  },
});

function getSideAndAlignFromPlacement(placement: Placement): [Side, Align] {
  const [side, align = 'center'] = placement.split('-');
  return [side as Side, align as Align];
}

const Root = Popper;
const Anchor = PopperAnchor;
const Content = PopperContent;
const Arrow = PopperArrow;

export {
  createPopperScope,
  //
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
export type { PopperProps, PopperAnchorProps, PopperContentProps, PopperArrowProps };
