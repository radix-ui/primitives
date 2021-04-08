import * as React from 'react';
import { composeEventHandlers } from '@radix-ui/primitive';
import { useComposedRefs, composeRefs } from '@radix-ui/react-compose-refs';
import { createContext } from '@radix-ui/react-context';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { DismissableLayer } from '@radix-ui/react-dismissable-layer';
import { FocusScope } from '@radix-ui/react-focus-scope';
import { Portal } from '@radix-ui/react-portal';
import { Presence } from '@radix-ui/react-presence';
import { Primitive } from '@radix-ui/react-primitive';
import { useFocusGuards } from '@radix-ui/react-focus-guards';
import { useId } from '@radix-ui/react-id';
import { RemoveScroll } from 'react-remove-scroll';
import { hideOthers } from 'aria-hidden';

import type * as Polymorphic from '@radix-ui/react-polymorphic';

type DismissableLayerProps = React.ComponentProps<typeof DismissableLayer>;
type FocusScopeProps = React.ComponentProps<typeof FocusScope>;

/* -------------------------------------------------------------------------------------------------
 * Dialog
 * -----------------------------------------------------------------------------------------------*/

const DIALOG_NAME = 'Dialog';

type DialogContextValue = {
  triggerRef: React.RefObject<HTMLButtonElement>;
  contentId: string;
  open: boolean;
  onOpenChange(open: boolean): void;
};

const [DialogProvider, useDialogContext] = createContext<DialogContextValue>(DIALOG_NAME);

type DialogOwnProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?(open: boolean): void;
};

const Dialog: React.FC<DialogOwnProps> = (props) => {
  const { children, open: openProp, defaultOpen, onOpenChange } = props;
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const [open = false, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  });

  return (
    <DialogProvider triggerRef={triggerRef} contentId={useId()} open={open} onOpenChange={setOpen}>
      {children}
    </DialogProvider>
  );
};

Dialog.displayName = DIALOG_NAME;

/* -------------------------------------------------------------------------------------------------
 * DialogTrigger
 * -----------------------------------------------------------------------------------------------*/

const TRIGGER_NAME = 'DialogTrigger';
const TRIGGER_DEFAULT_TAG = 'button';

type DialogTriggerOwnProps = Polymorphic.OwnProps<typeof Primitive>;
type DialogTriggerPrimitive = Polymorphic.ForwardRefComponent<
  typeof TRIGGER_DEFAULT_TAG,
  DialogTriggerOwnProps
>;

const DialogTrigger = React.forwardRef((props, forwardedRef) => {
  const { as = TRIGGER_DEFAULT_TAG, ...triggerProps } = props;
  const context = useDialogContext(TRIGGER_NAME);
  const composedTriggerRef = useComposedRefs(forwardedRef, context.triggerRef);
  return (
    <Primitive
      type="button"
      aria-haspopup="dialog"
      aria-expanded={context.open}
      aria-controls={context.contentId}
      data-state={getState(context.open)}
      {...triggerProps}
      as={as}
      ref={composedTriggerRef}
      onClick={composeEventHandlers(props.onClick, () => context.onOpenChange(true))}
    />
  );
}) as DialogTriggerPrimitive;

DialogTrigger.displayName = TRIGGER_NAME;

/* -------------------------------------------------------------------------------------------------
 * DialogOverlay
 * -----------------------------------------------------------------------------------------------*/

const OVERLAY_NAME = 'DialogOverlay';

type DialogOverlayOwnProps = Polymorphic.Merge<
  Polymorphic.OwnProps<typeof DialogOverlayImpl>,
  {
    /**
     * Used to force mounting when more control is needed. Useful when
     * controlling animation with React animation libraries.
     */
    forceMount?: true;
  }
>;

type DialogOverlayPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof DialogOverlayImpl>,
  DialogOverlayOwnProps
>;

const DialogOverlay = React.forwardRef((props, forwardedRef) => {
  const { forceMount, ...overlayProps } = props;
  const context = useDialogContext(OVERLAY_NAME);
  return (
    <Presence present={forceMount || context.open}>
      <DialogOverlayImpl data-state={getState(context.open)} {...overlayProps} ref={forwardedRef} />
    </Presence>
  );
}) as DialogOverlayPrimitive;

type DialogOverlayImplOwnProps = Polymorphic.OwnProps<typeof Primitive>;
type DialogOverlayImplPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof Primitive>,
  DialogOverlayImplOwnProps
>;

const DialogOverlayImpl = React.forwardRef((props, forwardedRef) => {
  return (
    <Portal>
      <Primitive {...props} ref={forwardedRef} />
    </Portal>
  );
}) as DialogOverlayImplPrimitive;

DialogOverlay.displayName = OVERLAY_NAME;

/* -------------------------------------------------------------------------------------------------
 * DialogContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = 'DialogContent';

type DialogContentOwnProps = Polymorphic.Merge<
  Polymorphic.OwnProps<typeof DialogContentImpl>,
  {
    /**
     * Used to force mounting when more control is needed. Useful when
     * controlling animation with React animation libraries.
     */
    forceMount?: true;
  }
