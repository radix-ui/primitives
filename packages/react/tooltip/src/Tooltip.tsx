import * as React from 'react';
import { getSelector } from '@radix-ui/utils';
import {
  createContext,
  useComposedRefs,
  useId,
  composeEventHandlers,
  useRect,
  usePrevious,
  useControlledState,
  useLayoutEffect,
  extendComponent,
} from '@radix-ui/react-utils';
import { Primitive } from '@radix-ui/react-primitive';
import * as PopperPrimitive from '@radix-ui/react-popper';
import { Portal } from '@radix-ui/react-portal';
import { Slottable } from '@radix-ui/react-slot';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { createStateMachine, stateChart } from './machine';

import type * as Polymorphic from '@radix-ui/react-polymorphic';
import type { Merge } from '@radix-ui/utils';

/* -------------------------------------------------------------------------------------------------
 * Root level context
 * -----------------------------------------------------------------------------------------------*/

type StateAttribute = 'closed' | 'delayed-open' | 'instant-open';

type TooltipContextValue = {
  triggerRef: React.RefObject<HTMLButtonElement>;
  id: string;
  open: boolean;
  stateAttribute: StateAttribute;
};

const [TooltipContext, useTooltipContext] = createContext<TooltipContextValue>(
  'TooltipContext',
  'Tooltip'
);

/* -------------------------------------------------------------------------------------------------
 * State machine
 * -----------------------------------------------------------------------------------------------*/

const stateMachine = createStateMachine(stateChart);

/* -------------------------------------------------------------------------------------------------
 * Tooltip
 * -----------------------------------------------------------------------------------------------*/

const TOOLTIP_NAME = 'Tooltip';

type TooltipOwnProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

const Tooltip: React.FC<TooltipOwnProps> = (props) => {
  const { children, open: openProp, defaultOpen = false, onOpenChange } = props;
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const id = `tooltip-${useId()}`;
  const [open = false, setOpen] = useControlledState({
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
      if (state === 'OPEN' && context.id === id) {
        setOpen(true);
      } else {
        setOpen(false);
      }
    });

    return unsubscribe;
  }, [id, setOpen]);

  // sync state attribute with using state machine subscription
  React.useEffect(() => {
    const unsubscribe = stateMachine.subscribe(({ state, previousState }) => {
      if (state === 'OPEN') {
        if (previousState === 'WAITING_FOR_REST') {
          setStateAttribute('delayed-open');
        }
        if (
          previousState === 'CHECKING_IF_SHOULD_SKIP_REST_THRESHOLD' ||
          previousState === 'CLOSED'
        ) {
          setStateAttribute('instant-open');
        }
      }
      if (state === 'CLOSED') {
        setStateAttribute('closed');
      }
    });

    return unsubscribe;
  }, []);

  // send transition if the component unmounts
  React.useEffect(() => {
    return () => {
      stateMachine.transition('unmounted', { id });
    };
  }, [id]);

  // if we're controlling the component
  // put the state machine in the appropriate state
  useLayoutEffect(() => {
    if (openProp === true) {
      stateMachine.transition('mouseEntered', { id });
    }
  }, [id, openProp]);

  const context = React.useMemo(() => ({ triggerRef, id, open, stateAttribute }), [
    id,
    open,
    stateAttribute,
  ]);

  return <TooltipContext.Provider value={context}>{children}</TooltipContext.Provider>;
};

Tooltip.displayName = TOOLTIP_NAME;

/* -------------------------------------------------------------------------------------------------
 * TooltipTrigger
 * -----------------------------------------------------------------------------------------------*/

const TRIGGER_NAME = 'TooltipTrigger';
const TRIGGER_DEFAULT_TAG = 'button';

type TooltipTriggerOwnProps = Polymorphic.OwnProps<typeof Primitive>;
type TooltipTriggerPrimitive = Polymorphic.ForwardRefComponent<
  typeof TRIGGER_DEFAULT_TAG,
  TooltipTriggerOwnProps
>;

