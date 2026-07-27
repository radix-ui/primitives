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

const Direction = {
  LTR: 'ltr',
  RTL: 'rtl',
} as const;

type Direction = (typeof Direction)[keyof typeof Direction];

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

type MenubarElement = React.ComponentRef<typeof Primitive.div>;
type RovingFocusGroupProps = React.ComponentPropsWithoutRef<typeof RovingFocusGroup.Root>;
type PrimitiveDivProps = React.ComponentPropsWithoutRef<typeof Primitive.div>;
interface MenubarProps extends PrimitiveDivProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  loop?: RovingFocusGroupProps['loop'];
  dir?: RovingFocusGroupProps['dir'];
}

const Menubar = /* @__PURE__ */ React.forwardRef<MenubarElement, MenubarProps>(
  // blank line to reduce diff noise
  function Menubar(props: ScopedProps<MenubarProps>, forwardedRef) {
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
          [setValue],
        )}
        onMenuClose={React.useCallback(() => setValue(''), [setValue])}
        onMenuToggle={React.useCallback(
          (value) => {
            setValue((prevValue) => (prevValue ? '' : value));
            // `openMenuOpen` and `onMenuToggle` are called exclusively so we
            // need to update the id in either case.
            setCurrentTabStopId(value);
          },
          [setValue],
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
  },
);

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

/* -------------------------------------------------------------------------------------------------
 * MenubarTrigger
 * -----------------------------------------------------------------------------------------------*/

const TRIGGER_NAME = 'MenubarTrigger';

type MenubarTriggerElement = React.ComponentRef<typeof Primitive.button>;
type PrimitiveButtonProps = React.ComponentPropsWithoutRef<typeof Primitive.button>;
interface MenubarTriggerProps extends PrimitiveButtonProps {}

const MenubarTrigger = /* @__PURE__ */ React.forwardRef<MenubarTriggerElement, MenubarTriggerProps>(
  function MenubarTrigger(props: ScopedProps<MenubarTriggerProps>, forwardedRef) {
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
  },
);

/* -------------------------------------------------------------------------------------------------
 * MenubarPortal
 * -----------------------------------------------------------------------------------------------*/

type MenuPortalProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.Portal>;
interface MenubarPortalProps extends MenuPortalProps {}

const MenubarPortal: React.FC<MenubarPortalProps> = (props: ScopedProps<MenubarPortalProps>) => {
  const { __scopeMenubar, ...portalProps } = props;
  const menuScope = useMenuScope(__scopeMenubar);
  return <MenuPrimitive.Portal {...menuScope} {...portalProps} />;
};

/* -------------------------------------------------------------------------------------------------
 * MenubarContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = 'MenubarContent';

type MenubarContentElement = React.ComponentRef<typeof MenuPrimitive.Content>;
type MenuContentProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.Content>;
interface MenubarContentProps extends Omit<MenuContentProps, 'onEntryFocus'> {}

const MenubarContent = /* @__PURE__ */ React.forwardRef<MenubarContentElement, MenubarContentProps>(
  function MenubarContent(props: ScopedProps<MenubarContentProps>, forwardedRef) {
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

              const prevMenuKey = context.dir === Direction.RTL ? 'ArrowRight' : 'ArrowLeft';
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
          { checkForDefaultPrevented: false },
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
  },
);

/* -------------------------------------------------------------------------------------------------
 * MenubarGroup
 * -----------------------------------------------------------------------------------------------*/

type MenubarGroupElement = React.ComponentRef<typeof MenuPrimitive.Group>;
type MenuGroupProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.Group>;
interface MenubarGroupProps extends MenuGroupProps {}

const MenubarGroup = /* @__PURE__ */ React.forwardRef<MenubarGroupElement, MenubarGroupProps>(
  function MenubarGroup(props: ScopedProps<MenubarGroupProps>, forwardedRef) {
    const { __scopeMenubar, ...groupProps } = props;
    const menuScope = useMenuScope(__scopeMenubar);
    return <MenuPrimitive.Group {...menuScope} {...groupProps} ref={forwardedRef} />;
  },
);

/* -------------------------------------------------------------------------------------------------
 * MenubarLabel
 * -----------------------------------------------------------------------------------------------*/

type MenubarLabelElement = React.ComponentRef<typeof MenuPrimitive.Label>;
type MenuLabelProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.Label>;
interface MenubarLabelProps extends MenuLabelProps {}

