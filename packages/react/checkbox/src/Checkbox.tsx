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
    onCheckedChange?(checked: CheckedState): void;
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
  const [button, setButton] = React.useState<HTMLButtonElement | null>(null);
  const composedRefs = useComposedRefs(forwardedRef, (node) => setButton(node));
  const buttonSize = useSize(button);
  const labelId = useLabelContext(button);
  const labelledBy = ariaLabelledby || labelId;
  const isPropagationStoppedRef = React.useRef(false);
  const [checked = false, setChecked] = useControllableState({
    prop: checkedProp,
    defaultProp: defaultChecked,
    onChange: onCheckedChange,
  });

  return (
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
        onClick={composeEventHandlers(props.onClick, (event) => {
          isPropagationStoppedRef.current = event.isPropagationStopped();
          setChecked((prevChecked) => (prevChecked === 'indeterminate' ? true : !prevChecked));
        })}
      />
      <BubbleInput
        bubbles={!isPropagationStoppedRef.current}
        name={name}
        value={value}
        checked={checked}
        required={required}
        disabled={disabled}
        style={{
          position: 'absolute',
          pointerEvents: 'none',
          opacity: 0,
          margin: 0,
          marginLeft: -(buttonSize?.width || 0),
          ...buttonSize,
        }}
      />
    </CheckboxProvider>
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
        style={{ pointerEvents: 'none', ...props.style }}
      />
    </Presence>
  );
}) as CheckboxIndicatorPrimitive;

CheckboxIndicator.displayName = INDICATOR_NAME;

/* ---------------------------------------------------------------------------------------------- */

type BubbleCheckedProps = Omit<React.ComponentProps<'input'>, 'checked'> & {
  checked: CheckedState;
  bubbles: boolean;
};

const BubbleInput = (props: BubbleCheckedProps) => {
  const { bubbles, checked, ...inputProps } = props;
  const ref = React.useRef<HTMLInputElement>(null);

  // Bubble checked change to parents (e.g form change event)
  React.useEffect(() => {
    const input = ref.current!;
    const inputProto = window.HTMLInputElement.prototype;
    const isIndeterminate = checked === 'indeterminate';
    const event = new Event('click', { bubbles });
    const descriptor = Object.getOwnPropertyDescriptor(inputProto, 'checked') as PropertyDescriptor;
    const setChecked = descriptor.set;
    if (setChecked) {
      input.indeterminate = isIndeterminate;
      setChecked.call(input, isIndeterminate ? false : checked);
      input.dispatchEvent(event);
    }
  }, [checked, bubbles]);

  return <input type="checkbox" {...inputProps} ref={ref} />;
};

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
