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
} from '@interop-ui/react-utils';
import { forwardRefWithAs } from '@interop-ui/react-polymorphic';
import { Popper, PopperContent, PopperArrow } from '@interop-ui/react-popper';
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
  isOpen: boolean;
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
  isOpen?: boolean;
  defaultIsOpen?: boolean;
  onIsOpenChange?: (isOpen: boolean) => void;
};

const Tooltip: React.FC<TooltipOwnProps> = (props) => {
  const { children, isOpen: isOpenProp, defaultIsOpen = false, onIsOpenChange } = props;
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const id = `tooltip-${useId()}`;
  const [isOpen = false, setIsOpen] = useControlledState({
    prop: isOpenProp,
    defaultProp: defaultIsOpen,
    onChange: onIsOpenChange,
  });
  const [stateAttribute, setStateAttribute] = React.useState<StateAttribute>(
    isOpenProp ? 'instant-open' : 'closed'
  );

  // control open state using state machine subscription
  React.useEffect(() => {
    const unsubscribe = stateMachine.subscribe(({ state, context }) => {
      if (state === 'OPEN' && context.id === id) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    });

    return unsubscribe;
  }, [id, setIsOpen]);

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
    if (isOpenProp === true) {
      stateMachine.transition('mouseEntered', { id });
    }
  }, [id, isOpenProp]);

  const context = React.useMemo(() => ({ triggerRef, id, isOpen, stateAttribute }), [
    id,
    isOpen,
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
      aria-describedby={context.isOpen ? context.id : undefined}
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
 * TooltipPopper
 * -----------------------------------------------------------------------------------------------*/

const POPPER_NAME = 'TooltipPopper';

type TooltipPopperOwnProps = {
  /**
   * Whether the Tooltip should render in a Portal
   * (default: `true`)
   */
  shouldPortal?: boolean;

  anchorRef?: React.ComponentProps<typeof Popper>['anchorRef'];
};

const TooltipPopper = forwardRefWithAs<typeof TooltipPopperImpl>((props, forwardedRef) => {
  const context = useTooltipContext(POPPER_NAME);
  return context.isOpen ? <TooltipPopperImpl ref={forwardedRef} {...props} /> : null;
});

const TooltipPopperImpl = forwardRefWithAs<typeof Popper, TooltipPopperOwnProps>(
  (props, forwardedRef) => {
    const { children, anchorRef, shouldPortal = true, ...popperProps } = props;
    const context = useTooltipContext(POPPER_NAME);
    const PortalWrapper = shouldPortal ? Portal : React.Fragment;

    return (
      <PortalWrapper>
        <CheckTriggerMoved />
        <Popper
          {...getPartDataAttrObj(POPPER_NAME)}
          {...popperProps}
          data-state={context.stateAttribute}
          ref={forwardedRef}
          anchorRef={anchorRef || context.triggerRef}
          style={{
            ...popperProps.style,
            // re-namespace exposed popper custom property
            ['--interop-ui-tooltip-popper-transform-origin' as any]: 'var(--interop-ui-popper-transform-origin)',
          }}
        >
          {children}
        </Popper>
      </PortalWrapper>
    );
  }
);

TooltipPopper.displayName = POPPER_NAME;

/* -------------------------------------------------------------------------------------------------
 * TooltipContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = 'TooltipContent';

type TooltipContentOwnProps = {
  /**
   * A more descriptive label for accessibility purpose
   */
  'aria-label'?: string;
};

const TooltipContent = forwardRefWithAs<typeof PopperContent, TooltipContentOwnProps>(
  (props, forwardedRef) => {
    const { children, 'aria-label': ariaLabel, ...contentProps } = props;
    const context = useTooltipContext(CONTENT_NAME);

    return (
      <PopperContent {...getPartDataAttrObj(CONTENT_NAME)} {...contentProps} ref={forwardedRef}>
        {children}
        <VisuallyHidden id={context.id} role="tooltip">
          {ariaLabel || children}
        </VisuallyHidden>
      </PopperContent>
    );
  }
);

TooltipContent.displayName = CONTENT_NAME;

/* -------------------------------------------------------------------------------------------------
 * TooltipArrow
 * -----------------------------------------------------------------------------------------------*/

const ARROW_NAME = 'TooltipArrow';

const TooltipArrow = forwardRefWithAs<typeof PopperArrow>((props, forwardedRef) => {
  return <PopperArrow {...getPartDataAttrObj(ARROW_NAME)} {...props} ref={forwardedRef} />;
});

TooltipArrow.displayName = ARROW_NAME;

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

export {
  Tooltip,
  TooltipTrigger,
  TooltipPopper,
  TooltipContent,
  TooltipArrow,
  Tooltip as Root,
  TooltipTrigger as Trigger,
  TooltipPopper as Popper,
  TooltipContent as Content,
  TooltipArrow as Arrow,
};
