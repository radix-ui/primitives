import * as React from 'react';
import { composeEventHandlers } from '@radix-ui/primitive';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import { createContextScope } from '@radix-ui/react-context';
import { DismissableLayer } from '@radix-ui/react-dismissable-layer';
import { useId } from '@radix-ui/react-id';
import * as PopperPrimitive from '@radix-ui/react-popper';
import { createPopperScope } from '@radix-ui/react-popper';
import { Portal as PortalPrimitive } from '@radix-ui/react-portal';
import { Presence } from '@radix-ui/react-presence';
import { Primitive } from '@radix-ui/react-primitive';
import { Slottable } from '@radix-ui/react-slot';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import * as VisuallyHiddenPrimitive from '@radix-ui/react-visually-hidden';

import type * as Radix from '@radix-ui/react-primitive';
import type { Scope } from '@radix-ui/react-context';

type ScopedProps<P = {}> = P & { __scopeTooltip?: Scope };
const [createTooltipContext, createTooltipScope] = createContextScope('Tooltip', [
  createPopperScope,
]);
const usePopperScope = createPopperScope();

/* -------------------------------------------------------------------------------------------------
 * TooltipProvider
 * -----------------------------------------------------------------------------------------------*/

const PROVIDER_NAME = 'TooltipProvider';
const DEFAULT_DELAY_DURATION = 700;
const TOOLTIP_OPEN = 'tooltip.open';

type TooltipProviderContextValue = {
  isOpenDelayed: boolean;
  delayDuration: number;
  onOpen(): void;
  onClose(): void;
  onPointerInTransitChange(inTransit: boolean): void;
  isPointerInTransitRef: React.MutableRefObject<boolean>;
  disableHoverableContent: boolean;
};

const [TooltipProviderContextProvider, useTooltipProviderContext] =
  createTooltipContext<TooltipProviderContextValue>(PROVIDER_NAME);

interface TooltipProviderProps {
  children: React.ReactNode;
  /**
   * The duration from when the pointer enters the trigger until the tooltip gets opened.
   * @defaultValue 700
   */
  delayDuration?: number;
  /**
   * How much time a user has to enter another trigger without incurring a delay again.
   * @defaultValue 300
   */
  skipDelayDuration?: number;
  /**
   * When `true`, trying to hover the content will result in the tooltip closing as the pointer leaves the trigger.
   * @defaultValue false
   */
  disableHoverableContent?: boolean;
}

const TooltipProvider: React.FC<TooltipProviderProps> = (
  props: ScopedProps<TooltipProviderProps>
) => {
  const {
    __scopeTooltip,
    delayDuration = DEFAULT_DELAY_DURATION,
    skipDelayDuration = 300,
    disableHoverableContent = false,
    children,
  } = props;
  const [isOpenDelayed, setIsOpenDelayed] = React.useState(true);
  const isPointerInTransitRef = React.useRef(false);
  const skipDelayTimerRef = React.useRef(0);

  React.useEffect(() => {
    const skipDelayTimer = skipDelayTimerRef.current;
    return () => window.clearTimeout(skipDelayTimer);
  }, []);

  return (
    <TooltipProviderContextProvider
      scope={__scopeTooltip}
      isOpenDelayed={isOpenDelayed}
      delayDuration={delayDuration}
      onOpen={React.useCallback(() => {
        window.clearTimeout(skipDelayTimerRef.current);
        setIsOpenDelayed(false);
      }, [])}
      onClose={React.useCallback(() => {
        window.clearTimeout(skipDelayTimerRef.current);
        skipDelayTimerRef.current = window.setTimeout(
          () => setIsOpenDelayed(true),
          skipDelayDuration
        );
      }, [skipDelayDuration])}
      isPointerInTransitRef={isPointerInTransitRef}
      onPointerInTransitChange={React.useCallback((inTransit: boolean) => {
        isPointerInTransitRef.current = inTransit;
      }, [])}
      disableHoverableContent={disableHoverableContent}
    >
      {children}
    </TooltipProviderContextProvider>
  );
};

