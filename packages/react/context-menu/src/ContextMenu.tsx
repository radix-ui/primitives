import * as React from 'react';
import { composeEventHandlers } from '@radix-ui/primitive';
import { createContextScope } from '@radix-ui/react-context';
import { Primitive } from '@radix-ui/react-primitive';
import * as MenuPrimitive from '@radix-ui/react-menu';
import { createMenuScope } from '@radix-ui/react-menu';
import { useCallbackRef } from '@radix-ui/react-use-callback-ref';
import { useControllableState } from '@radix-ui/react-use-controllable-state';

import type * as Radix from '@radix-ui/react-primitive';
import type { Scope } from '@radix-ui/react-context';

type Direction = 'ltr' | 'rtl';
type Point = { x: number; y: number };

/* -------------------------------------------------------------------------------------------------
 * ContextMenu
 * -----------------------------------------------------------------------------------------------*/

const CONTEXT_MENU_NAME = 'ContextMenu';

type ScopedProps<P> = P & { __scopeContextMenu?: Scope };
const [createContextMenuContext, createContextMenuScope] = createContextScope(CONTEXT_MENU_NAME, [
  createMenuScope,
]);
const useMenuScope = createMenuScope();

type ContextMenuRootContextValue = {
  isRootMenu: true;
  open: boolean;
  onOpenChange(open: boolean): void;
  modal: boolean;
};

type ContextMenuSubContextValue = {
  isRootMenu: false;
};

const [ContextMenuProvider, useContextMenuContext] = createContextMenuContext<
  ContextMenuRootContextValue | ContextMenuSubContextValue
>(CONTEXT_MENU_NAME);

interface ContextMenuProps {
  children?: React.ReactNode;
  onOpenChange?(open: boolean): void;
  dir?: Direction;
  modal?: boolean;
}

const ContextMenu: React.FC<ContextMenuProps> = (props: ScopedProps<ContextMenuProps>) => {
  const { __scopeContextMenu, children, onOpenChange, dir, modal = true } = props;
  const [open, setOpen] = React.useState(false);
  const menuScope = useMenuScope(__scopeContextMenu);
  const handleOpenChangeProp = useCallbackRef(onOpenChange);

  const handleOpenChange = React.useCallback(
    (open: boolean) => {
      setOpen(open);
      handleOpenChangeProp(open);
    },
    [handleOpenChangeProp]
  );

  return (
    <ContextMenuProvider
      scope={__scopeContextMenu}
      isRootMenu={true}
      open={open}
      onOpenChange={handleOpenChange}
      modal={modal}
    >
      <MenuPrimitive.Root
        {...menuScope}
        dir={dir}
        open={open}
        onOpenChange={handleOpenChange}
        modal={modal}
      >
        {children}
      </MenuPrimitive.Root>
    </ContextMenuProvider>
  );
};

ContextMenu.displayName = CONTEXT_MENU_NAME;

/* -------------------------------------------------------------------------------------------------
 * ContextMenuSub
 * -----------------------------------------------------------------------------------------------*/

const SUB_NAME = 'ContextMenuSub';

interface ContextMenuSubProps {
  children?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?(open: boolean): void;
}

const ContextMenuSub: React.FC<ContextMenuSubProps> = (props: ScopedProps<ContextMenuSubProps>) => {
  const { __scopeContextMenu, children, onOpenChange, open: openProp, defaultOpen } = props;
  const menuScope = useMenuScope(__scopeContextMenu);
  const [open, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  });

  return (
    <ContextMenuProvider scope={__scopeContextMenu} isRootMenu={false}>
      <MenuPrimitive.Sub {...menuScope} open={open} onOpenChange={setOpen}>
        {children}
      </MenuPrimitive.Sub>
    </ContextMenuProvider>
  );
};

ContextMenuSub.displayName = SUB_NAME;

/* -------------------------------------------------------------------------------------------------
 * ContextMenuTrigger
 * -----------------------------------------------------------------------------------------------*/

const TRIGGER_NAME = 'ContextMenuTrigger';

