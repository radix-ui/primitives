import * as React from 'react';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import { createContext } from '@radix-ui/react-context';
import { composeEventHandlers } from '@radix-ui/primitive';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { useSize } from '@radix-ui/react-use-size';
import { useLabelContext } from '@radix-ui/react-label';
import { Presence } from '@radix-ui/react-presence';
import { Primitive } from '@radix-ui/react-primitive';

import type * as Polymorphic from '@radix-ui/react-polymorphic';

/* -------------------------------------------------------------------------------------------------
 * Checkbox
 * -----------------------------------------------------------------------------------------------*/

const CHECKBOX_NAME = 'Checkbox';
const CHECKBOX_DEFAULT_TAG = 'button';

type CheckedState = boolean | 'indeterminate';
type InputDOMProps = React.ComponentProps<'input'>;
type CheckboxOwnProps = Polymorphic.Merge<
  Polymorphic.OwnProps<typeof Primitive>,
  {
    checked?: CheckedState;
    defaultChecked?: CheckedState;
    required?: InputDOMProps['required'];
    onCheckedChange?: InputDOMProps['onChange'];
  }
>;

type CheckboxPrimitive = Polymorphic.ForwardRefComponent<
  typeof CHECKBOX_DEFAULT_TAG,
  CheckboxOwnProps
>;

type CheckboxContextValue = {
  state: CheckedState;
  disabled?: boolean;
};

const [CheckboxProvider, useCheckboxContext] = createContext<CheckboxContextValue>(CHECKBOX_NAME);

const Checkbox = React.forwardRef((props, forwardedRef) => {
  const {
    as = CHECKBOX_DEFAULT_TAG,
    'aria-labelledby': ariaLabelledby,
    name,
    checked: checkedProp,
    defaultChecked,
    required,
    disabled,
    value = 'on',
    onCheckedChange,
    ...checkboxProps
  } = props;
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [button, setButton] = React.useState<HTMLButtonElement | null>(null);
  const composedRefs = useComposedRefs(forwardedRef, (node) => setButton(node));
  const buttonSize = useSize(button);
  const labelId = useLabelContext(button);
  const labelledBy = ariaLabelledby || labelId;
  const [checked = false, setChecked] = useControllableState({
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
        value={value}
        style={{
          position: 'absolute',
          pointerEvents: 'none',
          opacity: 0,
          margin: 0,
          ...buttonSize,
        }}
        onChange={composeEventHandlers(onCheckedChange, (event) => {
          setChecked(event.target.checked);
        })}
      />
      <CheckboxProvider state={checked} disabled={disabled}>
        <Primitive
          type="button"
          role="checkbox"
          aria-checked={checked === 'indeterminate' ? 'mixed' : checked}
          aria-labelledby={labelledBy}
          aria-required={required}
          data-state={getState(checked)}
          data-disabled={disabled ? '' : undefined}
          disabled={disabled}
          value={value}
          {...checkboxProps}
          as={as}
          ref={composedRefs}
          /**
           * The `input` is hidden, so when the button is clicked we trigger
           * the input manually
           */
          onClick={composeEventHandlers(props.onClick, () => inputRef.current?.click(), {
            checkForDefaultPrevented: false,
          })}
        />
      </CheckboxProvider>
    </>
  );
}) as CheckboxPrimitive;

Checkbox.displayName = CHECKBOX_NAME;

/* -------------------------------------------------------------------------------------------------
 * CheckboxIndicator
 * -----------------------------------------------------------------------------------------------*/

const INDICATOR_NAME = 'CheckboxIndicator';
const INDICATOR_DEFAULT_TAG = 'span';

type CheckboxIndicatorOwnProps = Polymorphic.Merge<
  Polymorphic.OwnProps<typeof Primitive>,
  {
    /**
     * Used to force mounting when more control is needed. Useful when
     * controlling animation with React animation libraries.
     */
    forceMount?: true;
  }
>;

type CheckboxIndicatorPrimitive = Polymorphic.ForwardRefComponent<
  typeof INDICATOR_DEFAULT_TAG,
  CheckboxIndicatorOwnProps
>;

const CheckboxIndicator = React.forwardRef((props, forwardedRef) => {
  const { as = INDICATOR_DEFAULT_TAG, forceMount, ...indicatorProps } = props;
  const context = useCheckboxContext(INDICATOR_NAME);
  return (
    <Presence present={forceMount || context.state === 'indeterminate' || context.state === true}>
      <Primitive
        data-state={getState(context.state)}
        data-disabled={context.disabled ? '' : undefined}
        {...indicatorProps}
        as={as}
        ref={forwardedRef}
      />
    </Presence>
  );
}) as CheckboxIndicatorPrimitive;

CheckboxIndicator.displayName = INDICATOR_NAME;

/* ---------------------------------------------------------------------------------------------- */

function getState(checked: CheckedState) {
  return checked === 'indeterminate' ? 'indeterminate' : checked ? 'checked' : 'unchecked';
}

const Root = Checkbox;
const Indicator = CheckboxIndicator;

export {
  Checkbox,
  CheckboxIndicator,
  //
  Root,
  Indicator,
};
export type { CheckboxPrimitive, CheckboxIndicatorPrimitive };
