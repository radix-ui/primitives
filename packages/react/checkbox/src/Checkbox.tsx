import * as React from 'react';
import { getPartDataAttrObj } from '@interop-ui/utils';
import {
  createContext,
  composeEventHandlers,
  useControlledState,
  useComposedRefs,
} from '@interop-ui/react-utils';
import { forwardRefWithAs } from '@interop-ui/react-polymorphic';
import { useLabelContext } from '@interop-ui/react-label';

/* -------------------------------------------------------------------------------------------------
 * Checkbox
 * -----------------------------------------------------------------------------------------------*/

const CHECKBOX_NAME = 'Checkbox';
const CHECKBOX_DEFAULT_TAG = 'button';

type CheckedState = boolean | 'indeterminate';
type InputDOMProps = React.ComponentProps<'input'>;
type CheckboxOwnProps = {
  checked?: CheckedState;
  defaultChecked?: CheckedState;
  required?: InputDOMProps['required'];
  readOnly?: InputDOMProps['readOnly'];
  onCheckedChange?: InputDOMProps['onChange'];
  onChange?: never;
};

const [CheckboxContext, useCheckboxContext] = createContext<CheckedState>(
  CHECKBOX_NAME + 'Context',
  CHECKBOX_NAME
);

const Checkbox = forwardRefWithAs<typeof CHECKBOX_DEFAULT_TAG, CheckboxOwnProps>(
  (props, forwardedRef) => {
    const {
      as: Comp = CHECKBOX_DEFAULT_TAG,
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
      ...checkboxProps
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

    React.useEffect(() => {
      const isIndeterminate = checked === 'indeterminate';
      inputRef.current && (inputRef.current.indeterminate = isIndeterminate);
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
          type="checkbox"
          name={name}
          checked={checked === 'indeterminate' ? false : checked}
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
          {...checkboxProps}
          {...getPartDataAttrObj(CHECKBOX_NAME)}
          ref={ref}
          role="checkbox"
          aria-checked={checked === 'indeterminate' ? 'mixed' : checked}
          aria-labelledby={labelledBy}
          aria-required={required}
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
          <CheckboxContext.Provider value={checked}>{children}</CheckboxContext.Provider>
        </Comp>
      </>
    );
  }
);

Checkbox.displayName = CHECKBOX_NAME;

/* -------------------------------------------------------------------------------------------------
 * CheckboxIndicator
 * -----------------------------------------------------------------------------------------------*/

const INDICATOR_NAME = 'CheckboxIndicator';
const INDICATOR_DEFAULT_TAG = 'span';

const CheckboxIndicator = forwardRefWithAs<typeof CheckboxIndicatorImpl>((props, forwardedRef) => {
  const checked = useCheckboxContext(INDICATOR_NAME);
  return checked ? (
    <CheckboxIndicatorImpl {...props} data-state={getState(checked)} ref={forwardedRef} />
  ) : null;
});

const CheckboxIndicatorImpl = forwardRefWithAs<typeof INDICATOR_DEFAULT_TAG>(
  function CheckboxIndicatorImpl(props, forwardedRef) {
    const { as: Comp = INDICATOR_DEFAULT_TAG, ...indicatorProps } = props;
    return <Comp {...indicatorProps} {...getPartDataAttrObj(INDICATOR_NAME)} ref={forwardedRef} />;
  }
);

CheckboxIndicator.displayName = INDICATOR_NAME;

/* ---------------------------------------------------------------------------------------------- */

function getState(checked: CheckedState) {
  return checked === 'indeterminate' ? 'indeterminate' : checked ? 'checked' : 'unchecked';
}

export { Checkbox, CheckboxIndicator };
