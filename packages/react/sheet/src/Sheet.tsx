import * as React from 'react';
import { Portal } from '@interop-ui/react-portal';
import { Lock, useLockContext } from '@interop-ui/react-lock';
import { cssReset } from '@interop-ui/utils';
import { RemoveScroll } from 'react-remove-scroll';
import {
  createContext,
  createStyleObj,
  forwardRef,
  useCallbackRef,
  useComposedRefs,
} from '@interop-ui/react-utils';
import { useDebugContext } from '@interop-ui/react-debug-context';

import type { LockProps } from '@interop-ui/react-lock';

/* -------------------------------------------------------------------------------------------------
 * Root level context
 * -----------------------------------------------------------------------------------------------*/

const ROOT_NAME = 'Sheet.Root';

type SheetContextValue = {
  isOpen: SheetRootProps['isOpen'];
  onClose: NonNullable<SheetRootProps['onClose']>;
  refToFocusOnClose: SheetRootProps['refToFocusOnClose'];
  refToFocusOnOpen: SheetRootProps['refToFocusOnOpen'];
  shouldCloseOnEscape: SheetRootProps['shouldCloseOnEscape'];
  shouldCloseOnOutsideClick: SheetRootProps['shouldCloseOnOutsideClick'];
  side: NonNullable<SheetRootOwnProps['side']>;
};

const [SheetContext, useSheetContext] = createContext<SheetContextValue>('SheetContext', ROOT_NAME);

/* -------------------------------------------------------------------------------------------------
 * SheetRoot
 * -----------------------------------------------------------------------------------------------*/

type SheetRootOwnProps = {
  /** whether the Sheet is currently opened or not */
  isOpen: boolean;

  /** The side where the Sheet should open */
  side?: 'left' | 'right';

  /** A function called when the Sheet is closed from the inside (escape / outslide click) */
  onClose?: LockProps['onDeactivate'];

  /**
   * A ref to an element to focus on inside the Sheet after it is opened.
   * (default: first focusable element inside the Sheet)
   * (fallback: first focusable element inside the Sheet, then the Sheet's content container)
   */
  refToFocusOnOpen?: LockProps['refToFocusOnActivation'];

  /**
   * A ref to an element to focus on outside the Sheet after it is closed.
   * (default: last focused element before the Sheet was opened)
   * (fallback: none)
   */
  refToFocusOnClose?: LockProps['refToFocusOnDeactivation'];

  /**
   * Whether pressing the `Escape` key should close the Sheet
   * (default: `true`)
   */
  shouldCloseOnEscape?: LockProps['shouldDeactivateOnEscape'];

  /**
   * Whether clicking outside the Sheet should close it
   * (default: `true`)
   */
  shouldCloseOnOutsideClick?: LockProps['shouldDeactivateOnOutsideClick'];
};
type SheetRootProps = SheetRootOwnProps;

const SheetRoot: React.FC<SheetRootProps> = (props) => {
  const {
    children,
    isOpen,
    onClose: onCloseProp,
    side = 'left',
    refToFocusOnOpen,
    refToFocusOnClose,
    shouldCloseOnEscape = true,
    shouldCloseOnOutsideClick = true,
  } = props;

  const onClose: () => void = useCallbackRef(() => {
    onCloseProp && onCloseProp();
  });

  const ctx: SheetContextValue = React.useMemo(
    () => ({
      isOpen,
      onClose,
      refToFocusOnClose,
      refToFocusOnOpen,
      shouldCloseOnEscape,
      shouldCloseOnOutsideClick,
      side,
    }),
    [
      isOpen,
      onClose,
      refToFocusOnClose,
      refToFocusOnOpen,
      shouldCloseOnEscape,
      shouldCloseOnOutsideClick,
      side,
    ]
  );

  return (
    <SheetContext.Provider value={ctx}>
      <Portal {...interopDataAttrObj('root')}>{children}</Portal>
    </SheetContext.Provider>
  );
};

/* -------------------------------------------------------------------------------------------------
 * SheetOverlay
 * -----------------------------------------------------------------------------------------------*/

const OVERLAY_NAME = 'Sheet.Overlay';
const OVERLAY_DEFAULT_TAG = 'div';

type SheetOverlayDOMProps = React.ComponentPropsWithoutRef<typeof OVERLAY_DEFAULT_TAG>;
type SheetOverlayOwnProps = {};
type SheetOverlayProps = SheetOverlayDOMProps & SheetOverlayOwnProps;

const SheetOverlay = forwardRef<typeof OVERLAY_DEFAULT_TAG, SheetOverlayProps>(
  function SheetOverlay(props, forwardedRef) {
    const { as: Comp = OVERLAY_DEFAULT_TAG, style, ...sheetProps } = props;
    const debugContext = useDebugContext();
    return (
      <Comp
        {...interopDataAttrObj('overlay')}
        ref={forwardedRef}
        style={{
          pointerEvents: debugContext.disableLock ? 'none' : undefined,
          ...style,
        }}
        {...sheetProps}
      />
    );
  }
);

/* -------------------------------------------------------------------------------------------------
 * SheetInner
 * -----------------------------------------------------------------------------------------------*/

const INNER_NAME = 'Sheet.Inner';
const INNER_DEFAULT_TAG = 'div';

