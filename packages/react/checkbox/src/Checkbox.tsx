import * as React from 'react';
import { cssReset, isFunction, warningOnce, interopDataAttrSelector } from '@interop-ui/utils';
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
      <Comp {...interopDataAttrObj('root')} ref={forwardedRef} {...checkboxRootProps}>
        {isFunction(children) ? children({ checked }) : children}
      </Comp>
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
        {...interopDataAttrObj('input')}
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

/* -------------------------------------------------------------------------------------------------
 * CheckboxBox
 * -----------------------------------------------------------------------------------------------*/

const BOX_NAME = 'Checkbox.Box';
const BOX_DEFAULT_TAG = 'span';

type CheckboxBoxDOMProps = React.ComponentPropsWithoutRef<typeof BOX_DEFAULT_TAG>;
type CheckboxBoxOwnProps = {};
type CheckboxBoxProps = CheckboxBoxDOMProps & CheckboxBoxOwnProps;

const CheckboxBox = forwardRef<typeof BOX_DEFAULT_TAG, CheckboxBoxProps>(function CheckboxBox(
  props,
  forwardedRef
) {
  const { as: Comp = BOX_DEFAULT_TAG, ...checkboxBoxProps } = props;

  return <Comp {...interopDataAttrObj('box')} ref={forwardedRef} {...checkboxBoxProps} />;
});

/* -------------------------------------------------------------------------------------------------
 * CheckboxIcon
 * -----------------------------------------------------------------------------------------------*/

const ICON_NAME = 'Checkbox.Icon';
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
  let { checked } = useCheckboxContext(ICON_NAME);
  return (
    <Comp {...interopDataAttrObj('icon')} ref={forwardedRef} {...checkboxBoxProps}>
      {isFunction(children) ? children({ checked }) : children}
    </Comp>
  );
});

/* -------------------------------------------------------------------------------------------------
 * Checkbox
 * -----------------------------------------------------------------------------------------------*/

interface CheckboxStaticProps {
  Root: typeof CheckboxRoot;
  Input: typeof CheckboxInput;
  Icon: typeof CheckboxIcon;
  Box: typeof CheckboxBox;
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

/* ---------------------------------------------------------------------------------------------- */

Checkbox.Root = CheckboxRoot;
Checkbox.Input = CheckboxInput;
Checkbox.Box = CheckboxBox;
Checkbox.Icon = CheckboxIcon;

Checkbox.displayName = CHECKBOX_NAME;
Checkbox.Root.displayName = ROOT_NAME;
Checkbox.Input.displayName = INPUT_NAME;
Checkbox.Box.displayName = BOX_NAME;
Checkbox.Icon.displayName = ICON_NAME;

const [styles, interopDataAttrObj] = createStyleObj(CHECKBOX_NAME, {
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

    [`&:checked + ${interopDataAttrSelector(ICON_NAME)}`]: {
      opacity: 1,
    },
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
});

export type {
  CheckboxRootProps,
  CheckboxInputProps,
  CheckboxBoxProps,
  CheckboxIconProps,
  CheckboxProps,
};
export { Checkbox, styles };
