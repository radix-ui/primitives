import * as React from 'react';
import { RovingFocusGroup, useRovingFocus } from '@radix-ui/react-roving-focus';
import { Primitive } from '@radix-ui/react-primitive';
import { getSelector } from '@radix-ui/utils';
import { createContext, composeEventHandlers } from '@radix-ui/react-utils';
import type * as Polymorphic from '@radix-ui/react-polymorphic';
import type { Merge } from '@radix-ui/utils';

/* -------------------------------------------------------------------------------------------------
 * Toolbar
 * -----------------------------------------------------------------------------------------------*/

const TOOLBAR_NAME = 'Toolbar';
const TOOLBAR_CONTEXT_NAME = TOOLBAR_NAME + 'Context';
const TOOLBAR_DEFAULT_TAG = 'div';

type Orientation = React.AriaAttributes['aria-orientation'];
type Direction = 'ltr' | 'rtl';

export type RovingFocusGroupOptions = {
  orientation?: Orientation;
  dir?: Direction;
  loop?: boolean;
};

type ToolbarOwnProps = Merge<
  Polymorphic.OwnProps<typeof Primitive>,
  {
    /**
     * The orientation of the toolbar.
     * Mainly so arrow navigation is done accordingly (left & right vs. up & down)
     * (default: horizontal)
     */
    orientation?: React.AriaAttributes['aria-orientation'];
    /**
     * The direction of navigation between toolbar items.
     * (default: ltr)
     */
    dir?: Direction;
    /**
     * Whether keyboard navigation should loop focus
     * (default: true)
     */
    loop?: boolean;
  }
>;

type ToolbarPrimitive = Polymorphic.ForwardRefComponent<
  typeof TOOLBAR_DEFAULT_TAG,
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
    children,

    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-controls': ariaControls,

    orientation = 'horizontal',
    dir,
    loop,

    ...ToolbarProps
  } = props;

  const context: ToolbarContextValue = React.useMemo(() => {
    return {
      name: TOOLBAR_CONTEXT_NAME,
      orientation,
    };
  }, [orientation]);

  return (
    <ToolbarContext.Provider value={context}>
      <RovingFocusGroup orientation={orientation} dir={dir} loop={loop}>
        <Primitive
          ref={forwardedRef}
          as={TOOLBAR_DEFAULT_TAG}
          selector={getSelector(TOOLBAR_NAME)}
          role="toolbar"
          aria-labelledby={ariaLabel ? undefined : ariaLabelledBy}
          aria-label={ariaLabel || undefined}
          aria-controls={ariaControls}
          aria-orientation={orientation}
          data-orientation={orientation}
          {...ToolbarProps}
        >
          {children}
        </Primitive>
      </RovingFocusGroup>
    </ToolbarContext.Provider>
  ) as any;
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
      selector={getSelector(GROUP_NAME)}
      data-orientation={orientation}
      {...props}
      ref={forwardedRef}
    />
  );
}) as ToolbarGroupPrimitive;

ToolbarGroup.displayName = GROUP_NAME;

/* -------------------------------------------------------------------------------------------------
 * ToolbarLabel
 * -----------------------------------------------------------------------------------------------*/

const LABEL_NAME = 'ToolbarLabel';

type ToolbarLabelOwnProps = Polymorphic.OwnProps<typeof Primitive>;
type ToolbarLabelPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof Primitive>,
  ToolbarLabelOwnProps
>;

const ToolbarLabel = React.forwardRef((props, forwardedRef) => (
  <Primitive selector={getSelector(LABEL_NAME)} {...props} ref={forwardedRef} />
)) as ToolbarLabelPrimitive;

ToolbarLabel.displayName = LABEL_NAME;

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
    <Primitive
      role="separator"
      selector={getSelector(SEPARATOR_NAME)}
      aria-orientation={orientation}
      data-orientation={orientation}
      {...props}
      ref={forwardedRef}
    />
  );
}) as ToolbarSeparatorPrimitive;

ToolbarSeparator.displayName = SEPARATOR_NAME;

/* -------------------------------------------------------------------------------------------------
 * ToolbarItem
 * -----------------------------------------------------------------------------------------------*/

const ITEM_NAME = 'ToolbarItem';

type ToolbarItemOwnProps = Polymorphic.OwnProps<typeof Primitive>;
type ToolbarItemPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof Primitive>,
  ToolbarItemOwnProps
>;

const ToolbarItem = React.forwardRef((props, forwardedRef) => {
  const { disabled, ...itemProps } = props as any;

  const rovingFocusProps = useRovingFocus({
    disabled: disabled,
    active: false,
  });

  const handleClick = (event: MouseEvent) => {
    if (disabled) {
      event.preventDefault();
    }
  };

  return (
    <Primitive
      ref={forwardedRef}
      {...itemProps}
      {...rovingFocusProps}
      role="toolbaritem"
      selector={getSelector(ITEM_NAME)}
      aria-disabled={disabled}
      data-disabled={disabled}
      onClick={handleClick}
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
const Label = ToolbarLabel;
const Separator = ToolbarSeparator;
const Item = ToolbarItem;

export {
  Toolbar,
  ToolbarGroup,
  ToolbarLabel,
  ToolbarSeparator,
  ToolbarItem,
  //
  Root,
  Group,
  Label,
  Item,
  Separator,
};
