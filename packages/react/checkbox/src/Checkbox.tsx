import * as React from 'react';
import { cssReset, isFunction } from '@interop-ui/utils';
import { forwardRef, useComposedRefs, useCallbackRef } from '@interop-ui/react-utils';

// These props will be passed to the top-level container rather than the input when using the
// composed API so that we can share data via context.
const inputPropsForContainer = [
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

type CheckboxInputAttributes = typeof inputPropsForContainer[number];

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

const CheckboxContext = React.createContext<CheckboxContextValue>({} as CheckboxContextValue);
CheckboxContext.displayName = 'CheckboxContext';

/* -------------------------------------------------------------------------------------------------
 * CheckboxContainer
 * -----------------------------------------------------------------------------------------------*/

const CONTAINER_DEFAULT_TAG = 'div';

type CheckboxContainerDOMProps = Omit<
  React.ComponentPropsWithoutRef<typeof CONTAINER_DEFAULT_TAG>,
  CheckboxInputAttributes
>;
type CheckboxContainerOwnProps = Pick<
  React.ComponentPropsWithoutRef<'input'>,
  CheckboxInputAttributes
> & {
  isIndeterminate?: boolean;
  children?: React.ReactElement | ((props: { checked: boolean }) => React.ReactElement);
};

type CheckboxContainerProps = CheckboxContainerDOMProps & CheckboxContainerOwnProps;

const CheckboxContainer = forwardRef<typeof CONTAINER_DEFAULT_TAG, CheckboxContainerProps>(
  function CheckboxContainer(props, forwardedRef) {
    let {
      as: Comp = CONTAINER_DEFAULT_TAG,
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
      ...checkboxContainerProps
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
        <Comp ref={forwardedRef} {...checkboxContainerProps}>
          {isFunction(children) ? children({ checked }) : children}
        </Comp>
      </CheckboxContext.Provider>
    );
  }
);

CheckboxContainer.displayName = 'Checkbox.Container';

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
    } = React.useContext(CheckboxContext);

    const ref = useComposedRefs(forwardedRef, inputRef);

    return (
      <Comp
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
        {...checkboxInputProps}
      />
    );
  }
);
CheckboxInput.displayName = 'Checkbox.Input';

/* -------------------------------------------------------------------------------------------------
 * CheckboxBox
 * -----------------------------------------------------------------------------------------------*/

const BOX_DEFAULT_TAG = 'div';

type CheckboxBoxDOMProps = React.ComponentPropsWithoutRef<typeof BOX_DEFAULT_TAG>;
type CheckboxBoxOwnProps = {};
type CheckboxBoxProps = CheckboxBoxDOMProps & CheckboxBoxOwnProps & { as?: React.ElementType<any> };

const CheckboxBox = forwardRef<typeof BOX_DEFAULT_TAG, CheckboxBoxProps>(function CheckboxBox(
  props,
  forwardedRef
) {
  const { as: Comp = BOX_DEFAULT_TAG, ...checkboxBoxProps } = props;

  return <Comp ref={forwardedRef} {...checkboxBoxProps} />;
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
type CheckboxIconProps = CheckboxIconDOMProps &
  CheckboxIconOwnProps & { as?: React.ElementType<any> };

const CheckboxIcon = forwardRef<typeof ICON_DEFAULT_TAG, CheckboxIconProps>(function CheckboxIcon(
  props,
  forwardedRef
) {
  let { as: Comp = ICON_DEFAULT_TAG, children, ...checkboxBoxProps } = props;
  let { checked } = React.useContext(CheckboxContext);
  return (
    <Comp ref={forwardedRef} {...checkboxBoxProps}>
      {isFunction(children) ? children({ checked }) : children}
    </Comp>
  );
});

CheckboxIcon.displayName = 'Checkbox.Icon';

/* -------------------------------------------------------------------------------------------------
 * Checkbox
 * -----------------------------------------------------------------------------------------------*/

interface ICheckbox extends React.ForwardRefExoticComponent<CheckboxInputProps> {
  Container: typeof CheckboxContainer;
  Input: typeof CheckboxInput;
  Icon: typeof CheckboxIcon;
  Box: typeof CheckboxBox;
}

const CHECKBOX_DEFAULT_TAG = 'input';

type CheckboxDOMProps = CheckboxContainerDOMProps;
type CheckboxOwnProps = CheckboxContainerOwnProps;
type CheckboxProps = CheckboxDOMProps & CheckboxOwnProps;

const Checkbox = forwardRef<typeof CHECKBOX_DEFAULT_TAG, CheckboxInputProps>(function Checkbox(
  props,
  forwardedRef
) {
  const { children, ...cotainerProps } = props;
  return (
    <CheckboxContainer {...cotainerProps}>
      {({ checked }) => (
        <CheckboxInput ref={forwardedRef}>
          <CheckboxBox>
            <CheckboxIcon>{isFunction(children) ? children({ checked }) : children}</CheckboxIcon>
          </CheckboxBox>
        </CheckboxInput>
      )}
    </CheckboxContainer>
  );
}) as ICheckbox;
Checkbox.Container = CheckboxContainer;
Checkbox.Input = CheckboxInput;
Checkbox.Box = CheckboxBox;
Checkbox.Icon = CheckboxIcon;

const styles = {
  container: {
    ...cssReset(CONTAINER_DEFAULT_TAG),
    position: 'relative',
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
  'container.state.checked[icon]': {
    opacity: 1,
  },
};

export type {
  CheckboxContainerProps,
  CheckboxInputProps,
  CheckboxBoxProps,
  CheckboxIconProps,
  CheckboxProps,
};
export { Checkbox, styles };
