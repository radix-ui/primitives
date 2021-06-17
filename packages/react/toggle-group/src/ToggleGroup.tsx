import React from 'react';
import { createContext } from '@radix-ui/react-context';
import { Primitive } from '@radix-ui/react-primitive';
import { RovingFocusGroup, RovingFocusItem } from '@radix-ui/react-roving-focus';
import { Slot } from '@radix-ui/react-slot';
import { Toggle } from '@radix-ui/react-toggle';
import { useControllableState } from '@radix-ui/react-use-controllable-state';

import type * as Polymorphic from '@radix-ui/react-polymorphic';

/* -------------------------------------------------------------------------------------------------
 * ToggleGroup
 * -----------------------------------------------------------------------------------------------*/

const TOGGLE_GROUP_NAME = 'ToggleGroup';
const TOGGLE_GROUP_DEFAULT_TAG = 'div';

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
      onItemDeactivate={React.useCallback(() => setValue(''), [setValue])}
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
  Omit<
    Polymorphic.OwnProps<typeof RovingFocusGroup>,
    'currentTabStopId' | 'defaultCurrentTabStopId' | 'onCurrentTabStopIdChange' | 'onEntryFocus'
  >,
  {
    /**
     * Whether the group is disabled from user interaction.
     * @defaultValue false
     */
    disabled?: boolean;
    /**
     * Whether the group should maintain roving focus of its buttons.
     * @defaultValue true
     */
    rovingFocus?: boolean;
  }
>;

type ToggleGroupImplPrimitive = Polymorphic.ForwardRefComponent<
  typeof TOGGLE_GROUP_DEFAULT_TAG,
  ToggleGroupImplOwnProps
>;

const ToggleGroupImpl = React.forwardRef((props, forwardedRef) => {
  const {
    as = TOGGLE_GROUP_DEFAULT_TAG,
    disabled = false,
    rovingFocus = true,
    orientation,
    dir = 'ltr',
    loop = true,
    ...toggleGroupProps
  } = props;
  return (
    <ToggleGroupContext rovingFocus={rovingFocus} disabled={disabled}>
      {rovingFocus ? (
        <RovingFocusGroup
          role="group"
          orientation={orientation}
          dir={dir}
          loop={loop}
          {...toggleGroupProps}
          as={as}
          ref={forwardedRef}
        />
      ) : (
        <Primitive role="group" {...toggleGroupProps} as={as} ref={forwardedRef} />
      )}
    </ToggleGroupContext>
  );
}) as ToggleGroupImplPrimitive;

/* -------------------------------------------------------------------------------------------------
 * ToggleGroupItem
 * -----------------------------------------------------------------------------------------------*/

const ITEM_NAME = 'ToggleGroupItem';

type ToggleGroupItemOwnProps = Omit<
  | Polymorphic.OwnProps<typeof ToggleGroupRovingFocusItem>
  | Polymorphic.OwnProps<typeof ToggleGroupItemImpl>,
  'pressed'
>;

type ToggleGroupItemPrimitive = Polymorphic.ForwardRefComponent<
  | Polymorphic.IntrinsicElement<typeof ToggleGroupRovingFocusItem>
  | Polymorphic.IntrinsicElement<typeof ToggleGroupItemImpl>,
  ToggleGroupItemOwnProps
>;

const ToggleGroupItem = React.forwardRef((props, forwardedRef) => {
  const valueContext = useToggleGroupValueContext(ITEM_NAME);
  const context = useToggleGroupContext(ITEM_NAME);
  const pressed = valueContext.value.includes(props.value);
  const disabled = context.disabled || props.disabled;

  return context.rovingFocus ? (
    <ToggleGroupRovingFocusItem
      {...props}
      ref={forwardedRef}
      pressed={pressed}
      disabled={disabled}
    />
  ) : (
    <ToggleGroupItemImpl {...props} ref={forwardedRef} pressed={pressed} disabled={disabled} />
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
  return (
    <RovingFocusItem as={Slot} focusable={!props.disabled} active={props.pressed}>
      <ToggleGroupItemImpl {...props} ref={forwardedRef} />
    </RovingFocusItem>
  );
}) as ToggleGroupRovingFocusItemPrimitive;

/* -----------------------------------------------------------------------------------------------*/

type ToggleGroupItemImplOwnProps = Polymorphic.Merge<
  Omit<Polymorphic.OwnProps<typeof Toggle>, 'defaultPressed' | 'onPressedChange'>,
  {
    /**
     * A string value for the toggle group item. All items within a toggle group should use a unique value.
     */
    value: string;
  }
>;

type ToggleGroupItemImplPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof Toggle>,
  ToggleGroupItemImplOwnProps
>;

const ToggleGroupItemImpl = React.forwardRef((props, forwardedRef) => {
  const { value, ...itemProps } = props;
  const valueContext = useToggleGroupValueContext(ITEM_NAME);

  return (
    <Toggle
      {...itemProps}
      ref={forwardedRef}
      onPressedChange={(pressed) => {
        if (pressed) {
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
export type { ToggleGroupPrimitive, ToggleGroupItemPrimitive };
