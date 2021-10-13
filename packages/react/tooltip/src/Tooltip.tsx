import * as React from 'react';
import { composeEventHandlers } from '@radix-ui/primitive';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import { createContext } from '@radix-ui/react-context';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { useEscapeKeydown } from '@radix-ui/react-use-escape-keydown';
import { usePrevious } from '@radix-ui/react-use-previous';
import { useRect } from '@radix-ui/react-use-rect';
import { Presence } from '@radix-ui/react-presence';
import { Primitive } from '@radix-ui/react-primitive';
import * as PopperPrimitive from '@radix-ui/react-popper';
import { Portal } from '@radix-ui/react-portal';
import { Slottable } from '@radix-ui/react-slot';
import * as VisuallyHiddenPrimitive from '@radix-ui/react-visually-hidden';
import { useId } from '@radix-ui/react-id';
import { createStateMachine } from './createStateMachine';
import { tooltipStateChart } from './tooltipStateChart';

import type * as Radix from '@radix-ui/react-primitive';

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
  trigger: TooltipTriggerElement | null;
  onTriggerChange(trigger: TooltipTriggerElement | null): void;
  onFocus(): void;
  onOpen(): void;
  onClose(): void;
};

const [TooltipProvider, useTooltipContext] = createContext<TooltipContextValue>(TOOLTIP_NAME);

interface TooltipProps {
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
}

const Tooltip: React.FC<TooltipProps> = (props) => {
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
  const isFocusedRef = React.useRef(false);
  const [open = false, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  });

  const [machine, setMachine] = React.useState({
    state: open ? 'open' : 'closed',
    context: stateMachine.getContext(),
  });

  const stateAttribute = React.useMemo(() => {
    if (machine.context.id === contentId && machine.state === 'open') {
      return machine.context.delayed ? 'delayed-open' : 'instant-open';
    } else {
      return 'closed';
    }
  }, [machine, contentId]);

  // Subscribe to state machine changes before any state machine events are fired.
  React.useEffect(() => {
    return stateMachine.subscribe((machine) => {
      setMachine(machine);
      // Close this tooltip if it's not the active tooltip
      if (machine.context.id !== contentId) setOpen(false);
      // Sync the state if the machine moves to open state internally (e.g. after a timer)
      else if (machine.state === 'open') setOpen(true);
    });
  }, [contentId, setOpen]);

  // Sync machine with `useControlledState` because the latter should be
  // the source of truth for the state machine where possible.
  React.useEffect(() => {
    if (open) {
      const event = isFocusedRef.current
        ? ({ type: 'FOCUS', id: contentId } as const)
        : ({ type: 'OPEN', id: contentId, delayDuration } as const);
      stateMachine.send(event);
    } else {
      stateMachine.send({ type: 'CLOSE', id: contentId, skipDelayDuration });
    }
    isFocusedRef.current = false;
  }, [contentId, defaultOpen, open, delayDuration, skipDelayDuration]);

  // send transition if the component unmounts
  React.useEffect(() => () => setOpen(false), [setOpen]);

  return (
    <PopperPrimitive.Root>
      <TooltipProvider
        contentId={contentId}
        open={machine.context.id === contentId && machine.state === 'open'}
        stateAttribute={stateAttribute}
        trigger={trigger}
        onTriggerChange={setTrigger}
        onOpen={React.useCallback(() => setOpen(true), [setOpen])}
        onClose={React.useCallback(() => setOpen(false), [setOpen])}
        onFocus={React.useCallback(() => {
          setOpen(true);
          isFocusedRef.current = true;
        }, [setOpen])}
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

type TooltipTriggerElement = React.ElementRef<typeof Primitive.button>;
type PrimitiveButtonProps = Radix.ComponentPropsWithoutRef<typeof Primitive.button>;
interface TooltipTriggerProps extends PrimitiveButtonProps {}

const TooltipTrigger = React.forwardRef<TooltipTriggerElement, TooltipTriggerProps>(
  (props, forwardedRef) => {
    const context = useTooltipContext(TRIGGER_NAME);
    const composedTriggerRef = useComposedRefs(forwardedRef, context.onTriggerChange);
    return (
      <PopperPrimitive.Anchor asChild>
        <Primitive.button
          type="button"
          aria-describedby={context.open ? context.contentId : undefined}
          data-state={context.stateAttribute}
          {...props}
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
      </PopperPrimitive.Anchor>
    );
  }
);

TooltipTrigger.displayName = TRIGGER_NAME;

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
  (props, forwardedRef) => {
    const { forceMount, ...contentProps } = props;
    const context = useTooltipContext(CONTENT_NAME);
    return (
      <Presence present={forceMount || context.open}>
        <TooltipContentImpl ref={forwardedRef} {...contentProps} />
      </Presence>
    );
  }
);

type TooltipContentImplElement = React.ElementRef<typeof PopperPrimitive.Content>;
type PopperContentProps = Radix.ComponentPropsWithoutRef<typeof PopperPrimitive.Content>;
interface TooltipContentImplProps extends PopperContentProps {
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

const TooltipContentImpl = React.forwardRef<TooltipContentImplElement, TooltipContentImplProps>(
  (props, forwardedRef) => {
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
            ['--radix-tooltip-content-transform-origin' as any]:
              'var(--radix-popper-transform-origin)',
          }}
        >
          <Slottable>{children}</Slottable>
          <VisuallyHiddenPrimitive.Root id={context.contentId} role="tooltip">
            {ariaLabel || children}
          </VisuallyHiddenPrimitive.Root>
        </PopperPrimitive.Content>
      </PortalWrapper>
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
  (props, forwardedRef) => <PopperPrimitive.Arrow {...props} ref={forwardedRef} />
);

TooltipArrow.displayName = ARROW_NAME;

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
export type { TooltipProps, TooltipTriggerProps, TooltipContentProps, TooltipArrowProps };
