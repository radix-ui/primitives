import * as React from 'react';
import {
  createContext,
  composeEventHandlers,
  useControlledState,
  useComposedRefs,
} from '@interop-ui/react-utils';
import { forwardRefWithAs } from '@interop-ui/react-polymorphic';
import { useLabelContext } from '@interop-ui/react-label';
import { getPartDataAttrObj } from '@interop-ui/utils';

/* -------------------------------------------------------------------------------------------------
 * Radio
 * -----------------------------------------------------------------------------------------------*/

const RADIO_NAME = 'Radio';
const RADIO_DEFAULT_TAG = 'button';

type InputDOMProps = React.ComponentProps<'input'>;
type RadioOwnProps = {
  checked?: boolean;
  defaultChecked?: boolean;
  required?: InputDOMProps['required'];
  readOnly?: InputDOMProps['readOnly'];
  onCheckedChange?: InputDOMProps['onChange'];
  onChange: never;
};

const [RadioContext, useRadioContext] = createContext<boolean>(RADIO_NAME + 'Context', RADIO_NAME);

const Radio = forwardRefWithAs<typeof RADIO_DEFAULT_TAG, RadioOwnProps>((props, forwardedRef) => {
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

Radio.displayName = RADIO_NAME;

/* -------------------------------------------------------------------------------------------------
 * RadioIndicator
 * -----------------------------------------------------------------------------------------------*/

const INDICATOR_NAME = 'RadioIndicator';
const INDICATOR_DEFAULT_TAG = 'span';

const RadioIndicator = forwardRefWithAs<typeof RadioIndicatorImpl>((props, forwardedRef) => {
  const checked = useRadioContext(INDICATOR_NAME);
  return checked ? (
    <RadioIndicatorImpl {...props} data-state={getState(checked)} ref={forwardedRef} />
  ) : null;
});

const RadioIndicatorImpl = forwardRefWithAs<typeof INDICATOR_DEFAULT_TAG>(
  function RadioIndicatorImpl(props, forwardedRef) {
    const { as: Comp = INDICATOR_DEFAULT_TAG, ...indicatorProps } = props;
    return <Comp {...indicatorProps} {...getPartDataAttrObj(INDICATOR_NAME)} ref={forwardedRef} />;
  }
);

RadioIndicator.displayName = INDICATOR_NAME;

/* ---------------------------------------------------------------------------------------------- */

function getState(checked: boolean) {
  return checked ? 'checked' : 'unchecked';
}

export { Radio, RadioIndicator };