TooltipProvider.displayName = PROVIDER_NAME;

/* -------------------------------------------------------------------------------------------------
 * Tooltip
 * -----------------------------------------------------------------------------------------------*/

const TOOLTIP_NAME = 'Tooltip';

type TooltipContextValue = {
  contentId: string;
  open: boolean;
  stateAttribute: 'closed' | 'delayed-open' | 'instant-open';
  trigger: TooltipTriggerElement | null;
  onTriggerChange(trigger: TooltipTriggerElement | null): void;
  onTriggerEnter(): void;
  onTriggerLeave(): void;
  onOpen(): void;
  onClose(): void;
  disableHoverableContent: boolean;
};

const [TooltipContextProvider, useTooltipContext] =
  createTooltipContext<TooltipContextValue>(TOOLTIP_NAME);

interface TooltipProps {
  children?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /**
   * The duration from when the pointer enters the trigger until the tooltip gets opened. This will
   * override the prop with the same name passed to Provider.
   * @defaultValue 700
   */
  delayDuration?: number;
  /**
   * When `true`, trying to hover the content will result in the tooltip closing as the pointer leaves the trigger.
   * @defaultValue false
   */
  disableHoverableContent?: boolean;
}

const Tooltip: React.FC<TooltipProps> = (props: ScopedProps<TooltipProps>) => {
  const {
    __scopeTooltip,
    children,
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    disableHoverableContent: disableHoverableContentProp,
    delayDuration: delayDurationProp,
  } = props;
  const providerContext = useTooltipProviderContext(TOOLTIP_NAME, props.__scopeTooltip);
  const popperScope = usePopperScope(__scopeTooltip);
  const [trigger, setTrigger] = React.useState<HTMLButtonElement | null>(null);
  const contentId = useId();
  const openTimerRef = React.useRef(0);
  const disableHoverableContent =
    disableHoverableContentProp ?? providerContext.disableHoverableContent;
  const delayDuration = delayDurationProp ?? providerContext.delayDuration;
  const wasOpenDelayedRef = React.useRef(false);
  const [open = false, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: (open) => {
      if (open) {
        providerContext.onOpen();

        // as `onChange` is called within a lifecycle method we
        // avoid dispatching via `dispatchDiscreteCustomEvent`.
        document.dispatchEvent(new CustomEvent(TOOLTIP_OPEN));
      } else {
        providerContext.onClose();
      }
      onOpenChange?.(open);
    },
  });
  const stateAttribute = React.useMemo(() => {
    return open ? (wasOpenDelayedRef.current ? 'delayed-open' : 'instant-open') : 'closed';
  }, [open]);

  const handleOpen = React.useCallback(() => {
    window.clearTimeout(openTimerRef.current);
    wasOpenDelayedRef.current = false;
    setOpen(true);
  }, [setOpen]);

  const handleClose = React.useCallback(() => {
    window.clearTimeout(openTimerRef.current);
    setOpen(false);
  }, [setOpen]);

  const handleDelayedOpen = React.useCallback(() => {
    window.clearTimeout(openTimerRef.current);
    openTimerRef.current = window.setTimeout(() => {
      wasOpenDelayedRef.current = true;
      setOpen(true);
    }, delayDuration);
  }, [delayDuration, setOpen]);

  React.useEffect(() => {
    return () => window.clearTimeout(openTimerRef.current);
  }, []);

  return (
    <PopperPrimitive.Root {...popperScope}>
      <TooltipContextProvider
        scope={__scopeTooltip}
        contentId={contentId}
        open={open}
        stateAttribute={stateAttribute}
        trigger={trigger}
        onTriggerChange={setTrigger}
        onTriggerEnter={React.useCallback(() => {
          if (providerContext.isOpenDelayed) handleDelayedOpen();
          else handleOpen();
        }, [providerContext.isOpenDelayed, handleDelayedOpen, handleOpen])}
        onTriggerLeave={React.useCallback(() => {
          if (disableHoverableContent) {
            handleClose();
          } else {
            // Clear the timer in case the pointer leaves the trigger before the tooltip is opened.
            window.clearTimeout(openTimerRef.current);
          }
        }, [handleClose, disableHoverableContent])}
        onOpen={handleOpen}
        onClose={handleClose}
        disableHoverableContent={disableHoverableContent}
      >
        {children}
      </TooltipContextProvider>
    </PopperPrimitive.Root>
  );
};

