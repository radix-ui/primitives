import * as React from 'react';
import {
  createContext,
  useComposedRefs,
  composeEventHandlers,
  useControlledState,
  useId,
  composeRefs,
} from '@radix-ui/react-utils';
import { getSelector, makeId } from '@radix-ui/utils';
import { DismissableLayer } from '@radix-ui/react-dismissable-layer';
import { FocusScope } from '@radix-ui/react-focus-scope';
import { Portal } from '@radix-ui/react-portal';
import { Presence } from '@radix-ui/react-presence';
import { Primitive } from '@radix-ui/react-primitive';
import { useFocusGuards } from '@radix-ui/react-focus-guards';
import { RemoveScroll } from 'react-remove-scroll';
import { hideOthers } from 'aria-hidden';

import type * as Polymorphic from '@radix-ui/react-polymorphic';
import type { Merge } from '@radix-ui/utils';

type DismissableLayerProps = React.ComponentProps<typeof DismissableLayer>;
type FocusScopeProps = React.ComponentProps<typeof FocusScope>;

/* -------------------------------------------------------------------------------------------------
 * Root level context
 * -----------------------------------------------------------------------------------------------*/

type DialogContextValue = {
  triggerRef: React.RefObject<HTMLButtonElement>;
  id: string;
  open: boolean;
  setOpen: (open: boolean) => void;
};

const [DialogContext, useDialogContext] = createContext<DialogContextValue>(
  'DialogContext',
  'Dialog'
);

/* -------------------------------------------------------------------------------------------------
 * Dialog
 * -----------------------------------------------------------------------------------------------*/

const DIALOG_NAME = 'Dialog';

type DialogOwnProps = {
  id?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

const Dialog: React.FC<DialogOwnProps> = (props) => {
  const { children, id: idProp, open: openProp, defaultOpen, onOpenChange } = props;
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const generatedId = makeId('dialog', useId());
  const id = idProp || generatedId;
  const [open = false, setOpen] = useControlledState({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  });
  const context = React.useMemo(() => ({ triggerRef, id, open, setOpen }), [id, open, setOpen]);

  return <DialogContext.Provider value={context}>{children}</DialogContext.Provider>;
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
  const context = useDialogContext(TRIGGER_NAME);
  const composedTriggerRef = useComposedRefs(forwardedRef, context.triggerRef);
  return (
    <Primitive
      as={TRIGGER_DEFAULT_TAG}
      selector={getSelector(TRIGGER_NAME)}
      type="button"
      aria-haspopup="dialog"
      aria-expanded={context.open}
      aria-controls={context.id}
      {...props}
      ref={composedTriggerRef}
      onClick={composeEventHandlers(props.onClick, () => context.setOpen(true))}
    />
  );
}) as DialogTriggerPrimitive;

DialogTrigger.displayName = TRIGGER_NAME;

/* -------------------------------------------------------------------------------------------------
 * DialogOverlay
 * -----------------------------------------------------------------------------------------------*/

const OVERLAY_NAME = 'DialogOverlay';

type DialogOverlayOwnProps = Merge<
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
      <DialogOverlayImpl {...overlayProps} data-state={getState(context.open)} ref={forwardedRef} />
    </Presence>
  );
}) as DialogOverlayPrimitive;

type DialogOverlayImplOwnProps = Polymorphic.OwnProps<typeof Primitive>;
type DialogOverlayImplPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof Primitive>,
  DialogOverlayImplOwnProps
>;

const DialogOverlayImpl = React.forwardRef((props, forwardedRef) => (
  <Portal>
    <Primitive selector={getSelector(OVERLAY_NAME)} {...props} ref={forwardedRef} />
  </Portal>
)) as DialogOverlayImplPrimitive;

DialogOverlay.displayName = OVERLAY_NAME;

/* -------------------------------------------------------------------------------------------------
 * DialogContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = 'DialogContent';

type DialogContentOwnProps = Merge<
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
      <DialogContentImpl {...contentProps} data-state={getState(context.open)} ref={forwardedRef} />
    </Presence>
  );
}) as DialogContentPrimitive;

type DialogContentImplOwnProps = Merge<
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
          trapped
          onMountAutoFocus={onOpenAutoFocus}
          onUnmountAutoFocus={onCloseAutoFocus}
        >
          {(focusScopeProps) => (
            <DismissableLayer
              disableOutsidePointerEvents
              onEscapeKeyDown={onEscapeKeyDown}
              onPointerDownOutside={onPointerDownOutside}
              onDismiss={() => context.setOpen(false)}
            >
              {(dismissableLayerProps) => (
                <Primitive
                  selector={getSelector(CONTENT_NAME)}
                  role="dialog"
                  aria-modal
                  {...contentProps}
                  ref={composeRefs(
                    forwardedRef,
                    contentRef,
                    focusScopeProps.ref,
                    dismissableLayerProps.ref
                  )}
                  id={context.id}
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
  const context = useDialogContext(CLOSE_NAME);
  return (
    <Primitive
      as={CLOSE_DEFAULT_TAG}
      selector={getSelector(CLOSE_NAME)}
      type="button"
      {...props}
      ref={forwardedRef}
      onClick={composeEventHandlers(props.onClick, () => context.setOpen(false))}
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
