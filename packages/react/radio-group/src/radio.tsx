import * as React from 'react';
import { composeEventHandlers } from '@radix-ui/primitive';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import { createContextScope } from '@radix-ui/react-context';
import { useSize } from '@radix-ui/react-use-size';
import { Presence } from '@radix-ui/react-presence';
import { Primitive } from '@radix-ui/react-primitive';

import type { Scope } from '@radix-ui/react-context';

const RADIO_NAME = 'Radio';

type ScopedProps<P> = P & { __scopeRadio?: Scope };
const [createRadioContext, createRadioScope] = createContextScope(RADIO_NAME);

type RadioContextValue = {
  checked: boolean;
  disabled: boolean | undefined;
  required: boolean | undefined;
  name: string | undefined;
  form: string | undefined;
  value: string | number | readonly string[];
  control: HTMLButtonElement | null;
  setControl: React.Dispatch<React.SetStateAction<HTMLButtonElement | null>>;
  hasConsumerStoppedPropagationRef: React.RefObject<boolean>;
  userInteractionCount: number;
  onUserInteraction: () => void;
  isFormControl: boolean;
  bubbleInput: HTMLInputElement | null;
  setBubbleInput: React.Dispatch<React.SetStateAction<HTMLInputElement | null>>;
  onCheck(): void;
};

const [RadioProviderImpl, useRadioContext] = createRadioContext<RadioContextValue>(RADIO_NAME);

/* -------------------------------------------------------------------------------------------------
 * RadioProvider
 * -----------------------------------------------------------------------------------------------*/

interface RadioProviderProps {
  checked?: boolean;
  required?: boolean;
  disabled?: boolean;
  name?: string;
  form?: string;
  value?: string | number | readonly string[];
  onCheck?(): void;
  children?: React.ReactNode;
}

function RadioProvider(props: ScopedProps<RadioProviderProps>) {
  const {
    __scopeRadio,
    checked = false,
    children,
    disabled,
    form,
    name,
    onCheck,
    required,
    value = 'on',
    // @ts-expect-error
    internal_do_not_use_render,
  } = props;

  const [control, setControl] = React.useState<HTMLButtonElement | null>(null);
  const [bubbleInput, setBubbleInput] = React.useState<HTMLInputElement | null>(null);
  const hasConsumerStoppedPropagationRef = React.useRef(false);

  // Incremented on every user interaction with the trigger. The bubble input
  // compares this against the value it last handled to tell whether a `checked`
  // change was driven by the user (vs. a controlled/programmatic update). Using
  // a counter guarantees the marker is updated in the same commit as the
  // resulting render, so it can never go stale and leak into a later
  // programmatic update.
  const [userInteractionCount, onUserInteraction] = React.useReducer(
    (count: number): number => count + 1,
    0,
  );

  const isFormControl = control
    ? !!form || !!control.closest('form')
    : // We set this to true by default so that events bubble to forms without JS (SSR)
      true;

  const context: RadioContextValue = {
    checked,
    disabled,
    required,
    name,
    form,
    value,
    control,
    setControl,
    hasConsumerStoppedPropagationRef,
    userInteractionCount,
    onUserInteraction,
    isFormControl,
    bubbleInput,
    setBubbleInput,
    onCheck: () => onCheck?.(),
  };

  return (
    <RadioProviderImpl scope={__scopeRadio} {...context}>
      {isFunction(internal_do_not_use_render) ? internal_do_not_use_render(context) : children}
    </RadioProviderImpl>
  );
}

/* -------------------------------------------------------------------------------------------------
 * RadioTrigger
 * -----------------------------------------------------------------------------------------------*/

const TRIGGER_NAME = 'RadioTrigger';

interface RadioTriggerProps extends Omit<
  React.ComponentPropsWithoutRef<typeof Primitive.button>,
  keyof RadioProviderProps
> {
  children?: React.ReactNode;
}

