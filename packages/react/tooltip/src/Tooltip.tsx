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
  onOpenChange?: (isOpen?: boolean) => void;
};

const Tooltip: React.FC<TooltipProps> & TooltipStaticProps = function Tooltip({
  children,
  isOpen: isOpenProp,
  onOpenChange,
}) {
  const targetRef = React.useRef<HTMLButtonElement>(null);
  const id = `tooltip-${useId()}`;
  const [_isOpen, setIsOpen] = useControlledState({
    prop: isOpenProp,
    onChange: onOpenChange,
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
  React.useEffect(() => {
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

const TooltipTarget: React.FC = function TooltipTarget({ children }) {
  const { targetRef, id } = useTooltipContext(TARGET_NAME);
  const child = React.Children.only(children);
  const composedTargetRef = useComposedRefs((child as any).ref || null, targetRef);

  if (!React.isValidElement(child)) {
    // TODO: THROW DEV WARNING?
    return null;
  }

  const {
    onMouseEnter,
    onMouseMove,
    onMouseLeave,
    onFocus,
    onBlur,
    onMouseDown,
    onKeyDown,
  } = child.props;

  return React.cloneElement(child, {
    ...interopDataAttrObj('target'),
    ref: composedTargetRef,
    'aria-describedby': id,
    onMouseEnter: composeEventHandlers(onMouseEnter, () =>
      stateMachine.transition('mouseEntered', { id })
    ),
    onMouseMove: composeEventHandlers(onMouseMove, () =>
      stateMachine.transition('mouseMoved', { id })
    ),
    onMouseLeave: composeEventHandlers(onMouseLeave, () => {
      const context = stateMachine.getContext();
      if (context.id === id) {
        stateMachine.transition('mouseLeft', { id });
      }
    }),
    onFocus: composeEventHandlers(onFocus, () => stateMachine.transition('focused', { id })),
    onBlur: composeEventHandlers(onBlur, () => {
      const context = stateMachine.getContext();
      if (context.id === id) {
        stateMachine.transition('blurred', { id });
      }
    }),
    onMouseDown: composeEventHandlers(onMouseDown, () =>
      stateMachine.transition('activated', { id })
    ),
    onKeyDown: composeEventHandlers(onKeyDown, (event: KeyboardEvent) => {
      if (event.key === 'Escape' || event.key === 'Enter' || event.key === ' ') {
        stateMachine.transition('activated', { id });
      }
    }),
  });
};

/* -------------------------------------------------------------------------------------------------
 * TooltipContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = 'Tooltip.Content';
const CONTENT_DEFAULT_TAG = 'div';

type TooltipContentDOMProps = React.ComponentPropsWithoutRef<typeof CONTENT_DEFAULT_TAG>;
type TooltipContentProps = Omit<PopperProps, 'anchorRef'> & TooltipContentDOMProps;

const TooltipContent = forwardRef<typeof CONTENT_DEFAULT_TAG, TooltipContentProps>(
  (props, forwardedRef) => {
    const { targetRef, isOpen } = useTooltipContext(CONTENT_NAME);

    return isOpen ? (
      <Portal>
        <CheckTargetMoved />
        <Popper
          {...interopDataAttrObj('content')}
          {...props}
          ref={forwardedRef}
          anchorRef={targetRef}
        />
      </Portal>
    ) : null;
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
  target: {},
  content: {
    ...cssReset(CONTENT_DEFAULT_TAG),
    ...popperStyles.root,
  },
  arrow: {
    ...cssReset(ARROW_DEFAULT_TAG),
    ...popperStyles.arrow,
  },
});

export type { TooltipContentProps, TooltipLabelProps, TooltipArrowProps };
export { Tooltip, styles };
