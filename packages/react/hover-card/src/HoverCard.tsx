import * as React from 'react';
import { composeEventHandlers } from '@radix-ui/primitive';
import { createContext } from '@radix-ui/react-context';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import * as PopperPrimitive from '@radix-ui/react-popper';
import { Portal } from '@radix-ui/react-portal';
import { Presence } from '@radix-ui/react-presence';
import { Primitive, extendPrimitive } from '@radix-ui/react-primitive';
import type * as Polymorphic from '@radix-ui/react-polymorphic';

/* -------------------------------------------------------------------------------------------------
 * HoverCard
 * -----------------------------------------------------------------------------------------------*/

const HOVERCARD_NAME = 'HoverCard';

type HoverCardContextValue = {
  open: boolean;
  onOpenChange(open: boolean): void;
  onMouseEnter(): void;
  onMouseLeave(): void;
};

const [HoverCardProvider, useHoverCardContext] = createContext<HoverCardContextValue>(
  HOVERCARD_NAME
);

type HoverCardOwnProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  openDelay?: number;
  closeDelay?: number;
};

const HoverCard: React.FC<HoverCardOwnProps> = (props) => {
  const {
    children,
    open: openProp,
    defaultOpen,
    onOpenChange,
    openDelay = 700,
    closeDelay = 300,
  } = props;
  const enterInvokedRef = React.useRef(false);
  const enterTimerRef = React.useRef(0);
  const leaveTimerRef = React.useRef(0);

  const [open = false, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  });

  const handleMouseEnter = React.useCallback(() => {
    clearTimeout(leaveTimerRef.current);

    enterTimerRef.current = window.setTimeout(() => {
      setOpen(true);
      enterInvokedRef.current = true;
    }, openDelay);
  }, [openDelay, setOpen]);

  const handelMouseLeave = React.useCallback(() => {
    clearTimeout(enterTimerRef.current);

    leaveTimerRef.current = window.setTimeout(() => {
      if (enterInvokedRef.current) {
        setOpen(false);
        enterInvokedRef.current = false;
      }
    }, closeDelay);
  }, [closeDelay, setOpen]);

  // cleanup any queued state updates on unmount
  React.useEffect(() => {
    return () => {
      clearTimeout(enterTimerRef.current);
      clearTimeout(leaveTimerRef.current);
    };
  }, []);

  return (
    <PopperPrimitive.Root>
      <HoverCardProvider
        open={open}
        onOpenChange={setOpen}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handelMouseLeave}
      >
        {children}
      </HoverCardProvider>
    </PopperPrimitive.Root>
  );
};

HoverCard.displayName = HOVERCARD_NAME;

/* -------------------------------------------------------------------------------------------------
 * HoverCardTrigger
 * -----------------------------------------------------------------------------------------------*/

const TRIGGER_NAME = 'HoverCardTrigger';
const TRIGGER_DEFAULT_TAG = 'a';

type HoverCardTriggerOwnProps = Polymorphic.OwnProps<typeof Primitive>;
type HoverCardTriggerPrimitive = Polymorphic.ForwardRefComponent<
  typeof TRIGGER_DEFAULT_TAG,
  HoverCardTriggerOwnProps
>;

const HoverCardTrigger = React.forwardRef((props, forwardedRef) => {
  const { as = TRIGGER_DEFAULT_TAG, ...triggerProps } = props;
  const context = useHoverCardContext(TRIGGER_NAME);

  return (
    <PopperPrimitive.Anchor
      data-state={context.open ? 'open' : 'closed'}
      {...triggerProps}
      as={as}
      ref={forwardedRef}
      onMouseEnter={composeEventHandlers(props.onMouseEnter, context.onMouseEnter)}
      onMouseLeave={composeEventHandlers(props.onMouseLeave, context.onMouseLeave)}
    />
  );
}) as HoverCardTriggerPrimitive;

HoverCardTrigger.displayName = TRIGGER_NAME;

/* -------------------------------------------------------------------------------------------------
 * HoverCardContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = 'HoverCardContent';

type HoverCardContentOwnProps = Polymorphic.Merge<
  Polymorphic.OwnProps<typeof HoverCardContentImpl>,
  {
    /**
     * Used to force mounting when more control is needed. Useful when
     * controlling animation with React animation libraries.
     */
    forceMount?: true;
  }
>;

type HoverCardContentPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof HoverCardContentImpl>,
  HoverCardContentOwnProps
>;

const HoverCardContent = React.forwardRef((props, forwardedRef) => {
  const { forceMount, ...contentProps } = props;
  const context = useHoverCardContext(CONTENT_NAME);

  return (
    <Presence present={forceMount || context.open}>
      <HoverCardContentImpl
        data-state={context.open ? 'open' : 'closed'}
        {...contentProps}
        onMouseEnter={composeEventHandlers(props.onMouseEnter, context.onMouseEnter)}
        onMouseLeave={composeEventHandlers(props.onMouseLeave, context.onMouseLeave)}
        ref={forwardedRef}
      />
    </Presence>
  );
}) as HoverCardContentPrimitive;

type PopperPrimitiveOwnProps = Polymorphic.OwnProps<typeof PopperPrimitive.Content>;
type HoverCardContentImplOwnProps = Polymorphic.Merge<
  PopperPrimitiveOwnProps,
  {
    /**
     * Whether the `HoverCard` should render in a `Portal`
     * (default: `true`)
     */
    portalled?: boolean;
  }
>;

type HoverCardContentImplPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof PopperPrimitive.Content>,
  HoverCardContentImplOwnProps
>;

const HoverCardContentImpl = React.forwardRef((props, forwardedRef) => {
  const { portalled = true, ...contentProps } = props;

  const PortalWrapper = portalled ? Portal : React.Fragment;

  return (
    <PortalWrapper>
      <PopperPrimitive.Content
        {...contentProps}
        ref={forwardedRef}
        style={{
          ...contentProps.style,
          // re-namespace exposed content custom property
          ['--radix-hover-card-content-transform-origin' as any]: 'var(--radix-popper-transform-origin)',
        }}
      />
    </PortalWrapper>
  );
}) as HoverCardContentImplPrimitive;

HoverCardContent.displayName = CONTENT_NAME;

/* ---------------------------------------------------------------------------------------------- */

const HoverCardArrow = extendPrimitive(PopperPrimitive.Arrow, { displayName: 'HoverCardArrow' });

/* -----------------------------------------------------------------------------------------------*/

const Root = HoverCard;
const Trigger = HoverCardTrigger;
const Content = HoverCardContent;
const Arrow = HoverCardArrow;

export {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
  HoverCardArrow,
  //
  Root,
  Trigger,
  Content,
  Arrow,
};
