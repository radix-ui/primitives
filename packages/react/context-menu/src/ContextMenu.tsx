import * as React from 'react';
import { composeEventHandlers } from '@radix-ui/primitive';
import { createContext } from '@radix-ui/react-context';
import { Primitive } from '@radix-ui/react-primitive';
import * as MenuPrimitive from '@radix-ui/react-menu';
import { useCallbackRef } from '@radix-ui/react-use-callback-ref';

import type * as Radix from '@radix-ui/react-primitive';

type Direction = 'ltr' | 'rtl';
type Point = { x: number; y: number };

/* -------------------------------------------------------------------------------------------------
 * ContextMenu
 * -----------------------------------------------------------------------------------------------*/

const CONTEXT_MENU_NAME = 'ContextMenu';

type ContextMenuContextValue = {
  isRootMenu: boolean;
  open: boolean;
  onOpenChange(open: boolean): void;
  modal: boolean;
};

const [ContextMenuProvider, useContextMenuContext] =
  createContext<ContextMenuContextValue>(CONTEXT_MENU_NAME);

interface ContextMenuProps {
  onOpenChange?(open: boolean): void;
  dir?: Direction;
  modal?: boolean;
}

const ContextMenu: React.FC<ContextMenuProps> = (props) => {
  const { children, onOpenChange, dir, modal = true } = props;
  const [open, setOpen] = React.useState(false);
  const isInsideContent = React.useContext(ContentContext);
  const handleOpenChangeProp = useCallbackRef(onOpenChange);

  const handleOpenChange = React.useCallback(
    (open) => {
      setOpen(open);
      handleOpenChangeProp(open);
    },
    [handleOpenChangeProp]
  );

  return isInsideContent ? (
    <ContextMenuProvider
      isRootMenu={false}
      open={open}
      onOpenChange={handleOpenChange}
      modal={modal}
    >
      <MenuPrimitive.Sub open={open} onOpenChange={handleOpenChange}>
        {children}
      </MenuPrimitive.Sub>
    </ContextMenuProvider>
  ) : (
    <ContextMenuProvider
      isRootMenu={true}
      open={open}
      onOpenChange={handleOpenChange}
      modal={modal}
    >
      <MenuPrimitive.Root dir={dir} open={open} onOpenChange={handleOpenChange} modal={modal}>
        {children}
      </MenuPrimitive.Root>
    </ContextMenuProvider>
  );
};

ContextMenu.displayName = CONTEXT_MENU_NAME;

/* -------------------------------------------------------------------------------------------------
 * ContextMenuTrigger
 * -----------------------------------------------------------------------------------------------*/

const TRIGGER_NAME = 'ContextMenuTrigger';

type ContextMenuTriggerElement = React.ElementRef<typeof Primitive.span>;
type PrimitiveSpanProps = Radix.ComponentPropsWithoutRef<typeof Primitive.span>;
interface ContextMenuTriggerProps extends PrimitiveSpanProps {}

const ContextMenuTrigger = React.forwardRef<ContextMenuTriggerElement, ContextMenuTriggerProps>(
  (props, forwardedRef) => {
    const context = useContextMenuContext(TRIGGER_NAME);
    const pointRef = React.useRef<Point>({ x: 0, y: 0 });
    const virtualRef = React.useRef({
      getBoundingClientRect: () => DOMRect.fromRect({ width: 0, height: 0, ...pointRef.current }),
    });
    const longPressTimerRef = React.useRef(0);
    const clearLongPress = React.useCallback(
      () => window.clearTimeout(longPressTimerRef.current),
      []
    );
    const handleOpen = (event: React.MouseEvent | React.PointerEvent) => {
      pointRef.current = { x: event.clientX, y: event.clientY };
      context.onOpenChange(true);
    };

    React.useEffect(() => clearLongPress, [clearLongPress]);

    return (
      <ContentContext.Provider value={false}>
        <MenuPrimitive.Anchor virtualRef={virtualRef} />
        <Primitive.span
          {...props}
          ref={forwardedRef}
          // prevent iOS context menu from appearing
          style={{ WebkitTouchCallout: 'none', ...props.style }}
          onContextMenu={composeEventHandlers(props.onContextMenu, (event) => {
            // clearing the long press here because some platforms already support
            // long press to trigger a `contextmenu` event
            clearLongPress();
            event.preventDefault();
            handleOpen(event);
          })}
          onPointerDown={composeEventHandlers(
            props.onPointerDown,
            whenTouchOrPen((event) => {
              // clear the long press here in case there's multiple touch points
              clearLongPress();
              longPressTimerRef.current = window.setTimeout(() => handleOpen(event), 700);
            })
          )}
          onPointerMove={composeEventHandlers(props.onPointerMove, whenTouchOrPen(clearLongPress))}
          onPointerCancel={composeEventHandlers(
            props.onPointerCancel,
            whenTouchOrPen(clearLongPress)
          )}
          onPointerUp={composeEventHandlers(props.onPointerUp, whenTouchOrPen(clearLongPress))}
        />
      </ContentContext.Provider>
    );
  }
);

