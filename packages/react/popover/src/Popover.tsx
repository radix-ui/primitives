import * as React from 'react';
import { composeEventHandlers } from '@radix-ui/primitive';
import { useComposedRefs, composeRefs } from '@radix-ui/react-compose-refs';
import { createContext } from '@radix-ui/react-context';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import * as PopperPrimitive from '@radix-ui/react-popper';
import { DismissableLayer } from '@radix-ui/react-dismissable-layer';
import { FocusScope } from '@radix-ui/react-focus-scope';
import { Portal } from '@radix-ui/react-portal';
import { useFocusGuards } from '@radix-ui/react-focus-guards';
import { Presence } from '@radix-ui/react-presence';
import { Primitive, extendPrimitive } from '@radix-ui/react-primitive';
import { useId } from '@radix-ui/react-id';
import { RemoveScroll } from 'react-remove-scroll';
import { hideOthers } from 'aria-hidden';

import type * as Polymorphic from '@radix-ui/react-polymorphic';

type DismissableLayerProps = React.ComponentProps<typeof DismissableLayer>;
type FocusScopeProps = React.ComponentProps<typeof FocusScope>;

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
};

const [PopoverProvider, usePopoverContext] = createContext<PopoverContextValue>(POPOVER_NAME);

type PopoverOwnProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

const Popover: React.FC<PopoverOwnProps> = (props) => {
  const { children, open: openProp, defaultOpen, onOpenChange } = props;
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const [open = false, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  });

  return (
    <PopoverProvider
      contentId={useId()}
      triggerRef={triggerRef}
      open={open}
      onOpenChange={setOpen}
      onOpenToggle={React.useCallback(() => setOpen((prevOpen) => !prevOpen), [setOpen])}
    >
      {children}
    </PopoverProvider>
  );
};

Popover.displayName = POPOVER_NAME;

/* -------------------------------------------------------------------------------------------------
 * PopoverTrigger
 * -----------------------------------------------------------------------------------------------*/

const TRIGGER_NAME = 'PopoverTrigger';
const TRIGGER_DEFAULT_TAG = 'button';

type PopoverTriggerOwnProps = Polymorphic.OwnProps<typeof Primitive>;
type PopoverTriggerPrimitive = Polymorphic.ForwardRefComponent<
  typeof TRIGGER_DEFAULT_TAG,
  PopoverTriggerOwnProps
>;

const PopoverTrigger = React.forwardRef((props, forwardedRef) => {
  const { as = TRIGGER_DEFAULT_TAG, ...triggerProps } = props;
  const context = usePopoverContext(TRIGGER_NAME);
  const composedTriggerRef = useComposedRefs(forwardedRef, context.triggerRef);
  return (
    <Primitive
      type="button"
      aria-haspopup="dialog"
      aria-expanded={context.open}
      aria-controls={context.contentId}
      data-state={context.open ? 'open' : 'closed'}
      {...triggerProps}
      as={as}
      ref={composedTriggerRef}
      onClick={composeEventHandlers(props.onClick, context.onOpenToggle)}
    />
  );
}) as PopoverTriggerPrimitive;

PopoverTrigger.displayName = TRIGGER_NAME;

/* -------------------------------------------------------------------------------------------------
 * PopoverContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = 'PopoverContent';

type PopoverContentOwnProps = Polymorphic.Merge<
  Polymorphic.OwnProps<typeof PopoverContentImpl>,
  {
    /**
     * Used to force mounting when more control is needed. Useful when
     * controlling animation with React animation libraries.
     */
    forceMount?: true;
  }
>;

type PopoverContentPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof PopoverContentImpl>,
  PopoverContentOwnProps
>;

const PopoverContent = React.forwardRef((props, forwardedRef) => {
  const { forceMount, ...contentProps } = props;
  const context = usePopoverContext(CONTENT_NAME);

  return (
    <Presence present={forceMount || context.open}>
      <PopoverContentImpl
        data-state={context.open ? 'open' : 'closed'}
        {...contentProps}
        ref={forwardedRef}
      />
    </Presence>
  );
}) as PopoverContentPrimitive;

