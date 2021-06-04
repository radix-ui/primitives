import * as React from 'react';
import { composeEventHandlers } from '@radix-ui/primitive';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import { createContext } from '@radix-ui/react-context';
import { useSize } from '@radix-ui/react-use-size';
import { usePrevious } from '@radix-ui/react-use-previous';
import { Presence } from '@radix-ui/react-presence';
import { Primitive } from '@radix-ui/react-primitive';
import { useLabelContext } from '@radix-ui/react-label';

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
    required?: InputDOMProps['required'];
    onCheck?(): void;
  }
>;

type RadioPrimitive = Polymorphic.ForwardRefComponent<typeof RADIO_DEFAULT_TAG, RadioOwnProps>;

type RadioContextValue = { checked: boolean; disabled?: boolean };

const [RadioProvider, useRadioContext] = createContext<RadioContextValue>(RADIO_NAME);

const Radio = React.forwardRef((props, forwardedRef) => {
  const {
    as = RADIO_DEFAULT_TAG,
    'aria-labelledby': ariaLabelledby,
    name,
    checked = false,
    required,
    disabled,
    value = 'on',
    onCheck,
    ...radioProps
  } = props;
  const [button, setButton] = React.useState<HTMLButtonElement | null>(null);
  const composedRefs = useComposedRefs(forwardedRef, (node) => setButton(node));
  const labelId = useLabelContext(button);
  const labelledBy = ariaLabelledby || labelId;
  const hasConsumerStoppedPropagationRef = React.useRef(false);
  // We set this to true by default so that events bubble to forms without JS (SSR)
  const isFormControl = button ? Boolean(button.closest('form')) : true;

  return (
    <RadioProvider checked={checked} disabled={disabled}>
      <Primitive
        type="button"
        role="radio"
        aria-checked={checked}
        aria-labelledby={labelledBy}
        data-state={getState(checked)}
        data-disabled={disabled ? '' : undefined}
        disabled={disabled}
        value={value}
        {...radioProps}
        as={as}
        ref={composedRefs}
        onClick={composeEventHandlers(props.onClick, (event) => {
          // radios cannot be unchecked so we only communicate a checked state
          if (!checked) onCheck?.();
          if (isFormControl) {
            hasConsumerStoppedPropagationRef.current = event.isPropagationStopped();
            // if radio is in a form, stop propagation from the button so that we only propagate
            // one click event (from the input). We propagate changes from an input so that native
            // form validation works and form events reflect radio updates.
            if (!hasConsumerStoppedPropagationRef.current) event.stopPropagation();
          }
        })}
      />
      {isFormControl && (
        <BubbleInput
          control={button}
          stoppedPropagation={hasConsumerStoppedPropagationRef.current}
          name={name}
          value={value}
          checked={checked}
          required={required}
          disabled={disabled}
          // We transform because the input is absolutely positioned but we have
          // rendered it **after** the button. This pulls it back to sit on top
          // of the button.
          style={{ transform: 'translateX(-100%)' }}
        />
      )}
    </RadioProvider>
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
  const { as = INDICATOR_DEFAULT_TAG, forceMount, ...indicatorProps } = props;
  const context = useRadioContext(INDICATOR_NAME);
  return (
    <Presence present={forceMount || context.checked}>
      <Primitive
        data-state={getState(context.checked)}
        data-disabled={context.disabled ? '' : undefined}
        {...indicatorProps}
        as={as}
        ref={forwardedRef}
      />
    </Presence>
  );
}) as RadioIndicatorPrimitive;

RadioIndicator.displayName = INDICATOR_NAME;

/* ---------------------------------------------------------------------------------------------- */

type BubbleInputProps = Omit<React.ComponentProps<'input'>, 'checked'> & {
  checked: boolean;
  control: HTMLElement | null;
  stoppedPropagation: boolean;
};

const BubbleInput = (props: BubbleInputProps) => {
  const { control, checked, stoppedPropagation, ...inputProps } = props;
  const ref = React.useRef<HTMLInputElement>(null);
  const prevChecked = usePrevious(checked);
  const controlSize = useSize(control);

  // Bubble checked change to parents (e.g form change event)
  React.useEffect(() => {
    const input = ref.current!;
    const inputProto = window.HTMLInputElement.prototype;
    const descriptor = Object.getOwnPropertyDescriptor(inputProto, 'checked') as PropertyDescriptor;
    const setChecked = descriptor.set;
    if (!stoppedPropagation && prevChecked !== checked && setChecked) {
      const event = new Event('click', { bubbles: true });
      setChecked.call(input, checked);
      input.dispatchEvent(event);
    }
  }, [prevChecked, checked, stoppedPropagation]);

  return (
    <input
      type="radio"
      {...inputProps}
      tabIndex={-1}
      ref={ref}
      style={{
        ...props.style,
        ...controlSize,
        position: 'absolute',
        pointerEvents: 'none',
        opacity: 0,
        margin: 0,
      }}
    />
  );
};

function getState(checked: boolean) {
  return checked ? 'checked' : 'unchecked';
}

export { Radio, RadioIndicator };
export type { RadioPrimitive, RadioIndicatorPrimitive };
