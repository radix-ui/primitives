import * as React from 'react';
import {
  forwardRef,
  createStyleObj,
  createContext,
  useComposedRefs,
  composeEventHandlers,
  useControlledState,
  useId,
} from '@interop-ui/react-utils';
import { cssReset, isFunction } from '@interop-ui/utils';
import { Popper, styles as popperStyles } from '@interop-ui/react-popper';
import { useDebugContext } from '@interop-ui/react-debug-context';
import { Lock } from '@interop-ui/react-lock';
import { RemoveScroll } from 'react-remove-scroll';
import { Portal } from '@interop-ui/react-portal';

import type { PopperProps, PopperArrowProps } from '@interop-ui/react-popper';
import type { LockProps } from '@interop-ui/react-lock';
import type { Optional } from '@interop-ui/utils';

/* -------------------------------------------------------------------------------------------------
 * Root level context
 * -----------------------------------------------------------------------------------------------*/

type PopoverContextValue = {
  triggerRef: React.RefObject<HTMLButtonElement>;
  id: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean | ((prevIsOpen?: boolean) => boolean)) => void;
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
  Trigger: typeof PopoverTrigger;
  Position: typeof PopoverPosition;
  Content: typeof PopoverContent;
  Close: typeof PopoverClose;
  Arrow: typeof PopoverArrow;
}

type PopoverProps = {
  isOpen?: boolean;
  defaultIsOpen?: boolean;
  onIsOpenChange?: (isOpen: boolean) => void;
};

const Popover: React.FC<PopoverProps> & PopoverStaticProps = function Popover(props) {
  const { children, isOpen: isOpenProp, defaultIsOpen = false, onIsOpenChange } = props;
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const id = `popover-${useId()}`;
  const [_isOpen, setIsOpen] = useControlledState({
    prop: isOpenProp,
    defaultProp: defaultIsOpen,
    onChange: onIsOpenChange,
  });
  const isOpen = Boolean(_isOpen);
  const context = React.useMemo(() => ({ triggerRef, id, isOpen, setIsOpen }), [
    id,
    isOpen,
    setIsOpen,
  ]);

  return <PopoverContext.Provider value={context}>{children}</PopoverContext.Provider>;
};

/* -------------------------------------------------------------------------------------------------
 * PopoverTrigger
 * -----------------------------------------------------------------------------------------------*/

const TRIGGER_NAME = 'Popover.Trigger';
const TRIGGER_DEFAULT_TAG = 'button';

type PopoverTriggerDOMProps = React.ComponentPropsWithoutRef<typeof TRIGGER_DEFAULT_TAG>;
type PopoverTriggerOwnProps = {};
type PopoverTriggerProps = PopoverTriggerOwnProps & PopoverTriggerDOMProps;

const PopoverTrigger = forwardRef<typeof TRIGGER_DEFAULT_TAG, PopoverTriggerProps>(
  (props, forwardedRef) => {
    const { as: Comp = TRIGGER_DEFAULT_TAG, onClick, ...triggerProps } = props;
    const context = usePopoverContext(TRIGGER_NAME);
    const composedTriggerRef = useComposedRefs(forwardedRef, context.triggerRef);

    return (
      <Comp
        {...interopDataAttrObj('trigger')}
        ref={composedTriggerRef}
        type={Comp === TRIGGER_DEFAULT_TAG ? 'button' : undefined}
        aria-haspopup="dialog"
        aria-expanded={context.isOpen}
        aria-controls={context.id}
        onClick={composeEventHandlers(onClick, () =>
          context.setIsOpen((prevIsOpen) => !prevIsOpen)
        )}
        {...triggerProps}
      />
    );
  }
);

/* -------------------------------------------------------------------------------------------------
 * PopoverPosition
 * -----------------------------------------------------------------------------------------------*/

const POSITION_NAME = 'Popover.Position';
const POSITION_DEFAULT_TAG = 'div';

