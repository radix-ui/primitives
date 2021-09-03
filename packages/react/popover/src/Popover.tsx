import * as React from 'react';
import { composeEventHandlers } from '@radix-ui/primitive';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import { createContext } from '@radix-ui/react-context';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import * as PopperPrimitive from '@radix-ui/react-popper';
import { DismissableLayer } from '@radix-ui/react-dismissable-layer';
import { FocusScope } from '@radix-ui/react-focus-scope';
import { Portal } from '@radix-ui/react-portal';
import { useFocusGuards } from '@radix-ui/react-focus-guards';
import { Presence } from '@radix-ui/react-presence';
import { Primitive } from '@radix-ui/react-primitive';
import { useId } from '@radix-ui/react-id';
import { RemoveScroll } from 'react-remove-scroll';
import { hideOthers } from 'aria-hidden';

import type * as Radix from '@radix-ui/react-primitive';

/* -------------------------------------------------------------------------------------------------
 * Popover
 * -----------------------------------------------------------------------------------------------*/

const POPOVER_NAME = 'Popover';

type PopoverContextValue = {
  triggerRef: React.RefObject<HTMLButtonElement>;
  contentId: string;
  open: boolean;
  onOpenChange(open: boolean): void;
  onOpenToggle(): void;
  hasCustomAnchor: boolean;
  onCustomAnchorAdd(): void;
  onCustomAnchorRemove(): void;
  modal: boolean;
};

const [PopoverProvider, usePopoverContext] = createContext<PopoverContextValue>(POPOVER_NAME);

interface PopoverProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  modal?: boolean;
}

const Popover: React.FC<PopoverProps> = (props) => {
  const { children, open: openProp, defaultOpen, onOpenChange, modal = false } = props;
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const [hasCustomAnchor, setHasCustomAnchor] = React.useState(false);
  const [open = false, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  });

  return (
    <PopperPrimitive.Root>
      <PopoverProvider
        contentId={useId()}
        triggerRef={triggerRef}
        open={open}
        onOpenChange={setOpen}
        onOpenToggle={React.useCallback(() => setOpen((prevOpen) => !prevOpen), [setOpen])}
        hasCustomAnchor={hasCustomAnchor}
        onCustomAnchorAdd={React.useCallback(() => setHasCustomAnchor(true), [])}
        onCustomAnchorRemove={React.useCallback(() => setHasCustomAnchor(false), [])}
        modal={modal}
      >
        {children}
      </PopoverProvider>
    </PopperPrimitive.Root>
  );
};

Popover.displayName = POPOVER_NAME;

/* -------------------------------------------------------------------------------------------------
 * PopoverAnchor
 * -----------------------------------------------------------------------------------------------*/

const ANCHOR_NAME = 'PopoverAnchor';

type PopoverAnchorElement = React.ElementRef<typeof PopperPrimitive.Anchor>;
type PopperAnchorProps = Radix.ComponentPropsWithoutRef<typeof PopperPrimitive.Anchor>;
interface PopoverAnchorProps extends PopperAnchorProps {}

const PopoverAnchor = React.forwardRef<PopoverAnchorElement, PopoverAnchorProps>(
  (props, forwardedRef) => {
    const context = usePopoverContext(ANCHOR_NAME);
    const { onCustomAnchorAdd, onCustomAnchorRemove } = context;

    React.useEffect(() => {
      onCustomAnchorAdd();
      return () => onCustomAnchorRemove();
    }, [onCustomAnchorAdd, onCustomAnchorRemove]);

    return <PopperPrimitive.Anchor {...props} ref={forwardedRef} />;
  }
);

PopoverAnchor.displayName = ANCHOR_NAME;

/* -------------------------------------------------------------------------------------------------
 * PopoverTrigger
 * -----------------------------------------------------------------------------------------------*/

const TRIGGER_NAME = 'PopoverTrigger';

type PopoverTriggerElement = React.ElementRef<typeof Primitive.button>;
type PrimitiveButtonProps = Radix.ComponentPropsWithoutRef<typeof Primitive.button>;
interface PopoverTriggerProps extends PrimitiveButtonProps {}

const PopoverTrigger = React.forwardRef<PopoverTriggerElement, PopoverTriggerProps>(
  (props, forwardedRef) => {
    const context = usePopoverContext(TRIGGER_NAME);
    const composedTriggerRef = useComposedRefs(forwardedRef, context.triggerRef);

    const trigger = (
      <Primitive.button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={context.open}
        aria-controls={context.contentId}
        data-state={getState(context.open)}
        {...props}
        ref={composedTriggerRef}
        onClick={composeEventHandlers(props.onClick, context.onOpenToggle)}
      />
    );

    return context.hasCustomAnchor ? (
      trigger
    ) : (
      <PopperPrimitive.Anchor asChild>{trigger}</PopperPrimitive.Anchor>
    );
  }
);

PopoverTrigger.displayName = TRIGGER_NAME;

