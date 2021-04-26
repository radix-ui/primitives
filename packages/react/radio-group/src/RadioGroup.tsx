import * as React from 'react';
import { composeEventHandlers } from '@radix-ui/primitive';
import { useLabelContext } from '@radix-ui/react-label';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import { createContext } from '@radix-ui/react-context';
import { extendPrimitive } from '@radix-ui/react-primitive';
import { RovingFocusGroup, RovingFocusItem } from '@radix-ui/react-roving-focus';
import { Slot } from '@radix-ui/react-slot';
import { useCallbackRef } from '@radix-ui/react-use-callback-ref';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { Radio, RadioIndicator } from './Radio';

import type * as Polymorphic from '@radix-ui/react-polymorphic';

/* -------------------------------------------------------------------------------------------------
 * RadioGroup
 * -----------------------------------------------------------------------------------------------*/
const RADIO_GROUP_NAME = 'RadioGroup';
const RADIO_GROUP_DEFAULT_TAG = 'div';

type RadioGroupOwnProps = Polymorphic.Merge<
  Omit<
    Polymorphic.OwnProps<typeof RovingFocusGroup>,
    'currentTabStopId' | 'defaultCurrentTabStopId' | 'onCurrentTabStopIdChange' | 'onEntryFocus'
  >,
  {
    name?: string;
    value?: string;
    defaultValue?: string;
    required?: React.ComponentProps<typeof Radio>['required'];
    onValueChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  }
>;

type RadioGroupPrimitive = Polymorphic.ForwardRefComponent<
  typeof RADIO_GROUP_DEFAULT_TAG,
  RadioGroupOwnProps
>;

type RadioGroupContextValue = {
  name: RadioGroupOwnProps['name'];
  value: RadioGroupOwnProps['value'];
  required: RadioGroupOwnProps['required'];
  onValueChange: Required<RadioGroupOwnProps>['onValueChange'];
};

const [RadioGroupProvider, useRadioGroupContext] = createContext<RadioGroupContextValue>(
  RADIO_GROUP_NAME
);

const RadioGroup = React.forwardRef((props, forwardedRef) => {
  const {
    as = RADIO_GROUP_DEFAULT_TAG,
    name,
    'aria-labelledby': ariaLabelledby,
    defaultValue,
    value: valueProp,
    required,
    orientation,
    dir = 'ltr',
    loop = true,
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

  return (
    <RadioGroupProvider
      name={name}
      value={value}
      required={required}
      onValueChange={React.useCallback(
        composeEventHandlers(handleValueChange, (event) => setValue(event.target.value)),
        [handleValueChange]
      )}
    >
      <RovingFocusGroup
        role="radiogroup"
        aria-labelledby={labelledBy}
        orientation={orientation}
        dir={dir}
        loop={loop}
        {...groupProps}
        as={as}
        ref={forwardedRef}
      />
    </RadioGroupProvider>
  );
}) as RadioGroupPrimitive;

RadioGroup.displayName = RADIO_GROUP_NAME;

/* -------------------------------------------------------------------------------------------------
 * RadioGroupItem
 * -----------------------------------------------------------------------------------------------*/

const ITEM_NAME = 'RadioGroupItem';

type RadioGroupItemOwnProps = Polymorphic.Merge<
  Polymorphic.OwnProps<typeof Radio>,
  { value: string; name?: never }
>;
type RadioGroupItemPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof Radio>,
  RadioGroupItemOwnProps
>;

const RadioGroupItem = React.forwardRef((props, forwardedRef) => {
  const { disabled, ...itemProps } = props;
  const context = useRadioGroupContext(ITEM_NAME);
  const ref = React.useRef<React.ElementRef<typeof Radio>>(null);
  const composedRefs = useComposedRefs(forwardedRef, ref);
  const checked = context.value === itemProps.value;

  return (
    <RovingFocusItem as={Slot} focusable={!disabled} active={checked}>
      <Radio
        disabled={disabled}
        required={context.required}
        checked={checked}
        {...itemProps}
        name={context.name}
        ref={composedRefs}
        onCheckedChange={composeEventHandlers(props.onCheckedChange, context.onValueChange)}
        onFocus={composeEventHandlers(itemProps.onFocus, () => {
          /**
           * Roving index will focus the radio and we need to check it when this happens.
           * We do this imperatively instead of updating `context.value` because changing via
           * state would not trigger change events (e.g. when in a form).
           */
          if (context.value !== undefined) {
            ref.current?.click();
          }
        })}
      />
    </RovingFocusItem>
  );
}) as RadioGroupItemPrimitive;

RadioGroupItem.displayName = ITEM_NAME;

/* -----------------------------------------------------------------------------------------------*/

const RadioGroupIndicator = extendPrimitive(RadioIndicator, { displayName: 'RadioGroupIndicator' });

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