type PopperPrimitiveOwnProps = Polymorphic.OwnProps<typeof PopperPrimitive.Root>;
type PopoverContentImplOwnProps = Polymorphic.Merge<
  PopperPrimitiveOwnProps,
  {
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

    /**
     * When `true`, hover/focus/click interactions will be disabled on elements outside the `Popover`.
     * Users will need to click twice on outside elements to interact with them:
     * Once to close the `Popover`, and again to trigger the element.
     */
    disableOutsidePointerEvents?: DismissableLayerProps['disableOutsidePointerEvents'];

    /**
     * Event handler called when the escape key is down.
     * Can be prevented.
     */
    onEscapeKeyDown?: DismissableLayerProps['onEscapeKeyDown'];

    /**
     * Event handler called when the a pointer event happens outside of the `Popover`.
     * Can be prevented.
     */
    onPointerDownOutside?: DismissableLayerProps['onPointerDownOutside'];

    /**
     * Event handler called when the focus moves outside of the `Popover`.
     * Can be prevented.
     */
    onFocusOutside?: DismissableLayerProps['onFocusOutside'];

    /**
     * Event handler called when an interaction happens outside the `Popover`.
     * Specifically, when a pointer event happens outside of the `Popover` or focus moves outside of it.
     * Can be prevented.
     */
    onInteractOutside?: DismissableLayerProps['onInteractOutside'];

    /**
     * Whether scrolling outside the `Popover` should be prevented
     * (default: `false`)
     */
    disableOutsideScroll?: boolean;

    /**
     * Whether the `Popover` should render in a `Portal`
     * (default: `true`)
     */
    portalled?: boolean;

    anchorRef?: PopperPrimitiveOwnProps['anchorRef'];
  }
>;

type PopoverContentImplPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof PopperPrimitive.Root>,
  PopoverContentImplOwnProps
>;

