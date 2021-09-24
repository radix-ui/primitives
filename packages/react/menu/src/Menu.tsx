import * as React from 'react';
import { RemoveScroll } from 'react-remove-scroll';
import { hideOthers } from 'aria-hidden';
import { composeEventHandlers } from '@radix-ui/primitive';
import { createCollection } from '@radix-ui/react-collection';
import { useComposedRefs, composeRefs } from '@radix-ui/react-compose-refs';
import { createContext } from '@radix-ui/react-context';
import { DismissableLayer } from '@radix-ui/react-dismissable-layer';
import { FocusScope } from '@radix-ui/react-focus-scope';
import { Presence } from '@radix-ui/react-presence';
import { Primitive } from '@radix-ui/react-primitive';
import * as PopperPrimitive from '@radix-ui/react-popper';
import { Portal } from '@radix-ui/react-portal';
import { RovingFocusGroup, RovingFocusItem } from '@radix-ui/react-roving-focus';
import { useDirection } from '@radix-ui/react-use-direction';
import { useCallbackRef } from '@radix-ui/react-use-callback-ref';
import { useFocusGuards } from '@radix-ui/react-focus-guards';
import { useId } from '@radix-ui/react-id';

import type * as Radix from '@radix-ui/react-primitive';

type Direction = 'ltr' | 'rtl';

const SELECTION_KEYS = ['Enter', ' '];
const FIRST_KEYS = ['ArrowDown', 'PageUp', 'Home'];
const LAST_KEYS = ['ArrowUp', 'PageDown', 'End'];
const FIRST_LAST_KEYS = [...FIRST_KEYS, ...LAST_KEYS];
const SUB_OPEN_KEYS: Record<Direction, string[]> = {
  ltr: [...SELECTION_KEYS, 'ArrowRight'],
  rtl: [...SELECTION_KEYS, 'ArrowLeft'],
};
const SUB_CLOSE_KEYS: Record<Direction, string[]> = {
  ltr: ['ArrowLeft'],
  rtl: ['ArrowRight'],
};

/* -------------------------------------------------------------------------------------------------
 * Menu
 * -----------------------------------------------------------------------------------------------*/

const MENU_NAME = 'Menu';

type MenuRootContextValue = {
  isSubmenu: false;
  isUsingKeyboardRef: React.RefObject<boolean>;
  dir: Direction;
  open: boolean;
  onOpenChange(open: boolean): void;
  content: MenuContentElement | null;
  onContentChange(content: MenuContentElement | null): void;
  onRootClose(): void;
  modal: boolean;
};

type MenuSubContextValue = Omit<MenuRootContextValue, 'isSubmenu'> & {
  isSubmenu: true;
  contentId: string;
  triggerId: string;
  trigger: MenuSubTriggerElement | null;
  onTriggerChange(trigger: MenuSubTriggerElement | null): void;
};

const [MenuProvider, useMenuContext] = createContext<MenuRootContextValue | MenuSubContextValue>(
  MENU_NAME
);

interface MenuProps {
  open?: boolean;
  onOpenChange?(open: boolean): void;
  dir?: Direction;
  modal?: boolean;
}

const Menu: React.FC<MenuProps> = (props) => {
  const { open = false, children, onOpenChange, modal = true } = props;
  const [content, setContent] = React.useState<MenuContentElement | null>(null);
  const isUsingKeyboardRef = React.useRef(false);
  const handleOpenChange = useCallbackRef(onOpenChange);
  const computedDirection = useDirection(content, props.dir);

  React.useEffect(() => {
    const handleKeyDown = () => (isUsingKeyboardRef.current = true);
    const handlePointer = () => (isUsingKeyboardRef.current = false);
    // Capture phase ensures we set the boolean before any side effects execute
    // in response to the key or pointer event as they might depend on this value.
    document.addEventListener('keydown', handleKeyDown, { capture: true });
    document.addEventListener('pointerdown', handlePointer, { capture: true });
    document.addEventListener('pointermove', handlePointer, { capture: true });
    return () => {
      document.removeEventListener('keydown', handleKeyDown, { capture: true });
      document.removeEventListener('pointerdown', handlePointer, { capture: true });
      document.removeEventListener('pointermove', handlePointer, { capture: true });
    };
  }, []);

  return (
    <PopperPrimitive.Root>
      <MenuProvider
        isSubmenu={false}
        isUsingKeyboardRef={isUsingKeyboardRef}
        dir={computedDirection}
        open={open}
        onOpenChange={handleOpenChange}
        content={content}
        onContentChange={setContent}
        onRootClose={React.useCallback(() => handleOpenChange(false), [handleOpenChange])}
        modal={modal}
      >
        {children}
      </MenuProvider>
    </PopperPrimitive.Root>
  );
};

Menu.displayName = MENU_NAME;

/* ---------------------------------------------------------------------------------------------- */

const SUB_NAME = 'MenuSub';

interface MenuSubProps {
  open?: boolean;
  onOpenChange?(open: boolean): void;
}

