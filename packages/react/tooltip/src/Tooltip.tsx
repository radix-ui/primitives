import * as React from 'react';
import { Portal } from '@interop-ui/react-portal';
import { cssReset, interopDataAttrObj, Side, Align, isFunction } from '@interop-ui/utils';
import {
  composeEventHandlers,
  createContext,
  forwardRef,
  useComposedRefs,
  useControlledState,
  useId,
  usePrevious,
  useRect,
} from '@interop-ui/react-utils';
import { useDebugContext } from '@interop-ui/react-debug-context';
import { createStateMachine, stateChart } from './machine';
import { useSize } from '@interop-ui/react-use-size';
import { getPlacementData } from '@interop-ui/popper';
import { VisuallyHidden } from '@interop-ui/react-visually-hidden';
import { Arrow } from '@interop-ui/react-arrow';

/* -------------------------------------------------------------------------------------------------
 * Root level context
 * -----------------------------------------------------------------------------------------------*/

interface TooltipContextValue {
  align: Align;
  alignOffset: number;
  ariaLabel: string;
  arrowOffset: number;
  arrowRef: React.RefObject<any>;
  collisionTolerance: number;
  isOpen: boolean;
  label: TooltipRootProps['label'];
  popperRef: React.RefObject<any>;
  side: Side;
  sideOffset: number;
  targetRect: ClientRect | undefined;
  targetRef: React.RefObject<any>;
  tooltipId: string;
}

const [TooltipContext, useTooltipContext] = createContext<TooltipContextValue>(
  'TooltipContext',
  'Tooltip.Root'
);

/* -------------------------------------------------------------------------------------------------
 * State machine
 * -----------------------------------------------------------------------------------------------*/

const stateMachine = createStateMachine(stateChart);

/* -------------------------------------------------------------------------------------------------
 * TooltipRoot
 * -----------------------------------------------------------------------------------------------*/

type TooltipRootOwnProps = {
  align?: Align;
  alignOffset?: number;
  'aria-label'?: string;
  arrowOffset?: number;
  collisionTolerance?: number;
  id?: string;
  isOpen?: boolean;
  label: string;
  onOpenChange?: (isOpen?: boolean) => void;
  side?: Side;
  sideOffset?: number;
  children: React.ReactNode;
};
type TooltipRootProps = TooltipRootOwnProps;

const TooltipRoot: React.FC<TooltipRootProps> = function TooltipRoot(props) {
  const {
    children,
    label,

    // we default `ariaLabel` to the `label` to simplify the implementation later on
    // as we then don't need to differentiate whether or not we have an `ariaLabel`
    // we instead always render it inside a `VisuallyHidden`
    'aria-label': ariaLabel = label,
    isOpen: isOpenProp,
    onOpenChange,
    side = 'bottom',
    sideOffset = -5,
    align = 'start',
    alignOffset = 0,
    arrowOffset = 10,
    collisionTolerance = 0,
  } = props;

  const _id = `tooltip-${useId()}`;
  const id = props.id || _id;

  // send transition if the component unmounts
  React.useEffect(() => {
    return () => {
      stateMachine.transition('unmounted', { id });
    };
  }, [id]);

  // if we're controlling the component
  // put the state machine in the appropriate state
  React.useEffect(() => {
    if (isOpenProp === true) {
      stateMachine.transition('mouseEntered', { id });
    }
  }, [id, isOpenProp]);

  const [_isOpen, setIsOpen] = useControlledState({
    prop: isOpenProp,
    onChange: onOpenChange,
  });
  const isOpen = Boolean(_isOpen);

  const targetRef = React.useRef<HTMLElement | SVGElement>(null);
  const targetRect = useRect({
    refToObserve: targetRef,
    isObserving: isOpen,
    shouldResetWhenNotObserving: true,
  });

  const targetLeft = targetRect?.left;
  const previousTargetLeft = usePrevious(targetLeft);
  const targetTop = targetRect?.top;
  const previousTargetTop = usePrevious(targetTop);

  const popperRef = React.useRef<HTMLDivElement>(null);
  const arrowRef = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    const unsubscribe = stateMachine.subscribe((state, context) => {
      if (state === 'OPEN' && context.id === id) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    });

    return unsubscribe;
  }, [id, setIsOpen]);

  React.useEffect(() => {
    // checking if the user has scrolled…
    const hasTargetMoved =
      (previousTargetLeft !== undefined && previousTargetLeft !== targetLeft) ||
      (previousTargetTop !== undefined && previousTargetTop !== targetTop);

    if (isOpen && hasTargetMoved) {
      stateMachine.transition('targetMoved', { id });
    }
  }, [id, isOpen, previousTargetLeft, previousTargetTop, targetLeft, targetTop]);

  return (
    <TooltipContext.Provider
      value={{
        align,
        alignOffset,
        ariaLabel,
        arrowOffset,
        arrowRef,
        collisionTolerance,
        isOpen,
        label,
        popperRef,
        side,
        sideOffset,
        targetRect,
        targetRef,
        tooltipId: id,
      }}
    >
      {children}
    </TooltipContext.Provider>
  );
};

