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
} from '@floating-ui/react-dom';
import * as ArrowPrimitive from '@radix-ui/react-arrow';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import { createContextScope } from '@radix-ui/react-context';
import { Primitive } from '@radix-ui/react-primitive';
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

const [PositionContextProvider, usePositionContext] = createPopperContext(CONTENT_NAME, {
  hasParent: false,
  positionUpdateFns: new Set<() => void>(),
});

type PopperContentElement = React.ElementRef<typeof Primitive.div>;
interface PopperContentProps extends PrimitiveDivProps {
  side?: Side;
  sideOffset?: number;
  align?: Align;
  alignOffset?: number;
  arrowPadding?: number;
  collisionPadding?: number | Partial<Record<Side, number>>;
  sticky?: 'partial' | 'always';
  hideWhenDetached?: boolean;
  avoidCollisions?: boolean;
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
      collisionPadding: collisionPaddingProp = 0,
      sticky = 'partial',
      hideWhenDetached = false,
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

    const collisionPadding =
      typeof collisionPaddingProp === 'number'
        ? collisionPaddingProp
        : { top: 0, right: 0, bottom: 0, left: 0, ...collisionPaddingProp };

    const { reference, floating, strategy, x, y, placement, middlewareData, update } = useFloating({
      // default to `fixed` strategy so users don't have to pick and we also avoid focus scroll issues
      strategy: 'fixed',
      placement: desiredPlacement,
      whileElementsMounted: autoUpdate,
      middleware: [
        offset({ mainAxis: sideOffset + arrowHeight, alignmentAxis: alignOffset }),
        avoidCollisions
          ? shift({
              mainAxis: true,
              crossAxis: false,
              padding: collisionPadding,
              limiter: sticky === 'partial' ? limitShift() : undefined,
              altBoundary: true,
            })
          : undefined,
        arrow ? floatingUIarrow({ element: arrow, padding: arrowPadding }) : undefined,
        avoidCollisions ? flip({ padding: collisionPadding, altBoundary: true }) : undefined,
        transformOrigin({ arrowWidth, arrowHeight }),
        hideWhenDetached ? hide({ strategy: 'referenceHidden' }) : undefined,
      ].filter(isDefined),
    });

    // assign the reference dynamically once `Content` has mounted so we can collocate the logic
    useLayoutEffect(() => {
      reference(context.anchor);
    }, [reference, context.anchor]);

    const isPlaced = x !== null && y !== null;
    const [placedSide, placedAlign] = getSideAndAlignFromPlacement(placement);

    const arrowX = middlewareData.arrow?.x;
    const arrowY = middlewareData.arrow?.y;
    const cannotCenterArrow = middlewareData.arrow?.centerOffset !== 0;

    const [contentZIndex, setContentZIndex] = React.useState<string>();
    useLayoutEffect(() => {
      if (content) setContentZIndex(window.getComputedStyle(content).zIndex);
    }, [content]);

    const { hasParent, positionUpdateFns } = usePositionContext(CONTENT_NAME, __scopePopper);
    const isRoot = !hasParent;

    React.useLayoutEffect(() => {
      if (!isRoot) {
        positionUpdateFns.add(update);
        return () => {
          positionUpdateFns.delete(update);
        };
      }
    }, [isRoot, positionUpdateFns, update]);

    // when nested contents are rendered in portals, they are appended out of order causing
    // children to be positioned incorrectly if initially open.
    // we need to re-compute the positioning once the parent has finally been placed.
    // https://github.com/floating-ui/floating-ui/issues/1531
    React.useLayoutEffect(() => {
      if (isRoot && isPlaced) {
        Array.from(positionUpdateFns)
          .reverse()
          .forEach((fn) => requestAnimationFrame(fn));
      }
    }, [isRoot, isPlaced, positionUpdateFns]);

    const commonProps = {
      'data-side': placedSide,
      'data-align': placedAlign,
      ...contentProps,
      ref: composedRefs,
      style: {
        ...contentProps.style,
        // if the PopperContent hasn't been placed yet (not all measurements done)
        // we prevent animations so that users's animation don't kick in too early referring wrong sides
        animation: !isPlaced ? 'none' : undefined,
        // hide the content if using the hide middleware and should be hidden
        opacity: middlewareData.hide?.referenceHidden ? 0 : undefined,
      },
    };

    return (
      <div
        ref={floating}
        data-radix-popper-content-wrapper=""
        style={{
          position: strategy,
          left: 0,
          top: 0,
          transform: isPlaced
            ? `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)`
            : 'translate3d(0, -200%, 0)', // keep off the page when measuring
          minWidth: 'max-content',
          zIndex: contentZIndex,
          ['--radix-popper-transform-origin' as any]: [
            middlewareData.transformOrigin?.x,
            middlewareData.transformOrigin?.y,
          ].join(' '),
        }}
      >
        <PopperContentProvider
          scope={__scopePopper}
          placedSide={placedSide}
          onArrowChange={setArrow}
          arrowX={arrowX}
          arrowY={arrowY}
          shouldHideArrow={cannotCenterArrow}
        >
          {isRoot ? (
            <PositionContextProvider
              scope={__scopePopper}
              hasParent
              positionUpdateFns={positionUpdateFns}
            >
              <Primitive.div {...commonProps} />
            </PositionContextProvider>
          ) : (
            <Primitive.div {...commonProps} />
          )}
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
