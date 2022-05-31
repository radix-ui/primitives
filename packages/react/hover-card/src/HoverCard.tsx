import * as React from 'react';
import { composeEventHandlers } from '@radix-ui/primitive';
import { createContextScope } from '@radix-ui/react-context';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import * as PopperPrimitive from '@radix-ui/react-popper';
import { createPopperScope } from '@radix-ui/react-popper';
import { UnstablePortal } from '@radix-ui/react-portal';
import { Presence } from '@radix-ui/react-presence';
import { Primitive } from '@radix-ui/react-primitive';
import { DismissableLayer } from '@radix-ui/react-dismissable-layer';

import type * as Radix from '@radix-ui/react-primitive';
import type { Scope } from '@radix-ui/react-context';

/* -------------------------------------------------------------------------------------------------
 * HoverCard
 * -----------------------------------------------------------------------------------------------*/

const HOVERCARD_NAME = 'HoverCard';

type ScopedProps<P> = P & { __scopeHoverCard?: Scope };
const [createHoverCardContext, createHoverCardScope] = createContextScope(HOVERCARD_NAME, [
  createPopperScope,
]);
const usePopperScope = createPopperScope();

type HoverCardContextValue = {
  open: boolean;
  onOpenChange(open: boolean): void;
  onOpen(): void;
  onClose(): void;
  onDismiss(): void;
};

const [HoverCardProvider, useHoverCardContext] =
  createHoverCardContext<HoverCardContextValue>(HOVERCARD_NAME);

interface HoverCardProps {
  children?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  openDelay?: number;
  closeDelay?: number;
}

const HoverCard: React.FC<HoverCardProps> = (props: ScopedProps<HoverCardProps>) => {
  const {
    __scopeHoverCard,
    children,
    open: openProp,
    defaultOpen,
    onOpenChange,
    openDelay = 700,
    closeDelay = 300,
  } = props;
  const popperScope = usePopperScope(__scopeHoverCard);
  const openTimerRef = React.useRef(0);
  const closeTimerRef = React.useRef(0);

  const [open = false, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  });

  const handleOpen = React.useCallback(() => {
    clearTimeout(closeTimerRef.current);
    openTimerRef.current = window.setTimeout(() => setOpen(true), openDelay);
  }, [openDelay, setOpen]);

  const handleClose = React.useCallback(() => {
    clearTimeout(openTimerRef.current);
    closeTimerRef.current = window.setTimeout(() => setOpen(false), closeDelay);
  }, [closeDelay, setOpen]);

  const handleDismiss = React.useCallback(() => setOpen(false), [setOpen]);

  // cleanup any queued state updates on unmount
  React.useEffect(() => {
    return () => {
      clearTimeout(openTimerRef.current);
      clearTimeout(closeTimerRef.current);
    };
  }, []);

  return (
    <HoverCardProvider
      scope={__scopeHoverCard}
      open={open}
      onOpenChange={setOpen}
      onOpen={handleOpen}
      onClose={handleClose}
      onDismiss={handleDismiss}
    >
      <PopperPrimitive.Root {...popperScope}>{children}</PopperPrimitive.Root>
    </HoverCardProvider>
  );
};

HoverCard.displayName = HOVERCARD_NAME;

/* -------------------------------------------------------------------------------------------------
 * HoverCardTrigger
 * -----------------------------------------------------------------------------------------------*/

const TRIGGER_NAME = 'HoverCardTrigger';

type HoverCardTriggerElement = React.ElementRef<typeof Primitive.a>;
type PrimitiveLinkProps = Radix.ComponentPropsWithoutRef<typeof Primitive.a>;
interface HoverCardTriggerProps extends PrimitiveLinkProps {}

