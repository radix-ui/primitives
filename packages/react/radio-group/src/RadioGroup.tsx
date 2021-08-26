import * as React from 'react';
import { composeEventHandlers } from '@radix-ui/primitive';
import { useLabelContext } from '@radix-ui/react-label';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import { createContext } from '@radix-ui/react-context';
import { extendPrimitive, Primitive } from '@radix-ui/react-primitive';
import { RovingFocusGroup, RovingFocusItem } from '@radix-ui/react-roving-focus';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { Radio, RadioIndicator } from './Radio';

import type * as Radix from '@radix-ui/react-primitive';

/* -------------------------------------------------------------------------------------------------
 * RadioGroup
 * -----------------------------------------------------------------------------------------------*/
const RADIO_GROUP_NAME = 'RadioGroup';

type RadioGroupContextValue = {
  name?: string;
  value?: string;
  required: boolean;
  onValueChange(value: string): void;
};

const [RadioGroupProvider, useRadioGroupContext] =
  createContext<RadioGroupContextValue>(RADIO_GROUP_NAME);

type RovingFocusGroupProps = Radix.ComponentPropsWithoutRef<typeof RovingFocusGroup>;
type RadioGroupElement = React.ElementRef<typeof Primitive.div>;
type RadioGroupProps = Radix.MergeProps<
  Radix.ComponentPropsWithoutRef<typeof Primitive.div>,
  {
    name?: RadioGroupContextValue['name'];
    required?: Radix.ComponentPropsWithoutRef<typeof Radio>['required'];
    dir?: RovingFocusGroupProps['dir'];
    orientation?: RovingFocusGroupProps['orientation'];
    loop?: RovingFocusGroupProps['loop'];
    defaultValue?: string;
    value?: RadioGroupContextValue['value'];
    onValueChange?: RadioGroupContextValue['onValueChange'];
  }
>;

const RadioGroup = React.forwardRef<RadioGroupElement, RadioGroupProps>((props, forwardedRef) => {
  const {
    name,
    'aria-labelledby': ariaLabelledby,
    defaultValue,
    value: valueProp,
    required = false,
    orientation,
    dir = 'ltr',
    loop = true,
    onValueChange,
    ...groupProps
  } = props;
  const labelId = useLabelContext();
  const labelledBy = ariaLabelledby || labelId;
  const [value, setValue] = useControllableState({
    prop: valueProp,
    defaultProp: defaultValue,
    onChange: onValueChange,
  });

  return (
    <RadioGroupProvider name={name} value={value} required={required} onValueChange={setValue}>
      <RovingFocusGroup asChild orientation={orientation} dir={dir} loop={loop}>
        <Primitive.div
          role="radiogroup"
          aria-labelledby={labelledBy}
          dir={dir}
          {...groupProps}
          ref={forwardedRef}
        />
      </RovingFocusGroup>
    </RadioGroupProvider>
  );
});

RadioGroup.displayName = RADIO_GROUP_NAME;

/* -------------------------------------------------------------------------------------------------
 * RadioGroupItem
 * -----------------------------------------------------------------------------------------------*/

const ITEM_NAME = 'RadioGroupItem';

type RadioGroupItemElement = React.ElementRef<typeof Radio>;
type RadioGroupItemProps = Radix.MergeProps<
  Omit<Radix.ComponentPropsWithoutRef<typeof Radio>, 'onCheck'>,
  { value: string; name?: never }
>;

const RadioGroupItem = React.forwardRef<RadioGroupItemElement, RadioGroupItemProps>(
  (props, forwardedRef) => {
    const { disabled, ...itemProps } = props;
    const context = useRadioGroupContext(ITEM_NAME);
    const ref = React.useRef<React.ElementRef<typeof Radio>>(null);
    const composedRefs = useComposedRefs(forwardedRef, ref);
    const checked = context.value === itemProps.value;
    return (
      <RovingFocusItem asChild focusable={!disabled} active={checked}>
        <Radio
          disabled={disabled}
          required={context.required}
          checked={checked}
          {...itemProps}
          name={context.name}
          ref={composedRefs}
          onCheck={() => context.onValueChange(itemProps.value)}
          onFocus={composeEventHandlers(itemProps.onFocus, () => {
            /**
             * Roving index will focus the radio and we need to check it when this happens.
             * We do this imperatively instead of updating `context.value` because changing via
             * state would not trigger change events (e.g. when in a form).
             */
            if (context.value !== undefined) ref.current?.click();
          })}
        />
      </RovingFocusItem>
    );
  }
);

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