const MenuSub: React.FC<MenuSubProps> = (props) => {
  const { children, open = false, onOpenChange } = props;
  const parentMenuContext = useMenuContext(SUB_NAME);
  const [trigger, setTrigger] = React.useState<MenuSubTriggerElement | null>(null);
  const [content, setContent] = React.useState<MenuContentElement | null>(null);
  const handleOpenChange = useCallbackRef(onOpenChange);

  // Prevent the parent menu from reopening with open submenus.
  React.useEffect(() => {
    if (parentMenuContext.open === false) handleOpenChange(false);
    return () => handleOpenChange(false);
  }, [parentMenuContext.open, handleOpenChange]);

  return (
    <PopperPrimitive.Root>
      <MenuProvider
        isSubmenu={true}
        isUsingKeyboardRef={parentMenuContext.isUsingKeyboardRef}
        dir={parentMenuContext.dir}
        open={open}
        onOpenChange={handleOpenChange}
        content={content}
        onContentChange={setContent}
        onRootClose={parentMenuContext.onRootClose}
        contentId={useId()}
        trigger={trigger}
        onTriggerChange={setTrigger}
        triggerId={useId()}
        modal={false}
      >
        {children}
      </MenuProvider>
    </PopperPrimitive.Root>
  );
};

MenuSub.displayName = SUB_NAME;

/* -------------------------------------------------------------------------------------------------
 * MenuAnchor
 * -----------------------------------------------------------------------------------------------*/

const ANCHOR_NAME = 'MenuAnchor';

type MenuAnchorElement = React.ElementRef<typeof PopperPrimitive.Anchor>;
type PopperAnchorProps = Radix.ComponentPropsWithoutRef<typeof PopperPrimitive.Anchor>;
interface MenuAnchorProps extends PopperAnchorProps {}

const MenuAnchor = React.forwardRef<MenuAnchorElement, MenuAnchorProps>((props, forwardedRef) => (
  <PopperPrimitive.Anchor {...props} ref={forwardedRef} />
));

MenuAnchor.displayName = ANCHOR_NAME;

/* -------------------------------------------------------------------------------------------------
 * MenuContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = 'MenuContent';

type ItemData = { disabled: boolean; textValue: string };

const [CollectionProvider, CollectionSlot, CollectionItemSlot, useCollection] = createCollection<
  MenuItemElement,
  ItemData
>();

type MenuContentContextValue = {
  onItemEnter(event: React.PointerEvent): void;
  onItemLeave(event: React.PointerEvent): void;
  onTriggerLeave(event: React.PointerEvent): void;
  searchRef: React.RefObject<string>;
  pointerGraceTimerRef: React.MutableRefObject<number>;
  onPointerGraceIntentChange(intent: GraceIntent | null): void;
};
const [MenuContentProvider, useMenuContentContext] =
  createContext<MenuContentContextValue>(CONTENT_NAME);

type MenuContentElement = MenuRootContentElement | MenuSubContentElement;
/**
 * We purposefully don't union MenuRootContent and MenuSubContent props here because
 * they have conflicting prop types. We agreed that we would allow MenuSubContent to
 * accept props that it would just ignore.
 */
interface MenuContentProps extends MenuRootContentProps {
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: true;
}

const MenuContent = React.forwardRef<MenuContentElement, MenuContentProps>(
  (props, forwardedRef) => {
    const { forceMount, ...contentProps } = props;
    const context = useMenuContext(CONTENT_NAME);
    return (
      <CollectionProvider>
        <Presence present={forceMount || context.open}>
          <CollectionSlot>
            {context.isSubmenu ? (
              <MenuSubContent {...contentProps} ref={forwardedRef} />
            ) : (
              <MenuRootContent {...contentProps} ref={forwardedRef} />
            )}
          </CollectionSlot>
        </Presence>
      </CollectionProvider>
    );
  }
);

/* ---------------------------------------------------------------------------------------------- */

type MenuRootContentElement = MenuRootContentTypeElement;
interface MenuRootContentProps
  extends Omit<MenuRootContentTypeProps, keyof MenuContentImplPrivateProps> {}

const MenuRootContent = React.forwardRef<MenuRootContentElement, MenuRootContentProps>(
  (props, forwardedRef) => {
    const context = useMenuContext(CONTENT_NAME);
    return context.modal ? (
      <MenuRootContentModal {...props} ref={forwardedRef} />
    ) : (
      <MenuRootContentNonModal {...props} ref={forwardedRef} />
    );
  }
);

type MenuRootContentTypeElement = MenuContentImplElement;
interface MenuRootContentTypeProps
  extends Omit<
    MenuContentImplProps,
    'trapFocus' | 'disableOutsidePointerEvents' | 'disableOutsideScroll'
  > {}

const MenuRootContentModal = React.forwardRef<MenuRootContentTypeElement, MenuRootContentTypeProps>(
  (props, forwardedRef) => {
    const context = useMenuContext(CONTENT_NAME);
    const ref = React.useRef<MenuRootContentTypeElement>(null);
    const composedRefs = useComposedRefs(forwardedRef, ref);

    // Hide everything from ARIA except the `MenuContent`
    React.useEffect(() => {
      const content = ref.current;
      if (content) return hideOthers(content);
    }, []);

    return (
      <MenuContentImpl
        {...props}
        ref={composedRefs}
        // we make sure we're not trapping once it's been closed
        // (closed !== unmounted when animating out)
        trapFocus={context.open}
        // make sure to only disable pointer events when open
        // this avoids blocking interactions while animating out
        disableOutsidePointerEvents={context.open}
        disableOutsideScroll
        // When focus is trapped, a `focusout` event may still happen.
        // We make sure we don't trigger our `onDismiss` in such case.
        onFocusOutside={composeEventHandlers(
          props.onFocusOutside,
          (event) => event.preventDefault(),
          { checkForDefaultPrevented: false }
        )}
        onDismiss={() => context.onOpenChange(false)}
      />
    );
  }
);

