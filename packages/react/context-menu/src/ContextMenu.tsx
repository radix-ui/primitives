import * as React from 'react';
import { composeEventHandlers, createContext, extendComponent } from '@radix-ui/react-utils';
import { forwardRefWithAs } from '@radix-ui/react-polymorphic';
import { Primitive } from '@radix-ui/react-primitive';
import { makeRect, getSelector } from '@radix-ui/utils';
import * as MenuPrimitive from '@radix-ui/react-menu';

import type { Point, MeasurableElement } from '@radix-ui/utils';
import type { OwnProps } from '@radix-ui/react-polymorphic';

/* -------------------------------------------------------------------------------------------------
 * ContextMenu
 * -----------------------------------------------------------------------------------------------*/

const CONTEXT_MENU_NAME = 'ContextMenu';

type ContextMenuContextValue = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  anchorPointRef: React.MutableRefObject<Point>;
  anchorRef: React.MutableRefObject<MeasurableElement | null>;
};

const [ContextMenuContext, useContextMenuContext] = createContext<ContextMenuContextValue>(
  CONTEXT_MENU_NAME + 'Context',
  CONTEXT_MENU_NAME
);

const ContextMenu: React.FC = (props) => {
  const { children } = props;
  const [open, setOpen] = React.useState(false);
  const anchorPointRef = React.useRef<Point>({ x: 0, y: 0 });
  const anchorRef = React.useRef({
    getBoundingClientRect: () => makeRect({ width: 0, height: 0 }, anchorPointRef.current),
  });
  const context = React.useMemo(() => ({ open, setOpen, anchorPointRef, anchorRef }), [open]);

  return <ContextMenuContext.Provider value={context}>{children}</ContextMenuContext.Provider>;
};

ContextMenu.displayName = CONTEXT_MENU_NAME;

/* -------------------------------------------------------------------------------------------------
 * ContextMenuTrigger
 * -----------------------------------------------------------------------------------------------*/

const TRIGGER_NAME = 'ContextMenuTrigger';
const TRIGGER_DEFAULT_TAG = 'span';

const ContextMenuTrigger = forwardRefWithAs<typeof TRIGGER_DEFAULT_TAG, OwnProps<typeof Primitive>>(
  (props, forwardedRef) => {
    const context = useContextMenuContext(TRIGGER_NAME);
    return (
      <Primitive
        as={TRIGGER_DEFAULT_TAG}
        selector={getSelector(TRIGGER_NAME)}
        {...props}
        ref={forwardedRef}
        onContextMenu={composeEventHandlers(props.onContextMenu, (event) => {
          event.preventDefault();
          const point = { x: event.clientX, y: event.clientY };
          context.setOpen(true);
          context.anchorPointRef.current = point;
        })}
      />
    );
  }
);

ContextMenuTrigger.displayName = TRIGGER_NAME;

/* -------------------------------------------------------------------------------------------------
 * ContextMenuContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = 'ContextMenuContent';

type ContextMenuContentOwnProps = {
  anchorRef: never;
  trapFocus: never;
  disableOutsideScroll: never;
  portalled: never;
  onCloseAutoFocus: never;
  onOpenAutoFocus: never;
  onDismiss: never;
};

const ContextMenuContent = forwardRefWithAs<typeof MenuPrimitive.Root, ContextMenuContentOwnProps>(
  (props, forwardedRef) => {
    const context = useContextMenuContext(CONTENT_NAME);

    return (
      <MenuPrimitive.Root
        selector={getSelector(CONTENT_NAME)}
        disableOutsidePointerEvents
        side="bottom"
        align="start"
        {...props}
        ref={forwardedRef}
        open={context.open}
        onOpenChange={context.setOpen}
        style={{
          ...props.style,
          // re-namespace exposed content custom property
          ['--radix-context-menu-content-transform-origin' as any]: 'var(--radix-popper-transform-origin)',
        }}
        anchorRef={context.anchorRef}
        trapFocus
        disableOutsideScroll
        portalled
        onDismiss={() => context.setOpen(false)}
      />
    );
  }
);

ContextMenuContent.displayName = CONTENT_NAME;

/* ---------------------------------------------------------------------------------------------- */

const ContextMenuGroup = extendComponent(MenuPrimitive.Group, 'ContextMenuGroup');
const ContextMenuLabel = extendComponent(MenuPrimitive.Label, 'ContextMenuLabel');
const ContextMenuItem = extendComponent(MenuPrimitive.Item, 'ContextMenuItem');
const ContextMenuCheckboxItem = extendComponent(
  MenuPrimitive.CheckboxItem,
  'ContextMenuCheckboxItem'
);
const ContextMenuRadioGroup = extendComponent(MenuPrimitive.RadioGroup, 'ContextMenuRadioGroup');
const ContextMenuRadioItem = extendComponent(MenuPrimitive.RadioItem, 'ContextMenuRadioItem');
const ContextMenuItemIndicator = extendComponent(
  MenuPrimitive.ItemIndicator,
  'ContextMenuItemIndicator'
);
const ContextMenuSeparator = extendComponent(MenuPrimitive.Separator, 'ContextMenuSeparator');

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
