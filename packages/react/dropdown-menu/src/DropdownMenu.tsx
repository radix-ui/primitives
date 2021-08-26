import * as React from 'react';
import { composeEventHandlers } from '@radix-ui/primitive';
import { composeRefs } from '@radix-ui/react-compose-refs';
import { createContext } from '@radix-ui/react-context';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { extendPrimitive, Primitive } from '@radix-ui/react-primitive';
import * as MenuPrimitive from '@radix-ui/react-menu';
import { useId } from '@radix-ui/react-id';

import type * as Radix from '@radix-ui/react-primitive';

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
  modal: boolean;
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

type DropdownMenuProps = {
  dir?: Direction;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?(open: boolean): void;
  modal?: boolean;
};

const DropdownMenu: React.FC<DropdownMenuProps> = (props) => {
  const { children, open: openProp, defaultOpen, onOpenChange, dir, modal = true } = props;
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
    <DropdownMenuRoot
      dir={dir}
      open={open}
      onOpenChange={setOpen}
      onOpenToggle={handleOpenToggle}
      modal={modal}
    >
      {children}
    </DropdownMenuRoot>
  );
};

DropdownMenu.displayName = DROPDOWN_MENU_NAME;

/* ---------------------------------------------------------------------------------------------- */

type DropdownMenuRootProps = {
  dir?: Direction;
  open: boolean;
  onOpenChange(open: boolean): void;
  onOpenToggle(): void;
  modal?: boolean;
};

const DropdownMenuRoot: React.FC<DropdownMenuRootProps> = (props) => {
  const { children, dir, open, onOpenChange, onOpenToggle, modal = true } = props;
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
      modal={modal}
    >
      <MenuPrimitive.Root open={open} onOpenChange={onOpenChange} dir={dir} modal={modal}>
        {children}
      </MenuPrimitive.Root>
    </DropdownMenuProvider>
  );
};

/* -------------------------------------------------------------------------------------------------
 * DropdownMenuTrigger
 * -----------------------------------------------------------------------------------------------*/

const TRIGGER_NAME = 'DropdownMenuTrigger';

type DropdownMenuTriggerElement = React.ElementRef<typeof Primitive.button>;
type DropdownMenuTriggerProps = Radix.ComponentPropsWithoutRef<typeof Primitive.button>;

const DropdownMenuTrigger = React.forwardRef<DropdownMenuTriggerElement, DropdownMenuTriggerProps>(
  (props, forwardedRef) => {
    const context = useDropdownMenuContext(TRIGGER_NAME);
    return context.isRootMenu ? (
      <MenuPrimitive.Anchor asChild>
        <Primitive.button
          type="button"
          id={context.triggerId}
          aria-haspopup="menu"
          aria-expanded={context.open ? true : undefined}
          aria-controls={context.open ? context.contentId : undefined}
          data-state={context.open ? 'open' : 'closed'}
          {...props}
          ref={composeRefs(forwardedRef, context.triggerRef)}
          onPointerDown={composeEventHandlers(props.onPointerDown, (event) => {
            // only call handler if it's the left button (mousedown gets triggered by all mouse buttons)
            // but not when the control key is pressed (avoiding MacOS right click)
            if (event.button === 0 && event.ctrlKey === false) {
              // prevent trigger focusing when opening
              // this allows the content to be given focus without competition
              if (!context.open) event.preventDefault();
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
      </MenuPrimitive.Anchor>
    ) : null;
  }
);

DropdownMenuTrigger.displayName = TRIGGER_NAME;

/* -------------------------------------------------------------------------------------------------
 * DropdownMenuContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = 'DropdownMenuContent';

const ContentContext = React.createContext(false);

type DropdownMenuContentElement = React.ElementRef<
  typeof DropdownMenuRootContent | typeof MenuPrimitive.Content
>;
type DropdownMenuContentProps = Radix.ComponentPropsWithoutRef<
  typeof DropdownMenuRootContent | typeof MenuPrimitive.Content
>;

const DropdownMenuContent = React.forwardRef<DropdownMenuContentElement, DropdownMenuContentProps>(
  (props, forwardedRef) => {
    const context = useDropdownMenuContext(CONTENT_NAME);
    const commonProps = {
      ...props,
      style: {
        ...props.style,
        // re-namespace exposed content custom property
        ['--radix-dropdown-menu-content-transform-origin' as any]:
          'var(--radix-popper-transform-origin)',
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
  }
);

DropdownMenuContent.displayName = CONTENT_NAME;

/* ---------------------------------------------------------------------------------------------- */

type DropdownMenuRootContentElement = React.ElementRef<typeof MenuPrimitive.Content>;
type DropdownMenuRootContentProps = Radix.ComponentPropsWithoutRef<typeof MenuPrimitive.Content>;

const DropdownMenuRootContent = React.forwardRef<
  DropdownMenuRootContentElement,
  DropdownMenuRootContentProps
>((props, forwardedRef) => {
  const { portalled = true, ...contentProps } = props;
  const context = useDropdownMenuContext(CONTENT_NAME);
  const hasInteractedOutsideRef = React.useRef(false);

  return context.isRootMenu ? (
    <MenuPrimitive.Content
      id={context.contentId}
      aria-labelledby={context.triggerId}
      {...contentProps}
      ref={forwardedRef}
      portalled={portalled}
      onCloseAutoFocus={(event) => {
        props.onCloseAutoFocus?.(event);

        if (!event.defaultPrevented) {
          if (!hasInteractedOutsideRef.current) context.triggerRef.current?.focus();
          // Always prevent auto focus because we either focus manually or want user agent focus
          event.preventDefault();
        }

        hasInteractedOutsideRef.current = false;
      }}
      onInteractOutside={(event) => {
        props.onInteractOutside?.(event);

        if (!event.defaultPrevented) {
          const originalEvent = event.detail.originalEvent as PointerEvent;
          const ctrlLeftClick = originalEvent.button === 0 && originalEvent.ctrlKey === true;
          const isRightClick = originalEvent.button === 2 || ctrlLeftClick;

          if (!context.modal || isRightClick) hasInteractedOutsideRef.current = true;
        }

        // Prevent dismissing when clicking the trigger.
        // As the trigger is already setup to close, without doing so would
        // cause it to close and immediately open.
        //
        // We use `onInteractOutside` as some browsers also
        // focus on pointer down, creating the same issue.
        const target = event.target as HTMLElement;
        const targetIsTrigger = context.triggerRef.current?.contains(target);
        if (targetIsTrigger) event.preventDefault();
      }}
    />
  ) : null;
});

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