const TooltipTrigger = React.forwardRef((props, forwardedRef) => {
  const { as = TRIGGER_DEFAULT_TAG, selector = getSelector(TRIGGER_NAME), ...triggerProps } = props;
  const context = useTooltipContext(TRIGGER_NAME);
  const composedTriggerRef = useComposedRefs(forwardedRef, context.triggerRef);

  return (
    <Primitive
      type="button"
      aria-describedby={context.open ? context.id : undefined}
      {...triggerProps}
      as={as}
      selector={selector}
      ref={composedTriggerRef}
      onMouseEnter={composeEventHandlers(props.onMouseEnter, () =>
        stateMachine.transition('mouseEntered', { id: context.id })
      )}
      onMouseMove={composeEventHandlers(props.onMouseMove, () =>
        stateMachine.transition('mouseMoved', { id: context.id })
      )}
      onMouseLeave={composeEventHandlers(props.onMouseLeave, () => {
        const stateMachineContext = stateMachine.getContext();
        if (stateMachineContext.id === context.id) {
          stateMachine.transition('mouseLeft', { id: context.id });
        }
      })}
      onFocus={composeEventHandlers(props.onFocus, () =>
        stateMachine.transition('focused', { id: context.id })
      )}
      onBlur={composeEventHandlers(props.onBlur, () => {
        const stateMachineContext = stateMachine.getContext();
        if (stateMachineContext.id === context.id) {
          stateMachine.transition('blurred', { id: context.id });
        }
      })}
      onMouseDown={composeEventHandlers(props.onMouseDown, () =>
        stateMachine.transition('activated', { id: context.id })
      )}
      onKeyDown={composeEventHandlers(props.onKeyDown, (event) => {
        if (event.key === 'Escape' || event.key === 'Enter' || event.key === ' ') {
          stateMachine.transition('activated', { id: context.id });
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

type TooltipContentOwnProps = Polymorphic.OwnProps<typeof TooltipContentImpl>;
type TooltipContentPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof TooltipContentImpl>,
  TooltipContentOwnProps
>;

const TooltipContent = React.forwardRef((props, forwardedRef) => {
  const context = useTooltipContext(CONTENT_NAME);
  return context.open ? <TooltipContentImpl ref={forwardedRef} {...props} /> : null;
}) as TooltipContentPrimitive;

type PopperPrimitiveOwnProps = Polymorphic.OwnProps<typeof PopperPrimitive.Root>;
type TooltipContentImplOwnProps = Merge<
  PopperPrimitiveOwnProps,
  {
    /**
     * A more descriptive label for accessibility purpose
     */
    'aria-label'?: string;

    anchorRef?: PopperPrimitiveOwnProps['anchorRef'];

    /**
     * Whether the Tooltip should render in a Portal
     * (default: `true`)
     */
    portalled?: boolean;
  }
>;

type TooltipContentImplPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof PopperPrimitive.Root>,
  TooltipContentImplOwnProps
>;

const TooltipContentImpl = React.forwardRef((props, forwardedRef) => {
  const {
    selector = getSelector(CONTENT_NAME),
    children,
    'aria-label': ariaLabel,
    anchorRef,
    portalled = true,
    ...contentProps
  } = props;
  const context = useTooltipContext(CONTENT_NAME);
  const PortalWrapper = portalled ? Portal : React.Fragment;

  return (
    <PortalWrapper>
      <CheckTriggerMoved />
      <PopperPrimitive.Root
        {...contentProps}
        selector={selector}
        ref={forwardedRef}
        data-state={context.stateAttribute}
        anchorRef={anchorRef || context.triggerRef}
        style={{
          ...contentProps.style,
          // re-namespace exposed content custom property
          ['--radix-tooltip-content-transform-origin' as any]: 'var(--radix-popper-transform-origin)',
        }}
      >
        <Slottable>{children}</Slottable>
        <VisuallyHidden id={context.id} role="tooltip">
          {ariaLabel || children}
        </VisuallyHidden>
      </PopperPrimitive.Root>
    </PortalWrapper>
  );
}) as TooltipContentImplPrimitive;

TooltipContent.displayName = CONTENT_NAME;

/* ---------------------------------------------------------------------------------------------- */

const TooltipArrow = extendComponent(PopperPrimitive.Arrow, 'TooltipArrow');

/* -----------------------------------------------------------------------------------------------*/

function CheckTriggerMoved() {
  const { triggerRef, id } = useTooltipContext('CheckTriggerMoved');

  const triggerRect = useRect(triggerRef);
  const triggerLeft = triggerRect?.left;
  const previousTriggerLeft = usePrevious(triggerLeft);
  const triggerTop = triggerRect?.top;
  const previousTriggerTop = usePrevious(triggerTop);

  React.useEffect(() => {
    // checking if the user has scrolled…
    const hasTriggerMoved =
      (previousTriggerLeft !== undefined && previousTriggerLeft !== triggerLeft) ||
      (previousTriggerTop !== undefined && previousTriggerTop !== triggerTop);

    if (hasTriggerMoved) {
      stateMachine.transition('triggerMoved', { id });
    }
  }, [id, previousTriggerLeft, previousTriggerTop, triggerLeft, triggerTop]);

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
