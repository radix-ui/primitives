import * as React from 'react';
import { composeEventHandlers } from '@radix-ui/primitive';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import { createContext } from '@radix-ui/react-context';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { extendPrimitive } from '@radix-ui/react-primitive';
import * as MenuPrimitive from '@radix-ui/react-menu';
import { useId } from '@radix-ui/react-id';

import type * as Polymorphic from '@radix-ui/react-polymorphic';

type Direction = 'ltr' | 'rtl';

/* -------------------------------------------------------------------------------------------------
 * DropdownMenu
 * -----------------------------------------------------------------------------------------------*/

const DROPDOWN_MENU_NAME = 'DropdownMenu';

type DropdownMenuContextValue = {
  triggerRef: React.RefObject<HTMLButtonElement>;
  contentId: string;
  open: boolean;
  onOpenChange(open: boolean): void;
  onOpenToggle(): void;
};

const SubmenuContext = React.createContext(false);
const [DropdownMenuProvider, useDropdownMenuContext] = createContext<DropdownMenuContextValue>(
  DROPDOWN_MENU_NAME
);

type DropdownMenuOwnProps = {
  open?: boolean;
  onOpenChange?(open: boolean): void;
  defaultOpen?: boolean;
  dir?: Direction;
};

const DropdownMenu: React.FC<DropdownMenuOwnProps> = (props) => {
  const { children, open: openProp, defaultOpen, onOpenChange, dir } = props;
  const isSubmenu = React.useContext(SubmenuContext);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const [open = false, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  });

  return (
    <DropdownMenuProvider
      triggerRef={triggerRef}
      contentId={useId()}
      open={open}
      onOpenChange={setOpen}
      onOpenToggle={React.useCallback(() => setOpen((prevOpen) => !prevOpen), [setOpen])}
    >
      {isSubmenu ? (
        <MenuPrimitive.Sub open={open} onOpenChange={setOpen}>
          {children}
        </MenuPrimitive.Sub>
      ) : (
        <MenuPrimitive.Root open={open} onOpenChange={setOpen} dir={dir}>
          {children}
        </MenuPrimitive.Root>
      )}
    </DropdownMenuProvider>
  );
};

DropdownMenu.displayName = DROPDOWN_MENU_NAME;

/* -------------------------------------------------------------------------------------------------
 * DropdownMenuTrigger
 * -----------------------------------------------------------------------------------------------*/

const TRIGGER_NAME = 'DropdownMenuTrigger';
const TRIGGER_DEFAULT_TAG = 'button';

type DropdownMenuTriggerOwnProps = Omit<
  Polymorphic.OwnProps<typeof MenuPrimitive.Anchor>,
  'virtualRef'
>;
type DropdownMenuTriggerPrimitive = Polymorphic.ForwardRefComponent<
  typeof TRIGGER_DEFAULT_TAG,
  DropdownMenuTriggerOwnProps
>;

const DropdownMenuTrigger = React.forwardRef((props, forwardedRef) => {
  const { as = TRIGGER_DEFAULT_TAG, ...triggerProps } = props;
  const context = useDropdownMenuContext(TRIGGER_NAME);
  const composedTriggerRef = useComposedRefs(forwardedRef, context.triggerRef);

  return (
    <MenuPrimitive.Anchor
      type="button"
      aria-haspopup="menu"
      aria-expanded={context.open ? true : undefined}
      aria-controls={context.open ? context.contentId : undefined}
      data-state={context.open ? 'open' : 'closed'}
      {...triggerProps}
      as={as}
      ref={composedTriggerRef}
      onMouseDown={composeEventHandlers(props.onMouseDown, (event) => {
        // only call handler if it's the left button (mousedown gets triggered by all mouse buttons)
        // but not when the control key is pressed (avoiding MacOS right click)
        if (event.button === 0 && event.ctrlKey === false) {
          context.onOpenToggle();
        }
      })}
      onKeyDown={composeEventHandlers(props.onKeyDown, (event: React.KeyboardEvent) => {
        if ([' ', 'Enter', 'ArrowDown'].includes(event.key)) {
          event.preventDefault();
          context.onOpenChange(true);
        }
      })}
    />
  );
}) as DropdownMenuTriggerPrimitive;

DropdownMenuTrigger.displayName = TRIGGER_NAME;

