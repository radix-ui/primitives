import * as React from 'react';
import {
  createContext,
  composeEventHandlers,
  forwardRef,
  useControlledState,
  useComposedRefs,
} from '@interop-ui/react-utils';
import { useLabelContext } from '@interop-ui/react-label';
import { getPartDataAttrObj } from '@interop-ui/utils';

/* -------------------------------------------------------------------------------------------------
 * Radio
 * -----------------------------------------------------------------------------------------------*/

const RADIO_NAME = 'Radio';
const RADIO_DEFAULT_TAG = 'button';

type InputDOMProps = React.ComponentProps<'input'>;
type RadioDOMProps = React.ComponentPropsWithoutRef<typeof RADIO_DEFAULT_TAG>;
type RadioOwnProps = {
  checked?: boolean;
  defaultChecked?: boolean;
  required?: InputDOMProps['required'];
  readOnly?: InputDOMProps['readOnly'];
  onCheckedChange?: InputDOMProps['onChange'];
};
type RadioProps = RadioOwnProps & Omit<RadioDOMProps, keyof RadioOwnProps | 'onChange'>;

const [RadioContext, useRadioContext] = createContext<boolean>(RADIO_NAME + 'Context', RADIO_NAME);

const Radio = forwardRef<typeof RADIO_DEFAULT_TAG, RadioProps, RadioStaticProps>(function Radio(
  props,
  forwardedRef
) {
  const {
    as: Comp = RADIO_DEFAULT_TAG,
    'aria-labelledby': ariaLabelledby,
    children,
    name,
    checked: checkedProp,
    defaultChecked,
    required,
    disabled,
    readOnly,
    value = 'on',
    onCheckedChange,
    ...radioProps
  } = props;
  const inputRef = React.useRef<HTMLInputElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const ref = useComposedRefs(forwardedRef, buttonRef);
  const labelId = useLabelContext(buttonRef);
  const labelledBy = ariaLabelledby || labelId;
  const [checked = false, setChecked] = useControlledState({
    prop: checkedProp,
    defaultProp: defaultChecked,
  });

  return (
    /**
     * The `input` is hidden from non-SR and SR users as it only exists to
     * ensure form events fire when the value changes and that the value
     * updates when clicking an associated label.
     */
    <>
      <input
        ref={inputRef}
        type="radio"
        name={name}
        checked={checked}
        required={required}
        disabled={disabled}
        readOnly={readOnly}
        value={value}
        hidden
        onChange={composeEventHandlers(onCheckedChange, (event) => {
          setChecked(event.target.checked);
        })}
      />
      <Comp
        type="button"
        {...radioProps}
        {...getPartDataAttrObj(RADIO_NAME)}
        ref={ref}
        role="radio"
        aria-checked={checked}
        aria-labelledby={labelledBy}
        data-state={getState(checked)}
        data-readonly={readOnly}
        disabled={disabled}
        value={value}
        /**
         * The `input` is hidden, so when the button is clicked we trigger
         * the input manually
         */
        onClick={composeEventHandlers(props.onClick, () => inputRef.current?.click(), {
          checkForDefaultPrevented: false,
        })}
      >
        <RadioContext.Provider value={checked}>{children}</RadioContext.Provider>
      </Comp>
    </>
  );
});

/* -------------------------------------------------------------------------------------------------
 * RadioIndicator
 * -----------------------------------------------------------------------------------------------*/

const INDICATOR_NAME = 'Radio.Indicator';
const INDICATOR_DEFAULT_TAG = 'span';

type RadioIndicatorDOMProps = React.ComponentPropsWithoutRef<typeof INDICATOR_DEFAULT_TAG>;
type RadioIndicatorOwnProps = {};
type RadioIndicatorProps = RadioIndicatorDOMProps & RadioIndicatorOwnProps;

const RadioIndicator = forwardRef<typeof INDICATOR_DEFAULT_TAG, RadioIndicatorProps>(
  function RadioIndicator(props, forwardedRef) {
    const checked = useRadioContext(INDICATOR_NAME);
    return checked ? (
      <RadioIndicatorImpl {...props} data-state={getState(checked)} ref={forwardedRef} />
    ) : null;
  }
);

const RadioIndicatorImpl = forwardRef<typeof INDICATOR_DEFAULT_TAG, RadioIndicatorProps>(
  function RadioIndicatorImpl(props, forwardedRef) {
    const { as: Comp = INDICATOR_DEFAULT_TAG, ...indicatorProps } = props;
    return <Comp {...indicatorProps} {...getPartDataAttrObj(INDICATOR_NAME)} ref={forwardedRef} />;
  }
);

/* ---------------------------------------------------------------------------------------------- */

function getState(checked: boolean) {
  return checked ? 'checked' : 'unchecked';
}

Radio.Indicator = RadioIndicator;

Radio.displayName = RADIO_NAME;
Radio.Indicator.displayName = INDICATOR_NAME;

interface RadioStaticProps {
  Indicator: typeof RadioIndicator;
}

export { Radio };
export type { RadioProps, RadioIndicatorProps };
