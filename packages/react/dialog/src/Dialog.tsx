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
import { Presence } from '@interop-ui/react-presence';
import { useFocusGuards } from '@interop-ui/react-focus-guards';
import { RemoveScroll } from 'react-remove-scroll';
import { hideOthers } from 'aria-hidden';

type DismissableLayerProps = React.ComponentProps<typeof DismissableLayer>;
type FocusScopeProps = React.ComponentProps<typeof FocusScope>;

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
  /**
   * A unique identifier for the dialog component. The `id` is used to generate DOM id attributes
   * for nested components. If no `id` prop is provided, a generated id will be used.
   */
  id?: string;
  /**
   * The controlled open state of the dialog. Must be used in conjunction with `onIsOpenChange`.
   */
  isOpen?: boolean;
  /**
   * The value of the item whose panel is expanded when the accordion is initially rendered. Use
   * `defaultValue` if you do not need to control the state of an accordion.
   */
  defaultIsOpen?: boolean;
  /**
   * The callback that fires when the state of the dialog changes.
   */
  onIsOpenChange?: (isOpen: boolean) => void;
};

/**
 * `Dialog` is the root component.
 */
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

/**
 * `DialogTrigger` is the button that triggers the `Dialog`. Use this when an uncontrolled
 * state is desired.
 */
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

type DialogOverlayOwnProps = {
  /**
   * Used to force mounting when more control is needed. Useful when controlling animation with
   * React animation libraries.
   */
  forceMount?: true;
};

/**
 * `DialogOverlay` is the overlay that covers the inert portion of the view when a dialog is open.
 */
const DialogOverlay = forwardRefWithAs<typeof DialogOverlayImpl, DialogOverlayOwnProps>(
  (props, forwardedRef) => {
    const { forceMount, ...overlayProps } = props;
    const context = useDialogContext(OVERLAY_NAME);
    return (
      <Presence present={forceMount || context.isOpen}>
        <DialogOverlayImpl
          {...overlayProps}
          data-state={getState(context.isOpen)}
          ref={forwardedRef}
        />
      </Presence>
    );
  }
);

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
   * Used to force mounting when more control is needed. Useful when controlling animation with
   * React animation libraries.
   */
  forceMount?: true;
};

/**
 * `DialogContent` is the component that contains content to be rendered in an open `Dialog`.
 */
const DialogContent = forwardRefWithAs<typeof DialogContentImpl, DialogContentOwnProps>(
  (props, forwardedRef) => {
    const { forceMount, ...contentProps } = props;
    const context = useDialogContext(CONTENT_NAME);
    return (
      <Presence present={forceMount || context.isOpen}>
        <DialogContentImpl
          {...contentProps}
          data-state={getState(context.isOpen)}
          ref={forwardedRef}
        />
      </Presence>
    );
  }
);

type DialogContentImplOwnProps = {
  /**
   * Event handler called when auto-focusing on open. It can be prevented by calling
   * `event.preventDefault`.
   */
  onOpenAutoFocus?: FocusScopeProps['onMountAutoFocus'];
  /**
   * Event handler called when auto-focusing on close. It can be prevented by calling
   * `event.preventDefault`.
   */
  onCloseAutoFocus?: FocusScopeProps['onUnmountAutoFocus'];
  /**
   * Event handler called when the escape key is down. It can be prevented by calling
   * `event.preventDefault`.
   */
  onEscapeKeyDown?: DismissableLayerProps['onEscapeKeyDown'];
  /**
   * Event handler called when the a pointer event happens outside of the `Dialog`. It can be
   * prevented by calling `event.preventDefault`.
   */
  onPointerDownOutside?: DismissableLayerProps['onPointerDownOutside'];
};

const DialogContentImpl = forwardRefWithAs<typeof CONTENT_DEFAULT_TAG, DialogContentImplOwnProps>(
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

/**
 * `DialogClose` is the button that closes an open `Dialog`. Use this when an uncontrolled state is
 * desired.
 */
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
  Root,
  Trigger,
  Overlay,
  Content,
  Close,
};
