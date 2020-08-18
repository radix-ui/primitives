import * as React from 'react';
import { cssReset } from '@interop-ui/utils';
import {
  createContext,
  createStyleObj,
  composeEventHandlers,
  forwardRef,
  useControlledState,
  useComposedRefs,
} from '@interop-ui/react-utils';
import { useLabelContext } from '@interop-ui/react-label';

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
  const labelId = useLabelContext();
  const labelledBy = ariaLabelledby || labelId;
  const inputRef = React.useRef<HTMLInputElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const ref = useComposedRefs(forwardedRef, buttonRef);
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
          /**
           * When this component is wrapped in a label, clicking the label
           * will not focus the button (but it will correctly trigger the input)
           * so we manually focus it.
           */
          if (buttonRef.current?.ownerDocument.activeElement !== buttonRef.current) {
            buttonRef.current?.focus();
          }
        })}
      />
      <Comp
        {...radioProps}
        {...interopDataAttrObj('root')}
        ref={ref}
        type={Comp === RADIO_DEFAULT_TAG ? 'button' : undefined}
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
        onClick={() => inputRef.current?.click()}
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
    return <Comp {...indicatorProps} {...interopDataAttrObj('indicator')} ref={forwardedRef} />;
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

const [styles, interopDataAttrObj] = createStyleObj(RADIO_NAME, {
  root: {
    ...cssReset(RADIO_DEFAULT_TAG),
    position: 'relative',
    verticalAlign: 'middle',
  },
  indicator: {
    ...cssReset(INDICATOR_DEFAULT_TAG),
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
});

export type { RadioProps, RadioIndicatorProps };
export { Radio, styles };
