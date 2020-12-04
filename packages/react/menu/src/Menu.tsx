import * as React from 'react';
import {
  composeEventHandlers,
  createContext,
  useCallbackRef,
  useComposedRefs,
} from '@interop-ui/react-utils';
import { getPartDataAttr, getPartDataAttrObj } from '@interop-ui/utils';
import { forwardRefWithAs } from '@interop-ui/react-polymorphic';
import { RovingFocusGroup, useRovingFocus } from '@interop-ui/react-roving-focus';
import { useMenuTypeahead, useMenuTypeaheadItem } from './useMenuTypeahead';

const FIRST_KEYS = ['ArrowDown', 'PageUp', 'Home'];
const LAST_KEYS = ['ArrowUp', 'PageDown', 'End'];
const ALL_KEYS = [...FIRST_KEYS, ...LAST_KEYS];

/* -------------------------------------------------------------------------------------------------
 * Menu
 * -----------------------------------------------------------------------------------------------*/

const MENU_NAME = 'Menu';
const MENU_DEFAULT_TAG = 'div';

type MenuContextValue = {
  menuRef: React.RefObject<HTMLDivElement>;
  setItemsReachable: React.Dispatch<React.SetStateAction<boolean>>;
};
const [MenuContext, useMenuContext] = createContext<MenuContextValue>(
  MENU_NAME + 'Context',
  MENU_NAME
);

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
        <MenuContext.Provider value={React.useMemo(() => ({ menuRef, setItemsReachable }), [])}>
          {children}
        </MenuContext.Provider>
      </RovingFocusGroup>
    </Comp>
  );
});

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

type MenuItemOwnProps = {
  disabled?: boolean;
  textValue?: string;
  onSelect?: () => void;
  onSelectCapture?: never;
};

const MenuItem = forwardRefWithAs<typeof ITEM_DEFAULT_TAG, MenuItemOwnProps>(
  (props, forwardedRef) => {
    const { as: Comp = ITEM_DEFAULT_TAG, disabled, textValue, onSelect, ...itemProps } = props;
    const menuItemRef = React.useRef<HTMLDivElement>(null);
    const composedRef = useComposedRefs(forwardedRef, menuItemRef);
    const context = useMenuContext(ITEM_NAME);

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
        data-state={getState(checked)}
        ref={forwardedRef}
        onSelect={() => onCheckedChange?.(!checked)}
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

const MenuRadioGroup: React.FC<MenuRadioGroupOwnProps> = (props) => {
  const { children, value, onValueChange } = props;
  const handleValueChange = useCallbackRef(onValueChange);
  const context = React.useMemo(() => ({ value, onValueChange: handleValueChange }), [
    value,
    handleValueChange,
  ]);
  return <RadioGroupContext.Provider value={context}>{children}</RadioGroupContext.Provider>;
};

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
        data-state={getState(checked)}
        ref={forwardedRef}
        onSelect={() => context.onValueChange?.(value)}
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

const MenuItemIndicator = forwardRefWithAs<typeof ITEM_INDICATOR_DEFAULT_TAG>(
  (props, forwardedRef) => {
    const { as: Comp = ITEM_INDICATOR_DEFAULT_TAG, ...indicatorProps } = props;
    const checked = React.useContext(ItemIndicatorContext);
    return checked ? (
      <Comp
        {...indicatorProps}
        {...getPartDataAttrObj(ITEM_INDICATOR_NAME)}
        data-state={getState(checked)}
        ref={forwardedRef}
      />
    ) : null;
  }
);

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

/* -----------------------------------------------------------------------------------------------*/

function isItemOrInsideItem(target: EventTarget) {
  const item = (target as HTMLElement).closest(ENABLED_ITEM_SELECTOR);
  return item !== null;
}

function getState(checked: boolean) {
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
  Root,
  Group,
  Label,
  Item,
  CheckboxItem,
  RadioGroup,
  RadioItem,
  ItemIndicator,
  Separator,
};