/* -------------------------------------------------------------------------------------------------
 * PopoverContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = 'PopoverContent';

interface PopoverContentProps extends PopoverContentTypeProps {
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: true;
}

const PopoverContent = React.forwardRef<PopoverContentTypeElement, PopoverContentProps>(
  (props, forwardedRef) => {
    const { forceMount, ...contentProps } = props;
    const context = usePopoverContext(CONTENT_NAME);
    return (
      <Presence present={forceMount || context.open}>
        {context.modal ? (
          <PopoverContentModal {...contentProps} ref={forwardedRef} />
        ) : (
          <PopoverContentNonModal {...contentProps} ref={forwardedRef} />
        )}
      </Presence>
    );
  }
);

PopoverContent.displayName = CONTENT_NAME;

/* -----------------------------------------------------------------------------------------------*/

type PopoverContentTypeElement = PopoverContentImplElement;
interface PopoverContentTypeProps
  extends Omit<PopoverContentImplProps, 'trapFocus' | 'disableOutsidePointerEvents'> {
  /**
   * Whether the `Popover` should render in a `Portal`
   * (default: `true`)
   */
  portalled?: boolean;
}

const PopoverContentModal = React.forwardRef<PopoverContentTypeElement, PopoverContentTypeProps>(
  (props, forwardedRef) => {
    const { portalled = true, ...contentModalProps } = props;
    const context = usePopoverContext(CONTENT_NAME);
    const contentRef = React.useRef<HTMLDivElement>(null);
    const composedRefs = useComposedRefs(forwardedRef, contentRef);
    const isRightClickOutsideRef = React.useRef(false);

    // aria-hide everything except the content (better supported equivalent to setting aria-modal)
    React.useEffect(() => {
      const content = contentRef.current;
      if (content) return hideOthers(content);
    }, []);

    const PortalWrapper = portalled ? Portal : React.Fragment;

    return (
      <PortalWrapper>
        <RemoveScroll>
          <PopoverContentImpl
            {...contentModalProps}
            ref={composedRefs}
            // we make sure we're not trapping once it's been closed
            // (closed !== unmounted when animating out)
            trapFocus={context.open}
            disableOutsidePointerEvents
            onCloseAutoFocus={composeEventHandlers(props.onCloseAutoFocus, (event) => {
              event.preventDefault();
              if (!isRightClickOutsideRef.current) context.triggerRef.current?.focus();
            })}
            onPointerDownOutside={composeEventHandlers(
              props.onPointerDownOutside,
              (event) => {
                const originalEvent = event.detail.originalEvent;
                const ctrlLeftClick = originalEvent.button === 0 && originalEvent.ctrlKey === true;
                const isRightClick = originalEvent.button === 2 || ctrlLeftClick;

                isRightClickOutsideRef.current = isRightClick;
              },
              { checkForDefaultPrevented: false }
            )}
            // When focus is trapped, a `focusout` event may still happen.
            // We make sure we don't trigger our `onDismiss` in such case.
            onFocusOutside={composeEventHandlers(
              props.onFocusOutside,
              (event) => event.preventDefault(),
              { checkForDefaultPrevented: false }
            )}
          />
        </RemoveScroll>
      </PortalWrapper>
    );
  }
);

const PopoverContentNonModal = React.forwardRef<PopoverContentTypeElement, PopoverContentTypeProps>(
  (props, forwardedRef) => {
    const { portalled = true, ...contentNonModalProps } = props;
    const context = usePopoverContext(CONTENT_NAME);
    const hasInteractedOutsideRef = React.useRef(false);

    const PortalWrapper = portalled ? Portal : React.Fragment;

    return (
      <PortalWrapper>
        <PopoverContentImpl
          {...contentNonModalProps}
          ref={forwardedRef}
          trapFocus={false}
          disableOutsidePointerEvents={false}
          onCloseAutoFocus={(event) => {
            props.onCloseAutoFocus?.(event);

            if (!event.defaultPrevented) {
              if (!hasInteractedOutsideRef.current) context.triggerRef.current?.focus();
              // Always prevent auto focus because we either focus manually or want user agent focus
              event.preventDefault();
            }

            hasInteractedOutsideRef.current = false;
          }}
          onInteractOutside={(event) => {
            props.onInteractOutside?.(event);

            if (!event.defaultPrevented) hasInteractedOutsideRef.current = true;

            // Prevent dismissing when clicking the trigger.
            // As the trigger is already setup to close, without doing so would
            // cause it to close and immediately open.
            //
            // We use `onInteractOutside` as some browsers also
            // focus on pointer down, creating the same issue.
            const target = event.target as HTMLElement;
            const targetIsTrigger = context.triggerRef.current?.contains(target);
            if (targetIsTrigger) event.preventDefault();
          }}
        />
      </PortalWrapper>
    );
  }
);

/* -----------------------------------------------------------------------------------------------*/

