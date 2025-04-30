import * as React from 'react';
import { composeEventHandlers } from '@radix-ui/primitive';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import { createContextScope } from '@radix-ui/react-context';
import { useSize } from '@radix-ui/react-use-size';
import { usePrevious } from '@radix-ui/react-use-previous';
import { Presence } from '@radix-ui/react-presence';
import { Primitive } from '@radix-ui/react-primitive';

import type { Scope } from '@radix-ui/react-context';

/* -------------------------------------------------------------------------------------------------
 * Radio
 * -----------------------------------------------------------------------------------------------*/

const RADIO_NAME = 'Radio';

type ScopedProps<P> = P & { __scopeRadio?: Scope };
const [createRadioContext, createRadioScope] = createContextScope(RADIO_NAME);

interface RadioContextValue {
  checked: boolean;
  disabled: boolean | undefined;
  button: HTMLButtonElement | null;
  setButton: React.Dispatch<React.SetStateAction<HTMLButtonElement | null>>;
  name: string | undefined;
  form: string | undefined;
  value: string;
  hasConsumerStoppedPropagationRef: React.RefObject<boolean>;
  required: boolean | undefined;
  isFormControl: boolean;
  bubbleInput: HTMLInputElement | null;
  setBubbleInput: React.Dispatch<React.SetStateAction<HTMLInputElement | null>>;
}
const [RadioProviderImpl, useRadioContext] = createRadioContext<RadioContextValue>(RADIO_NAME);

/* -------------------------------------------------------------------------------------------------
 * RadioProvider
 * -----------------------------------------------------------------------------------------------*/

const RadioScopeContext = React.createContext<Scope | null>(null);
RadioScopeContext.displayName = 'RadioScopeContext';

function useInternalRadioScope(displayName: string): Scope {
  const scope = React.useContext(RadioScopeContext);
  if (!scope) {
    throw new Error(
      `[${displayName}] is missing a parent <Radio.Provider /> component. Make sure to wrap your component tree with <Radio.Provider />.`
    );
  }
  return scope;
}

interface RadioProviderProps {
  checked?: boolean;
  required?: boolean;
  name?: string;
  form?: string;
  disabled?: boolean;
  value?: string;
  children?: React.ReactNode;
}

const RadioProvider = (props: ScopedProps<RadioProviderProps>) => {
  const {
    __scopeRadio,
    name,
    checked = false,
    required,
    disabled,
    value = 'on',
    form,
    children,
    // @ts-expect-error
    internal_do_not_use_render,
  } = props;
  const [button, setButton] = React.useState<HTMLButtonElement | null>(null);
  const [bubbleInput, setBubbleInput] = React.useState<HTMLInputElement | null>(null);
  const hasConsumerStoppedPropagationRef = React.useRef(false);
  const isFormControl = button
    ? !!form || !!button.closest('form')
    : // We set this to true by default so that events bubble to forms without JS (SSR)
      true;

  const context: RadioContextValue = {
    checked,
    disabled,
    button,
    setButton,
    name,
    form,
    value,
    hasConsumerStoppedPropagationRef,
    required,
    isFormControl,
    bubbleInput,
    setBubbleInput,
  };

  return (
    <RadioScopeContext.Provider value={__scopeRadio}>
      <RadioProviderImpl scope={__scopeRadio} {...context}>
        {typeof internal_do_not_use_render === 'function'
          ? internal_do_not_use_render(context)
          : children}
      </RadioProviderImpl>
    </RadioScopeContext.Provider>
  );
};

/* -------------------------------------------------------------------------------------------------
 * RadioTrigger
 * -----------------------------------------------------------------------------------------------*/

const TRIGGER_NAME = 'RadioTrigger';

interface RadioTriggerProps
  extends Omit<React.ComponentPropsWithoutRef<typeof Primitive.button>, keyof RadioProviderProps> {
  children?: React.ReactNode;
  onCheck?: () => void;
}

