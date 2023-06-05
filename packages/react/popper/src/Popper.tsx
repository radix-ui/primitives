import * as React from 'react';
import {
  useFloating,
  autoUpdate,
  offset,
  shift,
  limitShift,
  hide,
  arrow as floatingUIarrow,
  flip,
  size,
} from '@floating-ui/react-dom';
import * as ArrowPrimitive from '@radix-ui/react-arrow';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import { createContextScope } from '@radix-ui/react-context';
import { Primitive } from '@radix-ui/react-primitive';
import { useCallbackRef } from '@radix-ui/react-use-callback-ref';
import { useLayoutEffect } from '@radix-ui/react-use-layout-effect';
import { useSize } from '@radix-ui/react-use-size';

import type { Placement, Middleware } from '@floating-ui/react-dom';
import type * as Radix from '@radix-ui/react-primitive';
import type { Scope } from '@radix-ui/react-context';
import type { Measurable } from '@radix-ui/rect';

const SIDE_OPTIONS = ['top', 'right', 'bottom', 'left'] as const;
const ALIGN_OPTIONS = ['start', 'center', 'end'] as const;

type Side = typeof SIDE_OPTIONS[number];
type Align = typeof ALIGN_OPTIONS[number];

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
  placedSide: Side;
  onArrowChange(arrow: HTMLSpanElement | null): void;
  arrowX?: number;
  arrowY?: number;
  shouldHideArrow: boolean;
};

const [PopperContentProvider, useContentContext] =
  createPopperContext<PopperContentContextValue>(CONTENT_NAME);

type Boundary = Element | null;

type PopperContentElement = React.ElementRef<typeof Primitive.div>;
interface PopperContentProps extends PrimitiveDivProps {
  side?: Side;
  sideOffset?: number;
  align?: Align;
  alignOffset?: number;
  arrowPadding?: number;
  avoidCollisions?: boolean;
  collisionBoundary?: Boundary | Boundary[];
  collisionPadding?: number | Partial<Record<Side, number>>;
  sticky?: 'partial' | 'always';
  hideWhenDetached?: boolean;
  updatePositionStrategy?: 'optimized' | 'always';
  onPlaced?: () => void;
}

