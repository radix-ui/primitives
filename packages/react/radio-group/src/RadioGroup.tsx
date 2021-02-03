import * as React from 'react';
import {
  composeEventHandlers,
  createContext,
  useCallbackRef,
  useControlledState,
  useComposedRefs,
  extendComponent,
} from '@radix-ui/react-utils';
import { Primitive } from '@radix-ui/react-primitive';
import { Radio, RadioIndicator } from './Radio';
import { useLabelContext } from '@radix-ui/react-label';
import { getSelector } from '@radix-ui/utils';
import { RovingFocusGroup, useRovingFocus } from '@radix-ui/react-roving-focus';

import type * as Polymorphic from '@radix-ui/react-polymorphic';
import type { Merge } from '@radix-ui/utils';

/* -------------------------------------------------------------------------------------------------
 * RadioGroup
 * -----------------------------------------------------------------------------------------------*/
const RADIO_GROUP_NAME = 'RadioGroup';

type RadioGroupOwnProps = Merge<
  Polymorphic.OwnProps<typeof Primitive>,
  {
    name?: string;
    value?: string;
    defaultValue?: string;
    required?: React.ComponentProps<typeof Radio>['required'];
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
  required?: RadioGroupOwnProps['required'];
  onValueChange: Required<RadioGroupOwnProps>['onValueChange'];
};

const [RadioGroupContext, useRadioGroupContext] = createContext<RadioGroupContextValue>(
  'RadioGroupContext',
  RADIO_GROUP_NAME
);

const RadioGroup = React.forwardRef((props, forwardedRef) => {
  const {
    name,
    selector = getSelector(RADIO_GROUP_NAME),
    'aria-labelledby': ariaLabelledby,
    defaultValue,
    value: valueProp,
    required,
    onValueChange,
    ...groupProps
  } = props;
  const labelId = useLabelContext();
  const labelledBy = ariaLabelledby || labelId;
  const handleValueChange = useCallbackRef(onValueChange);
  const [value, setValue] = useControlledState({
    prop: valueProp,
    defaultProp: defaultValue,
  });

  const context = React.useMemo(
    () => ({
      name,
      value,
      required,
      onValueChange: composeEventHandlers(handleValueChange, (event) => {
        setValue(event.target.value);
      }),
    }),
    [name, value, required, handleValueChange, setValue]
  );

  return (
    <RadioGroupContext.Provider value={context}>
      <RovingFocusGroup loop>
        <Primitive
          {...groupProps}
          selector={selector}
          ref={forwardedRef}
          role="radiogroup"
          aria-labelledby={labelledBy}
        />
      </RovingFocusGroup>
    </RadioGroupContext.Provider>
  );
}) as RadioGroupPrimitive;

RadioGroup.displayName = RADIO_GROUP_NAME;

/* -------------------------------------------------------------------------------------------------
 * RadioGroupItem
 * -----------------------------------------------------------------------------------------------*/

const ITEM_NAME = 'RadioGroupItem';

type RadioGroupItemOwnProps = Merge<
  Omit<Polymorphic.OwnProps<typeof Radio>, 'name'>,
  { value: string }
>;
type RadioGroupItemPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof Radio>,
  RadioGroupItemOwnProps
>;

const RadioGroupItem = React.forwardRef((props, forwardedRef) => {
  const { selector = getSelector(ITEM_NAME), disabled, required, ...itemProps } = props;
  const context = useRadioGroupContext(ITEM_NAME);
  const radioRef = React.useRef<React.ElementRef<typeof Radio>>(null);
  const ref = useComposedRefs(forwardedRef, radioRef);
  const isChecked = context.value === props.value;
  const rovingFocusProps = useRovingFocus({ disabled, active: isChecked });
  const handleChange = composeEventHandlers(itemProps.onCheckedChange, context.onValueChange);
  const handleKeyDown = composeEventHandlers(itemProps.onKeyDown, rovingFocusProps.onKeyDown);
  const handleMouseDown = composeEventHandlers(itemProps.onMouseDown, rovingFocusProps.onMouseDown);
  const handleFocus = composeEventHandlers(
    itemProps.onFocus,
    composeEventHandlers(rovingFocusProps.onFocus, () => {
      /**
       * Roving index will focus the radio and we need to check it when this happens.
       * We do this imperatively instead of updating `context.value` because changing via
       * state would not trigger change events (e.g. when in a form).
       */
      if (context.value !== undefined) {
        radioRef.current?.click();
      }
    })
  );

  return (
    <Radio
      {...itemProps}
      {...rovingFocusProps}
      name={context.name}
      selector={selector}
      ref={ref}
      disabled={disabled}
      data-disabled={disabled ? '' : undefined}
      required={required ?? context.required}
      checked={isChecked}
      onCheckedChange={handleChange}
      onKeyDown={handleKeyDown}
      onMouseDown={handleMouseDown}
      onFocus={handleFocus}
    />
  );
}) as RadioGroupItemPrimitive;

RadioGroupItem.displayName = ITEM_NAME;

/* -----------------------------------------------------------------------------------------------*/

const RadioGroupIndicator = extendComponent(RadioIndicator, 'RadioGroupIndicator');

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
