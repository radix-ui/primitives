import * as React from 'react';
import { composeEventHandlers } from '@radix-ui/primitive';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import { createContext } from '@radix-ui/react-context';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { useEscapeKeydown } from '@radix-ui/react-use-escape-keydown';
import { useLayoutEffect } from '@radix-ui/react-use-layout-effect';
import { usePrevious } from '@radix-ui/react-use-previous';
import { useRect } from '@radix-ui/react-use-rect';
import { Presence } from '@radix-ui/react-presence';
import { extendPrimitive } from '@radix-ui/react-primitive';
import * as PopperPrimitive from '@radix-ui/react-popper';
import { Portal } from '@radix-ui/react-portal';
import { Slottable } from '@radix-ui/react-slot';
import * as VisuallyHiddenPrimitive from '@radix-ui/react-visually-hidden';
import { useId } from '@radix-ui/react-id';
import { createStateMachine } from './createStateMachine';
import { tooltipStateChart } from './tooltipStateChart';

import type * as Polymorphic from '@radix-ui/react-polymorphic';

/* -------------------------------------------------------------------------------------------------
 * State machine
 * -----------------------------------------------------------------------------------------------*/

type StateAttribute = 'closed' | 'delayed-open' | 'instant-open';
const stateMachine = createStateMachine(tooltipStateChart);

/* -------------------------------------------------------------------------------------------------
 * Tooltip
 * -----------------------------------------------------------------------------------------------*/

const TOOLTIP_NAME = 'Tooltip';

type TooltipContextValue = {
  contentId: string;
  open: boolean;
  stateAttribute: StateAttribute;
  trigger: React.ElementRef<typeof TooltipTrigger> | null;
  onTriggerChange(trigger: React.ElementRef<typeof TooltipTrigger> | null): void;
  onFocus(): void;
  onOpen(): void;
  onClose(): void;
};

const [TooltipProvider, useTooltipContext] = createContext<TooltipContextValue>(TOOLTIP_NAME);

type TooltipOwnProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;

  /**
   * The duration from when the mouse enters the trigger until the tooltip gets opened.
   * (default: 700)
   */
  delayDuration?: number;

  /**
   * How much time a user has to enter another trigger without incurring a delay again.
   * (default: 300)
   */
  skipDelayDuration?: number;
};

const Tooltip: React.FC<TooltipOwnProps> = (props) => {
  const {
    children,
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    delayDuration = 700,
    skipDelayDuration = 300,
  } = props;
  const [trigger, setTrigger] = React.useState<HTMLButtonElement | null>(null);
  const contentId = useId();
  const [open = false, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  });
  const [stateAttribute, setStateAttribute] = React.useState<StateAttribute>(
    openProp ? 'instant-open' : 'closed'
  );

  // control open state using state machine subscription
  React.useEffect(() => {
    const unsubscribe = stateMachine.subscribe(({ state, context }) => {
      if (state === 'open' && context.id === contentId) {
        setOpen(true);
      } else {
        setOpen(false);
      }
    });

    return unsubscribe;
  }, [contentId, setOpen]);

  // sync state attribute with using state machine subscription
  React.useEffect(() => {
    const unsubscribe = stateMachine.subscribe(({ state, context }) => {
      if (context.id === contentId) {
        if (state === 'open') {
          setStateAttribute(context.delayed ? 'delayed-open' : 'instant-open');
        } else {
          setStateAttribute('closed');
        }
      } else {
        setStateAttribute('closed');
      }
    });

    return unsubscribe;
  }, [contentId]);

  const handleFocus = React.useCallback(() => stateMachine.send({ type: 'FOCUS', id: contentId }), [
    contentId,
  ]);
  const handleOpen = React.useCallback(
    () => stateMachine.send({ type: 'OPEN', id: contentId, delayDuration }),
    [contentId, delayDuration]
  );
  const handleClose = React.useCallback(
    () => stateMachine.send({ type: 'CLOSE', id: contentId, skipDelayDuration }),
    [skipDelayDuration, contentId]
  );

  // send transition if the component unmounts
  React.useEffect(() => () => handleClose(), [handleClose]);

  // if we're controlling the component
  // put the state machine in the appropriate state
  useLayoutEffect(() => {
    if (openProp === true) {
      stateMachine.send({ type: 'OPEN', id: contentId });
    }
  }, [contentId, openProp]);

  return (
    <PopperPrimitive.Root>
      <TooltipProvider
        contentId={contentId}
        open={open}
        stateAttribute={stateAttribute}
        trigger={trigger}
        onTriggerChange={setTrigger}
        onFocus={handleFocus}
        onOpen={handleOpen}
        onClose={handleClose}
      >
        {children}
      </TooltipProvider>
    </PopperPrimitive.Root>
  );
};

Tooltip.displayName = TOOLTIP_NAME;

/* -------------------------------------------------------------------------------------------------
 * TooltipTrigger
 * -----------------------------------------------------------------------------------------------*/

const TRIGGER_NAME = 'TooltipTrigger';
const TRIGGER_DEFAULT_TAG = 'button';

type TooltipTriggerOwnProps = Omit<
  Polymorphic.OwnProps<typeof PopperPrimitive.Anchor>,
  'virtualRef'
