import * as React from 'react';
import { composeEventHandlers } from '@radix-ui/primitive';
import { createContextScope } from '@radix-ui/react-context';
import { useId } from '@radix-ui/react-id';
import * as MenuPrimitive from '@radix-ui/react-menu';
import { createMenuScope } from '@radix-ui/react-menu';
import { Primitive } from '@radix-ui/react-primitive';
import { useControllableState } from '@radix-ui/react-use-controllable-state';

import type { Scope } from '@radix-ui/react-context';
import type * as Radix from '@radix-ui/react-primitive';

/* -------------------------------------------------------------------------------------------------
 * Menubar
 * -----------------------------------------------------------------------------------------------*/

const MENUBAR_NAME = 'Menubar';

type ScopedProps<P> = P & { __scopeMenubar?: Scope };
const [createMenubarContext, createMenubarScope] = createContextScope(MENUBAR_NAME, []);

const useMenuScope = createMenuScope();

type MenubarElement = React.ElementRef<typeof Primitive.div>;
type PrimitiveDivProps = Radix.ComponentPropsWithoutRef<typeof Primitive.div>;
interface MenubarProps extends PrimitiveDivProps {}

const Menubar = React.forwardRef<MenubarElement, MenubarProps>(
  (props: ScopedProps<MenubarProps>, forwardedRef) => {
    const { __scopeMenubar, ...menubarProps } = props;

    return <Primitive.div role="menubar" {...menubarProps} ref={forwardedRef} />;
  }
);

Menubar.displayName = MENUBAR_NAME;

/* -------------------------------------------------------------------------------------------------
 * MenubarMenu
 * -----------------------------------------------------------------------------------------------*/

type MenubarMenuContextValue = {
  triggerId: string;
  contentId: string;
  open: boolean;
  onOpenChange(open: boolean): void;
  onOpenToggle(): void;
};

const MENU_NAME = 'MenubarMenu';

const [MenubarMenuProvider, useMenubarMenuContext] =
  createMenubarContext<MenubarMenuContextValue>(MENU_NAME);

interface MenubarMenuProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?(open: boolean): void;
  children?: React.ReactNode;
}

const MenubarMenu = (props: ScopedProps<MenubarMenuProps>) => {
  const { __scopeMenubar, open: openProp, defaultOpen, onOpenChange, ...menuProps } = props;
  const menuScope = useMenuScope(__scopeMenubar);
  const [open = false, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  });

  return (
    <MenubarMenuProvider
      scope={__scopeMenubar}
      triggerId={useId()}
      contentId={useId()}
      open={open}
      onOpenChange={setOpen}
      onOpenToggle={React.useCallback(() => setOpen((prevOpen) => !prevOpen), [setOpen])}
    >
      <MenuPrimitive.Root {...menuScope} open={open} onOpenChange={setOpen} {...menuProps} />
    </MenubarMenuProvider>
  );
};

MenubarMenu.displayName = MENU_NAME;

/* -------------------------------------------------------------------------------------------------
 * MenubarTrigger
 * -----------------------------------------------------------------------------------------------*/

const TRIGGER_NAME = 'MenubarTrigger';

type MenubarTriggerElement = React.ElementRef<typeof Primitive.button>;
type PrimitiveButtonProps = Radix.ComponentPropsWithoutRef<typeof Primitive.button>;
interface MenubarTriggerProps extends PrimitiveButtonProps {}