ContextMenuTrigger.displayName = TRIGGER_NAME;

/* -------------------------------------------------------------------------------------------------
 * ContextMenuContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = 'ContextMenuContent';

const ContentContext = React.createContext(false);

type ContextMenuContentElement = React.ElementRef<typeof MenuPrimitive.Content>;
type MenuContentProps = Radix.ComponentPropsWithoutRef<typeof MenuPrimitive.Content>;
interface ContextMenuContentProps extends Omit<MenuContentProps, 'portalled' | 'side' | 'align'> {}

const ContextMenuContent = React.forwardRef<ContextMenuContentElement, ContextMenuContentProps>(
  (props, forwardedRef) => {
    const context = useContextMenuContext(CONTENT_NAME);

    const commonProps = {
      ...props,
      style: {
        ...props.style,
        // re-namespace exposed content custom property
        ['--radix-context-menu-content-transform-origin' as any]:
          'var(--radix-popper-transform-origin)',
      },
    };

    return (
      <ContentContext.Provider value={true}>
        {context.isRootMenu ? (
          <ContextMenuRootContent {...commonProps} ref={forwardedRef} />
        ) : (
          <MenuPrimitive.Content {...commonProps} ref={forwardedRef} />
        )}
      </ContentContext.Provider>
    );
  }
);

ContextMenuContent.displayName = CONTENT_NAME;

/* ---------------------------------------------------------------------------------------------- */

type ContextMenuRootContentElement = React.ElementRef<typeof MenuPrimitive.Content>;
interface ContextMenuRootContentProps extends MenuContentProps {}

const ContextMenuRootContent = React.forwardRef<
  ContextMenuRootContentElement,
  ContextMenuRootContentProps
>((props, forwardedRef) => {
  const context = useContextMenuContext(CONTENT_NAME);
  const hasInteractedOutsideRef = React.useRef(false);
  return (
    <MenuPrimitive.Content
      {...props}
      ref={forwardedRef}
      portalled
      side="right"
      sideOffset={2}
      align="start"
      onCloseAutoFocus={(event) => {
        props.onCloseAutoFocus?.(event);

        if (!event.defaultPrevented && hasInteractedOutsideRef.current) {
          event.preventDefault();
        }

        hasInteractedOutsideRef.current = false;
      }}
      onInteractOutside={(event) => {
        props.onInteractOutside?.(event);

        if (!event.defaultPrevented && !context.modal) hasInteractedOutsideRef.current = true;
      }}
    />
  );
});

/* -------------------------------------------------------------------------------------------------
 * ContextMenuGroup
 * -----------------------------------------------------------------------------------------------*/

const GROUP_NAME = 'ContextMenuGroup';

type ContextMenuGroupElement = React.ElementRef<typeof MenuPrimitive.Group>;
type MenuGroupProps = Radix.ComponentPropsWithoutRef<typeof MenuPrimitive.Group>;
interface ContextMenuGroupProps extends MenuGroupProps {}

const ContextMenuGroup = React.forwardRef<ContextMenuGroupElement, ContextMenuGroupProps>(
  (props, forwardedRef) => <MenuPrimitive.Group {...props} ref={forwardedRef} />
);

ContextMenuGroup.displayName = GROUP_NAME;

/* -------------------------------------------------------------------------------------------------
 * ContextMenuLabel
 * -----------------------------------------------------------------------------------------------*/

const LABEL_NAME = 'ContextMenuLabel';

type ContextMenuLabelElement = React.ElementRef<typeof MenuPrimitive.Label>;
type MenuLabelProps = Radix.ComponentPropsWithoutRef<typeof MenuPrimitive.Label>;
interface ContextMenuLabelProps extends MenuLabelProps {}

