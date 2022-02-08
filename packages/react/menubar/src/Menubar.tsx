import * as React from 'react';
import { createCollection } from '@radix-ui/react-collection';
import { createContextScope } from '@radix-ui/react-context';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import * as RovingFocusGroup from '@radix-ui/react-roving-focus';
import { createRovingFocusGroupScope } from '@radix-ui/react-roving-focus';
import { createDropdownMenuScope } from '@radix-ui/react-dropdown-menu';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';

import type { Scope } from '@radix-ui/react-context';
import type * as Radix from '@radix-ui/react-primitive';

/* -------------------------------------------------------------------------------------------------
 * Menubar
 * -----------------------------------------------------------------------------------------------*/

const MENUBAR_NAME = 'Menubar';

type ItemData = {
  disabled?: boolean;
};
const [Collection, useCollection, createCollectionScope] = createCollection<
  MenubarTriggerElement,
  ItemData
>(MENUBAR_NAME);

type ScopedProps<P> = P & { __scopeMenubar?: Scope };
const [createMenuContext, createMenuScope] = createContextScope(MENUBAR_NAME, [
  createCollectionScope,
  createRovingFocusGroupScope,
]);
const useDropdownMenuScope = createDropdownMenuScope();
const useRovingFocusGroupScope = createRovingFocusGroupScope();

type MenubarRootContextValue = {
  setCurrentTabId(id: string | null): void;
  currentTabId: null | string;
  setCurrentTabId(id: string): void;
};

const [MenubarProvider, useMenubarContext] =
  createMenuContext<MenubarRootContextValue>(MENUBAR_NAME);

interface MenubarProps {
  children?: React.ReactNode;
}

const Menubar: React.FC<MenubarProps> = (props: ScopedProps<MenubarProps>) => {
  const { __scopeMenubar, children, ...MenubarProps } = props;
  const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeMenubar);
  const [currentTabId, setCurrentTabId] = React.useState<string | null>(null);

  return (
    <MenubarProvider
      scope={__scopeMenubar}
      currentTabId={currentTabId}
      setCurrentTabId={setCurrentTabId}
    >
      <Collection.Provider scope={__scopeMenubar}>
        <RovingFocusGroup.Root
          {...rovingFocusGroupScope}
          loop
          role="menubar"
          orientation="horizontal"
          {...MenubarProps}
        >
          {children}
        </RovingFocusGroup.Root>
      </Collection.Provider>
    </MenubarProvider>
  );
};

/* -------------------------------------------------------------------------------------------------
 * MenubarMenu
 * -----------------------------------------------------------------------------------------------*/

const MENU_NAME = 'Menu';

interface MenubarMenuProps extends Radix.PrimitivePropsWithRef<typeof DropdownMenuPrimitive.Root> {}

const MenubarMenu = (props: ScopedProps<MenubarMenuProps>) => {
  const { __scopeMenubar, ...menuProps } = props;
  const dropdownMenuScope = useDropdownMenuScope(__scopeMenubar);

  return <DropdownMenuPrimitive.Root {...dropdownMenuScope} modal={false} {...menuProps} />;
};

MenubarMenu.displayName = MENU_NAME;

/* -------------------------------------------------------------------------------------------------
 * MenubarTrigger
 * -----------------------------------------------------------------------------------------------*/

const TRIGGER_NAME = 'MenubarTrigger';

type MenubarTriggerElement = React.ElementRef<typeof DropdownMenuPrimitive.Trigger>;
interface MenubarTriggerProps
  extends Radix.PrimitivePropsWithRef<typeof DropdownMenuPrimitive.Trigger> {
  disabled?: boolean;
}

const MenubarTrigger = React.forwardRef<MenubarTriggerElement, MenubarTriggerProps>(
  (props: ScopedProps<MenubarTriggerProps>, forwardedRef) => {
    const { __scopeMenubar, disabled = false, ...menuProps } = props;
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeMenubar);
    const ref = React.useRef<MenubarTriggerElement>(null);
    const context = useMenubarContext(TRIGGER_NAME, __scopeMenubar);
    const dropdownMenuScope = useDropdownMenuScope(__scopeMenubar);

    return (
      <Collection.ItemSlot scope={__scopeMenubar}>
        <Collection.Slot scope={__scopeMenubar}>
          <RovingFocusGroup.Item asChild {...rovingFocusGroupScope} focusable={!disabled}>
            <DropdownMenuPrimitive.Trigger
              {...dropdownMenuScope}
              ref={useComposedRefs(forwardedRef, ref)}
              onKeyDown={(event: React.KeyboardEvent) => {
                /**
                 * TODO Method 1. Listen to OPEN events when the triggers are focused to
                 * let the context know which menu has been opened
                 */
                const id = ref.current?.getAttribute('id') || null;
                const OPEN_KEYS = ['Enter', ' ', 'ArrowDown'];
                if (OPEN_KEYS.includes(event.key) && context.currentTabId !== id) {
                  context.setCurrentTabId(id);
                }
              }}
              {...menuProps}
            />
          </RovingFocusGroup.Item>
        </Collection.Slot>
      </Collection.ItemSlot>
    );
  }
);

