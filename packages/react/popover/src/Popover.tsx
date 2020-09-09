import * as React from 'react';
import {
  forwardRef,
  createStyleObj,
  createContext,
  useComposedRefs,
  composeEventHandlers,
} from '@interop-ui/react-utils';
import { cssReset } from '@interop-ui/utils';
import { Popper, styles as popperStyles } from '@interop-ui/react-popper';
import { useDebugContext } from '@interop-ui/react-debug-context';
import { Lock } from '@interop-ui/react-lock';
import { RemoveScroll } from 'react-remove-scroll';
import { Portal } from '@interop-ui/react-portal';

import type { PopperProps, PopperArrowProps } from '@interop-ui/react-popper';
import type { LockProps } from '@interop-ui/react-lock';

/* -------------------------------------------------------------------------------------------------
 * Root level context
 * -----------------------------------------------------------------------------------------------*/

type PopoverContextValue = {
  targetRef: React.RefObject<HTMLButtonElement>;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

const [PopoverContext, usePopoverContext] = createContext<PopoverContextValue>(
  'PopoverContext',
  'Popover'
);

/* -------------------------------------------------------------------------------------------------
 * Popover
 * -----------------------------------------------------------------------------------------------*/

const POPOVER_NAME = 'Popover';

interface PopoverStaticProps {
  Target: typeof PopoverTarget;
  Content: typeof PopoverContent;
  Close: typeof PopoverClose;
  Arrow: typeof PopoverArrow;
}

type PopoverProps = {
  defaultIsOpen?: boolean;
};

const Popover: React.FC<PopoverProps> & PopoverStaticProps = function Popover(props) {
  const { children, defaultIsOpen = false } = props;
  const targetRef = React.useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = React.useState(defaultIsOpen);
  const context = React.useMemo(() => ({ targetRef, isOpen, setIsOpen }), [isOpen]);

  return <PopoverContext.Provider value={context}>{children}</PopoverContext.Provider>;
};

/* -------------------------------------------------------------------------------------------------
 * PopoverTarget
 * -----------------------------------------------------------------------------------------------*/

const TARGET_NAME = 'Popover.Target';
const TARGET_DEFAULT_TAG = 'button';

type PopoverTargetDOMProps = React.ComponentPropsWithoutRef<typeof TARGET_DEFAULT_TAG>;
type PopoverTargetOwnProps = {};
type PopoverTargetProps = PopoverTargetOwnProps & PopoverTargetDOMProps;

const PopoverTarget = forwardRef<typeof TARGET_DEFAULT_TAG, PopoverTargetProps>(
  (props, forwardedRef) => {
    const { as: Comp = TARGET_DEFAULT_TAG, onClick, ...targetProps } = props;
    const context = usePopoverContext(TARGET_NAME);
    const composedTargetRef = useComposedRefs(forwardedRef, context.targetRef);

    return (
      <Comp
        {...interopDataAttrObj('target')}
        ref={composedTargetRef}
        type={Comp === TARGET_DEFAULT_TAG ? 'button' : undefined}
        {...targetProps}
        onClick={composeEventHandlers(onClick, () => context.setIsOpen(true))}
      />
    );
  }
);

/* -------------------------------------------------------------------------------------------------
 * PopoverContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = 'Popover.Content';
const CONTENT_DEFAULT_TAG = 'div';

type PopoverContentDOMProps = React.ComponentPropsWithoutRef<typeof CONTENT_DEFAULT_TAG>;
type PopoverContentOwnProps = {
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
   * Whether pointer events happening outside the Popover should be prevented
   * (default: `false`)
   */
  shouldPreventOutsideClick?: LockProps['shouldPreventOutsideClick'];

  /**
   * Whether scrolling outside the Popover should be prevented
   * (default: `false`)
   */
  shouldPreventOutsideScroll?: boolean;

  /**
   * Whether the Popover should render in a Portal
   * (default: `true`)
   */
  shouldPortal?: boolean;
};
type PopoverContentProps = Omit<PopperProps, 'anchorRef'> &
  PopoverContentDOMProps &
  PopoverContentOwnProps;

const PopoverContent = forwardRef<typeof CONTENT_DEFAULT_TAG, PopoverContentProps>(
  function PopoverContent(props, forwardedRef) {
    const {
      children,
      onClose,
      refToFocusOnOpen,
      refToFocusOnClose,
      shouldCloseOnEscape = true,
      shouldCloseOnOutsideClick = true,
      shouldPreventOutsideClick = false,
      shouldPreventOutsideScroll = false,
      shouldPortal = true,
      ...popoverProps
    } = props;
    const context = usePopoverContext(CONTENT_NAME);
    const debugContext = useDebugContext();

    const ScrollLockWrapper =
      shouldPreventOutsideScroll && !debugContext.disableLock ? RemoveScroll : React.Fragment;
    const PortalWrapper = shouldPortal ? Portal : React.Fragment;

    return context.isOpen ? (
      <PortalWrapper>
        <ScrollLockWrapper>
          <Lock
            onDeactivate={() => {
              onClose?.();
              context.setIsOpen(false);
            }}
            refToFocusOnActivation={refToFocusOnOpen}
            refToFocusOnDeactivation={refToFocusOnClose}
            shouldDeactivateOnEscape={shouldCloseOnEscape}
            shouldDeactivateOnOutsideClick={shouldCloseOnOutsideClick}
            shouldPreventOutsideClick={shouldPreventOutsideClick}
          >
            <Popper
              {...interopDataAttrObj('content')}
              {...popoverProps}
              anchorRef={context.targetRef}
              ref={forwardedRef}
            >
              {children}
            </Popper>
          </Lock>
        </ScrollLockWrapper>
      </PortalWrapper>
    ) : null;
  }
);

/* -------------------------------------------------------------------------------------------------
 * PopoverClose
 * -----------------------------------------------------------------------------------------------*/

const CLOSE_NAME = 'Popover.Close';
const CLOSE_DEFAULT_TAG = 'button';

type PopoverCloseDOMProps = React.ComponentPropsWithoutRef<typeof CLOSE_DEFAULT_TAG>;
type PopoverCloseOwnProps = {};
type PopoverCloseProps = PopoverCloseOwnProps & PopoverCloseDOMProps;

const PopoverClose = forwardRef<typeof CLOSE_DEFAULT_TAG, PopoverCloseProps>(
  (props, forwardedRef) => {
    const { as: Comp = CLOSE_DEFAULT_TAG, onClick, ...closeProps } = props;
    const context = usePopoverContext(CLOSE_NAME);

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

Popover.Target = PopoverTarget;
Popover.Content = PopoverContent;
Popover.Close = PopoverClose;
Popover.Arrow = PopoverArrow;

Popover.displayName = POPOVER_NAME;
Popover.Target.displayName = TARGET_NAME;
Popover.Content.displayName = CONTENT_NAME;
Popover.Close.displayName = CLOSE_NAME;
Popover.Arrow.displayName = ARROW_NAME;

const [styles, interopDataAttrObj] = createStyleObj(POPOVER_NAME, {
  root: {},
  target: {
    ...cssReset(TARGET_DEFAULT_TAG),
  },
  content: {
    ...cssReset(CONTENT_DEFAULT_TAG),
    ...popperStyles.root,
  },
  close: {
    ...cssReset(CLOSE_DEFAULT_TAG),
  },
  arrow: {
    ...cssReset(ARROW_DEFAULT_TAG),
    ...popperStyles.arrow,
  },
});

export type {
  PopoverProps,
  PopoverTargetProps,
  PopoverContentProps,
  PopoverCloseProps,
  PopoverArrowProps,
};
export { Popover, styles };