Tooltip.displayName = TOOLTIP_NAME;

/* -------------------------------------------------------------------------------------------------
 * TooltipTrigger
 * -----------------------------------------------------------------------------------------------*/

const TRIGGER_NAME = 'TooltipTrigger';

type TooltipTriggerElement = React.ElementRef<typeof Primitive.button>;
type PrimitiveButtonProps = Radix.ComponentPropsWithoutRef<typeof Primitive.button>;
interface TooltipTriggerProps extends PrimitiveButtonProps {}

const TooltipTrigger = React.forwardRef<TooltipTriggerElement, TooltipTriggerProps>(
  (props: ScopedProps<TooltipTriggerProps>, forwardedRef) => {
    const { __scopeTooltip, ...triggerProps } = props;
    const context = useTooltipContext(TRIGGER_NAME, __scopeTooltip);
    const providerContext = useTooltipProviderContext(TRIGGER_NAME, __scopeTooltip);
    const popperScope = usePopperScope(__scopeTooltip);
    const ref = React.useRef<TooltipTriggerElement>(null);
    const composedRefs = useComposedRefs(forwardedRef, ref, context.onTriggerChange);
    const isPointerDownRef = React.useRef(false);
    const hasPointerMoveOpenedRef = React.useRef(false);
    const handlePointerUp = React.useCallback(() => (isPointerDownRef.current = false), []);

    React.useEffect(() => {
      return () => document.removeEventListener('pointerup', handlePointerUp);
    }, [handlePointerUp]);

    return (
      <PopperPrimitive.Anchor asChild {...popperScope}>
        <Primitive.button
          // We purposefully avoid adding `type=button` here because tooltip triggers are also
          // commonly anchors and the anchor `type` attribute signifies MIME type.
          aria-describedby={context.open ? context.contentId : undefined}
          data-state={context.stateAttribute}
          {...triggerProps}
          ref={composedRefs}
          onPointerMove={composeEventHandlers(props.onPointerMove, (event) => {
            if (event.pointerType === 'touch') return;
            if (
              !hasPointerMoveOpenedRef.current &&
              !providerContext.isPointerInTransitRef.current
            ) {
              context.onTriggerEnter();
              hasPointerMoveOpenedRef.current = true;
            }
          })}
          onPointerLeave={composeEventHandlers(props.onPointerLeave, () => {
            context.onTriggerLeave();
            hasPointerMoveOpenedRef.current = false;
          })}
          onPointerDown={composeEventHandlers(props.onPointerDown, () => {
            isPointerDownRef.current = true;
            document.addEventListener('pointerup', handlePointerUp, { once: true });
          })}
          onFocus={composeEventHandlers(props.onFocus, () => {
            if (!isPointerDownRef.current) context.onOpen();
          })}
          onBlur={composeEventHandlers(props.onBlur, context.onClose)}
          onClick={composeEventHandlers(props.onClick, context.onClose)}
        />
      </PopperPrimitive.Anchor>
    );
  }
);

TooltipTrigger.displayName = TRIGGER_NAME;

/* -------------------------------------------------------------------------------------------------
 * TooltipPortal
 * -----------------------------------------------------------------------------------------------*/

const PORTAL_NAME = 'TooltipPortal';

