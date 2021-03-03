import * as React from 'react';
import { composeEventHandlers } from '@radix-ui/primitive';
import { createContext } from '@radix-ui/react-context';
import { useCallbackRef } from '@radix-ui/react-use-callback-ref';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { useComposedRefs } from '@radix-ui/react-utils';
import { Primitive, extendPrimitive } from '@radix-ui/react-primitive';
import { Radio, RadioIndicator } from './Radio';
import { useLabelContext } from '@radix-ui/react-label';
import { RovingFocusGroup, useRovingFocus } from '@radix-ui/react-roving-focus';

import type * as Polymorphic from '@radix-ui/react-polymorphic';

/* -------------------------------------------------------------------------------------------------
 * RadioGroup
 * -----------------------------------------------------------------------------------------------*/
const RADIO_GROUP_NAME = 'RadioGroup';

type RadioGroupOwnProps = Polymorphic.Merge<
  Polymorphic.OwnProps<typeof Primitive>,
  {
    name?: string;
    value?: string;
    defaultValue?: string;
    required?: React.ComponentProps<typeof Radio>['required'];
    rovingFocus?: boolean;
    onValueChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  }
>;

type RadioGroupPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof Primitive>,
  RadioGroupOwnProps
>;

type RadioGroupContextValue = {
  name: RadioGroupOwnProps['name'];
  value: RadioGroupOwnProps['value'];
  required: RadioGroupOwnProps['required'];
  rovingFocus: RadioGroupOwnProps['rovingFocus'];
  onValueChange: Required<RadioGroupOwnProps>['onValueChange'];
};

const [RadioGroupProvider, useRadioGroupContext] = createContext<RadioGroupContextValue>(
  RADIO_GROUP_NAME
);

const RadioGroup = React.forwardRef((props, forwardedRef) => {
  const {
    name,
    'aria-labelledby': ariaLabelledby,
    defaultValue,
    value: valueProp,
    required,
    rovingFocus = true,
    onValueChange,
    ...groupProps
  } = props;
  const labelId = useLabelContext();
  const labelledBy = ariaLabelledby || labelId;
  const handleValueChange = useCallbackRef(onValueChange);
  const [value, setValue] = useControllableState({
    prop: valueProp,
    defaultProp: defaultValue,
  });

  const primitive = (
    <Primitive {...groupProps} ref={forwardedRef} role="radiogroup" aria-labelledby={labelledBy} />
  );

  return (
    <RadioGroupProvider
      name={name}
      value={value}
      required={required}
      rovingFocus={rovingFocus}
      onValueChange={React.useCallback(
        composeEventHandlers(handleValueChange, (event) => setValue(event.target.value)),
        [handleValueChange]
      )}
    >
      {rovingFocus ? <RovingFocusGroup loop>{primitive}</RovingFocusGroup> : primitive}
    </RadioGroupProvider>
  );
}) as RadioGroupPrimitive;

RadioGroup.displayName = RADIO_GROUP_NAME;

/* -------------------------------------------------------------------------------------------------
 * RadioGroupItem
 * -----------------------------------------------------------------------------------------------*/

const ITEM_NAME = 'RadioGroupItem';

type RadioGroupItemOwnProps = Polymorphic.OwnProps<typeof RadioGroupItemImpl>;
type RadioGroupItemPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof RadioGroupItemImpl>,
  RadioGroupItemOwnProps
>;

const RadioGroupItem = React.forwardRef((props, forwardedRef) => {
  const context = useRadioGroupContext(ITEM_NAME);
  return context.rovingFocus ? (
    <RadioGroupRovingFocusItem {...props} ref={forwardedRef} />
  ) : (
    <RadioGroupItemImpl {...props} ref={forwardedRef} />
  );
}) as RadioGroupItemPrimitive;

RadioGroupItem.displayName = ITEM_NAME;

type RadioGroupRovingFocusItemOwnProps = Polymorphic.OwnProps<typeof RadioGroupItemImpl>;
type RadioGroupRovingFocusItemPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof RadioGroupItemImpl>,
  RadioGroupRovingFocusItemOwnProps
>;

const RadioGroupRovingFocusItem = React.forwardRef((props, forwardedRef) => {
  const { disabled, ...itemProps } = props;
  const context = useRadioGroupContext(ITEM_NAME);
  const ref = React.useRef<React.ElementRef<typeof RadioGroupItemImpl>>(null);
  const composedRefs = useComposedRefs(forwardedRef, ref);
  const isChecked = context.value === itemProps.value;
  const rovingFocusProps = useRovingFocus({ disabled, active: isChecked });
  return (
    <RadioGroupItemImpl
      {...itemProps}
      {...rovingFocusProps}
      ref={composedRefs}
      disabled={disabled}
      onKeyDown={composeEventHandlers(itemProps.onKeyDown, rovingFocusProps.onKeyDown)}
      onMouseDown={composeEventHandlers(itemProps.onMouseDown, rovingFocusProps.onMouseDown)}
      onFocus={composeEventHandlers(
        itemProps.onFocus,
        composeEventHandlers(rovingFocusProps.onFocus, () => {
          /**
           * Roving index will focus the radio and we need to check it when this happens.
           * We do this imperatively instead of updating `context.value` because changing via
           * state would not trigger change events (e.g. when in a form).
           */
          if (context.value !== undefined) {
            ref.current?.click();
          }
        })
      )}
    />
  );
}) as RadioGroupRovingFocusItemPrimitive;

type RadioGroupItemImplOwnProps = Polymorphic.Merge<
  Omit<Polymorphic.OwnProps<typeof Radio>, 'name'>,
  { value: string }
>;
type RadioGroupItemImplPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof Radio>,
  RadioGroupItemImplOwnProps
>;

const RadioGroupItemImpl = React.forwardRef((props, forwardedRef) => {
  const { disabled, required, ...itemProps } = props;
  const context = useRadioGroupContext(ITEM_NAME);
  const isChecked = context.value === props.value;
  const handleChange = composeEventHandlers(itemProps.onCheckedChange, context.onValueChange);

  return (
    <Radio
      {...itemProps}
      name={context.name}
      ref={forwardedRef}
      disabled={disabled}
      required={required ?? context.required}
      checked={isChecked}
      onCheckedChange={handleChange}
    />
  );
}) as RadioGroupItemImplPrimitive;

/* -----------------------------------------------------------------------------------------------*/

const RadioGroupIndicator = extendPrimitive(RadioIndicator, 'RadioGroupIndicator');

/* ---------------------------------------------------------------------------------------------- */

const Root = RadioGroup;
const Item = RadioGroupItem;
const Indicator = RadioGroupIndicator;

export {
  RadioGroup,
  RadioGroupItem,
  RadioGroupIndicator,
  //
  Root,
  Item,
  Indicator,
};
