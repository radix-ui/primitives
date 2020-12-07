import * as React from 'react';
import {
  composeEventHandlers,
  createContext,
  extendComponent,
  useComposedRefs,
  useControlledState,
  useId,
} from '@interop-ui/react-utils';
import { forwardRefWithAs } from '@interop-ui/react-polymorphic';
import { getPartDataAttrObj } from '@interop-ui/utils';
import * as PopperPrimitive from '@interop-ui/react-popper';
import { DismissableLayer } from '@interop-ui/react-dismissable-layer';
import * as MenuPrimitive from '@interop-ui/react-menu';

type DismissableLayerProps = React.ComponentProps<typeof DismissableLayer>;

/* -------------------------------------------------------------------------------------------------
 * Root level context
 * -----------------------------------------------------------------------------------------------*/

type DropdownContextValue = {
  triggerRef: React.RefObject<HTMLButtonElement>;
  menuId: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean | undefined>>;
};

const [DropdownContext, useDropdownContext] = createContext<DropdownContextValue>(
  'DropdownContext',
  'Dropdown'
);

/* -------------------------------------------------------------------------------------------------
 * Dropdown
 * -----------------------------------------------------------------------------------------------*/

const DROPDOWN_NAME = 'Dropdown';

type DropdownOwnProps = {
  id?: string;
  isOpen?: boolean;
  defaultIsOpen?: boolean;
  onIsOpenChange?: (isOpen: boolean) => void;
};

const Dropdown: React.FC<DropdownOwnProps> = (props) => {
  const { children, id: idProp, isOpen: isOpenProp, defaultIsOpen, onIsOpenChange } = props;
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const generatedId = useId();
  const id = idProp || `dropdown-${generatedId}`;
  const menuId = `${id}-menu`;
  const [isOpen = false, setIsOpen] = useControlledState({
    prop: isOpenProp,
    defaultProp: defaultIsOpen,
    onChange: onIsOpenChange,
  });
  const context = React.useMemo(() => ({ triggerRef, menuId, isOpen, setIsOpen }), [
    menuId,
    isOpen,
    setIsOpen,
  ]);

  return <DropdownContext.Provider value={context}>{children}</DropdownContext.Provider>;
};

Dropdown.displayName = DROPDOWN_NAME;

/* -------------------------------------------------------------------------------------------------
 * DropdownTrigger
 * -----------------------------------------------------------------------------------------------*/

const TRIGGER_NAME = 'DropdownTrigger';
const TRIGGER_DEFAULT_TAG = 'button';

const DropdownTrigger = forwardRefWithAs<typeof TRIGGER_DEFAULT_TAG>((props, forwardedRef) => {
  const { as: Comp = TRIGGER_DEFAULT_TAG, onClick, ...triggerProps } = props;
  const context = useDropdownContext(TRIGGER_NAME);
  const composedTriggerRef = useComposedRefs(forwardedRef, context.triggerRef);

  return (
    <Comp
      {...getPartDataAttrObj(TRIGGER_NAME)}
      ref={composedTriggerRef}
      type="button"
      aria-haspopup="menu"
      aria-expanded={context.isOpen ? true : undefined}
      aria-controls={context.isOpen ? context.menuId : undefined}
      {...triggerProps}
      onMouseDown={composeEventHandlers(triggerProps.onMouseDown, (event) => {
        // only call handler if it's the left button (mousedown gets triggered by all mouse buttons)
        // but not when the control key is pressed (avoiding MacOS right click)
        if (event.button === 0 && event.ctrlKey === false) {
          context.setIsOpen((prevOpen) => !prevOpen);
        }
      })}
      onKeyDown={composeEventHandlers(triggerProps.onKeyDown, (event: React.KeyboardEvent) => {
        if (event.key === ' ' || event.key === 'ArrowUp' || event.key === 'ArrowDown') {
          event.preventDefault();
          context.setIsOpen(true);
        }
      })}
    />
  );
});

DropdownTrigger.displayName = TRIGGER_NAME;

/* -------------------------------------------------------------------------------------------------
 * DropdownPopper
 * -----------------------------------------------------------------------------------------------*/

const POPPER_NAME = 'DropdownPopper';

type DropdownPopperOwnProps = {
  trapFocus?: never;
  onCloseAutoFocus?: never;
  onOpenAutoFocus?: never;
  onDismiss?: never;

  /**
   * When `true`, hover/focus/click interactions will be disabled on elements outside the `DropdownMenu`.
   * Users will need to click twice on outside elements to interact with them:
   * Once to close the `DropdownMenu`, and again to trigger the element.
   */
  disableOutsidePointerEvents?: DismissableLayerProps['disableOutsidePointerEvents'];

  /**
   * Event handler called when the escape key is down.
   * Can be prevented.
   */
  onEscapeKeyDown?: DismissableLayerProps['onEscapeKeyDown'];

  /**
   * Event handler called when the a pointer event happens outside of the `DropdownMenu`.
   * Can be prevented.
   */
  onPointerDownOutside?: DismissableLayerProps['onPointerDownOutside'];

  /**
   * Event handler called when the focus moves outside of the `DropdownMenu`.
   * Can be prevented.
   */
  onFocusOutside?: DismissableLayerProps['onFocusOutside'];

  /**
   * Event handler called when an interaction happens outside the `DropdownMenu`.
   * Specifically, when a pointer event happens outside of the `DropdownMenu`
   * or focus moves outside of it.
   * Can be prevented.
   */
  onInteractOutside?: DismissableLayerProps['onInteractOutside'];

  /**
   * Whether scrolling outside the `DropdownMenu` should be prevented
   * (default: `false`)
   */
  disableOutsideScroll?: boolean;

  /**
   * Whether the `DropdownMenu` should render in a `Portal`
   * (default: `true`)
   */
  shouldPortal?: boolean;

  anchorRef?: React.ComponentProps<typeof MenuPrimitive.Popper>['anchorRef'];
};

