import * as React from 'react';
import { composeEventHandlers } from '@radix-ui/primitive';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import { createContextScope } from '@radix-ui/react-context';
import { useSize } from '@radix-ui/react-use-size';
import { usePrevious } from '@radix-ui/react-use-previous';
import { Presence } from '@radix-ui/react-presence';
import { Primitive } from '@radix-ui/react-primitive';

import type * as Radix from '@radix-ui/react-primitive';
import type { Scope } from '@radix-ui/react-context';

/* -------------------------------------------------------------------------------------------------
 * Radio
 * -----------------------------------------------------------------------------------------------*/

const RADIO_NAME = 'Radio';

type ScopedProps<P> = P & { __scopeRadio?: Scope };
const [createRadioContext, createRadioScope] = createContextScope(RADIO_NAME);

type RadioContextValue = { checked: boolean; disabled?: boolean };
const [RadioProvider, useRadioContext] = createRadioContext<RadioContextValue>(RADIO_NAME);

type RadioElement = React.ElementRef<typeof Primitive.button>;
type PrimitiveButtonProps = Radix.ComponentPropsWithoutRef<typeof Primitive.button>;
interface RadioProps extends PrimitiveButtonProps {
  checked?: boolean;
  required?: boolean;
  onCheck?(): void;
}

const Radio = React.forwardRef<RadioElement, RadioProps>(
  (props: ScopedProps<RadioProps>, forwardedRef) => {
    const {
      __scopeRadio,
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
    const hasConsumerStoppedPropagationRef = React.useRef(false);
    // We set this to true by default so that events bubble to forms without JS (SSR)
    const isFormControl = button ? Boolean(button.closest('form')) : true;

    return (
      <RadioProvider scope={__scopeRadio} checked={checked} disabled={disabled}>
        <Primitive.button
          type="button"
          role="radio"
          aria-checked={checked}
          data-state={getState(checked)}
          data-disabled={disabled ? '' : undefined}
          disabled={disabled}
          value={value}
          {...radioProps}
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
            bubbles={!hasConsumerStoppedPropagationRef.current}
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
  }
);

Radio.displayName = RADIO_NAME;

/* -------------------------------------------------------------------------------------------------
 * RadioIndicator
 * -----------------------------------------------------------------------------------------------*/

const INDICATOR_NAME = 'RadioIndicator';

type RadioIndicatorElement = React.ElementRef<typeof Primitive.span>;
type PrimitiveSpanProps = Radix.ComponentPropsWithoutRef<typeof Primitive.span>;
export interface RadioIndicatorProps extends PrimitiveSpanProps {
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: true;
}

const RadioIndicator = React.forwardRef<RadioIndicatorElement, RadioIndicatorProps>(
  (props: ScopedProps<RadioIndicatorProps>, forwardedRef) => {
    const { __scopeRadio, forceMount, ...indicatorProps } = props;
    const context = useRadioContext(INDICATOR_NAME, __scopeRadio);
    return (
      <Presence present={forceMount || context.checked}>
        <Primitive.span
          data-state={getState(context.checked)}
          data-disabled={context.disabled ? '' : undefined}
          {...indicatorProps}
          ref={forwardedRef}
        />
      </Presence>
    );
  }
);

RadioIndicator.displayName = INDICATOR_NAME;

/* ---------------------------------------------------------------------------------------------- */

type InputProps = Radix.ComponentPropsWithoutRef<'input'>;
interface BubbleInputProps extends Omit<InputProps, 'checked'> {
  checked: boolean;
  control: HTMLElement | null;
  bubbles: boolean;
}

const BubbleInput = (props: BubbleInputProps) => {
  const { control, checked, bubbles = true, ...inputProps } = props;
  const ref = React.useRef<HTMLInputElement>(null);
  const prevChecked = usePrevious(checked);
  const controlSize = useSize(control);

  // Bubble checked change to parents (e.g form change event)
  React.useEffect(() => {
    const input = ref.current!;
    const inputProto = window.HTMLInputElement.prototype;
    const descriptor = Object.getOwnPropertyDescriptor(inputProto, 'checked') as PropertyDescriptor;
    const setChecked = descriptor.set;
    if (prevChecked !== checked && setChecked) {
      const event = new Event('click', { bubbles });
      setChecked.call(input, checked);
      input.dispatchEvent(event);
    }
  }, [prevChecked, checked, bubbles]);

  return (
    <input
      type="radio"
      aria-hidden
      defaultChecked={checked}
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

export {
  createRadioScope,
  //
  Radio,
  RadioIndicator,
};
export type { RadioProps };