type PortalContextValue = { forceMount?: true };
const [PortalProvider, usePortalContext] = createTooltipContext<PortalContextValue>(PORTAL_NAME, {
  forceMount: undefined,
});

type PortalProps = React.ComponentPropsWithoutRef<typeof PortalPrimitive>;
interface TooltipPortalProps {
  children?: React.ReactNode;
  /**
   * Specify a container element to portal the content into.
   */
  container?: PortalProps['container'];
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: true;
}

const TooltipPortal: React.FC<TooltipPortalProps> = (props: ScopedProps<TooltipPortalProps>) => {
  const { __scopeTooltip, forceMount, children, container } = props;
  const context = useTooltipContext(PORTAL_NAME, __scopeTooltip);
  return (
    <PortalProvider scope={__scopeTooltip} forceMount={forceMount}>
      <Presence present={forceMount || context.open}>
        <PortalPrimitive asChild container={container}>
          {children}
        </PortalPrimitive>
      </Presence>
    </PortalProvider>
  );
};

TooltipPortal.displayName = PORTAL_NAME;

/* -------------------------------------------------------------------------------------------------
 * TooltipContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = 'TooltipContent';

type TooltipContentElement = TooltipContentImplElement;
interface TooltipContentProps extends TooltipContentImplProps {
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: true;
}

const TooltipContent = React.forwardRef<TooltipContentElement, TooltipContentProps>(
  (props: ScopedProps<TooltipContentProps>, forwardedRef) => {
    const portalContext = usePortalContext(CONTENT_NAME, props.__scopeTooltip);
    const { forceMount = portalContext.forceMount, side = 'top', ...contentProps } = props;
    const context = useTooltipContext(CONTENT_NAME, props.__scopeTooltip);

    return (
      <Presence present={forceMount || context.open}>
        {context.disableHoverableContent ? (
          <TooltipContentImpl side={side} {...contentProps} ref={forwardedRef} />
        ) : (
          <TooltipContentHoverable side={side} {...contentProps} ref={forwardedRef} />
        )}
      </Presence>
    );
  }
);

type Point = { x: number; y: number };
type Polygon = Point[];

type TooltipContentHoverableElement = TooltipContentImplElement;
interface TooltipContentHoverableProps extends TooltipContentImplProps {}

const TooltipContentHoverable = React.forwardRef<
  TooltipContentHoverableElement,
  TooltipContentHoverableProps
>((props: ScopedProps<TooltipContentHoverableProps>, forwardedRef) => {
  const context = useTooltipContext(CONTENT_NAME, props.__scopeTooltip);
  const providerContext = useTooltipProviderContext(CONTENT_NAME, props.__scopeTooltip);
  const ref = React.useRef<TooltipContentHoverableElement>(null);
  const composedRefs = useComposedRefs(forwardedRef, ref);
  const [pointerGraceArea, setPointerGraceArea] = React.useState<Polygon | null>(null);

  const { trigger, onClose } = context;
  const content = ref.current;

  const { onPointerInTransitChange } = providerContext;

  const handleRemoveGraceArea = React.useCallback(() => {
    setPointerGraceArea(null);
    onPointerInTransitChange(false);
  }, [onPointerInTransitChange]);

  const handleCreateGraceArea = React.useCallback(
    (event: PointerEvent, hoverTarget: HTMLElement) => {
      const currentTarget = event.currentTarget as HTMLElement;
      const exitPoint = { x: event.clientX, y: event.clientY };
      const exitSide = getExitSideFromRect(exitPoint, currentTarget.getBoundingClientRect());
      const paddedExitPoints = getPaddedExitPoints(exitPoint, exitSide);
      const hoverTargetPoints = getPointsFromRect(hoverTarget.getBoundingClientRect());
      const graceArea = getHull([...paddedExitPoints, ...hoverTargetPoints]);
      setPointerGraceArea(graceArea);
      onPointerInTransitChange(true);
    },
    [onPointerInTransitChange]
  );

  React.useEffect(() => {
    return () => handleRemoveGraceArea();
  }, [handleRemoveGraceArea]);

  React.useEffect(() => {
    if (trigger && content) {
      const handleTriggerLeave = (event: PointerEvent) => handleCreateGraceArea(event, content);
      const handleContentLeave = (event: PointerEvent) => handleCreateGraceArea(event, trigger);

      trigger.addEventListener('pointerleave', handleTriggerLeave);
      content.addEventListener('pointerleave', handleContentLeave);
      return () => {
        trigger.removeEventListener('pointerleave', handleTriggerLeave);
        content.removeEventListener('pointerleave', handleContentLeave);
      };
    }
  }, [trigger, content, handleCreateGraceArea, handleRemoveGraceArea]);

  React.useEffect(() => {
    if (pointerGraceArea) {
      const handleTrackPointerGrace = (event: PointerEvent) => {
        const target = event.target as HTMLElement;
        const pointerPosition = { x: event.clientX, y: event.clientY };
        const hasEnteredTarget = trigger?.contains(target) || content?.contains(target);
        const isPointerOutsideGraceArea = !isPointInPolygon(pointerPosition, pointerGraceArea);

        if (hasEnteredTarget) {
          handleRemoveGraceArea();
        } else if (isPointerOutsideGraceArea) {
          handleRemoveGraceArea();
          onClose();
        }
      };
      document.addEventListener('pointermove', handleTrackPointerGrace);
      return () => document.removeEventListener('pointermove', handleTrackPointerGrace);
    }
  }, [trigger, content, pointerGraceArea, onClose, handleRemoveGraceArea]);

  return <TooltipContentImpl {...props} ref={composedRefs} />;
});

const [VisuallyHiddenContentContextProvider, useVisuallyHiddenContentContext] =
  createTooltipContext(TOOLTIP_NAME, { isInside: false });

type TooltipContentImplElement = React.ElementRef<typeof PopperPrimitive.Content>;
type DismissableLayerProps = Radix.ComponentPropsWithoutRef<typeof DismissableLayer>;
type PopperContentProps = Radix.ComponentPropsWithoutRef<typeof PopperPrimitive.Content>;
interface TooltipContentImplProps extends Omit<PopperContentProps, 'onPlaced'> {
  /**
   * A more descriptive label for accessibility purpose
   */
  'aria-label'?: string;

  /**
   * Event handler called when the escape key is down.
   * Can be prevented.
   */
  onEscapeKeyDown?: DismissableLayerProps['onEscapeKeyDown'];
  /**
   * Event handler called when the a `pointerdown` event happens outside of the `Tooltip`.
   * Can be prevented.
   */
  onPointerDownOutside?: DismissableLayerProps['onPointerDownOutside'];
}

