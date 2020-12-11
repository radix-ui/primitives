import * as React from 'react';
import { getPartDataAttrObj } from '@interop-ui/utils';
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
} from '@interop-ui/react-utils';
import { forwardRefWithAs } from '@interop-ui/react-polymorphic';
import * as PopperPrimitive from '@interop-ui/react-popper';
import { Portal } from '@interop-ui/react-portal';
import { VisuallyHidden } from '@interop-ui/react-visually-hidden';
import { createStateMachine, stateChart } from './machine';

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

const TooltipTrigger = forwardRefWithAs<typeof TRIGGER_DEFAULT_TAG>((props, forwardedRef) => {
  const {
    as: Comp = TRIGGER_DEFAULT_TAG,
    onMouseEnter,
    onMouseMove,
    onMouseLeave,
    onFocus,
    onBlur,
    onMouseDown,
    onKeyDown,
    ...triggerProps
  } = props;
  const context = useTooltipContext(TRIGGER_NAME);
  const composedTriggerRef = useComposedRefs(forwardedRef, context.triggerRef);

  return (
    <Comp
      {...getPartDataAttrObj(TRIGGER_NAME)}
      ref={composedTriggerRef}
      type="button"
      aria-describedby={context.open ? context.id : undefined}
      onMouseEnter={composeEventHandlers(onMouseEnter, () =>
        stateMachine.transition('mouseEntered', { id: context.id })
      )}
      onMouseMove={composeEventHandlers(onMouseMove, () =>
        stateMachine.transition('mouseMoved', { id: context.id })
      )}
      onMouseLeave={composeEventHandlers(onMouseLeave, () => {
        const stateMachineContext = stateMachine.getContext();
        if (stateMachineContext.id === context.id) {
          stateMachine.transition('mouseLeft', { id: context.id });
        }
      })}
      onFocus={composeEventHandlers(onFocus, () =>
        stateMachine.transition('focused', { id: context.id })
      )}
      onBlur={composeEventHandlers(onBlur, () => {
        const stateMachineContext = stateMachine.getContext();
        if (stateMachineContext.id === context.id) {
          stateMachine.transition('blurred', { id: context.id });
        }
      })}
      onMouseDown={composeEventHandlers(onMouseDown, () =>
        stateMachine.transition('activated', { id: context.id })
      )}
      onKeyDown={composeEventHandlers(onKeyDown, (event) => {
        if (event.key === 'Escape' || event.key === 'Enter' || event.key === ' ') {
          stateMachine.transition('activated', { id: context.id });
        }
      })}
      {...triggerProps}
    />
  );
});

TooltipTrigger.displayName = TRIGGER_NAME;

/* -------------------------------------------------------------------------------------------------
 * TooltipContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = 'TooltipContent';

type TooltipContentOwnProps = {
  /**
   * A more descriptive label for accessibility purpose
   */
  'aria-label'?: string;

  anchorRef?: React.ComponentProps<typeof PopperPrimitive.Root>['anchorRef'];

  /**
   * Whether the Tooltip should render in a Portal
   * (default: `true`)
   */
  portalled?: boolean;
};

const TooltipContent = forwardRefWithAs<typeof TooltipContentImpl>((props, forwardedRef) => {
  const context = useTooltipContext(CONTENT_NAME);
  return context.open ? <TooltipContentImpl ref={forwardedRef} {...props} /> : null;
});

const TooltipContentImpl = forwardRefWithAs<typeof PopperPrimitive.Root, TooltipContentOwnProps>(
  (props, forwardedRef) => {
    const {
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
          {...getPartDataAttrObj(CONTENT_NAME)}
          {...contentProps}
          data-state={context.stateAttribute}
          ref={forwardedRef}
          anchorRef={anchorRef || context.triggerRef}
          style={{
            ...contentProps.style,
            // re-namespace exposed content custom property
            ['--radix-tooltip-content-transform-origin' as any]: 'var(--radix-popper-transform-origin)',
          }}
        >
          {children}
          <VisuallyHidden id={context.id} role="tooltip">
            {ariaLabel || children}
          </VisuallyHidden>
        </PopperPrimitive.Root>
      </PortalWrapper>
    );
  }
);

TooltipContent.displayName = CONTENT_NAME;

/* ------------------------------------------------------------------------------------------------*/

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

export { Tooltip, TooltipTrigger, TooltipContent, TooltipArrow, Root, Trigger, Content, Arrow };
