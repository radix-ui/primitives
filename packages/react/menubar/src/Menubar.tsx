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

const OPEN_KEYS = ['Enter', ' ', 'ArrowDown'];

/* -------------------------------------------------------------------------------------------------
 * Menubar
 * -----------------------------------------------------------------------------------------------*/

const MENUBAR_NAME = 'Menubar';

type ItemData = { disabled: boolean; textValue: string };
const [Collection, useCollection, createCollectionScope] = createCollection<
  MenubarTriggerElement,
  ItemData
>(MENUBAR_NAME);

type ScopedProps<P> = P & { __scopeMenubar?: Scope };
const [createMenubarContext, createMenuScope] = createContextScope(MENUBAR_NAME, [
  createCollectionScope,
  createRovingFocusGroupScope,
]);
const useDropdownMenuScope = createDropdownMenuScope();
const useRovingFocusGroupScope = createRovingFocusGroupScope();

type MenubarRootContextValue = {
  direction: Direction;
  setCurrentTabId(id: string | null): void;
  currentTabId: null | string;
  setCurrentTabId(id: string): void;
};

const [MenubarProvider, useMenubarContext] =
  createMenubarContext<MenubarRootContextValue>(MENUBAR_NAME);

interface MenubarProps {
  direction?: Direction;
  children?: React.ReactNode;
}

const Menubar: React.FC<MenubarProps> = (props: ScopedProps<MenubarProps>) => {
  const { __scopeMenubar, direction = 'ltr', children, ...MenubarProps } = props;
  const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeMenubar);
  const [currentTabId, setCurrentTabId] = React.useState<string | null>(null);

  return (
    <MenubarProvider
      direction={direction}
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

const [MenuProvider, useMenuContext] = createMenubarContext(MENU_NAME, {
  isInsideContent: false,
});

const MenubarMenu = (props: ScopedProps<MenubarMenuProps>) => {
  const { __scopeMenubar, ...menuProps } = props;
  const dropdownMenuScope = useDropdownMenuScope(__scopeMenubar);
  const context = useMenubarContext(MENU_NAME, __scopeMenubar);
  const contentContext = useContentContext(MENU_NAME, __scopeMenubar);
  const ref = React.useRef<HTMLSpanElement>(null);
  const [open, setOpen] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (ref.current?.querySelector(`#${context.currentTabId}`)) {
      setOpen(true);
    }
  }, [context.currentTabId]);

  return (
    <span ref={ref}>
      <MenuProvider isInsideContent={contentContext.isInsideContent} scope={__scopeMenubar}>
        <DropdownMenuPrimitive.Root
          {...dropdownMenuScope}
          open={open}
          onOpenChange={setOpen}
          dir={context.direction}
          modal={false}
          {...menuProps}
        />
      </MenuProvider>
    </span>
  );
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
  textValue?: string;
}

