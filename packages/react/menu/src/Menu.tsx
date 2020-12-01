import * as React from 'react';
import { composeEventHandlers, useComposedRefs } from '@interop-ui/react-utils';
import { getPartDataAttr, getPartDataAttrObj } from '@interop-ui/utils';
import { forwardRefWithAs } from '@interop-ui/react-polymorphic';
import { RovingFocusGroup, useRovingFocus } from '@interop-ui/react-roving-focus';
import { useMenuTypeahead, useMenuTypeaheadItem } from './useMenuTypeahead';

/* -------------------------------------------------------------------------------------------------
 * Menu
 * -----------------------------------------------------------------------------------------------*/
const MENU_NAME = 'Menu';
const MENU_DEFAULT_TAG = 'div';

const FIRST_KEYS = ['ArrowDown', 'PageUp', 'Home'];
const LAST_KEYS = ['ArrowUp', 'PageDown', 'End'];
const ALL_KEYS = [...FIRST_KEYS, ...LAST_KEYS];

type MenuOwnProps = { loop?: boolean };

const Menu = forwardRefWithAs<typeof MENU_DEFAULT_TAG, MenuOwnProps>((props, forwardedRef) => {
  const { children, as: Comp = MENU_DEFAULT_TAG, loop = false, ...menuProps } = props;
  const menuRef = React.useRef<HTMLDivElement>(null);
  const composedRef = useComposedRefs(forwardedRef, menuRef);
  const [menuTabIndex, setMenuTabIndex] = React.useState(0);
  const [itemsReachable, setItemsReachable] = React.useState(false);
  const menuTypeaheadProps = useMenuTypeahead();

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

Menu.displayName = MENU_NAME;

/* -------------------------------------------------------------------------------------------------
 * MenuItem
 * -----------------------------------------------------------------------------------------------*/
const ITEM_NAME = 'MenuItem';
const ITEM_DEFAULT_TAG = 'div';
const ENABLED_ITEM_SELECTOR = `[${getPartDataAttr(ITEM_NAME)}]:not([data-disabled])`;

type MenuItemOwnProps = {
  disabled?: boolean;
  textValue?: string;
  onSelect?: () => void;
};

const MenuItem = forwardRefWithAs<typeof ITEM_DEFAULT_TAG, MenuItemOwnProps>(
  (props, forwardedRef) => {
    const { as: Comp = ITEM_DEFAULT_TAG, disabled, textValue, onSelect, ...itemProps } = props;
    const menuItemRef = React.useRef<HTMLDivElement>(null);
    const composedRef = useComposedRefs(forwardedRef, menuItemRef);

    // get the item's `.textContent` as default strategy for typeahead `textValue`
    const [textContent, setTextContent] = React.useState('');
    React.useEffect(() => {
      const menuItem = menuItemRef.current;
      if (menuItem) {
        setTextContent((menuItem.textContent ?? '').trim());
      }
    }, [itemProps.children]);

    const rovingFocusProps = useRovingFocus({ disabled });
    const menuTypeaheadItemProps = useMenuTypeaheadItem({
      textValue: textValue ?? textContent,
      disabled,
    });

    const handleSelect = () => !disabled && onSelect?.();

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
      />
    );
  }
);

MenuItem.displayName = ITEM_NAME;

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

/* -----------------------------------------------------------------------------------------------*/

function isItem(target: EventTarget) {
  return (target as HTMLElement).matches(ENABLED_ITEM_SELECTOR);
}

export { Menu, MenuItem, MenuGroup, MenuLabel, MenuSeparator };
