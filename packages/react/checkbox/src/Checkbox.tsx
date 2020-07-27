import * as React from 'react';
import { cssReset, isFunction, warningOnce, interopDataAttrObj } from '@interop-ui/utils';
import {
  createContext,
  forwardRef,
  useComposedRefs,
  useCallbackRef,
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

type CheckboxInputAttributes = typeof inputPropsForRoot[number];

/* -------------------------------------------------------------------------------------------------
 * Root level context
 * -----------------------------------------------------------------------------------------------*/

type CheckboxContextValue = {
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

const [CheckboxContext, useCheckboxContext] = createContext<CheckboxContextValue>(
  'CheckboxContext',
  'Checkbox.Root'
);
CheckboxContext.displayName = 'CheckboxContext';

/* -------------------------------------------------------------------------------------------------
 * CheckboxRoot
 * -----------------------------------------------------------------------------------------------*/

const ROOT_DEFAULT_TAG = 'span';

type CheckboxRootDOMProps = Omit<
  React.ComponentPropsWithoutRef<typeof ROOT_DEFAULT_TAG>,
  CheckboxInputAttributes
>;
type CheckboxRootOwnProps = Pick<
  React.ComponentPropsWithoutRef<'input'>,
  CheckboxInputAttributes
> & {
  isIndeterminate?: boolean;
  children?: React.ReactElement | ((props: { checked: boolean }) => React.ReactElement);
};

type CheckboxRootProps = CheckboxRootDOMProps & CheckboxRootOwnProps;

const CheckboxRoot = forwardRef<typeof ROOT_DEFAULT_TAG, CheckboxRootProps>(function CheckboxRoot(
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
    ...checkboxRootProps
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

  let context: CheckboxContextValue = React.useMemo(
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
    <CheckboxContext.Provider value={context}>
      <Comp {...interopDataAttrObj('CheckboxRoot')} ref={forwardedRef} {...checkboxRootProps}>
        {isFunction(children) ? children({ checked }) : children}
      </Comp>
    </CheckboxContext.Provider>
  );
});

CheckboxRoot.displayName = 'Checkbox.Root';

/* -------------------------------------------------------------------------------------------------
 * CheckboxInput
 * -----------------------------------------------------------------------------------------------*/

const INPUT_DEFAULT_TAG = 'input';

type CheckboxInputDOMProps = Omit<
  React.ComponentPropsWithoutRef<typeof INPUT_DEFAULT_TAG>,
  CheckboxInputAttributes
>;
type CheckboxInputOwnProps = {};
type CheckboxInputProps = CheckboxInputDOMProps & CheckboxInputOwnProps;

const CheckboxInput = forwardRef<typeof INPUT_DEFAULT_TAG, CheckboxInputProps>(
  function CheckboxInput(props, forwardedRef) {
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
    } = useCheckboxContext('Checkbox.Input');

    const ref = useComposedRefs(forwardedRef, inputRef);

    React.useEffect(() => {
      for (let prop of inputPropsForRoot) {
        warningOnce(
          prop,
          !Object.hasOwnProperty.call(checkboxInputProps, prop),
          `The ${prop} prop was passed to the Checkbox.Input component. This was likely a mistake. Instead, pass ${prop} to Checkbox.Root instead so that its data is available to the entire Checkbox component.`
        );
      }
    });

    return (
      <Comp
        {...interopDataAttrObj('CheckboxInput')}
        ref={ref}
        {...checkboxInputProps}
        type="checkbox"
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
  }
);
CheckboxInput.displayName = 'Checkbox.Input';

/* -------------------------------------------------------------------------------------------------
 * CheckboxBox
 * -----------------------------------------------------------------------------------------------*/

const BOX_DEFAULT_TAG = 'span';

type CheckboxBoxDOMProps = React.ComponentPropsWithoutRef<typeof BOX_DEFAULT_TAG>;
type CheckboxBoxOwnProps = {};
type CheckboxBoxProps = CheckboxBoxDOMProps & CheckboxBoxOwnProps;

const CheckboxBox = forwardRef<typeof BOX_DEFAULT_TAG, CheckboxBoxProps>(function CheckboxBox(
  props,
  forwardedRef
) {
  const { as: Comp = BOX_DEFAULT_TAG, ...checkboxBoxProps } = props;

  return <Comp {...interopDataAttrObj('CheckboBox')} ref={forwardedRef} {...checkboxBoxProps} />;
});
CheckboxBox.displayName = 'Checkbox.Box';

/* -------------------------------------------------------------------------------------------------
 * CheckboxIcon
 * -----------------------------------------------------------------------------------------------*/

const ICON_DEFAULT_TAG = 'span';

type CheckboxIconDOMProps = React.ComponentPropsWithoutRef<typeof ICON_DEFAULT_TAG>;
type CheckboxIconOwnProps = {
  children?: React.ReactElement | ((props: { checked: boolean }) => React.ReactElement);
};
type CheckboxIconProps = CheckboxIconDOMProps & CheckboxIconOwnProps;

const CheckboxIcon = forwardRef<typeof ICON_DEFAULT_TAG, CheckboxIconProps>(function CheckboxIcon(
  props,
  forwardedRef
) {
  let { as: Comp = ICON_DEFAULT_TAG, children, ...checkboxBoxProps } = props;
  let { checked } = useCheckboxContext('Checkbox.Icon');
  return (
    <Comp {...interopDataAttrObj('CheckboxIcon')} ref={forwardedRef} {...checkboxBoxProps}>
      {isFunction(children) ? children({ checked }) : children}
    </Comp>
  );
});

CheckboxIcon.displayName = 'Checkbox.Icon';

/* -------------------------------------------------------------------------------------------------
 * Checkbox
 * -----------------------------------------------------------------------------------------------*/

interface CheckboxStaticProps {
  Root: typeof CheckboxRoot;
  Input: typeof CheckboxInput;
  Icon: typeof CheckboxIcon;
  Box: typeof CheckboxBox;
}

const CHECKBOX_DEFAULT_TAG = 'input';

type CheckboxDOMProps = CheckboxRootDOMProps;
type CheckboxOwnProps = CheckboxRootOwnProps;
type CheckboxProps = CheckboxDOMProps & CheckboxOwnProps;

const Checkbox = forwardRef<typeof CHECKBOX_DEFAULT_TAG, CheckboxInputProps, CheckboxStaticProps>(
  function Checkbox(props, forwardedRef) {
    const { children, ...cotainerProps } = props;
    return (
      <CheckboxRoot {...cotainerProps}>
        {({ checked }) => (
          <CheckboxBox>
            <CheckboxInput ref={forwardedRef} />
            <CheckboxIcon>{isFunction(children) ? children({ checked }) : children}</CheckboxIcon>
          </CheckboxBox>
        )}
      </CheckboxRoot>
    );
  }
);

Checkbox.displayName = 'Checkbox';

/* ---------------------------------------------------------------------------------------------- */

Checkbox.Root = CheckboxRoot;
Checkbox.Input = CheckboxInput;
Checkbox.Box = CheckboxBox;
Checkbox.Icon = CheckboxIcon;

const styles: PrimitiveStyles = {
  root: {
    ...cssReset(ROOT_DEFAULT_TAG),
    display: 'inline-block',
    position: 'relative',
    verticalAlign: 'middle',
    zIndex: 0,
    height: 13,
    width: 13,
  },
  input: {
    ...cssReset(INPUT_DEFAULT_TAG),
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 1,
    opacity: 0,
  },
  box: {
    ...cssReset(BOX_DEFAULT_TAG),
    display: 'block',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 0,
    border: '1px solid #000',
  },
  icon: {
    ...cssReset(ICON_DEFAULT_TAG),
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none',
    userSelect: 'none',
    opacity: 0,
  },
  'root.state.checked[icon]': {
    opacity: 1,
  },
};

export type {
  CheckboxRootProps,
  CheckboxInputProps,
  CheckboxBoxProps,
  CheckboxIconProps,
  CheckboxProps,
};
export { Checkbox, styles };
