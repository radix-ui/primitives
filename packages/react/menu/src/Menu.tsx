import * as React from 'react';
import { composeEventHandlers } from '@radix-ui/primitive';
import { composeRefs, useComposedRefs } from '@radix-ui/react-compose-refs';
import { createContext } from '@radix-ui/react-context';
import { useCallbackRef } from '@radix-ui/react-use-callback-ref';
import { Presence } from '@radix-ui/react-presence';
import { Primitive, extendPrimitive } from '@radix-ui/react-primitive';
import { RovingFocusGroup, useRovingFocus } from '@radix-ui/react-roving-focus';
import * as PopperPrimitive from '@radix-ui/react-popper';
import { DismissableLayer } from '@radix-ui/react-dismissable-layer';
import { FocusScope } from '@radix-ui/react-focus-scope';
import { Portal } from '@radix-ui/react-portal';
import { useFocusGuards } from '@radix-ui/react-focus-guards';
import { RemoveScroll } from 'react-remove-scroll';
import { hideOthers } from 'aria-hidden';
import { useMenuTypeahead, useMenuTypeaheadItem } from './useMenuTypeahead';

import type * as Polymorphic from '@radix-ui/react-polymorphic';

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
  onItemsReachableChange(open: boolean): void;
  onOpenChange(open: boolean): void;
};
const [MenuProvider, useMenuContext] = createContext<MenuContextValue>(MENU_NAME);

type MenuOwnProps = Polymorphic.Merge<
  Polymorphic.OwnProps<typeof MenuImpl>,
  {
    open?: boolean;

    /**
     * Used to force mounting when more control is needed. Useful when
     * controlling animation with React animation libraries.
     */
    forceMount?: true;
  }
>;

type MenuPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof MenuImpl>,
  MenuOwnProps
>;

const Menu = React.forwardRef((props, forwardedRef) => {
  const { forceMount, open = false, ...menuProps } = props;

  return (
    <Presence present={forceMount || open}>
      <MenuImpl data-state={getOpenState(open)} {...menuProps} ref={forwardedRef} open={open} />
    </Presence>
  );
}) as MenuPrimitive;

type MenuImplOwnProps = Polymorphic.Merge<
  Polymorphic.OwnProps<typeof PopperPrimitive.Root>,
  {
    open: boolean;
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
  }
>;

type MenuImplPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof PopperPrimitive.Root>,
  MenuImplOwnProps
>;

const MenuImpl = React.forwardRef((props, forwardedRef) => {
  const {
    open,
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

  React.useEffect(() => {
    setMenuTabIndex(itemsReachable ? -1 : 0);
  }, [itemsReachable]);

  const [
    isPermittedPointerDownOutsideEvent,
    setIsPermittedPointerDownOutsideEvent,
  ] = React.useState(false);

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
        <MenuProvider
          menuRef={menuRef}
          onItemsReachableChange={setItemsReachable}
          onOpenChange={handleOpenChange}
        >
          <RovingFocusGroup
            reachable={itemsReachable}
            onReachableChange={setItemsReachable}
            orientation="vertical"
            loop={loop}
          >
            <FocusScope
              // clicking outside may raise a focusout event, which may get trapped.
              // in cases where outside pointer events are permitted, we stop trapping.
              // we also make sure we're not trapping once it's been closed
              // (closed !== unmounted when animating out)
              trapped={isPermittedPointerDownOutsideEvent ? false : trapFocus && open}
              onMountAutoFocus={onOpenAutoFocus}
              onUnmountAutoFocus={(event) => {
                // skip autofocus on unmount if clicking outside is permitted and it happened
                if (isPermittedPointerDownOutsideEvent) {
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
                  onPointerDownOutside={composeEventHandlers(
                    onPointerDownOutside,
                    (event) => {
                      const isLeftClick =
                        (event as MouseEvent).button === 0 && event.ctrlKey === false;
                      const isPermitted = !disableOutsidePointerEvents && isLeftClick;
                      setIsPermittedPointerDownOutsideEvent(isPermitted);

                      if (event.defaultPrevented) {
                        // reset this because the event was prevented
                        setIsPermittedPointerDownOutsideEvent(false);
                      }
                    },
                    { checkForDefaultPrevented: false }
                  )}
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
                      {...menuProps}
                      ref={composeRefs(forwardedRef, menuRef, focusScopeProps.ref)}
                      anchorRef={anchorRef}
                      tabIndex={menuTabIndex}
                      style={{
                        ...dismissableLayerProps.style,
                        outline: 'none',
                        ...menuProps.style,
                      }}
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
                    />
                  )}
                </DismissableLayer>
              )}
            </FocusScope>
          </RovingFocusGroup>
        </MenuProvider>
      </ScrollLockWrapper>
    </PortalWrapper>
  );
}) as MenuImplPrimitive;

