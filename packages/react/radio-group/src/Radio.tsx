import * as React from 'react';
import {
  createContextObj,
  composeEventHandlers,
  useControlledState,
  useComposedRefs,
} from '@radix-ui/react-utils';
import { Presence } from '@radix-ui/react-presence';
import { Primitive } from '@radix-ui/react-primitive';
import { useLabelContext } from '@radix-ui/react-label';
import { getSelector } from '@radix-ui/utils';

import type * as Polymorphic from '@radix-ui/react-polymorphic';

/* -------------------------------------------------------------------------------------------------
 * Radio
 * -----------------------------------------------------------------------------------------------*/

const RADIO_NAME = 'Radio';
const RADIO_DEFAULT_TAG = 'button';

type InputDOMProps = React.ComponentProps<'input'>;
type RadioOwnProps = Polymorphic.Merge<
  Polymorphic.OwnProps<typeof Primitive>,
  {
    checked?: boolean;
    defaultChecked?: boolean;
    required?: InputDOMProps['required'];
    readOnly?: InputDOMProps['readOnly'];
    onCheckedChange?: InputDOMProps['onChange'];
  }
>;

type RadioPrimitive = Polymorphic.ForwardRefComponent<typeof RADIO_DEFAULT_TAG, RadioOwnProps>;

type RadioContextValue = { checked: boolean; disabled?: boolean };

const [RadioProvider, useRadioContext] = createContextObj<RadioContextValue>(RADIO_NAME);

const Radio = React.forwardRef((props, forwardedRef) => {
  const {
    as = RADIO_DEFAULT_TAG,
    selector = getSelector(RADIO_NAME),
    'aria-labelledby': ariaLabelledby,
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
      <RadioProvider checked={checked} disabled={disabled}>
        <Primitive
          type="button"
          role="radio"
          aria-checked={checked}
          aria-labelledby={labelledBy}
          data-state={getState(checked)}
          data-readonly={readOnly}
          data-disabled={disabled ? '' : undefined}
          {...radioProps}
          as={as}
          selector={selector}
          ref={ref}
          disabled={disabled}
          value={value}
          /**
           * The `input` is hidden, so when the button is clicked we trigger
           * the input manually
           */
          onClick={composeEventHandlers(props.onClick, () => inputRef.current?.click(), {
            checkForDefaultPrevented: false,
          })}
        />
      </RadioProvider>
    </>
  );
}) as RadioPrimitive;

Radio.displayName = RADIO_NAME;

/* -------------------------------------------------------------------------------------------------
 * RadioIndicator
 * -----------------------------------------------------------------------------------------------*/

const INDICATOR_NAME = 'RadioIndicator';
const INDICATOR_DEFAULT_TAG = 'span';

type RadioIndicatorOwnProps = Polymorphic.Merge<
  Polymorphic.OwnProps<typeof Primitive>,
  {
    /**
     * Used to force mounting when more control is needed. Useful when
     * controlling animation with React animation libraries.
     */
    forceMount?: true;
  }
>;

type RadioIndicatorPrimitive = Polymorphic.ForwardRefComponent<
  typeof INDICATOR_DEFAULT_TAG,
  RadioIndicatorOwnProps
>;

const RadioIndicator = React.forwardRef((props, forwardedRef) => {
  const {
    as = INDICATOR_DEFAULT_TAG,
    selector = getSelector(INDICATOR_NAME),
    forceMount,
    ...indicatorProps
  } = props;
  const context = useRadioContext(INDICATOR_NAME);
  return (
    <Presence present={forceMount || context.checked}>
      <Primitive
        data-state={getState(context.checked)}
        data-disabled={context.disabled ? '' : undefined}
        {...indicatorProps}
        as={as}
        selector={selector}
        ref={forwardedRef}
      />
    </Presence>
  );
}) as RadioIndicatorPrimitive;

RadioIndicator.displayName = INDICATOR_NAME;

/* ---------------------------------------------------------------------------------------------- */

function getState(checked: boolean) {
  return checked ? 'checked' : 'unchecked';
}

export { Radio, RadioIndicator };
