import * as React from 'react';
import { composeEventHandlers } from '@radix-ui/primitive';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import { createContext } from '@radix-ui/react-context';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { Primitive, extendPrimitive } from '@radix-ui/react-primitive';
import * as MenuPrimitive from '@radix-ui/react-menu';
import { useId } from '@radix-ui/react-id';

import type * as Polymorphic from '@radix-ui/react-polymorphic';

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

const [DropdownMenuProvider, useDropdownMenuContext] = createContext<DropdownMenuContextValue>(
  DROPDOWN_MENU_NAME
);

type DropdownMenuOwnProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?(open: boolean): void;
};

const DropdownMenu: React.FC<DropdownMenuOwnProps> = (props) => {
  const { children, open: openProp, defaultOpen, onOpenChange } = props;
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
      {children}
    </DropdownMenuProvider>
  );
};

DropdownMenu.displayName = DROPDOWN_MENU_NAME;

/* -------------------------------------------------------------------------------------------------
 * DropdownMenuTrigger
 * -----------------------------------------------------------------------------------------------*/

const TRIGGER_NAME = 'DropdownMenuTrigger';
const TRIGGER_DEFAULT_TAG = 'button';

type DropdownMenuTriggerOwnProps = Polymorphic.OwnProps<typeof Primitive>;
type DropdownMenuTriggerPrimitive = Polymorphic.ForwardRefComponent<
  typeof TRIGGER_DEFAULT_TAG,
  DropdownMenuTriggerOwnProps
>;

const DropdownMenuTrigger = React.forwardRef((props, forwardedRef) => {
  const { as = TRIGGER_DEFAULT_TAG, ...triggerProps } = props;
  const context = useDropdownMenuContext(TRIGGER_NAME);
  const composedTriggerRef = useComposedRefs(forwardedRef, context.triggerRef);

  return (
    <Primitive
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
        if ([' ', 'Enter', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
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

type MenuPrimitiveOwnProps = Polymorphic.OwnProps<typeof MenuPrimitive.Root>;
type DropdownMenuContentOwnProps = Polymorphic.Merge<
  Omit<MenuPrimitiveOwnProps, 'trapFocus' | 'onOpenAutoFocus' | 'onDismiss'>,
  { anchorRef?: MenuPrimitiveOwnProps['anchorRef'] }
>;

type DropdownMenuContentPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof MenuPrimitive.Root>,
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
    <MenuPrimitive.Root
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
      open={context.open}
      onOpenChange={context.onOpenChange}
      anchorRef={props.anchorRef || context.triggerRef}
      trapFocus
      onCloseAutoFocus={composeEventHandlers(onCloseAutoFocus, (event) => {
        event.preventDefault();
        context.triggerRef.current?.focus();
      })}
      onPointerDownOutside={composeEventHandlers(
        props.onPointerDownOutside,
        (event) => {
          const wasTrigger = context.triggerRef.current?.contains(event.target as HTMLElement);

          // prevent dismissing when clicking the trigger
          // as it's already setup to close, otherwise it would close and immediately open.
          if (wasTrigger) {
            event.preventDefault();
          }
        },
        { checkForDefaultPrevented: false }
      )}
      onDismiss={() => context.onOpenChange(false)}
    />
  );
}) as DropdownMenuContentPrimitive;

DropdownMenuContent.displayName = CONTENT_NAME;

/* ---------------------------------------------------------------------------------------------- */

const DropdownMenuGroup = extendPrimitive(MenuPrimitive.Group, 'DropdownMenuGroup');
const DropdownMenuLabel = extendPrimitive(MenuPrimitive.Label, 'DropdownMenuLabel');
const DropdownMenuItem = extendPrimitive(MenuPrimitive.Item, 'DropdownMenuItem');
const DropdownMenuCheckboxItem = extendPrimitive(
  MenuPrimitive.CheckboxItem,
  'DropdownMenuCheckboxItem'
);
const DropdownMenuRadioGroup = extendPrimitive(MenuPrimitive.RadioGroup, 'DropdownMenuRadioGroup');
const DropdownMenuRadioItem = extendPrimitive(MenuPrimitive.RadioItem, 'DropdownMenuRadioItem');
const DropdownMenuItemIndicator = extendPrimitive(
  MenuPrimitive.ItemIndicator,
  'DropdownMenuItemIndicator'
);
const DropdownMenuSeparator = extendPrimitive(MenuPrimitive.Separator, 'DropdownMenuSeparator');
const DropdownMenuArrow = extendPrimitive(MenuPrimitive.Arrow, 'DropdownMenuArrow');

/* -----------------------------------------------------------------------------------------------*/

const Root = DropdownMenu;
const Trigger = DropdownMenuTrigger;
const Content = DropdownMenuContent;
const Group = DropdownMenuGroup;
const Label = DropdownMenuLabel;
const Item = DropdownMenuItem;
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
  CheckboxItem,
  RadioGroup,
  RadioItem,
  ItemIndicator,
  Separator,
  Arrow,
};