type ContextMenuTriggerElement = React.ElementRef<typeof Primitive.span>;
type PrimitiveSpanProps = Radix.ComponentPropsWithoutRef<typeof Primitive.span>;
interface ContextMenuTriggerProps extends PrimitiveSpanProps {}

const ContextMenuTrigger = React.forwardRef<ContextMenuTriggerElement, ContextMenuTriggerProps>(
  (props: ScopedProps<ContextMenuTriggerProps>, forwardedRef) => {
    const { __scopeContextMenu, ...triggerProps } = props;
    const context = useContextMenuContext(TRIGGER_NAME, __scopeContextMenu);
    const menuScope = useMenuScope(__scopeContextMenu);
    const pointRef = React.useRef<Point>({ x: 0, y: 0 });
    const virtualRef = React.useRef({
      getBoundingClientRect: () => DOMRect.fromRect({ width: 0, height: 0, ...pointRef.current }),
    });
    const longPressTimerRef = React.useRef(0);
    const clearLongPress = React.useCallback(
      () => window.clearTimeout(longPressTimerRef.current),
      []
    );
    const handleOpenPointUpdate = (event: React.MouseEvent | React.PointerEvent) => {
      pointRef.current = { x: event.clientX, y: event.clientY };
    };

    React.useEffect(() => clearLongPress, [clearLongPress]);

    return context.isRootMenu ? (
      <>
        <MenuPrimitive.Anchor {...menuScope} virtualRef={virtualRef} />
        <Primitive.span
          {...triggerProps}
          ref={forwardedRef}
          // prevent iOS context menu from appearing
          style={{ WebkitTouchCallout: 'none', ...props.style }}
          onContextMenu={composeEventHandlers(props.onContextMenu, (event) => {
            // clearing the long press here because some platforms already support
            // long press to trigger a `contextmenu` event
            clearLongPress();
            handleOpenPointUpdate(event);
            context.onOpenChange(true);
            event.preventDefault();
          })}
          onPointerDown={composeEventHandlers(
            props.onPointerDown,
            whenTouchOrPen((event) => {
              // clear the long press here in case there's multiple touch points
              clearLongPress();
              longPressTimerRef.current = window.setTimeout(() => {
                handleOpenPointUpdate(event);
                context.onOpenChange(true);
              }, 700);
            })
          )}
          onPointerMove={composeEventHandlers(props.onPointerMove, whenTouchOrPen(clearLongPress))}
          onPointerCancel={composeEventHandlers(
            props.onPointerCancel,
            whenTouchOrPen(clearLongPress)
          )}
          onPointerUp={composeEventHandlers(props.onPointerUp, whenTouchOrPen(clearLongPress))}
        />
      </>
    ) : null;
  }
);

ContextMenuTrigger.displayName = TRIGGER_NAME;

/* -------------------------------------------------------------------------------------------------
 * ContextMenuSubTrigger
 * -----------------------------------------------------------------------------------------------*/

const SUB_TRIGGER_NAME = 'ContextMenuSubTrigger';

type ContextMenuSubTriggerElement = React.ElementRef<typeof MenuPrimitive.SubTrigger>;
type MenuSubTriggerProps = Radix.ComponentPropsWithoutRef<typeof MenuPrimitive.SubTrigger>;
interface ContextMenuSubTriggerProps extends MenuSubTriggerProps {}

const ContextMenuSubTrigger = React.forwardRef<
  ContextMenuSubTriggerElement,
  ContextMenuSubTriggerProps
>((props: ScopedProps<ContextMenuSubTriggerProps>, forwardedRef) => {
  const { __scopeContextMenu, ...triggerItemProps } = props;
  const menuScope = useMenuScope(__scopeContextMenu);
  return <MenuPrimitive.SubTrigger {...menuScope} {...triggerItemProps} ref={forwardedRef} />;
});

ContextMenuSubTrigger.displayName = SUB_TRIGGER_NAME;