const ContextMenuLabel = React.forwardRef<ContextMenuLabelElement, ContextMenuLabelProps>(
  (props, forwardedRef) => <MenuPrimitive.Label {...props} ref={forwardedRef} />
);

ContextMenuLabel.displayName = LABEL_NAME;

/* -------------------------------------------------------------------------------------------------
 * ContextMenuItem
 * -----------------------------------------------------------------------------------------------*/

const ITEM_NAME = 'ContextMenuItem';

type ContextMenuItemElement = React.ElementRef<typeof MenuPrimitive.Item>;
type MenuItemProps = Radix.ComponentPropsWithoutRef<typeof MenuPrimitive.Item>;
interface ContextMenuItemProps extends MenuItemProps {}

const ContextMenuItem = React.forwardRef<ContextMenuItemElement, ContextMenuItemProps>(
  (props, forwardedRef) => <MenuPrimitive.Item {...props} ref={forwardedRef} />
);

ContextMenuItem.displayName = ITEM_NAME;

/* -------------------------------------------------------------------------------------------------
 * ContextMenuTriggerItem
 * -----------------------------------------------------------------------------------------------*/

const TRIGGER_ITEM_NAME = 'ContextMenuTriggerItem';

type ContextMenuTriggerItemElement = React.ElementRef<typeof MenuPrimitive.SubTrigger>;
type MenuSubTriggerProps = Radix.ComponentPropsWithoutRef<typeof MenuPrimitive.SubTrigger>;
interface ContextMenuTriggerItemProps extends MenuSubTriggerProps {}

const ContextMenuTriggerItem = React.forwardRef<
  ContextMenuTriggerItemElement,
  ContextMenuTriggerItemProps
>((props, forwardedRef) => <MenuPrimitive.SubTrigger {...props} ref={forwardedRef} />);

ContextMenuTriggerItem.displayName = TRIGGER_ITEM_NAME;

/* -------------------------------------------------------------------------------------------------
 * ContextMenuCheckboxItem
 * -----------------------------------------------------------------------------------------------*/

const CHECKBOX_ITEM_NAME = 'ContextMenuCheckboxItem';

type ContextMenuCheckboxItemElement = React.ElementRef<typeof MenuPrimitive.CheckboxItem>;
type MenuCheckboxItemProps = Radix.ComponentPropsWithoutRef<typeof MenuPrimitive.CheckboxItem>;
interface ContextMenuCheckboxItemProps extends MenuCheckboxItemProps {}

const ContextMenuCheckboxItem = React.forwardRef<
  ContextMenuCheckboxItemElement,
  ContextMenuCheckboxItemProps
>((props, forwardedRef) => <MenuPrimitive.CheckboxItem {...props} ref={forwardedRef} />);

ContextMenuCheckboxItem.displayName = CHECKBOX_ITEM_NAME;

/* -------------------------------------------------------------------------------------------------
 * ContextMenuRadioGroup
 * -----------------------------------------------------------------------------------------------*/

const RADIO_GROUP_NAME = 'ContextMenuRadioGroup';

type ContextMenuRadioGroupElement = React.ElementRef<typeof MenuPrimitive.RadioGroup>;
type MenuRadioGroupProps = Radix.ComponentPropsWithoutRef<typeof MenuPrimitive.RadioGroup>;
interface ContextMenuRadioGroupProps extends MenuRadioGroupProps {}

const ContextMenuRadioGroup = React.forwardRef<
  ContextMenuRadioGroupElement,
  ContextMenuRadioGroupProps
>((props, forwardedRef) => <MenuPrimitive.RadioGroup {...props} ref={forwardedRef} />);

ContextMenuRadioGroup.displayName = RADIO_GROUP_NAME;

/* -------------------------------------------------------------------------------------------------
 * ContextMenuRadioItem
 * -----------------------------------------------------------------------------------------------*/

const RADIO_ITEM_NAME = 'ContextMenuRadioItem';

type ContextMenuRadioItemElement = React.ElementRef<typeof MenuPrimitive.RadioItem>;
type MenuRadioItemProps = Radix.ComponentPropsWithoutRef<typeof MenuPrimitive.RadioItem>;
interface ContextMenuRadioItemProps extends MenuRadioItemProps {}