const MenubarTrigger = React.forwardRef<MenubarTriggerElement, MenubarTriggerProps>(
  (props: ScopedProps<MenubarTriggerProps>, forwardedRef) => {
    const { __scopeMenubar, disabled = false, textValue, ...menubarTriggerProps } = props;
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeMenubar);
    const ref = React.useRef<MenubarTriggerElement>(null);
    const context = useMenubarContext(TRIGGER_NAME, __scopeMenubar);
    const dropdownMenuScope = useDropdownMenuScope(__scopeMenubar);
    const timerRef = React.useRef(0);
    const searchRef = React.useRef('');
    const getItems = useCollection(__scopeMenubar);

    // get the item's `.textContent` as default strategy for typeahead `textValue`
    const [textContent, setTextContent] = React.useState('');
    React.useEffect(() => {
      const menuItem = ref.current;
      if (menuItem) {
        setTextContent((menuItem.textContent ?? '').trim());
      }
    }, [menubarTriggerProps.children]);

    const handleTypeaheadSearch = (key: string) => {
      const search = searchRef.current + key;
      const items = getItems().filter((item) => !item.disabled);
      const currentItem = document.activeElement;
      const currentMatch = items.find((item) => item.ref.current === currentItem)?.textValue;
      const values = items.map((item) => item.textValue);
      const nextMatch = getNextMatch(values, search, currentMatch);
      const newItem = items.find((item) => item.textValue === nextMatch)?.ref.current;

      // Reset `searchRef` 1 second after it was last updated
      (function updateSearch(value: string) {
        searchRef.current = value;
        window.clearTimeout(timerRef.current);
        if (value !== '') timerRef.current = window.setTimeout(() => updateSearch(''), 1000);
      })(search);

      if (newItem) {
        /**
         * Imperative focus during keydown is risky so we prevent React's batching updates
         * to avoid potential bugs. See: https://github.com/facebook/react/issues/20332
         */
        setTimeout(() => (newItem as HTMLElement).focus());
      }
    };

    return (
      <Collection.ItemSlot
        scope={__scopeMenubar}
        disabled={disabled}
        textValue={textValue ?? textContent}
      >
        <Collection.Slot scope={__scopeMenubar}>
          <RovingFocusGroup.Item asChild {...rovingFocusGroupScope} focusable={!disabled}>
            <DropdownMenuPrimitive.Trigger
              {...dropdownMenuScope}
              ref={useComposedRefs(forwardedRef, ref)}
              onKeyDown={(event: React.KeyboardEvent) => {
                // submenu key events bubble through portals. We only care about keys in this menu.
                const target = event.target as HTMLElement;
                const isKeyDownInside = event.currentTarget.contains(target);
                const isModifierKey = event.ctrlKey || event.altKey || event.metaKey;
                if (isKeyDownInside && !isModifierKey && event.key.length === 1) {
                  handleTypeaheadSearch(event.key);
                }
                const id = ref.current?.getAttribute('id') || null;
                if (OPEN_KEYS.includes(event.key) && context.currentTabId !== id) {
                  context.setCurrentTabId(id);
                }
              }}
              {...menubarTriggerProps}
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
  const { __scopeMenubar, disabled, ...subMenuTriggerProps } = props;
  const dropdownMenuScope = useDropdownMenuScope(__scopeMenubar);
  const context = useMenubarContext(MENUBAR_ITEM_NAME, __scopeMenubar);
  const getItems = useCollection(__scopeMenubar);

  return (
    <DropdownMenuPrimitive.TriggerItem
      {...dropdownMenuScope}
      ref={forwardedRef}
      disabled={disabled}
      onKeyDown={(event: React.KeyboardEvent) => {
        const prevMenuNavKey = context.direction === 'ltr' ? 'ArrowLeft' : 'ArrowRight';
        if (event.key === prevMenuNavKey) {
          const items = getItems().filter((item) => !item.disabled);
          const candidateNodes = items.map((item) => item.ref.current!);
          const currentIndex = candidateNodes.indexOf(
            document.querySelector(`#${context.currentTabId}`)!
          );
          // TODO implement direction aware logic
          const focusIntent = getFocusIntent(event, 'horizontal', 'ltr')!;
          const candidate = getFocusIndex(currentIndex, candidateNodes.length - 1, focusIntent);
          return context.setCurrentTabId(candidateNodes[candidate!].id);
        }
      }}
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

const [ContentProvider, useContentContext] = createMenubarContext(MENUBAR_CONTENT, {
  isInsideContent: false,
});

const MenubarContent = React.forwardRef<MenubarContentElement, MenubarContentProps>(
  (props: ScopedProps<MenubarContentProps>, forwardedRef) => {
    const { __scopeMenubar, ...contentProps } = props;
    const dropdownMenuScope = useDropdownMenuScope(__scopeMenubar);

    return (
      <ContentProvider isInsideContent={true} scope={__scopeMenubar}>
        <DropdownMenuPrimitive.Content
          {...dropdownMenuScope}
          portalled={false}
          ref={forwardedRef}
          loop
          {...contentProps}
        />
      </ContentProvider>
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
    const composedRefs = useComposedRefs(forwardedRef, ref);
    const context = useMenubarContext(MENUBAR_ITEM_NAME, __scopeMenubar);
    const menuContext = useMenuContext(MENUBAR_ITEM_NAME, __scopeMenubar);
    const getItems = useCollection(__scopeMenubar);

    return (
      <DropdownMenuPrimitive.Item
        {...dropdownMenuScope}
        ref={composedRefs}
        disabled={disabled}
        onKeyDown={(event: React.KeyboardEvent) => {
          if (['ArrowRight', 'ArrowLeft'].includes(event.key)) {
            const items = getItems().filter((item) => !item.disabled);
            const candidateNodes = items.map((item) => item.ref.current!);
            const currentIndex = candidateNodes.indexOf(
              document.querySelector(`#${context.currentTabId}`)!
            );
            const focusIntent = getFocusIntent(event, 'horizontal', 'ltr')!;
            if (focusIntent === 'prev' && menuContext.isInsideContent) return;
            const candidate = getFocusIndex(currentIndex, candidateNodes.length - 1, focusIntent);
            return context.setCurrentTabId(candidateNodes[candidate!].id);
          }
        }}
        {...itemProps}
      />
    );
  }
);

MenubarItem.displayName = MENUBAR_ITEM_NAME;

/* ---------------------------------------------------------------------------------------------- */

type Direction = 'ltr' | 'rtl';
type Orientation = React.AriaAttributes['aria-orientation'];

// prettier-ignore
const MAP_KEY_TO_FOCUS_INTENT: Record<string, FocusIntent> = {
  ArrowLeft: 'prev', ArrowUp: 'prev',
  ArrowRight: 'next', ArrowDown: 'next',
};

function getDirectionAwareKey(key: string, dir?: Direction) {
  if (dir !== 'rtl') return key;
  return key === 'ArrowLeft' ? 'ArrowRight' : key === 'ArrowRight' ? 'ArrowLeft' : key;
}

type FocusIntent = 'prev' | 'next';

function getFocusIntent(event: React.KeyboardEvent, orientation?: Orientation, dir?: Direction) {
  const key = getDirectionAwareKey(event.key, dir);
  if (orientation === 'vertical' && ['ArrowLeft', 'ArrowRight'].includes(key)) return undefined;
  if (orientation === 'horizontal' && ['ArrowUp', 'ArrowDown'].includes(key)) return undefined;
  return MAP_KEY_TO_FOCUS_INTENT[key];
}

function getFocusIndex(currentIndex: number, lastIndex: number, focusIntent: FocusIntent) {
  if (lastIndex === 0) return;
  if (currentIndex === 0) return focusIntent === 'next' ? 1 : lastIndex;
  if (currentIndex === lastIndex) return focusIntent === 'next' ? 0 : lastIndex - 1;
  return focusIntent === 'next' ? currentIndex + 1 : currentIndex - 1;
}

/**
 * Wraps an array around itself at a given start index
 * Example: `wrapArray(['a', 'b', 'c', 'd'], 2) === ['c', 'd', 'a', 'b']`
 */
function wrapArray<T>(array: T[], startIndex: number) {
  return array.map((_, index) => array[(startIndex + index) % array.length]);
}

/**
 * This is the "meat" of the typeahead matching logic. It takes in all the values,
 * the search and the current match, and returns the next match (or `undefined`).
 *
 * We normalize the search because if a user has repeatedly pressed a character,
 * we want the exact same behavior as if we only had that one character
 * (ie. cycle through options starting with that character)
 *
 * We also reorder the values by wrapping the array around the current match.
 * This is so we always look forward from the current match, and picking the first
 * match will always be the correct one.
 *
 * Finally, if the normalized search is exactly one character, we exclude the
 * current match from the values because otherwise it would be the first to match always
 * and focus would never move. This is as opposed to the regular case, where we
 * don't want focus to move if the current match still matches.
 */
function getNextMatch(values: string[], search: string, currentMatch?: string) {
  const isRepeated = search.length > 1 && Array.from(search).every((char) => char === search[0]);
  const normalizedSearch = isRepeated ? search[0] : search;
  const currentMatchIndex = currentMatch ? values.indexOf(currentMatch) : -1;
  let wrappedValues = wrapArray(values, Math.max(currentMatchIndex, 0));
  const excludeCurrentMatch = normalizedSearch.length === 1;
  if (excludeCurrentMatch) wrappedValues = wrappedValues.filter((v) => v !== currentMatch);
  const nextMatch = wrappedValues.find((value) =>
    value.toLowerCase().startsWith(normalizedSearch.toLowerCase())
  );
  return nextMatch !== currentMatch ? nextMatch : undefined;
}

export {
  Menubar as Root,
  MenubarMenu as Menu,
  MenubarTrigger as Trigger,
  MenubarSubMenuTrigger as TriggerItem,
  MenubarContent as Content,
  MenubarItem as Item,
  createMenuScope,
};
