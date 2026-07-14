import * as React from 'react';
import { composeEventHandlers } from '@radix-ui/primitive';
import { createContextScope } from '@radix-ui/react-context';
import { Primitive } from '@radix-ui/react-primitive';
import * as MenuPrimitive from '@radix-ui/react-menu';
import { createMenuScope } from '@radix-ui/react-menu';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
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

interface ContextMenuContextValue {
  open: boolean;
  onOpenChange(open: boolean): void;
  modal: boolean;
  hasInteractedRef: React.RefObject<boolean>;
}

const [ContextMenuProvider, useContextMenuContext] =
  createContextMenuContext<ContextMenuContextValue>(CONTEXT_MENU_NAME);

interface ContextMenuProps {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?(open: boolean): void;
  dir?: Direction;
  modal?: boolean;
}

const ContextMenu: React.FC<ContextMenuProps> = (props: ScopedProps<ContextMenuProps>) => {
  const { __scopeContextMenu, children, onOpenChange, open: openProp, dir, modal = true } = props;

  // OK to disable conditionally calling hooks here because they will always run
  // consistently in the same environment. Bundlers should be able to remove the
  // code block entirely in production.
  /* eslint-disable react-hooks/rules-of-hooks */
  const hasInteractedRef = React.useRef(false);
  if (process.env.NODE_ENV !== 'production') {
    const hasWarnedRef = React.useRef(false);
    React.useEffect(() => {
      if (openProp === true && !hasInteractedRef.current && !hasWarnedRef.current) {
        hasWarnedRef.current = true;
        // dev warning: open prop is controllable but its position has not been set
        // because the user has not interacted with the trigger. The controllable
        // state is only enabled so that the user can read or programatically close
        // the menu. Programatically opening the menu will anchor it to the most
        // recently interacted position.
        console.warn(
          'ContextMenu: The `open` prop has been set to `true` before the user has interacted with the trigger, so its position is indeterminate. This is likely unintended and will result in the menu being anchored to the top-left corner of the viewport.',
        );
      }
    }, [openProp]);
  }
  /* eslint-enable react-hooks/rules-of-hooks */

  const [open, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: false,
    onChange: onOpenChange,
    caller: CONTEXT_MENU_NAME,
  });

  const menuScope = useMenuScope(__scopeContextMenu);

  return (
    <ContextMenuProvider
      scope={__scopeContextMenu}
      open={open}
      onOpenChange={setOpen}
      modal={modal}
      hasInteractedRef={hasInteractedRef}
    >
      <MenuPrimitive.Root {...menuScope} dir={dir} open={open} onOpenChange={setOpen} modal={modal}>
        {children}
      </MenuPrimitive.Root>
    </ContextMenuProvider>
  );
};

/* -------------------------------------------------------------------------------------------------
 * ContextMenuTrigger
 * -----------------------------------------------------------------------------------------------*/

const TRIGGER_NAME = 'ContextMenuTrigger';

type ContextMenuTriggerElement = React.ComponentRef<typeof Primitive.span>;
type PrimitiveSpanProps = React.ComponentPropsWithoutRef<typeof Primitive.span>;
interface ContextMenuTriggerProps extends PrimitiveSpanProps {
  disabled?: boolean;
}

const ContextMenuTrigger = /* @__PURE__ */ React.forwardRef<
  ContextMenuTriggerElement,
  ContextMenuTriggerProps