type SheetInnerDOMProps = React.ComponentPropsWithoutRef<typeof INNER_DEFAULT_TAG>;
type SheetInnerOwnProps = {};
type SheetInnerProps = SheetInnerDOMProps & SheetInnerOwnProps;

const SheetInner = forwardRef<typeof INNER_DEFAULT_TAG, SheetInnerProps>(function SheetInner(
  props,
  forwardedRef
) {
  const { as: Comp = INNER_DEFAULT_TAG, children, ...innerProps } = props;
  const debugContext = useDebugContext();
  const {
    onClose,
    refToFocusOnOpen,
    refToFocusOnClose,
    shouldCloseOnEscape,
    shouldCloseOnOutsideClick,
  } = useSheetContext(INNER_NAME);
  return (
    <Comp {...interopDataAttrObj('inner')} ref={forwardedRef} {...innerProps}>
      {debugContext.disableLock ? (
        children
      ) : (
        <RemoveScroll>
          <Lock
            onDeactivate={onClose}
            refToFocusOnActivation={refToFocusOnOpen}
            refToFocusOnDeactivation={refToFocusOnClose}
            shouldDeactivateOnEscape={shouldCloseOnEscape}
            shouldDeactivateOnOutsideClick={shouldCloseOnOutsideClick}
            shouldPreventOutsideClick
          >
            {children}
          </Lock>
        </RemoveScroll>
      )}
    </Comp>
  );
});

/* -------------------------------------------------------------------------------------------------
 * SheetContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = 'Sheet.Content';
const CONTENT_DEFAULT_TAG = 'div';

type SheetContentDOMProps = React.ComponentPropsWithoutRef<typeof CONTENT_DEFAULT_TAG>;
type SheetContentOwnProps = {};
type SheetContentProps = SheetContentDOMProps & SheetContentOwnProps;

const SheetContent = forwardRef<typeof CONTENT_DEFAULT_TAG, SheetContentProps>(
  function SheetContent(props, forwardedRef) {
    const { as: Comp = CONTENT_DEFAULT_TAG, children, style, ...contentProps } = props;
    const { side } = useSheetContext(CONTENT_NAME);
    const { lockContainerRef } = useLockContext();
    return (
      <Comp
        {...interopDataAttrObj('content')}
        ref={useComposedRefs(forwardedRef, lockContainerRef as React.RefObject<HTMLDivElement>)}
        role="dialog"
        aria-modal
        {...contentProps}
        style={{
          [side]: 0,
          ...style,
        }}
      >
        {children}
      </Comp>
    );
  }
);

/* -------------------------------------------------------------------------------------------------
 * Composed Sheet
 * -----------------------------------------------------------------------------------------------*/

const SHEET_NAME = 'Sheet';

type SheetDOMProps = React.ComponentPropsWithoutRef<typeof CONTENT_DEFAULT_TAG>;
type SheetOwnProps = SheetRootProps;
type SheetProps = SheetDOMProps & SheetOwnProps;

const Sheet = forwardRef<typeof CONTENT_DEFAULT_TAG, SheetProps, SheetStaticProps>(function Sheet(
  props,
  forwardedRef
) {
  const {
    isOpen,
    onClose,
    refToFocusOnOpen,
    refToFocusOnClose,
    shouldCloseOnEscape,
    shouldCloseOnOutsideClick,
    side,
    children,
    ...contentProps
  } = props;
  return (
    <SheetRoot
      isOpen={isOpen}
      onClose={onClose}
      refToFocusOnOpen={refToFocusOnOpen}
      refToFocusOnClose={refToFocusOnClose}
      shouldCloseOnEscape={shouldCloseOnEscape}
      shouldCloseOnOutsideClick={shouldCloseOnOutsideClick}
      side={side}
    >
      <SheetOverlay>
        <SheetInner>
          <SheetContent ref={forwardedRef} {...contentProps}>
            {children}
          </SheetContent>
        </SheetInner>
      </SheetOverlay>
    </SheetRoot>
  );
});

/* -----------------------------------------------------------------------------------------------*/

Sheet.Root = SheetRoot;
Sheet.Overlay = SheetOverlay;
Sheet.Inner = SheetInner;
Sheet.Content = SheetContent;

Sheet.displayName = SHEET_NAME;
Sheet.Root.displayName = ROOT_NAME;
Sheet.Overlay.displayName = OVERLAY_NAME;
Sheet.Inner.displayName = INNER_NAME;
Sheet.Content.displayName = CONTENT_NAME;

interface SheetStaticProps {
  Root: typeof SheetRoot;
  Overlay: typeof SheetOverlay;
  Inner: typeof SheetInner;
  Content: typeof SheetContent;
}

const [styles, interopDataAttrObj] = createStyleObj(SHEET_NAME, {
  root: {},
  overlay: {
    ...cssReset(OVERLAY_DEFAULT_TAG),
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  inner: {
    ...cssReset(INNER_DEFAULT_TAG),
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    pointerEvents: 'none',
  },
  content: {
    ...cssReset(CONTENT_DEFAULT_TAG),
    pointerEvents: 'auto',
    position: 'absolute',
    top: 0,
    bottom: 0,
  },
});

export { Sheet, styles };
export type { SheetProps, SheetRootProps, SheetOverlayProps, SheetContentProps, SheetInnerProps };
