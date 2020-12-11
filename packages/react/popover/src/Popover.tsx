import * as React from 'react';
import { getPartDataAttrObj } from '@interop-ui/utils';
import {
  createContext,
  useComposedRefs,
  composeEventHandlers,
  useControlledState,
  useId,
  composeRefs,
  extendComponent,
} from '@interop-ui/react-utils';
import { forwardRefWithAs } from '@interop-ui/react-polymorphic';
import * as PopperPrimitive from '@interop-ui/react-popper';
import { DismissableLayer } from '@interop-ui/react-dismissable-layer';
import { FocusScope } from '@interop-ui/react-focus-scope';
import { Portal } from '@interop-ui/react-portal';
import { useFocusGuards } from '@interop-ui/react-focus-guards';
import { Presence } from '@interop-ui/react-presence';
import { RemoveScroll } from 'react-remove-scroll';
import { hideOthers } from 'aria-hidden';

type DismissableLayerProps = React.ComponentProps<typeof DismissableLayer>;
type FocusScopeProps = React.ComponentProps<typeof FocusScope>;

/* -------------------------------------------------------------------------------------------------
 * Root level context
 * -----------------------------------------------------------------------------------------------*/

type PopoverContextValue = {
  triggerRef: React.RefObject<HTMLButtonElement>;
  id: string;
  open: boolean;
  setOpen: (open: boolean | ((prevOpen?: boolean) => boolean)) => void;
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
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

const Popover: React.FC<PopoverOwnProps> = (props) => {
  const { children, open: openProp, defaultOpen, onOpenChange } = props;
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const id = `popover-${useId()}`;
  const [open = false, setOpen] = useControlledState({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  });
  const context = React.useMemo(() => ({ triggerRef, id, open, setOpen }), [id, open, setOpen]);

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
      aria-expanded={context.open}
      aria-controls={context.id}
      onClick={composeEventHandlers(onClick, () => context.setOpen((prevOpen) => !prevOpen))}
      {...triggerProps}
    />
  );
});

PopoverTrigger.displayName = TRIGGER_NAME;

/* -------------------------------------------------------------------------------------------------
 * PopoverContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = 'PopoverContent';

type PopoverContentOwnProps = {
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
  portalled?: boolean;

  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: true;

  anchorRef?: React.ComponentProps<typeof PopperPrimitive.Root>['anchorRef'];
};

const PopoverContent = forwardRefWithAs<typeof PopoverContentImpl>((props, forwardedRef) => {
  const { forceMount, ...contentProps } = props;
  const context = usePopoverContext(CONTENT_NAME);
  return (
    <Presence present={forceMount || context.open}>
      <PopoverContentImpl
        {...contentProps}
        ref={forwardedRef}
        data-state={context.open ? 'open' : 'closed'}
      />
    </Presence>
  );
});

const PopoverContentImpl = forwardRefWithAs<typeof PopperPrimitive.Root, PopoverContentOwnProps>(
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
      portalled = true,
      ...contentProps
    } = props;
    const context = usePopoverContext(CONTENT_NAME);
    const [skipCloseAutoFocus, setSkipCloseAutoFocus] = React.useState(false);

    const PortalWrapper = portalled ? Portal : React.Fragment;
    const ScrollLockWrapper = disableOutsideScroll ? RemoveScroll : React.Fragment;

    // Make sure the whole tree has focus guards as our `Popover` may be
    // the last element in the DOM (beacuse of the `Portal`)
    useFocusGuards();

    // Hide everything from ARIA except the content
    const contentRef = React.useRef<HTMLDivElement>(null);
    React.useEffect(() => {
      const content = contentRef.current;
      if (content) return hideOthers(content);
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
                onDismiss={() => context.setOpen(false)}
              >
                {(dismissableLayerProps) => (
                  <PopperPrimitive.Root
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
                    anchorRef={anchorRef || context.triggerRef}
                    style={{
                      ...dismissableLayerProps.style,
                      ...contentProps.style,
                      // re-namespace exposed content custom property
                      ['--radix-popover-content-transform-origin' as any]: 'var(--radix-popper-transform-origin)',
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
                  >
                    {children}
                  </PopperPrimitive.Root>
                )}
              </DismissableLayer>
            )}
          </FocusScope>
        </ScrollLockWrapper>
      </PortalWrapper>
    );
  }
);

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
      onClick={composeEventHandlers(onClick, () => context.setOpen(false))}
    />
  );
});

PopoverClose.displayName = CLOSE_NAME;

/* -----------------------------------------------------------------------------------------------*/

const PopoverArrow = extendComponent(PopperPrimitive.Arrow, 'PopoverArrow');

/* -----------------------------------------------------------------------------------------------*/

const Root = Popover;
const Trigger = PopoverTrigger;
const Content = PopoverContent;
const Close = PopoverClose;
const Arrow = PopoverArrow;

export {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverClose,
  PopoverArrow,
  Root,
  Trigger,
  Content,
  Close,
  Arrow,
};
