import * as React from 'react';
import {
  composeEventHandlers,
  createContext,
  extendComponent,
  useComposedRefs,
  useControlledState,
  useId,
} from '@radix-ui/react-utils';
import { forwardRefWithAs } from '@radix-ui/react-polymorphic';
import { getSelector, getSelectorObj } from '@radix-ui/utils';
import * as MenuPrimitive from '@radix-ui/react-menu';

/* -------------------------------------------------------------------------------------------------
 * DropdownMenu
 * -----------------------------------------------------------------------------------------------*/

const DROPDOWN_MENU_NAME = 'DropdownMenu';

type DropdownMenuContextValue = {
  triggerRef: React.RefObject<HTMLButtonElement>;
  id: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean | undefined>>;
};

const [DropdownMenuContext, useDropdownMenuContext] = createContext<DropdownMenuContextValue>(
  DROPDOWN_MENU_NAME + 'Context',
  DROPDOWN_MENU_NAME
);

type DropdownMenuOwnProps = {
  id?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

const DropdownMenu: React.FC<DropdownMenuOwnProps> = (props) => {
  const { children, id: idProp, open: openProp, defaultOpen, onOpenChange } = props;
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const generatedId = useId();
  const id = idProp || `dropdown-menu-${generatedId}`;
  const [open = false, setOpen] = useControlledState({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  });
  const context = React.useMemo(() => ({ triggerRef, id, open, setOpen }), [id, open, setOpen]);

  return <DropdownMenuContext.Provider value={context}>{children}</DropdownMenuContext.Provider>;
};

DropdownMenu.displayName = DROPDOWN_MENU_NAME;

/* -------------------------------------------------------------------------------------------------
 * DropdownMenuTrigger
 * -----------------------------------------------------------------------------------------------*/

const TRIGGER_NAME = 'DropdownMenuTrigger';
const TRIGGER_DEFAULT_TAG = 'button';

type DropdownMenuTriggerOwnProps = {
  /**
   * A string to use as the component selector for CSS purposes. It will be added as
   * a data attribute. Pass `null` to remove selector.
   *
   * @defaultValue radix-dropdown-menu-trigger
   */
  selector?: string | null;
};

const DropdownMenuTrigger = forwardRefWithAs<
  typeof TRIGGER_DEFAULT_TAG,
  DropdownMenuTriggerOwnProps
>((props, forwardedRef) => {
  const {
    as: Comp = TRIGGER_DEFAULT_TAG,
    selector = getSelector(TRIGGER_NAME),
    onClick,
    ...triggerProps
  } = props;
  const context = useDropdownMenuContext(TRIGGER_NAME);
  const composedTriggerRef = useComposedRefs(forwardedRef, context.triggerRef);

  return (
    <Comp
      type="button"
      aria-haspopup="menu"
      aria-expanded={context.open ? true : undefined}
      aria-controls={context.open ? context.id : undefined}
      {...triggerProps}
      {...getSelectorObj(selector)}
      ref={composedTriggerRef}
      onMouseDown={composeEventHandlers(triggerProps.onMouseDown, (event) => {
        // only call handler if it's the left button (mousedown gets triggered by all mouse buttons)
        // but not when the control key is pressed (avoiding MacOS right click)
        if (event.button === 0 && event.ctrlKey === false) {
          context.setOpen((prevOpen) => !prevOpen);
        }
      })}
      onKeyDown={composeEventHandlers(triggerProps.onKeyDown, (event: React.KeyboardEvent) => {
        if ([' ', 'Enter', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
          event.preventDefault();
          context.setOpen(true);
        }
      })}
    />
  );
});

DropdownMenuTrigger.displayName = TRIGGER_NAME;

/* -------------------------------------------------------------------------------------------------
 * DropdownMenuContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = 'DropdownMenuContent';

type DropdownMenuContentOwnProps = {
  anchorRef?: React.ComponentProps<typeof MenuPrimitive.Root>['anchorRef'];
  /**
   * A string to use as the component selector for CSS purposes. It will be added as
   * a data attribute. Pass `null` to remove selector.
   *
   * @defaultValue radix-dropdown-menu-content
   */
  selector?: string | null;
  trapFocus: never;
  onCloseAutoFocus: never;
  onOpenAutoFocus: never;
  onDismiss: never;
};

const DropdownMenuContent = forwardRefWithAs<
  typeof MenuPrimitive.Root,
  DropdownMenuContentOwnProps
>((props, forwardedRef) => {
  const {
    selector = getSelector(CONTENT_NAME),
    anchorRef,
    disableOutsidePointerEvents = true,
    onPointerDownOutside,
    onInteractOutside,
    disableOutsideScroll = true,
    portalled = true,
    ...contentProps
  } = props;
  const context = useDropdownMenuContext(CONTENT_NAME);
  return (
    <MenuPrimitive.Root
      {...contentProps}
      selector={selector}
      ref={forwardedRef}
      id={context.id}
      style={{
        ...contentProps.style,
        // re-namespace exposed content custom property
        ['--radix-dropdown-menu-content-transform-origin' as any]: 'var(--radix-popper-transform-origin)',
      }}
      open={context.open}
      onOpenChange={context.setOpen}
      anchorRef={anchorRef || context.triggerRef}
      trapFocus
      onCloseAutoFocus={(event) => {
        event.preventDefault();
        context.triggerRef.current?.focus();
      }}
      disableOutsidePointerEvents={disableOutsidePointerEvents}
      onPointerDownOutside={composeEventHandlers(
        onPointerDownOutside,
        (event) => {
          const wasTrigger = context.triggerRef.current?.contains(event.target as HTMLElement);

          // prevent dismissing when clicking the trigger
          // as it's already setup to close, otherwise it would close and immediately open.
          if (wasTrigger) {
            event.preventDefault();
          }
        },
        { checkForDefaultPrevented: false }
      )}
      onInteractOutside={onInteractOutside}
      disableOutsideScroll={disableOutsideScroll}
      portalled={portalled}
      onDismiss={() => context.setOpen(false)}
    />
  );
});

DropdownMenuContent.displayName = CONTENT_NAME;

/* -------------------------------------------------------------------------------------------------
 * DropdownMenuGroup
 * -----------------------------------------------------------------------------------------------*/

const GROUP_NAME = 'DropdownMenuGroup';

type DropdownMenuGroupOwnProps = {
  /**
   * A string to use as the component selector for CSS purposes. It will be added as
   * a data attribute. Pass `null` to remove selector.
   *
   * @defaultValue radix-dropdown-menu-group
   */
  selector?: string | null;
};

const DropdownMenuGroup = extendComponent<typeof MenuPrimitive.Group, DropdownMenuGroupOwnProps>(
  MenuPrimitive.Group,
  GROUP_NAME
);

/* -------------------------------------------------------------------------------------------------
 * DropdownMenuLabel
 * -----------------------------------------------------------------------------------------------*/

const LABEL_NAME = 'DropdownMenuLabel';

type DropdownMenuLabelOwnProps = {
  /**
   * A string to use as the component selector for CSS purposes. It will be added as
   * a data attribute. Pass `null` to remove selector.
   *
   * @defaultValue radix-dropdown-menu-label
   */
  selector?: string | null;
};

const DropdownMenuLabel = extendComponent<typeof MenuPrimitive.Label, DropdownMenuLabelOwnProps>(
  MenuPrimitive.Label,
  LABEL_NAME
);

/* -------------------------------------------------------------------------------------------------
 * DropdownMenuItem
 * -----------------------------------------------------------------------------------------------*/

const ITEM_NAME = 'DropdownMenuItem';

type DropdownMenuItemOwnProps = {
  /**
   * A string to use as the component selector for CSS purposes. It will be added as
   * a data attribute. Pass `null` to remove selector.
   *
   * @defaultValue radix-dropdown-menu-item
   */
  selector?: string | null;
};

const DropdownMenuItem = extendComponent<typeof MenuPrimitive.Item, DropdownMenuItemOwnProps>(
  MenuPrimitive.Item,
  ITEM_NAME
);

/* -------------------------------------------------------------------------------------------------
 * DropdownMenuCheckboxItem
 * -----------------------------------------------------------------------------------------------*/

const CHECKBOX_ITEM_NAME = 'DropdownMenuCheckboxItem';

type DropdownMenuCheckboxItemOwnProps = {
  /**
   * A string to use as the component selector for CSS purposes. It will be added as
   * a data attribute. Pass `null` to remove selector.
   *
   * @defaultValue radix-dropdown-menu-checkbox-item
   */
  selector?: string | null;
};

const DropdownMenuCheckboxItem = extendComponent<
  typeof MenuPrimitive.CheckboxItem,
  DropdownMenuCheckboxItemOwnProps
>(MenuPrimitive.CheckboxItem, CHECKBOX_ITEM_NAME);

/* -------------------------------------------------------------------------------------------------
 * DropdownMenuRadioGroup
 * -----------------------------------------------------------------------------------------------*/

const RADIO_GROUP_NAME = 'DropdownMenuRadioGroup';

type DropdownMenuRadioGroupOwnProps = {
  /**
   * A string to use as the component selector for CSS purposes. It will be added as
   * a data attribute. Pass `null` to remove selector.
   *
   * @defaultValue radix-dropdown-menu-radio-group
   */
  selector?: string | null;
};

const DropdownMenuRadioGroup = extendComponent<
  typeof MenuPrimitive.RadioGroup,
  DropdownMenuRadioGroupOwnProps
>(MenuPrimitive.RadioGroup, RADIO_GROUP_NAME);

/* -------------------------------------------------------------------------------------------------
 * DropdownMenuRadioItem
 * -----------------------------------------------------------------------------------------------*/

const RADIO_ITEM_NAME = 'DropdownMenuRadioItem';

type DropdownMenuRadioItemOwnProps = {
  /**
   * A string to use as the component selector for CSS purposes. It will be added as
   * a data attribute. Pass `null` to remove selector.
   *
   * @defaultValue radix-dropdown-menu-radio-item
   */
  selector?: string | null;
};

const DropdownMenuRadioItem = extendComponent<
  typeof MenuPrimitive.RadioItem,
  DropdownMenuRadioItemOwnProps
>(MenuPrimitive.RadioItem, RADIO_ITEM_NAME);

/* -------------------------------------------------------------------------------------------------
 * DropdownMenuItemIndicator
 * -----------------------------------------------------------------------------------------------*/

const ITEM_INDICATOR_NAME = 'DropdownMenuItemIndicator';

type DropdownMenuItemIndicatorOwnProps = {
  /**
   * A string to use as the component selector for CSS purposes. It will be added as
   * a data attribute. Pass `null` to remove selector.
   *
   * @defaultValue radix-dropdown-menu-item-indicator
   */
  selector?: string | null;
};

const DropdownMenuItemIndicator = extendComponent<
  typeof MenuPrimitive.ItemIndicator,
  DropdownMenuItemIndicatorOwnProps
>(MenuPrimitive.ItemIndicator, ITEM_INDICATOR_NAME);

/* -------------------------------------------------------------------------------------------------
 * DropdownMenuSeparator
 * -----------------------------------------------------------------------------------------------*/

const SEPARATOR_NAME = 'DropdownMenuSeparator';

type DropdownMenuSeparatorOwnProps = {
  /**
   * A string to use as the component selector for CSS purposes. It will be added as
   * a data attribute. Pass `null` to remove selector.
   *
   * @defaultValue radix-dropdown-menu-separator
   */
  selector?: string | null;
};

const DropdownMenuSeparator = extendComponent<
  typeof MenuPrimitive.Separator,
  DropdownMenuSeparatorOwnProps
>(MenuPrimitive.Separator, SEPARATOR_NAME);

/* -------------------------------------------------------------------------------------------------
 * DropdownMenuArrow
 * -----------------------------------------------------------------------------------------------*/

const ARROW_NAME = 'DropdownMenuArrow';

type DropdownMenuArrowOwnProps = {
  /**
   * A string to use as the component selector for CSS purposes. It will be added as
   * a data attribute. Pass `null` to remove selector.
   *
   * @defaultValue radix-dropdown-menu-separator
   */
  selector?: string | null;
};

const DropdownMenuArrow = extendComponent<typeof MenuPrimitive.Arrow, DropdownMenuArrowOwnProps>(
  MenuPrimitive.Arrow,
  ARROW_NAME
);

/* -----------------------------------------------------------------------------------------------*/

const Root = DropdownMenu;
const Trigger = DropdownMenuTrigger;
const Content = DropdownMenuContent;
const Group = DropdownMenuGroup;
const Label = DropdownMenuLabel;
const Item = DropdownMenuItem;
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
  CheckboxItem,
  RadioGroup,
  RadioItem,
  ItemIndicator,
  Separator,
  Arrow,
};
