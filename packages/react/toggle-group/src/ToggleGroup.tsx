import React from 'react';
import { createContext } from '@radix-ui/react-context';
import { composeEventHandlers } from '@radix-ui/primitive';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { RovingFocusGroup, useRovingFocus } from '@radix-ui/react-roving-focus';
import { Primitive } from '@radix-ui/react-primitive';
import { ToggleButton } from '@radix-ui/react-toggle-button';

import type * as Polymorphic from '@radix-ui/react-polymorphic';

/* -------------------------------------------------------------------------------------------------
 * ToggleGroup
 * -----------------------------------------------------------------------------------------------*/

const TOGGLE_GROUP_NAME = 'ToggleGroup';

type ToggleGroupOwnProps =
  | Polymorphic.OwnProps<typeof ToggleGroupSingle>
  | Polymorphic.OwnProps<typeof ToggleGroupMultiple>;

type ToggleGroupPrimitive = Polymorphic.ForwardRefComponent<
  | Polymorphic.IntrinsicElement<typeof ToggleGroupSingle>
  | Polymorphic.IntrinsicElement<typeof ToggleGroupMultiple>,
  ToggleGroupOwnProps
>;

const ToggleGroup = React.forwardRef((props, forwardedRef) => {
  if (props.type === 'single') {
    return <ToggleGroupSingle {...props} ref={forwardedRef} />;
  }

  if (props.type === 'multiple') {
    return <ToggleGroupMultiple {...props} ref={forwardedRef} />;
  }

  throw new Error(`Missing prop \`type\` expected on \`${TOGGLE_GROUP_NAME}\``);
}) as ToggleGroupPrimitive;

ToggleGroup.displayName = TOGGLE_GROUP_NAME;

/* -----------------------------------------------------------------------------------------------*/

type ToggleGroupValueContextValue = {
  value: string[];
  onItemActivate(value: string): void;
  onItemDeactivate(value: string): void;
};

const [
  ToggleGroupValueProvider,
  useToggleGroupValueContext,
] = createContext<ToggleGroupValueContextValue>(TOGGLE_GROUP_NAME);

type ToggleGroupSingleOwnProps = Polymorphic.Merge<
  Polymorphic.OwnProps<typeof ToggleGroupImpl>,
  {
    /**
     * Allow only one button to be pressed at a time.
     */
    type: 'single';
    /**
     * The controlled stateful value of the item that is pressed.
     */
    value?: string;
    /**
     * The value of the item that is pressed when initially rendered. Use
     * `defaultValue` if you do not need to control the state of a toggle group.
     */
    defaultValue?: string;
    /**
     * The callback that fires when the value of the toggle group changes.
     */
    onValueChange?(value: string): void;
  }
>;

type ToggleGroupSinglePrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof ToggleGroupImpl>,
  ToggleGroupSingleOwnProps
>;

const ToggleGroupSingle = React.forwardRef((props, forwardedRef) => {
  const {
    value: valueProp,
    defaultValue,
    onValueChange = () => {},
    ...toggleGroupSingleProps
  } = props;

  const [value, setValue] = useControllableState({
    prop: valueProp,
    defaultProp: defaultValue,
    onChange: onValueChange,
  });

  return (
    <ToggleGroupValueProvider
      value={value ? [value] : []}
      onItemActivate={setValue}
      onItemDeactivate={() => setValue(undefined)}
    >
      <ToggleGroupImpl {...toggleGroupSingleProps} ref={forwardedRef} />
    </ToggleGroupValueProvider>
  );
}) as ToggleGroupSinglePrimitive;

type ToggleGroupMultipleOwnProps = Polymorphic.Merge<
  Polymorphic.OwnProps<typeof ToggleGroupImpl>,
  {
    /**
     * Allow mutltiple items to be pressed at the same time.
     */
    type: 'multiple';
    /**
     * The controlled stateful value of the items that are pressed.
     */
    value?: string[];
    /**
     * The value of the items that are pressed when initially rendered. Use
     * `defaultValue` if you do not need to control the state of a toggle group.
     */
    defaultValue?: string[];
    /**
     * The callback that fires when the state of the toggle group changes.
     */
    onValueChange?(value: string[]): void;
  }
>;

type ToggleGroupMultiplePrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof ToggleGroupImpl>,
  ToggleGroupMultipleOwnProps
>;

const ToggleGroupMultiple = React.forwardRef((props, forwardedRef) => {
  const {
    value: valueProp,
    defaultValue,
    onValueChange = () => {},
    ...toggleGroupMultipleProps
  } = props;

  const [value = [], setValue] = useControllableState({
    prop: valueProp,
    defaultProp: defaultValue,
    onChange: onValueChange,
  });

  const handleButtonActivate = React.useCallback(
    (itemValue) => setValue((prevValue = []) => [...prevValue, itemValue]),
    [setValue]
  );

  const handleButtonDeactivate = React.useCallback(
    (itemValue) => setValue((prevValue = []) => prevValue.filter((value) => value !== itemValue)),
    [setValue]
  );

  return (
    <ToggleGroupValueProvider
      value={value}
      onItemActivate={handleButtonActivate}
      onItemDeactivate={handleButtonDeactivate}
    >
      <ToggleGroupImpl {...toggleGroupMultipleProps} ref={forwardedRef} />
    </ToggleGroupValueProvider>
  );
}) as ToggleGroupMultiplePrimitive;