const MenuRootContentNonModal = React.forwardRef<
  MenuRootContentTypeElement,
  MenuRootContentTypeProps
>((props, forwardedRef) => {
  const context = useMenuContext(CONTENT_NAME);
  return (
    <MenuContentImpl
      {...props}
      ref={forwardedRef}
      trapFocus={false}
      disableOutsidePointerEvents={false}
      disableOutsideScroll={false}
      onDismiss={() => context.onOpenChange(false)}
    />
  );
});

/* ---------------------------------------------------------------------------------------------- */

type MenuSubContentElement = MenuContentImplElement;
interface MenuSubContentProps
  extends Omit<
    MenuContentImplProps,
    | keyof MenuContentImplPrivateProps
    | 'align'
    | 'side'
    | 'portalled'
    | 'disabledOutsidePointerEvents'
    | 'disableOutsideScroll'
    | 'trapFocus'
    | 'onCloseAutoFocus'
  > {}

const MenuSubContent = React.forwardRef<MenuSubContentElement, MenuSubContentProps>(
  (props, forwardedRef) => {
    const context = useMenuContext(CONTENT_NAME);
    const ref = React.useRef<MenuSubContentElement>(null);
    const composedRefs = useComposedRefs(forwardedRef, ref);
    return context.isSubmenu ? (
      <MenuContentImpl
        id={context.contentId}
        aria-labelledby={context.triggerId}
        {...props}
        ref={composedRefs}
        align="start"
        side={context.dir === 'rtl' ? 'left' : 'right'}
        portalled
        disableOutsidePointerEvents={false}
        disableOutsideScroll={false}
        trapFocus={false}
        onOpenAutoFocus={(event) => {
          // when opening a submenu, focus content for keyboard users only
          if (context.isUsingKeyboardRef.current) ref.current?.focus();
          event.preventDefault();
        }}
        // The menu might close because of focusing another menu item in the parent menu. We
        // don't want it to refocus the trigger in that case so we handle trigger focus ourselves.
        onCloseAutoFocus={(event) => event.preventDefault()}
        onFocusOutside={composeEventHandlers(props.onFocusOutside, (event) => {
          // We prevent closing when the trigger is focused to avoid triggering a re-open animation
          // on pointer interaction.
          if (event.target !== context.trigger) context.onOpenChange(false);
        })}
        onEscapeKeyDown={composeEventHandlers(props.onEscapeKeyDown, context.onRootClose)}
        onKeyDown={composeEventHandlers(props.onKeyDown, (event) => {
          // Submenu key events bubble through portals. We only care about keys in this menu.
          const isKeyDownInside = event.currentTarget.contains(event.target as HTMLElement);
          const isCloseKey = SUB_CLOSE_KEYS[context.dir].includes(event.key);
          if (isKeyDownInside && isCloseKey) {
            context.onOpenChange(false);
            // We focus manually because we prevented it in `onCloseAutoFocus`
            context.trigger?.focus();
          }
        })}
      />
    ) : null;
  }
);

/* ---------------------------------------------------------------------------------------------- */

type MenuContentImplElement = React.ElementRef<typeof PopperPrimitive.Content>;
type FocusScopeProps = Radix.ComponentPropsWithoutRef<typeof FocusScope>;
type DismissableLayerProps = Radix.ComponentPropsWithoutRef<typeof DismissableLayer>;
type RovingFocusGroupProps = Radix.ComponentPropsWithoutRef<typeof RovingFocusGroup>;
type PopperContentProps = Radix.ComponentPropsWithoutRef<typeof PopperPrimitive.Content>;
type MenuContentImplPrivateProps = {
  onOpenAutoFocus?: FocusScopeProps['onMountAutoFocus'];
  onDismiss?: DismissableLayerProps['onDismiss'];
};
interface MenuContentImplProps
  extends MenuContentImplPrivateProps,
    PopperContentProps,
    Omit<DismissableLayerProps, 'onDismiss'> {
  /**
   * Whether focus should be trapped within the `MenuContent`
   * (default: false)
   */
  trapFocus?: FocusScopeProps['trapped'];

  /**
   * Event handler called when auto-focusing on close.
   * Can be prevented.
   */
  onCloseAutoFocus?: FocusScopeProps['onUnmountAutoFocus'];

  /**
   * Whether scrolling outside the `MenuContent` should be prevented
   * (default: `false`)
   */
  disableOutsideScroll?: boolean;

  /**
   * The direction of navigation between menu items.
   * @defaultValue ltr
   */
  dir?: RovingFocusGroupProps['dir'];

  /**
   * Whether keyboard navigation should loop around
   * @defaultValue false
   */
  loop?: RovingFocusGroupProps['loop'];

  /**
   * Whether the `MenuContent` should render in a `Portal`
   * (default: `true`)
   */
  portalled?: boolean;
}