const MenubarLabel = /* @__PURE__ */ React.forwardRef<MenubarLabelElement, MenubarLabelProps>(
  function MenubarLabel(props: ScopedProps<MenubarLabelProps>, forwardedRef) {
    const { __scopeMenubar, ...labelProps } = props;
    const menuScope = useMenuScope(__scopeMenubar);
    return <MenuPrimitive.Label {...menuScope} {...labelProps} ref={forwardedRef} />;
  },
);

/* -------------------------------------------------------------------------------------------------
 * MenubarItem
 * -----------------------------------------------------------------------------------------------*/

type MenubarItemElement = React.ComponentRef<typeof MenuPrimitive.Item>;
type MenuItemProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.Item>;
interface MenubarItemProps extends MenuItemProps {}

const MenubarItem = /* @__PURE__ */ React.forwardRef<MenubarItemElement, MenubarItemProps>(
  function MenubarItem(props: ScopedProps<MenubarItemProps>, forwardedRef) {
    const { __scopeMenubar, ...itemProps } = props;
    const menuScope = useMenuScope(__scopeMenubar);
    return <MenuPrimitive.Item {...menuScope} {...itemProps} ref={forwardedRef} />;
  },
);

/* -------------------------------------------------------------------------------------------------
 * MenubarCheckboxItem
 * -----------------------------------------------------------------------------------------------*/

type MenubarCheckboxItemElement = React.ComponentRef<typeof MenuPrimitive.CheckboxItem>;
type MenuCheckboxItemProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.CheckboxItem>;
interface MenubarCheckboxItemProps extends MenuCheckboxItemProps {}

const MenubarCheckboxItem = /* @__PURE__ */ React.forwardRef<
  MenubarCheckboxItemElement,
  MenubarCheckboxItemProps
>(
  // blank line to reduce diff noise
  function MenubarCheckboxItem(props: ScopedProps<MenubarCheckboxItemProps>, forwardedRef) {
    const { __scopeMenubar, ...checkboxItemProps } = props;
    const menuScope = useMenuScope(__scopeMenubar);
    return <MenuPrimitive.CheckboxItem {...menuScope} {...checkboxItemProps} ref={forwardedRef} />;
  },
);

/* -------------------------------------------------------------------------------------------------
 * MenubarRadioGroup
 * -----------------------------------------------------------------------------------------------*/

type MenubarRadioGroupElement = React.ComponentRef<typeof MenuPrimitive.RadioGroup>;
type MenuRadioGroupProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.RadioGroup>;
interface MenubarRadioGroupProps extends MenuRadioGroupProps {}

const MenubarRadioGroup = /* @__PURE__ */ React.forwardRef<
  MenubarRadioGroupElement,
  MenubarRadioGroupProps
>(
  // blank line to reduce diff noise
  function MenubarRadioGroup(props: ScopedProps<MenubarRadioGroupProps>, forwardedRef) {
    const { __scopeMenubar, ...radioGroupProps } = props;
    const menuScope = useMenuScope(__scopeMenubar);
    return <MenuPrimitive.RadioGroup {...menuScope} {...radioGroupProps} ref={forwardedRef} />;
  },
);

/* -------------------------------------------------------------------------------------------------
 * MenubarRadioItem
 * -----------------------------------------------------------------------------------------------*/

type MenubarRadioItemElement = React.ComponentRef<typeof MenuPrimitive.RadioItem>;
type MenuRadioItemProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.RadioItem>;
interface MenubarRadioItemProps extends MenuRadioItemProps {}

const MenubarRadioItem = /* @__PURE__ */ React.forwardRef<
  MenubarRadioItemElement,
  MenubarRadioItemProps
>(
  // blank line to reduce diff noise
  function MenubarRadioItem(props: ScopedProps<MenubarRadioItemProps>, forwardedRef) {
    const { __scopeMenubar, ...radioItemProps } = props;
    const menuScope = useMenuScope(__scopeMenubar);
    return <MenuPrimitive.RadioItem {...menuScope} {...radioItemProps} ref={forwardedRef} />;
  },
);

/* -------------------------------------------------------------------------------------------------
 * MenubarItemIndicator
 * -----------------------------------------------------------------------------------------------*/

type MenubarItemIndicatorElement = React.ComponentRef<typeof MenuPrimitive.ItemIndicator>;
type MenuItemIndicatorProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.ItemIndicator>;
interface MenubarItemIndicatorProps extends MenuItemIndicatorProps {}

const MenubarItemIndicator = /* @__PURE__ */ React.forwardRef<
  MenubarItemIndicatorElement,
  MenubarItemIndicatorProps