const PopperContent = React.forwardRef<PopperContentElement, PopperContentProps>(
  (props: ScopedProps<PopperContentProps>, forwardedRef) => {
    const {
      __scopePopper,
      side = 'bottom',
      sideOffset = 0,
      align = 'center',
      alignOffset = 0,
      arrowPadding = 0,
      avoidCollisions = true,
      collisionBoundary = [],
      collisionPadding: collisionPaddingProp = 0,
      sticky = 'partial',
      hideWhenDetached = false,
      updatePositionStrategy = 'optimized',
      onPlaced,
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

    const collisionPadding =
      typeof collisionPaddingProp === 'number'
        ? collisionPaddingProp
        : { top: 0, right: 0, bottom: 0, left: 0, ...collisionPaddingProp };

    const boundary = Array.isArray(collisionBoundary) ? collisionBoundary : [collisionBoundary];
    const hasExplicitBoundaries = boundary.length > 0;

    const detectOverflowOptions = {
      padding: collisionPadding,
      boundary: boundary.filter(isNotNull),
      // with `strategy: 'fixed'`, this is the only way to get it to respect boundaries
      altBoundary: hasExplicitBoundaries,
    };

    const { refs, floatingStyles, placement, isPositioned, middlewareData } = useFloating({
      // default to `fixed` strategy so users don't have to pick and we also avoid focus scroll issues
      strategy: 'fixed',
      placement: desiredPlacement,
      whileElementsMounted: (...args) => {
        const cleanup = autoUpdate(...args, {
          animationFrame: updatePositionStrategy === 'always',
        });
        return cleanup;
      },
      elements: {
        reference: context.anchor,
      },
      middleware: [
        offset({ mainAxis: sideOffset + arrowHeight, alignmentAxis: alignOffset }),
        avoidCollisions &&
          shift({
            mainAxis: true,
            crossAxis: false,
            limiter: sticky === 'partial' ? limitShift() : undefined,
            ...detectOverflowOptions,
          }),
        avoidCollisions && flip({ ...detectOverflowOptions }),
        size({
          ...detectOverflowOptions,
          apply: ({ elements, rects, availableWidth, availableHeight }) => {
            const { width: anchorWidth, height: anchorHeight } = rects.reference;
            const contentStyle = elements.floating.style;
            contentStyle.setProperty('--radix-popper-available-width', `${availableWidth}px`);
            contentStyle.setProperty('--radix-popper-available-height', `${availableHeight}px`);
            contentStyle.setProperty('--radix-popper-anchor-width', `${anchorWidth}px`);
            contentStyle.setProperty('--radix-popper-anchor-height', `${anchorHeight}px`);
          },
        }),
        arrow && floatingUIarrow({ element: arrow, padding: arrowPadding }),
        transformOrigin({ arrowWidth, arrowHeight }),
        hideWhenDetached && hide({ strategy: 'referenceHidden', ...detectOverflowOptions }),
      ],
    });

    const [placedSide, placedAlign] = getSideAndAlignFromPlacement(placement);

    const handlePlaced = useCallbackRef(onPlaced);
    useLayoutEffect(() => {
      if (isPositioned) {
        handlePlaced?.();
      }
    }, [isPositioned, handlePlaced]);

    const arrowX = middlewareData.arrow?.x;
    const arrowY = middlewareData.arrow?.y;
    const cannotCenterArrow = middlewareData.arrow?.centerOffset !== 0;

    const [contentZIndex, setContentZIndex] = React.useState<string>();
    useLayoutEffect(() => {
      if (content) setContentZIndex(window.getComputedStyle(content).zIndex);
    }, [content]);

    return (
      <div
        ref={refs.setFloating}
        data-radix-popper-content-wrapper=""
        style={{
          ...floatingStyles,
          transform: isPositioned ? floatingStyles.transform : 'translate(0, -200%)', // keep off the page when measuring
          minWidth: 'max-content',
          zIndex: contentZIndex,
          ['--radix-popper-transform-origin' as any]: [
            middlewareData.transformOrigin?.x,
            middlewareData.transformOrigin?.y,
          ].join(' '),
        }}
        // Floating UI interally calculates logical alignment based the `dir` attribute on
        // the reference/floating node, we must add this attribute here to ensure
        // this is calculated when portalled as well as inline.
        dir={props.dir}
      >
        <PopperContentProvider
          scope={__scopePopper}
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
              animation: !isPositioned ? 'none' : undefined,
              // hide the content if using the hide middleware and should be hidden
              opacity: middlewareData.hide?.referenceHidden ? 0 : undefined,
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
interface PopperArrowProps extends ArrowProps {}

const PopperArrow = React.forwardRef<PopperArrowElement, PopperArrowProps>(function PopperArrow(
  props: ScopedProps<PopperArrowProps>,
  forwardedRef
) {
  const { __scopePopper, ...arrowProps } = props;
  const contentContext = useContentContext(ARROW_NAME, __scopePopper);
  const baseSide = OPPOSITE_SIDE[contentContext.placedSide];

  return (
    // we have to use an extra wrapper because `ResizeObserver` (used by `useSize`)
    // doesn't report size as we'd expect on SVG elements.
    // it reports their bounding box which is effectively the largest path inside the SVG.
    <span
      ref={contentContext.onArrowChange}
      style={{
        position: 'absolute',
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

function isNotNull<T>(value: T | null): value is T {
  return value !== null;
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

function getSideAndAlignFromPlacement(placement: Placement) {
  const [side, align = 'center'] = placement.split('-');
  return [side as Side, align as Align] as const;
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
  //
  SIDE_OPTIONS,
  ALIGN_OPTIONS,
};
export type { PopperProps, PopperAnchorProps, PopperContentProps, PopperArrowProps };