type PopoverPositionDOMProps = React.ComponentPropsWithoutRef<typeof POSITION_DEFAULT_TAG>;
type PopoverPositionOwnProps = {
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
type PopoverPositionProps = Optional<PopperProps, 'anchorRef'> &
  PopoverPositionDOMProps &
  PopoverPositionOwnProps;

const PopoverPosition = forwardRef<typeof POSITION_DEFAULT_TAG, PopoverPositionProps>(
  function PopoverPosition(props, forwardedRef) {
    const context = usePopoverContext(POSITION_NAME);
    return context.isOpen ? <PopoverPositionImpl ref={forwardedRef} {...props} /> : null;
  }
);

const PopoverPositionImpl = forwardRef<typeof POSITION_DEFAULT_TAG, PopoverPositionProps>(
  function PopoverPositionImpl(props, forwardedRef) {
    const {
      children,
      anchorRef,
      refToFocusOnOpen,
      refToFocusOnClose,
      shouldCloseOnEscape = true,
      shouldCloseOnOutsideClick = true,
      shouldPreventOutsideClick = false,
      shouldPreventOutsideScroll = false,
      shouldPortal = true,
      ...popoverProps
    } = props;
    const context = usePopoverContext(POSITION_NAME);
    const debugContext = useDebugContext();

    const ScrollLockWrapper =
      shouldPreventOutsideScroll && !debugContext.disableLock ? RemoveScroll : React.Fragment;
    const PortalWrapper = shouldPortal ? Portal : React.Fragment;

    return (
      <PortalWrapper>
        <ScrollLockWrapper>
          <Lock
            onDeactivate={() => context.setIsOpen(false)}
            refToFocusOnActivation={refToFocusOnOpen}
            refToFocusOnDeactivation={refToFocusOnClose ?? context.triggerRef}
            shouldDeactivateOnEscape={shouldCloseOnEscape}
            shouldDeactivateOnOutsideClick={(event) => {
              if (event.target === context.triggerRef.current) {
                return false;
              }
              if (isFunction(shouldCloseOnOutsideClick)) {
                return shouldCloseOnOutsideClick(event);
              } else return shouldCloseOnOutsideClick;
            }}
            shouldPreventOutsideClick={shouldPreventOutsideClick}
          >
            <Popper
              {...interopDataAttrObj('position')}
              anchorRef={anchorRef || context.triggerRef}
              ref={forwardedRef}
              role="dialog"
              // I believe this depends on whether we trap focus or not (always for now)
              aria-modal="true"
              {...popoverProps}
              id={context.id}
            >
              {children}
            </Popper>
          </Lock>
        </ScrollLockWrapper>
      </PortalWrapper>
    );
  }
);

/* -------------------------------------------------------------------------------------------------
 * PopoverContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = 'Popover.Content';
const CONTENT_DEFAULT_TAG = 'div';

type PopoverContentDOMProps = React.ComponentPropsWithoutRef<typeof CONTENT_DEFAULT_TAG>;
type PopoverContentOwnProps = {};
type PopoverContentProps = PopoverContentDOMProps & PopoverContentOwnProps;

const PopoverContent = forwardRef<typeof CONTENT_DEFAULT_TAG, PopoverContentProps>(
  (props, forwardedRef) => {
    return <Popper.Content {...interopDataAttrObj('content')} {...props} ref={forwardedRef} />;
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

Popover.Trigger = PopoverTrigger;
Popover.Position = PopoverPosition;
Popover.Content = PopoverContent;
Popover.Close = PopoverClose;
Popover.Arrow = PopoverArrow;

Popover.displayName = POPOVER_NAME;
Popover.Trigger.displayName = TRIGGER_NAME;
Popover.Position.displayName = POSITION_NAME;
Popover.Content.displayName = CONTENT_NAME;
Popover.Close.displayName = CLOSE_NAME;
Popover.Arrow.displayName = ARROW_NAME;

const [styles, interopDataAttrObj] = createStyleObj(POPOVER_NAME, {
  root: {},
  trigger: {
    ...cssReset(TRIGGER_DEFAULT_TAG),
  },
  position: {
    ...cssReset(POSITION_DEFAULT_TAG),
    ...popperStyles.root,
  },
  content: {
    ...cssReset(CONTENT_DEFAULT_TAG),
    ...popperStyles.content,
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
  PopoverTriggerProps,
  PopoverPositionProps,
  PopoverContentProps,
  PopoverCloseProps,
  PopoverArrowProps,
};
export { Popover, styles };