const TooltipContentImpl = React.forwardRef<TooltipContentImplElement, TooltipContentImplProps>(
  (props: ScopedProps<TooltipContentImplProps>, forwardedRef) => {
    const {
      __scopeTooltip,
      children,
      'aria-label': ariaLabel,
      onEscapeKeyDown,
      onPointerDownOutside,
      ...contentProps
    } = props;
    const context = useTooltipContext(CONTENT_NAME, __scopeTooltip);
    const popperScope = usePopperScope(__scopeTooltip);
    const { onClose } = context;

    // Close this tooltip if another one opens
    React.useEffect(() => {
      document.addEventListener(TOOLTIP_OPEN, onClose);
      return () => document.removeEventListener(TOOLTIP_OPEN, onClose);
    }, [onClose]);

    // Close the tooltip if the trigger is scrolled
    React.useEffect(() => {
      if (context.trigger) {
        const handleScroll = (event: Event) => {
          const target = event.target as HTMLElement;
          if (target?.contains(context.trigger)) onClose();
        };
        window.addEventListener('scroll', handleScroll, { capture: true });
        return () => window.removeEventListener('scroll', handleScroll, { capture: true });
      }
    }, [context.trigger, onClose]);

    return (
      <DismissableLayer
        asChild
        disableOutsidePointerEvents={false}
        onEscapeKeyDown={onEscapeKeyDown}
        onPointerDownOutside={onPointerDownOutside}
        onFocusOutside={(event) => event.preventDefault()}
        onDismiss={onClose}
      >
        <PopperPrimitive.Content
          data-state={context.stateAttribute}
          {...popperScope}
          {...contentProps}
          ref={forwardedRef}
          style={{
            ...contentProps.style,
            // re-namespace exposed content custom properties
            ...{
              '--radix-tooltip-content-transform-origin': 'var(--radix-popper-transform-origin)',
              '--radix-tooltip-content-available-width': 'var(--radix-popper-available-width)',
              '--radix-tooltip-content-available-height': 'var(--radix-popper-available-height)',
              '--radix-tooltip-trigger-width': 'var(--radix-popper-anchor-width)',
              '--radix-tooltip-trigger-height': 'var(--radix-popper-anchor-height)',
            },
          }}
        >
          <Slottable>{children}</Slottable>
          <VisuallyHiddenContentContextProvider scope={__scopeTooltip} isInside={true}>
            <VisuallyHiddenPrimitive.Root id={context.contentId} role="tooltip">
              {ariaLabel || children}
            </VisuallyHiddenPrimitive.Root>
          </VisuallyHiddenContentContextProvider>
        </PopperPrimitive.Content>
      </DismissableLayer>
    );
  }
);