>(
  // blank line to reduce diff noise
  function ContextMenuTrigger(props: ScopedProps<ContextMenuTriggerProps>, forwardedRef) {
    const { __scopeContextMenu, disabled = false, ...triggerProps } = props;
    const context = useContextMenuContext(TRIGGER_NAME, __scopeContextMenu);
    const menuScope = useMenuScope(__scopeContextMenu);
    const [point, setPoint] = React.useState<Point>({ x: 0, y: 0 });

    // Re-create the virtual anchor whenever the pointer position changes so the
    // content re-anchors to the latest point when the menu is re-triggered while
    // already open (e.g. right-clicking in a new location, #2611).
    const virtualRef = React.useMemo(
      () => ({
        current: {
          getBoundingClientRect: () => DOMRect.fromRect({ width: 0, height: 0, ...point }),
        },
      }),
      [point],
    );
    const longPressTimerRef = React.useRef(0);
    const clearLongPress = React.useCallback(
      () => window.clearTimeout(longPressTimerRef.current),
      [],
    );
    const handleOpen = (event: React.MouseEvent | React.PointerEvent) => {
      context.hasInteractedRef.current = true;
      setPoint({ x: event.clientX, y: event.clientY });
      context.onOpenChange(true);
    };

    React.useEffect(() => clearLongPress, [clearLongPress]);
    React.useEffect(() => void (disabled && clearLongPress()), [disabled, clearLongPress]);

    return (
      <>
        <MenuPrimitive.Anchor {...menuScope} virtualRef={virtualRef} />
        <Primitive.span
          data-state={context.open ? 'open' : 'closed'}
          data-disabled={disabled ? '' : undefined}
          {...triggerProps}
          ref={forwardedRef}
          // prevent iOS context menu from appearing
          style={{ WebkitTouchCallout: 'none', ...props.style }}
          // if trigger is disabled, enable the native Context Menu
          onContextMenu={
            disabled
              ? props.onContextMenu
              : composeEventHandlers(props.onContextMenu, (event) => {
                  // clearing the long press here because some platforms already support
                  // long press to trigger a `contextmenu` event
                  clearLongPress();
                  handleOpen(event);
                  event.preventDefault();
                })
          }
          onPointerDown={
            disabled
              ? props.onPointerDown
              : composeEventHandlers(
                  props.onPointerDown,
                  whenTouchOrPen((event) => {
                    // clear the long press here in case there's multiple touch points
                    clearLongPress();
                    if (context.open) {
                      context.onOpenChange(false);
                    }
                    longPressTimerRef.current = window.setTimeout(() => handleOpen(event), 700);
                  }),
                )
          }
          onPointerMove={
            disabled
              ? props.onPointerMove
              : composeEventHandlers(props.onPointerMove, whenTouchOrPen(clearLongPress))
          }
          onPointerCancel={
            disabled
              ? props.onPointerCancel
              : composeEventHandlers(props.onPointerCancel, whenTouchOrPen(clearLongPress))
          }
          onPointerUp={
            disabled
              ? props.onPointerUp
              : composeEventHandlers(props.onPointerUp, whenTouchOrPen(clearLongPress))
          }
        />
      </>
    );
  },
);

/* -------------------------------------------------------------------------------------------------
 * ContextMenuPortal
 * -----------------------------------------------------------------------------------------------*/

type MenuPortalProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.Portal>;
interface ContextMenuPortalProps extends MenuPortalProps {}

const ContextMenuPortal: React.FC<ContextMenuPortalProps> = (
  props: ScopedProps<ContextMenuPortalProps>,
) => {
  const { __scopeContextMenu, ...portalProps } = props;
  const menuScope = useMenuScope(__scopeContextMenu);
  return <MenuPrimitive.Portal {...menuScope} {...portalProps} />;
};

/* -------------------------------------------------------------------------------------------------
 * ContextMenuContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = 'ContextMenuContent';

type ContextMenuContentElement = React.ComponentRef<typeof MenuPrimitive.Content>;
type MenuContentProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.Content>;
interface ContextMenuContentProps extends Omit<
  MenuContentProps,
  'onEntryFocus' | 'side' | 'sideOffset' | 'align'
> {}

const ContextMenuContent = /* @__PURE__ */ React.forwardRef<
  ContextMenuContentElement,
  ContextMenuContentProps
>(
  // blank line to reduce diff noise
  function ContextMenuContent(props: ScopedProps<ContextMenuContentProps>, forwardedRef) {
    const { __scopeContextMenu, ...contentProps } = props;
    const context = useContextMenuContext(CONTENT_NAME, __scopeContextMenu);
    const menuScope = useMenuScope(__scopeContextMenu);
    const hasInteractedOutsideRef = React.useRef(false);

    return (
      <MenuPrimitive.Content
        {...menuScope}
        {...contentProps}
        ref={forwardedRef}
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
        style={{
          ...props.style,
          // re-namespace exposed content custom properties
          ...{
            '--radix-context-menu-content-transform-origin': 'var(--radix-popper-transform-origin)',
            '--radix-context-menu-content-available-width': 'var(--radix-popper-available-width)',
            '--radix-context-menu-content-available-height': 'var(--radix-popper-available-height)',
            '--radix-context-menu-trigger-width': 'var(--radix-popper-anchor-width)',
            '--radix-context-menu-trigger-height': 'var(--radix-popper-anchor-height)',
          },
        }}
      />
    );
  },
);

