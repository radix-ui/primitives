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
import { Primitive, extendPrimitive } from '@radix-ui/react-primitive';
import { Slot } from '@radix-ui/react-slot';
import { useId } from '@radix-ui/react-id';
import { RemoveScroll } from 'react-remove-scroll';
import { hideOthers } from 'aria-hidden';

import type * as Polymorphic from '@radix-ui/react-polymorphic';

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

type PopoverAnchorOwnProps = Polymorphic.OwnProps<typeof PopperPrimitive.Anchor>;
type PopoverAnchorPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof PopperPrimitive.Anchor>,
  PopoverAnchorOwnProps
>;

const PopoverAnchor = React.forwardRef((props, forwardedRef) => {
  const context = usePopoverContext(ANCHOR_NAME);
  const { onCustomAnchorAdd, onCustomAnchorRemove } = context;

  React.useEffect(() => {
    onCustomAnchorAdd();
    return () => onCustomAnchorRemove();
  }, [onCustomAnchorAdd, onCustomAnchorRemove]);

  return <PopperPrimitive.Anchor {...props} ref={forwardedRef} />;
}) as PopoverAnchorPrimitive;

PopoverAnchor.displayName = ANCHOR_NAME;

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

  const trigger = (
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

  return context.hasCustomAnchor ? (
    trigger
  ) : (
    <PopperPrimitive.Anchor as={Slot}>{trigger}</PopperPrimitive.Anchor>
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

type FocusScopeOwnProps = Polymorphic.OwnProps<typeof FocusScope>;
type DismissableLayerOwnProps = Polymorphic.OwnProps<typeof DismissableLayer>;

type PopperPrimitiveOwnProps = Polymorphic.OwnProps<typeof PopperPrimitive.Content>;
type PopoverContentImplOwnProps = Polymorphic.Merge<
  PopperPrimitiveOwnProps,
  Omit<DismissableLayerOwnProps, 'onDismiss'> & {
    /**
     * Whether focus should be trapped within the `Popover`
     * (default: false)
     */
    trapFocus?: FocusScopeOwnProps['trapped'];

    /**
     * Event handler called when auto-focusing on open.
     * Can be prevented.
     */
    onOpenAutoFocus?: FocusScopeOwnProps['onMountAutoFocus'];

    /**
     * Event handler called when auto-focusing on close.
     * Can be prevented.
     */
    onCloseAutoFocus?: FocusScopeOwnProps['onUnmountAutoFocus'];

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
  }
>;

type PopoverContentImplPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof PopperPrimitive.Content>,
  PopoverContentImplOwnProps
>;

const PopoverContentImpl = React.forwardRef((props, forwardedRef) => {
  const {
    trapFocus = true,
    onOpenAutoFocus,
    onCloseAutoFocus,
    disableOutsidePointerEvents = false,
    onEscapeKeyDown,
    onPointerDownOutside,
    onFocusLeave,
    disableOutsideScroll = false,
    portalled = true,
    ...contentProps
  } = props;
  const context = usePopoverContext(CONTENT_NAME);
  const [skipCloseAutoFocus, setSkipCloseAutoFocus] = React.useState(false);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const composedRefs = useComposedRefs(forwardedRef, contentRef);

  const PortalWrapper = portalled ? Portal : React.Fragment;
  const ScrollLockWrapper = disableOutsideScroll ? RemoveScroll : React.Fragment;

  // Make sure the whole tree has focus guards as our `Popover` may be
  // the last element in the DOM (beacuse of the `Portal`)
  useFocusGuards();

  // Hide everything from ARIA except the content
  React.useEffect(() => {
    const content = contentRef.current;
    if (content) return hideOthers(content);
  }, []);

  return (
    <PortalWrapper>
      <ScrollLockWrapper>
        <FocusScope
          as={Slot}
          // we make sure we're not trapping once it's been closed
          // (closed !== unmounted when animating out)
          trapped={trapFocus && context.open}
          onMountAutoFocus={onOpenAutoFocus}
          onUnmountAutoFocus={(event) => {
            if (skipCloseAutoFocus) {
              event.preventDefault();
            } else {
              onCloseAutoFocus?.(event);
            }
          }}
        >
          <DismissableLayer
            as={Slot}
            disableOutsidePointerEvents={disableOutsidePointerEvents}
            onEscapeKeyDown={composeEventHandlers(onEscapeKeyDown, () => {
              setSkipCloseAutoFocus(false);
            })}
            onPointerDownOutside={composeEventHandlers(
              onPointerDownOutside,
              (event) => {
                const originalEvent = event.detail.originalEvent as MouseEvent;
                const isLeftClick = originalEvent.button === 0 && originalEvent.ctrlKey === false;
                setSkipCloseAutoFocus(!disableOutsidePointerEvents && isLeftClick);

                const targetIsTrigger = context.triggerRef.current?.contains(
                  event.target as HTMLElement
                );
                // prevent dismissing when clicking the trigger
                // as it's already setup to close, otherwise it would close and immediately open.
                if (targetIsTrigger) event.preventDefault();
              },
              { checkForDefaultPrevented: false }
            )}
            onFocusLeave={composeEventHandlers(
              onFocusLeave,
              (event) => {
                // When focus is trapped, the focus may still leave temporarily.
                // We make sure we don't trigger our `onDismiss` in such case.
                if (trapFocus) event.preventDefault();
              },
              { checkForDefaultPrevented: false }
            )}
            onDismiss={() => context.onOpenChange(false)}
          >
            <PopperPrimitive.Content
              role="dialog"
              aria-modal
              id={context.contentId}
              {...contentProps}
              ref={composedRefs}
              style={{
                ...contentProps.style,
                // re-namespace exposed content custom property
                ['--radix-popover-content-transform-origin' as any]: 'var(--radix-popper-transform-origin)',
              }}
            />
          </DismissableLayer>
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
  PopoverAnchorPrimitive,
  PopoverTriggerPrimitive,
  PopoverContentPrimitive,
  PopoverClosePrimitive,
};