Menu.displayName = MENU_NAME;

/* -------------------------------------------------------------------------------------------------
 * MenuItem
 * -----------------------------------------------------------------------------------------------*/

const ITEM_NAME = 'MenuItem';
const ITEM_ATTR = 'data-radix-menu-item';
const ENABLED_ITEM_SELECTOR = `[${ITEM_ATTR}]:not([data-disabled])`;
const ITEM_SELECT = 'menu.itemSelect';

type MenuItemOwnProps = Polymorphic.Merge<
  Polymorphic.OwnProps<typeof Primitive>,
  {
    disabled?: boolean;
    textValue?: string;
    onSelect?: (event: Event) => void;
  }
>;

type MenuItemPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof Primitive>,
  MenuItemOwnProps
>;

const MenuItem = React.forwardRef((props, forwardedRef) => {
  const { disabled, textValue, onSelect, ...itemProps } = props;
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
    <Primitive
      role="menuitem"
      aria-disabled={disabled || undefined}
      {...itemProps}
      {...rovingFocusProps}
      {...menuTypeaheadItemProps}
      {...{ [ITEM_ATTR]: '' }}
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
        context.onItemsReachableChange(false);
      })}
      // focus the menu if the mouse leaves an item
      onMouseLeave={composeEventHandlers(itemProps.onMouseLeave, (event) => {
        context.menuRef.current?.focus();
      })}
    />
  );
}) as MenuItemPrimitive;

MenuItem.displayName = ITEM_NAME;

/* -------------------------------------------------------------------------------------------------
 * MenuCheckboxItem
 * -----------------------------------------------------------------------------------------------*/

const CHECKBOX_ITEM_NAME = 'MenuCheckboxItem';

type MenuCheckboxItemOwnProps = Polymorphic.Merge<
  Polymorphic.OwnProps<typeof MenuItem>,
  {
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
  }
>;

type MenyCheckboxItemPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof MenuItem>,
  MenuCheckboxItemOwnProps
>;

const MenuCheckboxItem = React.forwardRef((props, forwardedRef) => {
  const { checked = false, onCheckedChange, ...checkboxItemProps } = props;
  return (
    <ItemIndicatorContext.Provider value={checked}>
      <MenuItem
        role="menuitemcheckbox"
        aria-checked={checked}
        {...checkboxItemProps}
        ref={forwardedRef}
        data-state={getCheckedState(checked)}
        onSelect={composeEventHandlers(
          checkboxItemProps.onSelect,
          () => onCheckedChange?.(!checked),
          { checkForDefaultPrevented: false }
        )}
      />
    </ItemIndicatorContext.Provider>
  );
}) as MenyCheckboxItemPrimitive;

MenuCheckboxItem.displayName = CHECKBOX_ITEM_NAME;

/* -------------------------------------------------------------------------------------------------
 * MenuRadioGroup
 * -----------------------------------------------------------------------------------------------*/

const RADIO_GROUP_NAME = 'MenuRadioGroup';

const RadioGroupContext = React.createContext<MenuRadioGroupOwnProps>({} as any);

type MenuRadioGroupOwnProps = Polymorphic.Merge<
  Polymorphic.OwnProps<typeof MenuGroup>,
  {
    value?: string;
    onValueChange?: (value: string) => void;
  }
>;

type MenuRadioGroupPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof MenuGroup>,
  MenuRadioGroupOwnProps
>;

const MenuRadioGroup = React.forwardRef((props, forwardedRef) => {
  const { value, onValueChange, ...groupProps } = props;
  const handleValueChange = useCallbackRef(onValueChange);
  const context = React.useMemo(() => ({ value, onValueChange: handleValueChange }), [
    value,
    handleValueChange,
  ]);
  return (
    <RadioGroupContext.Provider value={context}>
      <MenuGroup {...groupProps} ref={forwardedRef} />
    </RadioGroupContext.Provider>
  );
}) as MenuRadioGroupPrimitive;

MenuRadioGroup.displayName = RADIO_GROUP_NAME;

/* -------------------------------------------------------------------------------------------------
 * MenuRadioItem
 * -----------------------------------------------------------------------------------------------*/

const RADIO_ITEM_NAME = 'MenuRadioItem';

type MenuRadioItemOwnProps = Polymorphic.Merge<
  Polymorphic.OwnProps<typeof MenuItem>,
  { value: string }
>;
type MenuRadioItemPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof MenuItem>,
  MenuRadioItemOwnProps
>;

const MenuRadioItem = React.forwardRef((props, forwardedRef) => {
  const { value, ...radioItemProps } = props;
  const context = React.useContext(RadioGroupContext);
  const checked = value === context.value;
  return (
    <ItemIndicatorContext.Provider value={checked}>
      <MenuItem
        role="menuitemradio"
        aria-checked={checked}
        {...radioItemProps}
        ref={forwardedRef}
        data-state={getCheckedState(checked)}
        onSelect={composeEventHandlers(
          radioItemProps.onSelect,
          () => context.onValueChange?.(value),
          { checkForDefaultPrevented: false }
        )}
      />
    </ItemIndicatorContext.Provider>
  );
}) as MenuRadioItemPrimitive;

MenuRadioItem.displayName = RADIO_ITEM_NAME;

/* -------------------------------------------------------------------------------------------------
 * MenuItemIndicator
 * -----------------------------------------------------------------------------------------------*/

const ITEM_INDICATOR_NAME = 'MenuItemIndicator';
const ITEM_INDICATOR_DEFAULT_TAG = 'span';

const ItemIndicatorContext = React.createContext(false);

type MenuItemIndicatorOwnProps = Polymorphic.Merge<
  Polymorphic.OwnProps<typeof Primitive>,
  {
    /**
     * Used to force mounting when more control is needed. Useful when
     * controlling animation with React animation libraries.
     */
    forceMount?: true;
  }
>;

type MenuItemIndicatorPrimitive = Polymorphic.ForwardRefComponent<
  typeof ITEM_INDICATOR_DEFAULT_TAG,
  MenuItemIndicatorOwnProps
>;

const MenuItemIndicator = React.forwardRef((props, forwardedRef) => {
  const { as = ITEM_INDICATOR_DEFAULT_TAG, forceMount, ...indicatorProps } = props;
  const checked = React.useContext(ItemIndicatorContext);
  return (
    <Presence present={forceMount || checked}>
      <Primitive
        {...indicatorProps}
        as={as}
        ref={forwardedRef}
        data-state={getCheckedState(checked)}
      />
    </Presence>
  );
}) as MenuItemIndicatorPrimitive;

MenuItemIndicator.displayName = ITEM_INDICATOR_NAME;

/* ---------------------------------------------------------------------------------------------- */

const MenuGroup = extendPrimitive(Primitive, {
  defaultProps: { role: 'group' },
  displayName: 'MenuGroup',
});
const MenuLabel = extendPrimitive(Primitive, { displayName: 'MenuLabel' });
const MenuSeparator = extendPrimitive(Primitive, {
  defaultProps: { role: 'separator', 'aria-orientation': 'horizontal' },
  displayName: 'MenuSeparator ',
});
const MenuArrow = extendPrimitive(PopperPrimitive.Arrow, { displayName: 'MenuArrow' });

/* -----------------------------------------------------------------------------------------------*/

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