const ContextMenuRadioItem = React.forwardRef<
  ContextMenuRadioItemElement,
  ContextMenuRadioItemProps
>((props, forwardedRef) => <MenuPrimitive.RadioItem {...props} ref={forwardedRef} />);

ContextMenuRadioItem.displayName = RADIO_ITEM_NAME;

/* -------------------------------------------------------------------------------------------------
 * ContextMenuItemIndicator
 * -----------------------------------------------------------------------------------------------*/

const INDICATOR_NAME = 'ContextMenuItemIndicator';

type ContextMenuItemIndicatorElement = React.ElementRef<typeof MenuPrimitive.ItemIndicator>;
type MenuItemIndicatorProps = Radix.ComponentPropsWithoutRef<typeof MenuPrimitive.ItemIndicator>;
interface ContextMenuItemIndicatorProps extends MenuItemIndicatorProps {}

const ContextMenuItemIndicator = React.forwardRef<
  ContextMenuItemIndicatorElement,
  ContextMenuItemIndicatorProps
>((props, forwardedRef) => <MenuPrimitive.ItemIndicator {...props} ref={forwardedRef} />);

ContextMenuItemIndicator.displayName = INDICATOR_NAME;

/* -------------------------------------------------------------------------------------------------
 * ContextMenuSeparator
 * -----------------------------------------------------------------------------------------------*/

const SEPARATOR_NAME = 'ContextMenuSeparator';

type ContextMenuSeparatorElement = React.ElementRef<typeof MenuPrimitive.Separator>;
type MenuSeparatorProps = Radix.ComponentPropsWithoutRef<typeof MenuPrimitive.Separator>;
interface ContextMenuSeparatorProps extends MenuSeparatorProps {}

const ContextMenuSeparator = React.forwardRef<
  ContextMenuSeparatorElement,
  ContextMenuSeparatorProps
>((props, forwardedRef) => <MenuPrimitive.Separator {...props} ref={forwardedRef} />);

ContextMenuSeparator.displayName = SEPARATOR_NAME;

/* -------------------------------------------------------------------------------------------------
 * ContextMenuArrow
 * -----------------------------------------------------------------------------------------------*/

const ARROW_NAME = 'ContextMenuArrow';

type ContextMenuArrowElement = React.ElementRef<typeof MenuPrimitive.Arrow>;
type MenuArrowProps = Radix.ComponentPropsWithoutRef<typeof MenuPrimitive.Arrow>;
interface ContextMenuArrowProps extends MenuArrowProps {}

const ContextMenuArrow = React.forwardRef<ContextMenuArrowElement, ContextMenuArrowProps>(
  (props, forwardedRef) => <MenuPrimitive.Arrow {...props} ref={forwardedRef} />
);

ContextMenuArrow.displayName = ARROW_NAME;

/* -----------------------------------------------------------------------------------------------*/

function whenTouchOrPen<E>(handler: React.PointerEventHandler<E>): React.PointerEventHandler<E> {
  return (event) => (event.pointerType !== 'mouse' ? handler(event) : undefined);
}

const Root = ContextMenu;
const Trigger = ContextMenuTrigger;
const Content = ContextMenuContent;
const Group = ContextMenuGroup;
const Label = ContextMenuLabel;
const Item = ContextMenuItem;
const TriggerItem = ContextMenuTriggerItem;
const CheckboxItem = ContextMenuCheckboxItem;
const RadioGroup = ContextMenuRadioGroup;
const RadioItem = ContextMenuRadioItem;
const ItemIndicator = ContextMenuItemIndicator;
const Separator = ContextMenuSeparator;
const Arrow = ContextMenuArrow;

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuLabel,
  ContextMenuItem,
  ContextMenuTriggerItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuItemIndicator,
  ContextMenuSeparator,
  ContextMenuArrow,
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
  ContextMenuProps,
  ContextMenuTriggerProps,
  ContextMenuContentProps,
  ContextMenuGroupProps,
  ContextMenuLabelProps,
  ContextMenuItemProps,
  ContextMenuTriggerItemProps,
  ContextMenuCheckboxItemProps,
  ContextMenuRadioGroupProps,
  ContextMenuRadioItemProps,
  ContextMenuItemIndicatorProps,
  ContextMenuSeparatorProps,
  ContextMenuArrowProps,
};
