import * as React from 'react';
import {
  composeEventHandlers,
  createContext,
  createStyleObj,
  forwardRef,
  useCallbackRef,
  useControlledState,
  RovingTabIndexProvider,
  useRovingTabIndex,
  useComposedRefs,
  useId,
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
  /**
   * The direction the radio group is layed out.
   * Mainly so arrow key navigation is configured appropriately (left & right vs. up & down)
   * (default: horizontal)
   */
  orientation?: React.AriaAttributes['aria-orientation'];
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
    orientation = 'horizontal',
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
    <Comp
      {...groupProps}
      ref={forwardedRef}
      role="radiogroup"
      data-orientation={orientation}
      aria-orientation={orientation}
      aria-labelledby={labelledBy}
    >
      <RadioGroupContext.Provider value={context}>
        <RovingTabIndexProvider orientation={orientation}>{children}</RovingTabIndexProvider>
      </RadioGroupContext.Provider>
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
    const id = `radio-group-item-${useId()}`;
    const context = useRadioGroupContext(ITEM_NAME);
    const radioRef = React.useRef<React.ElementRef<typeof Radio>>(null);
    const ref = useComposedRefs(forwardedRef, radioRef);
    const isChecked = context.value === props.value;
    const handleChange = composeEventHandlers(props.onCheckedChange, context.onValueChange);
    const { onFocus, onKeyDown, tabIndex } = useRovingTabIndex({
      id,
      isSelected: !context.value || isChecked,
      elementRef: radioRef,
    });

    function handleFocus(event: React.FocusEvent<React.ElementRef<typeof Radio>>) {
      onFocus(event);

      /**
       * Trigger click to check the input.
       * We do this imperatively instead of updating `context.value` because changing via
       * state would not trigger change events (e.g. when in a form).
       */
      if (context.value !== undefined) {
        radioRef.current?.click();
      }
    }

    return (
      <Radio
        as={as}
        {...itemProps}
        {...interopDataAttrObj('item')}
        checked={isChecked}
        ref={ref}
        tabIndex={tabIndex}
        onCheckedChange={handleChange}
        onKeyDown={composeEventHandlers(itemProps.onKeyDown, onKeyDown)}
        onFocus={composeEventHandlers(itemProps.onFocus, handleFocus, {
          checkForDefaultPrevented: false,
        })}
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