const RadioTrigger = React.forwardRef<HTMLButtonElement, RadioTriggerProps>(
  ({ __scopeRadio, onClick, ...radioProps }: ScopedProps<RadioTriggerProps>, forwardedRef) => {
    const {
      checked,
      disabled,
      value,
      setControl,
      onCheck,
      hasConsumerStoppedPropagationRef,
      onUserInteraction,
      isFormControl,
      bubbleInput,
    } = useRadioContext(TRIGGER_NAME, __scopeRadio);
    const composedRefs = useComposedRefs(forwardedRef, setControl);

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
        onClick={composeEventHandlers(onClick, (event) => {
          // radios cannot be unchecked so we only communicate a checked state.
          // Only mark a user interaction when the click actually changes the
          // value, otherwise re-selecting the checked radio would leave a stale
          // interaction marker.
          if (!checked) {
            onUserInteraction();
            onCheck();
          }

          if (bubbleInput && isFormControl) {
            hasConsumerStoppedPropagationRef.current = event.isPropagationStopped();
            // if radio has a bubble input and is a form control, stop propagation
            // from the button so that we only propagate one click event (from the
            // input). We propagate changes from an input so that native form
            // validation works and form events reflect radio updates.
            if (!hasConsumerStoppedPropagationRef.current) event.stopPropagation();
          }
        })}
      />
    );
  },
);

RadioTrigger.displayName = TRIGGER_NAME;

/* -------------------------------------------------------------------------------------------------
 * Radio
 * -----------------------------------------------------------------------------------------------*/

type RadioElement = React.ComponentRef<typeof Primitive.button>;
type PrimitiveButtonProps = React.ComponentPropsWithoutRef<typeof Primitive.button>;
interface RadioProps extends Omit<PrimitiveButtonProps, 'checked'> {
  checked?: boolean;
  required?: boolean;
  onCheck?(): void;
}

const Radio = React.forwardRef<RadioElement, RadioProps>(
  (props: ScopedProps<RadioProps>, forwardedRef) => {
    const { __scopeRadio, name, checked, required, disabled, value, onCheck, form, ...radioProps } =
      props;

    return (
      <RadioProvider
        __scopeRadio={__scopeRadio}
        checked={checked}
        disabled={disabled}
        required={required}
        onCheck={onCheck}
        name={name}
        form={form}
        value={value}
        // @ts-expect-error
        internal_do_not_use_render={({ isFormControl }: RadioContextValue) => (
          <>
            <RadioTrigger
              {...radioProps}
              ref={forwardedRef}
              // @ts-expect-error
              __scopeRadio={__scopeRadio}
            />
            {isFormControl && (
              <RadioBubbleInput
                // @ts-expect-error
                __scopeRadio={__scopeRadio}
              />
            )}
          </>
        )}
      />
    );
  },
);

Radio.displayName = RADIO_NAME;

/* -------------------------------------------------------------------------------------------------
 * RadioIndicator
 * -----------------------------------------------------------------------------------------------*/

const INDICATOR_NAME = 'RadioIndicator';

type RadioIndicatorElement = React.ComponentRef<typeof Primitive.span>;
type PrimitiveSpanProps = React.ComponentPropsWithoutRef<typeof Primitive.span>;
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
  },
);

RadioIndicator.displayName = INDICATOR_NAME;

/* -------------------------------------------------------------------------------------------------
 * RadioBubbleInput
 * -----------------------------------------------------------------------------------------------*/

const BUBBLE_INPUT_NAME = 'RadioBubbleInput';

type InputProps = React.ComponentPropsWithoutRef<typeof Primitive.input>;
interface RadioBubbleInputProps extends Omit<InputProps, 'checked'> {}

