import * as React from 'react';
import { forwardRef, createStyleObj } from '@interop-ui/react-utils';
import { cssReset } from '@interop-ui/utils';
import {
  Popper,
  styles as popperStyles,
  PopperProps,
  PopperArrowProps,
} from '@interop-ui/react-popper';
import { useDebugContext } from '@interop-ui/react-debug-context';
import { Lock, LockProps } from '@interop-ui/react-lock';
import { RemoveScroll } from 'react-remove-scroll';
import { Portal } from '@interop-ui/react-portal';

/* -------------------------------------------------------------------------------------------------
 * Popover
 * -----------------------------------------------------------------------------------------------*/

const POPOVER_NAME = 'Popover';
const POPOVER_DEFAULT_TAG = 'div';

type PopoverDOMProps = React.ComponentPropsWithoutRef<typeof POPOVER_DEFAULT_TAG>;
type PopoverOwnProps = {
  /** A function called when the Popover is closed from the inside (escape / outslide click) */
  onClose?: LockProps['onDeactivate'];

  /**
   * A ref to an element to focus on inside the Popover after it is opened.
   * (default: first focusable element inside the Popover)
   * (fallback: first focusable element inside the Popover, then the Popover's content container)
   */
  refToFocusOnOpen?: LockProps['refToFocusOnActivation'];

  /**
   * A ref to an element to focus on outside the Popover after it is closed.
   * (default: last focused element before the Popover was opened)
   * (fallback: none)
   */
  refToFocusOnClose?: LockProps['refToFocusOnDeactivation'];

  /**
   * Whether pressing the `Escape` key should close the Popover
   * (default: `true`)
   */
  shouldCloseOnEscape?: LockProps['shouldDeactivateOnEscape'];

  /**
   * Whether clicking outside the Popover should close it
   * (default: `true`)
   */
  shouldCloseOnOutsideClick?: LockProps['shouldDeactivateOnOutsideClick'];

  /**
   * Whether pointer events happening outside the Popover should be blocked
   * (default: `false`)
   */
  shouldBlockOutsideClick?: LockProps['shouldBlockOutsideClick'];

  /**
   * Whether scrolling should be locked or not
   * (default: `false`)
   */
  shouldLockScroll?: boolean;

  /**
   * Whether the Popover should render in a Portal
   * (default: `true`)
   */
  shouldPortal?: boolean;
};
type PopoverProps = PopperProps & PopoverDOMProps & PopoverOwnProps;

interface PopoverStaticProps {
  Arrow: typeof PopoverArrow;
}

const Popover = forwardRef<typeof POPOVER_DEFAULT_TAG, PopoverProps, PopoverStaticProps>(
  (props, forwardedRef) => {
    const {
      children,
      onClose,
      refToFocusOnOpen,
      refToFocusOnClose,
      shouldCloseOnEscape = true,
      shouldCloseOnOutsideClick = true,
      shouldBlockOutsideClick = false,
      shouldLockScroll = false,
      shouldPortal = true,
      ...popoverProps
    } = props;
    const debugContext = useDebugContext();

    const ScrollLockWrapper = React.useMemo(
      () => (shouldLockScroll ? RemoveScroll : React.Fragment),
      [shouldLockScroll]
    );
    const PortalWrapper = React.useMemo(() => (shouldPortal ? Portal : React.Fragment), [
      shouldPortal,
    ]);

    const content = (
      <Popper {...interopDataAttrObj('root')} {...popoverProps} ref={forwardedRef}>
        {children}
      </Popper>
    );

    return (
      <PortalWrapper>
        {debugContext.disableLock ? (
          content
        ) : (
          <ScrollLockWrapper>
            <Lock
              onDeactivate={onClose}
              refToFocusOnActivation={refToFocusOnOpen}
              refToFocusOnDeactivation={refToFocusOnClose}
              shouldDeactivateOnEscape={shouldCloseOnEscape}
              shouldDeactivateOnOutsideClick={shouldCloseOnOutsideClick}
              shouldBlockOutsideClick={shouldBlockOutsideClick}
            >
              {content}
            </Lock>
          </ScrollLockWrapper>
        )}
      </PortalWrapper>
    );
  }
);

/* -------------------------------------------------------------------------------------------------
 * PopoverArrow
 * -----------------------------------------------------------------------------------------------*/

const ARROW_NAME = 'Popover.Arrow';
const ARROW_DEFAULT_TAG = 'svg';

type PopoverArrowOwnProps = {};
type PopoverArrowProps = PopperArrowProps & PopoverArrowOwnProps;

const PopoverArrow = forwardRef<typeof ARROW_DEFAULT_TAG, PopoverArrowProps>(function PopoverArrow(
  props,
  forwardedRef
) {
  return <Popper.Arrow {...interopDataAttrObj('arrow')} {...props} ref={forwardedRef} />;
});

/* -----------------------------------------------------------------------------------------------*/

Popover.Arrow = PopoverArrow;

Popover.displayName = POPOVER_NAME;
Popover.Arrow.displayName = ARROW_NAME;

const [styles, interopDataAttrObj] = createStyleObj(POPOVER_NAME, {
  root: {
    ...cssReset(POPOVER_DEFAULT_TAG),
    ...popperStyles.root,
  },
  arrow: {
    ...cssReset(ARROW_DEFAULT_TAG),
    ...popperStyles.arrow,
  },
});

export type { PopoverProps, PopoverArrowProps };
export { Popover, styles };
