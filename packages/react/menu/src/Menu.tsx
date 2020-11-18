import * as React from 'react';
import { composeEventHandlers, forwardRef, useComposedRefs } from '@interop-ui/react-utils';
import { getPartDataAttr, getPartDataAttrObj } from '@interop-ui/utils';
import { useRovingFocus, useRovingFocusItem } from './useRovingFocus';

/* -------------------------------------------------------------------------------------------------
 * Menu
 * -----------------------------------------------------------------------------------------------*/

const MENU_NAME = 'Menu';
const MENU_DEFAULT_TAG = 'div';

type MenuDOMProps = React.ComponentPropsWithoutRef<typeof MENU_DEFAULT_TAG>;
type MenuOwnProps = {
  orientation?: React.AriaAttributes['aria-orientation'];
  loop?: boolean;
};
type MenuProps = MenuDOMProps & MenuOwnProps;

const Menu = forwardRef<typeof MENU_DEFAULT_TAG, MenuProps, MenuStaticProps>(function Menu(
  props,
  forwardedRef
) {
  const {
    as: Comp = MENU_DEFAULT_TAG,
    orientation = 'vertical',
    loop = false,
    ...menuProps
  } = props;

  const rovingFocusProps = useRovingFocus({ orientation, loop, makeFirstItemTabbable: false });
  const ref = useComposedRefs(
    forwardedRef,
    rovingFocusProps.ref as React.RefCallback<HTMLDivElement>
  );

  return (
    <Comp
      role="menu"
      {...menuProps}
      {...getPartDataAttrObj(MENU_NAME)}
      {...rovingFocusProps}
      ref={ref}
      tabIndex={0}
      style={{ ...menuProps.style, outline: 'none' }}
      onKeyDown={composeEventHandlers(menuProps.onKeyDown, rovingFocusProps.onKeyDown, {
        checkForDefaultPrevented: false,
      })}
      // We highlight items on `mouseMove` rather than `mouseOver` to match native menus implementation
      onMouseMove={composeEventHandlers(menuProps.onMouseMove, (event) => {
        const menu = event.currentTarget;
        const target = event.target as HTMLElement;
        // we use `.closest` as the target could be an element inside the item which is out of its bounds
        const item = target.closest(ENABLED_ITEM_SELECTOR) as HTMLElement | null;

        if (item) {
          // if the item is already focused, we don't want to do extra work (as this is `onMouseMove`)
          if (document.activeElement !== item) {
            setItemsTabIndex(menu, -1);
            menu.tabIndex = -1;
            item.tabIndex = 0;
            item.focus();
          }
        } else {
          // if the menu is already focused, we don't want to do extra work (as this is `onMouseMove`)
          if (document.activeElement !== menu) {
            // we also ignore the menu here to match native menus implementation
            if (target !== menu) {
              revertFocusToMenu(menu);
            }
          }
        }
      })}
      // We unhighlight item when leaving on menu `mouseLeave` rather than `mouseOut`
      // to match native menus implementation
      onMouseLeave={composeEventHandlers(menuProps.onMouseLeave, (event) => {
        const menu = event.currentTarget;
        revertFocusToMenu(menu);
      })}
    />
  );
});

function setItemsTabIndex(menu: HTMLElement, tabIndex: number) {
  const items: HTMLElement[] = Array.from(menu.querySelectorAll(ENABLED_ITEM_SELECTOR));
  items.forEach((item) => (item.tabIndex = tabIndex));
}

function revertFocusToMenu(menu: HTMLElement) {
  setItemsTabIndex(menu, -1);
  menu.tabIndex = 0;
  menu.focus();
}

/* -------------------------------------------------------------------------------------------------
 * MenuItem
 * -----------------------------------------------------------------------------------------------*/

const ITEM_NAME = 'Menu.Item';
const ITEM_DEFAULT_TAG = 'div';
const ENABLED_ITEM_SELECTOR = `[${getPartDataAttr(ITEM_NAME)}]:not([data-disabled])`;

type MenuItemDOMProps = React.ComponentPropsWithoutRef<typeof ITEM_DEFAULT_TAG>;
type MenuItemOwnProps = {
  disabled?: boolean;
  onSelect?: () => void;
};
type MenuItemProps = MenuItemDOMProps & MenuItemOwnProps;

const MenuItem = forwardRef<typeof ITEM_DEFAULT_TAG, MenuItemProps>(function MenuItem(
  props,
  forwardedRef
) {
  const { as: Comp = ITEM_DEFAULT_TAG, disabled, tabIndex, ...itemProps } = props;

  const rovingFocusItemProps = useRovingFocusItem({ disabled, initiallyTabbable: tabIndex === 0 });
  const handleSelect = () => !disabled && itemProps.onSelect?.();

  return (
    <Comp
      role="menuitem"
      aria-disabled={disabled || undefined}
      {...itemProps}
      {...getPartDataAttrObj(ITEM_NAME)}
      {...rovingFocusItemProps}
      ref={forwardedRef}
      data-disabled={disabled ? '' : undefined}
      onMouseDown={composeEventHandlers(
        itemProps.onMouseDown,
        // we prevent focusing disabled items when clicking because even though the item
        // has tabIndex={-1}, it only means take it out of the tabbable order, but clicking would
        // still actually focus it otherwise
        (event) => disabled && event.preventDefault()
      )}
      // we handle selection on `mouseUp` rather than `click` to match native menus implementation
      onMouseUp={composeEventHandlers(itemProps.onMouseUp, handleSelect)}
      onKeyDown={composeEventHandlers(itemProps.onKeyDown, (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          handleSelect();
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