const MenubarTrigger = React.forwardRef<MenubarTriggerElement, MenubarTriggerProps>(
  (props: ScopedProps<MenubarTriggerProps>, forwardedRef) => {
    const { __scopeMenubar, disabled = false, ...triggerProps } = props;
    const menuScope = useMenuScope(__scopeMenubar);
    const menuContext = useMenubarMenuContext(TRIGGER_NAME, __scopeMenubar);

    return (
      <MenuPrimitive.Anchor asChild {...menuScope}>
        <Primitive.button
          type="button"
          id={menuContext.triggerId}
          aria-haspopup="menu"
          aria-expanded={menuContext.open}
          aria-controls={menuContext.open ? menuContext.contentId : undefined}
          data-state={menuContext.open ? 'open' : 'closed'}
          data-disabled={disabled ? '' : undefined}
          disabled={disabled}
          {...triggerProps}
          onPointerDown={composeEventHandlers(props.onPointerDown, (event) => {
            // only call handler if it's the left button (mousedown gets triggered by all mouse buttons)
            // but not when the control key is pressed (avoiding MacOS right click)
            if (!disabled && event.button === 0 && event.ctrlKey === false) {
              menuContext.onOpenToggle();
              // prevent trigger focusing when opening
              // this allows the content to be given focus without competition
              if (!menuContext.open) event.preventDefault();
            }
          })}
          onKeyDown={composeEventHandlers(props.onKeyDown, (event) => {
            if (disabled) return;
            if (['Enter', ' '].includes(event.key)) menuContext.onOpenToggle();
            if (event.key === 'ArrowDown') menuContext.onOpenChange(true);
            // prevent keydown from scrolling window / first focused item to execute
            // that keydown (inadvertently closing the menu)
            if (['Enter', ' ', 'ArrowDown'].includes(event.key)) event.preventDefault();
          })}
          ref={forwardedRef}
        />
      </MenuPrimitive.Anchor>
    );
  }
);

MenubarTrigger.displayName = TRIGGER_NAME;

/* -------------------------------------------------------------------------------------------------
 * MenubarPortal
 * -----------------------------------------------------------------------------------------------*/

const PORTAL_NAME = 'MenubarPortal';

type MenuPortalProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.Portal>;
interface MenubarPortalProps extends MenuPortalProps {}

const MenubarPortal: React.FC<MenubarPortalProps> = (props: ScopedProps<MenubarPortalProps>) => {
  const { __scopeMenubar, ...portalProps } = props;
  const menuScope = useMenuScope(__scopeMenubar);
  return <MenuPrimitive.Portal {...menuScope} {...portalProps} />;
};

MenubarPortal.displayName = PORTAL_NAME;

/* -------------------------------------------------------------------------------------------------
 * MenubarContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = 'MenubarContent';

type MenubarContentElement = React.ElementRef<typeof MenuPrimitive.Content>;
type MenuContentProps = Radix.ComponentPropsWithoutRef<typeof MenuPrimitive.Content>;
interface MenubarContentProps extends MenuContentProps {}

const MenubarContent = React.forwardRef<MenubarContentElement, MenubarContentProps>(
  (props: ScopedProps<MenubarContentProps>, forwardedRef) => {
    const { __scopeMenubar, ...contentProps } = props;
    const menuScope = useMenuScope(__scopeMenubar);
    const menuContext = useMenubarMenuContext(CONTENT_NAME, __scopeMenubar);

    return (
      <MenuPrimitive.Content
        id={menuContext.contentId}
        aria-labelledby={menuContext.triggerId}
        {...menuScope}
        {...contentProps}
        ref={forwardedRef}
      />
    );
  }
);

MenubarContent.displayName = CONTENT_NAME;

/* -------------------------------------------------------------------------------------------------
 * MenubarGroup
 * -----------------------------------------------------------------------------------------------*/

const GROUP_NAME = 'MenubarGroup';

type MenubarGroupElement = React.ElementRef<typeof MenuPrimitive.Group>;
type MenuGroupProps = Radix.ComponentPropsWithoutRef<typeof MenuPrimitive.Group>;
interface MenubarGroupProps extends MenuGroupProps {}

const MenubarGroup = React.forwardRef<MenubarGroupElement, MenubarGroupProps>(
  (props: ScopedProps<MenubarGroupProps>, forwardedRef) => {
    const { __scopeMenubar, ...groupProps } = props;
    const menuScope = useMenuScope(__scopeMenubar);
    return <MenuPrimitive.Group {...menuScope} {...groupProps} ref={forwardedRef} />;
  }
);

MenubarGroup.displayName = GROUP_NAME;

/* -------------------------------------------------------------------------------------------------
 * MenubarLabel
 * -----------------------------------------------------------------------------------------------*/

const LABEL_NAME = 'MenubarLabel';

type MenubarLabelElement = React.ElementRef<typeof MenuPrimitive.Label>;
type MenuLabelProps = Radix.ComponentPropsWithoutRef<typeof MenuPrimitive.Label>;
interface MenubarLabelProps extends MenuLabelProps {}

