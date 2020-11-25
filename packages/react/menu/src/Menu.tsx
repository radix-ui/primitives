import * as React from 'react';
import { composeEventHandlers, forwardRef, useComposedRefs } from '@interop-ui/react-utils';
import { getPartDataAttr, getPartDataAttrObj } from '@interop-ui/utils';
import { RovingFocusGroup, useRovingFocus } from './useRovingFocus';

/* -------------------------------------------------------------------------------------------------
 * Menu
 * -----------------------------------------------------------------------------------------------*/
const MENU_NAME = 'Menu';
const MENU_DEFAULT_TAG = 'div';

const FIRST_KEYS = ['ArrowDown', 'PageUp', 'Home'];
const LAST_KEYS = ['ArrowUp', 'PageDown', 'End'];
const ALL_KEYS = [...FIRST_KEYS, ...LAST_KEYS];

type MenuDOMProps = React.ComponentPropsWithoutRef<typeof MENU_DEFAULT_TAG>;
type MenuOwnProps = { loop?: boolean };
type MenuProps = MenuDOMProps & MenuOwnProps;

const Menu = forwardRef<typeof MENU_DEFAULT_TAG, MenuProps, MenuStaticProps>(function Menu(
  props,
  forwardedRef
) {
  const { children, as: Comp = MENU_DEFAULT_TAG, loop = false, ...menuProps } = props;
  const menuRef = React.useRef<HTMLDivElement>(null);
  const composedRef = useComposedRefs(forwardedRef, menuRef);
  const [menuTabIndex, setMenuTabIndex] = React.useState(0);
  const [itemsReachable, setItemsReachable] = React.useState(false);

  React.useEffect(() => {
    setMenuTabIndex(itemsReachable ? -1 : 0);
  }, [itemsReachable]);

  return (
    <Comp
      role="menu"
      {...menuProps}
      {...getPartDataAttrObj(MENU_NAME)}
      ref={composedRef}
      tabIndex={menuTabIndex}
      style={{ ...menuProps.style, outline: 'none' }}
      // focus first/last item based on key pressed
      onKeyDown={composeEventHandlers(menuProps.onKeyDown, (event) => {
        if (event.target === menuRef.current) {
          if (ALL_KEYS.includes(event.key)) {
            event.preventDefault();
            const items = Array.from(document.querySelectorAll(ENABLED_ITEM_SELECTOR));
            const item = FIRST_KEYS.includes(event.key) ? items[0] : items.reverse()[0];
            (item as HTMLElement | undefined)?.focus();
          }
        }
      })}
      // make items unreachable when an item is blurred
      onBlur={composeEventHandlers(menuProps.onBlur, (event) => {
        if (isItem(event.target)) setItemsReachable(false);
      })}
      // focus the menu if the mouse is moved over anything else than an item
      onMouseMove={composeEventHandlers(menuProps.onMouseMove, (event) => {
        if (!isItem(event.target)) menuRef.current?.focus();
      })}
      // focus the menu if the mouse is moved outside an item
      onMouseOut={composeEventHandlers(menuProps.onMouseOut, (event) => {
        if (isItem(event.target)) menuRef.current?.focus();
      })}
    >
      <RovingFocusGroup
        reachable={itemsReachable}
        onReachableChange={setItemsReachable}
        orientation="vertical"
        loop={loop}
      >
        {children}
      </RovingFocusGroup>
    </Comp>
  );
});

function isItem(target: EventTarget) {
  return (target as HTMLElement).matches(ENABLED_ITEM_SELECTOR);
}

/* -------------------------------------------------------------------------------------------------
 * MenuItem
 * -----------------------------------------------------------------------------------------------*/
const ITEM_NAME = 'Menu.Item';
const ITEM_DEFAULT_TAG = 'div';
const ENABLED_ITEM_SELECTOR = `[${getPartDataAttr(ITEM_NAME)}]:not([data-disabled])`;

type MenuItemDOMProps = React.ComponentPropsWithoutRef<typeof ITEM_DEFAULT_TAG>;
type MenuItemOwnProps = { disabled?: boolean; onSelect?: () => void };
type MenuItemProps = MenuItemDOMProps & MenuItemOwnProps;

const MenuItem = forwardRef<typeof ITEM_DEFAULT_TAG, MenuItemProps>(function MenuItem(
  props,
  forwardedRef
) {
  const { as: Comp = ITEM_DEFAULT_TAG, disabled, tabIndex, ...itemProps } = props;
  const itemRef = React.useRef<HTMLDivElement>(null);
  const composedRef = useComposedRefs(forwardedRef, itemRef);

  const rovingFocusProps = useRovingFocus({ disabled });
  const handleSelect = () => !disabled && itemProps.onSelect?.();
  const handleKeyDown = composeEventHandlers(rovingFocusProps.onKeyDown, (event) => {
    if (!disabled) {
      if (event.key === 'Enter' || event.key === ' ') {
        handleSelect();
      }
    }
  });

  return (
    <Comp
      role="menuitem"
      aria-disabled={disabled || undefined}
      {...itemProps}
      {...getPartDataAttrObj(ITEM_NAME)}
      {...rovingFocusProps}
      ref={composedRef}
      data-disabled={disabled ? '' : undefined}
      onFocus={composeEventHandlers(itemProps.onFocus, rovingFocusProps.onFocus)}
      onKeyDown={composeEventHandlers(itemProps.onKeyDown, handleKeyDown)}
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
    />
  );
});

/* -------------------------------------------------------------------------------------------------
 * MenuSeparator
 * -----------------------------------------------------------------------------------------------*/
const SEPARATOR_NAME = 'Menu.Separator';
const SEPARATOR_DEFAULT_TAG = 'div';

type MenuSeparatorDOMProps = React.ComponentPropsWithoutRef<typeof SEPARATOR_DEFAULT_TAG>;
type MenuSeparatorOwnProps = {};
type MenuSeparatorProps = MenuSeparatorDOMProps & MenuSeparatorOwnProps;

const MenuSeparator = forwardRef<typeof SEPARATOR_DEFAULT_TAG, MenuSeparatorProps>(
  function MenuSeparator(props, forwardedRef) {
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
  }
);

/* -----------------------------------------------------------------------------------------------*/

Menu.Item = MenuItem;
Menu.Separator = MenuSeparator;

Menu.displayName = MENU_NAME;
Menu.Item.displayName = ITEM_NAME;
Menu.Separator.displayName = SEPARATOR_NAME;

interface MenuStaticProps {
  Item: typeof MenuItem;
  Separator: typeof MenuSeparator;
}

export { Menu };
