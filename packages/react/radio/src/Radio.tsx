import * as React from 'react';
import {
  cssReset,
  interopDataAttrObj,
  isFunction,
  warningOnce,
  interopSelector,
  interopDataAttrSelector,
} from '@interop-ui/utils';
import {
  createContext,
  forwardRef,
  useCallbackRef,
  useComposedRefs,
  PrimitiveStyles,
} from '@interop-ui/react-utils';

// These props will be passed to the top-level root rather than the input when using the
// composed API so that we can share data via context.
const inputPropsForRoot = [
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

type RadioInputAttributes = typeof inputPropsForRoot[number];

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

const [RadioContext, useRadioContext] = createContext<RadioContextValue>(
  'RadioContext',
  'Radio.Root'
);

/* -------------------------------------------------------------------------------------------------
 * RadioRoot
 * -----------------------------------------------------------------------------------------------*/

const ROOT_NAME = 'Radio.Root';
const ROOT_DEFAULT_TAG = 'span';

type RadioRootDOMProps = Omit<
  React.ComponentPropsWithoutRef<typeof ROOT_DEFAULT_TAG>,
  RadioInputAttributes
>;
type RadioRootOwnProps = Pick<React.ComponentPropsWithoutRef<'input'>, RadioInputAttributes> & {
  children?: React.ReactElement | ((props: { checked: boolean }) => React.ReactElement);
};
type RadioRootProps = RadioRootDOMProps & RadioRootOwnProps;

const RadioRoot = forwardRef<typeof ROOT_DEFAULT_TAG, RadioRootProps>(function RadioRoot(
  props,
  forwardedRef
) {
  let {
    as: Comp = ROOT_DEFAULT_TAG,
    children,

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
      <Comp {...interopDataAttrObj(ROOT_NAME)} ref={forwardedRef} {...radioProps}>
        {isFunction(children) ? children({ checked }) : children}
      </Comp>
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
  const { as: Comp = INPUT_DEFAULT_TAG, children, ...checkboxInputProps } = props;

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
    for (let prop of inputPropsForRoot) {
      warningOnce(
        prop,
        !Object.hasOwnProperty.call(checkboxInputProps, prop),
        `The ${prop} prop was passed to the Radio.Input component. This was likely a mistake. Instead, pass ${prop} to Radio.Root instead so that its data is available to the entire Radio component.`
      );
    }
  });

  return (
    <Comp
      {...interopDataAttrObj(INPUT_NAME)}
      ref={ref}
      {...checkboxInputProps}
      type="radio"
      checked={checked}
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
 * RadioBox
 * -----------------------------------------------------------------------------------------------*/

const BOX_NAME = 'Radio.Box';
const BOX_DEFAULT_TAG = 'span';

type RadioBoxDOMProps = React.ComponentPropsWithoutRef<typeof BOX_DEFAULT_TAG>;
type RadioBoxOwnProps = {};
type RadioBoxProps = RadioBoxDOMProps & RadioBoxOwnProps;

const RadioBox = forwardRef<typeof BOX_DEFAULT_TAG, RadioBoxProps>(function RadioBox(
  props,
  forwardedRef
) {
  const { as: Comp = BOX_DEFAULT_TAG, ...checkboxBoxProps } = props;

  return <Comp {...interopDataAttrObj(BOX_NAME)} ref={forwardedRef} {...checkboxBoxProps} />;
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
  let { as: Comp = ICON_DEFAULT_TAG, children, ...checkboxBoxProps } = props;
  let { checked } = useRadioContext(ICON_NAME);
  return (
    <Comp {...interopDataAttrObj(ICON_NAME)} ref={forwardedRef} {...checkboxBoxProps}>
      {isFunction(children) ? children({ checked }) : children}
    </Comp>
  );
});

/* -------------------------------------------------------------------------------------------------
 * Radio
 * -----------------------------------------------------------------------------------------------*/

const RADIO_NAME = 'Radio';
const RADIO_DEFAULT_TAG = 'input';

type RadioDOMProps = RadioRootDOMProps;
type RadioOwnProps = RadioRootOwnProps;
type RadioProps = RadioDOMProps & RadioOwnProps;

const Radio = forwardRef<typeof RADIO_DEFAULT_TAG, RadioInputProps, RadioStaticProps>(
  function Radio(props, forwardedRef) {
    const { as, children, ...cotainerProps } = props;
    return (
      <RadioRoot {...cotainerProps}>
        {({ checked }) => (
          <RadioBox>
            <RadioInput as={as} ref={forwardedRef} />
            <RadioIcon>{isFunction(children) ? children({ checked }) : children}</RadioIcon>
          </RadioBox>
        )}
      </RadioRoot>
    );
  }
);

/* ---------------------------------------------------------------------------------------------- */

Radio.Root = RadioRoot;
Radio.Input = RadioInput;
Radio.Box = RadioBox;
Radio.Icon = RadioIcon;

Radio.displayName = RADIO_NAME;
Radio.Root.displayName = ROOT_NAME;
Radio.Input.displayName = INPUT_NAME;
Radio.Box.displayName = BOX_NAME;
Radio.Icon.displayName = ICON_NAME;

interface RadioStaticProps {
  Root: typeof RadioRoot;
  Input: typeof RadioInput;
  Box: typeof RadioBox;
  Icon: typeof RadioIcon;
}

const styles: PrimitiveStyles = {
  [interopSelector(ROOT_NAME)]: {
    ...cssReset(ROOT_DEFAULT_TAG),
    display: 'inline-block',
    position: 'relative',
    verticalAlign: 'middle',
    zIndex: 0,
    height: 13,
    width: 13,
  },
  [interopSelector(INPUT_NAME)]: {
    ...cssReset(INPUT_DEFAULT_TAG),
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 1,
    opacity: 0,

    [`&:checked + ${interopDataAttrSelector(ICON_NAME)}`]: {
      opacity: 1,
    },
  },
  [interopSelector(BOX_NAME)]: {
    ...cssReset(BOX_DEFAULT_TAG),
    display: 'block',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 0,
    border: '1px solid #000',
    borderRadius: 9999999,
  },
  [interopSelector(ICON_NAME)]: {
    ...cssReset(ICON_DEFAULT_TAG),
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none',
    userSelect: 'none',
    opacity: 0,
    borderRadius: 9999999,
  },
};

export { Radio, styles };
export type { RadioRootProps, RadioInputProps, RadioBoxProps, RadioIconProps, RadioProps };