const MenuContentImpl = React.forwardRef<MenuContentImplElement, MenuContentImplProps>(
  (props, forwardedRef) => {
    const {
      loop = false,
      trapFocus,
      onOpenAutoFocus,
      onCloseAutoFocus,
      disableOutsidePointerEvents,
      onEscapeKeyDown,
      onPointerDownOutside,
      onFocusOutside,
      onInteractOutside,
      onDismiss,
      disableOutsideScroll,
      portalled,
      ...contentProps
    } = props;
    const context = useMenuContext(CONTENT_NAME);
    const getItems = useCollection();
    const [currentItemId, setCurrentItemId] = React.useState<string | null>(null);
    const contentRef = React.useRef<HTMLDivElement>(null);
    const composedRefs = useComposedRefs(forwardedRef, contentRef, context.onContentChange);
    const timerRef = React.useRef(0);
    const searchRef = React.useRef('');
    const pointerGraceTimerRef = React.useRef(0);
    const pointerGraceIntentRef = React.useRef<GraceIntent | null>(null);
    const pointerDirRef = React.useRef<Side>('right');
    const lastPointerXRef = React.useRef(0);

    const PortalWrapper = portalled ? Portal : React.Fragment;
    const ScrollLockWrapper = disableOutsideScroll ? RemoveScroll : React.Fragment;

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

    React.useEffect(() => {
      return () => window.clearTimeout(timerRef.current);
    }, []);

    // Make sure the whole tree has focus guards as our `MenuContent` may be
    // the last element in the DOM (beacuse of the `Portal`)
    useFocusGuards();

    const isPointerMovingToSubmenu = React.useCallback((event: React.PointerEvent) => {
      const isMovingTowards = pointerDirRef.current === pointerGraceIntentRef.current?.side;
      return isMovingTowards && isPointerInGraceArea(event, pointerGraceIntentRef.current?.area);
    }, []);

    return (
      <PortalWrapper>
        <ScrollLockWrapper>
          <MenuContentProvider
            searchRef={searchRef}
            onItemEnter={React.useCallback(
              (event) => {
                if (isPointerMovingToSubmenu(event)) event.preventDefault();
              },
              [isPointerMovingToSubmenu]
            )}
            onItemLeave={React.useCallback(
              (event) => {
                if (isPointerMovingToSubmenu(event)) return;
                contentRef.current?.focus();
                setCurrentItemId(null);
              },
              [isPointerMovingToSubmenu]
            )}
            onTriggerLeave={React.useCallback(
              (event) => {
                if (isPointerMovingToSubmenu(event)) event.preventDefault();
              },
              [isPointerMovingToSubmenu]
            )}
            pointerGraceTimerRef={pointerGraceTimerRef}
            onPointerGraceIntentChange={React.useCallback((intent) => {
              pointerGraceIntentRef.current = intent;
            }, [])}
          >
            <FocusScope
              asChild
              trapped={trapFocus}
              onMountAutoFocus={composeEventHandlers(onOpenAutoFocus, (event) => {
                // when opening, explicitly focus the content area only and leave
                // `onEntryFocus` in  control of focusing first item
                event.preventDefault();
                contentRef.current?.focus();
              })}
              onUnmountAutoFocus={onCloseAutoFocus}
            >
              <DismissableLayer
                asChild
                disableOutsidePointerEvents={disableOutsidePointerEvents}
                onEscapeKeyDown={onEscapeKeyDown}
                onPointerDownOutside={onPointerDownOutside}
                onFocusOutside={onFocusOutside}
                onInteractOutside={onInteractOutside}
                onDismiss={onDismiss}
              >
                <RovingFocusGroup
                  asChild
                  dir={context.dir}
                  orientation="vertical"
                  loop={loop}
                  currentTabStopId={currentItemId}
                  onCurrentTabStopIdChange={setCurrentItemId}
                  onEntryFocus={(event) => {
                    // only focus first item when using keyboard
                    if (!context.isUsingKeyboardRef.current) event.preventDefault();
                  }}
                >
                  <PopperPrimitive.Content
                    role="menu"
                    dir={context.dir}
                    data-state={getOpenState(context.open)}
                    {...contentProps}
                    ref={composedRefs}
                    style={{ outline: 'none', ...contentProps.style }}
                    onKeyDown={composeEventHandlers(contentProps.onKeyDown, (event) => {
                      // submenu key events bubble through portals. We only care about keys in this menu.
                      const target = event.target as HTMLElement;
                      const isKeyDownInside = event.currentTarget.contains(target);
                      const isModifierKey = event.ctrlKey || event.altKey || event.metaKey;
                      if (isKeyDownInside && !isModifierKey && event.key.length === 1) {
                        handleTypeaheadSearch(event.key);
                      }
                      // menus should not be navigated using tab key so we prevent it
                      if (event.key === 'Tab') event.preventDefault();
                      // focus first/last item based on key pressed
                      const content = contentRef.current;
                      if (event.target !== content) return;
                      if (!FIRST_LAST_KEYS.includes(event.key)) return;
                      event.preventDefault();
                      const items = getItems().filter((item) => !item.disabled);
                      const candidateNodes = items.map((item) => item.ref.current!);
                      if (LAST_KEYS.includes(event.key)) candidateNodes.reverse();
                      focusFirst(candidateNodes);
                    })}
                    onBlur={composeEventHandlers(props.onBlur, (event) => {
                      // clear search buffer when leaving the menu
                      if (!event.currentTarget.contains(event.target)) {
                        window.clearTimeout(timerRef.current);
                        searchRef.current = '';
                      }
                    })}
                    onPointerMove={composeEventHandlers(
                      props.onPointerMove,
                      whenMouse((event) => {
                        const target = event.target as HTMLElement;
                        const pointerXHasChanged = lastPointerXRef.current !== event.clientX;

                        // We don't use `event.movementX` for this check because Safari will
                        // always return `0` on a pointer event.
                        if (event.currentTarget.contains(target) && pointerXHasChanged) {
                          const newDir = event.clientX > lastPointerXRef.current ? 'right' : 'left';
                          pointerDirRef.current = newDir;
                          lastPointerXRef.current = event.clientX;
                        }
                      })
                    )}
                  />
                </RovingFocusGroup>
              </DismissableLayer>
            </FocusScope>
          </MenuContentProvider>
        </ScrollLockWrapper>
      </PortalWrapper>
    );
  }
);