/* -------------------------------------------------------------------------------------------------
 * DropdownMenuContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = 'DropdownMenuContent';

type DropdownMenuContentOwnProps = Omit<
  Polymorphic.OwnProps<typeof MenuPrimitive.Content>,
  'trapFocus' | 'onOpenAutoFocus'
>;

type DropdownMenuContentPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof MenuPrimitive.Content>,
  DropdownMenuContentOwnProps
>;

const DropdownMenuContent = React.forwardRef((props, forwardedRef) => {
  const {
    onCloseAutoFocus,
    disableOutsidePointerEvents = true,
    disableOutsideScroll = true,
    portalled = true,
    ...contentProps
  } = props;
  const context = useDropdownMenuContext(CONTENT_NAME);
  return (
    <SubmenuContext.Provider value={true}>
      <MenuPrimitive.Content
        id={context.contentId}
        {...contentProps}
        ref={forwardedRef}
        disableOutsidePointerEvents={disableOutsidePointerEvents}
        disableOutsideScroll={disableOutsideScroll}
        portalled={portalled}
        style={{
          ...props.style,
          // re-namespace exposed content custom property
          ['--radix-dropdown-menu-content-transform-origin' as any]: 'var(--radix-popper-transform-origin)',
        }}
        trapFocus
        onCloseAutoFocus={composeEventHandlers(onCloseAutoFocus, (event) => {
          event.preventDefault();
          context.triggerRef.current?.focus();
        })}
        onPointerDownOutside={composeEventHandlers(
          props.onPointerDownOutside,
          (event) => {
            const target = event.target as HTMLElement;
            const targetIsTrigger = context.triggerRef.current?.contains(target);
            // prevent dismissing when clicking the trigger
            // as it's already setup to close, otherwise it would close and immediately open.
            if (targetIsTrigger) event.preventDefault();
          },
          { checkForDefaultPrevented: false }
        )}
      />
    </SubmenuContext.Provider>
  );
}) as DropdownMenuContentPrimitive;

DropdownMenuContent.displayName = CONTENT_NAME;

/* -------------------------------------------------------------------------------------------------
 * DropdownMenuTriggerItem
 * -----------------------------------------------------------------------------------------------*/

const TRIGGER_ITEM_NAME = 'DropdownMenuTriggerItem';

type DropdownMenuTriggerItemOwnProps = Polymorphic.OwnProps<typeof MenuPrimitive.SubTrigger>;
type DropdownMenuTriggerItemPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof MenuPrimitive.SubTrigger>,
  DropdownMenuTriggerItemOwnProps
>;

const DropdownMenuTriggerItem = React.forwardRef((props, forwardedRef) => {
  const isSubmenu = React.useContext(SubmenuContext);
  return isSubmenu ? <MenuPrimitive.SubTrigger {...props} ref={forwardedRef} /> : null;
}) as DropdownMenuTriggerItemPrimitive;

DropdownMenuTriggerItem.displayName = TRIGGER_ITEM_NAME;

/* ---------------------------------------------------------------------------------------------- */

const DropdownMenuGroup = extendPrimitive(MenuPrimitive.Group, {
  displayName: 'DropdownMenuGroup',
});
const DropdownMenuLabel = extendPrimitive(MenuPrimitive.Label, {
  displayName: 'DropdownMenuLabel',
});
const DropdownMenuItem = extendPrimitive(MenuPrimitive.Item, { displayName: 'DropdownMenuItem' });
const DropdownMenuCheckboxItem = extendPrimitive(MenuPrimitive.CheckboxItem, {
  displayName: 'DropdownMenuCheckboxItem',
});
const DropdownMenuRadioGroup = extendPrimitive(MenuPrimitive.RadioGroup, {
  displayName: 'DropdownMenuRadioGroup',
});
const DropdownMenuRadioItem = extendPrimitive(MenuPrimitive.RadioItem, {
  displayName: 'DropdownMenuRadioItem',
});
const DropdownMenuItemIndicator = extendPrimitive(MenuPrimitive.ItemIndicator, {
  displayName: 'DropdownMenuItemIndicator',
});
const DropdownMenuSeparator = extendPrimitive(MenuPrimitive.Separator, {
  displayName: 'DropdownMenuSeparator',
});
const DropdownMenuArrow = extendPrimitive(MenuPrimitive.Arrow, {
  displayName: 'DropdownMenuArrow',
});

/* -----------------------------------------------------------------------------------------------*/

const Root = DropdownMenu;
const Trigger = DropdownMenuTrigger;
const Content = DropdownMenuContent;
const Group = DropdownMenuGroup;
const Label = DropdownMenuLabel;
const Item = DropdownMenuItem;
const TriggerItem = DropdownMenuTriggerItem;
const CheckboxItem = DropdownMenuCheckboxItem;
const RadioGroup = DropdownMenuRadioGroup;
const RadioItem = DropdownMenuRadioItem;
const ItemIndicator = DropdownMenuItemIndicator;
const Separator = DropdownMenuSeparator;
const Arrow = DropdownMenuArrow;

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuTriggerItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuItemIndicator,
  DropdownMenuSeparator,
  DropdownMenuArrow,
  //
  Root,
  Trigger,
  Content,
  Group,
  Label,
  Item,
  TriggerItem,
  CheckboxItem,
  RadioGroup,
  RadioItem,
  ItemIndicator,
  Separator,
  Arrow,
};
export type {
  DropdownMenuTriggerPrimitive,
  DropdownMenuContentPrimitive,
  DropdownMenuTriggerItemPrimitive,
};