MenubarTrigger.displayName = TRIGGER_NAME;

/* -------------------------------------------------------------------------------------------------
 * MenubarSubMenuTrigger
 * -----------------------------------------------------------------------------------------------*/

const MENUBAR_SUBMENU_TRIGGER = 'MenubarSubmenuTrigger';

type MenubarSubMenuTriggerElement = React.ElementRef<typeof DropdownMenuPrimitive.TriggerItem>;
interface MenubarSubMenuTriggerProps
  extends Radix.PrimitivePropsWithRef<typeof DropdownMenuPrimitive.TriggerItem> {
  disabled?: boolean;
}

const MenubarSubMenuTrigger = React.forwardRef<
  MenubarSubMenuTriggerElement,
  MenubarSubMenuTriggerProps
>((props: ScopedProps<MenubarSubMenuTriggerProps>, forwardedRef) => {
  const { __scopeMenubar, ...subMenuTriggerProps } = props;
  const dropdownMenuScope = useDropdownMenuScope(__scopeMenubar);
  return (
    <DropdownMenuPrimitive.TriggerItem
      ref={forwardedRef}
      {...dropdownMenuScope}
      {...subMenuTriggerProps}
    />
  );
});

MenubarSubMenuTrigger.displayName = MENUBAR_SUBMENU_TRIGGER;

/* -------------------------------------------------------------------------------------------------
 * MenubarContent
 * -----------------------------------------------------------------------------------------------*/

const MENUBAR_CONTENT = 'MenubarContent';

type MenubarContentElement = React.ElementRef<typeof DropdownMenuPrimitive.Content>;
interface MenubarContentProps
  extends Radix.PrimitivePropsWithRef<typeof DropdownMenuPrimitive.Content> {}

const MenubarContent = React.forwardRef<MenubarContentElement, MenubarContentProps>(
  (props: ScopedProps<MenubarContentProps>, forwardedRef) => {
    const { __scopeMenubar, ...contentProps } = props;
    const dropdownMenuScope = useDropdownMenuScope(__scopeMenubar);

    return (
      <DropdownMenuPrimitive.Content
        {...dropdownMenuScope}
        portalled={false}
        ref={forwardedRef}
        loop
        {...contentProps}
      />
    );
  }
);

MenubarContent.displayName = MENUBAR_CONTENT;

/* -------------------------------------------------------------------------------------------------
 * MenubarItem
 * -----------------------------------------------------------------------------------------------*/

const MENUBAR_ITEM_NAME = 'MenubarItem';

type MenubarItemElement = React.ElementRef<typeof DropdownMenuPrimitive.Item>;
interface MenubarItemProps extends Radix.PrimitivePropsWithRef<typeof DropdownMenuPrimitive.Item> {
  disabled?: boolean;
}

const MenubarItem = React.forwardRef<MenubarItemElement, MenubarItemProps>(
  (props: ScopedProps<MenubarItemProps>, forwardedRef) => {
    const { __scopeMenubar, disabled = false, ...itemProps } = props;
    const dropdownMenuScope = useDropdownMenuScope(__scopeMenubar);
    const ref = React.useRef<HTMLDivElement>(null);
    const context = useMenubarContext(MENUBAR_ITEM_NAME, __scopeMenubar);
    const composedRefs = useComposedRefs(forwardedRef, ref);
    const getItems = useCollection(__scopeMenubar);

    return (
      <DropdownMenuPrimitive.Item
        {...dropdownMenuScope}
        ref={composedRefs}
        onKeyDown={(event: React.KeyboardEvent) => {
          /**
           * TODO define menubar submenu navigation. Abstract this listener to a impl common
           * to subTriggers and items.
           *
           * 1. On ArrowLeft, check if element is within a submenu to navigate or close
           * 2. On ArrowRight, check if aria-haspopup (or any other hint) to know if next menubar tab
           *    should be focused
           */
          if (['ArrowRight', 'ArrowLeft'].includes(event.key)) {
            const items = getItems().filter((item) => !item.disabled);
            const candidateNodes = items.map((item) => item.ref.current!);
            // TODO
            console.log(candidateNodes);
            console.log(context.currentTabId);
          }
        }}
        {...itemProps}
      />
    );
  }
);

MenubarItem.displayName = MENUBAR_ITEM_NAME;

/* ---------------------------------------------------------------------------------------------- */

export {
  Menubar as Root,
  MenubarMenu as Menu,
  MenubarTrigger as Trigger,
  MenubarSubMenuTrigger as TriggerItem,
  MenubarContent as Content,
  MenubarItem as Item,
  createMenuScope,
};
