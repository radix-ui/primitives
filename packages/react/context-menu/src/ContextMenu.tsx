import * as React from 'react';
import { composeEventHandlers } from '@radix-ui/primitive';
import { createContext } from '@radix-ui/react-context';
import { Primitive, extendPrimitive } from '@radix-ui/react-primitive';
import * as MenuPrimitive from '@radix-ui/react-menu';

import type * as Polymorphic from '@radix-ui/react-polymorphic';

type Point = { x: number; y: number };

/* -------------------------------------------------------------------------------------------------
 * ContextMenu
 * -----------------------------------------------------------------------------------------------*/

const CONTEXT_MENU_NAME = 'ContextMenu';

type ExtractRef<T> = T extends React.RefObject<infer B> ? B : never;
type Anchor = ExtractRef<React.ComponentProps<typeof MenuPrimitive.Root>['anchorRef']>;

type ContextMenuContextValue = {
  anchorPointRef: React.MutableRefObject<Point>;
  anchorRef: React.MutableRefObject<Anchor | null>;
  open: boolean;
  onOpenChange(open: boolean): void;
};

const [ContextMenuProvider, useContextMenuContext] = createContext<ContextMenuContextValue>(
  CONTEXT_MENU_NAME
);

const ContextMenu: React.FC = (props) => {
  const { children } = props;
  const [open, setOpen] = React.useState(false);
  const anchorPointRef = React.useRef<Point>({ x: 0, y: 0 });
  const anchorRef = React.useRef({
    getBoundingClientRect: () =>
      DOMRect.fromRect({ width: 0, height: 0, ...anchorPointRef.current }),
  });

  return (
    <ContextMenuProvider
      anchorPointRef={anchorPointRef}
      anchorRef={anchorRef}
      open={open}
      onOpenChange={setOpen}
    >
      {children}
    </ContextMenuProvider>
  );
};

ContextMenu.displayName = CONTEXT_MENU_NAME;

/* -------------------------------------------------------------------------------------------------
 * ContextMenuTrigger
 * -----------------------------------------------------------------------------------------------*/

const TRIGGER_NAME = 'ContextMenuTrigger';
const TRIGGER_DEFAULT_TAG = 'span';

type ContextMenuTriggerOwnProps = Polymorphic.OwnProps<typeof Primitive>;
type ContextMenuTriggerPrimitive = Polymorphic.ForwardRefComponent<
  typeof TRIGGER_DEFAULT_TAG,
  ContextMenuTriggerOwnProps
>;

const ContextMenuTrigger = React.forwardRef((props, forwardedRef) => {
  const { as = TRIGGER_DEFAULT_TAG, ...triggerProps } = props;
  const context = useContextMenuContext(TRIGGER_NAME);
  return (
    <Primitive
      {...triggerProps}
      as={as}
      ref={forwardedRef}
      onContextMenu={composeEventHandlers(props.onContextMenu, (event) => {
        event.preventDefault();
        const point = { x: event.clientX, y: event.clientY };
        context.onOpenChange(true);
        context.anchorPointRef.current = point;
      })}
    />
  );
}) as ContextMenuTriggerPrimitive;

ContextMenuTrigger.displayName = TRIGGER_NAME;

/* -------------------------------------------------------------------------------------------------
 * ContextMenuContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = 'ContextMenuContent';

type ContextMenuContentOwnProps = Omit<
  Polymorphic.OwnProps<typeof MenuPrimitive.Root>,
  'anchorRef' | 'trapFocus' | 'disableOutsideScroll' | 'portalled' | 'onOpenAutoFocus' | 'onDismiss'
>;

type ContextMenuContentPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof MenuPrimitive.Root>,
  ContextMenuContentOwnProps
>;

const ContextMenuContent = React.forwardRef((props, forwardedRef) => {
  const {
    side = 'bottom',
    align = 'start',
    disableOutsidePointerEvents = true,
    ...contentProps
  } = props;
  const context = useContextMenuContext(CONTENT_NAME);
  return (
    <MenuPrimitive.Root
      {...contentProps}
      ref={forwardedRef}
      side={side}
      align={align}
      disableOutsidePointerEvents={context.open ? disableOutsidePointerEvents : false}
      open={context.open}
      onOpenChange={context.onOpenChange}
      style={{
        ...props.style,
        // re-namespace exposed content custom property
        ['--radix-context-menu-content-transform-origin' as any]: 'var(--radix-popper-transform-origin)',
      }}
      anchorRef={context.anchorRef}
      trapFocus
      disableOutsideScroll
      portalled
      onDismiss={() => context.onOpenChange(false)}
    />
  );
}) as ContextMenuContentPrimitive;

ContextMenuContent.displayName = CONTENT_NAME;

/* ---------------------------------------------------------------------------------------------- */

const ContextMenuGroup = extendPrimitive(MenuPrimitive.Group, { displayName: 'ContextMenuGroup' });
const ContextMenuLabel = extendPrimitive(MenuPrimitive.Label, { displayName: 'ContextMenuLabel' });
const ContextMenuItem = extendPrimitive(MenuPrimitive.Item, { displayName: 'ContextMenuItem' });
const ContextMenuCheckboxItem = extendPrimitive(MenuPrimitive.CheckboxItem, {
  displayName: 'ContextMenuCheckboxItem',
});
const ContextMenuRadioGroup = extendPrimitive(MenuPrimitive.RadioGroup, {
  displayName: 'ContextMenuRadioGroup',
});
const ContextMenuRadioItem = extendPrimitive(MenuPrimitive.RadioItem, {
  displayName: 'ContextMenuRadioItem',
});
const ContextMenuItemIndicator = extendPrimitive(MenuPrimitive.ItemIndicator, {
  displayName: 'ContextMenuItemIndicator',
});
const ContextMenuSeparator = extendPrimitive(MenuPrimitive.Separator, {
  displayName: 'ContextMenuSeparator',
});

/* -----------------------------------------------------------------------------------------------*/

const Root = ContextMenu;
const Trigger = ContextMenuTrigger;
const Content = ContextMenuContent;
const Group = ContextMenuGroup;
const Label = ContextMenuLabel;
const Item = ContextMenuItem;
const CheckboxItem = ContextMenuCheckboxItem;
const RadioGroup = ContextMenuRadioGroup;
const RadioItem = ContextMenuRadioItem;
const ItemIndicator = ContextMenuItemIndicator;
const Separator = ContextMenuSeparator;

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuLabel,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuItemIndicator,
  ContextMenuSeparator,
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
};
