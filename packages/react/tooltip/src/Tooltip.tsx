import * as React from 'react';
import {
  forwardRef,
  createStyleObj,
  createContext,
  useComposedRefs,
  useId,
  composeEventHandlers,
  useRect,
  usePrevious,
  useControlledState,
  useLayoutEffect,
} from '@interop-ui/react-utils';
import { cssReset } from '@interop-ui/utils';
import { Popper, styles as popperStyles } from '@interop-ui/react-popper';
import { Portal } from '@interop-ui/react-portal';
import { VisuallyHidden, styles as visuallyHiddenStyles } from '@interop-ui/react-visually-hidden';
import { createStateMachine, stateChart } from './machine';

import type { PopperProps, PopperArrowProps } from '@interop-ui/react-popper';
import type { Optional } from '@interop-ui/utils';

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

interface TooltipStaticProps {
  Trigger: typeof TooltipTrigger;
  Popper: typeof TooltipPopper;
  Content: typeof TooltipContent;
  Arrow: typeof TooltipArrow;
}

type TooltipProps = {
  isOpen?: boolean;
  defaultIsOpen?: boolean;
  onIsOpenChange?: (isOpen: boolean) => void;
};

const Tooltip: React.FC<TooltipProps> & TooltipStaticProps = function Tooltip(props) {
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

/* -------------------------------------------------------------------------------------------------
 * TooltipTrigger
 * -----------------------------------------------------------------------------------------------*/

const TRIGGER_NAME = 'Tooltip.Trigger';
const TRIGGER_DEFAULT_TAG = 'button';

type TooltipTriggerDOMProps = React.ComponentPropsWithoutRef<typeof TRIGGER_DEFAULT_TAG>;
type TooltipTriggerOwnProps = {};
type TooltipTriggerProps = TooltipTriggerOwnProps & TooltipTriggerDOMProps;

const TooltipTrigger = forwardRef<typeof TRIGGER_DEFAULT_TAG, TooltipTriggerProps>(
  (props, forwardedRef) => {
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
        {...interopDataAttrObj('trigger')}
        ref={composedTriggerRef}
        type={Comp === TRIGGER_DEFAULT_TAG ? 'button' : undefined}
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
  }
);

/* -------------------------------------------------------------------------------------------------
 * TooltipPopper
 * -----------------------------------------------------------------------------------------------*/

const POPPER_NAME = 'Tooltip.Popper';
const POPPER_DEFAULT_TAG = 'div';

type TooltipPopperDOMProps = React.ComponentPropsWithoutRef<typeof POPPER_DEFAULT_TAG>;
type TooltipPopperOwnProps = {
  /**
   * Whether the Tooltip should render in a Portal
   * (default: `true`)
   */
  shouldPortal?: boolean;
};
type TooltipPopperProps = Optional<PopperProps, 'anchorRef'> &
  TooltipPopperDOMProps &
  TooltipPopperOwnProps;

const TooltipPopper = forwardRef<typeof POPPER_DEFAULT_TAG, TooltipPopperProps>(
  (props, forwardedRef) => {
    const context = useTooltipContext(POPPER_NAME);
    return context.isOpen ? <TooltipPopperImpl ref={forwardedRef} {...props} /> : null;
  }
);

const TooltipPopperImpl = forwardRef<typeof POPPER_DEFAULT_TAG, TooltipPopperProps>(
  (props, forwardedRef) => {
    const { children, anchorRef, shouldPortal = true, ...popperProps } = props;
    const context = useTooltipContext(POPPER_NAME);
    const PortalWrapper = shouldPortal ? Portal : React.Fragment;

    return (
      <PortalWrapper>
        <CheckTriggerMoved />
        <Popper
          {...interopDataAttrObj('popper')}
          {...popperProps}
          data-state={context.stateAttribute}
          ref={forwardedRef}
          anchorRef={anchorRef || context.triggerRef}
        >
          {children}
        </Popper>
      </PortalWrapper>
    );
  }
);

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

/* -------------------------------------------------------------------------------------------------
 * TooltipContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = 'Tooltip.Content';
const CONTENT_DEFAULT_TAG = 'div';

type TooltipContentDOMProps = React.ComponentPropsWithoutRef<typeof CONTENT_DEFAULT_TAG>;
type TooltipContentOwnProps = {
  /**
   * A more descriptive label for accessibility purpose
   */
  'aria-label'?: string;
};
type TooltipContentProps = TooltipContentDOMProps & TooltipContentOwnProps;

const TooltipContent = forwardRef<typeof CONTENT_DEFAULT_TAG, TooltipContentProps>(
  (props, forwardedRef) => {
    const { children, 'aria-label': ariaLabel, ...contentProps } = props;
    const context = useTooltipContext(CONTENT_NAME);

    return (
      <Popper.Content {...interopDataAttrObj('content')} {...contentProps} ref={forwardedRef}>
        {children}
        <VisuallyHidden id={context.id} role="tooltip" style={visuallyHiddenStyles.root}>
          {ariaLabel || children}
        </VisuallyHidden>
      </Popper.Content>
    );
  }
);

/* -------------------------------------------------------------------------------------------------
 * TooltipArrow
 * -----------------------------------------------------------------------------------------------*/

const ARROW_NAME = 'Tooltip.Arrow';
const ARROW_DEFAULT_TAG = 'svg';

type TooltipArrowOwnProps = {};
type TooltipArrowProps = PopperArrowProps & TooltipArrowOwnProps;

const TooltipArrow = forwardRef<typeof ARROW_DEFAULT_TAG, TooltipArrowProps>(function TooltipArrow(
  props,
  forwardedRef
) {
  return <Popper.Arrow {...interopDataAttrObj('arrow')} {...props} ref={forwardedRef} />;
});

/* -----------------------------------------------------------------------------------------------*/

Tooltip.Trigger = TooltipTrigger;
Tooltip.Popper = TooltipPopper;
Tooltip.Content = TooltipContent;
Tooltip.Arrow = TooltipArrow;

Tooltip.displayName = TOOLTIP_NAME;
Tooltip.Trigger.displayName = TRIGGER_NAME;
Tooltip.Popper.displayName = POPPER_NAME;
Tooltip.Content.displayName = CONTENT_NAME;
Tooltip.Arrow.displayName = ARROW_NAME;

const [styles, interopDataAttrObj] = createStyleObj(TOOLTIP_NAME, {
  root: {},
  trigger: {
    ...cssReset(TRIGGER_DEFAULT_TAG),
  },
  popper: {
    ...cssReset(POPPER_DEFAULT_TAG),
    ...popperStyles.root,
  },
  content: {
    ...cssReset(CONTENT_DEFAULT_TAG),
    ...popperStyles.content,
    userSelect: 'none',
    pointerEvents: 'none',
  },
  arrow: {
    ...cssReset(ARROW_DEFAULT_TAG),
    ...popperStyles.arrow,
  },
});

export type {
  TooltipProps,
  TooltipTriggerProps,
  TooltipPopperProps,
  TooltipContentProps,
  TooltipArrowProps,
};
export { Tooltip, styles };
