import * as React from 'react';
import { composeEventHandlers } from '@radix-ui/primitive';
import { composeRefs } from '@radix-ui/react-compose-refs';
import { createContext } from '@radix-ui/react-context';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { Primitive } from '@radix-ui/react-primitive';
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

interface DropdownMenuProps {
  dir?: Direction;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?(open: boolean): void;
  modal?: boolean;
}

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

interface DropdownMenuRootProps {
  dir?: Direction;
  open: boolean;
  onOpenChange(open: boolean): void;
  onOpenToggle(): void;
  modal?: boolean;
}

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
type PrimitiveButtonProps = Radix.ComponentPropsWithoutRef<typeof Primitive.button>;
interface DropdownMenuTriggerProps extends PrimitiveButtonProps {}

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

type DropdownMenuContentElement =
  | DropdownMenuRootContentElement
  | React.ElementRef<typeof MenuPrimitive.Content>;
type MenuContentProps = Radix.ComponentPropsWithoutRef<typeof MenuPrimitive.Content>;
interface DropdownMenuContentProps extends DropdownMenuRootContentProps, MenuContentProps {}

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
interface DropdownMenuRootContentProps extends MenuContentProps {}

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

/* -------------------------------------------------------------------------------------------------
 * DropdownMenuGroup
 * -----------------------------------------------------------------------------------------------*/

const GROUP_NAME = 'DropdownMenuGroup';

type DropdownMenuGroupElement = React.ElementRef<typeof MenuPrimitive.Group>;
type MenuGroupProps = Radix.ComponentPropsWithoutRef<typeof MenuPrimitive.Group>;
interface DropdownMenuGroupProps extends MenuGroupProps {}

const DropdownMenuGroup = React.forwardRef<DropdownMenuGroupElement, DropdownMenuGroupProps>(
  (props, forwardedRef) => <MenuPrimitive.Group {...props} ref={forwardedRef} />
);

DropdownMenuGroup.displayName = GROUP_NAME;

/* -------------------------------------------------------------------------------------------------
 * DropdownMenuLabel
 * -----------------------------------------------------------------------------------------------*/

const LABEL_NAME = 'DropdownMenuLabel';

type DropdownMenuLabelElement = React.ElementRef<typeof MenuPrimitive.Label>;
type MenuLabelProps = Radix.ComponentPropsWithoutRef<typeof MenuPrimitive.Label>;
interface DropdownMenuLabelProps extends MenuLabelProps {}

const DropdownMenuLabel = React.forwardRef<DropdownMenuLabelElement, DropdownMenuLabelProps>(
  (props, forwardedRef) => <MenuPrimitive.Label {...props} ref={forwardedRef} />
);

DropdownMenuLabel.displayName = LABEL_NAME;

/* -------------------------------------------------------------------------------------------------
 * DropdownMenuItem
 * -----------------------------------------------------------------------------------------------*/

const ITEM_NAME = 'DropdownMenuItem';

type DropdownMenuItemElement = React.ElementRef<typeof MenuPrimitive.Item>;
type MenuItemProps = Radix.ComponentPropsWithoutRef<typeof MenuPrimitive.Item>;
interface DropdownMenuItemProps extends MenuItemProps {}

const DropdownMenuItem = React.forwardRef<DropdownMenuItemElement, DropdownMenuItemProps>(
  (props, forwardedRef) => <MenuPrimitive.Item {...props} ref={forwardedRef} />
);

DropdownMenuItem.displayName = ITEM_NAME;

/* -------------------------------------------------------------------------------------------------
 * DropdownMenuTriggerItem
 * -----------------------------------------------------------------------------------------------*/

const TRIGGER_ITEM_NAME = 'DropdownMenuTriggerItem';

type DropdownMenuTriggerItemElement = React.ElementRef<typeof MenuPrimitive.SubTrigger>;
type MenuSubTriggerProps = Radix.ComponentPropsWithoutRef<typeof MenuPrimitive.SubTrigger>;
interface DropdownMenuTriggerItemProps extends MenuSubTriggerProps {}

const DropdownMenuTriggerItem = React.forwardRef<
  DropdownMenuTriggerItemElement,
  DropdownMenuTriggerItemProps
>((props, forwardedRef) => <MenuPrimitive.SubTrigger {...props} ref={forwardedRef} />);

DropdownMenuTriggerItem.displayName = TRIGGER_ITEM_NAME;

/* -------------------------------------------------------------------------------------------------
 * DropdownMenuCheckboxItem
 * -----------------------------------------------------------------------------------------------*/

const CHECKBOX_ITEM_NAME = 'DropdownMenuCheckboxItem';

type DropdownMenuCheckboxItemElement = React.ElementRef<typeof MenuPrimitive.CheckboxItem>;
type MenuCheckboxItemProps = Radix.ComponentPropsWithoutRef<typeof MenuPrimitive.CheckboxItem>;
interface DropdownMenuCheckboxItemProps extends MenuCheckboxItemProps {}

const DropdownMenuCheckboxItem = React.forwardRef<
  DropdownMenuCheckboxItemElement,
  DropdownMenuCheckboxItemProps