const RadioTrigger = React.forwardRef<HTMLButtonElement, RadioTriggerProps>(
  ({ __scopeRadio, onCheck, ...radioProps }: ScopedProps<RadioTriggerProps>, forwardedRef) => {
    const { value, disabled, checked, setButton, hasConsumerStoppedPropagationRef, isFormControl } =
      useRadioContext(TRIGGER_NAME, __scopeRadio);
    const composedRefs = useComposedRefs(forwardedRef, setButton);

    return (
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
        onClick={composeEventHandlers(radioProps.onClick, (event) => {
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
    );
  }
);

RadioTrigger.displayName = TRIGGER_NAME;

/* -------------------------------------------------------------------------------------------------
 * RadioIndicator
 * -----------------------------------------------------------------------------------------------*/

const INDICATOR_NAME = 'RadioIndicator';

type RadioIndicatorElement = React.ElementRef<typeof Primitive.span>;
type PrimitiveSpanProps = React.ComponentPropsWithoutRef<typeof Primitive.span>;
interface RadioIndicatorProps extends PrimitiveSpanProps {
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

/* -------------------------------------------------------------------------------------------------
 * RadioBubbleInput
 * -----------------------------------------------------------------------------------------------*/

const BUBBLE_INPUT_NAME = 'RadioBubbleInput';

type InputProps = React.ComponentPropsWithoutRef<typeof Primitive.input>;
interface RadioBubbleInputProps extends Omit<InputProps, 'checked'> {}

const RadioBubbleInput = React.forwardRef<HTMLInputElement, RadioBubbleInputProps>(
  ({ __scopeRadio, ...props }: ScopedProps<RadioBubbleInputProps>, forwardedRef) => {
    const {
      button,
      hasConsumerStoppedPropagationRef,
      checked,
      required,
      disabled,
      name,
      value,
      form,
      bubbleInput,
      setBubbleInput,
    } = useRadioContext(BUBBLE_INPUT_NAME, __scopeRadio);

    const composedRefs = useComposedRefs(forwardedRef, setBubbleInput);
    const prevChecked = usePrevious(checked);
    const controlSize = useSize(button);

    // Bubble checked change to parents (e.g form change event)
    React.useEffect(() => {
      const input = bubbleInput;
      if (!input) return;

      const inputProto = window.HTMLInputElement.prototype;
      const descriptor = Object.getOwnPropertyDescriptor(
        inputProto,
        'checked'
      ) as PropertyDescriptor;
      const setChecked = descriptor.set;
      if (prevChecked !== checked && setChecked) {
        const event = new Event('click', { bubbles: !hasConsumerStoppedPropagationRef.current });
        setChecked.call(input, checked);
        input.dispatchEvent(event);
      }
    }, [prevChecked, checked, hasConsumerStoppedPropagationRef, bubbleInput]);

    return (
      <Primitive.input
        type="radio"
        aria-hidden
        defaultChecked={checked}
        required={required}
        disabled={disabled}
        name={name}
        value={value}
        form={form}
        {...props}
        tabIndex={-1}
        ref={composedRefs}
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
  }
);

RadioBubbleInput.displayName = BUBBLE_INPUT_NAME;

/* ---------------------------------------------------------------------------------------------- */

function getState(checked: boolean) {
  return checked ? 'checked' : 'unchecked';
}

export {
  createRadioScope,
  useRadioContext,
  useInternalRadioScope,
  //
  RadioIndicator,
  RadioTrigger,
  RadioProvider,
  RadioBubbleInput,
  //
  RadioTrigger as Trigger,
  RadioIndicator as Indicator,
  RadioProvider as Provider,
  RadioBubbleInput as BubbleInput,
};

export type {
  RadioTriggerProps,
  RadioIndicatorProps,
  RadioProviderProps,
  RadioBubbleInputProps,
  RadioContextValue,
};
