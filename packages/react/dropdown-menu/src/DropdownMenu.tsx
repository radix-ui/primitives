import * as React from 'react';
import {
  composeEventHandlers,
  createContext,
  extendComponent,
  useComposedRefs,
  useControlledState,
  useId,
} from '@interop-ui/react-utils';
import { forwardRefWithAs } from '@interop-ui/react-polymorphic';
import { getPartDataAttrObj } from '@interop-ui/utils';
import * as MenuPrimitive from '@interop-ui/react-menu';

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

const DropdownMenuTrigger = forwardRefWithAs<typeof TRIGGER_DEFAULT_TAG>((props, forwardedRef) => {
  const { as: Comp = TRIGGER_DEFAULT_TAG, onClick, ...triggerProps } = props;
  const context = useDropdownMenuContext(TRIGGER_NAME);
  const composedTriggerRef = useComposedRefs(forwardedRef, context.triggerRef);

  return (
    <Comp
      {...getPartDataAttrObj(TRIGGER_NAME)}
      ref={composedTriggerRef}
      type="button"
      aria-haspopup="menu"
      aria-expanded={context.open ? true : undefined}
      aria-controls={context.open ? context.id : undefined}
      {...triggerProps}
      onMouseDown={composeEventHandlers(triggerProps.onMouseDown, (event) => {
        // only call handler if it's the left button (mousedown gets triggered by all mouse buttons)
        // but not when the control key is pressed (avoiding MacOS right click)
        if (event.button === 0 && event.ctrlKey === false) {
          context.setOpen((prevOpen) => !prevOpen);
        }
      })}
      onKeyDown={composeEventHandlers(triggerProps.onKeyDown, (event: React.KeyboardEvent) => {
        if (event.key === ' ' || event.key === 'ArrowUp' || event.key === 'ArrowDown') {
          event.preventDefault();
          context.setOpen(true);
        }
      })}
    />
  );
});

DropdownMenuTrigger.displayName = TRIGGER_NAME;

/* -------------------------------------------------------------------------------------------------
 * DropdownMenuContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = 'DropdownMenuContent';

type DropdownMenuContentOwnProps = {
  anchorRef?: React.ComponentProps<typeof MenuPrimitive.Root>['anchorRef'];
  trapFocus: never;
  onCloseAutoFocus: never;
  onOpenAutoFocus: never;
  onDismiss: never;
};

const DropdownMenuContent = forwardRefWithAs<
  typeof MenuPrimitive.Root,
  DropdownMenuContentOwnProps
>((props, forwardedRef) => {
  const {
    anchorRef,
    disableOutsidePointerEvents = true,
    onPointerDownOutside,
    onInteractOutside,
    disableOutsideScroll = true,
    portalled = true,
    ...contentProps
  } = props;
  const context = useDropdownMenuContext(CONTENT_NAME);
  const [skipCloseAutoFocus, setSkipCloseAutoFocus] = React.useState(false);
  return (
    <MenuPrimitive.Root
      ref={forwardedRef}
      {...contentProps}
      {...getPartDataAttrObj(CONTENT_NAME)}
      id={context.id}
      style={{
        ...contentProps.style,
        // re-namespace exposed content custom property
        ['--radix-dropdown-menu-content-transform-origin' as any]: 'var(--radix-popper-transform-origin)',
      }}
      open={context.open}
      onOpenChange={context.setOpen}
      anchorRef={anchorRef || context.triggerRef}
      trapFocus
      onCloseAutoFocus={(event) => {
        if (skipCloseAutoFocus) {
          event.preventDefault();
        } else {
          context.triggerRef.current?.focus();
        }
      }}
      disableOutsidePointerEvents={disableOutsidePointerEvents}
      onPointerDownOutside={(event) => {
        const wasTrigger = event.target === context.triggerRef.current;

        // skip autofocus on close if clicking outside is allowed and it happened
        setSkipCloseAutoFocus(!disableOutsidePointerEvents);

        // prevent dismissing when clicking the trigger
        // as it's already setup to close, otherwise it would close and immediately open.
        if (wasTrigger) {
          event.preventDefault();
        } else {
          onInteractOutside?.(event);
        }

        if (event.defaultPrevented) {
          // reset this because the event was prevented
          setSkipCloseAutoFocus(false);
        }
      }}
      onInteractOutside={onInteractOutside}
      disableOutsideScroll={disableOutsideScroll}
      portalled={portalled}
      onDismiss={() => context.setOpen(false)}
    />
  );
});

DropdownMenuContent.displayName = CONTENT_NAME;

/* -----------------------------------------------------------------------------------------------*/

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
const MenuGroup = DropdownMenuGroup;
const MenuLabel = DropdownMenuLabel;
const MenuItem = DropdownMenuItem;
const MenuCheckboxItem = DropdownMenuCheckboxItem;
const MenuRadioGroup = DropdownMenuRadioGroup;
const MenuRadioItem = DropdownMenuRadioItem;
const MenuItemIndicator = DropdownMenuItemIndicator;
const MenuSeparator = DropdownMenuSeparator;
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
  MenuGroup,
  MenuLabel,
  MenuItem,
  MenuCheckboxItem,
  MenuRadioGroup,
  MenuRadioItem,
  MenuItemIndicator,
  MenuSeparator,
  Arrow,
};