TooltipContent.displayName = CONTENT_NAME;

/* -------------------------------------------------------------------------------------------------
 * TooltipArrow
 * -----------------------------------------------------------------------------------------------*/

const ARROW_NAME = 'TooltipArrow';

type TooltipArrowElement = React.ElementRef<typeof PopperPrimitive.Arrow>;
type PopperArrowProps = Radix.ComponentPropsWithoutRef<typeof PopperPrimitive.Arrow>;
interface TooltipArrowProps extends PopperArrowProps {}

const TooltipArrow = React.forwardRef<TooltipArrowElement, TooltipArrowProps>(
  (props: ScopedProps<TooltipArrowProps>, forwardedRef) => {
    const { __scopeTooltip, ...arrowProps } = props;
    const popperScope = usePopperScope(__scopeTooltip);
    const visuallyHiddenContentContext = useVisuallyHiddenContentContext(
      ARROW_NAME,
      __scopeTooltip
    );
    // if the arrow is inside the `VisuallyHidden`, we don't want to render it all to
    // prevent issues in positioning the arrow due to the duplicate
    return visuallyHiddenContentContext.isInside ? null : (
      <PopperPrimitive.Arrow {...popperScope} {...arrowProps} ref={forwardedRef} />
    );
  }
);

TooltipArrow.displayName = ARROW_NAME;

/* -----------------------------------------------------------------------------------------------*/

type Side = NonNullable<TooltipContentProps['side']>;

function getExitSideFromRect(point: Point, rect: DOMRect): Side {
  const top = Math.abs(rect.top - point.y);
  const bottom = Math.abs(rect.bottom - point.y);
  const right = Math.abs(rect.right - point.x);
  const left = Math.abs(rect.left - point.x);

  switch (Math.min(top, bottom, right, left)) {
    case left:
      return 'left';
    case right:
      return 'right';
    case top:
      return 'top';
    case bottom:
      return 'bottom';
    default:
      throw new Error('unreachable');
  }
}

