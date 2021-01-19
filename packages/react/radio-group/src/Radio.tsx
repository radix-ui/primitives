import * as React from 'react';
import {
  createContext,
  composeEventHandlers,
  useControlledState,
  useComposedRefs,
} from '@radix-ui/react-utils';
import { forwardRefWithAs } from '@radix-ui/react-polymorphic';
import { Presence } from '@radix-ui/react-presence';
import { Primitive } from '@radix-ui/react-primitive';
import { useLabelContext } from '@radix-ui/react-label';
import { getSelector } from '@radix-ui/utils';

import type { MergeOwnProps } from '@radix-ui/react-polymorphic';

/* -------------------------------------------------------------------------------------------------
 * Radio
 * -----------------------------------------------------------------------------------------------*/

const RADIO_NAME = 'Radio';
const RADIO_DEFAULT_TAG = 'button';

type InputDOMProps = React.ComponentProps<'input'>;
type RadioOwnProps = {
  checked?: boolean;
  defaultChecked?: boolean;
  required?: InputDOMProps['required'];
  readOnly?: InputDOMProps['readOnly'];
  onCheckedChange?: InputDOMProps['onChange'];
  onChange: never;
};

const [RadioContext, useRadioContext] = createContext<boolean>(RADIO_NAME + 'Context', RADIO_NAME);

const Radio = forwardRefWithAs<
  typeof RADIO_DEFAULT_TAG,
  MergeOwnProps<typeof Primitive, RadioOwnProps>
>((props, forwardedRef) => {
  const {
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
      <Primitive
        as={RADIO_DEFAULT_TAG}
        selector={getSelector(RADIO_NAME)}
        type="button"
        {...radioProps}
        ref={ref}
        role="radio"
        aria-checked={checked}
        aria-labelledby={labelledBy}
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
        <RadioContext.Provider value={checked}>{children}</RadioContext.Provider>
      </Primitive>
    </>
  );
});

Radio.displayName = RADIO_NAME;

/* -------------------------------------------------------------------------------------------------
 * RadioIndicator
 * -----------------------------------------------------------------------------------------------*/

const INDICATOR_NAME = 'RadioIndicator';
const INDICATOR_DEFAULT_TAG = 'span';

type RadioIndicatorOwnProps = {
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: true;
};

const RadioIndicator = forwardRefWithAs<
  typeof INDICATOR_DEFAULT_TAG,
  MergeOwnProps<typeof Primitive, RadioIndicatorOwnProps>
>((props, forwardedRef) => {
  const { forceMount, ...indicatorProps } = props;
  const checked = useRadioContext(INDICATOR_NAME);
  return (
    <Presence present={forceMount || checked}>
      <Primitive
        as={INDICATOR_DEFAULT_TAG}
        selector={getSelector(INDICATOR_NAME)}
        {...indicatorProps}
        data-state={getState(checked)}
        ref={forwardedRef}
      />
    </Presence>
  );
});

RadioIndicator.displayName = INDICATOR_NAME;

/* ---------------------------------------------------------------------------------------------- */

function getState(checked: boolean) {
  return checked ? 'checked' : 'unchecked';
}

export { Radio, RadioIndicator };