const HoverCardTrigger = React.forwardRef<HoverCardTriggerElement, HoverCardTriggerProps>(
  (props: ScopedProps<HoverCardTriggerProps>, forwardedRef) => {
    const { __scopeHoverCard, ...triggerProps } = props;
    const context = useHoverCardContext(TRIGGER_NAME, __scopeHoverCard);
    const popperScope = usePopperScope(__scopeHoverCard);
    return (
      <PopperPrimitive.Anchor asChild {...popperScope}>
        <Primitive.a
          data-state={context.open ? 'open' : 'closed'}
          {...triggerProps}
          ref={forwardedRef}
          onPointerEnter={composeEventHandlers(props.onPointerEnter, excludeTouch(context.onOpen))}
          onPointerLeave={composeEventHandlers(props.onPointerLeave, excludeTouch(context.onClose))}
          onFocus={composeEventHandlers(props.onFocus, context.onOpen)}
          onBlur={composeEventHandlers(props.onBlur, context.onClose)}
          // prevent focus event on touch devices
          onTouchStart={composeEventHandlers(props.onTouchStart, (event) => event.preventDefault())}
        />
      </PopperPrimitive.Anchor>
    );
  }
);

HoverCardTrigger.displayName = TRIGGER_NAME;

/* -------------------------------------------------------------------------------------------------
 * HoverCardPortal
 * -----------------------------------------------------------------------------------------------*/

const PORTAL_NAME = 'HoverCardPortal';

type PortalContextValue = { forceMount?: true };
const [PortalProvider, usePortalContext] = createHoverCardContext<PortalContextValue>(PORTAL_NAME, {
  forceMount: undefined,
});

type PortalProps = React.ComponentPropsWithoutRef<typeof UnstablePortal>;
interface HoverCardPortalProps extends Omit<PortalProps, 'asChild'> {
  children?: React.ReactNode;
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: true;
}

const HoverCardPortal: React.FC<HoverCardPortalProps> = (
  props: ScopedProps<HoverCardPortalProps>
) => {
  const { __scopeHoverCard, forceMount, children, container } = props;
  const context = useHoverCardContext(PORTAL_NAME, __scopeHoverCard);
  return (
    <PortalProvider scope={__scopeHoverCard} forceMount={forceMount}>
      <Presence present={forceMount || context.open}>
        <UnstablePortal asChild container={container}>
          {children}
        </UnstablePortal>
      </Presence>
    </PortalProvider>
  );
};

HoverCardPortal.displayName = PORTAL_NAME;

/* -------------------------------------------------------------------------------------------------
 * HoverCardContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = 'HoverCardContent';

type HoverCardContentElement = HoverCardContentImplElement;
interface HoverCardContentProps extends HoverCardContentImplProps {
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: true;
}

const HoverCardContent = React.forwardRef<HoverCardContentElement, HoverCardContentProps>(
  (props: ScopedProps<HoverCardContentProps>, forwardedRef) => {
    const portalContext = usePortalContext(CONTENT_NAME, props.__scopeHoverCard);
    const { forceMount = portalContext.forceMount, ...contentProps } = props;
    const context = useHoverCardContext(CONTENT_NAME, props.__scopeHoverCard);
    return (
      <Presence present={forceMount || context.open}>
        <HoverCardContentImpl
          data-state={context.open ? 'open' : 'closed'}
          {...contentProps}
          onPointerEnter={composeEventHandlers(props.onPointerEnter, excludeTouch(context.onOpen))}
          onPointerLeave={composeEventHandlers(props.onPointerLeave, excludeTouch(context.onClose))}
          ref={forwardedRef}
        />
      </Presence>
    );
  }
);

HoverCardContent.displayName = CONTENT_NAME;

/* ---------------------------------------------------------------------------------------------- */

type HoverCardContentImplElement = React.ElementRef<typeof PopperPrimitive.Content>;
type DismissableLayerProps = Radix.ComponentPropsWithoutRef<typeof DismissableLayer>;
type PopperContentProps = Radix.ComponentPropsWithoutRef<typeof PopperPrimitive.Content>;
interface HoverCardContentImplProps extends PopperContentProps {
  /**
   * Event handler called when the escape key is down.
   * Can be prevented.
   */
  onEscapeKeyDown?: DismissableLayerProps['onEscapeKeyDown'];
  /**
   * Event handler called when the a `pointerdown` event happens outside of the `HoverCard`.
   * Can be prevented.
   */
  onPointerDownOutside?: DismissableLayerProps['onPointerDownOutside'];
  /**
   * Event handler called when the focus moves outside of the `HoverCard`.
   * Can be prevented.
   */
  onFocusOutside?: DismissableLayerProps['onFocusOutside'];
  /**
   * Event handler called when an interaction happens outside the `HoverCard`.
   * Specifically, when a `pointerdown` event happens outside or focus moves outside of it.
   * Can be prevented.
   */
  onInteractOutside?: DismissableLayerProps['onInteractOutside'];
}

