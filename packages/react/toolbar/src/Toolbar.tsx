import * as React from 'react';
import { composeEventHandlers } from '@radix-ui/primitive';
import { createContext } from '@radix-ui/react-context';
import { RovingFocusGroup, useRovingFocus } from '@radix-ui/react-roving-focus';
import { Primitive } from '@radix-ui/react-primitive';
import { Slot } from '@radix-ui/react-slot';
import * as SeparatorPrimitive from '@radix-ui/react-separator';
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';

import type * as Polymorphic from '@radix-ui/react-polymorphic';

/* -------------------------------------------------------------------------------------------------
 * Toolbar
 * -----------------------------------------------------------------------------------------------*/

const TOOLBAR_NAME = 'Toolbar';

type Orientation = React.AriaAttributes['aria-orientation'];
type RovingFocusGroupProps = React.ComponentProps<typeof RovingFocusGroup>;

type ToolbarOwnProps = Polymorphic.Merge<
  Polymorphic.OwnProps<typeof Primitive>,
  {
    /**
     * The orientation of the toolbar.
     * Mainly so arrow navigation is done accordingly (left & right vs. up & down)
     *
     * @defaultValue horizontal
     */
    orientation?: RovingFocusGroupProps['orientation'];
    /**
     * The direction of navigation between toolbar items.
     *
     * @defaultValue ltr
     */
    dir?: RovingFocusGroupProps['dir'];
    /**
     * Whether keyboard navigation should loop focus
     *
     * @defaultValue true
     */
    loop?: RovingFocusGroupProps['loop'];
  }
>;

type ToolbarPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof Primitive>,
  ToolbarOwnProps
>;

type ToolbarContextValue = { orientation: Orientation };
const [ToolbarProvider, useToolbarContext] = createContext<ToolbarContextValue>(TOOLBAR_NAME);

const Toolbar = React.forwardRef((props, forwardedRef) => {
  const { orientation = 'horizontal', dir = 'ltr', loop = true, ...toolbarProps } = props;

  return (
    <ToolbarProvider orientation={orientation}>
      <RovingFocusGroup orientation={orientation} dir={dir} loop={loop}>
        <Primitive
          role="toolbar"
          aria-orientation={orientation}
          data-orientation={orientation}
          {...toolbarProps}
          ref={forwardedRef}
        />
      </RovingFocusGroup>
    </ToolbarProvider>
  );
}) as ToolbarPrimitive;

/* -------------------------------------------------------------------------------------------------
 * ToolbarSeparator
 * -----------------------------------------------------------------------------------------------*/

const SEPARATOR_NAME = 'ToolbarSeparator';

type ToolbarSeparatorOwnProps = Polymorphic.OwnProps<typeof SeparatorPrimitive.Root>;
type ToolbarSeparatorPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof SeparatorPrimitive.Root>,
  ToolbarSeparatorOwnProps
>;

const ToolbarSeparator = React.forwardRef((props, forwardedRef) => {
  const context = useToolbarContext(SEPARATOR_NAME);

  return (
    <SeparatorPrimitive.Root
      orientation={context.orientation === 'horizontal' ? 'vertical' : 'horizontal'}
      {...props}
      ref={forwardedRef}
    />
  );
}) as ToolbarSeparatorPrimitive;

ToolbarSeparator.displayName = SEPARATOR_NAME;

/* -------------------------------------------------------------------------------------------------
 * ToolbarButton
 * -----------------------------------------------------------------------------------------------*/

const BUTTON_NAME = 'ToolbarButton';
const BUTTON_DEFAULT_TAG = 'button';

type ToolbarButtonOwnProps = Polymorphic.Merge<Polymorphic.OwnProps<typeof Primitive>>;
type ToolbarButtonPrimitive = Polymorphic.ForwardRefComponent<
  typeof BUTTON_DEFAULT_TAG,
  ToolbarButtonOwnProps
>;

