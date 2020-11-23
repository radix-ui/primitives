import * as React from 'react';
import { composeEventHandlers, forwardRef, useComposedRefs } from '@interop-ui/react-utils';
import { getPartDataAttr, getPartDataAttrObj } from '@interop-ui/utils';
import { RovingFocusGroup, useRovingFocus } from './useRovingFocus';

import type { RovingFocusGroupAPI } from './useRovingFocus';

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
    children,
    as: Comp = MENU_DEFAULT_TAG,
    orientation = 'vertical',
    loop = false,
    ...menuProps
  } = props;
  const menuRef = React.useRef<HTMLDivElement>(null);
  const composedRef = useComposedRefs(forwardedRef, menuRef);
  const rovingFocusGroupRef = React.useRef<RovingFocusGroupAPI>(null);

  // override initial tab index strategy from `RovingFocusGroup`
  React.useEffect(() => {
    const menu = menuRef.current;
    if (menu) removeCurrentTabStop(menu);
  }, []);

  return (
    <Comp
      role="menu"
      {...menuProps}
      {...getPartDataAttrObj(MENU_NAME)}
      ref={composedRef}
      tabIndex={0}
      style={{ ...menuProps.style, outline: 'none' }}
      onKeyDown={composeEventHandlers(menuProps.onKeyDown, (event) => {
        if (event.target === event.currentTarget) {
          if (['ArrowDown', 'PageUp', 'Home'].includes(event.key)) {
            event.preventDefault();
            rovingFocusGroupRef.current?.focusFirst();
          }
          if (['ArrowUp', 'PageDown', 'End'].includes(event.key)) {
            event.preventDefault();
            rovingFocusGroupRef.current?.focusLast();
          }
        }
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
            menu.tabIndex = -1;
            rovingFocusGroupRef.current?.focus(item);
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
    >
      <RovingFocusGroup ref={rovingFocusGroupRef} orientation={orientation} loop={loop}>
        {children}
      </RovingFocusGroup>
    </Comp>
  );
});

function removeCurrentTabStop(menu: HTMLElement) {
  const tabStop: HTMLElement | null = menu.querySelector('[tabIndex="0"]');
  if (tabStop) tabStop.tabIndex = -1;
}

function revertFocusToMenu(menu: HTMLElement) {
  removeCurrentTabStop(menu);
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

  const rovingFocusProps = useRovingFocus({ disabled });
  const handleSelect = () => !disabled && itemProps.onSelect?.();
  const handleKeyDown = composeEventHandlers(rovingFocusProps.onKeyDown, (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      handleSelect();
    }
  });

  return (
    <Comp
      role="menuitem"
      aria-disabled={disabled || undefined}
      {...itemProps}
      {...getPartDataAttrObj(ITEM_NAME)}
      {...rovingFocusProps}
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
      onKeyDown={composeEventHandlers(itemProps.onKeyDown, handleKeyDown)}
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