const DropdownPopper = forwardRefWithAs<typeof MenuPrimitive.Popper, DropdownPopperOwnProps>(
  (props, forwardedRef) => {
    const {
      anchorRef,
      disableOutsidePointerEvents = true,
      onPointerDownOutside,
      onInteractOutside,
      disableOutsideScroll = true,
      shouldPortal = true,
      ...popperProps
    } = props;
    const context = useDropdownContext(POPPER_NAME);
    const [skipCloseAutoFocus, setSkipCloseAutoFocus] = React.useState(false);
    return (
      <MenuPrimitive.Popper
        ref={forwardedRef}
        {...popperProps}
        style={{
          ...popperProps.style,
          // re-namespace exposed popper custom property
          ['--interop-ui-dropdown-popper-transform-origin' as any]: 'var(--interop-ui-popper-transform-origin)',
        }}
        isOpen={context.isOpen}
        onIsOpenChange={context.setIsOpen}
        anchorRef={anchorRef || context.triggerRef}
        trapFocus
        onCloseAutoFocus={(event) => {
          if (skipCloseAutoFocus) {
            event.preventDefault();
          } else {
            context.triggerRef.current?.focus();
          }
        }}
        disableOutsidePointerEvents={disableOutsidePointerEvents}
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
        onInteractOutside={onInteractOutside}
        disableOutsideScroll={disableOutsideScroll}
        shouldPortal={shouldPortal}
        onDismiss={() => context.setIsOpen(false)}
      />
    );
  }
);

DropdownPopper.displayName = POPPER_NAME;

/* -------------------------------------------------------------------------------------------------
 * DropdownMenu
 * -----------------------------------------------------------------------------------------------*/

const MENU_NAME = 'DropdownMenu';

const DropdownMenu = forwardRefWithAs<typeof MenuPrimitive.Root>((props, forwardedRef) => {
  const context = useDropdownContext(MENU_NAME);
  return (
    <MenuPrimitive.Root
      {...getPartDataAttrObj(MENU_NAME)}
      {...props}
      ref={forwardedRef}
      id={context.menuId}
    />
  );
});

DropdownMenu.displayName = MENU_NAME;

/* -----------------------------------------------------------------------------------------------*/

const DropdownMenuGroup = extendComponent(MenuPrimitive.Group, 'DropdownMenuGroup');
const DropdownMenuLabel = extendComponent(MenuPrimitive.Label, 'DropdownMenuLabel');
const DropdownMenuItem = extendComponent(MenuPrimitive.Item, 'DropdownMenuItem');
const DropdownMenuCheckboxItem = extendComponent(
  MenuPrimitive.CheckboxItem,
  'DropdownMenuCheckboxItem'
);
const DropdownMenuRadioGroup = extendComponent(MenuPrimitive.RadioGroup, 'DropdownMenuRadioGroup');
const DropdownMenuRadioItem = extendComponent(MenuPrimitive.RadioItem, 'DropdownMenuRadioItem');
const DropdownMenuItemIndicator = extendComponent(
  MenuPrimitive.ItemIndicator,
  'DropdownMenuItemIndicator'
);
const DropdownMenuSeparator = extendComponent(MenuPrimitive.Separator, 'DropdownMenuSeparator');
const DropdownArrow = extendComponent(PopperPrimitive.Arrow, 'DropdownArrow');

/* -----------------------------------------------------------------------------------------------*/

const Root = Dropdown;
const Trigger = DropdownTrigger;
const Popper = DropdownPopper;
const Menu = DropdownMenu;
const MenuGroup = DropdownMenuGroup;
const MenuLabel = DropdownMenuLabel;
const MenuItem = DropdownMenuItem;
const MenuCheckboxItem = DropdownMenuCheckboxItem;
const MenuRadioGroup = DropdownMenuRadioGroup;
const MenuRadioItem = DropdownMenuRadioItem;
const MenuItemIndicator = DropdownMenuItemIndicator;
const MenuSeparator = DropdownMenuSeparator;
const Arrow = DropdownArrow;

export {
  Dropdown,
  DropdownTrigger,
  DropdownPopper,
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuItemIndicator,
  DropdownMenuSeparator,
  DropdownArrow,
  //
  Root,
  Trigger,
  Popper,
  Menu,
  MenuGroup,
  MenuLabel,
  MenuItem,
  MenuCheckboxItem,
  MenuRadioGroup,
  MenuRadioItem,
  MenuItemIndicator,
  MenuSeparator,
  Arrow,
};
