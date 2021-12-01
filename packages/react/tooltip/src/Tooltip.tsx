import * as React from 'react';
import { composeEventHandlers } from '@radix-ui/primitive';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import { createContextScope } from '@radix-ui/react-context';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { useEscapeKeydown } from '@radix-ui/react-use-escape-keydown';
import { usePrevious } from '@radix-ui/react-use-previous';
import { useRect } from '@radix-ui/react-use-rect';
import { Presence } from '@radix-ui/react-presence';
import { Primitive } from '@radix-ui/react-primitive';
import * as PopperPrimitive from '@radix-ui/react-popper';
import { createPopperScope } from '@radix-ui/react-popper';
import { Portal } from '@radix-ui/react-portal';
import { Slottable } from '@radix-ui/react-slot';
import * as VisuallyHiddenPrimitive from '@radix-ui/react-visually-hidden';
import { useId } from '@radix-ui/react-id';

import type * as Radix from '@radix-ui/react-primitive';
import type { Scope } from '@radix-ui/react-context';

/* -------------------------------------------------------------------------------------------------
 * TooltipProvider
 * -----------------------------------------------------------------------------------------------*/

const PROVIDER_NAME = 'TooltipProvider';
const DEFAULT_DELAY_DURATION = 700;
const TOOLTIP_OPEN = 'tooltip.open';

type ScopedProps<P = {}> = P & { __scopeTooltipProvider?: Scope };
const [createTooltipContext, createTooltipScope] = createContextScope(PROVIDER_NAME, [
  createPopperScope,
]);
const usePopperScope = createPopperScope();

type TooltipProviderContextValue = {
  isOpenDelayed: boolean;
  delayDuration: number;
  onTooltipOpen(): void;
  onTooltipClose(): void;
};

const [TooltipProviderProvider, useTooltipProviderContext] =
  createTooltipContext<TooltipProviderContextValue>(PROVIDER_NAME, {
    isOpenDelayed: true,
    delayDuration: DEFAULT_DELAY_DURATION,
    onTooltipOpen: () => {},
    onTooltipClose: () => {},
  });

interface TooltipProviderProps {
  /**
   * The duration from when the mouse enters the trigger until the tooltip gets opened.
   * @defaultValue 700
   */
  delayDuration?: number;
  /**
   * How much time a user has to enter another trigger without incurring a delay again.
   * @defaultValue 300
   */
  skipDelayDuration?: number;
  children: React.ReactNode;
}

const TooltipProvider: React.FC<TooltipProviderProps> = (
  props: ScopedProps<TooltipProviderProps>
) => {
  const {
    __scopeTooltipProvider,
    delayDuration = DEFAULT_DELAY_DURATION,
    skipDelayDuration = 300,
    children,
  } = props;
  const [isOpenDelayed, setIsOpenDelayed] = React.useState(true);
  const skipDelayTimerRef = React.useRef(0);

  React.useEffect(() => {
    const skipDelayTimer = skipDelayTimerRef.current;
    return () => window.clearTimeout(skipDelayTimer);
  }, []);

  return (
    <TooltipProviderProvider
      scope={__scopeTooltipProvider}
      isOpenDelayed={isOpenDelayed}
      delayDuration={delayDuration}
      onTooltipOpen={React.useCallback(() => {
        window.clearTimeout(skipDelayTimerRef.current);
        setIsOpenDelayed(false);
      }, [])}
      onTooltipClose={React.useCallback(() => {
        window.clearTimeout(skipDelayTimerRef.current);
        skipDelayTimerRef.current = window.setTimeout(
          () => setIsOpenDelayed(true),
          skipDelayDuration
        );
      }, [skipDelayDuration])}
    >
      {children}
    </TooltipProviderProvider>
  );
};

TooltipProvider.displayName = PROVIDER_NAME;

/* -------------------------------------------------------------------------------------------------
 * Tooltip
 * -----------------------------------------------------------------------------------------------*/

const TOOLTIP_NAME = 'Tooltip';

type TooltipContextValue = {
  contentId: string;
  open: boolean;
  stateAttribute: 'closed' | 'delayed-open' | 'instant-open';
  trigger: TooltipTriggerElement | null;
  onTriggerChange(trigger: TooltipTriggerElement | null): void;
  onFocus(): void;
  onOpen(): void;
  onClose(): void;
};

const [TooltipImplProvider, useTooltipContext] =
  createTooltipContext<TooltipContextValue>(TOOLTIP_NAME);

