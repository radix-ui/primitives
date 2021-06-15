import * as React from 'react';
import { composeEventHandlers } from '@radix-ui/primitive';
import { composeRefs } from '@radix-ui/react-compose-refs';
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

type DropdownMenuRootContextValue = {
  isRootMenu: true;
  triggerId: string;
  triggerRef: React.RefObject<HTMLButtonElement>;
  contentId: string;
  open: boolean;
  onOpenChange(open: boolean): void;
  onOpenToggle(): void;
};

type DropdownMenuSubContextValue = {
  isRootMenu: false;
  open: boolean;
  onOpenChange(open: boolean): void;
  onOpenToggle(): void;
};

const [DropdownMenuProvider, useDropdownMenuContext] = createContext<
  DropdownMenuRootContextValue | DropdownMenuSubContextValue
>(DROPDOWN_MENU_NAME);

type DropdownMenuOwnProps = {
  dir?: Direction;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?(open: boolean): void;
};

const DropdownMenu: React.FC<DropdownMenuOwnProps> = (props) => {
  const { children, open: openProp, defaultOpen, onOpenChange, dir } = props;
  const isInsideContent = React.useContext(ContentContext);
  const [open = false, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  });

  const handleOpenToggle = React.useCallback(() => setOpen((prevOpen) => !prevOpen), [setOpen]);

  return isInsideContent ? (
    <DropdownMenuProvider
      isRootMenu={false}
      open={open}
      onOpenChange={setOpen}
      onOpenToggle={handleOpenToggle}
    >
      <MenuPrimitive.Sub open={open} onOpenChange={setOpen}>
        {children}
      </MenuPrimitive.Sub>
    </DropdownMenuProvider>
  ) : (
    <DropdownMenuRoot dir={dir} open={open} onOpenChange={setOpen} onOpenToggle={handleOpenToggle}>
      {children}
    </DropdownMenuRoot>
  );
};

DropdownMenu.displayName = DROPDOWN_MENU_NAME;

/* ---------------------------------------------------------------------------------------------- */

type DropdownMenuRootOwnProps = {
  dir?: Direction;
  open: boolean;
  onOpenChange(open: boolean): void;
  onOpenToggle(): void;
};

const DropdownMenuRoot: React.FC<DropdownMenuRootOwnProps> = (props) => {
  const { children, dir, open, onOpenChange, onOpenToggle } = props;
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  return (
    <DropdownMenuProvider
      isRootMenu={true}
      triggerId={useId()}
      triggerRef={triggerRef}
      contentId={useId()}
      open={open}
      onOpenChange={onOpenChange}
      onOpenToggle={onOpenToggle}
    >
      <MenuPrimitive.Root open={open} onOpenChange={onOpenChange} dir={dir}>
        {children}
      </MenuPrimitive.Root>
    </DropdownMenuProvider>
  );
};

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
  return context.isRootMenu ? (
    <MenuPrimitive.Anchor
      type="button"
      id={context.triggerId}
      aria-haspopup="menu"
      aria-expanded={context.open ? true : undefined}
      aria-controls={context.open ? context.contentId : undefined}
      data-state={context.open ? 'open' : 'closed'}
      {...triggerProps}
      as={as}
      ref={composeRefs(forwardedRef, context.triggerRef)}
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
  ) : null;
}) as DropdownMenuTriggerPrimitive;

DropdownMenuTrigger.displayName = TRIGGER_NAME;

/* -------------------------------------------------------------------------------------------------
 * DropdownMenuContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = 'DropdownMenuContent';

const ContentContext = React.createContext(false);

type DropdownMenuContentOwnProps = Omit<
  Polymorphic.OwnProps<typeof MenuPrimitive.Content>,
  'trapFocus'
>;

type DropdownMenuContentPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof MenuPrimitive.Content>,
  DropdownMenuContentOwnProps
>;

const DropdownMenuContent = React.forwardRef((props, forwardedRef) => {
  const context = useDropdownMenuContext(CONTENT_NAME);
  const commonProps = {
    ...props,
    style: {
      ...props.style,
      // re-namespace exposed content custom property
      ['--radix-dropdown-menu-content-transform-origin' as any]: 'var(--radix-popper-transform-origin)',
    },
  };

  return (
    <ContentContext.Provider value={true}>
      {context.isRootMenu ? (
        <DropdownMenuRootContent {...commonProps} ref={forwardedRef} />
      ) : (
        <MenuPrimitive.Content {...commonProps} ref={forwardedRef} />
      )}
    </ContentContext.Provider>
  );
}) as DropdownMenuContentPrimitive;

DropdownMenuContent.displayName = CONTENT_NAME;

/* ---------------------------------------------------------------------------------------------- */

type DropdownMenuRootContentOwnProps = Polymorphic.OwnProps<typeof MenuPrimitive.Content>;
type DropdownMenuRootContentPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof MenuPrimitive.Content>,
  DropdownMenuRootContentOwnProps
>;

const DropdownMenuRootContent = React.forwardRef((props, forwardedRef) => {
  const {
    disableOutsidePointerEvents = true,
    disableOutsideScroll = true,
    portalled = true,
    ...contentProps
  } = props;
  const context = useDropdownMenuContext(CONTENT_NAME);

  return context.isRootMenu ? (
    <MenuPrimitive.Content
      id={context.contentId}
      aria-labelledby={context.triggerId}
      {...contentProps}
      ref={forwardedRef}
      disableOutsidePointerEvents={disableOutsidePointerEvents}
      disableOutsideScroll={disableOutsideScroll}
      portalled={portalled}
      trapFocus
      onCloseAutoFocus={composeEventHandlers(props.onCloseAutoFocus, (event) => {
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
  ) : null;
}) as DropdownMenuRootContentPrimitive;

/* ---------------------------------------------------------------------------------------------- */

const DropdownMenuGroup = extendPrimitive(MenuPrimitive.Group, {
  displayName: 'DropdownMenuGroup',
});
const DropdownMenuLabel = extendPrimitive(MenuPrimitive.Label, {
  displayName: 'DropdownMenuLabel',
});
const DropdownMenuTriggerItem = extendPrimitive(MenuPrimitive.SubTrigger, {
  displayName: 'DropdownMenuTriggerItem',
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
export type { DropdownMenuTriggerPrimitive, DropdownMenuContentPrimitive };
