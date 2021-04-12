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
  onOpen(): void;
  onClose(): void;
};

const [HoverCardProvider, useHoverCardContext] = createContext<HoverCardContextValue>(
  HOVERCARD_NAME
);

type HoverCardOwnProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

const HoverCard: React.FC<HoverCardOwnProps> = (props) => {
  const { children, open: openProp, defaultOpen, onOpenChange } = props;
  const triggerRef = React.useRef<HTMLAnchorElement>(null);
  const [open = false, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  });

  return (
    <HoverCardProvider
      contentId={useId()}
      triggerRef={triggerRef}
      open={open}
      onOpenChange={setOpen}
      onOpen={React.useCallback(() => setOpen(true), [setOpen])}
      onClose={React.useCallback(() => setOpen(false), [setOpen])}
    >
      {children}
    </HoverCardProvider>
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
  const composedTriggerRef = useComposedRefs(forwardedRef, context.triggerRef);
  return (
    <Primitive
      type="a"
      data-state={context.open ? 'open' : 'closed'}
      {...triggerProps}
      as={as}
      ref={composedTriggerRef}
      onMouseEnter={composeEventHandlers(props.onMouseEnter, context.onOpen)}
      onMouseLeave={composeEventHandlers(props.onMouseEnter, context.onClose)}
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
        ref={forwardedRef}
      />
    </Presence>
  );
}) as HoverCardContentPrimitive;

type PopperPrimitiveOwnProps = Polymorphic.OwnProps<typeof PopperPrimitive.Root>;
type HoverCardContentImplOwnProps = Polymorphic.Merge<
  PopperPrimitiveOwnProps,
  {
    /**
     * Whether the `HoverCard` should render in a `Portal`
     * (default: `true`)
     */
    portalled?: boolean;
    anchorRef?: PopperPrimitiveOwnProps['anchorRef'];
  }
>;

type HoverCardContentImplPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof PopperPrimitive.Root>,
  HoverCardContentImplOwnProps
>;

const HoverCardContentImpl = React.forwardRef((props, forwardedRef) => {
  const { anchorRef, portalled = true, ...contentProps } = props;
  const context = useHoverCardContext(CONTENT_NAME);

  const PortalWrapper = portalled ? Portal : React.Fragment;

  return (
    <PortalWrapper>
      <PopperPrimitive.Root
        id={context.contentId}
        {...contentProps}
        ref={forwardedRef}
        anchorRef={anchorRef || context.triggerRef}
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
