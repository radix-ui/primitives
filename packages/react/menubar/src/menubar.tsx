import * as React from 'react';
import { createCollection } from '@radix-ui/react-collection';
import { useDirection } from '@radix-ui/react-direction';
import { composeEventHandlers } from '@radix-ui/primitive';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import { createContextScope } from '@radix-ui/react-context';
import { useId } from '@radix-ui/react-id';
import * as MenuPrimitive from '@radix-ui/react-menu';
import { createMenuScope } from '@radix-ui/react-menu';
import * as RovingFocusGroup from '@radix-ui/react-roving-focus';
import { createRovingFocusGroupScope } from '@radix-ui/react-roving-focus';
import { Primitive } from '@radix-ui/react-primitive';
import { useControllableState } from '@radix-ui/react-use-controllable-state';

import type { Scope } from '@radix-ui/react-context';

type Direction = 'ltr' | 'rtl';

/* -------------------------------------------------------------------------------------------------
 * Menubar
 * -----------------------------------------------------------------------------------------------*/

const MENUBAR_NAME = 'Menubar';

type ItemData = { value: string; disabled: boolean };
const [Collection, useCollection, createCollectionScope] = createCollection<
  MenubarTriggerElement,
  ItemData
>(MENUBAR_NAME);

type ScopedProps<P> = P & { __scopeMenubar?: Scope };
const [createMenubarContext, createMenubarScope] = createContextScope(MENUBAR_NAME, [
  createCollectionScope,
  createRovingFocusGroupScope,
]);

const useMenuScope = createMenuScope();
const useRovingFocusGroupScope = createRovingFocusGroupScope();

type MenubarContextValue = {
  value: string;
  dir: Direction;
  loop: boolean;
  onMenuOpen(value: string): void;
  onMenuClose(): void;
  onMenuToggle(value: string): void;
};

const [MenubarContextProvider, useMenubarContext] =
  createMenubarContext<MenubarContextValue>(MENUBAR_NAME);

type MenubarElement = React.ElementRef<typeof Primitive.div>;
type RovingFocusGroupProps = React.ComponentPropsWithoutRef<typeof RovingFocusGroup.Root>;
type PrimitiveDivProps = React.ComponentPropsWithoutRef<typeof Primitive.div>;
interface MenubarProps extends PrimitiveDivProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  loop?: RovingFocusGroupProps['loop'];
  dir?: RovingFocusGroupProps['dir'];
}

const Menubar = React.forwardRef<MenubarElement, MenubarProps>(
  (props: ScopedProps<MenubarProps>, forwardedRef) => {
    const {
      __scopeMenubar,
      value: valueProp,
      onValueChange,
      defaultValue,
      loop = true,
      dir,
      ...menubarProps
    } = props;
    const direction = useDirection(dir);
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeMenubar);
    const [value, setValue] = useControllableState({
      prop: valueProp,
      onChange: onValueChange,
      defaultProp: defaultValue ?? '',
      caller: MENUBAR_NAME,
    });

    // We need to manage tab stop id manually as `RovingFocusGroup` updates the stop
    // based on focus, and in some situations our triggers won't ever be given focus
    // (e.g. click to open and then outside to close)
    const [currentTabStopId, setCurrentTabStopId] = React.useState<string | null>(null);

    return (
      <MenubarContextProvider
        scope={__scopeMenubar}
        value={value}
        onMenuOpen={React.useCallback(
          (value) => {
            setValue(value);
            setCurrentTabStopId(value);
          },
          [setValue]
        )}
        onMenuClose={React.useCallback(() => setValue(''), [setValue])}
        onMenuToggle={React.useCallback(
          (value) => {
            setValue((prevValue) => (prevValue ? '' : value));
            // `openMenuOpen` and `onMenuToggle` are called exclusively so we
            // need to update the id in either case.
            setCurrentTabStopId(value);
          },
          [setValue]
        )}
        dir={direction}
        loop={loop}
      >
        <Collection.Provider scope={__scopeMenubar}>
          <Collection.Slot scope={__scopeMenubar}>
            <RovingFocusGroup.Root
              asChild
              {...rovingFocusGroupScope}
              orientation="horizontal"
              loop={loop}
              dir={direction}
              currentTabStopId={currentTabStopId}
              onCurrentTabStopIdChange={setCurrentTabStopId}
            >
              <Primitive.div role="menubar" {...menubarProps} ref={forwardedRef} />
            </RovingFocusGroup.Root>
          </Collection.Slot>
        </Collection.Provider>
      </MenubarContextProvider>
    );
  }
);

Menubar.displayName = MENUBAR_NAME;

/* -------------------------------------------------------------------------------------------------
 * MenubarMenu
 * -----------------------------------------------------------------------------------------------*/

