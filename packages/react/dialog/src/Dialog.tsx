import * as React from 'react';
import {
  forwardRef,
  createStyleObj,
  createContext,
  useComposedRefs,
  composeEventHandlers,
  useControlledState,
  useId,
  composeRefs,
} from '@interop-ui/react-utils';
import { cssReset, makeId } from '@interop-ui/utils';
import { useDebugContext } from '@interop-ui/react-debug-context';
import { DismissableLayer } from '@interop-ui/react-dismissable-layer';
import { FocusScope } from '@interop-ui/react-focus-scope';
import { Portal } from '@interop-ui/react-portal';
import { useFocusGuards } from '@interop-ui/react-focus-guards';
import { RemoveScroll } from 'react-remove-scroll';
import { hideOthers } from 'aria-hidden';

import type { DismissableLayerProps } from '@interop-ui/react-dismissable-layer';
import type { FocusScopeProps } from '@interop-ui/react-focus-scope';

/* -------------------------------------------------------------------------------------------------
 * Root level context
 * -----------------------------------------------------------------------------------------------*/

type DialogContextValue = {
  triggerRef: React.RefObject<HTMLButtonElement>;
  id: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

const [DialogContext, useDialogContext] = createContext<DialogContextValue>(
  'DialogContext',
  'Dialog'
);

/* -------------------------------------------------------------------------------------------------
 * Dialog
 * -----------------------------------------------------------------------------------------------*/

const DIALOG_NAME = 'Dialog';

interface DialogStaticProps {
  Trigger: typeof DialogTrigger;
  Overlay: typeof DialogOverlay;
  Content: typeof DialogContent;
  Close: typeof DialogClose;
}

type DialogProps = {
  id?: string;
  isOpen?: boolean;
  defaultIsOpen?: boolean;
  onIsOpenChange?: (isOpen: boolean) => void;
};

const Dialog: React.FC<DialogProps> & DialogStaticProps = function Dialog(props) {
  const { children, id: idProp, isOpen: isOpenProp, defaultIsOpen, onIsOpenChange } = props;
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const generatedId = makeId('dialog', useId());
  const id = idProp || generatedId;
  const [isOpen = false, setIsOpen] = useControlledState({
    prop: isOpenProp,
    defaultProp: defaultIsOpen,
    onChange: onIsOpenChange,
  });
  const context = React.useMemo(() => ({ triggerRef, id, isOpen, setIsOpen }), [
    id,
    isOpen,
    setIsOpen,
  ]);

  return <DialogContext.Provider value={context}>{children}</DialogContext.Provider>;
};

/* -------------------------------------------------------------------------------------------------
 * DialogTrigger
 * -----------------------------------------------------------------------------------------------*/

const TRIGGER_NAME = 'Dialog.Trigger';
const TRIGGER_DEFAULT_TAG = 'button';

type DialogTriggerDOMProps = React.ComponentPropsWithoutRef<typeof TRIGGER_DEFAULT_TAG>;
type DialogTriggerOwnProps = {};
type DialogTriggerProps = DialogTriggerOwnProps & DialogTriggerDOMProps;

const DialogTrigger = forwardRef<typeof TRIGGER_DEFAULT_TAG, DialogTriggerProps>(
  (props, forwardedRef) => {
    const { as: Comp = TRIGGER_DEFAULT_TAG, onClick, ...triggerProps } = props;
    const context = useDialogContext(TRIGGER_NAME);
    const composedTriggerRef = useComposedRefs(forwardedRef, context.triggerRef);

    return (
      <Comp
        {...interopDataAttrObj('trigger')}
        ref={composedTriggerRef}
        type={Comp === TRIGGER_DEFAULT_TAG ? 'button' : undefined}
        aria-haspopup="dialog"
        aria-expanded={context.isOpen}
        aria-controls={context.id}
        onClick={composeEventHandlers(onClick, () => context.setIsOpen(true))}
        {...triggerProps}
      />
    );
  }
);

/* -------------------------------------------------------------------------------------------------
 * DialogOverlay
 * -----------------------------------------------------------------------------------------------*/

const OVERLAY_NAME = 'Dialog.Overlay';
const OVERLAY_DEFAULT_TAG = 'div';

type DialogOverlayDOMProps = React.ComponentPropsWithoutRef<typeof OVERLAY_DEFAULT_TAG>;
type DialogOverlayOwnProps = {};
type DialogOverlayProps = DialogOverlayDOMProps & DialogOverlayOwnProps;

const DialogOverlay = forwardRef<typeof OVERLAY_DEFAULT_TAG, DialogOverlayProps>(
  function DialogOverlay(props, forwardedRef) {
    const context = useDialogContext(OVERLAY_NAME);
    return context.isOpen ? <DialogOverlayImpl ref={forwardedRef} {...props} /> : null;
  }
);

const DialogOverlayImpl = forwardRef<typeof OVERLAY_DEFAULT_TAG, DialogOverlayProps>(
  function DialogOverlayImpl(props, forwardedRef) {
    const { as: Comp = OVERLAY_DEFAULT_TAG, ...overlayProps } = props;

    return (
      <Portal>
        <Comp {...interopDataAttrObj('overlay')} ref={forwardedRef} {...overlayProps} />
      </Portal>
    );
  }
);

/* -------------------------------------------------------------------------------------------------
 * DialogContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = 'Dialog.Content';
const CONTENT_DEFAULT_TAG = 'div';

type DialogContentDOMProps = Omit<React.ComponentPropsWithoutRef<typeof CONTENT_DEFAULT_TAG>, 'id'>;
type DialogContentOwnProps = {
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
};
type DialogContentProps = DialogContentDOMProps & DialogContentOwnProps;

const DialogContent = forwardRef<typeof CONTENT_DEFAULT_TAG, DialogContentProps>(
  function DialogContent(props, forwardedRef) {
    const context = useDialogContext(CONTENT_NAME);
    return context.isOpen ? <DialogContentImpl ref={forwardedRef} {...props} /> : null;
  }
);

const DialogContentImpl = forwardRef<typeof CONTENT_DEFAULT_TAG, DialogContentProps>(
  function DialogContentImpl(props, forwardedRef) {
    const {
      as: Comp = CONTENT_DEFAULT_TAG,
      onOpenAutoFocus,
      onCloseAutoFocus,
      onEscapeKeyDown,
      onPointerDownOutside,
      ...contentProps
    } = props;
    const context = useDialogContext(CONTENT_NAME);
    const debugContext = useDebugContext();
    const ScrollLockWrapper = !debugContext.disableLock ? RemoveScroll : React.Fragment;

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
        <ScrollLockWrapper>
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
                onDismiss={() => context.setIsOpen(false)}
              >
                {(dismissableLayerProps) => (
                  <Comp
                    {...interopDataAttrObj('content')}
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
        </ScrollLockWrapper>
      </Portal>
    );
  }
);

/* -------------------------------------------------------------------------------------------------
 * DialogClose
 * -----------------------------------------------------------------------------------------------*/

const CLOSE_NAME = 'Dialog.Close';
const CLOSE_DEFAULT_TAG = 'button';

type DialogCloseDOMProps = React.ComponentPropsWithoutRef<typeof CLOSE_DEFAULT_TAG>;
type DialogCloseOwnProps = {};
type DialogCloseProps = DialogCloseOwnProps & DialogCloseDOMProps;

const DialogClose = forwardRef<typeof CLOSE_DEFAULT_TAG, DialogCloseProps>(
  (props, forwardedRef) => {
    const { as: Comp = CLOSE_DEFAULT_TAG, onClick, ...closeProps } = props;
    const context = useDialogContext(CLOSE_NAME);

    return (
      <Comp
        {...interopDataAttrObj('close')}
        ref={forwardedRef}
        type={Comp === CLOSE_DEFAULT_TAG ? 'button' : undefined}
        {...closeProps}
        onClick={composeEventHandlers(onClick, () => context.setIsOpen(false))}
      />
    );
  }
);

/* -----------------------------------------------------------------------------------------------*/

Dialog.Trigger = DialogTrigger;
Dialog.Overlay = DialogOverlay;
Dialog.Content = DialogContent;
Dialog.Close = DialogClose;

Dialog.displayName = DIALOG_NAME;
Dialog.Trigger.displayName = TRIGGER_NAME;
Dialog.Overlay.displayName = OVERLAY_NAME;
Dialog.Content.displayName = CONTENT_NAME;
Dialog.Close.displayName = CLOSE_NAME;

const [styles, interopDataAttrObj] = createStyleObj(DIALOG_NAME, {
  root: {},
  trigger: {
    ...cssReset(TRIGGER_DEFAULT_TAG),
  },
  overlay: {
    ...cssReset(OVERLAY_DEFAULT_TAG),
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    pointerEvents: 'none',
  },
  content: {
    ...cssReset(CONTENT_DEFAULT_TAG),
    position: 'fixed',
    top: 0,
    left: 0,
  },
  close: {
    ...cssReset(CLOSE_DEFAULT_TAG),
  },
});

export type {
  DialogProps,
  DialogTriggerProps,
  DialogOverlayProps,
  DialogContentProps,
  DialogCloseProps,
};
export { Dialog, styles };
