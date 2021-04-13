import * as React from 'react';
import { composeEventHandlers } from '@radix-ui/primitive';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import { createContext } from '@radix-ui/react-context';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import * as PopperPrimitive from '@radix-ui/react-popper';
import { Portal } from '@radix-ui/react-portal';
import { Presence } from '@radix-ui/react-presence';
import { Primitive, extendPrimitive } from '@radix-ui/react-primitive';
import { useId } from '@radix-ui/react-id';
import { Slot } from '@radix-ui/react-slot';
import type * as Polymorphic from '@radix-ui/react-polymorphic';

/* -------------------------------------------------------------------------------------------------
 * HoverCard
 * -----------------------------------------------------------------------------------------------*/

const HOVERCARD_NAME = 'HoverCard';

type HoverCardContextValue = {
  triggerRef: React.RefObject<HTMLAnchorElement>;
  contentId: string;
  open: boolean;
  onOpenChange(open: boolean): void;
  onMouseEnter(): void;
  onMouseLeave(): void;
  hasCustomAnchor: boolean;
  onCustomAnchorAdd(): void;
  onCustomAnchorRemove(): void;
};

const [HoverCardProvider, useHoverCardContext] = createContext<HoverCardContextValue>(
  HOVERCARD_NAME
);

type HoverCardOwnProps = {
  open?: boolean;
  defaultOpen?: boolean;
  enterDelayDuration?: number;
  exitDelayDuration?: number;
  onOpenChange?: (open: boolean) => void;
};

const HoverCard: React.FC<HoverCardOwnProps> = (props) => {
  const {
    children,
    open: openProp,
    defaultOpen,
    onOpenChange,
    enterDelayDuration = 700,
    exitDelayDuration = 400,
  } = props;
  const triggerRef = React.useRef<HTMLAnchorElement>(null);
  const [hasCustomAnchor, setHasCustomAnchor] = React.useState(false);
  const enterEnvoked = React.useRef(false);
  const enterTimerRef = React.useRef(0);
  const leaveTimerRef = React.useRef(0);

  const [open = false, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  });

  const clearEnterTimer = React.useCallback(() => {
    clearTimeout(enterTimerRef.current);
  }, [enterTimerRef]);

  const clearLeaveTimer = React.useCallback(() => {
    clearTimeout(leaveTimerRef.current);
  }, [leaveTimerRef]);

  const handleMouseEnter = React.useCallback(() => {
    clearLeaveTimer();
    enterTimerRef.current = window.setTimeout(() => {
      setOpen(true);
      enterEnvoked.current = true;
    }, enterDelayDuration);
  }, [clearLeaveTimer, enterDelayDuration, setOpen]);

  const handelMouseLeave = React.useCallback(() => {
    clearEnterTimer();
    leaveTimerRef.current = window.setTimeout(() => {
      if (enterEnvoked.current) {
        setOpen(false);
        enterEnvoked.current = false;
      }
    }, exitDelayDuration);
  }, [clearEnterTimer, exitDelayDuration, setOpen]);

  // cleanup any queued state updates on unmount
  React.useEffect(() => {
    return () => {
      clearEnterTimer();
      clearLeaveTimer();
    };
  }, [clearEnterTimer, clearLeaveTimer]);

  return (
    <PopperPrimitive.Root>
      <HoverCardProvider
        contentId={useId()}
        triggerRef={triggerRef}
        open={open}
        onOpenChange={setOpen}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handelMouseLeave}
        hasCustomAnchor={hasCustomAnchor}
        onCustomAnchorAdd={React.useCallback(() => setHasCustomAnchor(true), [])}
        onCustomAnchorRemove={React.useCallback(() => setHasCustomAnchor(false), [])}
      >
        {children}
      </HoverCardProvider>
    </PopperPrimitive.Root>
  );
};

HoverCard.displayName = HOVERCARD_NAME;

/* -------------------------------------------------------------------------------------------------
 * HoverCardAnchor
 * -----------------------------------------------------------------------------------------------*/

const ANCHOR_NAME = 'HoverCardAnchor';

type HoverCardAnchorOwnProps = Polymorphic.OwnProps<typeof PopperPrimitive.Anchor>;
type HoverCardAnchorPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof PopperPrimitive.Anchor>,
  HoverCardAnchorOwnProps
>;

const HoverCardAnchor = React.forwardRef((props, forwardedRef) => {
  const context = useHoverCardContext(ANCHOR_NAME);
  const { onCustomAnchorAdd, onCustomAnchorRemove } = context;

  React.useEffect(() => {
    onCustomAnchorAdd();
    return () => onCustomAnchorRemove();
  }, [onCustomAnchorAdd, onCustomAnchorRemove]);

  return <PopperPrimitive.Anchor {...props} ref={forwardedRef} />;
}) as HoverCardAnchorPrimitive;

HoverCardAnchor.displayName = ANCHOR_NAME;

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
  const composedTriggerRef = useComposedRefs(forwardedRef, context.triggerRef);

  const trigger = (
    <Primitive
      type="a"
      data-state={context.open ? 'open' : 'closed'}
      {...triggerProps}
      as={as}
      ref={composedTriggerRef}
      onMouseEnter={composeEventHandlers(props.onMouseEnter, context.onMouseEnter)}
      onMouseLeave={composeEventHandlers(props.onMouseLeave, context.onMouseLeave)}
    />
  );

  return context.hasCustomAnchor ? (
    trigger
  ) : (
    <PopperPrimitive.Anchor as={Slot}>{trigger}</PopperPrimitive.Anchor>
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
  const context = useHoverCardContext(CONTENT_NAME);

  const PortalWrapper = portalled ? Portal : React.Fragment;

  return (
    <PortalWrapper>
      <PopperPrimitive.Content
        id={context.contentId}
        {...contentProps}
        ref={forwardedRef}
        style={{
          ...contentProps.style,
          // re-namespace exposed content custom property
          ['--radix-hovercard-content-transform-origin' as any]: 'var(--radix-popper-transform-origin)',
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
const Anchor = HoverCardAnchor;

export {
  HoverCard,
  HoverCardAnchor,
  HoverCardTrigger,
  HoverCardContent,
  HoverCardArrow,
  //
  Root,
  Anchor,
  Trigger,
  Content,
  Arrow,
};
