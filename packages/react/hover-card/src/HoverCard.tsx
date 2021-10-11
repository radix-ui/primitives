import * as React from 'react';
import { composeEventHandlers } from '@radix-ui/primitive';
import { createContext } from '@radix-ui/react-context';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { useEscapeKeydown } from '@radix-ui/react-use-escape-keydown';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import * as PopperPrimitive from '@radix-ui/react-popper';
import { Portal } from '@radix-ui/react-portal';
import { Presence } from '@radix-ui/react-presence';
import { Primitive } from '@radix-ui/react-primitive';
import type * as Radix from '@radix-ui/react-primitive';

/* -------------------------------------------------------------------------------------------------
 * HoverCard
 * -----------------------------------------------------------------------------------------------*/

const HOVERCARD_NAME = 'HoverCard';

type HoverCardContextValue = {
  open: boolean;
  onOpenChange(open: boolean): void;
  onOpen(): void;
  onClose(): void;
};

const [HoverCardProvider, useHoverCardContext] =
  createContext<HoverCardContextValue>(HOVERCARD_NAME);

interface HoverCardProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  openDelay?: number;
  closeDelay?: number;
}

const HoverCard: React.FC<HoverCardProps> = (props) => {
  const {
    children,
    open: openProp,
    defaultOpen,
    onOpenChange,
    openDelay = 700,
    closeDelay = 300,
  } = props;
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

  // cleanup any queued state updates on unmount
  React.useEffect(() => {
    return () => {
      clearTimeout(openTimerRef.current);
      clearTimeout(closeTimerRef.current);
    };
  }, []);

  return (
    <HoverCardProvider open={open} onOpenChange={setOpen} onOpen={handleOpen} onClose={handleClose}>
      <PopperPrimitive.Root>{children}</PopperPrimitive.Root>
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
  (props, forwardedRef) => {
    const context = useHoverCardContext(TRIGGER_NAME);
    return (
      <PopperPrimitive.Anchor asChild>
        <Primitive.a
          data-state={context.open ? 'open' : 'closed'}
          {...props}
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
  (props, forwardedRef) => {
    const { forceMount, ...contentProps } = props;
    const context = useHoverCardContext(CONTENT_NAME);
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
type PopperContentProps = Radix.ComponentPropsWithoutRef<typeof PopperPrimitive.Content>;
interface HoverCardContentImplProps extends PopperContentProps {
  /**
   * Whether the `HoverCard` should render in a `Portal`
   * (default: `true`)
   */
  portalled?: boolean;
}

const HoverCardContentImpl = React.forwardRef<
  HoverCardContentImplElement,
  HoverCardContentImplProps
>((props, forwardedRef) => {
  const { portalled = true, ...contentProps } = props;
  const context = useHoverCardContext(CONTENT_NAME);
  const ref = React.useRef<React.ElementRef<typeof PopperPrimitive.Content>>(null);
  const composedRefs = useComposedRefs(forwardedRef, ref);
  const PortalWrapper = portalled ? Portal : React.Fragment;

  useEscapeKeydown(() => context.onClose());

  React.useEffect(() => {
    if (ref.current) {
      const tabbables = getTabbableNodes(ref.current);
      tabbables.forEach((tabbable) => tabbable.setAttribute('tabindex', '-1'));
    }
  });

  return (
    <PortalWrapper>
      <PopperPrimitive.Content
        {...contentProps}
        ref={composedRefs}
        style={{
          ...contentProps.style,
          // re-namespace exposed content custom property
          ['--radix-hover-card-content-transform-origin' as any]:
            'var(--radix-popper-transform-origin)',
        }}
      />
    </PortalWrapper>
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
  (props, forwardedRef) => <PopperPrimitive.Arrow {...props} ref={forwardedRef} />
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
export type { HoverCardProps, HoverCardTriggerProps, HoverCardContentProps, HoverCardArrowProps };
