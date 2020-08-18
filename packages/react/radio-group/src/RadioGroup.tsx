import * as React from 'react';
import {
  composeEventHandlers,
  createContext,
  createStyleObj,
  forwardRef,
  useCallbackRef,
  useControlledState,
} from '@interop-ui/react-utils';
import { Radio, styles as radioStyles } from '@interop-ui/react-radio';

/* -------------------------------------------------------------------------------------------------
 * RadioGroup
 * -----------------------------------------------------------------------------------------------*/
const RADIO_GROUP_NAME = 'RadioGroup';

type RadioGroupProps = {
  value?: string;
  defaultValue?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const [RadioGroupContext, useRadioGroupContext] = createContext<{
  value: RadioGroupProps['value'];
  onChange: Required<RadioGroupProps>['onChange'];
}>('RadioGroupContext', RADIO_GROUP_NAME);

const RadioGroup: React.FC<RadioGroupProps> & RadioGroupStaticProps = (props) => {
  const { value: valueProp, defaultValue, onChange = () => {}, ...groupProps } = props;
  const [value, setValue] = useControlledState({
    prop: valueProp,
    defaultProp: defaultValue,
  });

  const context = React.useMemo(
    () => ({
      value,
      onChange(event: React.ChangeEvent<HTMLInputElement>) {
        setValue(event.target.value);
        onChange(event);
      },
    }),
    [value, onChange, setValue]
  );

  return <RadioGroupContext.Provider value={context} {...groupProps} />;
};

/* -------------------------------------------------------------------------------------------------
 * RadioGroupInput
 * -----------------------------------------------------------------------------------------------*/

const ITEM_NAME = 'RadioGroup.Item';

type RadioProps = Omit<React.ComponentProps<typeof Radio>, 'value'> & { value: string };
type RadioGroupItemProps = RadioProps;

const RadioGroupItem = forwardRef<typeof Radio.Root, RadioGroupItemProps>(function RadioGroupInput(
  props,
  forwardedRef
) {
  const context = useRadioGroupContext(ITEM_NAME);
  const checked = context.value === props.value;

  const onChange = useCallbackRef(
    composeEventHandlers(props.onChange, (event: React.ChangeEvent<HTMLInputElement>) => {
      context.onChange(event);
    })
  );

  return (
    <Radio.Root
      {...props}
      checked={checked}
      onChange={onChange}
      {...interopDataAttrObj('input')}
      ref={forwardedRef}
    />
  );
});

/* ---------------------------------------------------------------------------------------------- */

RadioGroup.Item = RadioGroupItem;
RadioGroup.Input = Radio.Input;
RadioGroup.Icon = Radio.Icon;

RadioGroup.displayName = RADIO_GROUP_NAME;
RadioGroup.Item.displayName = ITEM_NAME;
RadioGroup.Input.displayName = 'RadioGroup.Input';
RadioGroup.Icon.displayName = 'RadioGroup.Icon';

interface RadioGroupStaticProps {
  Item: typeof RadioGroupItem;
  Input: typeof Radio.Input;
  Icon: typeof Radio.Icon;
}

const [styles, interopDataAttrObj] = createStyleObj(RADIO_GROUP_NAME, {
  root: {},
  item: radioStyles.root,
  input: radioStyles.input,
  icon: radioStyles.icon,
});

export { RadioGroup, styles };
export type { RadioGroupProps, RadioGroupItemProps };
