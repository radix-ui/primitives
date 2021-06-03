import * as React from 'react';
import { composeEventHandlers } from '@radix-ui/primitive';
import { createContext } from '@radix-ui/react-context';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
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
  open: boolean;
  onOpenChange(open: boolean): void;
};

const SubmenuContext = React.createContext<boolean | undefined>(undefined);
const InsideContentContext = React.createContext(false);
const [ContextMenuProvider, useContextMenuContext] = createContext<ContextMenuContextValue>(
  CONTEXT_MENU_NAME
);

type ContextMenuOwnProps = React.ComponentProps<typeof ContextMenuImpl>;

const ContextMenu: React.FC<ContextMenuOwnProps> = (props) => {
  const parentSubmenuContext = React.useContext(SubmenuContext);
  const isInsideContent = React.useContext(InsideContentContext);
  const isRootMenu = parentSubmenuContext === undefined;

  return (
    <SubmenuContext.Provider value={!isRootMenu && isInsideContent}>
      <ContextMenuImpl {...props} />
    </SubmenuContext.Provider>
  );
};

type ContextMenuImplOwnProps = ContextMenuRootOwnProps & ContextMenuSubOwnProps;

const ContextMenuImpl: React.FC<ContextMenuImplOwnProps> = (props) => {
  const isSubmenu = React.useContext(SubmenuContext);
  return isSubmenu ? <ContextMenuSub {...props} /> : <ContextMenuRoot {...props} />;
};

/* -----------------------------------------------------------------------------------------------*/

type ContextMenuRootOwnProps = {
  onOpenChange?(open: boolean): void;
  dir?: Direction;
};

const ContextMenuRoot: React.FC<ContextMenuRootOwnProps> = (props) => {
  const { children, onOpenChange, dir } = props;
  const [open, setOpen] = React.useState(false);
  const handleOpenChangeProp = useCallbackRef(onOpenChange);

  const handleOpenChange = React.useCallback(
    (open) => {
      setOpen(open);
      handleOpenChangeProp(open);
    },
    [handleOpenChangeProp]
  );

  return (
    <MenuPrimitive.Root open={open} onOpenChange={handleOpenChange} dir={dir}>
      <ContextMenuProvider open={open} onOpenChange={handleOpenChange}>
        {children}
      </ContextMenuProvider>
    </MenuPrimitive.Root>
  );
};

/* -----------------------------------------------------------------------------------------------*/

type ContextMenuSubOwnProps = {
  open?: boolean;
  onOpenChange?(open: boolean): void;
  defaultOpen?: boolean;
};

const ContextMenuSub: React.FC<ContextMenuSubOwnProps> = (props) => {
  const { children, open: openProp, defaultOpen, onOpenChange } = props;
  const [open = false, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  });

  return (
    <MenuPrimitive.Sub open={open} onOpenChange={setOpen}>
      {children}
    </MenuPrimitive.Sub>
  );
};

ContextMenu.displayName = CONTEXT_MENU_NAME;

/* -------------------------------------------------------------------------------------------------
 * ContextMenuTrigger
 * -----------------------------------------------------------------------------------------------*/

const TRIGGER_NAME = 'ContextMenuTrigger';

type ContextMenuTriggerOwnProps = Polymorphic.Merge<
  Polymorphic.OwnProps<typeof ContextMenuRootTrigger>,
  Polymorphic.OwnProps<typeof MenuPrimitive.SubTrigger>
>;
type ContextMenuTriggerPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof ContextMenuRootTrigger>,
  ContextMenuTriggerOwnProps
>;

const ContextMenuTrigger = React.forwardRef((props, forwardedRef) => {
  const { as, ...triggerProps } = props;
  const isSubmenu = React.useContext(SubmenuContext);

  return (
    <InsideContentContext.Provider value={false}>
      {isSubmenu ? (
        <MenuPrimitive.SubTrigger
          {...triggerProps}
          as={as as Polymorphic.IntrinsicElement<typeof ContextMenuRootTrigger>}
          ref={forwardedRef}
        />
      ) : (
        <ContextMenuRootTrigger {...triggerProps} as={as} ref={forwardedRef} />
      )}
    </InsideContentContext.Provider>
  );
}) as ContextMenuTriggerPrimitive;

ContextMenuTrigger.displayName = TRIGGER_NAME;

/* ---------------------------------------------------------------------------------------------- */

const TRIGGER_DEFAULT_TAG = 'span';

type ContextMenuRootTriggerOwnProps = Polymorphic.OwnProps<typeof Primitive>;
type ContextMenuRootTriggerPrimitive = Polymorphic.ForwardRefComponent<
  typeof TRIGGER_DEFAULT_TAG,
  ContextMenuRootTriggerOwnProps
>;

const ContextMenuRootTrigger = React.forwardRef((props, forwardedRef) => {
  const { as = TRIGGER_DEFAULT_TAG, ...triggerProps } = props;
  const context = useContextMenuContext(TRIGGER_NAME);
  const pointRef = React.useRef<Point>({ x: 0, y: 0 });
  const virtualRef = React.useRef({
    getBoundingClientRect: () => DOMRect.fromRect({ width: 0, height: 0, ...pointRef.current }),
  });

  return (
    <>
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
    </>
  );
}) as ContextMenuRootTriggerPrimitive;

/* -------------------------------------------------------------------------------------------------
 * ContextMenuContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = 'ContextMenuContent';

type ContextMenuContentOwnProps = Polymorphic.Merge<
  Omit<
    Polymorphic.OwnProps<typeof MenuPrimitive.Content>,
    | 'trapFocus'
    | 'disableOutsideScroll'
    | 'portalled'
    | 'onOpenAutoFocus'
    | 'side'
    | 'sideOffset'
    | 'align'
  >,
  { offset?: number }
>;

type ContextMenuContentPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof MenuPrimitive.Content>,
  ContextMenuContentOwnProps
>;

const ContextMenuContent = React.forwardRef((props, forwardedRef) => {
  const { disableOutsidePointerEvents = true, offset, ...contentProps } = props;
  const isSubmenu = React.useContext(SubmenuContext);
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
    <InsideContentContext.Provider value={true}>
      {isSubmenu ? (
        <MenuPrimitive.Content {...commonProps} ref={forwardedRef} />
      ) : (
        <MenuPrimitive.Content
          {...commonProps}
          ref={forwardedRef}
          disableOutsidePointerEvents={context.open ? disableOutsidePointerEvents : false}
          trapFocus
          disableOutsideScroll
          portalled
          side="bottom"
          align="start"
          alignOffset={2}
        />
      )}
    </InsideContentContext.Provider>
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
  CheckboxItem,
  RadioGroup,
  RadioItem,
  ItemIndicator,
  Separator,
  Arrow,
};
export type { ContextMenuTriggerPrimitive, ContextMenuContentPrimitive };