function getPaddedExitPoints(exitPoint: Point, exitSide: Side, padding = 5) {
  const paddedExitPoints: Point[] = [];
  switch (exitSide) {
    case 'top':
      paddedExitPoints.push(
        { x: exitPoint.x - padding, y: exitPoint.y + padding },
        { x: exitPoint.x + padding, y: exitPoint.y + padding }
      );
      break;
    case 'bottom':
      paddedExitPoints.push(
        { x: exitPoint.x - padding, y: exitPoint.y - padding },
        { x: exitPoint.x + padding, y: exitPoint.y - padding }
      );
      break;
    case 'left':
      paddedExitPoints.push(
        { x: exitPoint.x + padding, y: exitPoint.y - padding },
        { x: exitPoint.x + padding, y: exitPoint.y + padding }
      );
      break;
    case 'right':
      paddedExitPoints.push(
        { x: exitPoint.x - padding, y: exitPoint.y - padding },
        { x: exitPoint.x - padding, y: exitPoint.y + padding }
      );
      break;
  }
  return paddedExitPoints;
}

function getPointsFromRect(rect: DOMRect) {
  const { top, right, bottom, left } = rect;
  return [
    { x: left, y: top },
    { x: right, y: top },
    { x: right, y: bottom },
    { x: left, y: bottom },
  ];
}

// Determine if a point is inside of a polygon.
// Based on https://github.com/substack/point-in-polygon
function isPointInPolygon(point: Point, polygon: Polygon) {
  const { x, y } = point;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x;
    const yi = polygon[i].y;
    const xj = polygon[j].x;
    const yj = polygon[j].y;

    // prettier-ignore
    const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }

  return inside;
}

// Returns a new array of points representing the convex hull of the given set of points.
// https://www.nayuki.io/page/convex-hull-algorithm
function getHull<P extends Point>(points: Readonly<Array<P>>): Array<P> {
  const newPoints: Array<P> = points.slice();
  newPoints.sort((a: Point, b: Point) => {
    if (a.x < b.x) return -1;
    else if (a.x > b.x) return +1;
    else if (a.y < b.y) return -1;
    else if (a.y > b.y) return +1;
    else return 0;
  });
  return getHullPresorted(newPoints);
}

// Returns the convex hull, assuming that each points[i] <= points[i + 1]. Runs in O(n) time.
function getHullPresorted<P extends Point>(points: Readonly<Array<P>>): Array<P> {
  if (points.length <= 1) return points.slice();

  const upperHull: Array<P> = [];
  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    while (upperHull.length >= 2) {
      const q = upperHull[upperHull.length - 1];
      const r = upperHull[upperHull.length - 2];
      if ((q.x - r.x) * (p.y - r.y) >= (q.y - r.y) * (p.x - r.x)) upperHull.pop();
      else break;
    }
    upperHull.push(p);
  }
  upperHull.pop();

  const lowerHull: Array<P> = [];
  for (let i = points.length - 1; i >= 0; i--) {
    const p = points[i];
    while (lowerHull.length >= 2) {
      const q = lowerHull[lowerHull.length - 1];
      const r = lowerHull[lowerHull.length - 2];
      if ((q.x - r.x) * (p.y - r.y) >= (q.y - r.y) * (p.x - r.x)) lowerHull.pop();
      else break;
    }
    lowerHull.push(p);
  }
  lowerHull.pop();

  if (
    upperHull.length === 1 &&
    lowerHull.length === 1 &&
    upperHull[0].x === lowerHull[0].x &&
    upperHull[0].y === lowerHull[0].y
  ) {
    return upperHull;
  } else {
    return upperHull.concat(lowerHull);
  }
}

const Provider = TooltipProvider;
const Root = Tooltip;
const Trigger = TooltipTrigger;
const Portal = TooltipPortal;
const Content = TooltipContent;
const Arrow = TooltipArrow;

export {
  createTooltipScope,
  //
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipPortal,
  TooltipContent,
  TooltipArrow,
  //
  Provider,
  Root,
  Trigger,
  Portal,
  Content,
  Arrow,
};
export type {
  TooltipProps,
  TooltipTriggerProps,
  TooltipPortalProps,
  TooltipContentProps,
  TooltipArrowProps,
};
