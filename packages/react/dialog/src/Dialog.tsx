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
 * DialogContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = 'Dialog.Content';
const CONTENT_DEFAULT_TAG = 'div';

type DialogContentDOMProps = React.ComponentPropsWithoutRef<typeof CONTENT_DEFAULT_TAG>;
type DialogContentOwnProps = {};
type DialogContentProps = DialogContentDOMProps & DialogContentOwnProps;

const DialogContent = forwardRef<typeof CONTENT_DEFAULT_TAG, DialogContentProps>(
  function DialogContent(props, forwardedRef) {
    let { as: Comp = CONTENT_DEFAULT_TAG, children, ...contentProps } = props;
    let { lockContainerRef } = useLockContext();
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

/* -------------------------------------------------------------------------------------------------
 * Dialog
 * -----------------------------------------------------------------------------------------------*/
const DIALOG_NAME = 'Dialog';
const DIALOG_DEFAULT_TAG = 'div';

type DialogDOMProps = React.ComponentPropsWithoutRef<typeof CONTENT_DEFAULT_TAG>;
type DialogOwnProps = React.ComponentProps<typeof Overlay> & {
  /** whether the Dialog is currently opened or not */
  isOpen: boolean;

  /** A function called when the Dialog is closed from the inside (escape / outslide click) */
  onClose?(): void;

  /**
   * A ref to an element to focus on inside the Dialog after it is opened.
   * (default: first focusable element inside the Dialog)
   * (fallback: first focusable element inside the Dialog, then the Dialog's content container)
   */
  refToFocusOnOpen?: React.RefObject<HTMLElement | null | undefined>;

  /**
   * A ref to an element to focus on outside the Dialog after it is closed.
   * (default: last focused element before the Dialog was opened)
   * (fallback: none)
   */
  refToFocusOnClose?: React.RefObject<HTMLElement | null | undefined>;

  /**
   * Whether pressing the `Escape` key should close the Dialog
   * (default: `true`)
   */
  shouldCloseOnEscape?: boolean;

  /**
   * Whether clicking outside the Dialog should close it
   * (default: `true`)
   */
  shouldCloseOnOutsideClick?: boolean | ((event: MouseEvent | TouchEvent) => boolean);
};
type DialogProps = DialogDOMProps & DialogOwnProps;

const Dialog = forwardRef<typeof DIALOG_DEFAULT_TAG, DialogProps, DialogStaticProps>(
  function Dialog(props, forwardedRef) {
    let debugContext = useDebugContext();
    let {
      isOpen,
      onClose: onCloseProp,
      refToFocusOnOpen,
      refToFocusOnClose,
      shouldCloseOnEscape,
      shouldCloseOnOutsideClick,
      children,
      ...rootProps
    } = props;

    const onClose: () => void = useCallbackRef(() => {
      onCloseProp && onCloseProp();
    });

    return (
      <Portal>
        <Overlay
          {...rootProps}
          {...interopDataAttrObj('root')}
          ref={forwardedRef}
          style={{ pointerEvents: debugContext.disableLock ? 'none' : undefined, ...props.style }}
        >
          <RemoveScroll>
            <Lock
              isActive={debugContext.disableLock ? false : isOpen}
              onDeactivate={onClose}
              refToFocusOnActivation={refToFocusOnOpen}
              refToFocusOnDeactivation={refToFocusOnClose}
              shouldDeactivateOnEscape={shouldCloseOnEscape}
              shouldDeactivateOnOutsideClick={shouldCloseOnOutsideClick}
              shouldBlockOutsideClick
            >
              {children}
            </Lock>
          </RemoveScroll>
        </Overlay>
      </Portal>
    );
  }
);

Dialog.Content = DialogContent;

Dialog.displayName = DIALOG_NAME;
Dialog.Content.displayName = CONTENT_NAME;

interface DialogStaticProps {
  Content: typeof DialogContent;
}

const [styles, interopDataAttrObj] = createStyleObj(DIALOG_NAME, {
  root: {
    ...overlayStyles.root,
    pointerEvents: 'none',
  },
  content: {
    ...cssReset(CONTENT_DEFAULT_TAG),
    pointerEvents: 'auto',
  },
});

export { Dialog, styles };
export type { DialogProps, DialogContentProps };