const PopoverContentImpl = React.forwardRef((props, forwardedRef) => {
  const {
    anchorRef,
    trapFocus = true,
    onOpenAutoFocus,
    onCloseAutoFocus,
    disableOutsidePointerEvents = false,
    onEscapeKeyDown,
    onPointerDownOutside,
    onFocusOutside,
    onInteractOutside,
    disableOutsideScroll = false,
    portalled = true,
    ...contentProps
  } = props;
  const context = usePopoverContext(CONTENT_NAME);
  const [
    isPermittedPointerDownOutsideEvent,
    setIsPermittedPointerDownOutsideEvent,
  ] = React.useState(false);

  const PortalWrapper = portalled ? Portal : React.Fragment;
  const ScrollLockWrapper = disableOutsideScroll ? RemoveScroll : React.Fragment;

  // Make sure the whole tree has focus guards as our `Popover` may be
  // the last element in the DOM (beacuse of the `Portal`)
  useFocusGuards();

  // Hide everything from ARIA except the content
  const contentRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const content = contentRef.current;
    if (content) return hideOthers(content);
  }, []);

  return (
    <PortalWrapper>
      <ScrollLockWrapper>
        <FocusScope
          // clicking outside may raise a focusout event, which may get trapped.
          // in cases where outside pointer events are permitted, we stop trapping.
          // we also make sure we're not trapping once it's been closed
          // (closed !== unmounted when animating out)
          trapped={isPermittedPointerDownOutsideEvent ? false : trapFocus && context.open}
          onMountAutoFocus={onOpenAutoFocus}
          onUnmountAutoFocus={(event) => {
            // skip autofocus on close if clicking outside is permitted and it happened
            if (isPermittedPointerDownOutsideEvent) {
              event.preventDefault();
            } else {
              onCloseAutoFocus?.(event);
            }
          }}
        >
          {(focusScopeProps) => (
            <DismissableLayer
              disableOutsidePointerEvents={disableOutsidePointerEvents}
              onEscapeKeyDown={onEscapeKeyDown}
              onPointerDownOutside={composeEventHandlers(
                onPointerDownOutside,
                (event) => {
                  const wasTrigger = context.triggerRef.current?.contains(
                    event.target as HTMLElement
                  );

                  const isLeftClick = (event as MouseEvent).button === 0 && event.ctrlKey === false;
                  const isPermitted = !disableOutsidePointerEvents && isLeftClick;
                  setIsPermittedPointerDownOutsideEvent(isPermitted);

                  // prevent dismissing when clicking the trigger
                  // as it's already setup to close, otherwise it would close and immediately open.
                  if (wasTrigger) {
                    event.preventDefault();
                  }

                  if (event.defaultPrevented) {
                    // reset this because the event was prevented
                    setIsPermittedPointerDownOutsideEvent(false);
                  }
                },
                { checkForDefaultPrevented: false }
              )}
              onFocusOutside={composeEventHandlers(
                onFocusOutside,
                (event) => {
                  // When focus is trapped, a focusout event may still happen.
                  // We make sure we don't trigger our `onDismiss` in such case.
                  if (trapFocus) event.preventDefault();
                },
                { checkForDefaultPrevented: false }
              )}
              onInteractOutside={onInteractOutside}
              onDismiss={() => context.onOpenChange(false)}
            >
              {(dismissableLayerProps) => (
                <PopperPrimitive.Root
                  role="dialog"
                  aria-modal
                  id={context.contentId}
                  {...contentProps}
                  ref={composeRefs(forwardedRef, contentRef, focusScopeProps.ref)}
                  anchorRef={anchorRef || context.triggerRef}
                  style={{
                    ...dismissableLayerProps.style,
                    ...contentProps.style,
                    // re-namespace exposed content custom property
                    ['--radix-popover-content-transform-origin' as any]: 'var(--radix-popper-transform-origin)',
                  }}
                  onBlurCapture={composeEventHandlers(
                    contentProps.onBlurCapture,
                    dismissableLayerProps.onBlurCapture,
                    { checkForDefaultPrevented: false }
                  )}
                  onFocusCapture={composeEventHandlers(
                    contentProps.onFocusCapture,
                    dismissableLayerProps.onFocusCapture,
                    { checkForDefaultPrevented: false }
                  )}
                  onMouseDownCapture={composeEventHandlers(
                    contentProps.onMouseDownCapture,
                    dismissableLayerProps.onMouseDownCapture,
                    { checkForDefaultPrevented: false }
                  )}
                  onTouchStartCapture={composeEventHandlers(
                    contentProps.onTouchStartCapture,
                    dismissableLayerProps.onTouchStartCapture,
                    { checkForDefaultPrevented: false }
                  )}
                />
              )}
            </DismissableLayer>
          )}
        </FocusScope>
      </ScrollLockWrapper>
    </PortalWrapper>
  );
}) as PopoverContentImplPrimitive;

PopoverContent.displayName = CONTENT_NAME;

/* -------------------------------------------------------------------------------------------------
 * PopoverClose
 * -----------------------------------------------------------------------------------------------*/

const CLOSE_NAME = 'PopoverClose';
const CLOSE_DEFAULT_TAG = 'button';

type PopoverCloseOwnProps = Polymorphic.OwnProps<typeof Primitive>;
type PopoverClosePrimitive = Polymorphic.ForwardRefComponent<
  typeof CLOSE_DEFAULT_TAG,
  PopoverCloseOwnProps
>;

const PopoverClose = React.forwardRef((props, forwardedRef) => {
  const { as = CLOSE_DEFAULT_TAG, ...closeProps } = props;
  const context = usePopoverContext(CLOSE_NAME);
  return (
    <Primitive
      type="button"
      {...closeProps}
      as={as}
      ref={forwardedRef}
      onClick={composeEventHandlers(props.onClick, () => context.onOpenChange(false))}
    />
  );
}) as PopoverClosePrimitive;

PopoverClose.displayName = CLOSE_NAME;

/* ---------------------------------------------------------------------------------------------- */

const PopoverArrow = extendPrimitive(PopperPrimitive.Arrow, { displayName: 'PopoverArrow' });

/* -----------------------------------------------------------------------------------------------*/

const Root = Popover;
const Trigger = PopoverTrigger;
const Content = PopoverContent;
const Close = PopoverClose;
const Arrow = PopoverArrow;

export {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverClose,
  PopoverArrow,
  //
  Root,
  Trigger,
  Content,
  Close,
  Arrow,
};