/* -------------------------------------------------------------------------------------------------
 * ContextMenuGroup
 * -----------------------------------------------------------------------------------------------*/

type ContextMenuGroupElement = React.ComponentRef<typeof MenuPrimitive.Group>;
type MenuGroupProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.Group>;
interface ContextMenuGroupProps extends MenuGroupProps {}

const ContextMenuGroup = /* @__PURE__ */ React.forwardRef<
  ContextMenuGroupElement,
  ContextMenuGroupProps
>(
  // blank line to reduce diff noise
  function ContextMenuGroup(props: ScopedProps<ContextMenuGroupProps>, forwardedRef) {
    const { __scopeContextMenu, ...groupProps } = props;
    const menuScope = useMenuScope(__scopeContextMenu);
    return <MenuPrimitive.Group {...menuScope} {...groupProps} ref={forwardedRef} />;
  },
);

/* -------------------------------------------------------------------------------------------------
 * ContextMenuLabel
 * -----------------------------------------------------------------------------------------------*/

type ContextMenuLabelElement = React.ComponentRef<typeof MenuPrimitive.Label>;
type MenuLabelProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.Label>;
interface ContextMenuLabelProps extends MenuLabelProps {}

const ContextMenuLabel = /* @__PURE__ */ React.forwardRef<
  ContextMenuLabelElement,
  ContextMenuLabelProps
>(
  // blank line to reduce diff noise
  function ContextMenuLabel(props: ScopedProps<ContextMenuLabelProps>, forwardedRef) {
    const { __scopeContextMenu, ...labelProps } = props;
    const menuScope = useMenuScope(__scopeContextMenu);
    return <MenuPrimitive.Label {...menuScope} {...labelProps} ref={forwardedRef} />;
  },
);

/* -------------------------------------------------------------------------------------------------
 * ContextMenuItem
 * -----------------------------------------------------------------------------------------------*/

type ContextMenuItemElement = React.ComponentRef<typeof MenuPrimitive.Item>;
type MenuItemProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.Item>;
interface ContextMenuItemProps extends MenuItemProps {}

const ContextMenuItem = /* @__PURE__ */ React.forwardRef<
  ContextMenuItemElement,
  ContextMenuItemProps
>(
  // blank line to reduce diff noise
  function ContextMenuItem(props: ScopedProps<ContextMenuItemProps>, forwardedRef) {
    const { __scopeContextMenu, ...itemProps } = props;
    const menuScope = useMenuScope(__scopeContextMenu);
    return <MenuPrimitive.Item {...menuScope} {...itemProps} ref={forwardedRef} />;
  },
);

/* -------------------------------------------------------------------------------------------------
 * ContextMenuCheckboxItem
 * -----------------------------------------------------------------------------------------------*/

type ContextMenuCheckboxItemElement = React.ComponentRef<typeof MenuPrimitive.CheckboxItem>;
type MenuCheckboxItemProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.CheckboxItem>;
interface ContextMenuCheckboxItemProps extends MenuCheckboxItemProps {}

const ContextMenuCheckboxItem = /* @__PURE__ */ React.forwardRef<
  ContextMenuCheckboxItemElement,
  ContextMenuCheckboxItemProps
>(function ContextMenuCheckboxItem(props: ScopedProps<ContextMenuCheckboxItemProps>, forwardedRef) {
  const { __scopeContextMenu, ...checkboxItemProps } = props;
  const menuScope = useMenuScope(__scopeContextMenu);
  return <MenuPrimitive.CheckboxItem {...menuScope} {...checkboxItemProps} ref={forwardedRef} />;
});

/* -------------------------------------------------------------------------------------------------
 * ContextMenuRadioGroup
 * -----------------------------------------------------------------------------------------------*/

type ContextMenuRadioGroupElement = React.ComponentRef<typeof MenuPrimitive.RadioGroup>;
type MenuRadioGroupProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.RadioGroup>;
interface ContextMenuRadioGroupProps extends MenuRadioGroupProps {}