ToggleGroup.displayName = TOGGLE_GROUP_NAME;

/* -----------------------------------------------------------------------------------------------*/

type ToggleGroupContextValue = { rovingFocus: boolean; disabled: boolean };

const [ToggleGroupContext, useToggleGroupContext] = createContext<ToggleGroupContextValue>(
  TOGGLE_GROUP_NAME
);

type ToggleGroupImplOwnProps = Polymorphic.Merge<
  Polymorphic.OwnProps<typeof Primitive>,
  {
    /**
     * Whether the group is disabled from user interaction.
     *
     * @defaultValue false
     */
    disabled?: boolean;
    /**
     * Whether the group should maintain roving focus of its buttons.
     *
     * @defaultValue true
     */
    rovingFocus?: boolean;
  }
>;

type ToggleGroupImplPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof Primitive>,
  ToggleGroupImplOwnProps
>;

const ToggleGroupImpl = React.forwardRef((props, forwardedRef) => {
  const { disabled = false, rovingFocus = true, ...toggleGroupProps } = props;
  const primitive = <Primitive role="group" {...toggleGroupProps} ref={forwardedRef} />;
  return (
    <ToggleGroupContext rovingFocus={rovingFocus} disabled={disabled}>
      {rovingFocus ? <RovingFocusGroup loop>{primitive}</RovingFocusGroup> : primitive}
    </ToggleGroupContext>
  );
}) as ToggleGroupImplPrimitive;

/* -------------------------------------------------------------------------------------------------
 * ToggleGroupItem
 * -----------------------------------------------------------------------------------------------*/

const ITEM_NAME = 'ToggleGroupItem';

type ToggleGroupItemOwnProps =
  | Polymorphic.OwnProps<typeof ToggleGroupRovingFocusItem>
  | Polymorphic.OwnProps<typeof ToggleGroupItemImpl>;

type ToggleGroupItemPrimitive = Polymorphic.ForwardRefComponent<
  | Polymorphic.IntrinsicElement<typeof ToggleGroupRovingFocusItem>
  | Polymorphic.IntrinsicElement<typeof ToggleGroupItemImpl>,
  ToggleGroupItemOwnProps
>;

const ToggleGroupItem = React.forwardRef((props, forwardedRef) => {
  const context = useToggleGroupContext(ITEM_NAME);
  return context.rovingFocus ? (
    <ToggleGroupRovingFocusItem {...props} ref={forwardedRef} />
  ) : (
    <ToggleGroupItemImpl {...props} ref={forwardedRef} />
  );
}) as ToggleGroupItemPrimitive;

ToggleGroupItem.displayName = ITEM_NAME;

/* -----------------------------------------------------------------------------------------------*/

type ToggleGroupRovingFocusItemOwnProps = Polymorphic.OwnProps<typeof ToggleGroupItemImpl>;

type ToggleGroupRovingFocusItemPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof ToggleGroupItemImpl>,
  ToggleGroupRovingFocusItemOwnProps
>;

const ToggleGroupRovingFocusItem = React.forwardRef((props, forwardedRef) => {
  const valueContext = useToggleGroupValueContext(ITEM_NAME);
  const context = useToggleGroupContext(ITEM_NAME);
  const rovingFocusProps = useRovingFocus({
    disabled: context.disabled || props.disabled,
    active: valueContext.value.includes(props.value),
  });
  return (
    <ToggleGroupItemImpl
      {...props}
      {...rovingFocusProps}
      ref={forwardedRef}
      onFocus={composeEventHandlers(props.onFocus, rovingFocusProps.onFocus)}
      onKeyDown={composeEventHandlers(props.onKeyDown, rovingFocusProps.onKeyDown)}
      onMouseDown={composeEventHandlers(props.onMouseDown, rovingFocusProps.onMouseDown)}
    />
  );
}) as ToggleGroupRovingFocusItemPrimitive;

/* -----------------------------------------------------------------------------------------------*/

type ToggleGroupItemImplOwnProps = Polymorphic.Merge<
  Omit<Polymorphic.OwnProps<typeof ToggleButton>, 'onToggledChange' | 'toggled' | 'defaultToggled'>,
  {
    /**
     * A string value for the toggle group item. All items within a toggle group should use a unique value.
     */
    value: string;
  }
>;

type ToggleGroupItemImplPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof ToggleButton>,
  ToggleGroupItemImplOwnProps
>;

const ToggleGroupItemImpl = React.forwardRef((props, forwardedRef) => {
  const { value, ...itemProps } = props;
  const context = useToggleGroupContext(ITEM_NAME);
  const valueContext = useToggleGroupValueContext(ITEM_NAME);
  const toggled = valueContext.value.includes(props.value);
  const disabled = context.disabled ? true : props.disabled;

  return (
    <ToggleButton
      {...itemProps}
      ref={forwardedRef}
      disabled={disabled}
      toggled={toggled}
      onToggledChange={(toggled) => {
        if (toggled) {
          valueContext.onItemActivate(value);
        } else {
          valueContext.onItemDeactivate(value);
        }
      }}
    />
  );
}) as ToggleGroupItemImplPrimitive;

/* -----------------------------------------------------------------------------------------------*/

const Root = ToggleGroup;
const Item = ToggleGroupItem;

export {
  ToggleGroup,
  ToggleGroupItem,
  //
  Root,
  Item,
};
