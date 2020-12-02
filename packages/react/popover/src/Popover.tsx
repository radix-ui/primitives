import * as React from 'react';
import { getPartDataAttrObj } from '@interop-ui/utils';
import {
  createContext,
  useComposedRefs,
  composeEventHandlers,
  useControlledState,
  useId,
  composeRefs,
} from '@interop-ui/react-utils';
import { forwardRefWithAs } from '@interop-ui/react-polymorphic';
import { Popper, PopperContent, PopperArrow } from '@interop-ui/react-popper';
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

type PopoverOwnProps = {
  isOpen?: boolean;
  defaultIsOpen?: boolean;
  onIsOpenChange?: (isOpen: boolean) => void;
};

const Popover: React.FC<PopoverOwnProps> = (props) => {
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

Popover.displayName = POPOVER_NAME;

/* -------------------------------------------------------------------------------------------------
 * PopoverTrigger
 * -----------------------------------------------------------------------------------------------*/

const TRIGGER_NAME = 'PopoverTrigger';
const TRIGGER_DEFAULT_TAG = 'button';

const PopoverTrigger = forwardRefWithAs<typeof TRIGGER_DEFAULT_TAG>((props, forwardedRef) => {
  const { as: Comp = TRIGGER_DEFAULT_TAG, onClick, ...triggerProps } = props;
  const context = usePopoverContext(TRIGGER_NAME);
  const composedTriggerRef = useComposedRefs(forwardedRef, context.triggerRef);

  return (
    <Comp
      {...getPartDataAttrObj(TRIGGER_NAME)}
      ref={composedTriggerRef}
      type="button"
      aria-haspopup="dialog"
      aria-expanded={context.isOpen}
      aria-controls={context.id}
      onClick={composeEventHandlers(onClick, () => context.setIsOpen((prevIsOpen) => !prevIsOpen))}
      {...triggerProps}
    />
  );
});

PopoverTrigger.displayName = TRIGGER_NAME;

/* -------------------------------------------------------------------------------------------------
 * PopoverPopper
 * -----------------------------------------------------------------------------------------------*/

const POPPER_NAME = 'PopoverPopper';

type PopoverPopperOwnProps = {
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
   * Event handler called when the a pointer event happens outside of the `Popover`.
   * Can be prevented.
   */
  onPointerDownOutside?: DismissableLayerProps['onPointerDownOutside'];

  /**
   * Event handler called when the focus moves outside of the `Popover`.
   * Can be prevented.
   */
  onFocusOutside?: DismissableLayerProps['onFocusOutside'];

  /**
   * Event handler called when an interaction happens outside the `Popover`.
   * Specifically, when a pointer event happens outside of the `Popover` or focus moves outside of it.
   * Can be prevented.
   */
  onInteractOutside?: DismissableLayerProps['onInteractOutside'];

  /**
   * Whether scrolling outside the `Popover` should be prevented
   * (default: `false`)
   */
  disableOutsideScroll?: boolean;

  /**
   * Whether the `Popover` should render in a `Portal`
   * (default: `true`)
   */
  shouldPortal?: boolean;

  anchorRef?: React.ComponentProps<typeof Popper>['anchorRef'];
};

const PopoverPopper = forwardRefWithAs<typeof PopoverPopperImpl>((props, forwardedRef) => {
  const context = usePopoverContext(POPPER_NAME);
  return context.isOpen ? <PopoverPopperImpl ref={forwardedRef} {...props} /> : null;
});

const PopoverPopperImpl = forwardRefWithAs<typeof Popper, PopoverPopperOwnProps>(
  (props, forwardedRef) => {
    const {
      children,
      anchorRef,
      trapFocus = true,
      onOpenAutoFocus,
      onCloseAutoFocus,
      disableOutsidePointerEvents = false,
      onEscapeKeyDown,
      onPointerDownOutside,
      onFocusOutside,
      onInteractOutside,
      disableOutsideScroll = false,
      shouldPortal = true,
      ...popperProps
    } = props;
    const context = usePopoverContext(POPPER_NAME);
    const debugContext = useDebugContext();
    const [skipCloseAutoFocus, setSkipCloseAutoFocus] = React.useState(false);

    const PortalWrapper = shouldPortal ? Portal : React.Fragment;
    const ScrollLockWrapper =
      disableOutsideScroll && !debugContext.disableLock ? RemoveScroll : React.Fragment;

    // Make sure the whole tree has focus guards as our `Popover` may be
    // the last element in the DOM (beacuse of the `Portal`)
    useFocusGuards();

    // Hide everything from ARIA except the popper
    const popperRef = React.useRef<HTMLDivElement>(null);
    React.useEffect(() => {
      const popper = popperRef.current;
      if (popper) return hideOthers(popper);
    }, []);

    return (
      <PortalWrapper>
        <ScrollLockWrapper>
          <FocusScope
            trapped={trapFocus}
            onMountAutoFocus={onOpenAutoFocus}
            onUnmountAutoFocus={(event) => {
              if (skipCloseAutoFocus) {
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
                onPointerDownOutside={(event) => {
                  const wasTrigger = event.target === context.triggerRef.current;

                  // skip autofocus on close if clicking outside is allowed and it happened
                  setSkipCloseAutoFocus(!disableOutsidePointerEvents);

                  // prevent dismissing when clicking the trigger
                  // as it's already setup to close, otherwise it would close and immediately open.
                  if (wasTrigger) {
                    event.preventDefault();
                  } else {
                    onInteractOutside?.(event);
                  }

                  if (event.defaultPrevented) {
                    // reset this because the event was prevented
                    setSkipCloseAutoFocus(false);
                  }
                }}
                onFocusOutside={onFocusOutside}
                onInteractOutside={onInteractOutside}
                onDismiss={() => context.setIsOpen(false)}
              >
                {(dismissableLayerProps) => (
                  <Popper
                    {...getPartDataAttrObj(POPPER_NAME)}
                    role="dialog"
                    aria-modal
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
                      // re-namespace exposed popper custom property
                      ['--interop-ui-popover-popper-transform-origin' as any]: 'var(--interop-ui-popper-transform-origin)',
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

PopoverPopper.displayName = POPPER_NAME;

/* -------------------------------------------------------------------------------------------------
 * PopoverContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = 'PopoverContent';

const PopoverContent = forwardRefWithAs<typeof PopperContent>((props, forwardedRef) => {
  return <PopperContent {...getPartDataAttrObj(CONTENT_NAME)} {...props} ref={forwardedRef} />;
});

PopoverContent.displayName = CONTENT_NAME;

/* -------------------------------------------------------------------------------------------------
 * PopoverClose
 * -----------------------------------------------------------------------------------------------*/

const CLOSE_NAME = 'PopoverClose';
const CLOSE_DEFAULT_TAG = 'button';

const PopoverClose = forwardRefWithAs<typeof CLOSE_DEFAULT_TAG>((props, forwardedRef) => {
  const { as: Comp = CLOSE_DEFAULT_TAG, onClick, ...closeProps } = props;
  const context = usePopoverContext(CLOSE_NAME);

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

PopoverClose.displayName = CLOSE_NAME;

/* -------------------------------------------------------------------------------------------------
 * PopoverArrow
 * -----------------------------------------------------------------------------------------------*/

const ARROW_NAME = 'PopoverArrow';

const PopoverArrow = forwardRefWithAs<typeof PopperArrow>((props, forwardedRef) => {
  return <PopperArrow {...getPartDataAttrObj(ARROW_NAME)} {...props} ref={forwardedRef} />;
});

PopoverArrow.displayName = ARROW_NAME;

/* -----------------------------------------------------------------------------------------------*/

export { Popover, PopoverTrigger, PopoverPopper, PopoverContent, PopoverClose, PopoverArrow };