MenuContent.displayName = CONTENT_NAME;

/* -------------------------------------------------------------------------------------------------
 * MenuGroup
 * -----------------------------------------------------------------------------------------------*/

const GROUP_NAME = 'MenuGroup';

type MenuGroupElement = React.ElementRef<typeof Primitive.div>;
type PrimitiveDivProps = Radix.ComponentPropsWithoutRef<typeof Primitive.div>;
interface MenuGroupProps extends PrimitiveDivProps {}

const MenuGroup = React.forwardRef<MenuGroupElement, MenuGroupProps>((props, forwardedRef) => (
  <Primitive.div role="group" {...props} ref={forwardedRef} />
));

MenuGroup.displayName = GROUP_NAME;

/* -------------------------------------------------------------------------------------------------
 * MenuLabel
 * -----------------------------------------------------------------------------------------------*/

const LABEL_NAME = 'MenuLabel';

type MenuLabelElement = React.ElementRef<typeof Primitive.div>;
interface MenuLabelProps extends PrimitiveDivProps {}

const MenuLabel = React.forwardRef<MenuLabelElement, MenuLabelProps>((props, forwardedRef) => (
  <Primitive.div {...props} ref={forwardedRef} />
));

MenuLabel.displayName = LABEL_NAME;

/* -------------------------------------------------------------------------------------------------
 * MenuItem
 * -----------------------------------------------------------------------------------------------*/

const ITEM_NAME = 'MenuItem';
const ITEM_SELECT = 'menu.itemSelect';

type MenuItemElement = MenuItemImplElement;
interface MenuItemProps extends Omit<MenuItemImplProps, 'onSelect'> {
  onSelect?: (event: Event) => void;
}

const MenuItem = React.forwardRef<MenuItemElement, MenuItemProps>((props, forwardedRef) => {
  const { disabled = false, onSelect, ...itemProps } = props;
  const ref = React.useRef<HTMLDivElement>(null);
  const context = useMenuContext(ITEM_NAME);
  const contentContext = useMenuContentContext(ITEM_NAME);
  const composedRefs = useComposedRefs(forwardedRef, ref);
  const isPointerDownRef = React.useRef(false);

  const handleSelect = () => {
    const menuItem = ref.current;
    if (!disabled && menuItem) {
      const itemSelectEvent = new Event(ITEM_SELECT, { bubbles: true, cancelable: true });
      menuItem.addEventListener(ITEM_SELECT, (event) => onSelect?.(event), { once: true });
      menuItem.dispatchEvent(itemSelectEvent);
      if (itemSelectEvent.defaultPrevented) {
        isPointerDownRef.current = false;
      } else {
        context.onRootClose();
      }
    }
  };

  return (
    <MenuItemImpl
      {...itemProps}
      ref={composedRefs}
      disabled={disabled}
      onClick={composeEventHandlers(props.onClick, handleSelect)}
      onPointerDown={(event) => {
        props.onPointerDown?.(event);
        isPointerDownRef.current = true;
      }}
      onPointerUp={composeEventHandlers(props.onPointerUp, (event) => {
        // Pointer down can move to a different menu item which should activate it on pointer up.
        // We dispatch a click for selection to allow composition with click based triggers and to
        // prevent Firefox from getting stuck in text selection mode when the menu closes.
        if (!isPointerDownRef.current) event.currentTarget?.click();
      })}
      onKeyDown={composeEventHandlers(props.onKeyDown, (event) => {
        const isTypingAhead = contentContext.searchRef.current !== '';
        if (disabled || (isTypingAhead && event.key === ' ')) return;
        if (SELECTION_KEYS.includes(event.key)) {
          event.currentTarget.click();
          /**
           * We prevent default browser behaviour for selection keys as they should trigger
           * a selection only:
           * - prevents space from scrolling the page.
           * - if keydown causes focus to move, prevents keydown from firing on the new target.
           */
          event.preventDefault();
        }
      })}
    />
  );
});

MenuItem.displayName = ITEM_NAME;

/* -------------------------------------------------------------------------------------------------
 * MenuSubTrigger
 * -----------------------------------------------------------------------------------------------*/

const SUB_TRIGGER_NAME = 'MenuSubTrigger';