const ToolbarButton = React.forwardRef((props, forwardedRef) => {
  const { as = BUTTON_DEFAULT_TAG, disabled, ...buttonProps } = props;

  const rovingFocusProps = useRovingFocus({
    disabled,
    active: false,
  });

  return (
    <Primitive
      role="toolbaritem"
      disabled={disabled}
      {...buttonProps}
      as={as}
      ref={forwardedRef}
      {...rovingFocusProps}
      onFocus={composeEventHandlers(buttonProps.onFocus, rovingFocusProps.onFocus)}
      onKeyDown={composeEventHandlers(buttonProps.onKeyDown, rovingFocusProps.onKeyDown)}
      onMouseDown={composeEventHandlers(buttonProps.onMouseDown, rovingFocusProps.onMouseDown)}
    />
  );
}) as ToolbarButtonPrimitive;

ToolbarButton.displayName = BUTTON_NAME;

/* -------------------------------------------------------------------------------------------------
 * ToolbarLink
 * -----------------------------------------------------------------------------------------------*/

const LINK_NAME = 'ToolbarLink';
const LINK_DEFAULT_TAG = 'a';

type ToolbarLinkOwnProps = Polymorphic.OwnProps<typeof ToolbarButton>;
type ToolbarLinkPrimitive = Polymorphic.ForwardRefComponent<
  typeof LINK_DEFAULT_TAG,
  ToolbarLinkOwnProps
>;

const ToolbarLink = React.forwardRef((props, forwardedRef) => {
  const { as = LINK_DEFAULT_TAG, ...linkProps } = props;
  return (
    <ToolbarButton
      {...linkProps}
      as={as}
      ref={forwardedRef}
      onKeyDown={composeEventHandlers(linkProps.onKeyDown, (event) => {
        if (event.key === ' ') {
          event.currentTarget.click();
        }
      })}
    />
  );
}) as ToolbarLinkPrimitive;

ToolbarLink.displayName = LINK_NAME;

/* -------------------------------------------------------------------------------------------------
 * ToolbarToggleGroup
 * -----------------------------------------------------------------------------------------------*/

const TOGGLE_GROUP_NAME = 'ToolbarToggleGroup';

type ToolbarToggleGroupOwnProps = Polymorphic.OwnProps<typeof ToggleGroupPrimitive.Root>;
type ToolbarToggleGroupPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof ToggleGroupPrimitive.Root>,
  ToolbarToggleGroupOwnProps
>;

const ToolbarToggleGroup = React.forwardRef((props, forwardedRef) => {
  const context = useToolbarContext(TOGGLE_GROUP_NAME);
  return (
    <ToggleGroupPrimitive.Root
      data-orientation={context.orientation}
      {...props}
      ref={forwardedRef}
      rovingFocus={false}
    />
  );
}) as ToolbarToggleGroupPrimitive;

ToolbarToggleGroup.displayName = TOGGLE_GROUP_NAME;

/* -------------------------------------------------------------------------------------------------
 * ToolbarToggleItem
 * -----------------------------------------------------------------------------------------------*/

const TOGGLE_ITEM_NAME = 'ToolbarToggleItem';

type ToolbarRadioOwnProps = Polymorphic.Merge<
  Polymorphic.OwnProps<typeof ToolbarButton>,
  Polymorphic.OwnProps<typeof ToggleGroupPrimitive.Item>
>;
type ToolbarRadioPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof ToggleGroupPrimitive.Item>,
  ToolbarRadioOwnProps
>;

const ToolbarToggleItem = React.forwardRef((props, forwardedRef) => (
  <ToolbarButton as={Slot}>
    <ToggleGroupPrimitive.Item {...props} ref={forwardedRef} />
  </ToolbarButton>
)) as ToolbarRadioPrimitive;

ToolbarToggleItem.displayName = TOGGLE_ITEM_NAME;

/* ---------------------------------------------------------------------------------------------- */

const Root = Toolbar;
const Separator = ToolbarSeparator;
const Button = ToolbarButton;
const Link = ToolbarLink;
const ToggleGroup = ToolbarToggleGroup;
const ToggleItem = ToolbarToggleItem;

export {
  Toolbar,
  ToolbarSeparator,
  ToolbarButton,
  ToolbarLink,
  ToolbarToggleGroup,
  ToolbarToggleItem,
  //
  Root,
  Separator,
  Button,
  Link,
  ToggleGroup,
  ToggleItem,
};
