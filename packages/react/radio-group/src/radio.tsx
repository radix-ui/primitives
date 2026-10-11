import * as React from 'react';
import { composeEventHandlers } from '@radix-ui/primitive';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import { createContextScope } from '@radix-ui/react-context';
import { useSize } from '@radix-ui/react-use-size';
import { Presence } from '@radix-ui/react-presence';
import { Primitive } from '@radix-ui/react-primitive';

import type { Scope } from '@radix-ui/react-context';

const RADIO_NAME = 'Radio';

type ScopedProps<P> = P & { __scopeRadio?: Scope | undefined };
const [createRadioContext, createRadioScope] = createContextScope(RADIO_NAME);

type RadioUserClick = {
  hasConsumerStoppedPropagation: boolean;
};

type RadioContextValue = {
  checked: boolean;
  disabled: boolean | undefined;
  required: boolean | undefined;
  name: string | undefined;
  form: string | undefined;
  value: string | number | readonly string[];
  control: HTMLButtonElement | null;
  setControl: React.Dispatch<React.SetStateAction<HTMLButtonElement | null>>;
  userClick: RadioUserClick | null;
  onUserClick: (userClick: RadioUserClick) => void;
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
  checked?: boolean | undefined;
  required?: boolean | undefined;
  disabled?: boolean | undefined;
  name?: string | undefined;
  form?: string | undefined;
  value?: string | number | readonly string[] | undefined;
  onCheck?: (() => void) | undefined;
  children?: React.ReactNode | undefined;
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
  // The latest user click on the trigger that checks the radio. The bubble
  // input dispatches the click to the form once React has handled it, whether
  // or not `checked` changes in the same render.
  const [userClick, setUserClick] = React.useState<RadioUserClick | null>(null);

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
    userClick,
    onUserClick: setUserClick,
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
  children?: React.ReactNode | undefined;
}

const RadioTrigger = /* @__PURE__ */ React.forwardRef<HTMLButtonElement, RadioTriggerProps>(
  function RadioTrigger(
    { __scopeRadio, onClick, ...radioProps }: ScopedProps<RadioTriggerProps>,
    forwardedRef,
  ) {
    const {
      checked,
      disabled,
      value,
      setControl,
      onCheck,
      onUserClick,
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
          const hasConsumerStoppedPropagation = event.isPropagationStopped();
          // radios cannot be unchecked so we only communicate a checked state.
          if (!checked) {
            onUserClick({ hasConsumerStoppedPropagation });
            onCheck();
          }

          if (bubbleInput && isFormControl) {
            // if radio has a bubble input and is a form control, stop
            // propagation from the button so that we only propagate one click
            // event (from the input). We propagate changes from an input so
            // that native form validation works and form events reflect radio
            // updates.
            if (!hasConsumerStoppedPropagation) {
              event.stopPropagation();
            }
          }
        })}
      />
    );
  },
);

/* -------------------------------------------------------------------------------------------------
 * Radio
 * -----------------------------------------------------------------------------------------------*/

type RadioElement = React.ComponentRef<typeof Primitive.button>;
type PrimitiveButtonProps = React.ComponentPropsWithoutRef<typeof Primitive.button>;
interface RadioProps extends Omit<PrimitiveButtonProps, 'checked'> {
  checked?: boolean | undefined;
  required?: boolean | undefined;
  onCheck?: (() => void) | undefined;
}

const Radio = /* @__PURE__ */ React.forwardRef<RadioElement, RadioProps>(
  // blank line to reduce diff noise
  function Radio(props: ScopedProps<RadioProps>, forwardedRef) {
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
  forceMount?: true | undefined;
}

const RadioIndicator = /* @__PURE__ */ React.forwardRef<RadioIndicatorElement, RadioIndicatorProps>(
  function RadioIndicator(props: ScopedProps<RadioIndicatorProps>, forwardedRef) {
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

/* -------------------------------------------------------------------------------------------------
 * RadioBubbleInput
 * -----------------------------------------------------------------------------------------------*/

const BUBBLE_INPUT_NAME = 'RadioBubbleInput';

type InputProps = React.ComponentPropsWithoutRef<typeof Primitive.input>;
interface RadioBubbleInputProps extends Omit<InputProps, 'checked'> {}

const RadioBubbleInput = /* @__PURE__ */ React.forwardRef<HTMLInputElement, RadioBubbleInputProps>(
  function RadioBubbleInput(
    { __scopeRadio, onClick, ...props }: ScopedProps<RadioBubbleInputProps>,
    forwardedRef,
  ) {
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
      userClick,
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
    const prevCheckedRef = React.useRef(checked);
    // The user click this input last dispatched, so each click is dispatched
    // once.
    const handledUserClickRef = React.useRef(userClick);
    // A dispatched user click whose check hasn't been applied yet (e.g. a
    // controlled parent applying it later). When it is applied, it must still
    // respect the consumer stopping the click's propagation.
    const pendingUserClickRef = React.useRef<RadioUserClick | null>(null);

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
      if (!setChecked) return;

      const checkedChanged = prevCheckedRef.current !== checked;
      prevCheckedRef.current = checked;
      const isNewUserClick = userClick !== null && userClick !== handledUserClickRef.current;
      handledUserClickRef.current = userClick;

      if (isNewUserClick) {
        // Dispatch the user's click even if the radio isn't checked (yet), so
        // ancestors are notified of every click on the trigger.
        pendingUserClickRef.current = checkedChanged ? null : userClick;
        if (checkedChanged) {
          setChecked.call(input, checked);
        }
        input.dispatchEvent(
          new Event('click', { bubbles: !userClick.hasConsumerStoppedPropagation }),
        );
      } else if (checkedChanged) {
        const pendingUserClick = pendingUserClickRef.current;
        pendingUserClickRef.current = null;
        const isPendingUserChange = checked && pendingUserClick !== null;
        // The user's click already reached ancestors, and programmatic
        // updates never do, so this click only notifies the form.
        shouldStopClickPropagationRef.current = true;
        setChecked.call(input, checked);
        input.dispatchEvent(
          new Event('click', {
            bubbles: !(isPendingUserChange && pendingUserClick.hasConsumerStoppedPropagation),
          }),
        );
        shouldStopClickPropagationRef.current = false;
      }
    }, [bubbleInput, checked, userClick]);

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