type MenuSubTriggerElement = MenuItemImplElement;
interface MenuSubTriggerProps extends MenuItemImplProps {}

const MenuSubTrigger = React.forwardRef<MenuSubTriggerElement, MenuSubTriggerProps>(
  (props, forwardedRef) => {
    const context = useMenuContext(SUB_TRIGGER_NAME);
    const contentContext = useMenuContentContext(SUB_TRIGGER_NAME);
    const openTimerRef = React.useRef<number | null>(null);
    const { pointerGraceTimerRef, onPointerGraceIntentChange } = contentContext;

    const clearOpenTimer = React.useCallback(() => {
      if (openTimerRef.current) window.clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }, []);

    React.useEffect(() => clearOpenTimer, [clearOpenTimer]);

    React.useEffect(() => {
      const pointerGraceTimer = pointerGraceTimerRef.current;
      return () => {
        window.clearTimeout(pointerGraceTimer);
        onPointerGraceIntentChange(null);
      };
    }, [pointerGraceTimerRef, onPointerGraceIntentChange]);

    return context.isSubmenu ? (
      <MenuAnchor asChild>
        <MenuItemImpl
          id={context.triggerId}
          aria-haspopup="menu"
          aria-expanded={context.open}
          aria-controls={context.contentId}
          data-state={getOpenState(context.open)}
          {...props}
          ref={composeRefs(forwardedRef, context.onTriggerChange)}
          // This is redundant for mouse users but we cannot determine pointer type from
          // click event and we cannot use pointerup event (see git history for reasons why)
          onClick={(event) => {
            props.onClick?.(event);
            if (props.disabled || event.defaultPrevented) return;
            /**
             * We manually focus because iOS Safari doesn't always focus on click (e.g. buttons)
             * and we rely heavily on `onFocusOutside` for submenus to close when switching
             * between separate submenus.
             */
            event.currentTarget.focus();
            if (!context.open) context.onOpenChange(true);
          }}
          onPointerMove={composeEventHandlers(
            props.onPointerMove,
            whenMouse((event) => {
              contentContext.onItemEnter(event);
              if (event.defaultPrevented) return;
              if (!props.disabled && !context.open && !openTimerRef.current) {
                contentContext.onPointerGraceIntentChange(null);
                openTimerRef.current = window.setTimeout(() => {
                  context.onOpenChange(true);
                  clearOpenTimer();
                }, 100);
              }
            })
          )}
          onPointerLeave={composeEventHandlers(
            props.onPointerLeave,
            whenMouse((event) => {
              clearOpenTimer();

              const contentRect = context.content?.getBoundingClientRect();
              if (contentRect) {
                // TODO: make sure to update this when we change positioning logic
                const side = context.content?.dataset.side as Side;
                const rightSide = side === 'right';
                const bleed = rightSide ? -5 : +5;
                const contentNearEdge = contentRect[rightSide ? 'left' : 'right'];
                const contentFarEdge = contentRect[rightSide ? 'right' : 'left'];

                contentContext.onPointerGraceIntentChange({
                  area: [
                    // Apply a bleed on clientX to ensure that our exit point is
                    // consistently within polygon bounds
                    { x: event.clientX + bleed, y: event.clientY },
                    { x: contentNearEdge, y: contentRect.top },
                    { x: contentFarEdge, y: contentRect.top },
                    { x: contentFarEdge, y: contentRect.bottom },
                    { x: contentNearEdge, y: contentRect.bottom },
                  ],
                  side,
                });

                window.clearTimeout(pointerGraceTimerRef.current);
                pointerGraceTimerRef.current = window.setTimeout(
                  () => contentContext.onPointerGraceIntentChange(null),
                  300
                );
              } else {
                contentContext.onTriggerLeave(event);
                if (event.defaultPrevented) return;

                // There's 100ms where the user may leave an item before the submenu was opened.
                contentContext.onPointerGraceIntentChange(null);
              }
            })
          )}
          onKeyDown={composeEventHandlers(props.onKeyDown, (event) => {
            const isTypingAhead = contentContext.searchRef.current !== '';
            if (props.disabled || (isTypingAhead && event.key === ' ')) return;
            if (SUB_OPEN_KEYS[context.dir].includes(event.key)) {
              context.onOpenChange(true);
              // The trigger may hold focus if opened via pointer interaction
              // so we ensure content is given focus again when switching to keyboard.
              context.content?.focus();
            }
          })}
        />
      </MenuAnchor>
    ) : null;
  }
);

MenuSubTrigger.displayName = SUB_TRIGGER_NAME;

/* ---------------------------------------------------------------------------------------------- */

type MenuItemImplElement = React.ElementRef<typeof Primitive.div>;
interface MenuItemImplProps extends PrimitiveDivProps {
  disabled?: boolean;
  textValue?: string;
}