/* -------------------------------------------------------------------------------------------------
 * ContextMenuContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = 'ContextMenuContent';

type ContextMenuContentElement = React.ElementRef<typeof MenuPrimitive.Content>;
type MenuContentProps = Radix.ComponentPropsWithoutRef<typeof MenuPrimitive.Content>;
interface ContextMenuContentProps extends Omit<MenuContentProps, 'portalled' | 'side' | 'align'> {}

const ContextMenuContent = React.forwardRef<ContextMenuContentElement, ContextMenuContentProps>(
  (props: ScopedProps<ContextMenuContentProps>, forwardedRef) => {
    const { __scopeContextMenu, ...contentProps } = props;
    const context = useContextMenuContext(CONTENT_NAME, __scopeContextMenu);
    const menuScope = useMenuScope(__scopeContextMenu);

    const commonProps = {
      ...contentProps,
      style: {
        ...props.style,
        // re-namespace exposed content custom property
        ['--radix-context-menu-content-transform-origin' as any]:
          'var(--radix-popper-transform-origin)',
      },
    };

    return context.isRootMenu ? (
      <ContextMenuRootContent
        __scopeContextMenu={__scopeContextMenu}
        {...commonProps}
        ref={forwardedRef}
      />
    ) : (
      <MenuPrimitive.Content {...menuScope} {...commonProps} ref={forwardedRef} />
    );
  }
);

ContextMenuContent.displayName = CONTENT_NAME;

/* ---------------------------------------------------------------------------------------------- */

type ContextMenuRootContentElement = React.ElementRef<typeof MenuPrimitive.Content>;
interface ContextMenuRootContentProps extends ScopedProps<MenuContentProps> {}

const ContextMenuRootContent = React.forwardRef<
  ContextMenuRootContentElement,
  ContextMenuRootContentProps
>((props, forwardedRef) => {
  const { __scopeContextMenu, ...contentProps } = props;
  const context = useContextMenuContext(CONTENT_NAME, __scopeContextMenu);
  const menuScope = useMenuScope(__scopeContextMenu);
  const hasInteractedOutsideRef = React.useRef(false);

  return context.isRootMenu ? (
    <MenuPrimitive.Content
      {...menuScope}
      {...contentProps}
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
  ) : null;
});

/* -------------------------------------------------------------------------------------------------
 * ContextMenuGroup
 * -----------------------------------------------------------------------------------------------*/

const GROUP_NAME = 'ContextMenuGroup';

type ContextMenuGroupElement = React.ElementRef<typeof MenuPrimitive.Group>;
type MenuGroupProps = Radix.ComponentPropsWithoutRef<typeof MenuPrimitive.Group>;
interface ContextMenuGroupProps extends MenuGroupProps {}

const ContextMenuGroup = React.forwardRef<ContextMenuGroupElement, ContextMenuGroupProps>(
  (props: ScopedProps<ContextMenuGroupProps>, forwardedRef) => {
    const { __scopeContextMenu, ...groupProps } = props;
    const menuScope = useMenuScope(__scopeContextMenu);
    return <MenuPrimitive.Group {...menuScope} {...groupProps} ref={forwardedRef} />;
  }
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
  (props: ScopedProps<ContextMenuLabelProps>, forwardedRef) => {
    const { __scopeContextMenu, ...labelProps } = props;
    const menuScope = useMenuScope(__scopeContextMenu);
    return <MenuPrimitive.Label {...menuScope} {...labelProps} ref={forwardedRef} />;
  }
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
  (props: ScopedProps<ContextMenuItemProps>, forwardedRef) => {
    const { __scopeContextMenu, ...itemProps } = props;
    const menuScope = useMenuScope(__scopeContextMenu);
    return <MenuPrimitive.Item {...menuScope} {...itemProps} ref={forwardedRef} />;
  }
);

