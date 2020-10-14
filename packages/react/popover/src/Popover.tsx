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
import { cssReset } from '@interop-ui/utils';
import { Popper, styles as popperStyles } from '@interop-ui/react-popper';
import { useDebugContext } from '@interop-ui/react-debug-context';
import { FocusScope, DismissableLayer } from '@interop-ui/react-lock-modular-temp';
import { Portal } from '@interop-ui/react-portal';
import { RemoveScroll } from 'react-remove-scroll';
import { hideOthers } from 'aria-hidden';

import type { PopperProps, PopperArrowProps } from '@interop-ui/react-popper';
import type { FocusScopeProps, DismissableLayerProps } from '@interop-ui/react-lock-modular-temp';
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
  const { children, isOpen: isOpenProp, defaultIsOpen, onIsOpenChange } = props;
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const id = `popover-${useId()}`;
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
   * Whether the Popover should render in a Portal
   * (default: `true`)
   */
  renderInPortal?: boolean;

  /**
   * Whether focus should be trapped within the `Popover`
   * (default: false)
   */
  trapFocus?: FocusScopeProps['trapped'];

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
   * When `true`, hover/focus/click interactions will be disabled on elements outside the `Popover`.
   * Users will need to click twice on outside elements to interact with them:
   * Once to close the `Popover`, and again to trigger the element.
   */
  disableOutsidePointerEvents?: DismissableLayerProps['disableOutsidePointerEvents'];

  /**
   * Event handler called when the escape key is down.
   * Can be prevented.
   */
  onEscapeKeyDown?: DismissableLayerProps['onEscapeKeyDown'];

  /**
   * Event handler called when an interaction happened outside the `Dialog`.
   * Specifically, when focus leaves the `Dialog` or a pointer event happens outside it.
   * Can be prevented.
   */
  onInteractOutside?: DismissableLayerProps['onInteractOutside'];

  /**
   * Whether scrolling outside the Popover should be prevented
   * (default: `false`)
   */
  disableOutsideScroll?: boolean;
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
      renderInPortal = true,
      trapFocus = true,
      onOpenAutoFocus,
      onCloseAutoFocus,
      disableOutsidePointerEvents = false,
      onEscapeKeyDown,
      onInteractOutside,
      disableOutsideScroll = false,
      ...popperProps
    } = props;
    const context = usePopoverContext(POSITION_NAME);
    const debugContext = useDebugContext();
    const [skipUnmountAutoFocus, setSkipUnmountAutoFocus] = React.useState(false);

    const ScrollLockWrapper =
      disableOutsideScroll && !debugContext.disableLock ? RemoveScroll : React.Fragment;
    const PortalWrapper = renderInPortal ? Portal : React.Fragment;

    // If focus is trapped, hide everything from ARIA except the popper
    const popperRef = React.useRef<HTMLDivElement>(null);
    React.useEffect(() => {
      const popper = popperRef.current;
      if (popper && trapFocus) return hideOthers(popper);
    }, [trapFocus]);

    return (
      <PortalWrapper>
        <ScrollLockWrapper>
          <FocusScope
            trapped={trapFocus}
            onMountAutoFocus={onOpenAutoFocus}
            onUnmountAutoFocus={(event) => {
              if (skipUnmountAutoFocus) {
                event.preventDefault();
              } else {
                onCloseAutoFocus?.(event);
              }
            }}
          >
            {(focusScopeProps) => (
              <DismissableLayer
                disableOutsidePointerEvents={disableOutsidePointerEvents}
                onEscapeKeyDown={onEscapeKeyDown}
                onInteractOutside={(event) => {
                  const wasPointerDownOutside = event.detail.originalEvent.type !== 'blur';
                  const wasTrigger = event.detail.target === context.triggerRef.current;

                  // prevent autofocus on close if clicking outside is allowed and happened
                  setSkipUnmountAutoFocus(!disableOutsidePointerEvents && wasPointerDownOutside);

                  // prevent dismissing when clicking the trigger
                  // as it's already setup to close, otherwise it would close and immediately open.
                  if (wasPointerDownOutside && wasTrigger) {
                    event.preventDefault();
                  } else {
                    onInteractOutside?.(event);
                  }

                  if (event.defaultPrevented) {
                    // reset this because the event was prevented
                    setSkipUnmountAutoFocus(false);
                  }
                }}
                onDismiss={() => context.setIsOpen(false)}
              >
                {(dismissableLayerProps) => (
                  <Popper
                    {...interopDataAttrObj('position')}
                    role="dialog"
                    aria-modal={trapFocus ? true : undefined}
                    {...popperProps}
                    ref={composeRefs(
                      forwardedRef,
                      popperRef,
                      focusScopeProps.ref,
                      dismissableLayerProps.ref
                    )}
                    id={context.id}
                    anchorRef={anchorRef || context.triggerRef}
                    style={{
                      ...dismissableLayerProps.style,
                      ...popperProps.style,
                    }}
                    onBlurCapture={composeEventHandlers(
                      popperProps.onBlurCapture,
                      dismissableLayerProps.onBlurCapture,
                      { checkForDefaultPrevented: false }
                    )}
                    onFocusCapture={composeEventHandlers(
                      popperProps.onFocusCapture,
                      dismissableLayerProps.onFocusCapture,
                      { checkForDefaultPrevented: false }
                    )}
                    onMouseDownCapture={composeEventHandlers(
                      popperProps.onMouseDownCapture,
                      dismissableLayerProps.onMouseDownCapture,
                      { checkForDefaultPrevented: false }
                    )}
                    onTouchStartCapture={composeEventHandlers(
                      popperProps.onTouchStartCapture,
                      dismissableLayerProps.onTouchStartCapture,
                      { checkForDefaultPrevented: false }
                    )}
                  >
                    {children}
                  </Popper>
                )}
              </DismissableLayer>
            )}
          </FocusScope>
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
