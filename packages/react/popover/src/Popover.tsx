import * as React from 'react';
import { getSelector } from '@radix-ui/utils';
import {
  createContext,
  useComposedRefs,
  composeEventHandlers,
  useControlledState,
  useId,
  composeRefs,
  extendComponent,
} from '@radix-ui/react-utils';
import * as PopperPrimitive from '@radix-ui/react-popper';
import { DismissableLayer } from '@radix-ui/react-dismissable-layer';
import { FocusScope } from '@radix-ui/react-focus-scope';
import { Portal } from '@radix-ui/react-portal';
import { useFocusGuards } from '@radix-ui/react-focus-guards';
import { Presence } from '@radix-ui/react-presence';
import { Primitive } from '@radix-ui/react-primitive';
import { RemoveScroll } from 'react-remove-scroll';
import { hideOthers } from 'aria-hidden';

import type * as Polymorphic from '@radix-ui/react-polymorphic';
import type { Merge } from '@radix-ui/utils';

type DismissableLayerProps = React.ComponentProps<typeof DismissableLayer>;
type FocusScopeProps = React.ComponentProps<typeof FocusScope>;

/* -------------------------------------------------------------------------------------------------
 * Root level context
 * -----------------------------------------------------------------------------------------------*/

type PopoverContextValue = {
  triggerRef: React.RefObject<HTMLButtonElement>;
  id: string;
  open: boolean;
  setOpen: (open: boolean | ((prevOpen?: boolean) => boolean)) => void;
};

const [PopoverContext, usePopoverContext] = createContext<PopoverContextValue>(
  'PopoverContext',
  'Popover'
);

/* -------------------------------------------------------------------------------------------------
 * Popover
 * -----------------------------------------------------------------------------------------------*/

const POPOVER_NAME = 'Popover';

type PopoverOwnProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

const Popover: React.FC<PopoverOwnProps> = (props) => {
  const { children, open: openProp, defaultOpen, onOpenChange } = props;
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const id = `popover-${useId()}`;
  const [open = false, setOpen] = useControlledState({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  });
  const context = React.useMemo(() => ({ triggerRef, id, open, setOpen }), [id, open, setOpen]);

  return <PopoverContext.Provider value={context}>{children}</PopoverContext.Provider>;
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
  const { as = TRIGGER_DEFAULT_TAG, selector = getSelector(TRIGGER_NAME), ...triggerProps } = props;
  const context = usePopoverContext(TRIGGER_NAME);
  const composedTriggerRef = useComposedRefs(forwardedRef, context.triggerRef);
  return (
    <Primitive
      type="button"
      aria-haspopup="dialog"
      aria-expanded={context.open}
      aria-controls={context.id}
      {...triggerProps}
      as={as}
      selector={selector}
      ref={composedTriggerRef}
      onClick={composeEventHandlers(props.onClick, () => context.setOpen((prevOpen) => !prevOpen))}
    />
  );
}) as PopoverTriggerPrimitive;

PopoverTrigger.displayName = TRIGGER_NAME;

/* -------------------------------------------------------------------------------------------------
 * PopoverContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = 'PopoverContent';

type PopoverContentOwnProps = Merge<
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
        {...contentProps}
        ref={forwardedRef}
        data-state={context.open ? 'open' : 'closed'}
      />
    </Presence>
  );
}) as PopoverContentPrimitive;

type PopperPrimitiveOwnProps = Polymorphic.OwnProps<typeof PopperPrimitive.Root>;
type PopoverContentImplOwnProps = Merge<
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
    selector = getSelector(CONTENT_NAME),
    children,
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
          trapped={isPermittedPointerDownOutsideEvent ? false : trapFocus}
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
              onDismiss={() => context.setOpen(false)}
            >
              {(dismissableLayerProps) => (
                <PopperPrimitive.Root
                  role="dialog"
                  aria-modal
                  {...contentProps}
                  selector={selector}
                  ref={composeRefs(
                    forwardedRef,
                    contentRef,
                    focusScopeProps.ref,
                    dismissableLayerProps.ref
                  )}
                  id={context.id}
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
                >
                  {children}
                </PopperPrimitive.Root>
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
  const { as = CLOSE_DEFAULT_TAG, selector = getSelector(CLOSE_NAME), ...closeProps } = props;
  const context = usePopoverContext(CLOSE_NAME);
  return (
    <Primitive
      type="button"
      {...closeProps}
      as={as}
      selector={selector}
      ref={forwardedRef}
      onClick={composeEventHandlers(props.onClick, () => context.setOpen(false))}
    />
  );
}) as PopoverClosePrimitive;

PopoverClose.displayName = CLOSE_NAME;

/* ---------------------------------------------------------------------------------------------- */

const PopoverArrow = extendComponent(PopperPrimitive.Arrow, 'PopoverArrow');

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
