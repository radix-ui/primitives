import * as React from 'react';
import { composeEventHandlers } from '@radix-ui/primitive';
import { createContext } from '@radix-ui/react-context';
import { Primitive, extendPrimitive } from '@radix-ui/react-primitive';
import * as MenuPrimitive from '@radix-ui/react-menu';
import { useCallbackRef } from '@radix-ui/react-use-callback-ref';

import type * as Polymorphic from '@radix-ui/react-polymorphic';

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
};

const [ContextMenuProvider, useContextMenuContext] = createContext<ContextMenuContextValue>(
  CONTEXT_MENU_NAME
);

type ContextMenuOwnProps = {
  onOpenChange?(open: boolean): void;
  dir?: Direction;
};

const ContextMenu: React.FC<ContextMenuOwnProps> = (props) => {
  const { children, onOpenChange, dir } = props;
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
    <ContextMenuProvider isRootMenu={false} open={open} onOpenChange={handleOpenChange}>
      <MenuPrimitive.Sub open={open} onOpenChange={handleOpenChange}>
        {children}
      </MenuPrimitive.Sub>
    </ContextMenuProvider>
  ) : (
    <ContextMenuProvider isRootMenu={true} open={open} onOpenChange={handleOpenChange}>
      <MenuPrimitive.Root dir={dir} open={open} onOpenChange={handleOpenChange}>
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
const TRIGGER_DEFAULT_TAG = 'span';

type ContextMenuTriggerOwnProps = Polymorphic.OwnProps<typeof Primitive>;
type ContextMenuTriggerPrimitive = Polymorphic.ForwardRefComponent<
  typeof TRIGGER_DEFAULT_TAG,
  ContextMenuTriggerOwnProps
>;

const ContextMenuTrigger = React.forwardRef((props, forwardedRef) => {
  const { as = TRIGGER_DEFAULT_TAG, ...triggerProps } = props;
  const context = useContextMenuContext(TRIGGER_NAME);
  const pointRef = React.useRef<Point>({ x: 0, y: 0 });
  const virtualRef = React.useRef({
    getBoundingClientRect: () => DOMRect.fromRect({ width: 0, height: 0, ...pointRef.current }),
  });

  return (
    <ContentContext.Provider value={false}>
      <MenuPrimitive.Anchor virtualRef={virtualRef} />
      <Primitive
        {...triggerProps}
        as={as}
        ref={forwardedRef}
        onContextMenu={composeEventHandlers(props.onContextMenu, (event) => {
          event.preventDefault();
          pointRef.current = { x: event.clientX, y: event.clientY };
          context.onOpenChange(true);
        })}
      />
    </ContentContext.Provider>
  );
}) as ContextMenuTriggerPrimitive;

ContextMenuTrigger.displayName = TRIGGER_NAME;

/* -------------------------------------------------------------------------------------------------
 * ContextMenuContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = 'ContextMenuContent';

const ContentContext = React.createContext(false);

type ContextMenuContentOwnProps = Polymorphic.Merge<
  Omit<
    Polymorphic.OwnProps<typeof MenuPrimitive.Content>,
    'trapFocus' | 'disableOutsideScroll' | 'portalled' | 'side' | 'sideOffset' | 'align'
  >,
  { offset?: number }
>;

type ContextMenuContentPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof MenuPrimitive.Content>,
  ContextMenuContentOwnProps
>;

const ContextMenuContent = React.forwardRef((props, forwardedRef) => {
  const { offset, ...contentProps } = props;
  const context = useContextMenuContext(CONTENT_NAME);

  const commonProps = {
    ...contentProps,
    sideOffset: offset,
    style: {
      ...props.style,
      // re-namespace exposed content custom property
      ['--radix-context-menu-content-transform-origin' as any]: 'var(--radix-popper-transform-origin)',
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
}) as ContextMenuContentPrimitive;

ContextMenuContent.displayName = CONTENT_NAME;

/* ---------------------------------------------------------------------------------------------- */

type ContextMenuRootContentOwnProps = Polymorphic.OwnProps<typeof MenuPrimitive.Content>;
type ContextMenuRootContentPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof MenuPrimitive.Content>,
  ContextMenuRootContentOwnProps
>;

const ContextMenuRootContent = React.forwardRef((props, forwardedRef) => {
  const { disableOutsidePointerEvents = true, ...contentProps } = props;
  const context = useContextMenuContext(CONTENT_NAME);
  return (
    <MenuPrimitive.Content
      {...contentProps}
      ref={forwardedRef}
      disableOutsidePointerEvents={context.open ? disableOutsidePointerEvents : false}
      trapFocus
      disableOutsideScroll
      portalled
      side="bottom"
      align="start"
      alignOffset={2}
    />
  );
}) as ContextMenuRootContentPrimitive;

/* ---------------------------------------------------------------------------------------------- */

const ContextMenuGroup = extendPrimitive(MenuPrimitive.Group, { displayName: 'ContextMenuGroup' });
const ContextMenuLabel = extendPrimitive(MenuPrimitive.Label, { displayName: 'ContextMenuLabel' });
const ContextMenuTriggerItem = extendPrimitive(MenuPrimitive.SubTrigger, {
  displayName: 'ContextMenuTriggerItem',
});
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
const ContextMenuArrow = extendPrimitive(MenuPrimitive.Arrow, {
  displayName: 'ContextMenuArrow',
});

/* -----------------------------------------------------------------------------------------------*/

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
export type { ContextMenuTriggerPrimitive, ContextMenuContentPrimitive };
