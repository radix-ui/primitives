import * as React from 'react';
import {
  composeEventHandlers,
  createContext,
  createStyleObj,
  forwardRef,
  useCallbackRef,
  useControlledState,
} from '@interop-ui/react-utils';
import { Radio, styles as radioStyles } from './Radio';
import { useLabelContext } from '@interop-ui/react-label';

/* -------------------------------------------------------------------------------------------------
 * RadioGroup
 * -----------------------------------------------------------------------------------------------*/
const RADIO_GROUP_NAME = 'RadioGroup';
const RADIO_GROUP_DEFAULT_TAG = 'div';

type RadioGroupDOMProps = React.ComponentPropsWithoutRef<typeof RADIO_GROUP_DEFAULT_TAG>;
type RadioGroupOwnProps = {
  value?: string;
  defaultValue?: string;
  onValueChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};
type RadioGroupProps = Omit<RadioGroupDOMProps, 'onChange'> & RadioGroupOwnProps;

type RadioGroupContextValue = {
  value: RadioGroupOwnProps['value'];
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
    onValueChange: onValueChangeProp = () => {},
    ...groupProps
  } = props;
  const labelId = useLabelContext();
  const labelledBy = ariaLabelledby || labelId;
  const onValueChange = useCallbackRef(onValueChangeProp);
  const [value, setValue] = useControlledState({
    prop: valueProp,
    defaultProp: defaultValue,
  });

  const context = React.useMemo(
    () => ({
      value,
      onValueChange(event: React.ChangeEvent<HTMLInputElement>) {
        setValue(event.target.value);
        onValueChange(event);
      },
    }),
    [value, onValueChange, setValue]
  );

  return (
    <Comp {...groupProps} ref={forwardedRef} role="radiogroup" aria-labelledby={labelledBy}>
      <RadioGroupContext.Provider value={context}>{children}</RadioGroupContext.Provider>
    </Comp>
  );
});

/* -------------------------------------------------------------------------------------------------
 * RadioGroupItem
 * -----------------------------------------------------------------------------------------------*/

const ITEM_NAME = 'RadioGroup.Item';
const ITEM_DEFAULT_TAG = 'button';

type RadioProps = Omit<React.ComponentProps<typeof Radio>, 'value' | 'as'>;
type RadioGroupItemProps = RadioProps & { value: string };

const RadioGroupItem = forwardRef<typeof ITEM_DEFAULT_TAG, RadioGroupItemProps>(
  function RadioGroupItem(props, forwardedRef) {
    const { as, ...itemProps } = props;
    const context = useRadioGroupContext(ITEM_NAME);
    const isChecked = context.value === props.value;
    const handleChange = composeEventHandlers(props.onCheckedChange, context.onValueChange);

    return (
      <Radio
        as={as}
        {...itemProps}
        {...interopDataAttrObj('item')}
        checked={isChecked}
        ref={forwardedRef}
        onCheckedChange={handleChange}
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

const [styles, interopDataAttrObj] = createStyleObj(RADIO_GROUP_NAME, {
  root: {},
  item: radioStyles.root,
  indicator: radioStyles.indicator,
});

export { RadioGroup, styles };
export type { RadioGroupProps, RadioGroupItemProps };