>((props, forwardedRef) => <MenuPrimitive.CheckboxItem {...props} ref={forwardedRef} />);

DropdownMenuCheckboxItem.displayName = CHECKBOX_ITEM_NAME;

/* -------------------------------------------------------------------------------------------------
 * DropdownMenuRadioGroup
 * -----------------------------------------------------------------------------------------------*/

const RADIO_GROUP_NAME = 'DropdownMenuRadioGroup';

type DropdownMenuRadioGroupElement = React.ElementRef<typeof MenuPrimitive.RadioGroup>;
type MenuRadioGroupProps = Radix.ComponentPropsWithoutRef<typeof MenuPrimitive.RadioGroup>;
interface DropdownMenuRadioGroupProps extends MenuRadioGroupProps {}

const DropdownMenuRadioGroup = React.forwardRef<
  DropdownMenuRadioGroupElement,
  DropdownMenuRadioGroupProps
>((props, forwardedRef) => <MenuPrimitive.RadioGroup {...props} ref={forwardedRef} />);

DropdownMenuRadioGroup.displayName = RADIO_GROUP_NAME;

/* -------------------------------------------------------------------------------------------------
 * DropdownMenuRadioItem
 * -----------------------------------------------------------------------------------------------*/

const RADIO_ITEM_NAME = 'DropdownMenuRadioItem';

type DropdownMenuRadioItemElement = React.ElementRef<typeof MenuPrimitive.RadioItem>;
type MenuRadioItemProps = Radix.ComponentPropsWithoutRef<typeof MenuPrimitive.RadioItem>;
interface DropdownMenuRadioItemProps extends MenuRadioItemProps {}

const DropdownMenuRadioItem = React.forwardRef<
  DropdownMenuRadioItemElement,
  DropdownMenuRadioItemProps
>((props, forwardedRef) => <MenuPrimitive.RadioItem {...props} ref={forwardedRef} />);

DropdownMenuRadioItem.displayName = RADIO_ITEM_NAME;

/* -------------------------------------------------------------------------------------------------
 * DropdownMenuItemIndicator
 * -----------------------------------------------------------------------------------------------*/

const INDICATOR_NAME = 'DropdownMenuItemIndicator';

type DropdownMenuItemIndicatorElement = React.ElementRef<typeof MenuPrimitive.ItemIndicator>;
type MenuItemIndicatorProps = Radix.ComponentPropsWithoutRef<typeof MenuPrimitive.ItemIndicator>;
interface DropdownMenuItemIndicatorProps extends MenuItemIndicatorProps {}

const DropdownMenuItemIndicator = React.forwardRef<
  DropdownMenuItemIndicatorElement,
  DropdownMenuItemIndicatorProps
>((props, forwardedRef) => <MenuPrimitive.ItemIndicator {...props} ref={forwardedRef} />);

DropdownMenuItemIndicator.displayName = INDICATOR_NAME;

/* -------------------------------------------------------------------------------------------------
 * DropdownMenuSeparator
 * -----------------------------------------------------------------------------------------------*/

const SEPARATOR_NAME = 'DropdownMenuSeparator';

type DropdownMenuSeparatorElement = React.ElementRef<typeof MenuPrimitive.Separator>;
type MenuSeparatorProps = Radix.ComponentPropsWithoutRef<typeof MenuPrimitive.Separator>;
interface DropdownMenuSeparatorProps extends MenuSeparatorProps {}

const DropdownMenuSeparator = React.forwardRef<
  DropdownMenuSeparatorElement,
  DropdownMenuSeparatorProps
>((props, forwardedRef) => <MenuPrimitive.Separator {...props} ref={forwardedRef} />);

DropdownMenuSeparator.displayName = SEPARATOR_NAME;

/* -------------------------------------------------------------------------------------------------
 * DropdownMenuArrow
 * -----------------------------------------------------------------------------------------------*/

const ARROW_NAME = 'DropdownMenuArrow';

type DropdownMenuArrowElement = React.ElementRef<typeof MenuPrimitive.Arrow>;
type MenuArrowProps = Radix.ComponentPropsWithoutRef<typeof MenuPrimitive.Arrow>;
interface DropdownMenuArrowProps extends MenuArrowProps {}

const DropdownMenuArrow = React.forwardRef<DropdownMenuArrowElement, DropdownMenuArrowProps>(
  (props, forwardedRef) => <MenuPrimitive.Arrow {...props} ref={forwardedRef} />
);

DropdownMenuArrow.displayName = ARROW_NAME;

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
  DropdownMenuProps,
  DropdownMenuTriggerProps,
  DropdownMenuContentProps,
  DropdownMenuGroupProps,
  DropdownMenuLabelProps,
  DropdownMenuItemProps,
  DropdownMenuTriggerItemProps,
  DropdownMenuCheckboxItemProps,
  DropdownMenuRadioGroupProps,
  DropdownMenuRadioItemProps,
  DropdownMenuItemIndicatorProps,
  DropdownMenuSeparatorProps,
  DropdownMenuArrowProps,
};
