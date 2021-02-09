import * as React from 'react';
import { RovingFocusGroup, useRovingFocus } from '@radix-ui/react-roving-focus';
import { Primitive } from '@radix-ui/react-primitive';
import { getSelector } from '@radix-ui/utils';
import { createContext, composeEventHandlers } from '@radix-ui/react-utils';
import type * as Polymorphic from '@radix-ui/react-polymorphic';
import type { Merge } from '@radix-ui/utils';
import { Separator as SeparatorPrimitive } from '@radix-ui/react-separator';

/* -------------------------------------------------------------------------------------------------
 * Toolbar
 * -----------------------------------------------------------------------------------------------*/

const TOOLBAR_NAME = 'Toolbar';
const TOOLBAR_CONTEXT_NAME = TOOLBAR_NAME + 'Context';

type Orientation = React.AriaAttributes['aria-orientation'];

type RovingFocusGroupProps = React.ComponentProps<typeof RovingFocusGroup>;

type ToolbarOwnProps = Merge<
  Polymorphic.OwnProps<typeof Primitive>,
  {
    /**
     * The orientation of the toolbar.
     * Mainly so arrow navigation is done accordingly (left & right vs. up & down)
     * (default: horizontal)
     */
    orientation?: RovingFocusGroupProps['orientation'];
    /**
     * The direction of navigation between toolbar items.
     * (default: ltr)
     */
    dir?: RovingFocusGroupProps['dir'];
    /**
     * Whether keyboard navigation should loop focus
     * (default: true)
     */
    loop?: RovingFocusGroupProps['loop'];
  }
>;

type ToolbarPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof Primitive>,
  ToolbarOwnProps
>;

type ToolbarContextValue = {
  name: typeof TOOLBAR_CONTEXT_NAME;
  orientation: Orientation;
};

const [ToolbarContext, useToolbarContext] = createContext<ToolbarContextValue>(
  TOOLBAR_CONTEXT_NAME,
  TOOLBAR_NAME
);

const Toolbar = React.forwardRef((props, forwardedRef) => {
  const {
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-controls': ariaControls,

    orientation = 'horizontal',
    dir = 'ltr',
    loop = true,

    ...toolbarProps
  } = props;

  const context: ToolbarContextValue = React.useMemo(
    () => ({ name: TOOLBAR_CONTEXT_NAME, orientation }),
    [orientation]
  );

  return (
    <ToolbarContext.Provider value={context}>
      <RovingFocusGroup orientation={orientation} dir={dir} loop={loop}>
        <Primitive
          role="toolbar"
          aria-labelledby={ariaLabel ? undefined : ariaLabelledBy}
          aria-label={ariaLabel || undefined}
          aria-controls={ariaControls}
          aria-orientation={orientation}
          data-orientation={orientation}
          {...toolbarProps}
          selector={getSelector(TOOLBAR_NAME)}
          ref={forwardedRef}
        ></Primitive>
      </RovingFocusGroup>
    </ToolbarContext.Provider>
  );
}) as ToolbarPrimitive;

/* -------------------------------------------------------------------------------------------------
 * ToolbarGroup
 * -----------------------------------------------------------------------------------------------*/

const GROUP_NAME = 'ToolbarGroup';

type ToolbarGroupOwnProps = Polymorphic.OwnProps<typeof Primitive>;
type ToolbarGroupPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof Primitive>,
  ToolbarGroupOwnProps
>;

const ToolbarGroup = React.forwardRef((props, forwardedRef) => {
  const { orientation } = useToolbarContext(GROUP_NAME);

  return (
    <Primitive
      role="group"
      data-orientation={orientation}
      {...props}
      selector={getSelector(GROUP_NAME)}
      ref={forwardedRef}
    />
  );
}) as ToolbarGroupPrimitive;

ToolbarGroup.displayName = GROUP_NAME;

/* -------------------------------------------------------------------------------------------------
 * ToolbarSeparator
 * -----------------------------------------------------------------------------------------------*/

const SEPARATOR_NAME = 'ToolbarSeparator';

type ToolbarSeparatorOwnProps = Polymorphic.OwnProps<typeof Primitive>;
type ToolbarSeparatorPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof Primitive>,
  ToolbarSeparatorOwnProps
>;

const ToolbarSeparator = React.forwardRef((props, forwardedRef) => {
  const { orientation } = useToolbarContext(GROUP_NAME);

  return (
    <SeparatorPrimitive
      aria-orientation={orientation}
      data-orientation={orientation}
      {...props}
      selector={getSelector(SEPARATOR_NAME)}
      ref={forwardedRef}
    ></SeparatorPrimitive>
  );
}) as ToolbarSeparatorPrimitive;

ToolbarSeparator.displayName = SEPARATOR_NAME;

/* -------------------------------------------------------------------------------------------------
 * ToolbarItem
 * -----------------------------------------------------------------------------------------------*/

const ITEM_NAME = 'ToolbarItem';

type ToolbarItemOwnProps = Merge<Polymorphic.OwnProps<typeof Primitive>, { disabled?: boolean }>;
type ToolbarItemPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof Primitive>,
  ToolbarItemOwnProps
>;

const ToolbarItem = React.forwardRef((props, forwardedRef) => {
  const { disabled, ...itemProps } = props;

  const rovingFocusProps = useRovingFocus({
    disabled,
    active: false,
  });

  return (
    <Primitive
      role="toolbaritem"
      aria-disabled={disabled}
      data-disabled={disabled ? '' : undefined}
      {...itemProps}
      selector={getSelector(ITEM_NAME)}
      ref={forwardedRef}
      {...rovingFocusProps}
      // RovingFocus eventHandlers should not block item eventHandlers
      onFocus={composeEventHandlers(itemProps.onFocus, rovingFocusProps.onFocus)}
      onKeyDown={composeEventHandlers(itemProps.onKeyDown, rovingFocusProps.onKeyDown)}
      onMouseDown={composeEventHandlers(itemProps.onMouseDown, rovingFocusProps.onMouseDown)}
    />
  );
}) as ToolbarItemPrimitive;

ToolbarItem.displayName = ITEM_NAME;

const Root = Toolbar;
const Group = ToolbarGroup;
const Separator = ToolbarSeparator;
const Item = ToolbarItem;

export {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
  ToolbarItem,
  //
  Root,
  Group,
  Item,
  Separator,
};