type PopoverContentImplElement = React.ElementRef<typeof PopperPrimitive.Content>;
type FocusScopeProps = Radix.ComponentPropsWithoutRef<typeof FocusScope>;
type DismissableLayerProps = Radix.ComponentPropsWithoutRef<typeof DismissableLayer>;
type PopperContentProps = Radix.ComponentPropsWithoutRef<typeof PopperPrimitive.Content>;
interface PopoverContentImplProps
  extends PopperContentProps,
    Omit<DismissableLayerProps, 'onDismiss'> {
  /**
   * Whether focus should be trapped within the `Popover`
   * (default: false)
   */
  trapFocus?: FocusScopeProps['trapped'];

  /**
   * Event handler called when auto-focusing on open.
   * Can be prevented.
   */
  onOpenAutoFocus?: FocusScopeProps['onMountAutoFocus'];

  /**
   * Event handler called when auto-focusing on close.
   * Can be prevented.
   */
  onCloseAutoFocus?: FocusScopeProps['onUnmountAutoFocus'];
}

const PopoverContentImpl = React.forwardRef<PopoverContentImplElement, PopoverContentImplProps>(
  (props, forwardedRef) => {
    const {
      trapFocus,
      onOpenAutoFocus,
      onCloseAutoFocus,
      disableOutsidePointerEvents,
      onEscapeKeyDown,
      onPointerDownOutside,
      onFocusOutside,
      onInteractOutside,
      ...contentProps
    } = props;
    const context = usePopoverContext(CONTENT_NAME);

    // Make sure the whole tree has focus guards as our `Popover` may be
    // the last element in the DOM (beacuse of the `Portal`)
    useFocusGuards();

    return (
      <FocusScope
        asChild
        loop
        trapped={trapFocus}
        onMountAutoFocus={onOpenAutoFocus}
        onUnmountAutoFocus={onCloseAutoFocus}
      >
        <DismissableLayer
          asChild
          disableOutsidePointerEvents={disableOutsidePointerEvents}
          onInteractOutside={onInteractOutside}
          onEscapeKeyDown={onEscapeKeyDown}
          onPointerDownOutside={onPointerDownOutside}
          onFocusOutside={onFocusOutside}
          onDismiss={() => context.onOpenChange(false)}
        >
          <PopperPrimitive.Content
            data-state={getState(context.open)}
            role="dialog"
            id={context.contentId}
            {...contentProps}
            ref={forwardedRef}
            style={{
              ...contentProps.style,
              // re-namespace exposed content custom property
              ['--radix-popover-content-transform-origin' as any]:
                'var(--radix-popper-transform-origin)',
            }}
          />
        </DismissableLayer>
      </FocusScope>
    );
  }
);

/* -------------------------------------------------------------------------------------------------
 * PopoverClose
 * -----------------------------------------------------------------------------------------------*/

const CLOSE_NAME = 'PopoverClose';

type PopoverCloseElement = React.ElementRef<typeof Primitive.button>;
interface PopoverCloseProps extends PrimitiveButtonProps {}

const PopoverClose = React.forwardRef<PopoverCloseElement, PopoverCloseProps>(
  (props, forwardedRef) => {
    const context = usePopoverContext(CLOSE_NAME);
    return (
      <Primitive.button
        type="button"
        {...props}
        ref={forwardedRef}
        onClick={composeEventHandlers(props.onClick, () => context.onOpenChange(false))}
      />
    );
  }
);

PopoverClose.displayName = CLOSE_NAME;

/* -------------------------------------------------------------------------------------------------
 * PopoverArrow
 * -----------------------------------------------------------------------------------------------*/

const ARROW_NAME = 'PopoverArrow';

type PopoverArrowElement = React.ElementRef<typeof PopperPrimitive.Arrow>;
type PopperArrowProps = Radix.ComponentPropsWithoutRef<typeof PopperPrimitive.Arrow>;
interface PopoverArrowProps extends PopperArrowProps {}

const PopoverArrow = React.forwardRef<PopoverArrowElement, PopoverArrowProps>(
  (props, forwardedRef) => <PopperPrimitive.Arrow {...props} ref={forwardedRef} />
);

PopoverArrow.displayName = ARROW_NAME;

/* -----------------------------------------------------------------------------------------------*/

function getState(open: boolean) {
  return open ? 'open' : 'closed';
}

const Root = Popover;
const Anchor = PopoverAnchor;
const Trigger = PopoverTrigger;
const Content = PopoverContent;
const Close = PopoverClose;
const Arrow = PopoverArrow;

export {
  Popover,
  PopoverAnchor,
  PopoverTrigger,
  PopoverContent,
  PopoverClose,
  PopoverArrow,
  //
  Root,
  Anchor,
  Trigger,
  Content,
  Close,
  Arrow,
};
export type {
  PopoverProps,
  PopoverAnchorProps,
  PopoverTriggerProps,
  PopoverContentProps,
  PopoverCloseProps,
  PopoverArrowProps,
};