const MenubarLabel = React.forwardRef<MenubarLabelElement, MenubarLabelProps>(
  (props: ScopedProps<MenubarLabelProps>, forwardedRef) => {
    const { __scopeMenubar, ...labelProps } = props;
    const menuScope = useMenuScope(__scopeMenubar);
    return <MenuPrimitive.Label {...menuScope} {...labelProps} ref={forwardedRef} />;
  }
);

MenubarLabel.displayName = LABEL_NAME;

/* -------------------------------------------------------------------------------------------------
 * MenubarItem
 * -----------------------------------------------------------------------------------------------*/

const ITEM_NAME = 'MenubarItem';

type MenubarItemElement = React.ElementRef<typeof MenuPrimitive.Item>;
type MenuItemProps = Radix.ComponentPropsWithoutRef<typeof MenuPrimitive.Item>;
interface MenubarItemProps extends MenuItemProps {}

const MenubarItem = React.forwardRef<MenubarItemElement, MenubarItemProps>(
  (props: ScopedProps<MenubarItemProps>, forwardedRef) => {
    const { __scopeMenubar, ...itemProps } = props;
    const menuScope = useMenuScope(__scopeMenubar);
    return <MenuPrimitive.Item {...menuScope} {...itemProps} ref={forwardedRef} />;
  }
);

MenubarItem.displayName = ITEM_NAME;

/* -------------------------------------------------------------------------------------------------
 * MenubarCheckboxItem
 * -----------------------------------------------------------------------------------------------*/

const CHECKBOX_ITEM_NAME = 'MenubarCheckboxItem';

type MenubarCheckboxItemElement = React.ElementRef<typeof MenuPrimitive.CheckboxItem>;
type MenuCheckboxItemProps = Radix.ComponentPropsWithoutRef<typeof MenuPrimitive.CheckboxItem>;
interface MenubarCheckboxItemProps extends MenuCheckboxItemProps {}

const MenubarCheckboxItem = React.forwardRef<MenubarCheckboxItemElement, MenubarCheckboxItemProps>(
  (props: ScopedProps<MenubarCheckboxItemProps>, forwardedRef) => {
    const { __scopeMenubar, ...checkboxItemProps } = props;
    const menuScope = useMenuScope(__scopeMenubar);
    return <MenuPrimitive.CheckboxItem {...menuScope} {...checkboxItemProps} ref={forwardedRef} />;
  }
);

MenubarCheckboxItem.displayName = CHECKBOX_ITEM_NAME;

/* -------------------------------------------------------------------------------------------------
 * MenubarRadioGroup
 * -----------------------------------------------------------------------------------------------*/

const RADIO_GROUP_NAME = 'MenubarRadioGroup';

type MenubarRadioGroupElement = React.ElementRef<typeof MenuPrimitive.RadioGroup>;
type MenuRadioGroupProps = Radix.ComponentPropsWithoutRef<typeof MenuPrimitive.RadioGroup>;
interface MenubarRadioGroupProps extends MenuRadioGroupProps {}

const MenubarRadioGroup = React.forwardRef<MenubarRadioGroupElement, MenubarRadioGroupProps>(
  (props: ScopedProps<MenubarRadioGroupProps>, forwardedRef) => {
    const { __scopeMenubar, ...radioGroupProps } = props;
    const menuScope = useMenuScope(__scopeMenubar);
    return <MenuPrimitive.RadioGroup {...menuScope} {...radioGroupProps} ref={forwardedRef} />;
  }
);

MenubarRadioGroup.displayName = RADIO_GROUP_NAME;

/* -------------------------------------------------------------------------------------------------
 * MenubarRadioItem
 * -----------------------------------------------------------------------------------------------*/

const RADIO_ITEM_NAME = 'MenubarRadioItem';

type MenubarRadioItemElement = React.ElementRef<typeof MenuPrimitive.RadioItem>;
type MenuRadioItemProps = Radix.ComponentPropsWithoutRef<typeof MenuPrimitive.RadioItem>;
interface MenubarRadioItemProps extends MenuRadioItemProps {}

