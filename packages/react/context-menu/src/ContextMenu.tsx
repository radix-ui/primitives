import * as React from 'react';
import { composeEventHandlers, createContext, extendComponent } from '@radix-ui/react-utils';
import { forwardRefWithAs } from '@radix-ui/react-polymorphic';
import { makeRect, getSelector, getSelectorObj } from '@radix-ui/utils';
import * as MenuPrimitive from '@radix-ui/react-menu';

import type { Point, MeasurableElement } from '@radix-ui/utils';

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

type ContextMenuTriggerOwnProps = {
  /**
   * A string to use as the component selector for CSS purposes. It will be added as
   * a data attribute. Pass `null` to remove selector.
   *
   * @defaultValue radix-context-menu-trigger
   */
  selector?: string | null;
};

const ContextMenuTrigger = forwardRefWithAs<typeof TRIGGER_DEFAULT_TAG, ContextMenuTriggerOwnProps>(
  (props, forwardedRef) => {
    const {
      as: Comp = TRIGGER_DEFAULT_TAG,
      selector = getSelector(TRIGGER_NAME),
      ...triggerProps
    } = props;
    const context = useContextMenuContext(TRIGGER_NAME);

    return (
      <Comp
        {...triggerProps}
        {...getSelectorObj(selector)}
        ref={forwardedRef}
        onContextMenu={composeEventHandlers(triggerProps.onContextMenu, (event) => {
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
  anchorRef?: React.ComponentProps<typeof MenuPrimitive.Root>['anchorRef'];
  trapFocus: never;
  disableOutsideScroll: never;
  portalled: never;
  /**
   * A string to use as the component selector for CSS purposes. It will be added as
   * a data attribute. Pass `null` to remove selector.
   *
   * @defaultValue radix-context-menu-content
   */
  selector?: string | null;
  onCloseAutoFocus: never;
  onOpenAutoFocus: never;
  onDismiss: never;
};

const ContextMenuContent = forwardRefWithAs<typeof MenuPrimitive.Root, ContextMenuContentOwnProps>(
  (props, forwardedRef) => {
    const {
      selector = getSelector(CONTENT_NAME),
      anchorRef,
      disableOutsidePointerEvents = true,
      side = 'bottom',
      align = 'start',
      ...contentProps
    } = props;
    const context = useContextMenuContext(CONTENT_NAME);

    return (
      <MenuPrimitive.Root
        {...contentProps}
        selector={selector}
        ref={forwardedRef}
        open={context.open}
        onOpenChange={context.setOpen}
        style={{
          ...contentProps.style,
          // re-namespace exposed content custom property
          ['--radix-context-menu-content-transform-origin' as any]: 'var(--radix-popper-transform-origin)',
        }}
        side={side}
        align={align}
        anchorRef={context.anchorRef}
        trapFocus
        disableOutsidePointerEvents={disableOutsidePointerEvents}
        disableOutsideScroll
        portalled
        onDismiss={() => context.setOpen(false)}
      />
    );
  }
);

ContextMenuContent.displayName = CONTENT_NAME;

/* -------------------------------------------------------------------------------------------------
 * ContextMenuGroup
 * -----------------------------------------------------------------------------------------------*/

const GROUP_NAME = 'ContextMenuGroup';

type ContextMenuGroupOwnProps = {
  /**
   * A string to use as the component selector for CSS purposes. It will be added as
   * a data attribute. Pass `null` to remove selector.
   *
   * @defaultValue radix-context-menu-group
   */
  selector?: string | null;
};

const ContextMenuGroup = extendComponent<typeof MenuPrimitive.Group, ContextMenuGroupOwnProps>(
  MenuPrimitive.Group,
  GROUP_NAME
);

/* -------------------------------------------------------------------------------------------------
 * ContextMenuLabel
 * -----------------------------------------------------------------------------------------------*/

const LABEL_NAME = 'ContextMenuLabel';

type ContextMenuLabelOwnProps = {
  /**
   * A string to use as the component selector for CSS purposes. It will be added as
   * a data attribute. Pass `null` to remove selector.
   *
   * @defaultValue radix-context-menu-label
   */
  selector?: string | null;
};

const ContextMenuLabel = extendComponent<typeof MenuPrimitive.Label, ContextMenuLabelOwnProps>(
  MenuPrimitive.Label,
  LABEL_NAME
);

/* -------------------------------------------------------------------------------------------------
 * ContextMenuItem
 * -----------------------------------------------------------------------------------------------*/

const ITEM_NAME = 'ContextMenuItem';

type ContextMenuItemOwnProps = {
  /**
   * A string to use as the component selector for CSS purposes. It will be added as
   * a data attribute. Pass `null` to remove selector.
   *
   * @defaultValue radix-context-menu-item
   */
  selector?: string | null;
};

const ContextMenuItem = extendComponent<typeof MenuPrimitive.Item, ContextMenuItemOwnProps>(
  MenuPrimitive.Item,
  ITEM_NAME
);

/* -------------------------------------------------------------------------------------------------
 * ContextMenuCheckboxItem
 * -----------------------------------------------------------------------------------------------*/

const CHECKBOX_ITEM_NAME = 'ContextMenuCheckboxItem';

type ContextMenuCheckboxItemOwnProps = {
  /**
   * A string to use as the component selector for CSS purposes. It will be added as
   * a data attribute. Pass `null` to remove selector.
   *
   * @defaultValue radix-context-menu-checkbox-item
   */
  selector?: string | null;
};

const ContextMenuCheckboxItem = extendComponent<
  typeof MenuPrimitive.CheckboxItem,
  ContextMenuCheckboxItemOwnProps
>(MenuPrimitive.CheckboxItem, CHECKBOX_ITEM_NAME);

/* -------------------------------------------------------------------------------------------------
 * ContextMenuRadioGroup
 * -----------------------------------------------------------------------------------------------*/

const RADIO_GROUP_NAME = 'ContextMenuRadioGroup';

type ContextMenuRadioGroupOwnProps = {
  /**
   * A string to use as the component selector for CSS purposes. It will be added as
   * a data attribute. Pass `null` to remove selector.
   *
   * @defaultValue radix-context-menu-radio-group
   */
  selector?: string | null;
};

const ContextMenuRadioGroup = extendComponent<
  typeof MenuPrimitive.RadioGroup,
  ContextMenuRadioGroupOwnProps
>(MenuPrimitive.RadioGroup, RADIO_GROUP_NAME);

/* -------------------------------------------------------------------------------------------------
 * ContextMenuRadioItem
 * -----------------------------------------------------------------------------------------------*/

const RADIO_ITEM_NAME = 'ContextMenuRadioItem';

type ContextMenuRadioItemOwnProps = {
  /**
   * A string to use as the component selector for CSS purposes. It will be added as
   * a data attribute. Pass `null` to remove selector.
   *
   * @defaultValue radix-context-menu-radio-item
   */
  selector?: string | null;
};

const ContextMenuRadioItem = extendComponent<
  typeof MenuPrimitive.RadioItem,
  ContextMenuRadioItemOwnProps
>(MenuPrimitive.RadioItem, RADIO_ITEM_NAME);

/* -------------------------------------------------------------------------------------------------
 * ContextMenuItemIndicator
 * -----------------------------------------------------------------------------------------------*/

const ITEM_INDICATOR_NAME = 'ContextMenuItemIndicator';

type ContextMenuItemIndicatorOwnProps = {
  /**
   * A string to use as the component selector for CSS purposes. It will be added as
   * a data attribute. Pass `null` to remove selector.
   *
   * @defaultValue radix-context-menu-item-indicator
   */
  selector?: string | null;
};

const ContextMenuItemIndicator = extendComponent<
  typeof MenuPrimitive.ItemIndicator,
  ContextMenuItemIndicatorOwnProps
>(MenuPrimitive.ItemIndicator, ITEM_INDICATOR_NAME);

/* -------------------------------------------------------------------------------------------------
 * ContextMenuSeparator
 * -----------------------------------------------------------------------------------------------*/

const SEPARATOR_NAME = 'ContextMenuSeparator';

type ContextMenuSeparatorOwnProps = {
  /**
   * A string to use as the component selector for CSS purposes. It will be added as
   * a data attribute. Pass `null` to remove selector.
   *
   * @defaultValue radix-context-menu-separator
   */
  selector?: string | null;
};

const ContextMenuSeparator = extendComponent<
  typeof MenuPrimitive.Separator,
  ContextMenuSeparatorOwnProps
>(MenuPrimitive.Separator, SEPARATOR_NAME);

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
