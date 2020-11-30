import * as React from 'react';
import {
  composeEventHandlers,
  createContext,
  forwardRef,
  useCallbackRef,
  useControlledState,
  useComposedRefs,
} from '@interop-ui/react-utils';
import { Radio } from './Radio';
import { useLabelContext } from '@interop-ui/react-label';

import type { RadioProps } from './Radio';
import { getPartDataAttrObj } from '@interop-ui/utils';
import { RovingFocusGroup, useRovingFocus } from '@interop-ui/react-roving-focus';

/* -------------------------------------------------------------------------------------------------
 * RadioGroup
 * -----------------------------------------------------------------------------------------------*/
const RADIO_GROUP_NAME = 'RadioGroup';
const RADIO_GROUP_DEFAULT_TAG = 'div';

type RadioGroupDOMProps = React.ComponentPropsWithoutRef<typeof RADIO_GROUP_DEFAULT_TAG>;
type RadioGroupOwnProps = {
  value?: string;
  defaultValue?: string;
  required?: RadioProps['required'];
  onValueChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};
type RadioGroupProps = Omit<RadioGroupDOMProps, 'onChange'> & RadioGroupOwnProps;

type RadioGroupContextValue = {
  value: RadioGroupOwnProps['value'];
  required?: RadioGroupOwnProps['required'];
  onValueChange: Required<RadioGroupOwnProps>['onValueChange'];
};

const [RadioGroupContext, useRadioGroupContext] = createContext<RadioGroupContextValue>(
  'RadioGroupContext',
  RADIO_GROUP_NAME
);

const RadioGroup = forwardRef<
  typeof RADIO_GROUP_DEFAULT_TAG,
  RadioGroupProps,
  RadioGroupStaticProps
>(function RagioGroup(props, forwardedRef) {
  const {
    as: Comp = RADIO_GROUP_DEFAULT_TAG,
    'aria-labelledby': ariaLabelledby,
    defaultValue,
    children,
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
      value,
      required,
      onValueChange: composeEventHandlers(handleValueChange, (event) => {
        setValue(event.target.value);
      }),
    }),
    [value, required, handleValueChange, setValue]
  );

  return (
    <Comp
      {...groupProps}
      {...getPartDataAttrObj(RADIO_GROUP_NAME)}
      ref={forwardedRef}
      role="radiogroup"
      aria-labelledby={labelledBy}
    >
      <RadioGroupContext.Provider value={context}>
        <RovingFocusGroup loop>{children}</RovingFocusGroup>
      </RadioGroupContext.Provider>
    </Comp>
  );
});

/* -------------------------------------------------------------------------------------------------
 * RadioGroupItem
 * -----------------------------------------------------------------------------------------------*/

const ITEM_NAME = 'RadioGroup.Item';
const ITEM_DEFAULT_TAG = 'button';

type RadioGroupItemProps = Omit<RadioProps, 'value' | 'as'> & { value: string };

const RadioGroupItem = forwardRef<typeof ITEM_DEFAULT_TAG, RadioGroupItemProps>(
  function RadioGroupItem(props, forwardedRef) {
    const { as, disabled, required, ...itemProps } = props;
    const context = useRadioGroupContext(ITEM_NAME);
    const radioRef = React.useRef<React.ElementRef<typeof Radio>>(null);
    const ref = useComposedRefs(forwardedRef, radioRef);
    const isChecked = context.value === props.value;
    const rovingFocusProps = useRovingFocus({ disabled, active: isChecked });

    const handleChange = composeEventHandlers(itemProps.onCheckedChange, context.onValueChange);
    const handleKeyDown = composeEventHandlers(itemProps.onKeyDown, rovingFocusProps.onKeyDown);
    const handleMouseDown = composeEventHandlers(
      itemProps.onMouseDown,
      rovingFocusProps.onMouseDown
    );
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
        as={as}
        {...getPartDataAttrObj(ITEM_NAME)}
        {...itemProps}
        {...rovingFocusProps}
        disabled={disabled}
        data-disabled={disabled ? '' : undefined}
        required={required ?? context.required}
        checked={isChecked}
        ref={ref}
        onCheckedChange={handleChange}
        onKeyDown={handleKeyDown}
        onMouseDown={handleMouseDown}
        onFocus={handleFocus}
      />
    );
  }
);

/* ---------------------------------------------------------------------------------------------- */

RadioGroup.Item = RadioGroupItem;
RadioGroup.Indicator = Radio.Indicator;

RadioGroup.displayName = RADIO_GROUP_NAME;
RadioGroup.Item.displayName = ITEM_NAME;
RadioGroup.Indicator.displayName = 'RadioGroup.Indicator';

interface RadioGroupStaticProps {
  Item: typeof RadioGroupItem;
  Indicator: typeof Radio.Indicator;
}

export { RadioGroup };
export type { RadioGroupProps, RadioGroupItemProps };