const RadioBubbleInput = React.forwardRef<HTMLInputElement, RadioBubbleInputProps>(
  ({ __scopeRadio, onClick, ...props }: ScopedProps<RadioBubbleInputProps>, forwardedRef) => {
    const {
      control,
      checked,
      required,
      disabled,
      name,
      value,
      form,
      bubbleInput,
      setBubbleInput,
      hasConsumerStoppedPropagationRef,
      userInteractionCount,
    } = useRadioContext(BUBBLE_INPUT_NAME, __scopeRadio);

    const composedRefs = useComposedRefs(forwardedRef, setBubbleInput);
    const controlSize = useSize(control);
    // When the checked change is not driven by a user interaction (e.g. a
    // controlled `checked` update), the `click` event we dispatch to notify
    // forms must not reach ancestor `onClick` handlers. We can't simply make it
    // non-bubbling because React derives the radio's `change` event from a
    // bubbling `click`. Instead we stop propagation of the synthetic click,
    // which still lets the `change` event reach the form.
    const shouldStopClickPropagationRef = React.useRef(false);
    // The `checked` value we last synced to the input, and the interaction
    // counter we last accounted for. Comparing against these lets us detect a
    // genuine `checked` change and whether it followed a user interaction, even
    // on renders caused by clicks that don't change `checked` (e.g. re-selecting
    // a checked radio, or a controlled value that ignores the change).
    const prevCheckedRef = React.useRef(checked);
    const prevUserInteractionCountRef = React.useRef(userInteractionCount);

    // Bubble checked change to parents (e.g form change event)
    React.useEffect(() => {
      const input = bubbleInput;
      if (!input) return;

      const inputProto = window.HTMLInputElement.prototype;
      const descriptor = Object.getOwnPropertyDescriptor(
        inputProto,
        'checked',
      ) as PropertyDescriptor;
      const setChecked = descriptor.set;

      const isUserInteraction = userInteractionCount !== prevUserInteractionCountRef.current;
      prevUserInteractionCountRef.current = userInteractionCount;
      const checkedChanged = prevCheckedRef.current !== checked;
      prevCheckedRef.current = checked;

      const bubbles = !(isUserInteraction && hasConsumerStoppedPropagationRef.current);
      if (checkedChanged && setChecked) {
        shouldStopClickPropagationRef.current = !isUserInteraction;
        const event = new Event('click', { bubbles });
        setChecked.call(input, checked);
        input.dispatchEvent(event);
        shouldStopClickPropagationRef.current = false;
      }
    }, [bubbleInput, checked, hasConsumerStoppedPropagationRef, userInteractionCount]);

    const defaultCheckedRef = React.useRef(checked);
    return (
      <Primitive.input
        type="radio"
        aria-hidden
        defaultChecked={defaultCheckedRef.current}
        required={required}
        disabled={disabled}
        name={name}
        value={value}
        form={form}
        {...props}
        tabIndex={-1}
        ref={composedRefs}
        onClick={composeEventHandlers(onClick, (event) => {
          // Prevent the synthetic click dispatched on controlled/programmatic
          // updates from triggering ancestor `onClick` handlers, while still
          // allowing the resulting `change` event to reach the form.
          if (shouldStopClickPropagationRef.current) {
            event.stopPropagation();
          }
        })}
        style={{
          ...props.style,
          ...controlSize,
          position: 'absolute',
          pointerEvents: 'none',
          opacity: 0,
          margin: 0,
          // We transform because the input is absolutely positioned but we have
          // rendered it **after** the button. This pulls it back to sit on top
          // of the button.
          transform: 'translateX(-100%)',
        }}
      />
    );
  },
);

RadioBubbleInput.displayName = BUBBLE_INPUT_NAME;

/* ---------------------------------------------------------------------------------------------- */

function isFunction(value: unknown): value is (...args: any[]) => any {
  return typeof value === 'function';
}

function getState(checked: boolean) {
  return checked ? 'checked' : 'unchecked';
}

export {
  createRadioScope,
  useRadioContext,
  //
  Radio,
  RadioProvider,
  RadioTrigger,
  RadioIndicator,
  RadioBubbleInput,
};
export type { RadioProps, RadioProviderProps, RadioTriggerProps, RadioBubbleInputProps };
