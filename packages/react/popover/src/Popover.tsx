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
  modal: boolean;
};

const [PopoverProvider, usePopoverContext] = createContext<PopoverContextValue>(POPOVER_NAME);

type PopoverOwnProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  modal?: boolean;
};

const Popover: React.FC<PopoverOwnProps> = (props) => {
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
      data-state={getState(context.open)}
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
  Polymorphic.OwnProps<typeof PopoverContentModal | typeof PopoverContentNonModal>,
  {
    /**
     * Used to force mounting when more control is needed. Useful when
     * controlling animation with React animation libraries.
     */
    forceMount?: true;
  }
>;

type PopoverContentPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof PopoverContentModal | typeof PopoverContentNonModal>,
  PopoverContentOwnProps
>;

const PopoverContent = React.forwardRef((props, forwardedRef) => {
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
}) as PopoverContentPrimitive;

PopoverContent.displayName = CONTENT_NAME;

type PopoverContentTypeOwnProps = Polymorphic.Merge<
  Omit<
    Polymorphic.OwnProps<typeof PopoverContentImpl>,
    'trapFocus' | 'disableOutsidePointerEvents'
  >,
  {
    /**
     * Whether the `Popover` should render in a `Portal`
     * (default: `true`)
     */
    portalled?: boolean;
  }
>;

type PopoverContentTypePrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof PopoverContentImpl>,
  PopoverContentTypeOwnProps
>;

const PopoverContentModal = React.forwardRef((props, forwardedRef) => {
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
}) as PopoverContentTypePrimitive;

const PopoverContentNonModal = React.forwardRef((props, forwardedRef) => {
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
}) as PopoverContentTypePrimitive;

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
  }
>;

type PopoverContentImplPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof PopperPrimitive.Content>,
  PopoverContentImplOwnProps
>;

const PopoverContentImpl = React.forwardRef((props, forwardedRef) => {
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
      as={Slot}
      loop
      trapped={trapFocus}
      onMountAutoFocus={onOpenAutoFocus}
      onUnmountAutoFocus={onCloseAutoFocus}
    >
      <DismissableLayer
        as={Slot}
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
            ['--radix-popover-content-transform-origin' as any]: 'var(--radix-popper-transform-origin)',
          }}
        />
      </DismissableLayer>
    </FocusScope>
  );
}) as PopoverContentImplPrimitive;

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
  PopoverAnchorPrimitive,
  PopoverTriggerPrimitive,
  PopoverContentPrimitive,
  PopoverClosePrimitive,
};