const HoverCardContentImpl = React.forwardRef<
  HoverCardContentImplElement,
  HoverCardContentImplProps
>((props: ScopedProps<HoverCardContentImplProps>, forwardedRef) => {
  const {
    __scopeHoverCard,
    onEscapeKeyDown,
    onPointerDownOutside,
    onFocusOutside,
    onInteractOutside,
    ...contentProps
  } = props;
  const context = useHoverCardContext(CONTENT_NAME, __scopeHoverCard);
  const popperScope = usePopperScope(__scopeHoverCard);
  const ref = React.useRef<HoverCardContentImplElement>(null);
  const composedRefs = useComposedRefs(forwardedRef, ref);

  React.useEffect(() => {
    if (ref.current) {
      const tabbables = getTabbableNodes(ref.current);
      tabbables.forEach((tabbable) => tabbable.setAttribute('tabindex', '-1'));
    }
  });

  return (
    <DismissableLayer
      asChild
      disableOutsidePointerEvents={false}
      onInteractOutside={onInteractOutside}
      onEscapeKeyDown={onEscapeKeyDown}
      onPointerDownOutside={onPointerDownOutside}
      onFocusOutside={onFocusOutside}
      onDismiss={context.onDismiss}
    >
      <PopperPrimitive.Content
        {...popperScope}
        {...contentProps}
        ref={composedRefs}
        style={{
          ...contentProps.style,
          // re-namespace exposed content custom property
          ['--radix-hover-card-content-transform-origin' as any]:
            'var(--radix-popper-transform-origin)',
        }}
      />
    </DismissableLayer>
  );
});

/* -------------------------------------------------------------------------------------------------
 * HoverCardArrow
 * -----------------------------------------------------------------------------------------------*/

const ARROW_NAME = 'HoverCardArrow';

type HoverCardArrowElement = React.ElementRef<typeof PopperPrimitive.Arrow>;
type PopperArrowProps = Radix.ComponentPropsWithoutRef<typeof PopperPrimitive.Arrow>;
interface HoverCardArrowProps extends PopperArrowProps {}

const HoverCardArrow = React.forwardRef<HoverCardArrowElement, HoverCardArrowProps>(
  (props: ScopedProps<HoverCardArrowProps>, forwardedRef) => {
    const { __scopeHoverCard, ...arrowProps } = props;
    const popperScope = usePopperScope(__scopeHoverCard);
    return <PopperPrimitive.Arrow {...popperScope} {...arrowProps} ref={forwardedRef} />;
  }
);

HoverCardArrow.displayName = ARROW_NAME;

/* -----------------------------------------------------------------------------------------------*/

function excludeTouch<E>(eventHandler: () => void) {
  return (event: React.PointerEvent<E>) =>
    event.pointerType === 'touch' ? undefined : eventHandler();
}

/**
 * Returns a list of nodes that can be in the tab sequence.
 * @see: https://developer.mozilla.org/en-US/docs/Web/API/TreeWalker
 */
function getTabbableNodes(container: HTMLElement) {
  const nodes: HTMLElement[] = [];
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, {
    acceptNode: (node: any) => {
      // `.tabIndex` is not the same as the `tabindex` attribute. It works on the
      // runtime's understanding of tabbability, so this automatically accounts
      // for any kind of element that could be tabbed to.
      return node.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    },
  });
  while (walker.nextNode()) nodes.push(walker.currentNode as HTMLElement);
  return nodes;
}

const Root = HoverCard;
const Trigger = HoverCardTrigger;
const Portal = HoverCardPortal;
const Content = HoverCardContent;
const Arrow = HoverCardArrow;

export {
  createHoverCardScope,
  //
  HoverCard,
  HoverCardTrigger,
  HoverCardPortal,
  HoverCardContent,
  HoverCardArrow,
  //
  Root,
  Trigger,
  Portal,
  Content,
  Arrow,
};
export type {
  HoverCardProps,
  HoverCardTriggerProps,
  HoverCardPortalProps,
  HoverCardContentProps,
  HoverCardArrowProps,
};