const MenubarRadioItem = React.forwardRef<MenubarRadioItemElement, MenubarRadioItemProps>(
  (props: ScopedProps<MenubarRadioItemProps>, forwardedRef) => {
    const { __scopeMenubar, ...radioItemProps } = props;
    const menuScope = useMenuScope(__scopeMenubar);
    return <MenuPrimitive.RadioItem {...menuScope} {...radioItemProps} ref={forwardedRef} />;
  }
);

MenubarRadioItem.displayName = RADIO_ITEM_NAME;

/* -------------------------------------------------------------------------------------------------
 * MenubarItemIndicator
 * -----------------------------------------------------------------------------------------------*/

const INDICATOR_NAME = 'MenubarItemIndicator';

type MenubarItemIndicatorElement = React.ElementRef<typeof MenuPrimitive.ItemIndicator>;
type MenuItemIndicatorProps = Radix.ComponentPropsWithoutRef<typeof MenuPrimitive.ItemIndicator>;
interface MenubarItemIndicatorProps extends MenuItemIndicatorProps {}

const MenubarItemIndicator = React.forwardRef<
  MenubarItemIndicatorElement,
  MenubarItemIndicatorProps
>((props: ScopedProps<MenubarItemIndicatorProps>, forwardedRef) => {
  const { __scopeMenubar, ...itemIndicatorProps } = props;
  const menuScope = useMenuScope(__scopeMenubar);
  return <MenuPrimitive.ItemIndicator {...menuScope} {...itemIndicatorProps} ref={forwardedRef} />;
});

MenubarItemIndicator.displayName = INDICATOR_NAME;

/* -------------------------------------------------------------------------------------------------
 * MenubarSeparator
 * -----------------------------------------------------------------------------------------------*/

const SEPARATOR_NAME = 'MenubarSeparator';

type MenubarSeparatorElement = React.ElementRef<typeof MenuPrimitive.Separator>;
type MenuSeparatorProps = Radix.ComponentPropsWithoutRef<typeof MenuPrimitive.Separator>;
interface MenubarSeparatorProps extends MenuSeparatorProps {}

const MenubarSeparator = React.forwardRef<MenubarSeparatorElement, MenubarSeparatorProps>(
  (props: ScopedProps<MenubarSeparatorProps>, forwardedRef) => {
    const { __scopeMenubar, ...separatorProps } = props;
    const menuScope = useMenuScope(__scopeMenubar);
    return <MenuPrimitive.Separator {...menuScope} {...separatorProps} ref={forwardedRef} />;
  }
);

MenubarSeparator.displayName = SEPARATOR_NAME;

/* -------------------------------------------------------------------------------------------------
 * MenubarArrow
 * -----------------------------------------------------------------------------------------------*/

const ARROW_NAME = 'MenubarArrow';

type MenubarArrowElement = React.ElementRef<typeof MenuPrimitive.Arrow>;
type MenuArrowProps = Radix.ComponentPropsWithoutRef<typeof MenuPrimitive.Arrow>;
interface MenubarArrowProps extends MenuArrowProps {}

const MenubarArrow = React.forwardRef<MenubarArrowElement, MenubarArrowProps>(
  (props: ScopedProps<MenubarArrowProps>, forwardedRef) => {
    const { __scopeMenubar, ...arrowProps } = props;
    const menuScope = useMenuScope(__scopeMenubar);
    return <MenuPrimitive.Arrow {...menuScope} {...arrowProps} ref={forwardedRef} />;
  }
);

MenubarArrow.displayName = ARROW_NAME;

/* -------------------------------------------------------------------------------------------------
 * MenubarSubMenu
 * -----------------------------------------------------------------------------------------------*/

interface MenubarSubMenuProps {
  children?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?(open: boolean): void;
}

const MenubarSubMenu: React.FC<MenubarSubMenuProps> = (props: ScopedProps<MenubarSubMenuProps>) => {
  const { __scopeMenubar, children, open: openProp, onOpenChange, defaultOpen } = props;
  const menuScope = useMenuScope(__scopeMenubar);
  const [open = false, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  });

  return (
    <MenuPrimitive.Sub {...menuScope} open={open} onOpenChange={setOpen}>
      {children}
    </MenuPrimitive.Sub>
  );
};

