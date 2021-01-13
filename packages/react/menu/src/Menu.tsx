import * as React from 'react';
import {
  composeEventHandlers,
  composeRefs,
  createContext,
  extendComponent,
  useCallbackRef,
  useComposedRefs,
} from '@radix-ui/react-utils';
import { getPartDataAttr, getPartDataAttrObj } from '@radix-ui/utils';
import { forwardRefWithAs } from '@radix-ui/react-polymorphic';
import { Presence } from '@radix-ui/react-presence';
import { RovingFocusGroup, useRovingFocus } from '@radix-ui/react-roving-focus';
import * as PopperPrimitive from '@radix-ui/react-popper';
import { DismissableLayer } from '@radix-ui/react-dismissable-layer';
import { FocusScope } from '@radix-ui/react-focus-scope';
import { Portal } from '@radix-ui/react-portal';
import { useFocusGuards } from '@radix-ui/react-focus-guards';
import { RemoveScroll } from 'react-remove-scroll';
import { hideOthers } from 'aria-hidden';
import { useMenuTypeahead, useMenuTypeaheadItem } from './useMenuTypeahead';

type FocusScopeProps = React.ComponentProps<typeof FocusScope>;
type DismissableLayerProps = React.ComponentProps<typeof DismissableLayer>;

const FIRST_KEYS = ['ArrowDown', 'PageUp', 'Home'];
const LAST_KEYS = ['ArrowUp', 'PageDown', 'End'];
const ALL_KEYS = [...FIRST_KEYS, ...LAST_KEYS];

/* -------------------------------------------------------------------------------------------------
 * Menu
 * -----------------------------------------------------------------------------------------------*/

const MENU_NAME = 'Menu';

type MenuContextValue = {
  menuRef: React.RefObject<HTMLDivElement>;
  setItemsReachable: React.Dispatch<React.SetStateAction<boolean>>;
  onOpenChange?: (open: boolean) => void;
};
const [MenuContext, useMenuContext] = createContext<MenuContextValue>(
  MENU_NAME + 'Context',
  MENU_NAME
);

type MenuOwnProps = {
  open?: boolean;

  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: true;
};

const Menu = forwardRefWithAs<typeof MenuImpl, MenuOwnProps>((props, forwardedRef) => {
  const { children, forceMount, open = false, ...menuProps } = props;

  return (
    <Presence present={forceMount || open}>
      <MenuImpl ref={forwardedRef} {...menuProps} data-state={getOpenState(open)}>
        {children}
      </MenuImpl>
    </Presence>
  );
});

type MenuImplOwnProps = {
  anchorRef: React.ComponentProps<typeof PopperPrimitive.Root>['anchorRef'];
  onOpenChange?: (open: boolean) => void;
  loop?: boolean;

  /**
   * Whether focus should be trapped within the `Menu`
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
   * When `true`, hover/focus/click interactions will be disabled on elements outside the `Menu`.
   * Users will need to click twice on outside elements to interact with them:
   * Once to close the `Menu`, and again to trigger the element.
   */
  disableOutsidePointerEvents?: DismissableLayerProps['disableOutsidePointerEvents'];

  /**
   * Event handler called when the escape key is down.
   * Can be prevented.
   */
  onEscapeKeyDown?: DismissableLayerProps['onEscapeKeyDown'];

  /**
   * Event handler called when the a pointer event happens outside of the `Menu`.
   * Can be prevented.
   */
  onPointerDownOutside?: DismissableLayerProps['onPointerDownOutside'];

  /**
   * Event handler called when the focus moves outside of the `Menu`.
   * Can be prevented.
   */
  onFocusOutside?: DismissableLayerProps['onFocusOutside'];

  /**
   * Event handler called when an interaction happens outside the `Menu`.
   * Specifically, when a pointer event happens outside of the `Menu` or focus moves outside of it.
   * Can be prevented.
   */
  onInteractOutside?: DismissableLayerProps['onInteractOutside'];

  /** Callback called when the `DismissableLayer` should be dismissed */
  onDismiss?: DismissableLayerProps['onDismiss'];

  /**
   * Whether scrolling outside the `Menu` should be prevented
   * (default: `false`)
   */
  disableOutsideScroll?: boolean;

  /**
   * Whether the `Menu` should render in a `Portal`
   * (default: `true`)
   */
  portalled?: boolean;
};