TooltipRoot.displayName = 'Tooltip.Root';

/* -------------------------------------------------------------------------------------------------
 * TooltipTarget
 * -----------------------------------------------------------------------------------------------*/

type TooltipTargetOwnProps = {};
type TooltipTargetProps = TooltipTargetOwnProps;

const TooltipTarget: React.FC<TooltipTargetProps> = function TooltipTarget(props) {
  let { targetRef, tooltipId } = useTooltipContext('Tooltip.Target');
  let { children } = props;

  let child = React.Children.only(children);
  let ref = useComposedRefs((child as any).ref || null, targetRef);

  if (!React.isValidElement(child)) {
    // TODO: THROW DEV WARNING?
    return null;
  }

  let { onMouseEnter, onMouseMove, onMouseLeave, onFocus, onBlur, onMouseDown, onKeyDown } = (
    child || { props: {} }
  ).props;

  return React.cloneElement(child, {
    ...interopDataAttrObj('TooltipTarget'),
    ref,
    'aria-describedby': tooltipId,
    onMouseEnter: composeEventHandlers(onMouseEnter, () =>
      stateMachine.transition('mouseEntered', { id: tooltipId })
    ),
    onMouseMove: composeEventHandlers(onMouseMove, () =>
      stateMachine.transition('mouseMoved', { id: tooltipId })
    ),
    onMouseLeave: composeEventHandlers(onMouseLeave, () => {
      const context = stateMachine.getContext();
      if (context.id === tooltipId) {
        stateMachine.transition('mouseLeft', { id: tooltipId });
      }
    }),
    onFocus: composeEventHandlers(onFocus, () =>
      stateMachine.transition('focused', { id: tooltipId })
    ),
    onBlur: composeEventHandlers(onBlur, () => {
      const context = stateMachine.getContext();
      if (context.id === tooltipId) {
        stateMachine.transition('blurred', { id: tooltipId });
      }
    }),
    onMouseDown: composeEventHandlers(onMouseDown, () =>
      stateMachine.transition('activated', { id: tooltipId })
    ),
    onKeyDown: composeEventHandlers(onKeyDown, (event: KeyboardEvent) => {
      if (event.key === 'Escape' || event.key === 'Enter' || event.key === ' ') {
        stateMachine.transition('activated', { id: tooltipId });
      }
    }),
  });
};

TooltipTarget.displayName = 'Tooltip.Target';

/* -------------------------------------------------------------------------------------------------
 * TooltipPopper
 * -----------------------------------------------------------------------------------------------*/

const POPPER_DEFAULT_TAG = 'div';

type TooltipPopperDOMProps = React.ComponentPropsWithRef<typeof POPPER_DEFAULT_TAG>;
type TooltipPopperOwnProps = {};
type TooltipPopperProps = TooltipPopperDOMProps & TooltipPopperOwnProps;

const TooltipArrowContext = React.createContext<{
  arrowStyles: React.CSSProperties;
}>({ arrowStyles: {} });
TooltipArrowContext.displayName = 'TooltipArrowContext';

const TooltipPopper = forwardRef<typeof POPPER_DEFAULT_TAG, TooltipPopperProps>(
  function TooltipPopper(props, forwardedRef) {
    let { as: Comp = POPPER_DEFAULT_TAG, style, children, ...otherProps } = props;
    let {
      align,
      alignOffset,
      ariaLabel,
      arrowOffset,
      arrowRef,
      collisionTolerance,
      isOpen,
      popperRef,
      side,
      sideOffset,
      targetRect,
      tooltipId,
    } = useTooltipContext('Tooltip.Popper');

    const popperSize = useSize({
      refToObserve: popperRef,
      isObserving: isOpen,
    });

    const arrowSize = useSize({ refToObserve: arrowRef, isObserving: isOpen });
    const debugContext = useDebugContext();

    const { popperStyles, arrowStyles } = getPlacementData({
      popperSize,
      targetRect,
      arrowSize,
      arrowOffset,
      side,
      sideOffset,
      align,
      alignOffset,
      collisionTolerance,
      shouldAvoidCollisions: !debugContext.disableCollisionChecking,
    });

    return (
      <TooltipArrowContext.Provider value={{ arrowStyles }}>
        {isOpen ? (
          <Portal>
            <Comp
              ref={forwardedRef}
              style={{
                ...popperStyles,
                ...style,
              }}
              {...otherProps}
            >
              {/*
              we put the `popperRef` on a div around the content
              and not on the content element itself.

              This is because the size measured by `useSize`
              doesn't account for padding/border (ResizeObserver limitations)
              so there would be some calculations issues if padding/border
              styles are passed to `<Content />` via css

              See: https://github.com/que-etc/resize-observer-polyfill/issues/11
            */}
              <div ref={popperRef}>{children}</div>

              <VisuallyHidden id={tooltipId} role="tooltip">
                {ariaLabel}
              </VisuallyHidden>
            </Comp>
          </Portal>
        ) : null}
      </TooltipArrowContext.Provider>
    );
  }
);

