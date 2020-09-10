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
  useIsomorphicLayoutEffect,
} from '@interop-ui/react-utils';
import { cssReset } from '@interop-ui/utils';
import {
  Popper,
  styles as popperStyles,
  PopperProps,
  PopperArrowProps,
} from '@interop-ui/react-popper';
import { Portal } from '@interop-ui/react-portal';
import { VisuallyHidden, styles as visuallyHiddenStyles } from '@interop-ui/react-visually-hidden';
import { createStateMachine, stateChart } from './machine';

/* -------------------------------------------------------------------------------------------------
 * Root level context
 * -----------------------------------------------------------------------------------------------*/

type TooltipContextValue = {
  targetRef: React.RefObject<HTMLButtonElement>;
  id: string;
  isOpen: boolean;
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
  Target: typeof TooltipTarget;
  Content: typeof TooltipContent;
  Label: typeof TooltipLabel;
  Arrow: typeof TooltipArrow;
}

type TooltipProps = {
  isOpen?: boolean;
  defaultIsOpen?: boolean;
  onIsOpenChange?: (isOpen: boolean) => void;
};

const Tooltip: React.FC<TooltipProps> & TooltipStaticProps = function Tooltip(props) {
  const { children, isOpen: isOpenProp, defaultIsOpen = false, onIsOpenChange } = props;
  const targetRef = React.useRef<HTMLButtonElement>(null);
  const id = `tooltip-${useId()}`;
  const [_isOpen, setIsOpen] = useControlledState({
    prop: isOpenProp,
    defaultProp: defaultIsOpen,
    onChange: onIsOpenChange,
  });
  const isOpen = Boolean(_isOpen);

  // control open state using state machine subscription
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

  // send transition if the component unmounts
  React.useEffect(() => {
    return () => {
      stateMachine.transition('unmounted', { id });
    };
  }, [id]);

  // if we're controlling the component
  // put the state machine in the appropriate state
  useIsomorphicLayoutEffect(() => {
    if (isOpenProp === true) {
      stateMachine.transition('mouseEntered', { id });
    }
  }, [id, isOpenProp]);

  const context = React.useMemo(() => ({ targetRef, id, isOpen }), [id, isOpen]);

  return <TooltipContext.Provider value={context}>{children}</TooltipContext.Provider>;
};

/* -------------------------------------------------------------------------------------------------
 * TooltipTarget
 * -----------------------------------------------------------------------------------------------*/

const TARGET_NAME = 'Tooltip.Target';
const TARGET_DEFAULT_TAG = 'button';

type TooltipTargetDOMProps = React.ComponentPropsWithoutRef<typeof TARGET_DEFAULT_TAG>;
type TooltipTargetOwnProps = {};
type TooltipTargetProps = TooltipTargetOwnProps & TooltipTargetDOMProps;

const TooltipTarget = forwardRef<typeof TARGET_DEFAULT_TAG, TooltipTargetProps>(
  (props, forwardedRef) => {
    const {
      as: Comp = TARGET_DEFAULT_TAG,
      onMouseEnter,
      onMouseMove,
      onMouseLeave,
      onFocus,
      onBlur,
      onMouseDown,
      onKeyDown,
      ...targetProps
    } = props;
    const context = useTooltipContext(TARGET_NAME);
    const composedTargetRef = useComposedRefs(forwardedRef, context.targetRef);

    return (
      <Comp
        {...interopDataAttrObj('target')}
        ref={composedTargetRef}
        type={Comp === TARGET_DEFAULT_TAG ? 'button' : undefined}
        aria-describedby={context.id}
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
        {...targetProps}
      />
    );
  }
);

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
  /**
   * Whether the Tooltip should render in a Portal
   * (default: `true`)
   */
  shouldPortal?: boolean;
};
type TooltipContentProps = Omit<PopperProps, 'anchorRef'> &
  TooltipContentDOMProps &
  TooltipContentOwnProps;