const MenuItemImpl = React.forwardRef<MenuItemImplElement, MenuItemImplProps>(
  (props, forwardedRef) => {
    const { disabled = false, textValue, ...itemProps } = props;
    const ref = React.useRef<HTMLDivElement>(null);
    const composedRefs = useComposedRefs(forwardedRef, ref);
    const contentContext = useMenuContentContext(ITEM_NAME);

    // get the item's `.textContent` as default strategy for typeahead `textValue`
    const [textContent, setTextContent] = React.useState('');
    React.useEffect(() => {
      const menuItem = ref.current;
      if (menuItem) {
        setTextContent((menuItem.textContent ?? '').trim());
      }
    }, [itemProps.children]);

    return (
      <CollectionItemSlot disabled={disabled} textValue={textValue ?? textContent}>
        <RovingFocusItem asChild focusable={!disabled}>
          <Primitive.div
            role="menuitem"
            aria-disabled={disabled || undefined}
            data-disabled={disabled ? '' : undefined}
            {...itemProps}
            ref={composedRefs}
            /**
             * We focus items on `pointerMove` to achieve the following:
             *
             * - Mouse over an item (it focuses)
             * - Leave mouse where it is and use keyboard to focus a different item
             * - Wiggle mouse without it leaving previously focused item
             * - Previously focused item should re-focus
             *
             * If we used `mouseOver`/`mouseEnter` it would not re-focus when the mouse
             * wiggles. This is to match native menu implementation.
             */
            onPointerMove={composeEventHandlers(
              props.onPointerMove,
              whenMouse((event) => {
                if (disabled) {
                  contentContext.onItemLeave(event);
                } else {
                  contentContext.onItemEnter(event);
                  if (!event.defaultPrevented) {
                    const item = event.currentTarget;
                    item.focus();
                  }
                }
              })
            )}
            onPointerLeave={composeEventHandlers(
              props.onPointerLeave,
              whenMouse((event) => contentContext.onItemLeave(event))
            )}
          />
        </RovingFocusItem>
      </CollectionItemSlot>
    );
  }
);

/* -------------------------------------------------------------------------------------------------
 * MenuCheckboxItem
 * -----------------------------------------------------------------------------------------------*/

const CHECKBOX_ITEM_NAME = 'MenuCheckboxItem';

type MenuCheckboxItemElement = MenuItemElement;
interface MenuCheckboxItemProps extends MenuItemProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

const MenuCheckboxItem = React.forwardRef<MenuCheckboxItemElement, MenuCheckboxItemProps>(
  (props, forwardedRef) => {
    const { checked = false, onCheckedChange, ...checkboxItemProps } = props;
    return (
      <ItemIndicatorContext.Provider value={checked}>
        <MenuItem
          role="menuitemcheckbox"
          aria-checked={checked}
          {...checkboxItemProps}
          ref={forwardedRef}
          data-state={getCheckedState(checked)}
          onSelect={composeEventHandlers(
            checkboxItemProps.onSelect,
            () => onCheckedChange?.(!checked),
            { checkForDefaultPrevented: false }
          )}
        />
      </ItemIndicatorContext.Provider>
    );
  }
);

MenuCheckboxItem.displayName = CHECKBOX_ITEM_NAME;

/* -------------------------------------------------------------------------------------------------
 * MenuRadioGroup
 * -----------------------------------------------------------------------------------------------*/

const RADIO_GROUP_NAME = 'MenuRadioGroup';

const RadioGroupContext = React.createContext<MenuRadioGroupProps>({} as any);

type MenuRadioGroupElement = React.ElementRef<typeof MenuGroup>;
interface MenuRadioGroupProps extends MenuGroupProps {
  value?: string;
  onValueChange?: (value: string) => void;
}

const MenuRadioGroup = React.forwardRef<MenuRadioGroupElement, MenuRadioGroupProps>(
  (props, forwardedRef) => {
    const { value, onValueChange, ...groupProps } = props;
    const handleValueChange = useCallbackRef(onValueChange);
    const context = React.useMemo(
      () => ({ value, onValueChange: handleValueChange }),
      [value, handleValueChange]
    );
    return (
      <RadioGroupContext.Provider value={context}>
        <MenuGroup {...groupProps} ref={forwardedRef} />
      </RadioGroupContext.Provider>
    );
  }
);

MenuRadioGroup.displayName = RADIO_GROUP_NAME;

/* -------------------------------------------------------------------------------------------------
 * MenuRadioItem
 * -----------------------------------------------------------------------------------------------*/

const RADIO_ITEM_NAME = 'MenuRadioItem';

type MenuRadioItemElement = React.ElementRef<typeof MenuItem>;
interface MenuRadioItemProps extends MenuItemProps {
  value: string;
}

const MenuRadioItem = React.forwardRef<MenuRadioItemElement, MenuRadioItemProps>(
  (props, forwardedRef) => {
    const { value, ...radioItemProps } = props;
    const context = React.useContext(RadioGroupContext);
    const checked = value === context.value;
    return (
      <ItemIndicatorContext.Provider value={checked}>
        <MenuItem
          role="menuitemradio"
          aria-checked={checked}
          {...radioItemProps}
          ref={forwardedRef}
          data-state={getCheckedState(checked)}
          onSelect={composeEventHandlers(
            radioItemProps.onSelect,
            () => context.onValueChange?.(value),
            { checkForDefaultPrevented: false }
          )}
        />
      </ItemIndicatorContext.Provider>
    );
  }
);

MenuRadioItem.displayName = RADIO_ITEM_NAME;

/* -------------------------------------------------------------------------------------------------
 * MenuItemIndicator
 * -----------------------------------------------------------------------------------------------*/

const ITEM_INDICATOR_NAME = 'MenuItemIndicator';