>(function MenubarItemIndicator(props: ScopedProps<MenubarItemIndicatorProps>, forwardedRef) {
  const { __scopeMenubar, ...itemIndicatorProps } = props;
  const menuScope = useMenuScope(__scopeMenubar);
  return <MenuPrimitive.ItemIndicator {...menuScope} {...itemIndicatorProps} ref={forwardedRef} />;
});

/* -------------------------------------------------------------------------------------------------
 * MenubarSeparator
 * -----------------------------------------------------------------------------------------------*/

type MenubarSeparatorElement = React.ComponentRef<typeof MenuPrimitive.Separator>;
type MenuSeparatorProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.Separator>;
interface MenubarSeparatorProps extends MenuSeparatorProps {}

const MenubarSeparator = /* @__PURE__ */ React.forwardRef<
  MenubarSeparatorElement,
  MenubarSeparatorProps
>(
  // blank line to reduce diff noise
  function MenubarSeparator(props: ScopedProps<MenubarSeparatorProps>, forwardedRef) {
    const { __scopeMenubar, ...separatorProps } = props;
    const menuScope = useMenuScope(__scopeMenubar);
    return <MenuPrimitive.Separator {...menuScope} {...separatorProps} ref={forwardedRef} />;
  },
);

/* -------------------------------------------------------------------------------------------------
 * MenubarArrow
 * -----------------------------------------------------------------------------------------------*/

type MenubarArrowElement = React.ComponentRef<typeof MenuPrimitive.Arrow>;
type MenuArrowProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.Arrow>;
interface MenubarArrowProps extends MenuArrowProps {}

const MenubarArrow = /* @__PURE__ */ React.forwardRef<MenubarArrowElement, MenubarArrowProps>(
  function MenubarArrow(props: ScopedProps<MenubarArrowProps>, forwardedRef) {
    const { __scopeMenubar, ...arrowProps } = props;
    const menuScope = useMenuScope(__scopeMenubar);
    return <MenuPrimitive.Arrow {...menuScope} {...arrowProps} ref={forwardedRef} />;
  },
);

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

/* -------------------------------------------------------------------------------------------------
 * MenubarSubTrigger
 * -----------------------------------------------------------------------------------------------*/

type MenubarSubTriggerElement = React.ComponentRef<typeof MenuPrimitive.SubTrigger>;
type MenuSubTriggerProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.SubTrigger>;
interface MenubarSubTriggerProps extends MenuSubTriggerProps {}

const MenubarSubTrigger = /* @__PURE__ */ React.forwardRef<
  MenubarSubTriggerElement,
  MenubarSubTriggerProps
>(
  // blank line to reduce diff noise
  function MenubarSubTrigger(props: ScopedProps<MenubarSubTriggerProps>, forwardedRef) {
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
  },
);

/* -------------------------------------------------------------------------------------------------
 * MenubarSubContent
 * -----------------------------------------------------------------------------------------------*/

type MenubarSubContentElement = React.ComponentRef<typeof MenuPrimitive.Content>;
type MenuSubContentProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.SubContent>;
interface MenubarSubContentProps extends MenuSubContentProps {}

const MenubarSubContent = /* @__PURE__ */ React.forwardRef<
  MenubarSubContentElement,
  MenubarSubContentProps
>(
  // blank line to reduce diff noise
  function MenubarSubContent(props: ScopedProps<MenubarSubContentProps>, forwardedRef) {
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
  },
);

/* -----------------------------------------------------------------------------------------------*/

/**
 * Wraps an array around itself at a given start index
 * Example: `wrapArray(['a', 'b', 'c', 'd'], 2) === ['c', 'd', 'a', 'b']`
 */
function wrapArray<T>(array: T[], startIndex: number) {
  return array.map<T>((_, index) => array[(startIndex + index) % array.length]!);
}

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
  Menubar as Root,
  MenubarMenu as Menu,
  MenubarTrigger as Trigger,
  MenubarPortal as Portal,
  MenubarContent as Content,
  MenubarGroup as Group,
  MenubarLabel as Label,
  MenubarItem as Item,
  MenubarCheckboxItem as CheckboxItem,
  MenubarRadioGroup as RadioGroup,
  MenubarRadioItem as RadioItem,
  MenubarItemIndicator as ItemIndicator,
  MenubarSeparator as Separator,
  MenubarArrow as Arrow,
  MenubarSub as Sub,
  MenubarSubTrigger as SubTrigger,
  MenubarSubContent as SubContent,
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