const ContextMenuRadioGroup = /* @__PURE__ */ React.forwardRef<
  ContextMenuRadioGroupElement,
  ContextMenuRadioGroupProps
>(function ContextMenuRadioGroup(props: ScopedProps<ContextMenuRadioGroupProps>, forwardedRef) {
  const { __scopeContextMenu, ...radioGroupProps } = props;
  const menuScope = useMenuScope(__scopeContextMenu);
  return <MenuPrimitive.RadioGroup {...menuScope} {...radioGroupProps} ref={forwardedRef} />;
});

/* -------------------------------------------------------------------------------------------------
 * ContextMenuRadioItem
 * -----------------------------------------------------------------------------------------------*/

type ContextMenuRadioItemElement = React.ComponentRef<typeof MenuPrimitive.RadioItem>;
type MenuRadioItemProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.RadioItem>;
interface ContextMenuRadioItemProps extends MenuRadioItemProps {}

const ContextMenuRadioItem = /* @__PURE__ */ React.forwardRef<
  ContextMenuRadioItemElement,
  ContextMenuRadioItemProps
>(function ContextMenuRadioItem(props: ScopedProps<ContextMenuRadioItemProps>, forwardedRef) {
  const { __scopeContextMenu, ...radioItemProps } = props;
  const menuScope = useMenuScope(__scopeContextMenu);
  return <MenuPrimitive.RadioItem {...menuScope} {...radioItemProps} ref={forwardedRef} />;
});

/* -------------------------------------------------------------------------------------------------
 * ContextMenuItemIndicator
 * -----------------------------------------------------------------------------------------------*/

type ContextMenuItemIndicatorElement = React.ComponentRef<typeof MenuPrimitive.ItemIndicator>;
type MenuItemIndicatorProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.ItemIndicator>;
interface ContextMenuItemIndicatorProps extends MenuItemIndicatorProps {}

const ContextMenuItemIndicator = /* @__PURE__ */ React.forwardRef<
  ContextMenuItemIndicatorElement,
  ContextMenuItemIndicatorProps
>(function ContextMenuItemIndicator(
  props: ScopedProps<ContextMenuItemIndicatorProps>,
  forwardedRef,
) {
  const { __scopeContextMenu, ...itemIndicatorProps } = props;
  const menuScope = useMenuScope(__scopeContextMenu);
  return <MenuPrimitive.ItemIndicator {...menuScope} {...itemIndicatorProps} ref={forwardedRef} />;
});

/* -------------------------------------------------------------------------------------------------
 * ContextMenuSeparator
 * -----------------------------------------------------------------------------------------------*/

type ContextMenuSeparatorElement = React.ComponentRef<typeof MenuPrimitive.Separator>;
type MenuSeparatorProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.Separator>;
interface ContextMenuSeparatorProps extends MenuSeparatorProps {}

const ContextMenuSeparator = /* @__PURE__ */ React.forwardRef<
  ContextMenuSeparatorElement,
  ContextMenuSeparatorProps
>(function ContextMenuSeparator(props: ScopedProps<ContextMenuSeparatorProps>, forwardedRef) {
  const { __scopeContextMenu, ...separatorProps } = props;
  const menuScope = useMenuScope(__scopeContextMenu);
  return <MenuPrimitive.Separator {...menuScope} {...separatorProps} ref={forwardedRef} />;
});

/* -------------------------------------------------------------------------------------------------
 * ContextMenuArrow
 * -----------------------------------------------------------------------------------------------*/

type ContextMenuArrowElement = React.ComponentRef<typeof MenuPrimitive.Arrow>;
type MenuArrowProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.Arrow>;
interface ContextMenuArrowProps extends MenuArrowProps {}

const ContextMenuArrow = /* @__PURE__ */ React.forwardRef<
  ContextMenuArrowElement,
  ContextMenuArrowProps
