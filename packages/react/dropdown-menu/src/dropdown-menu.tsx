import * as React from 'react';
import { composeEventHandlers } from '@radix-ui/primitive';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import { createContextScope } from '@radix-ui/react-context';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { Primitive } from '@radix-ui/react-primitive';
import * as MenuPrimitive from '@radix-ui/react-menu';
import { createMenuScope } from '@radix-ui/react-menu';
import { useId } from '@radix-ui/react-id';

import type { Scope } from '@radix-ui/react-context';

const Direction = {
  LTR: 'ltr',
  RTL: 'rtl',
} as const;

type Direction = (typeof Direction)[keyof typeof Direction];

/* -------------------------------------------------------------------------------------------------
 * DropdownMenu
 * -----------------------------------------------------------------------------------------------*/

const DROPDOWN_MENU_NAME = 'DropdownMenu';

type ScopedProps<P> = P & { __scopeDropdownMenu?: Scope };
const [createDropdownMenuContext, createDropdownMenuScope] = createContextScope(
  DROPDOWN_MENU_NAME,
  [createMenuScope],
);
const useMenuScope = createMenuScope();

type DropdownMenuContextValue = {
  triggerId: string;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  contentId: string;
  open: boolean;
  onOpenChange(open: boolean): void;
  onOpenToggle(): void;
  modal: boolean;
  focusLastOnOpenRef: React.MutableRefObject<boolean>;
};

const [DropdownMenuProvider, useDropdownMenuContext] =
  createDropdownMenuContext<DropdownMenuContextValue>(DROPDOWN_MENU_NAME);

interface DropdownMenuProps {
  children?: React.ReactNode;
  dir?: Direction;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?(open: boolean): void;
  modal?: boolean;
}

const DropdownMenu: React.FC<DropdownMenuProps> = (props: ScopedProps<DropdownMenuProps>) => {
  const {
    __scopeDropdownMenu,
    children,
    dir,
    open: openProp,
    defaultOpen,
    onOpenChange,
    modal = true,
  } = props;
  const menuScope = useMenuScope(__scopeDropdownMenu);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const focusLastOnOpenRef = React.useRef(false);
  const [open, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen ?? false,
    onChange: onOpenChange,
    caller: DROPDOWN_MENU_NAME,
  });

  return (
    <DropdownMenuProvider
      scope={__scopeDropdownMenu}
      triggerId={useId()}
      triggerRef={triggerRef}
      contentId={useId()}
      open={open}
      onOpenChange={setOpen}
      onOpenToggle={React.useCallback(() => setOpen((prevOpen) => !prevOpen), [setOpen])}
      modal={modal}
      focusLastOnOpenRef={focusLastOnOpenRef}
    >
      <MenuPrimitive.Root {...menuScope} open={open} onOpenChange={setOpen} dir={dir} modal={modal}>
        {children}
      </MenuPrimitive.Root>
    </DropdownMenuProvider>
  );
};

/* -------------------------------------------------------------------------------------------------
 * DropdownMenuTrigger
 * -----------------------------------------------------------------------------------------------*/

const TRIGGER_NAME = 'DropdownMenuTrigger';

type DropdownMenuTriggerElement = React.ComponentRef<typeof Primitive.button>;
type PrimitiveButtonProps = React.ComponentPropsWithoutRef<typeof Primitive.button>;
interface DropdownMenuTriggerProps extends PrimitiveButtonProps {}

const DropdownMenuTrigger = /* @__PURE__ */ React.forwardRef<
  DropdownMenuTriggerElement,
  DropdownMenuTriggerProps