TooltipPopper.displayName = 'Tooltip.Popper';

/* -------------------------------------------------------------------------------------------------
 * TooltipContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_DEFAULT_TAG = 'div';

type TooltipContentDOMProps = React.ComponentPropsWithRef<typeof CONTENT_DEFAULT_TAG>;
type TooltipContentOwnProps = {
  children?(props: { label: string }): React.ReactNode;
};
type TooltipContentProps = TooltipContentDOMProps & TooltipContentOwnProps;

const TooltipContent = forwardRef<typeof CONTENT_DEFAULT_TAG, TooltipContentProps>(
  function TooltipContent(props, forwardedRef) {
    const { as: Comp = CONTENT_DEFAULT_TAG, children, ...otherProps } = props;
    const { label } = useTooltipContext('Tooltip.Content');
    return (
      <Comp ref={forwardedRef} {...otherProps}>
        {isFunction(children) ? children({ label }) : label}
      </Comp>
    );
  }
);

TooltipContent.displayName = 'Tooltip.Content';
/* -------------------------------------------------------------------------------------------------
 * TooltipContent
 * -----------------------------------------------------------------------------------------------*/

const ARROW_DEFAULT_TAG = 'span';

type TooltipArrowDOMProps = React.ComponentPropsWithRef<typeof ARROW_DEFAULT_TAG>;
type TooltipArrowOwnProps = {};
type TooltipArrowProps = TooltipArrowDOMProps & TooltipArrowOwnProps;

const TooltipArrow = forwardRef<typeof ARROW_DEFAULT_TAG, TooltipArrowProps>(function TooltipArrow(
  props,
  forwardedRef
) {
  let { as: Comp = ARROW_DEFAULT_TAG, style, children, ...otherProps } = props;
  let { arrowRef } = useTooltipContext('Tooltip.Arrow');
  let ref = useComposedRefs(forwardedRef, arrowRef);
  let { arrowStyles } = React.useContext(TooltipArrowContext);
  return (
    <Comp
      style={{
        ...arrowStyles,
        ...style,
      }}
      {...otherProps}
    >
      <span
        // we use an extra wrapper because `useSize` doesn't play well with
        // the SVG arrow which is sized via CSS
        ref={ref}
      >
        <Arrow />
      </span>
    </Comp>
  );
});

TooltipArrow.displayName = 'Tooltip.Arrow';

/* -------------------------------------------------------------------------------------------------
 * Composed Tooltip
 * -----------------------------------------------------------------------------------------------*/

type TooltipDOMProps = TooltipContentDOMProps;
type TooltipOwnProps = TooltipRootOwnProps;
type TooltipProps = TooltipDOMProps & TooltipOwnProps;

const Tooltip = forwardRef<typeof CONTENT_DEFAULT_TAG, TooltipProps, TooltipStaticProps>(
  function Tooltip(props, ref) {
    let {
      label,
      'aria-label': ariaLabel,
      isOpen,
      onOpenChange,
      side,
      sideOffset,
      align,
      alignOffset,
      arrowOffset,
      collisionTolerance,
      children,
      ...contentProps
    } = props;
    return (
      <TooltipRoot
        label={label}
        aria-label={ariaLabel}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        arrowOffset={arrowOffset}
        collisionTolerance={collisionTolerance}
      >
        <TooltipTarget>{children}</TooltipTarget>
        <TooltipPopper>
          <TooltipContent {...contentProps} />
          <TooltipArrow />
        </TooltipPopper>
      </TooltipRoot>
    );
  }
);

Tooltip.displayName = 'Tooltip';

/* -----------------------------------------------------------------------------------------------*/

Tooltip.Root = TooltipRoot;
Tooltip.Target = TooltipTarget;
Tooltip.Popper = TooltipPopper;
Tooltip.Content = TooltipContent;

const styles = {
  root: null,
  target: null,
  popper: {
    ...cssReset(POPPER_DEFAULT_TAG),
    zIndex: 99999,
    pointerEvents: 'none',
  },
  arrow: {
    ...cssReset(ARROW_DEFAULT_TAG),
    display: 'inline-block',
    verticalAlign: 'top',
  },
  content: {
    ...cssReset(CONTENT_DEFAULT_TAG),
    display: 'inline-flex',
    alignItems: 'center',
  },
};

export { Tooltip, styles };
export type {
  TooltipProps,
  TooltipRootProps,
  TooltipTargetProps,
  TooltipPopperProps,
  TooltipArrowProps,
  TooltipContentProps,
};

interface TooltipStaticProps {
  Root: typeof TooltipRoot;
  Target: typeof TooltipTarget;
  Popper: typeof TooltipPopper;
  Arrow: typeof TooltipArrow;
  Content: typeof TooltipContent;
}