>;

type DialogContentPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof DialogContentImpl>,
  DialogContentOwnProps
>;

const DialogContent = React.forwardRef((props, forwardedRef) => {
  const { forceMount, ...contentProps } = props;
  const context = useDialogContext(CONTENT_NAME);
  return (
    <Presence present={forceMount || context.open}>
      <DialogContentImpl data-state={getState(context.open)} {...contentProps} ref={forwardedRef} />
    </Presence>
  );
}) as DialogContentPrimitive;

type DialogContentImplOwnProps = Polymorphic.Merge<
  Polymorphic.OwnProps<typeof Primitive>,
  {
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
     * Event handler called when the escape key is down.
     * Can be prevented.
     */
    onEscapeKeyDown?: DismissableLayerProps['onEscapeKeyDown'];

    /**
     * Event handler called when the a pointer event happens outside of the `Dialog`.
     * Can be prevented.
     */
    onPointerDownOutside?: DismissableLayerProps['onPointerDownOutside'];
  }
>;

type DialogContentImplPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof Primitive>,
  DialogContentImplOwnProps
>;

const DialogContentImpl = React.forwardRef((props, forwardedRef) => {
  const {
    onOpenAutoFocus,
    onCloseAutoFocus,
    onEscapeKeyDown,
    onPointerDownOutside,
    ...contentProps
  } = props;
  const context = useDialogContext(CONTENT_NAME);

  // Make sure the whole tree has focus guards as our `Dialog` will be
  // the last element in the DOM (beacuse of the `Portal`)
  useFocusGuards();

  // Hide everything from ARIA except the content
  const contentRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const content = contentRef.current;
    if (content) return hideOthers(content);
  }, []);

  return (
    <Portal>
      <RemoveScroll>
        <FocusScope
          // we make sure we're not trapping once it's been closed
          // (closed !== unmounted when animating out)
          trapped={context.open}
          onMountAutoFocus={onOpenAutoFocus}
          onUnmountAutoFocus={onCloseAutoFocus}
        >
          {(focusScopeProps) => (
            <DismissableLayer
              disableOutsidePointerEvents
              onEscapeKeyDown={onEscapeKeyDown}
              onPointerDownOutside={composeEventHandlers(onPointerDownOutside, (event) => {
                // If the pointer down outside event was a right-click, we shouldn't close
                // because it is effectively as if we right-clicked the `Overlay`.
                const isRightClick =
                  (event as MouseEvent).button === 2 ||
                  ((event as MouseEvent).button === 0 && event.ctrlKey === true);
                if (isRightClick) {
                  event.preventDefault();
                }
              })}
              // When focus is trapped, a focusout event may still happen.
              // We make sure we don't trigger our `onDismiss` in such case.
              onFocusOutside={(event) => event.preventDefault()}
              onDismiss={() => context.onOpenChange(false)}
            >
              {(dismissableLayerProps) => (
                <Primitive
                  role="dialog"
                  aria-modal
                  id={context.contentId}
                  {...contentProps}
                  ref={composeRefs(forwardedRef, contentRef, focusScopeProps.ref)}
                  style={{
                    ...dismissableLayerProps.style,
                    ...contentProps.style,
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
      </RemoveScroll>
    </Portal>
  );
}) as DialogContentImplPrimitive;

DialogContent.displayName = CONTENT_NAME;

/* -------------------------------------------------------------------------------------------------
 * DialogClose
 * -----------------------------------------------------------------------------------------------*/

const CLOSE_NAME = 'DialogClose';
const CLOSE_DEFAULT_TAG = 'button';

type DialogCloseOwnProps = Polymorphic.OwnProps<typeof Primitive>;
type DialogClosePrimitive = Polymorphic.ForwardRefComponent<
  typeof CLOSE_DEFAULT_TAG,
  DialogCloseOwnProps
>;

const DialogClose = React.forwardRef((props, forwardedRef) => {
  const { as = CLOSE_DEFAULT_TAG, ...closeProps } = props;
  const context = useDialogContext(CLOSE_NAME);
  return (
    <Primitive
      type="button"
      {...closeProps}
      as={as}
      ref={forwardedRef}
      onClick={composeEventHandlers(props.onClick, () => context.onOpenChange(false))}
    />
  );
}) as DialogClosePrimitive;

DialogClose.displayName = CLOSE_NAME;

/* -----------------------------------------------------------------------------------------------*/

function getState(open: boolean) {
  return open ? 'open' : 'closed';
}

const Root = Dialog;
const Trigger = DialogTrigger;
const Overlay = DialogOverlay;
const Content = DialogContent;
const Close = DialogClose;

export {
  Dialog,
  DialogTrigger,
  DialogOverlay,
  DialogContent,
  DialogClose,
  //
  Root,
  Trigger,
  Overlay,
  Content,
  Close,
};