>(
  // blank line to reduce diff noise
  function ContextMenuArrow(props: ScopedProps<ContextMenuArrowProps>, forwardedRef) {
    const { __scopeContextMenu, ...arrowProps } = props;
    const menuScope = useMenuScope(__scopeContextMenu);
    return <MenuPrimitive.Arrow {...menuScope} {...arrowProps} ref={forwardedRef} />;
  },
);

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
    defaultProp: defaultOpen ?? false,
    onChange: onOpenChange,
    caller: SUB_NAME,
  });

  return (
    <MenuPrimitive.Sub {...menuScope} open={open} onOpenChange={setOpen}>
      {children}
    </MenuPrimitive.Sub>
  );
};

/* -------------------------------------------------------------------------------------------------
 * ContextMenuSubTrigger
 * -----------------------------------------------------------------------------------------------*/

type ContextMenuSubTriggerElement = React.ComponentRef<typeof MenuPrimitive.SubTrigger>;
type MenuSubTriggerProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.SubTrigger>;
interface ContextMenuSubTriggerProps extends MenuSubTriggerProps {}

const ContextMenuSubTrigger = /* @__PURE__ */ React.forwardRef<
  ContextMenuSubTriggerElement,
  ContextMenuSubTriggerProps
>(function ContextMenuSubTrigger(props: ScopedProps<ContextMenuSubTriggerProps>, forwardedRef) {
  const { __scopeContextMenu, ...triggerItemProps } = props;
  const menuScope = useMenuScope(__scopeContextMenu);
  return <MenuPrimitive.SubTrigger {...menuScope} {...triggerItemProps} ref={forwardedRef} />;
});

/* -------------------------------------------------------------------------------------------------
 * ContextMenuSubContent
 * -----------------------------------------------------------------------------------------------*/

type ContextMenuSubContentElement = React.ComponentRef<typeof MenuPrimitive.Content>;
type MenuSubContentProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.SubContent>;
interface ContextMenuSubContentProps extends MenuSubContentProps {}

const ContextMenuSubContent = /* @__PURE__ */ React.forwardRef<
  ContextMenuSubContentElement,
  ContextMenuSubContentProps
>(function ContextMenuSubContent(props: ScopedProps<ContextMenuSubContentProps>, forwardedRef) {
  const { __scopeContextMenu, ...subContentProps } = props;
  const menuScope = useMenuScope(__scopeContextMenu);

  return (
    <MenuPrimitive.SubContent
      {...menuScope}
      {...subContentProps}
      ref={forwardedRef}
      style={{
        ...props.style,
        // re-namespace exposed content custom properties
        ...{
          '--radix-context-menu-content-transform-origin': 'var(--radix-popper-transform-origin)',
          '--radix-context-menu-content-available-width': 'var(--radix-popper-available-width)',
          '--radix-context-menu-content-available-height': 'var(--radix-popper-available-height)',
          '--radix-context-menu-trigger-width': 'var(--radix-popper-anchor-width)',
          '--radix-context-menu-trigger-height': 'var(--radix-popper-anchor-height)',
        },
      }}
    />
  );
});

/* -----------------------------------------------------------------------------------------------*/

function whenTouchOrPen<E>(handler: React.PointerEventHandler<E>): React.PointerEventHandler<E> {
  return (event) => (event.pointerType !== 'mouse' ? handler(event) : undefined);
}

const Root = ContextMenu;
const Trigger = ContextMenuTrigger;
const Portal = ContextMenuPortal;
const Content = ContextMenuContent;
const Group = ContextMenuGroup;
const Label = ContextMenuLabel;
const Item = ContextMenuItem;
const CheckboxItem = ContextMenuCheckboxItem;
const RadioGroup = ContextMenuRadioGroup;
const RadioItem = ContextMenuRadioItem;
const ItemIndicator = ContextMenuItemIndicator;
const Separator = ContextMenuSeparator;
const Arrow = ContextMenuArrow;
const Sub = ContextMenuSub;
const SubTrigger = ContextMenuSubTrigger;
const SubContent = ContextMenuSubContent;

export {
  createContextMenuScope,
  //
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuPortal,
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
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
  //
  Root,
  Trigger,
  Portal,
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
  Sub,
  SubTrigger,
  SubContent,
};
export type {
  ContextMenuProps,
  ContextMenuTriggerProps,
  ContextMenuPortalProps,
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
  ContextMenuSubProps,
  ContextMenuSubTriggerProps,
  ContextMenuSubContentProps,
};