ContextMenuItem.displayName = ITEM_NAME;

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
>((props: ScopedProps<ContextMenuCheckboxItemProps>, forwardedRef) => {
  const { __scopeContextMenu, ...checkboxItemProps } = props;
  const menuScope = useMenuScope(__scopeContextMenu);
  return <MenuPrimitive.CheckboxItem {...menuScope} {...checkboxItemProps} ref={forwardedRef} />;
});

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
>((props: ScopedProps<ContextMenuRadioGroupProps>, forwardedRef) => {
  const { __scopeContextMenu, ...radioGroupProps } = props;
  const menuScope = useMenuScope(__scopeContextMenu);
  return <MenuPrimitive.RadioGroup {...menuScope} {...radioGroupProps} ref={forwardedRef} />;
});

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
>((props: ScopedProps<ContextMenuRadioItemProps>, forwardedRef) => {
  const { __scopeContextMenu, ...radioItemProps } = props;
  const menuScope = useMenuScope(__scopeContextMenu);
  return <MenuPrimitive.RadioItem {...menuScope} {...radioItemProps} ref={forwardedRef} />;
});

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
>((props: ScopedProps<ContextMenuItemIndicatorProps>, forwardedRef) => {
  const { __scopeContextMenu, ...itemIndicatorProps } = props;
  const menuScope = useMenuScope(__scopeContextMenu);
  return <MenuPrimitive.ItemIndicator {...menuScope} {...itemIndicatorProps} ref={forwardedRef} />;
});

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
>((props: ScopedProps<ContextMenuSeparatorProps>, forwardedRef) => {
  const { __scopeContextMenu, ...separatorProps } = props;
  const menuScope = useMenuScope(__scopeContextMenu);
  return <MenuPrimitive.Separator {...menuScope} {...separatorProps} ref={forwardedRef} />;
});

ContextMenuSeparator.displayName = SEPARATOR_NAME;

/* -------------------------------------------------------------------------------------------------
 * ContextMenuArrow
 * -----------------------------------------------------------------------------------------------*/

const ARROW_NAME = 'ContextMenuArrow';

type ContextMenuArrowElement = React.ElementRef<typeof MenuPrimitive.Arrow>;
type MenuArrowProps = Radix.ComponentPropsWithoutRef<typeof MenuPrimitive.Arrow>;
interface ContextMenuArrowProps extends MenuArrowProps {}

const ContextMenuArrow = React.forwardRef<ContextMenuArrowElement, ContextMenuArrowProps>(
  (props: ScopedProps<ContextMenuArrowProps>, forwardedRef) => {
    const { __scopeContextMenu, ...arrowProps } = props;
    const menuScope = useMenuScope(__scopeContextMenu);
    return <MenuPrimitive.Arrow {...menuScope} {...arrowProps} ref={forwardedRef} />;
  }
);

ContextMenuArrow.displayName = ARROW_NAME;

/* -----------------------------------------------------------------------------------------------*/

function whenTouchOrPen<E>(handler: React.PointerEventHandler<E>): React.PointerEventHandler<E> {
  return (event) => (event.pointerType !== 'mouse' ? handler(event) : undefined);
}

const Root = ContextMenu;
const Sub = ContextMenuSub;
const Trigger = ContextMenuTrigger;
const Content = ContextMenuContent;
const Group = ContextMenuGroup;
const Label = ContextMenuLabel;
const Item = ContextMenuItem;
const SubTrigger = ContextMenuSubTrigger;
const CheckboxItem = ContextMenuCheckboxItem;
const RadioGroup = ContextMenuRadioGroup;
const RadioItem = ContextMenuRadioItem;
const ItemIndicator = ContextMenuItemIndicator;
const Separator = ContextMenuSeparator;
const Arrow = ContextMenuArrow;

export {
  createContextMenuScope,
  //
  ContextMenu,
  ContextMenuSub,
  ContextMenuTrigger,
  ContextMenuSubTrigger,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuLabel,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuItemIndicator,
  ContextMenuSeparator,
  ContextMenuArrow,
  //
  Root,
  Sub,
  Trigger,
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
  ContextMenuProps,
  ContextMenuTriggerProps,
  ContextMenuSubTriggerProps,
  ContextMenuContentProps,
  ContextMenuGroupProps,
  ContextMenuLabelProps,
  ContextMenuItemProps,
  ContextMenuCheckboxItemProps,
  ContextMenuRadioGroupProps,
  ContextMenuRadioItemProps,
  ContextMenuItemIndicatorProps,
  ContextMenuSeparatorProps,
  ContextMenuArrowProps,
};