>(
  // blank line to reduce diff noise
  function DropdownMenuTrigger(props: ScopedProps<DropdownMenuTriggerProps>, forwardedRef) {
    const { __scopeDropdownMenu, disabled = false, ...triggerProps } = props;
    const context = useDropdownMenuContext(TRIGGER_NAME, __scopeDropdownMenu);
    const menuScope = useMenuScope(__scopeDropdownMenu);
    const composedRefs = useComposedRefs(forwardedRef, context.triggerRef);
    return (
      <MenuPrimitive.Anchor asChild {...menuScope}>
        <Primitive.button
          type="button"
          id={context.triggerId}
          aria-haspopup="menu"
          aria-expanded={context.open}
          aria-controls={context.open ? context.contentId : undefined}
          data-state={context.open ? 'open' : 'closed'}
          data-disabled={disabled ? '' : undefined}
          disabled={disabled}
          {...triggerProps}
          ref={composedRefs}
          onPointerDown={composeEventHandlers(props.onPointerDown, (event) => {
            // only call handler if it's the left button (mousedown gets triggered by all mouse buttons)
            // but not when the control key is pressed (avoiding MacOS right click)
            if (!disabled && event.button === 0 && event.ctrlKey === false) {
              context.onOpenToggle();
              // prevent trigger focusing when opening
              // this allows the content to be given focus without competition
              if (!context.open) event.preventDefault();
            }
          })}
          onKeyDown={composeEventHandlers(props.onKeyDown, (event) => {
            if (disabled) return;
            if (['Enter', ' '].includes(event.key)) context.onOpenToggle();
            if (event.key === 'ArrowDown') {
              context.focusLastOnOpenRef.current = false;
              context.onOpenChange(true);
            }
            if (event.key === 'ArrowUp') {
              context.focusLastOnOpenRef.current = true;
              context.onOpenChange(true);
            }
            // prevent keydown from scrolling window / first focused item to execute
            // that keydown (inadvertently closing the menu)
            if (['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(event.key)) event.preventDefault();
          })}
        />
      </MenuPrimitive.Anchor>
    );
  },
);

/* -------------------------------------------------------------------------------------------------
 * DropdownMenuPortal
 * -----------------------------------------------------------------------------------------------*/

type MenuPortalProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.Portal>;
interface DropdownMenuPortalProps extends MenuPortalProps {}

const DropdownMenuPortal: React.FC<DropdownMenuPortalProps> = (
  props: ScopedProps<DropdownMenuPortalProps>,
) => {
  const { __scopeDropdownMenu, ...portalProps } = props;
  const menuScope = useMenuScope(__scopeDropdownMenu);
  return <MenuPrimitive.Portal {...menuScope} {...portalProps} />;
};

/* -------------------------------------------------------------------------------------------------
 * DropdownMenuContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = 'DropdownMenuContent';

type DropdownMenuContentElement = React.ComponentRef<typeof MenuPrimitive.Content>;
type MenuContentProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.Content>;
interface DropdownMenuContentProps extends MenuContentProps {}

const DropdownMenuContent = /* @__PURE__ */ React.forwardRef<
  DropdownMenuContentElement,
  DropdownMenuContentProps
>(
  // blank line to reduce diff noise
  function DropdownMenuContent(props: ScopedProps<DropdownMenuContentProps>, forwardedRef) {
    const { __scopeDropdownMenu, ...contentProps } = props;
    const context = useDropdownMenuContext(CONTENT_NAME, __scopeDropdownMenu);
    const menuScope = useMenuScope(__scopeDropdownMenu);
    const hasInteractedOutsideRef = React.useRef(false);
    const contentRef = React.useRef<DropdownMenuContentElement>(null);
    const composedRefs = useComposedRefs(forwardedRef, contentRef);

    // Focus last item when opened with ArrowUp
    React.useEffect(() => {
      if (context.open && context.focusLastOnOpenRef.current) {
        // Small delay to let the menu mount and RovingFocusGroup settle
        requestAnimationFrame(() => {
          const content = contentRef.current;
          if (!content) return;
          const items = content.querySelectorAll<HTMLElement>('[role="menuitem"]');
          const lastItem = items[items.length - 1];
          if (lastItem && !lastItem.hasAttribute('disabled')) {
            lastItem.focus();
          }
        });
        context.focusLastOnOpenRef.current = false;
      }
    }, [context.open, context.focusLastOnOpenRef]);

    return (
      <MenuPrimitive.Content
        id={context.contentId}
        aria-labelledby={context.triggerId}
        {...menuScope}
        {...contentProps}
        ref={composedRefs}
        onCloseAutoFocus={composeEventHandlers(props.onCloseAutoFocus, (event) => {
          if (!hasInteractedOutsideRef.current) context.triggerRef.current?.focus();
          hasInteractedOutsideRef.current = false;
          // Always prevent auto focus because we either focus manually or want user agent focus
          event.preventDefault();
        })}
        onInteractOutside={composeEventHandlers(props.onInteractOutside, (event) => {
          const originalEvent = event.detail.originalEvent as PointerEvent;
          const ctrlLeftClick = originalEvent.button === 0 && originalEvent.ctrlKey === true;
          const isRightClick = originalEvent.button === 2 || ctrlLeftClick;
          if (!context.modal || isRightClick) hasInteractedOutsideRef.current = true;
        })}
        style={{
          ...props.style,
          // re-namespace exposed content custom properties
          ...{
            '--radix-dropdown-menu-content-transform-origin':
              'var(--radix-popper-transform-origin)',
            '--radix-dropdown-menu-content-available-width': 'var(--radix-popper-available-width)',
            '--radix-dropdown-menu-content-available-height':
              'var(--radix-popper-available-height)',
            '--radix-dropdown-menu-trigger-width': 'var(--radix-popper-anchor-width)',
            '--radix-dropdown-menu-trigger-height': 'var(--radix-popper-anchor-height)',
          },
        }}
      />
    );
  },
);

/* -------------------------------------------------------------------------------------------------
 * DropdownMenuGroup
 * -----------------------------------------------------------------------------------------------*/

type DropdownMenuGroupElement = React.ComponentRef<typeof MenuPrimitive.Group>;
type MenuGroupProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.Group>;
interface DropdownMenuGroupProps extends MenuGroupProps {}

const DropdownMenuGroup = /* @__PURE__ */ React.forwardRef<
  DropdownMenuGroupElement,
  DropdownMenuGroupProps
>(
  // blank line to reduce diff noise
  function DropdownMenuGroup(props: ScopedProps<DropdownMenuGroupProps>, forwardedRef) {
    const { __scopeDropdownMenu, ...groupProps } = props;
    const menuScope = useMenuScope(__scopeDropdownMenu);
    return <MenuPrimitive.Group {...menuScope} {...groupProps} ref={forwardedRef} />;
  },
);

/* -------------------------------------------------------------------------------------------------
 * DropdownMenuLabel
 * -----------------------------------------------------------------------------------------------*/

type DropdownMenuLabelElement = React.ComponentRef<typeof MenuPrimitive.Label>;
type MenuLabelProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.Label>;
interface DropdownMenuLabelProps extends MenuLabelProps {}

const DropdownMenuLabel = /* @__PURE__ */ React.forwardRef<
  DropdownMenuLabelElement,
  DropdownMenuLabelProps
>(
  // blank line to reduce diff noise
  function DropdownMenuLabel(props: ScopedProps<DropdownMenuLabelProps>, forwardedRef) {
    const { __scopeDropdownMenu, ...labelProps } = props;
    const menuScope = useMenuScope(__scopeDropdownMenu);
    return <MenuPrimitive.Label {...menuScope} {...labelProps} ref={forwardedRef} />;
  },
);

/* -------------------------------------------------------------------------------------------------
 * DropdownMenuItem
 * -----------------------------------------------------------------------------------------------*/

type DropdownMenuItemElement = React.ComponentRef<typeof MenuPrimitive.Item>;
type MenuItemProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.Item>;
interface DropdownMenuItemProps extends MenuItemProps {}

const DropdownMenuItem = /* @__PURE__ */ React.forwardRef<
  DropdownMenuItemElement,
  DropdownMenuItemProps
>(
  // blank line to reduce diff noise
  function DropdownMenuItem(props: ScopedProps<DropdownMenuItemProps>, forwardedRef) {
    const { __scopeDropdownMenu, ...itemProps } = props;
    const menuScope = useMenuScope(__scopeDropdownMenu);
    return <MenuPrimitive.Item {...menuScope} {...itemProps} ref={forwardedRef} />;
  },
);

/* -------------------------------------------------------------------------------------------------
 * DropdownMenuCheckboxItem
 * -----------------------------------------------------------------------------------------------*/

type DropdownMenuCheckboxItemElement = React.ComponentRef<typeof MenuPrimitive.CheckboxItem>;
type MenuCheckboxItemProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.CheckboxItem>;
interface DropdownMenuCheckboxItemProps extends MenuCheckboxItemProps {}

const DropdownMenuCheckboxItem = /* @__PURE__ */ React.forwardRef<
  DropdownMenuCheckboxItemElement,
  DropdownMenuCheckboxItemProps
>(function DropdownMenuCheckboxItem(
  props: ScopedProps<DropdownMenuCheckboxItemProps>,
  forwardedRef,
) {
  const { __scopeDropdownMenu, ...checkboxItemProps } = props;
  const menuScope = useMenuScope(__scopeDropdownMenu);
  return <MenuPrimitive.CheckboxItem {...menuScope} {...checkboxItemProps} ref={forwardedRef} />;
});

/* -------------------------------------------------------------------------------------------------
 * DropdownMenuRadioGroup
 * -----------------------------------------------------------------------------------------------*/

type DropdownMenuRadioGroupElement = React.ComponentRef<typeof MenuPrimitive.RadioGroup>;
type MenuRadioGroupProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.RadioGroup>;
interface DropdownMenuRadioGroupProps extends MenuRadioGroupProps {}

const DropdownMenuRadioGroup = /* @__PURE__ */ React.forwardRef<
  DropdownMenuRadioGroupElement,
  DropdownMenuRadioGroupProps
>(function DropdownMenuRadioGroup(props: ScopedProps<DropdownMenuRadioGroupProps>, forwardedRef) {
  const { __scopeDropdownMenu, ...radioGroupProps } = props;
  const menuScope = useMenuScope(__scopeDropdownMenu);
  return <MenuPrimitive.RadioGroup {...menuScope} {...radioGroupProps} ref={forwardedRef} />;
});

/* -------------------------------------------------------------------------------------------------
 * DropdownMenuRadioItem
 * -----------------------------------------------------------------------------------------------*/

type DropdownMenuRadioItemElement = React.ComponentRef<typeof MenuPrimitive.RadioItem>;
type MenuRadioItemProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.RadioItem>;
interface DropdownMenuRadioItemProps extends MenuRadioItemProps {}

const DropdownMenuRadioItem = /* @__PURE__ */ React.forwardRef<
  DropdownMenuRadioItemElement,
  DropdownMenuRadioItemProps
>(function DropdownMenuRadioItem(props: ScopedProps<DropdownMenuRadioItemProps>, forwardedRef) {
  const { __scopeDropdownMenu, ...radioItemProps } = props;
  const menuScope = useMenuScope(__scopeDropdownMenu);
  return <MenuPrimitive.RadioItem {...menuScope} {...radioItemProps} ref={forwardedRef} />;
});

/* -------------------------------------------------------------------------------------------------
 * DropdownMenuItemIndicator
 * -----------------------------------------------------------------------------------------------*/

type DropdownMenuItemIndicatorElement = React.ComponentRef<typeof MenuPrimitive.ItemIndicator>;
type MenuItemIndicatorProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.ItemIndicator>;
interface DropdownMenuItemIndicatorProps extends MenuItemIndicatorProps {}

const DropdownMenuItemIndicator = /* @__PURE__ */ React.forwardRef<
  DropdownMenuItemIndicatorElement,
  DropdownMenuItemIndicatorProps
>(function DropdownMenuItemIndicator(
  props: ScopedProps<DropdownMenuItemIndicatorProps>,
  forwardedRef,
) {
  const { __scopeDropdownMenu, ...itemIndicatorProps } = props;
  const menuScope = useMenuScope(__scopeDropdownMenu);
  return <MenuPrimitive.ItemIndicator {...menuScope} {...itemIndicatorProps} ref={forwardedRef} />;
});

/* -------------------------------------------------------------------------------------------------
 * DropdownMenuSeparator
 * -----------------------------------------------------------------------------------------------*/

type DropdownMenuSeparatorElement = React.ComponentRef<typeof MenuPrimitive.Separator>;
type MenuSeparatorProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.Separator>;
interface DropdownMenuSeparatorProps extends MenuSeparatorProps {}

const DropdownMenuSeparator = /* @__PURE__ */ React.forwardRef<
  DropdownMenuSeparatorElement,
  DropdownMenuSeparatorProps
>(function DropdownMenuSeparator(props: ScopedProps<DropdownMenuSeparatorProps>, forwardedRef) {
  const { __scopeDropdownMenu, ...separatorProps } = props;
  const menuScope = useMenuScope(__scopeDropdownMenu);
  return <MenuPrimitive.Separator {...menuScope} {...separatorProps} ref={forwardedRef} />;
});

/* -------------------------------------------------------------------------------------------------
 * DropdownMenuArrow
 * -----------------------------------------------------------------------------------------------*/

type DropdownMenuArrowElement = React.ComponentRef<typeof MenuPrimitive.Arrow>;
type MenuArrowProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.Arrow>;
interface DropdownMenuArrowProps extends MenuArrowProps {}

const DropdownMenuArrow = /* @__PURE__ */ React.forwardRef<
  DropdownMenuArrowElement,
  DropdownMenuArrowProps
>(
  // blank line to reduce diff noise
  function DropdownMenuArrow(props: ScopedProps<DropdownMenuArrowProps>, forwardedRef) {
    const { __scopeDropdownMenu, ...arrowProps } = props;
    const menuScope = useMenuScope(__scopeDropdownMenu);
    return <MenuPrimitive.Arrow {...menuScope} {...arrowProps} ref={forwardedRef} />;
  },
);

/* -------------------------------------------------------------------------------------------------
 * DropdownMenuSub
 * -----------------------------------------------------------------------------------------------*/

interface DropdownMenuSubProps {
  children?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?(open: boolean): void;
}

const DropdownMenuSub: React.FC<DropdownMenuSubProps> = (
  props: ScopedProps<DropdownMenuSubProps>,
) => {
  const { __scopeDropdownMenu, children, open: openProp, onOpenChange, defaultOpen } = props;
  const menuScope = useMenuScope(__scopeDropdownMenu);
  const [open, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen ?? false,
    onChange: onOpenChange,
    caller: 'DropdownMenuSub',
  });

  return (
    <MenuPrimitive.Sub {...menuScope} open={open} onOpenChange={setOpen}>
      {children}
    </MenuPrimitive.Sub>
  );
};

/* -------------------------------------------------------------------------------------------------
 * DropdownMenuSubTrigger
 * -----------------------------------------------------------------------------------------------*/

type DropdownMenuSubTriggerElement = React.ComponentRef<typeof MenuPrimitive.SubTrigger>;
type MenuSubTriggerProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.SubTrigger>;
interface DropdownMenuSubTriggerProps extends MenuSubTriggerProps {}

const DropdownMenuSubTrigger = /* @__PURE__ */ React.forwardRef<
  DropdownMenuSubTriggerElement,
  DropdownMenuSubTriggerProps
>(function DropdownMenuSubTrigger(props: ScopedProps<DropdownMenuSubTriggerProps>, forwardedRef) {
  const { __scopeDropdownMenu, ...subTriggerProps } = props;
  const menuScope = useMenuScope(__scopeDropdownMenu);
  return <MenuPrimitive.SubTrigger {...menuScope} {...subTriggerProps} ref={forwardedRef} />;
});

/* -------------------------------------------------------------------------------------------------
 * DropdownMenuSubContent
 * -----------------------------------------------------------------------------------------------*/

type DropdownMenuSubContentElement = React.ComponentRef<typeof MenuPrimitive.Content>;
type MenuSubContentProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.SubContent>;
interface DropdownMenuSubContentProps extends MenuSubContentProps {}

const DropdownMenuSubContent = /* @__PURE__ */ React.forwardRef<
  DropdownMenuSubContentElement,
  DropdownMenuSubContentProps
>(function DropdownMenuSubContent(props: ScopedProps<DropdownMenuSubContentProps>, forwardedRef) {
  const { __scopeDropdownMenu, ...subContentProps } = props;
  const menuScope = useMenuScope(__scopeDropdownMenu);

  return (
    <MenuPrimitive.SubContent
      {...menuScope}
      {...subContentProps}
      ref={forwardedRef}
      style={{
        ...props.style,
        // re-namespace exposed content custom properties
        ...{
          '--radix-dropdown-menu-content-transform-origin': 'var(--radix-popper-transform-origin)',
          '--radix-dropdown-menu-content-available-width': 'var(--radix-popper-available-width)',
          '--radix-dropdown-menu-content-available-height': 'var(--radix-popper-available-height)',
          '--radix-dropdown-menu-trigger-width': 'var(--radix-popper-anchor-width)',
          '--radix-dropdown-menu-trigger-height': 'var(--radix-popper-anchor-height)',
        },
      }}
    />
  );
});

/* -----------------------------------------------------------------------------------------------*/

export {
  createDropdownMenuScope,
  //
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuPortal,
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
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  //
  DropdownMenu as Root,
  DropdownMenuTrigger as Trigger,
  DropdownMenuPortal as Portal,
  DropdownMenuContent as Content,
  DropdownMenuGroup as Group,
  DropdownMenuLabel as Label,
  DropdownMenuItem as Item,
  DropdownMenuCheckboxItem as CheckboxItem,
  DropdownMenuRadioGroup as RadioGroup,
  DropdownMenuRadioItem as RadioItem,
  DropdownMenuItemIndicator as ItemIndicator,
  DropdownMenuSeparator as Separator,
  DropdownMenuArrow as Arrow,
  DropdownMenuSub as Sub,
  DropdownMenuSubTrigger as SubTrigger,
  DropdownMenuSubContent as SubContent,
};
export type {
  DropdownMenuProps,
  DropdownMenuTriggerProps,
  DropdownMenuPortalProps,
  DropdownMenuContentProps,
  DropdownMenuGroupProps,
  DropdownMenuLabelProps,
  DropdownMenuItemProps,
  DropdownMenuCheckboxItemProps,
  DropdownMenuRadioGroupProps,
  DropdownMenuRadioItemProps,
  DropdownMenuItemIndicatorProps,
  DropdownMenuSeparatorProps,
  DropdownMenuArrowProps,
  DropdownMenuSubProps,
  DropdownMenuSubTriggerProps,
  DropdownMenuSubContentProps,
};