const TooltipContent = forwardRef<typeof CONTENT_DEFAULT_TAG, TooltipContentProps>(
  (props, forwardedRef) => {
    const context = useTooltipContext(CONTENT_NAME);
    return context.isOpen ? <TooltipContentImp ref={forwardedRef} {...props} /> : null;
  }
);

const TooltipContentImp = forwardRef<typeof CONTENT_DEFAULT_TAG, TooltipContentProps>(
  (props, forwardedRef) => {
    const { children, 'aria-label': ariaLabel, shouldPortal = true, ...contentProps } = props;
    const context = useTooltipContext(CONTENT_NAME);

    const PortalWrapper = shouldPortal ? Portal : React.Fragment;

    return (
      <PortalWrapper>
        <CheckTargetMoved />
        <Popper
          {...interopDataAttrObj('content')}
          {...contentProps}
          ref={forwardedRef}
          anchorRef={context.targetRef}
        >
          {children}
          <VisuallyHidden id={context.id} role="tooltip" style={visuallyHiddenStyles.root}>
            {children || ariaLabel}
          </VisuallyHidden>
        </Popper>
      </PortalWrapper>
    );
  }
);

function CheckTargetMoved() {
  const { targetRef, id } = useTooltipContext('CheckTargetMoved');

  const targetRect = useRect(targetRef);
  const targetLeft = targetRect?.left;
  const previousTargetLeft = usePrevious(targetLeft);
  const targetTop = targetRect?.top;
  const previousTargetTop = usePrevious(targetTop);

  React.useEffect(() => {
    // checking if the user has scrolled…
    const hasTargetMoved =
      (previousTargetLeft !== undefined && previousTargetLeft !== targetLeft) ||
      (previousTargetTop !== undefined && previousTargetTop !== targetTop);

    if (hasTargetMoved) {
      stateMachine.transition('targetMoved', { id });
    }
  }, [id, previousTargetLeft, previousTargetTop, targetLeft, targetTop]);

  return null;
}

/* -------------------------------------------------------------------------------------------------
 * TooltipLabel
 * -----------------------------------------------------------------------------------------------*/

const LABEL_NAME = 'Tooltip.Label';

type TooltipLabelProps = {
  label: string;
  ariaLabel?: string;
};

const TooltipLabel: React.FC<TooltipLabelProps> = function TooltipLabel({
  label,
  // we default `ariaLabel` to the `label` to simplify the implementation later on
  // as we then don't need to differentiate whether or not we have an `ariaLabel`
  // we instead always render it inside a `VisuallyHidden`
  ariaLabel = label,
}) {
  const { id } = useTooltipContext(LABEL_NAME);
  return (
    <>
      {label}
      <VisuallyHidden id={id} role="tooltip" style={visuallyHiddenStyles.root}>
        {ariaLabel}
      </VisuallyHidden>
    </>
  );
};

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

Tooltip.Target = TooltipTarget;
Tooltip.Content = TooltipContent;
Tooltip.Label = TooltipLabel;
Tooltip.Arrow = TooltipArrow;

Tooltip.displayName = TOOLTIP_NAME;
Tooltip.Target.displayName = TARGET_NAME;
Tooltip.Content.displayName = CONTENT_NAME;
Tooltip.Label.displayName = LABEL_NAME;
Tooltip.Arrow.displayName = ARROW_NAME;

const [styles, interopDataAttrObj] = createStyleObj(TOOLTIP_NAME, {
  root: {},
  target: {
    ...cssReset(TARGET_DEFAULT_TAG),
  },
  content: {
    ...cssReset(CONTENT_DEFAULT_TAG),
    ...popperStyles.root,
    userSelect: 'none',
    pointerEvents: 'none',
  },
  arrow: {
    ...cssReset(ARROW_DEFAULT_TAG),
    ...popperStyles.arrow,
  },
});

export type { TooltipContentProps, TooltipLabelProps, TooltipArrowProps };
export { Tooltip, styles };
