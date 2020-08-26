import * as React from 'react';
import { Portal } from '@interop-ui/react-portal';
import { Lock, useLockContext } from '@interop-ui/react-lock';
import { Overlay, styles as overlayStyles } from '@interop-ui/react-overlay';
import { cssReset } from '@interop-ui/utils';
import { RemoveScroll } from 'react-remove-scroll';
import {
  createStyleObj,
  forwardRef,
  useCallbackRef,
  useComposedRefs,
} from '@interop-ui/react-utils';
import { useDebugContext } from '@interop-ui/react-debug-context';

/* -------------------------------------------------------------------------------------------------
 * Dialog
 * -----------------------------------------------------------------------------------------------*/
const DIALOG_NAME = 'Dialog';

type LockProps = React.ComponentProps<typeof Lock>;
type DialogDOMProps = React.ComponentPropsWithoutRef<typeof CONTENT_DEFAULT_TAG>;
type DialogOwnProps = {
  /** A function called when the Dialog is closed from the inside (escape / outslide click) */
  onClose?: LockProps['onDeactivate'];

  /**
   * A ref to an element to focus on inside the Dialog after it is opened.
   * (default: first focusable element inside the Dialog)
   * (fallback: first focusable element inside the Dialog, then the Dialog's content container)
   */
  refToFocusOnOpen?: LockProps['refToFocusOnActivation'];

  /**
   * A ref to an element to focus on outside the Dialog after it is closed.
   * (default: last focused element before the Dialog was opened)
   * (fallback: none)
   */
  refToFocusOnClose?: LockProps['refToFocusOnDeactivation'];

  /**
   * Whether pressing the `Escape` key should close the Dialog
   * (default: `true`)
   */
  shouldCloseOnEscape?: LockProps['shouldDeactivateOnEscape'];

  /**
   * Whether clicking outside the Dialog should close it
   * (default: `true`)
   */
  shouldCloseOnOutsideClick?: LockProps['shouldDeactivateOnOutsideClick'];
};
type DialogProps = DialogDOMProps & DialogOwnProps;

type DialogContextValue = DialogOwnProps & { onClose: NonNullable<DialogProps['onClose']> };
const DialogContext = React.createContext<DialogContextValue>(null as any);

const Dialog: React.FC<DialogProps> & DialogStaticProps = (props) => {
  const {
    onClose: onCloseProp = () => {},
    refToFocusOnOpen,
    refToFocusOnClose,
    shouldCloseOnEscape,
    shouldCloseOnOutsideClick,
    children,
  } = props;

  const onClose: () => void = useCallbackRef(onCloseProp);
  const context = React.useMemo(
    () => ({
      onClose,
      refToFocusOnOpen,
      refToFocusOnClose,
      shouldCloseOnEscape,
      shouldCloseOnOutsideClick,
    }),
    [onClose, refToFocusOnOpen, refToFocusOnClose, shouldCloseOnEscape, shouldCloseOnOutsideClick]
  );

  return (
    <Portal>
      <RemoveScroll>
        <DialogContext.Provider value={context}>{children}</DialogContext.Provider>
      </RemoveScroll>
    </Portal>
  );
};

/* -------------------------------------------------------------------------------------------------
 * DialogOverlay
 * -----------------------------------------------------------------------------------------------*/

const OVERLAY_NAME = 'Dialog.Overlay';

type DialogOverlayDOMProps = React.ComponentPropsWithoutRef<typeof Overlay>;
type DialogOverlayOwnProps = {};
type DialogOverlayProps = DialogOverlayDOMProps & DialogOverlayOwnProps;

const DialogOverlay = forwardRef<typeof Overlay, DialogOverlayProps>(function DialogOverlay(
  props,
  forwardedRef
) {
  const { children, style, ...overlayProps } = props;
  const debugContext = useDebugContext();
  return (
    <Overlay
      {...overlayProps}
      {...interopDataAttrObj('overlay')}
      ref={forwardedRef}
      style={{ pointerEvents: debugContext.disableLock ? 'none' : undefined, ...style }}
    >
      {children}
    </Overlay>
  );
});

/* -------------------------------------------------------------------------------------------------
 * DialogLockContent
 * -----------------------------------------------------------------------------------------------*/

// This component is only necessary so that `DialogContent` can use the lock context
const DialogLockContent: React.FC<DialogContentProps> = (props) => {
  const debugContext = useDebugContext();
  const dialogContext = React.useContext(DialogContext);

  return (
    <Lock
      isActive={debugContext.disableLock ? false : true}
      onDeactivate={dialogContext.onClose}
      refToFocusOnActivation={dialogContext.refToFocusOnOpen}
      refToFocusOnDeactivation={dialogContext.refToFocusOnClose}
      shouldDeactivateOnEscape={dialogContext.shouldCloseOnEscape}
      shouldDeactivateOnOutsideClick={dialogContext.shouldCloseOnOutsideClick}
      shouldBlockOutsideClick
    >
      <DialogContent {...props} />
    </Lock>
  );
};

/* -------------------------------------------------------------------------------------------------
 * DialogContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = 'Dialog.Content';
const CONTENT_DEFAULT_TAG = 'div';

type DialogContentDOMProps = React.ComponentPropsWithoutRef<typeof CONTENT_DEFAULT_TAG>;
type DialogContentOwnProps = {};
type DialogContentProps = DialogContentDOMProps & DialogContentOwnProps;

const DialogContent = forwardRef<typeof CONTENT_DEFAULT_TAG, DialogContentProps>(
  function DialogContent(props, forwardedRef) {
    const { as: Comp = CONTENT_DEFAULT_TAG, children, ...contentProps } = props;
    const { lockContainerRef } = useLockContext();

    return (
      <Comp
        {...interopDataAttrObj('content')}
        ref={useComposedRefs(forwardedRef, lockContainerRef)}
        role="dialog"
        aria-modal
        {...contentProps}
      >
        {children}
      </Comp>
    );
  }
);

Dialog.Overlay = DialogOverlay;
Dialog.Content = DialogLockContent;

Dialog.displayName = DIALOG_NAME;
Dialog.Overlay.displayName = OVERLAY_NAME;
Dialog.Content.displayName = CONTENT_NAME;

interface DialogStaticProps {
  Overlay: typeof DialogOverlay;
  Content: typeof DialogLockContent;
}

const [styles, interopDataAttrObj] = createStyleObj(DIALOG_NAME, {
  root: {},
  overlay: overlayStyles.root,
  content: {
    ...cssReset(CONTENT_DEFAULT_TAG),
    pointerEvents: 'auto',
  },
});

export { Dialog, styles };
export type { DialogProps, DialogContentProps };
