import * as React from 'react';
import { RovingFocusGroup, useRovingFocus } from '@radix-ui/react-roving-focus';
import { Primitive } from '@radix-ui/react-primitive';
import { Slot } from '@radix-ui/react-slot';
import { getSelector } from '@radix-ui/utils';
import { createContextObj, composeEventHandlers } from '@radix-ui/react-utils';
import type * as Polymorphic from '@radix-ui/react-polymorphic';
import type { Merge } from '@radix-ui/utils';
import { Separator as SeparatorPrimitive } from '@radix-ui/react-separator';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';

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
const [ToolbarProvider, useToolbarContext] = createContextObj<ToolbarContextValue>(TOOLBAR_NAME);

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
          selector={getSelector(TOOLBAR_NAME)}
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

type ToolbarSeparatorOwnProps = Polymorphic.OwnProps<typeof SeparatorPrimitive>;
type ToolbarSeparatorPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof SeparatorPrimitive>,
  ToolbarSeparatorOwnProps
>;

const ToolbarSeparator = React.forwardRef((props, forwardedRef) => {
  const context = useToolbarContext(SEPARATOR_NAME);

  return (
    <SeparatorPrimitive
      orientation={context.orientation === 'horizontal' ? 'vertical' : 'horizontal'}
      {...props}
      selector={getSelector(SEPARATOR_NAME)}
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

type ToolbarButtonOwnProps = Merge<Polymorphic.OwnProps<typeof Primitive>>;
type ToolbarButtonPrimitive = Polymorphic.ForwardRefComponent<
  typeof BUTTON_DEFAULT_TAG,
  ToolbarButtonOwnProps
>;

const ToolbarButton = React.forwardRef((props, forwardedRef) => {
  const {
    as = BUTTON_DEFAULT_TAG,
    selector = getSelector(BUTTON_NAME),
    disabled,
    ...buttonProps
  } = props;

  const rovingFocusProps = useRovingFocus({
    disabled,
    active: false,
  });

  return (
    <Primitive
      role="toolbaritem"
      {...buttonProps}
      as={as}
      selector={selector}
      ref={forwardedRef}
      disabled={disabled}
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
      selector={getSelector(LINK_NAME)}
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
 * ToolbarRadioGroup
 * -----------------------------------------------------------------------------------------------*/

const RADIO_GROUP_NAME = 'ToolbarRadioGroup';

type ToolbarRadioGroupOwnProps = Polymorphic.OwnProps<typeof RadioGroupPrimitive.Root>;
type ToolbarRadioGroupPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof RadioGroupPrimitive.Root>,
  ToolbarRadioGroupOwnProps
>;

const ToolbarRadioGroup = React.forwardRef((props, forwardedRef) => {
  const context = useToolbarContext(RADIO_GROUP_NAME);
  return (
    <RadioGroupPrimitive.Root
      data-orientation={context.orientation}
      {...props}
      selector={getSelector(RADIO_GROUP_NAME)}
      ref={forwardedRef}
      rovingFocus={false}
    />
  );
}) as ToolbarRadioGroupPrimitive;

ToolbarRadioGroup.displayName = RADIO_GROUP_NAME;

/* -------------------------------------------------------------------------------------------------
 * ToolbarRadioItem
 * -----------------------------------------------------------------------------------------------*/

const RADIO_GROUP_ITEM_NAME = 'ToolbarRadioItem';

type ToolbarRadioOwnProps = Merge<
  Polymorphic.OwnProps<typeof ToolbarButton>,
  Polymorphic.OwnProps<typeof RadioGroupPrimitive.Item>
>;
type ToolbarRadioPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof RadioGroupPrimitive.Item>,
  ToolbarRadioOwnProps
>;

const ToolbarRadioItem = React.forwardRef((props, forwardedRef) => (
  <ToolbarButton as={Slot}>
    <RadioGroupPrimitive.Item
      {...props}
      selector={getSelector(RADIO_GROUP_ITEM_NAME)}
      ref={forwardedRef}
    />
  </ToolbarButton>
)) as ToolbarRadioPrimitive;

ToolbarRadioItem.displayName = RADIO_GROUP_ITEM_NAME;

/* ---------------------------------------------------------------------------------------------- */

const Root = Toolbar;
const Separator = ToolbarSeparator;
const Button = ToolbarButton;
const Link = ToolbarLink;
const RadioGroup = ToolbarRadioGroup;
const RadioItem = ToolbarRadioItem;

export {
  Toolbar,
  ToolbarSeparator,
  ToolbarButton,
  ToolbarLink,
  ToolbarRadioGroup,
  ToolbarRadioItem,
  //
  Root,
  Separator,
  Button,
  Link,
  RadioGroup,
  RadioItem,
};
