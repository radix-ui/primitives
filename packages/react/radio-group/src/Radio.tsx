import * as React from 'react';
import { cssReset, warningOnce } from '@interop-ui/utils';
import {
  createContext,
  createStyleObj,
  forwardRef,
  useCallbackRef,
  useComposedRefs,
} from '@interop-ui/react-utils';

// These props will be passed to the top-level root rather than the input when using the
// composed API so that we can share data via context.
const inputPropsForRadio = [
  'autoComplete',
  'autoFocus',
  'checked',
  'defaultChecked',
  'disabled',
  'form',
  'name',
  'onChange',
  'readOnly',
  'required',
  'value',
] as const;

type RadioInputAttributes = typeof inputPropsForRadio[number];

/* -------------------------------------------------------------------------------------------------
 * Root level context
 * -----------------------------------------------------------------------------------------------*/

type RadioContextValue = {
  checked: boolean;
  onChange(event: React.ChangeEvent<HTMLInputElement>): void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  autoComplete: React.ComponentProps<'input'>['autoComplete'];
  disabled: React.ComponentProps<'input'>['disabled'];
  form: React.ComponentProps<'input'>['form'];
  name: React.ComponentProps<'input'>['name'];
  readOnly: React.ComponentProps<'input'>['readOnly'];
  required: React.ComponentProps<'input'>['required'];
  value: React.ComponentProps<'input'>['value'];
};

const [RadioContext, useRadioContext] = createContext<RadioContextValue>('RadioContext', 'Radio');

/* -------------------------------------------------------------------------------------------------
 * Radio
 * -----------------------------------------------------------------------------------------------*/

const RADIO_NAME = 'Radio';
const RADIO_DEFAULT_TAG = 'span';

type RadioDOMProps = Omit<
  React.ComponentPropsWithoutRef<typeof RADIO_DEFAULT_TAG>,
  RadioInputAttributes
>;
type RadioOwnProps = Pick<React.ComponentPropsWithoutRef<'input'>, RadioInputAttributes>;
type RadioProps = RadioDOMProps & RadioOwnProps;

const Radio = forwardRef<typeof RADIO_DEFAULT_TAG, RadioProps, RadioStaticProps>(function Radio(
  props,
  forwardedRef
) {
  let {
    as: Comp = RADIO_DEFAULT_TAG,

    // input props
    defaultChecked,
    checked: checkedProp,
    onChange: onChangeProp,
    autoComplete,
    autoFocus,
    disabled,
    form,
    name,
    readOnly,
    required,
    value,
    ...radioProps
  } = props;

  let isControlled = React.useRef(checkedProp != null);

  let inputRef = React.useRef<HTMLInputElement>(null);

  let [_checked, setChecked] = React.useState(defaultChecked ?? false);
  let checked = isControlled.current ? checkedProp! : _checked;

  let onChange = useCallbackRef((event: React.ChangeEvent<HTMLInputElement>) => {
    onChangeProp && onChangeProp(event);
    if (!isControlled.current) {
      setChecked(event.target.checked);
    }
  });

  let ctx: RadioContextValue = React.useMemo(
    () => ({
      onChange,
      checked,
      inputRef,
      autoComplete,
      disabled,
      form,
      name,
      readOnly,
      required,
      value,
    }),
    [onChange, checked, autoComplete, disabled, form, name, readOnly, required, value]
  );

  return (
    <RadioContext.Provider value={ctx}>
      <Comp {...radioProps} {...interopDataAttrObj('root')} ref={forwardedRef} />
    </RadioContext.Provider>
  );
});

/* -------------------------------------------------------------------------------------------------
 * RadioInput
 * -----------------------------------------------------------------------------------------------*/

const INPUT_NAME = 'Radio.Input';
const INPUT_DEFAULT_TAG = 'input';

type RadioInputDOMProps = Omit<
  React.ComponentPropsWithoutRef<typeof INPUT_DEFAULT_TAG>,
  RadioInputAttributes
>;
type RadioInputOwnProps = {};
type RadioInputProps = RadioInputDOMProps & RadioInputOwnProps;

const RadioInput = forwardRef<typeof INPUT_DEFAULT_TAG, RadioInputProps>(function RadioInput(
  props,
  forwardedRef
) {
  const { as: Comp = INPUT_DEFAULT_TAG, ...radioInputProps } = props;

  let {
    inputRef,
    checked,
    onChange,
    autoComplete,
    disabled,
    form,
    name,
    readOnly,
    required,
    value,
  } = useRadioContext(INPUT_NAME);

  const ref = useComposedRefs(forwardedRef, inputRef);

  React.useEffect(() => {
    for (let prop of inputPropsForRadio) {
      warningOnce(
        prop,
        !Object.hasOwnProperty.call(radioInputProps, prop),
        `The ${prop} prop was passed to the Radio.Input component. This was likely a mistake. Instead, pass ${prop} to Radio instead so that its data is available to the entire Radio component.`
      );
    }
  });

  return (
    <Comp
      {...radioInputProps}
      {...interopDataAttrObj('input')}
      ref={ref}
      type="radio"
      defaultChecked={checked}
      onChange={onChange}
      autoComplete={autoComplete}
      disabled={disabled}
      form={form}
      name={name}
      readOnly={readOnly}
      required={required}
      value={value}
    />
  );
});

/* -------------------------------------------------------------------------------------------------
 * RadioIcon
 * -----------------------------------------------------------------------------------------------*/

const ICON_NAME = 'Radio.Icon';
const ICON_DEFAULT_TAG = 'span';

type RadioIconDOMProps = React.ComponentPropsWithoutRef<typeof ICON_DEFAULT_TAG>;
type RadioIconOwnProps = {
  children?: React.ReactElement | ((props: { checked: boolean }) => React.ReactElement);
};
type RadioIconProps = RadioIconDOMProps & RadioIconOwnProps;

const RadioIcon = forwardRef<typeof ICON_DEFAULT_TAG, RadioIconProps>(function RadioIcon(
  props,
  forwardedRef
) {
  let { as: Comp = ICON_DEFAULT_TAG, ...iconProps } = props;
  let { checked } = useRadioContext(ICON_NAME);

  return checked ? (
    <Comp {...iconProps} {...interopDataAttrObj('icon')} ref={forwardedRef} />
  ) : null;
});

/* ---------------------------------------------------------------------------------------------- */

Radio.Input = RadioInput;
Radio.Icon = RadioIcon;

Radio.displayName = RADIO_NAME;
Radio.Input.displayName = INPUT_NAME;
Radio.Icon.displayName = ICON_NAME;

interface RadioStaticProps {
  Input: typeof RadioInput;
  Icon: typeof RadioIcon;
}

const [styles, interopDataAttrObj] = createStyleObj(RADIO_NAME, {
  root: {
    ...cssReset(RADIO_DEFAULT_TAG),
    display: 'inline-block',
    position: 'relative',
    verticalAlign: 'middle',
    zIndex: 0,
  },
  input: {
    ...cssReset(INPUT_DEFAULT_TAG),
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
    opacity: 0,
    width: '100%',
    height: '100%',
  },
  icon: {
    ...cssReset(ICON_DEFAULT_TAG),
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none',
    userSelect: 'none',
  },
});

export { Radio, styles };
export type { RadioProps, RadioInputProps, RadioIconProps };