const MENU_NAME = 'MenubarMenu';

type MenubarMenuContextValue = {
  value: string;
  triggerId: string;
  triggerRef: React.RefObject<MenubarTriggerElement | null>;
  contentId: string;
  wasKeyboardTriggerOpenRef: React.MutableRefObject<boolean>;
};

const [MenubarMenuProvider, useMenubarMenuContext] =
  createMenubarContext<MenubarMenuContextValue>(MENU_NAME);

interface MenubarMenuProps {
  value?: string;
  children?: React.ReactNode;
}

const MenubarMenu = (props: ScopedProps<MenubarMenuProps>) => {
  const { __scopeMenubar, value: valueProp, ...menuProps } = props;
  const autoValue = useId();
  // We need to provide an initial deterministic value as `useId` will return
  // empty string on the first render and we don't want to match our internal "closed" value.
  const value = valueProp || autoValue || 'LEGACY_REACT_AUTO_VALUE';
  const context = useMenubarContext(MENU_NAME, __scopeMenubar);
  const menuScope = useMenuScope(__scopeMenubar);
  const triggerRef = React.useRef<MenubarTriggerElement>(null);
  const wasKeyboardTriggerOpenRef = React.useRef(false);
  const open = context.value === value;

  React.useEffect(() => {
    if (!open) wasKeyboardTriggerOpenRef.current = false;
  }, [open]);

  return (
    <MenubarMenuProvider
      scope={__scopeMenubar}
      value={value}
      triggerId={useId()}
      triggerRef={triggerRef}
      contentId={useId()}
      wasKeyboardTriggerOpenRef={wasKeyboardTriggerOpenRef}
    >
      <MenuPrimitive.Root
        {...menuScope}
        open={open}
        onOpenChange={(open) => {
          // Menu only calls `onOpenChange` when dismissing so we
          // want to close our MenuBar based on the same events.
          if (!open) context.onMenuClose();
        }}
        modal={false}
        dir={context.dir}
        {...menuProps}
      />
    </MenubarMenuProvider>
  );
};

MenubarMenu.displayName = MENU_NAME;

/* -------------------------------------------------------------------------------------------------
 * MenubarTrigger
 * -----------------------------------------------------------------------------------------------*/

const TRIGGER_NAME = 'MenubarTrigger';

type MenubarTriggerElement = React.ElementRef<typeof Primitive.button>;
type PrimitiveButtonProps = React.ComponentPropsWithoutRef<typeof Primitive.button>;
interface MenubarTriggerProps extends PrimitiveButtonProps {}

