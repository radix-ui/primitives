import * as React from 'react';
import { cssReset, warningOnce } from '@interop-ui/utils';
import {
  createContext,
  createStyleObj,
  forwardRef,
  useComposedRefs,
  useCallbackRef,
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

const ROOT_NAME = 'Checkbox.Root';
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
};

type CheckboxRootProps = CheckboxRootDOMProps & CheckboxRootOwnProps;

const CheckboxRoot = forwardRef<typeof ROOT_DEFAULT_TAG, CheckboxRootProps>(function CheckboxRoot(
  props,
  forwardedRef
) {
  let {
    as: Comp = ROOT_DEFAULT_TAG,

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
      <Comp {...checkboxRootProps} {...interopDataAttrObj('root')} ref={forwardedRef} />
    </CheckboxContext.Provider>
  );
});

/* -------------------------------------------------------------------------------------------------
 * CheckboxInput
 * -----------------------------------------------------------------------------------------------*/

const INPUT_NAME = 'Checkbox.Input';
const INPUT_DEFAULT_TAG = 'input';

type CheckboxInputDOMProps = Omit<
  React.ComponentPropsWithoutRef<typeof INPUT_DEFAULT_TAG>,
  CheckboxInputAttributes
>;
type CheckboxInputOwnProps = {};
type CheckboxInputProps = CheckboxInputDOMProps & CheckboxInputOwnProps;

const CheckboxInput = forwardRef<typeof INPUT_DEFAULT_TAG, CheckboxInputProps>(
  function CheckboxInput(props, forwardedRef) {
    const { as: Comp = INPUT_DEFAULT_TAG, ...checkboxInputProps } = props;

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
    } = useCheckboxContext(INPUT_NAME);

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
        {...checkboxInputProps}
        {...interopDataAttrObj('input')}
        type="checkbox"
        ref={ref}
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

/* -------------------------------------------------------------------------------------------------
 * CheckboxIcon
 * -----------------------------------------------------------------------------------------------*/

const ICON_NAME = 'Checkbox.Icon';
const ICON_DEFAULT_TAG = 'span';

type CheckboxIconDOMProps = React.ComponentPropsWithoutRef<typeof ICON_DEFAULT_TAG>;
type CheckboxIconOwnProps = {};
type CheckboxIconProps = CheckboxIconDOMProps & CheckboxIconOwnProps;

const CheckboxIcon = forwardRef<typeof ICON_DEFAULT_TAG, CheckboxIconProps>(function CheckboxIcon(
  props,
  forwardedRef
) {
  let { as: Comp = ICON_DEFAULT_TAG, ...iconProps } = props;
  let { checked } = useCheckboxContext(ICON_NAME);

  return checked ? (
    <Comp {...iconProps} {...interopDataAttrObj('icon')} ref={forwardedRef} />
  ) : null;
});

/* -------------------------------------------------------------------------------------------------
 * Checkbox
 * -----------------------------------------------------------------------------------------------*/

interface CheckboxStaticProps {
  Root: typeof CheckboxRoot;
  Input: typeof CheckboxInput;
  Icon: typeof CheckboxIcon;
}

const CHECKBOX_NAME = 'Checkbox';
const CHECKBOX_DEFAULT_TAG = 'input';

type CheckboxDOMProps = CheckboxRootDOMProps;
type CheckboxOwnProps = CheckboxRootOwnProps;
type CheckboxProps = CheckboxDOMProps & CheckboxOwnProps;

const Checkbox = forwardRef<typeof CHECKBOX_DEFAULT_TAG, CheckboxInputProps, CheckboxStaticProps>(
  function Checkbox(props, forwardedRef) {
    const { children, ...containerProps } = props;
    return (
      <CheckboxRoot {...containerProps}>
        <CheckboxInput ref={forwardedRef} />
        <CheckboxIcon />
      </CheckboxRoot>
    );
  }
);

/* ---------------------------------------------------------------------------------------------- */

Checkbox.Root = CheckboxRoot;
Checkbox.Input = CheckboxInput;
Checkbox.Icon = CheckboxIcon;

Checkbox.displayName = CHECKBOX_NAME;
Checkbox.Root.displayName = ROOT_NAME;
Checkbox.Input.displayName = INPUT_NAME;
Checkbox.Icon.displayName = ICON_NAME;

const [styles, interopDataAttrObj] = createStyleObj(CHECKBOX_NAME, {
  root: {
    ...cssReset(ROOT_DEFAULT_TAG),
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

export type { CheckboxRootProps, CheckboxInputProps, CheckboxIconProps, CheckboxProps };
export { Checkbox, styles };