const ItemIndicatorContext = React.createContext(false);

type MenuItemIndicatorElement = React.ElementRef<typeof Primitive.span>;
type PrimitiveSpanProps = Radix.ComponentPropsWithoutRef<typeof Primitive.span>;
interface MenuItemIndicatorProps extends PrimitiveSpanProps {
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: true;
}

const MenuItemIndicator = React.forwardRef<MenuItemIndicatorElement, MenuItemIndicatorProps>(
  (props, forwardedRef) => {
    const { forceMount, ...indicatorProps } = props;
    const checked = React.useContext(ItemIndicatorContext);
    return (
      <Presence present={forceMount || checked}>
        <Primitive.span
          {...indicatorProps}
          ref={forwardedRef}
          data-state={getCheckedState(checked)}
        />
      </Presence>
    );
  }
);

MenuItemIndicator.displayName = ITEM_INDICATOR_NAME;

/* -------------------------------------------------------------------------------------------------
 * MenuSeparator
 * -----------------------------------------------------------------------------------------------*/

const SEPARATOR_NAME = 'MenuSeparator';

type MenuSeparatorElement = React.ElementRef<typeof Primitive.div>;
interface MenuSeparatorProps extends PrimitiveDivProps {}

const MenuSeparator = React.forwardRef<MenuSeparatorElement, MenuSeparatorProps>(
  (props, forwardedRef) => (
    <Primitive.div role="separator" aria-orientation="horizontal" {...props} ref={forwardedRef} />
  )
);

MenuSeparator.displayName = SEPARATOR_NAME;

/* -------------------------------------------------------------------------------------------------
 * MenuArrow
 * -----------------------------------------------------------------------------------------------*/

const ARROW_NAME = 'MenuArrow';

type MenuArrowElement = React.ElementRef<typeof PopperPrimitive.Arrow>;
type PopperArrowProps = Radix.ComponentPropsWithoutRef<typeof PopperPrimitive.Arrow>;
interface MenuArrowProps extends PopperArrowProps {}

const MenuArrow = React.forwardRef<MenuArrowElement, MenuArrowProps>((props, forwardedRef) => (
  <PopperPrimitive.Arrow {...props} ref={forwardedRef} />
));

MenuArrow.displayName = ARROW_NAME;

/* -----------------------------------------------------------------------------------------------*/

function getOpenState(open: boolean) {
  return open ? 'open' : 'closed';
}

function getCheckedState(checked: boolean) {
  return checked ? 'checked' : 'unchecked';
}

function focusFirst(candidates: HTMLElement[]) {
  const PREVIOUSLY_FOCUSED_ELEMENT = document.activeElement;
  for (const candidate of candidates) {
    // if focus is already where we want to go, we don't want to keep going through the candidates
    if (candidate === PREVIOUSLY_FOCUSED_ELEMENT) return;
    candidate.focus();
    if (document.activeElement !== PREVIOUSLY_FOCUSED_ELEMENT) return;
  }
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

type Point = { x: number; y: number };
type Polygon = Point[];
type Side = 'left' | 'right';
type GraceIntent = { area: Polygon; side: Side };

// Determine if a point is inside of a polygon.
// Based on https://github.com/substack/point-in-polygon
function isPointInPolygon(point: Point, polygon: Polygon) {
  const { x, y } = point;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x;
    const yi = polygon[i].y;
    const xj = polygon[j].x;
    const yj = polygon[j].y;

    // prettier-ignore
    const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }

  return inside;
}

function isPointerInGraceArea(event: React.PointerEvent, area?: Polygon) {
  if (!area) return false;
  const cursorPos = { x: event.clientX, y: event.clientY };
  return isPointInPolygon(cursorPos, area);
}

function whenMouse<E>(handler: React.PointerEventHandler<E>): React.PointerEventHandler<E> {
  return (event) => (event.pointerType === 'mouse' ? handler(event) : undefined);
}

const Root = Menu;
const Sub = MenuSub;
const Anchor = MenuAnchor;
const SubTrigger = MenuSubTrigger;
const Content = MenuContent;
const Group = MenuGroup;
const Label = MenuLabel;
const Item = MenuItem;
const CheckboxItem = MenuCheckboxItem;
const RadioGroup = MenuRadioGroup;
const RadioItem = MenuRadioItem;
const ItemIndicator = MenuItemIndicator;
const Separator = MenuSeparator;
const Arrow = MenuArrow;

export {
  Menu,
  MenuSub,
  MenuAnchor,
  MenuSubTrigger,
  MenuContent,
  MenuGroup,
  MenuLabel,
  MenuItem,
  MenuCheckboxItem,
  MenuRadioGroup,
  MenuRadioItem,
  MenuItemIndicator,
  MenuSeparator,
  MenuArrow,
  //
  Root,
  Sub,
  Anchor,
  SubTrigger,
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
};
export type {
  MenuProps,
  MenuSubProps,
  MenuAnchorProps,
  MenuSubTriggerProps,
  MenuContentProps,
  MenuGroupProps,
  MenuLabelProps,
  MenuItemProps,
  MenuCheckboxItemProps,
  MenuRadioGroupProps,
  MenuRadioItemProps,
  MenuItemIndicatorProps,
  MenuSeparatorProps,
  MenuArrowProps,
};