>;
type TooltipTriggerPrimitive = Polymorphic.ForwardRefComponent<
  typeof TRIGGER_DEFAULT_TAG,
  TooltipTriggerOwnProps
>;

const TooltipTrigger = React.forwardRef((props, forwardedRef) => {
  const { as = TRIGGER_DEFAULT_TAG, ...triggerProps } = props;
  const context = useTooltipContext(TRIGGER_NAME);
  const composedTriggerRef = useComposedRefs(forwardedRef, (node) => context.onTriggerChange(node));

  return (
    <PopperPrimitive.Anchor
      type="button"
      aria-describedby={context.open ? context.contentId : undefined}
      data-state={context.stateAttribute}
      {...triggerProps}
      as={as}
      ref={composedTriggerRef}
      onMouseEnter={composeEventHandlers(props.onMouseEnter, context.onOpen)}
      onMouseLeave={composeEventHandlers(props.onMouseLeave, context.onClose)}
      onMouseDown={composeEventHandlers(props.onMouseDown, context.onClose)}
      onFocus={composeEventHandlers(props.onFocus, context.onFocus)}
      onBlur={composeEventHandlers(props.onBlur, context.onClose)}
      onKeyDown={composeEventHandlers(props.onKeyDown, (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          context.onClose();
        }
      })}
    />
  );
}) as TooltipTriggerPrimitive;

TooltipTrigger.displayName = TRIGGER_NAME;

/* -------------------------------------------------------------------------------------------------
 * TooltipContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = 'TooltipContent';

type TooltipContentOwnProps = Polymorphic.Merge<
  Polymorphic.OwnProps<typeof TooltipContentImpl>,
  {
    /**
     * Used to force mounting when more control is needed. Useful when
     * controlling animation with React animation libraries.
     */
    forceMount?: true;
  }
>;

type TooltipContentPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof TooltipContentImpl>,
  TooltipContentOwnProps
>;

const TooltipContent = React.forwardRef((props, forwardedRef) => {
  const { forceMount, ...contentProps } = props;
  const context = useTooltipContext(CONTENT_NAME);
  return (
    <Presence present={forceMount || context.open}>
      <TooltipContentImpl ref={forwardedRef} {...contentProps} />
    </Presence>
  );
}) as TooltipContentPrimitive;

type TooltipContentImplOwnProps = Polymorphic.Merge<
  Polymorphic.OwnProps<typeof PopperPrimitive.Content>,
  {
    /**
     * A more descriptive label for accessibility purpose
     */
    'aria-label'?: string;

    /**
     * Whether the Tooltip should render in a Portal
     * (default: `true`)
     */
    portalled?: boolean;
  }
>;

type TooltipContentImplPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof PopperPrimitive.Content>,
  TooltipContentImplOwnProps
>;

const TooltipContentImpl = React.forwardRef((props, forwardedRef) => {
  const { children, 'aria-label': ariaLabel, portalled = true, ...contentProps } = props;
  const context = useTooltipContext(CONTENT_NAME);
  const PortalWrapper = portalled ? Portal : React.Fragment;

  useEscapeKeydown(() => context.onClose());

  return (
    <PortalWrapper>
      <CheckTriggerMoved />
      <PopperPrimitive.Content
        data-state={context.stateAttribute}
        {...contentProps}
        ref={forwardedRef}
        style={{
          ...contentProps.style,
          // re-namespace exposed content custom property
          ['--radix-tooltip-content-transform-origin' as any]: 'var(--radix-popper-transform-origin)',
        }}
      >
        <Slottable>{children}</Slottable>
        <VisuallyHiddenPrimitive.Root id={context.contentId} role="tooltip">
          {ariaLabel || children}
        </VisuallyHiddenPrimitive.Root>
      </PopperPrimitive.Content>
    </PortalWrapper>
  );
}) as TooltipContentImplPrimitive;

TooltipContent.displayName = CONTENT_NAME;

/* ---------------------------------------------------------------------------------------------- */

const TooltipArrow = extendPrimitive(PopperPrimitive.Arrow, { displayName: 'TooltipArrow' });

/* -----------------------------------------------------------------------------------------------*/

function CheckTriggerMoved() {
  const context = useTooltipContext('CheckTriggerMoved');

  const triggerRect = useRect(context.trigger);
  const triggerLeft = triggerRect?.left;
  const previousTriggerLeft = usePrevious(triggerLeft);
  const triggerTop = triggerRect?.top;
  const previousTriggerTop = usePrevious(triggerTop);
  const handleClose = context.onClose;

  React.useEffect(() => {
    // checking if the user has scrolled…
    const hasTriggerMoved =
      (previousTriggerLeft !== undefined && previousTriggerLeft !== triggerLeft) ||
      (previousTriggerTop !== undefined && previousTriggerTop !== triggerTop);

    if (hasTriggerMoved) {
      handleClose();
    }
  }, [handleClose, previousTriggerLeft, previousTriggerTop, triggerLeft, triggerTop]);

  return null;
}

const Root = Tooltip;
const Trigger = TooltipTrigger;
const Content = TooltipContent;
const Arrow = TooltipArrow;

export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipArrow,
  //
  Root,
  Trigger,
  Content,
  Arrow,
};