interface TooltipProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;

  /**
   * The duration from when the mouse enters the trigger until the tooltip gets opened. This will
   * override the prop with the same name passed to Provider.
   * @defaultValue 700
   */
  delayDuration?: number;
  children?: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = (props: ScopedProps<TooltipProps>) => {
  const {
    __scopeTooltipProvider,
    children,
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    delayDuration: delayDurationProp,
  } = props;
  const context = useTooltipProviderContext(TOOLTIP_NAME, __scopeTooltipProvider);
  const popperScope = usePopperScope(__scopeTooltipProvider);
  const [trigger, setTrigger] = React.useState<HTMLButtonElement | null>(null);
  const contentId = useId();
  const openTimerRef = React.useRef(0);
  const delayDuration = delayDurationProp ?? context.delayDuration;
  const openDelay = context.isOpenDelayed ? delayDuration : 0;
  const wasOpenDelayed = usePrevious(Boolean(openDelay));
  const { onTooltipOpen, onTooltipClose } = context;
  const [open = false, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  });

  const stateAttribute = React.useMemo(() => {
    return open ? (wasOpenDelayed ? 'delayed-open' : 'instant-open') : 'closed';
  }, [wasOpenDelayed, open]);

  const handleOpen = React.useCallback(() => {
    setOpen((prevOpen) => {
      if (!prevOpen) document.dispatchEvent(new CustomEvent(TOOLTIP_OPEN));
      return true;
    });
    onTooltipOpen();
  }, [setOpen, onTooltipOpen]);

  React.useEffect(() => {
    return () => window.clearTimeout(openTimerRef.current);
  }, []);

  return (
    <PopperPrimitive.Root {...popperScope}>
      <TooltipImplProvider
        scope={__scopeTooltipProvider}
        contentId={contentId}
        open={open}
        stateAttribute={stateAttribute}
        trigger={trigger}
        onTriggerChange={setTrigger}
        onFocus={React.useCallback(handleOpen, [handleOpen])}
        onOpen={React.useCallback(() => {
          window.clearTimeout(openTimerRef.current);
          openTimerRef.current = window.setTimeout(handleOpen, openDelay);
        }, [openDelay, handleOpen])}
        onClose={React.useCallback(() => {
          window.clearTimeout(openTimerRef.current);
          setOpen(false);
          onTooltipClose();
        }, [onTooltipClose, setOpen])}
      >
        {children}
      </TooltipImplProvider>
    </PopperPrimitive.Root>
  );
};

Tooltip.displayName = TOOLTIP_NAME;

/* -------------------------------------------------------------------------------------------------
 * TooltipTrigger
 * -----------------------------------------------------------------------------------------------*/

const TRIGGER_NAME = 'TooltipTrigger';

type TooltipTriggerElement = React.ElementRef<typeof Primitive.button>;
type PrimitiveButtonProps = Radix.ComponentPropsWithoutRef<typeof Primitive.button>;
interface TooltipTriggerProps extends PrimitiveButtonProps {}

const TooltipTrigger = React.forwardRef<TooltipTriggerElement, TooltipTriggerProps>(
  (props: ScopedProps<TooltipTriggerProps>, forwardedRef) => {
    const { __scopeTooltipProvider, ...triggerProps } = props;
    const context = useTooltipContext(TRIGGER_NAME, __scopeTooltipProvider);
    const popperScope = usePopperScope(__scopeTooltipProvider);
    const composedTriggerRef = useComposedRefs(forwardedRef, context.onTriggerChange);
    return (
      <PopperPrimitive.Anchor asChild {...popperScope}>
        <Primitive.button
          type="button"
          aria-describedby={context.open ? context.contentId : undefined}
          data-state={context.stateAttribute}
          {...triggerProps}
          ref={composedTriggerRef}
          onMouseEnter={composeEventHandlers(props.onMouseEnter, context.onOpen)}
          onMouseLeave={composeEventHandlers(props.onMouseLeave, context.onClose)}
          onMouseDown={composeEventHandlers(props.onMouseDown, context.onClose)}
          onFocus={composeEventHandlers(props.onFocus, context.onFocus)}
          onBlur={composeEventHandlers(props.onBlur, context.onClose)}
          // Handle anything that the browser considers a click for the element type if
          // not using pointer e.g. Space keyup and Enter keydown
          onClick={composeEventHandlers(props.onClick, context.onClose)}
        />
      </PopperPrimitive.Anchor>
    );
  }
);

TooltipTrigger.displayName = TRIGGER_NAME;