const MenuImpl = forwardRefWithAs<typeof PopperPrimitive.Root, MenuImplOwnProps>(
  (props, forwardedRef) => {
    const {
      children,
      onOpenChange,
      anchorRef,
      loop,
      trapFocus,
      onOpenAutoFocus,
      onCloseAutoFocus,
      disableOutsidePointerEvents,
      onEscapeKeyDown,
      onPointerDownOutside,
      onFocusOutside,
      onInteractOutside,
      onDismiss,
      disableOutsideScroll,
      portalled,
      ...menuProps
    } = props;

    const handleOpenChange = useCallbackRef(onOpenChange);
    const menuRef = React.useRef<HTMLDivElement>(null);
    const [menuTabIndex, setMenuTabIndex] = React.useState(0);
    const [itemsReachable, setItemsReachable] = React.useState(false);
    const menuTypeaheadProps = useMenuTypeahead();

    const context = React.useMemo(
      () => ({ menuRef, setItemsReachable, onOpenChange: handleOpenChange }),
      [handleOpenChange]
    );

    React.useEffect(() => {
      setMenuTabIndex(itemsReachable ? -1 : 0);
    }, [itemsReachable]);

    const PortalWrapper = portalled ? Portal : React.Fragment;
    const ScrollLockWrapper = disableOutsideScroll ? RemoveScroll : React.Fragment;

    // Make sure the whole tree has focus guards as our `Menu` may be
    // the last element in the DOM (beacuse of the `Portal`)
    useFocusGuards();

    // Hide everything from ARIA except the `Menu`
    React.useEffect(() => {
      const menu = menuRef.current;
      if (menu) return hideOthers(menu);
    }, []);

    return (
      <PortalWrapper>
        <ScrollLockWrapper>
          <FocusScope
            trapped={trapFocus}
            onMountAutoFocus={onOpenAutoFocus}
            onUnmountAutoFocus={onCloseAutoFocus}
          >
            {(focusScopeProps) => (
              <DismissableLayer
                disableOutsidePointerEvents={disableOutsidePointerEvents}
                onEscapeKeyDown={onEscapeKeyDown}
                onPointerDownOutside={onPointerDownOutside}
                onFocusOutside={composeEventHandlers(
                  onFocusOutside,
                  (event) => {
                    // When focus is trapped, a focusout event may still happen.
                    // We make sure we don't trigger our `onDismiss` in such case.
                    if (trapFocus) event.preventDefault();
                  },
                  { checkForDefaultPrevented: false }
                )}
                onInteractOutside={onInteractOutside}
                onDismiss={onDismiss}
              >
                {(dismissableLayerProps) => (
                  <PopperPrimitive.Root
                    role="menu"
                    {...getPartDataAttrObj(MENU_NAME)}
                    {...menuProps}
                    ref={composeRefs(
                      forwardedRef,
                      menuRef,
                      focusScopeProps.ref,
                      dismissableLayerProps.ref
                    )}
                    anchorRef={anchorRef}
                    tabIndex={menuTabIndex}
                    style={{ ...dismissableLayerProps.style, outline: 'none', ...menuProps.style }}
                    onBlurCapture={composeEventHandlers(
                      menuProps.onBlurCapture,
                      dismissableLayerProps.onBlurCapture,
                      { checkForDefaultPrevented: false }
                    )}
                    onFocusCapture={composeEventHandlers(
                      menuProps.onFocusCapture,
                      dismissableLayerProps.onFocusCapture,
                      { checkForDefaultPrevented: false }
                    )}
                    onMouseDownCapture={composeEventHandlers(
                      menuProps.onMouseDownCapture,
                      dismissableLayerProps.onMouseDownCapture,
                      { checkForDefaultPrevented: false }
                    )}
                    onTouchStartCapture={composeEventHandlers(
                      menuProps.onTouchStartCapture,
                      dismissableLayerProps.onTouchStartCapture,
                      { checkForDefaultPrevented: false }
                    )}
                    onKeyDownCapture={composeEventHandlers(
                      menuProps.onKeyDownCapture,
                      menuTypeaheadProps.onKeyDownCapture
                    )}
                    // focus first/last item based on key pressed
                    onKeyDown={composeEventHandlers(menuProps.onKeyDown, (event) => {
                      const menu = menuRef.current;
                      if (event.target === menu) {
                        if (ALL_KEYS.includes(event.key)) {
                          event.preventDefault();
                          const items = Array.from(menu.querySelectorAll(ENABLED_ITEM_SELECTOR));
                          const item = FIRST_KEYS.includes(event.key)
                            ? items[0]
                            : items.reverse()[0];
                          (item as HTMLElement | undefined)?.focus();
                        }
                      }
                    })}
                    // focus the menu if the mouse is moved over anything else than an item
                    onMouseMove={composeEventHandlers(menuProps.onMouseMove, (event) => {
                      if (!isItemOrInsideItem(event.target)) menuRef.current?.focus();
                    })}
                  >
                    <RovingFocusGroup
                      reachable={itemsReachable}
                      onReachableChange={setItemsReachable}
                      orientation="vertical"
                      loop={loop}
                    >
                      <MenuContext.Provider value={context}>{children}</MenuContext.Provider>
                    </RovingFocusGroup>
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

Menu.displayName = MENU_NAME;

/* -------------------------------------------------------------------------------------------------
 * MenuGroup
 * -----------------------------------------------------------------------------------------------*/

const GROUP_NAME = 'MenuGroup';
const GROUP_DEFAULT_TAG = 'div';

const MenuGroup = forwardRefWithAs<typeof GROUP_DEFAULT_TAG>((props, forwardedRef) => {
  const { as: Comp = GROUP_DEFAULT_TAG, ...groupProps } = props;
  return (
    <Comp role="group" {...groupProps} {...getPartDataAttrObj(GROUP_NAME)} ref={forwardedRef} />
  );
});

MenuGroup.displayName = GROUP_NAME;

/* -------------------------------------------------------------------------------------------------
 * MenuLabel
 * -----------------------------------------------------------------------------------------------*/

const LABEL_NAME = 'MenuLabel';
const LABEL_DEFAULT_TAG = 'div';

const MenuLabel = forwardRefWithAs<typeof LABEL_DEFAULT_TAG>((props, forwardedRef) => {
  const { as: Comp = LABEL_DEFAULT_TAG, ...labelProps } = props;
  return <Comp {...labelProps} {...getPartDataAttrObj(LABEL_NAME)} ref={forwardedRef} />;
});

MenuLabel.displayName = LABEL_NAME;

/* -------------------------------------------------------------------------------------------------
 * MenuItem
 * -----------------------------------------------------------------------------------------------*/

const ITEM_NAME = 'MenuItem';
const ITEM_DEFAULT_TAG = 'div';
const ENABLED_ITEM_SELECTOR = `[${getPartDataAttr(ITEM_NAME)}]:not([data-disabled])`;
const ITEM_SELECT = 'menu.itemSelect';

type MenuItemOwnProps = {
  disabled?: boolean;
  textValue?: string;
  onSelect?: (event: Event) => void;
  onSelectCapture: never;
};

const MenuItem = forwardRefWithAs<typeof ITEM_DEFAULT_TAG, MenuItemOwnProps>(
  (props, forwardedRef) => {
    const { as: Comp = ITEM_DEFAULT_TAG, disabled, textValue, onSelect, ...itemProps } = props;
    const menuItemRef = React.useRef<HTMLDivElement>(null);
    const composedRef = useComposedRefs(forwardedRef, menuItemRef);
    const context = useMenuContext(ITEM_NAME);
    const rovingFocusProps = useRovingFocus({ disabled });

    // get the item's `.textContent` as default strategy for typeahead `textValue`
    const [textContent, setTextContent] = React.useState('');
    React.useEffect(() => {
      const menuItem = menuItemRef.current;
      if (menuItem) {
        setTextContent((menuItem.textContent ?? '').trim());
      }
    }, [itemProps.children]);

    const menuTypeaheadItemProps = useMenuTypeaheadItem({
      textValue: textValue ?? textContent,
      disabled,
    });

    const handleSelect = () => {
      const menuItem = menuItemRef.current;
      if (!disabled && menuItem) {
        const itemSelectEvent = new Event(ITEM_SELECT, { bubbles: true, cancelable: true });
        menuItem.dispatchEvent(itemSelectEvent);
        if (itemSelectEvent.defaultPrevented) return;
        context.onOpenChange?.(false);
      }
    };

    React.useEffect(() => {
      const menuItem = menuItemRef.current;
      if (menuItem) {
        const handleItemSelect = (event: Event) => onSelect?.(event);
        menuItem.addEventListener(ITEM_SELECT, handleItemSelect);
        return () => menuItem.removeEventListener(ITEM_SELECT, handleItemSelect);
      }
    }, [onSelect]);

    return (
      <Comp
        role="menuitem"
        aria-disabled={disabled || undefined}
        {...itemProps}
        {...getPartDataAttrObj(ITEM_NAME)}
        {...rovingFocusProps}
        {...menuTypeaheadItemProps}
        ref={composedRef}
        data-disabled={disabled ? '' : undefined}
        onFocus={composeEventHandlers(itemProps.onFocus, rovingFocusProps.onFocus)}
        onKeyDown={composeEventHandlers(
          itemProps.onKeyDown,
          composeEventHandlers(rovingFocusProps.onKeyDown, (event) => {
            if (!disabled) {
              if (event.key === 'Enter' || event.key === ' ') {
                handleSelect();
              }
            }
          })
        )}
        onMouseDown={composeEventHandlers(itemProps.onMouseDown, rovingFocusProps.onMouseDown)}
        // we handle selection on `mouseUp` rather than `click` to match native menus implementation
        onMouseUp={composeEventHandlers(itemProps.onMouseUp, handleSelect)}
        /**
         * We focus items on `mouseMove` to achieve the following:
         *
         * - Mouse over an item (it focuses)
         * - Leave mouse where it is and use keyboard to focus a different item
         * - Wiggle mouse without it leaving previously focused item
         * - Previously focused item should re-focus
         *
         * If we used `mouseOver`/`mouseEnter` it would not re-focus when the mouse
         * wiggles. This is to match native menu implementation.
         */
        onMouseMove={composeEventHandlers(itemProps.onMouseMove, (event) => {
          if (!disabled) {
            const item = event.currentTarget;
            item.focus();
          }
        })}
        // make items unreachable when an item is blurred
        onBlur={composeEventHandlers(itemProps.onBlur, (event) => {
          context.setItemsReachable(false);
        })}
        // focus the menu if the mouse leaves an item
        onMouseLeave={composeEventHandlers(itemProps.onMouseLeave, (event) => {
          context.menuRef.current?.focus();
        })}
      />
    );
  }
);

MenuItem.displayName = ITEM_NAME;

/* -------------------------------------------------------------------------------------------------
 * MenuCheckboxItem
 * -----------------------------------------------------------------------------------------------*/

const CHECKBOX_ITEM_NAME = 'MenuCheckboxItem';

type MenuCheckboxItemOwnProps = {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

const MenuCheckboxItem = forwardRefWithAs<typeof MenuItem, MenuCheckboxItemOwnProps>(
  (props, forwardedRef) => {
    const { checked = false, onCheckedChange, children, ...checkboxItemProps } = props;
    return (
      <MenuItem
        role="menuitemcheckbox"
        aria-checked={checked}
        {...checkboxItemProps}
        {...getPartDataAttrObj(CHECKBOX_ITEM_NAME)}
        data-state={getCheckedState(checked)}
        ref={forwardedRef}
        onSelect={composeEventHandlers(
          checkboxItemProps.onSelect,
          () => onCheckedChange?.(!checked),
          { checkForDefaultPrevented: false }
        )}
      >
        <ItemIndicatorContext.Provider value={checked}>{children}</ItemIndicatorContext.Provider>
      </MenuItem>
    );
  }
);

MenuCheckboxItem.displayName = CHECKBOX_ITEM_NAME;

/* -------------------------------------------------------------------------------------------------
 * MenuRadioGroup
 * -----------------------------------------------------------------------------------------------*/

const RADIO_GROUP_NAME = 'MenuRadioGroup';

const RadioGroupContext = React.createContext<MenuRadioGroupOwnProps>({} as any);

type MenuRadioGroupOwnProps = {
  value?: string;
  onValueChange?: (value: string) => void;
};

const MenuRadioGroup = forwardRefWithAs<typeof MenuGroup, MenuRadioGroupOwnProps>(
  (props, forwardedRef) => {
    const { children, value, onValueChange, ...groupProps } = props;
    const handleValueChange = useCallbackRef(onValueChange);
    const context = React.useMemo(() => ({ value, onValueChange: handleValueChange }), [
      value,
      handleValueChange,
    ]);
    return (
      <MenuGroup ref={forwardedRef} {...groupProps} {...getPartDataAttrObj(RADIO_GROUP_NAME)}>
        <RadioGroupContext.Provider value={context}>{children}</RadioGroupContext.Provider>
      </MenuGroup>
    );
  }
);

MenuRadioGroup.displayName = RADIO_GROUP_NAME;

/* -------------------------------------------------------------------------------------------------
 * MenuRadioItem
 * -----------------------------------------------------------------------------------------------*/

const RADIO_ITEM_NAME = 'MenuRadioItem';

type MenuRadioItemOwnProps = { value: string };

const MenuRadioItem = forwardRefWithAs<typeof MenuItem, MenuRadioItemOwnProps>(
  (props, forwardedRef) => {
    const { value, children, ...radioItemProps } = props;
    const context = React.useContext(RadioGroupContext);
    const checked = value === context.value;
    return (
      <MenuItem
        role="menuitemradio"
        aria-checked={checked}
        {...radioItemProps}
        {...getPartDataAttrObj(RADIO_ITEM_NAME)}
        data-state={getCheckedState(checked)}
        ref={forwardedRef}
        onSelect={composeEventHandlers(
          radioItemProps.onSelect,
          () => context.onValueChange?.(value),
          { checkForDefaultPrevented: false }
        )}
      >
        <ItemIndicatorContext.Provider value={checked}>{children}</ItemIndicatorContext.Provider>
      </MenuItem>
    );
  }
);

MenuRadioItem.displayName = RADIO_ITEM_NAME;

/* -------------------------------------------------------------------------------------------------
 * MenuItemIndicator
 * -----------------------------------------------------------------------------------------------*/

const ITEM_INDICATOR_NAME = 'MenuItemIndicator';
const ITEM_INDICATOR_DEFAULT_TAG = 'span';

const ItemIndicatorContext = React.createContext(false);

type MenuItemIndicatorOwnProps = {
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: true;
};

const MenuItemIndicator = forwardRefWithAs<
  typeof ITEM_INDICATOR_DEFAULT_TAG,
  MenuItemIndicatorOwnProps
>((props, forwardedRef) => {
  const { as: Comp = ITEM_INDICATOR_DEFAULT_TAG, forceMount, ...indicatorProps } = props;
  const checked = React.useContext(ItemIndicatorContext);
  return (
    <Presence present={forceMount || checked}>
      <Comp
        {...indicatorProps}
        {...getPartDataAttrObj(ITEM_INDICATOR_NAME)}
        data-state={getCheckedState(checked)}
        ref={forwardedRef}
      />
    </Presence>
  );
});

MenuItemIndicator.displayName = ITEM_INDICATOR_NAME;

/* -------------------------------------------------------------------------------------------------
 * MenuSeparator
 * -----------------------------------------------------------------------------------------------*/

const SEPARATOR_NAME = 'MenuSeparator';
const SEPARATOR_DEFAULT_TAG = 'div';

const MenuSeparator = forwardRefWithAs<typeof SEPARATOR_DEFAULT_TAG>((props, forwardedRef) => {
  const { as: Comp = SEPARATOR_DEFAULT_TAG, ...separatorProps } = props;
  return (
    <Comp
      role="separator"
      aria-orientation="horizontal"
      {...separatorProps}
      {...getPartDataAttrObj(SEPARATOR_NAME)}
      ref={forwardedRef}
    />
  );
});

MenuSeparator.displayName = SEPARATOR_NAME;

/* -------------------------------------------------------------------------------------------------
 * MenuArrow
 * -----------------------------------------------------------------------------------------------*/

const MenuArrow = extendComponent(PopperPrimitive.Arrow, 'MenuArrow');

/* -----------------------------------------------------------------------------------------------*/

function isItemOrInsideItem(target: EventTarget) {
  const item = (target as HTMLElement).closest(ENABLED_ITEM_SELECTOR);
  return item !== null;
}

function getOpenState(open: boolean) {
  return open ? 'open' : 'closed';
}

function getCheckedState(checked: boolean) {
  return checked ? 'checked' : 'unchecked';
}

const Root = Menu;
const Group = MenuGroup;
const Label = MenuLabel;
const Item = MenuItem;
const CheckboxItem = MenuCheckboxItem;
const RadioGroup = MenuRadioGroup;
const RadioItem = MenuRadioItem;
const ItemIndicator = MenuItemIndicator;
const Separator = MenuSeparator;
const Arrow = MenuArrow;

export {
  Menu,
  MenuGroup,
  MenuLabel,
  MenuItem,
  MenuCheckboxItem,
  MenuRadioGroup,
  MenuRadioItem,
  MenuItemIndicator,
  MenuSeparator,
  MenuArrow,
  //
  Root,
  Group,
  Label,
  Item,
  CheckboxItem,
  RadioGroup,
  RadioItem,
  ItemIndicator,
  Separator,
  Arrow,
};
