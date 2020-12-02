import * as React from 'react';
import {
  createContext,
  useComposedRefs,
  composeEventHandlers,
  useControlledState,
  useId,
  composeRefs,
} from '@interop-ui/react-utils';
import { forwardRefWithAs } from '@interop-ui/react-polymorphic';
import { getPartDataAttrObj, makeId } from '@interop-ui/utils';
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

type DialogOwnProps = {
  id?: string;
  isOpen?: boolean;
  defaultIsOpen?: boolean;
  onIsOpenChange?: (isOpen: boolean) => void;
};

const Dialog: React.FC<DialogOwnProps> = (props) => {
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

Dialog.displayName = DIALOG_NAME;

/* -------------------------------------------------------------------------------------------------
 * DialogTrigger
 * -----------------------------------------------------------------------------------------------*/

const TRIGGER_NAME = 'DialogTrigger';
const TRIGGER_DEFAULT_TAG = 'button';

const DialogTrigger = forwardRefWithAs<typeof TRIGGER_DEFAULT_TAG>((props, forwardedRef) => {
  const { as: Comp = TRIGGER_DEFAULT_TAG, onClick, ...triggerProps } = props;
  const context = useDialogContext(TRIGGER_NAME);
  const composedTriggerRef = useComposedRefs(forwardedRef, context.triggerRef);

  return (
    <Comp
      {...getPartDataAttrObj(TRIGGER_NAME)}
      ref={composedTriggerRef}
      type="button"
      aria-haspopup="dialog"
      aria-expanded={context.isOpen}
      aria-controls={context.id}
      onClick={composeEventHandlers(onClick, () => context.setIsOpen(true))}
      {...triggerProps}
    />
  );
});

DialogTrigger.displayName = TRIGGER_NAME;

/* -------------------------------------------------------------------------------------------------
 * DialogOverlay
 * -----------------------------------------------------------------------------------------------*/

const OVERLAY_NAME = 'DialogOverlay';
const OVERLAY_DEFAULT_TAG = 'div';

const DialogOverlay = forwardRefWithAs<typeof DialogOverlayImpl>((props, forwardedRef) => {
  const context = useDialogContext(OVERLAY_NAME);
  return context.isOpen ? <DialogOverlayImpl ref={forwardedRef} {...props} /> : null;
});

const DialogOverlayImpl = forwardRefWithAs<typeof OVERLAY_DEFAULT_TAG>((props, forwardedRef) => {
  const { as: Comp = OVERLAY_DEFAULT_TAG, ...overlayProps } = props;

  return (
    <Portal>
      <Comp {...getPartDataAttrObj(OVERLAY_NAME)} ref={forwardedRef} {...overlayProps} />
    </Portal>
  );
});

DialogOverlay.displayName = OVERLAY_NAME;

/* -------------------------------------------------------------------------------------------------
 * DialogContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = 'DialogContent';
const CONTENT_DEFAULT_TAG = 'div';

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

const DialogContent = forwardRefWithAs<typeof DialogContentImpl>((props, forwardedRef) => {
  const context = useDialogContext(CONTENT_NAME);
  return context.isOpen ? <DialogContentImpl ref={forwardedRef} {...props} /> : null;
});

const DialogContentImpl = forwardRefWithAs<typeof CONTENT_DEFAULT_TAG, DialogContentOwnProps>(
  (props, forwardedRef) => {
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
                    {...getPartDataAttrObj(CONTENT_NAME)}
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

DialogContent.displayName = CONTENT_NAME;

/* -------------------------------------------------------------------------------------------------
 * DialogClose
 * -----------------------------------------------------------------------------------------------*/

const CLOSE_NAME = 'DialogClose';
const CLOSE_DEFAULT_TAG = 'button';

const DialogClose = forwardRefWithAs<typeof CLOSE_DEFAULT_TAG>((props, forwardedRef) => {
  const { as: Comp = CLOSE_DEFAULT_TAG, onClick, ...closeProps } = props;
  const context = useDialogContext(CLOSE_NAME);

  return (
    <Comp
      {...getPartDataAttrObj(CLOSE_NAME)}
      ref={forwardedRef}
      type="button"
      {...closeProps}
      onClick={composeEventHandlers(onClick, () => context.setIsOpen(false))}
    />
  );
});

DialogClose.displayName = CLOSE_NAME;

/* -----------------------------------------------------------------------------------------------*/

export { Dialog, DialogTrigger, DialogOverlay, DialogContent, DialogClose };