/* -------------------------------------------------------------------------------------------------
 * TooltipContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = 'TooltipContent';

type TooltipContentElement = TooltipContentImplElement;
interface TooltipContentProps extends TooltipContentImplProps {
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: true;
}

const TooltipContent = React.forwardRef<TooltipContentElement, TooltipContentProps>(
  (props: ScopedProps<TooltipContentProps>, forwardedRef) => {
    const { forceMount, ...contentProps } = props;
    const context = useTooltipContext(CONTENT_NAME, props.__scopeTooltipProvider);
    return (
      <Presence present={forceMount || context.open}>
        <TooltipContentImpl ref={forwardedRef} {...contentProps} />
      </Presence>
    );
  }
);

type TooltipContentImplElement = React.ElementRef<typeof PopperPrimitive.Content>;
type PopperContentProps = Radix.ComponentPropsWithoutRef<typeof PopperPrimitive.Content>;
interface TooltipContentImplProps extends PopperContentProps {
  /**
   * A more descriptive label for accessibility purpose
   */
  'aria-label'?: string;

  /**
   * Whether the Tooltip should render in a Portal
   * (default: `true`)
   */
  portalled?: boolean;
}

const TooltipContentImpl = React.forwardRef<TooltipContentImplElement, TooltipContentImplProps>(
  (props: ScopedProps<TooltipContentImplProps>, forwardedRef) => {
    const {
      __scopeTooltipProvider,
      children,
      'aria-label': ariaLabel,
      portalled = true,
      ...contentProps
    } = props;
    const context = useTooltipContext(CONTENT_NAME, __scopeTooltipProvider);
    const popperScope = usePopperScope(__scopeTooltipProvider);
    const PortalWrapper = portalled ? Portal : React.Fragment;
    const { onClose } = context;

    useEscapeKeydown(() => onClose());

    React.useEffect(() => {
      // Close this tooltip if another one opens
      document.addEventListener(TOOLTIP_OPEN, onClose);
      return () => document.removeEventListener(TOOLTIP_OPEN, onClose);
    }, [onClose]);

    return (
      <PortalWrapper>
        <CheckTriggerMoved __scopeTooltipProvider={__scopeTooltipProvider} />
        <PopperPrimitive.Content
          data-state={context.stateAttribute}
          {...popperScope}
          {...contentProps}
          ref={forwardedRef}
          style={{
            ...contentProps.style,
            // re-namespace exposed content custom property
            ['--radix-tooltip-content-transform-origin' as any]:
              'var(--radix-popper-transform-origin)',
          }}
        >
          <Slottable>{children}</Slottable>
          <VisuallyHiddenPrimitive.Root id={context.contentId} role="tooltip">
            {ariaLabel || children}
          </VisuallyHiddenPrimitive.Root>
        </PopperPrimitive.Content>
      </PortalWrapper>
    );
  }
);

TooltipContent.displayName = CONTENT_NAME;

/* -------------------------------------------------------------------------------------------------
 * TooltipArrow
 * -----------------------------------------------------------------------------------------------*/

const ARROW_NAME = 'TooltipArrow';

type TooltipArrowElement = React.ElementRef<typeof PopperPrimitive.Arrow>;
type PopperArrowProps = Radix.ComponentPropsWithoutRef<typeof PopperPrimitive.Arrow>;
interface TooltipArrowProps extends PopperArrowProps {}

const TooltipArrow = React.forwardRef<TooltipArrowElement, TooltipArrowProps>(
  (props: ScopedProps<TooltipArrowProps>, forwardedRef) => {
    const { __scopeTooltipProvider, ...arrowProps } = props;
    const popperScope = usePopperScope(__scopeTooltipProvider);
    return <PopperPrimitive.Arrow {...popperScope} {...arrowProps} ref={forwardedRef} />;
  }
);

TooltipArrow.displayName = ARROW_NAME;

/* -----------------------------------------------------------------------------------------------*/

function CheckTriggerMoved(props: ScopedProps<{}>) {
  const { __scopeTooltipProvider } = props;
  const context = useTooltipContext('CheckTriggerMoved', __scopeTooltipProvider);

  const triggerRect = useRect(context.trigger);
  const triggerLeft = triggerRect?.left;
  const previousTriggerLeft = usePrevious(triggerLeft);
  const triggerTop = triggerRect?.top;
  const previousTriggerTop = usePrevious(triggerTop);
  const handleClose = context.onClose;

  React.useEffect(() => {
    // checking if the user has scrolled…
    const hasTriggerMoved =
      (previousTriggerLeft !== undefined && previousTriggerLeft !== triggerLeft) ||
      (previousTriggerTop !== undefined && previousTriggerTop !== triggerTop);

    if (hasTriggerMoved) {
      handleClose();
    }
  }, [handleClose, previousTriggerLeft, previousTriggerTop, triggerLeft, triggerTop]);

  return null;
}

const Provider = TooltipProvider;
const Root = Tooltip;
const Trigger = TooltipTrigger;
const Content = TooltipContent;
const Arrow = TooltipArrow;

export {
  createTooltipScope,
  //
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipArrow,
  //
  Provider,
  Root,
  Trigger,
  Content,
  Arrow,
};
export type { TooltipProps, TooltipTriggerProps, TooltipContentProps, TooltipArrowProps };