/* -------------------------------------------------------------------------------------------------
 * MenubarSubTrigger
 * -----------------------------------------------------------------------------------------------*/

const SUB_TRIGGER_NAME = 'MenubarSubTrigger';

type MenubarSubTriggerElement = React.ElementRef<typeof MenuPrimitive.SubTrigger>;
type MenuSubTriggerProps = Radix.ComponentPropsWithoutRef<typeof MenuPrimitive.SubTrigger>;
interface MenubarSubTriggerProps extends MenuSubTriggerProps {}

const MenubarSubTrigger = React.forwardRef<MenubarSubTriggerElement, MenubarSubTriggerProps>(
  (props: ScopedProps<MenubarSubTriggerProps>, forwardedRef) => {
    const { __scopeMenubar, ...subTriggerProps } = props;
    const menuScope = useMenuScope(__scopeMenubar);
    return <MenuPrimitive.SubTrigger {...menuScope} {...subTriggerProps} ref={forwardedRef} />;
  }
);

MenubarSubTrigger.displayName = SUB_TRIGGER_NAME;

/* -------------------------------------------------------------------------------------------------
 * MenubarSubContent
 * -----------------------------------------------------------------------------------------------*/

const SUB_CONTENT_NAME = 'MenubarSubContent';

type MenubarSubContentElement = React.ElementRef<typeof MenuPrimitive.Content>;
type MenuSubContentProps = Radix.ComponentPropsWithoutRef<typeof MenuPrimitive.SubContent>;
interface MenubarSubContentProps extends MenuSubContentProps {}

const MenubarSubContent = React.forwardRef<MenubarSubContentElement, MenubarSubContentProps>(
  (props: ScopedProps<MenubarSubContentProps>, forwardedRef) => {
    const { __scopeMenubar, ...subContentProps } = props;
    const menuScope = useMenuScope(__scopeMenubar);

    return (
      <MenuPrimitive.SubContent
        {...menuScope}
        {...subContentProps}
        ref={forwardedRef}
        style={{
          ...props.style,
          // re-namespace exposed content custom property
          ['--radix-menubar-content-transform-origin' as any]:
            'var(--radix-popper-transform-origin)',
        }}
      />
    );
  }
);

MenubarSubContent.displayName = SUB_CONTENT_NAME;

/* -----------------------------------------------------------------------------------------------*/

const Root = Menubar;
const Menu = MenubarMenu;
const Trigger = MenubarTrigger;
const Portal = MenubarPortal;
const Content = MenubarContent;
const Group = MenubarGroup;
const Label = MenubarLabel;
const Item = MenubarItem;
const CheckboxItem = MenubarCheckboxItem;
const RadioGroup = MenubarRadioGroup;
const RadioItem = MenubarRadioItem;
const ItemIndicator = MenubarItemIndicator;
const Separator = MenubarSeparator;
const Arrow = MenubarArrow;
const SubMenu = MenubarSubMenu;
const SubTrigger = MenubarSubTrigger;
const SubContent = MenubarSubContent;

export {
  createMenubarScope,
  //
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarPortal,
  MenubarContent,
  MenubarGroup,
  MenubarLabel,
  MenubarItem,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarItemIndicator,
  MenubarSeparator,
  MenubarArrow,
  MenubarSubMenu,
  MenubarSubTrigger,
  MenubarSubContent,
  //
  Root,
  Menu,
  Trigger,
  Portal,
  Content,
  Group,
  Label,
  Item,
  CheckboxItem,
  RadioGroup,
  RadioItem,
  ItemIndicator,
  Separator,
  Arrow,
  SubMenu,
  SubTrigger,
  SubContent,
};
export type {
  MenubarProps,
  MenubarMenuProps,
  MenubarTriggerProps,
  MenubarPortalProps,
  MenubarContentProps,
  MenubarGroupProps,
  MenubarLabelProps,
  MenubarItemProps,
  MenubarCheckboxItemProps,
  MenubarRadioGroupProps,
  MenubarRadioItemProps,
  MenubarItemIndicatorProps,
  MenubarSeparatorProps,
  MenubarArrowProps,
  MenubarSubMenuProps,
  MenubarSubTriggerProps,
  MenubarSubContentProps,
};