const MenubarTrigger = React.forwardRef<MenubarTriggerElement, MenubarTriggerProps>(
  (props: ScopedProps<MenubarTriggerProps>, forwardedRef) => {
    const { __scopeMenubar, disabled = false, ...triggerProps } = props;
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeMenubar);
    const menuScope = useMenuScope(__scopeMenubar);
    const context = useMenubarContext(TRIGGER_NAME, __scopeMenubar);
    const menuContext = useMenubarMenuContext(TRIGGER_NAME, __scopeMenubar);
    const ref = React.useRef<MenubarTriggerElement>(null);
    const composedRefs = useComposedRefs(forwardedRef, ref, menuContext.triggerRef);
    const [isFocused, setIsFocused] = React.useState(false);
    const open = context.value === menuContext.value;

    return (
      <Collection.ItemSlot scope={__scopeMenubar} value={menuContext.value} disabled={disabled}>
        <RovingFocusGroup.Item
          asChild
          {...rovingFocusGroupScope}
          focusable={!disabled}
          tabStopId={menuContext.value}
        >
          <MenuPrimitive.Anchor asChild {...menuScope}>
            <Primitive.button
              type="button"
              role="menuitem"
              id={menuContext.triggerId}
              aria-haspopup="menu"
              aria-expanded={open}
              aria-controls={open ? menuContext.contentId : undefined}
              data-highlighted={isFocused ? '' : undefined}
              data-state={open ? 'open' : 'closed'}
              data-disabled={disabled ? '' : undefined}
              disabled={disabled}
              {...triggerProps}
              ref={composedRefs}
              onPointerDown={composeEventHandlers(props.onPointerDown, (event) => {
                // only call handler if it's the left button (mousedown gets triggered by all mouse buttons)
                // but not when the control key is pressed (avoiding MacOS right click)
                if (!disabled && event.button === 0 && event.ctrlKey === false) {
                  context.onMenuOpen(menuContext.value);
                  // prevent trigger focusing when opening
                  // this allows the content to be given focus without competition
                  if (!open) event.preventDefault();
                }
              })}
              onPointerEnter={composeEventHandlers(props.onPointerEnter, () => {
                const menubarOpen = Boolean(context.value);
                if (menubarOpen && !open) {
                  context.onMenuOpen(menuContext.value);
                  ref.current?.focus();
                }
              })}
              onKeyDown={composeEventHandlers(props.onKeyDown, (event) => {
                if (disabled) return;
                if (['Enter', ' '].includes(event.key)) context.onMenuToggle(menuContext.value);
                if (event.key === 'ArrowDown') context.onMenuOpen(menuContext.value);
                // prevent keydown from scrolling window / first focused item to execute
                // that keydown (inadvertently closing the menu)
                if (['Enter', ' ', 'ArrowDown'].includes(event.key)) {
                  menuContext.wasKeyboardTriggerOpenRef.current = true;
                  event.preventDefault();
                }
              })}
              onFocus={composeEventHandlers(props.onFocus, () => setIsFocused(true))}
              onBlur={composeEventHandlers(props.onBlur, () => setIsFocused(false))}
            />
          </MenuPrimitive.Anchor>
        </RovingFocusGroup.Item>
      </Collection.ItemSlot>
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
type MenuContentProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.Content>;
interface MenubarContentProps extends Omit<MenuContentProps, 'onEntryFocus'> {}

const MenubarContent = React.forwardRef<MenubarContentElement, MenubarContentProps>(
  (props: ScopedProps<MenubarContentProps>, forwardedRef) => {
    const { __scopeMenubar, align = 'start', ...contentProps } = props;
    const menuScope = useMenuScope(__scopeMenubar);
    const context = useMenubarContext(CONTENT_NAME, __scopeMenubar);
    const menuContext = useMenubarMenuContext(CONTENT_NAME, __scopeMenubar);
    const getItems = useCollection(__scopeMenubar);
    const hasInteractedOutsideRef = React.useRef(false);

    return (
      <MenuPrimitive.Content
        id={menuContext.contentId}
        aria-labelledby={menuContext.triggerId}
        data-radix-menubar-content=""
        {...menuScope}
        {...contentProps}
        ref={forwardedRef}
        align={align}
        onCloseAutoFocus={composeEventHandlers(props.onCloseAutoFocus, (event) => {
          const menubarOpen = Boolean(context.value);
          if (!menubarOpen && !hasInteractedOutsideRef.current) {
            menuContext.triggerRef.current?.focus();
          }

          hasInteractedOutsideRef.current = false;
          // Always prevent auto focus because we either focus manually or want user agent focus
          event.preventDefault();
        })}
        onFocusOutside={composeEventHandlers(props.onFocusOutside, (event) => {
          const target = event.target as HTMLElement;
          const isMenubarTrigger = getItems().some((item) => item.ref.current?.contains(target));
          if (isMenubarTrigger) event.preventDefault();
        })}
        onInteractOutside={composeEventHandlers(props.onInteractOutside, () => {
          hasInteractedOutsideRef.current = true;
        })}
        onEntryFocus={(event) => {
          if (!menuContext.wasKeyboardTriggerOpenRef.current) event.preventDefault();
        }}
        onKeyDown={composeEventHandlers(
          props.onKeyDown,
          (event) => {
            if (['ArrowRight', 'ArrowLeft'].includes(event.key)) {
              const target = event.target as HTMLElement;
              const targetIsSubTrigger = target.hasAttribute('data-radix-menubar-subtrigger');
              const isKeyDownInsideSubMenu =
                target.closest('[data-radix-menubar-content]') !== event.currentTarget;

              const prevMenuKey = context.dir === 'rtl' ? 'ArrowRight' : 'ArrowLeft';
              const isPrevKey = prevMenuKey === event.key;
              const isNextKey = !isPrevKey;

              // Prevent navigation when we're opening a submenu
              if (isNextKey && targetIsSubTrigger) return;
              // or we're inside a submenu and are moving backwards to close it
              if (isKeyDownInsideSubMenu && isPrevKey) return;

              const items = getItems().filter((item) => !item.disabled);
              let candidateValues = items.map((item) => item.value);
              if (isPrevKey) candidateValues.reverse();

              const currentIndex = candidateValues.indexOf(menuContext.value);

              candidateValues = context.loop
                ? wrapArray(candidateValues, currentIndex + 1)
                : candidateValues.slice(currentIndex + 1);

              const [nextValue] = candidateValues;
              if (nextValue) context.onMenuOpen(nextValue);
            }
          },
          { checkForDefaultPrevented: false }
        )}
        style={{
          ...props.style,
          // re-namespace exposed content custom properties
          ...{
            '--radix-menubar-content-transform-origin': 'var(--radix-popper-transform-origin)',
            '--radix-menubar-content-available-width': 'var(--radix-popper-available-width)',
            '--radix-menubar-content-available-height': 'var(--radix-popper-available-height)',
            '--radix-menubar-trigger-width': 'var(--radix-popper-anchor-width)',
            '--radix-menubar-trigger-height': 'var(--radix-popper-anchor-height)',
          },
        }}
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
type MenuGroupProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.Group>;
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
type MenuLabelProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.Label>;
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
type MenuItemProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.Item>;
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
type MenuCheckboxItemProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.CheckboxItem>;
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
type MenuRadioGroupProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.RadioGroup>;
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
type MenuRadioItemProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.RadioItem>;
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
type MenuItemIndicatorProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.ItemIndicator>;
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
type MenuSeparatorProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.Separator>;
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
type MenuArrowProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.Arrow>;
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
 * MenubarSub
 * -----------------------------------------------------------------------------------------------*/

const SUB_NAME = 'MenubarSub';

interface MenubarSubProps {
  children?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?(open: boolean): void;
}

const MenubarSub: React.FC<MenubarSubProps> = (props: ScopedProps<MenubarSubProps>) => {
  const { __scopeMenubar, children, open: openProp, onOpenChange, defaultOpen } = props;
  const menuScope = useMenuScope(__scopeMenubar);
  const [open, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen ?? false,
    onChange: onOpenChange,
    caller: SUB_NAME,
  });

  return (
    <MenuPrimitive.Sub {...menuScope} open={open} onOpenChange={setOpen}>
      {children}
    </MenuPrimitive.Sub>
  );
};

MenubarSub.displayName = SUB_NAME;

/* -------------------------------------------------------------------------------------------------
 * MenubarSubTrigger
 * -----------------------------------------------------------------------------------------------*/

const SUB_TRIGGER_NAME = 'MenubarSubTrigger';

type MenubarSubTriggerElement = React.ElementRef<typeof MenuPrimitive.SubTrigger>;
type MenuSubTriggerProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.SubTrigger>;
interface MenubarSubTriggerProps extends MenuSubTriggerProps {}

const MenubarSubTrigger = React.forwardRef<MenubarSubTriggerElement, MenubarSubTriggerProps>(
  (props: ScopedProps<MenubarSubTriggerProps>, forwardedRef) => {
    const { __scopeMenubar, ...subTriggerProps } = props;
    const menuScope = useMenuScope(__scopeMenubar);
    return (
      <MenuPrimitive.SubTrigger
        data-radix-menubar-subtrigger=""
        {...menuScope}
        {...subTriggerProps}
        ref={forwardedRef}
      />
    );
  }
);

MenubarSubTrigger.displayName = SUB_TRIGGER_NAME;

/* -------------------------------------------------------------------------------------------------
 * MenubarSubContent
 * -----------------------------------------------------------------------------------------------*/

const SUB_CONTENT_NAME = 'MenubarSubContent';

type MenubarSubContentElement = React.ElementRef<typeof MenuPrimitive.Content>;
type MenuSubContentProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.SubContent>;
interface MenubarSubContentProps extends MenuSubContentProps {}

const MenubarSubContent = React.forwardRef<MenubarSubContentElement, MenubarSubContentProps>(
  (props: ScopedProps<MenubarSubContentProps>, forwardedRef) => {
    const { __scopeMenubar, ...subContentProps } = props;
    const menuScope = useMenuScope(__scopeMenubar);

    return (
      <MenuPrimitive.SubContent
        {...menuScope}
        data-radix-menubar-content=""
        {...subContentProps}
        ref={forwardedRef}
        style={{
          ...props.style,
          // re-namespace exposed content custom properties
          ...{
            '--radix-menubar-content-transform-origin': 'var(--radix-popper-transform-origin)',
            '--radix-menubar-content-available-width': 'var(--radix-popper-available-width)',
            '--radix-menubar-content-available-height': 'var(--radix-popper-available-height)',
            '--radix-menubar-trigger-width': 'var(--radix-popper-anchor-width)',
            '--radix-menubar-trigger-height': 'var(--radix-popper-anchor-height)',
          },
        }}
      />
    );
  }
);

MenubarSubContent.displayName = SUB_CONTENT_NAME;

/* -----------------------------------------------------------------------------------------------*/

/**
 * Wraps an array around itself at a given start index
 * Example: `wrapArray(['a', 'b', 'c', 'd'], 2) === ['c', 'd', 'a', 'b']`
 */
function wrapArray<T>(array: T[], startIndex: number) {
  return array.map<T>((_, index) => array[(startIndex + index) % array.length]!);
}

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
const Sub = MenubarSub;
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
  MenubarSub,
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
  Sub,
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
  MenubarSubProps,
  MenubarSubTriggerProps,
  MenubarSubContentProps,
};
