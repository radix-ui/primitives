import * as React from 'react';
import {
  composeEventHandlers,
  createContext,
  extendComponent,
  useComposedRefs,
  useControlledState,
  useId,
} from '@radix-ui/react-utils';
import { Primitive } from '@radix-ui/react-primitive';
import { getSelector } from '@radix-ui/utils';
import * as MenuPrimitive from '@radix-ui/react-menu';

import type * as Polymorphic from '@radix-ui/react-polymorphic';
import type { Merge } from '@radix-ui/utils';

/* -------------------------------------------------------------------------------------------------
 * DropdownMenu
 * -----------------------------------------------------------------------------------------------*/

const DROPDOWN_MENU_NAME = 'DropdownMenu';

type DropdownMenuContextValue = {
  triggerRef: React.RefObject<HTMLButtonElement>;
  id: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean | undefined>>;
};

const [DropdownMenuContext, useDropdownMenuContext] = createContext<DropdownMenuContextValue>(
  DROPDOWN_MENU_NAME + 'Context',
  DROPDOWN_MENU_NAME
);

type DropdownMenuOwnProps = {
  id?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

const DropdownMenu: React.FC<DropdownMenuOwnProps> = (props) => {
  const { children, id: idProp, open: openProp, defaultOpen, onOpenChange } = props;
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const generatedId = useId();
  const id = idProp || `dropdown-menu-${generatedId}`;
  const [open = false, setOpen] = useControlledState({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  });
  const context = React.useMemo(() => ({ triggerRef, id, open, setOpen }), [id, open, setOpen]);

  return <DropdownMenuContext.Provider value={context}>{children}</DropdownMenuContext.Provider>;
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
  const context = useDropdownMenuContext(TRIGGER_NAME);
  const composedTriggerRef = useComposedRefs(forwardedRef, context.triggerRef);

  return (
    <Primitive
      as={TRIGGER_DEFAULT_TAG}
      selector={getSelector(TRIGGER_NAME)}
      type="button"
      aria-haspopup="menu"
      aria-expanded={context.open ? true : undefined}
      aria-controls={context.open ? context.id : undefined}
      {...props}
      ref={composedTriggerRef}
      onMouseDown={composeEventHandlers(props.onMouseDown, (event) => {
        // only call handler if it's the left button (mousedown gets triggered by all mouse buttons)
        // but not when the control key is pressed (avoiding MacOS right click)
        if (event.button === 0 && event.ctrlKey === false) {
          context.setOpen((prevOpen) => !prevOpen);
        }
      })}
      onKeyDown={composeEventHandlers(props.onKeyDown, (event: React.KeyboardEvent) => {
        if ([' ', 'Enter', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
          event.preventDefault();
          context.setOpen(true);
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
type DropdownMenuContentOwnProps = Merge<
  Omit<MenuPrimitiveOwnProps, 'trapFocus' | 'onCloseAutoFocus' | 'onOpenAutoFocus' | 'onDismiss'>,
  { anchorRef?: MenuPrimitiveOwnProps['anchorRef'] }
>;

type DropdownMenuContentPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof MenuPrimitive.Root>,
  DropdownMenuContentOwnProps
>;

const DropdownMenuContent = React.forwardRef((props, forwardedRef) => {
  const context = useDropdownMenuContext(CONTENT_NAME);
  return (
    <MenuPrimitive.Root
      selector={getSelector(CONTENT_NAME)}
      disableOutsidePointerEvents
      disableOutsideScroll
      portalled
      {...props}
      ref={forwardedRef}
      id={context.id}
      style={{
        ...props.style,
        // re-namespace exposed content custom property
        ['--radix-dropdown-menu-content-transform-origin' as any]: 'var(--radix-popper-transform-origin)',
      }}
      open={context.open}
      onOpenChange={context.setOpen}
      anchorRef={props.anchorRef || context.triggerRef}
      trapFocus
      onCloseAutoFocus={(event) => {
        event.preventDefault();
        context.triggerRef.current?.focus();
      }}
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
      onDismiss={() => context.setOpen(false)}
    />
  );
}) as DropdownMenuContentPrimitive;

DropdownMenuContent.displayName = CONTENT_NAME;

/* ---------------------------------------------------------------------------------------------- */

const DropdownMenuGroup = extendComponent(MenuPrimitive.Group, 'DropdownMenuGroup');
const DropdownMenuLabel = extendComponent(MenuPrimitive.Label, 'DropdownMenuLabel');
const DropdownMenuItem = extendComponent(MenuPrimitive.Item, 'DropdownMenuItem');
const DropdownMenuCheckboxItem = extendComponent(
  MenuPrimitive.CheckboxItem,
  'DropdownMenuCheckboxItem'
);
const DropdownMenuRadioGroup = extendComponent(MenuPrimitive.RadioGroup, 'DropdownMenuRadioGroup');
const DropdownMenuRadioItem = extendComponent(MenuPrimitive.RadioItem, 'DropdownMenuRadioItem');
const DropdownMenuItemIndicator = extendComponent(
  MenuPrimitive.ItemIndicator,
  'DropdownMenuItemIndicator'
);
const DropdownMenuSeparator = extendComponent(MenuPrimitive.Separator, 'DropdownMenuSeparator');
const DropdownMenuArrow = extendComponent(MenuPrimitive.Arrow, 'DropdownMenuArrow');

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
