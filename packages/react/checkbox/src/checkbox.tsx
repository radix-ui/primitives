import * as React from 'react';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import { createContextScope } from '@radix-ui/react-context';
import { composeEventHandlers } from '@radix-ui/primitive';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { useSize } from '@radix-ui/react-use-size';
import { Presence } from '@radix-ui/react-presence';
import { Primitive } from '@radix-ui/react-primitive';

import type { Scope } from '@radix-ui/react-context';

const CHECKBOX_NAME = 'Checkbox';

type ScopedProps<P> = P & { __scopeCheckbox?: Scope };
const [createCheckboxContext, createCheckboxScope] = createContextScope(CHECKBOX_NAME);

type CheckedState = boolean | 'indeterminate';

type CheckboxContextValue<State extends CheckedState | boolean = CheckedState> = {
  checked: State | boolean;
  setChecked: React.Dispatch<React.SetStateAction<State | boolean>>;
  disabled: boolean | undefined;
  control: HTMLButtonElement | null;
  setControl: React.Dispatch<React.SetStateAction<HTMLButtonElement | null>>;
  name: string | undefined;
  form: string | undefined;
  value: string | number | readonly string[];
  hasConsumerStoppedPropagationRef: React.RefObject<boolean>;
  userInteractionCount: number;
  onUserInteraction: () => void;
  required: boolean | undefined;
  defaultChecked: boolean | undefined;
  isFormControl: boolean;
  bubbleInput: HTMLInputElement | null;
  setBubbleInput: React.Dispatch<React.SetStateAction<HTMLInputElement | null>>;
};

const [CheckboxProviderImpl, useCheckboxContext] =
  createCheckboxContext<CheckboxContextValue>(CHECKBOX_NAME);

/* -------------------------------------------------------------------------------------------------
 * CheckboxProvider
 * -----------------------------------------------------------------------------------------------*/

interface CheckboxProviderProps<State extends CheckedState = CheckedState> {
  checked?: State | boolean;
  defaultChecked?: State | boolean;
  required?: boolean;
  onCheckedChange?(checked: State | boolean): void;
  name?: string;
  form?: string;
  disabled?: boolean;
  value?: string | number | readonly string[];
  children?: React.ReactNode;
}

function CheckboxProvider<State extends CheckedState = CheckedState>(
  props: ScopedProps<CheckboxProviderProps<State>>,
) {
  const {
    __scopeCheckbox,
    checked: checkedProp,
    children,
    defaultChecked,
    disabled,
    form,
    name,
    onCheckedChange,
    required,
    value = 'on',
    // @ts-expect-error
    internal_do_not_use_render,
  } = props;

  const [checked, setChecked] = useControllableState({
    prop: checkedProp,
    defaultProp: defaultChecked ?? false,
    onChange: onCheckedChange,
    caller: CHECKBOX_NAME,
  });
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

  const context: CheckboxContextValue<State> = {
    checked: checked,
    disabled: disabled,
    setChecked: setChecked,
    control: control,
    setControl: setControl,
    name: name,
    form: form,
    value: value,
    hasConsumerStoppedPropagationRef: hasConsumerStoppedPropagationRef,
    userInteractionCount: userInteractionCount,
    onUserInteraction: onUserInteraction,
    required: required,
    defaultChecked: isIndeterminate(defaultChecked) ? false : defaultChecked,
    isFormControl: isFormControl,
    bubbleInput,
    setBubbleInput,
  };

  return (
    <CheckboxProviderImpl
      scope={__scopeCheckbox}
      {...(context as unknown as CheckboxContextValue<CheckedState>)}
    >
      {isFunction(internal_do_not_use_render) ? internal_do_not_use_render(context) : children}
    </CheckboxProviderImpl>
  );
}

/* -------------------------------------------------------------------------------------------------
 * CheckboxTrigger
 * -----------------------------------------------------------------------------------------------*/

const TRIGGER_NAME = 'CheckboxTrigger';

interface CheckboxTriggerProps extends Omit<
  React.ComponentPropsWithoutRef<typeof Primitive.button>,
  keyof CheckboxProviderProps
> {
  children?: React.ReactNode;
}

const CheckboxTrigger = /* @__PURE__ */ React.forwardRef<HTMLButtonElement, CheckboxTriggerProps>(
  function CheckboxTrigger(
    { __scopeCheckbox, onKeyDown, onClick, ...checkboxProps }: ScopedProps<CheckboxTriggerProps>,
    forwardedRef,
  ) {
    const {
      control,
      value,
      disabled,
      checked,
      required,
      setControl,
      setChecked,
      hasConsumerStoppedPropagationRef,
      onUserInteraction,
      isFormControl,
      bubbleInput,
    } = useCheckboxContext(TRIGGER_NAME, __scopeCheckbox);
    const composedRefs = useComposedRefs(forwardedRef, setControl);

    const initialCheckedStateRef = React.useRef(checked);
    React.useEffect(() => {
      const form = control?.form;
      if (form) {
        const reset = () => setChecked(initialCheckedStateRef.current);
        form.addEventListener('reset', reset);
        return () => form.removeEventListener('reset', reset);
      }
    }, [control, setChecked]);

    return (
      <Primitive.button
        type="button"
        role="checkbox"
        aria-checked={isIndeterminate(checked) ? 'mixed' : checked}
        aria-required={required}
        data-state={getState(checked)}
        data-disabled={disabled ? '' : undefined}
        disabled={disabled}
        value={value}
        {...checkboxProps}
        ref={composedRefs}
        onKeyDown={composeEventHandlers(onKeyDown, (event) => {
          // According to WAI ARIA, Checkboxes don't activate on enter keypress
          if (event.key === 'Enter') event.preventDefault();
        })}
        onClick={composeEventHandlers(onClick, (event) => {
          onUserInteraction();
          setChecked((prevChecked) => (isIndeterminate(prevChecked) ? true : !prevChecked));
          if (bubbleInput && isFormControl) {
            hasConsumerStoppedPropagationRef.current = event.isPropagationStopped();
            // if checkbox has a bubble input and is a form control, stop
            // propagation from the button so that we only propagate one click
            // event (from the input). We propagate changes from an input so
            // that native form validation works and form events reflect
            // checkbox updates.
            if (!hasConsumerStoppedPropagationRef.current) event.stopPropagation();
          }
        })}
      />
    );
  },
);

/* -------------------------------------------------------------------------------------------------
 * Checkbox
 * -----------------------------------------------------------------------------------------------*/

type CheckboxElement = React.ComponentRef<typeof Primitive.button>;
type PrimitiveButtonProps = React.ComponentPropsWithoutRef<typeof Primitive.button>;
interface CheckboxProps extends Omit<PrimitiveButtonProps, 'checked' | 'defaultChecked'> {
  checked?: CheckedState;
  defaultChecked?: CheckedState;
  required?: boolean;
  onCheckedChange?(checked: CheckedState): void;
}

const Checkbox = /* @__PURE__ */ React.forwardRef<CheckboxElement, CheckboxProps>(
  // blank line to reduce diff noise
  function Checkbox(props: ScopedProps<CheckboxProps>, forwardedRef) {
    const {
      __scopeCheckbox,
      name,
      checked,
      defaultChecked,
      required,
      disabled,
      value,
      onCheckedChange,
      form,
      ...checkboxProps
    } = props;

    return (
      <CheckboxProvider
        __scopeCheckbox={__scopeCheckbox}
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        required={required}
        onCheckedChange={onCheckedChange}
        name={name}
        form={form}
        value={value}
        // @ts-expect-error
        internal_do_not_use_render={({ isFormControl }: CheckboxContextValue) => (
          <>
            <CheckboxTrigger
              {...checkboxProps}
              ref={forwardedRef}
              // @ts-expect-error
              __scopeCheckbox={__scopeCheckbox}
            />
            {isFormControl && (
              <CheckboxBubbleInput
                // @ts-expect-error
                __scopeCheckbox={__scopeCheckbox}
              />
            )}
          </>
        )}
      />
    );
  },
);

/* -------------------------------------------------------------------------------------------------
 * CheckboxIndicator
 * -----------------------------------------------------------------------------------------------*/

const INDICATOR_NAME = 'CheckboxIndicator';

type CheckboxIndicatorElement = React.ComponentRef<typeof Primitive.span>;
type PrimitiveSpanProps = React.ComponentPropsWithoutRef<typeof Primitive.span>;
interface CheckboxIndicatorProps extends PrimitiveSpanProps {
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: true;
}

const CheckboxIndicator = /* @__PURE__ */ React.forwardRef<
  CheckboxIndicatorElement,
  CheckboxIndicatorProps
>(
  // blank line to reduce diff noise
  function CheckboxIndicator(props: ScopedProps<CheckboxIndicatorProps>, forwardedRef) {
    const { __scopeCheckbox, forceMount, ...indicatorProps } = props;
    const context = useCheckboxContext(INDICATOR_NAME, __scopeCheckbox);
    return (
      <Presence
        present={forceMount || isIndeterminate(context.checked) || context.checked === true}
      >
        <Primitive.span
          data-state={getState(context.checked)}
          data-disabled={context.disabled ? '' : undefined}
          {...indicatorProps}
          ref={forwardedRef}
          style={{ pointerEvents: 'none', ...props.style }}
        />
      </Presence>
    );
  },
);

/* -------------------------------------------------------------------------------------------------
 * CheckboxBubbleInput
 * -----------------------------------------------------------------------------------------------*/

const BUBBLE_INPUT_NAME = 'CheckboxBubbleInput';

type InputProps = React.ComponentPropsWithoutRef<typeof Primitive.input>;
interface CheckboxBubbleInputProps extends Omit<InputProps, 'checked'> {}

const CheckboxBubbleInput = /* @__PURE__ */ React.forwardRef<
  HTMLInputElement,
  CheckboxBubbleInputProps
>(
  // blank line to reduce diff noise
  function CheckboxBubbleInput(
    { __scopeCheckbox, onClick, ...props }: ScopedProps<CheckboxBubbleInputProps>,
    forwardedRef,
  ) {
    const {
      control,
      hasConsumerStoppedPropagationRef,
      userInteractionCount,
      checked,
      defaultChecked,
      required,
      disabled,
      name,
      value,
      form,
      bubbleInput,
      setBubbleInput,
    } = useCheckboxContext(BUBBLE_INPUT_NAME, __scopeCheckbox);

    const composedRefs = useComposedRefs(forwardedRef, setBubbleInput);
    const controlSize = useSize(control);
    // When the checked change is not driven by a user interaction (e.g. a
    // controlled `checked` update), the `click` event we dispatch to notify
    // forms must not reach ancestor `onClick` handlers. We can't simply make it
    // non-bubbling because React derives the checkbox's `change` event from a
    // bubbling `click`. Instead we stop propagation of the synthetic click,
    // which still lets the `change` event reach the form.
    const shouldStopClickPropagationRef = React.useRef(false);
    // The `checked` value we last synced to the input, and the interaction
    // counter we last accounted for. Comparing against these lets us detect a
    // genuine `checked` change and whether it followed a user interaction, even
    // on renders caused by clicks that don't change `checked` (e.g. a
    // controlled value that ignores the change).
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
        input.indeterminate = isIndeterminate(checked);
        setChecked.call(input, isIndeterminate(checked) ? false : checked);
        input.dispatchEvent(event);
        shouldStopClickPropagationRef.current = false;
      }
    }, [bubbleInput, checked, hasConsumerStoppedPropagationRef, userInteractionCount]);

    const defaultCheckedRef = React.useRef(isIndeterminate(checked) ? false : checked);
    return (
      <Primitive.input
        type="checkbox"
        aria-hidden
        defaultChecked={defaultChecked ?? defaultCheckedRef.current}
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

function isIndeterminate(checked?: CheckedState): checked is 'indeterminate' {
  return checked === 'indeterminate';
}

function getState(checked: CheckedState) {
  return isIndeterminate(checked) ? 'indeterminate' : checked ? 'checked' : 'unchecked';
}

export {
  createCheckboxScope,
  //
  Checkbox,
  CheckboxProvider,
  CheckboxTrigger,
  CheckboxIndicator,
  CheckboxBubbleInput,
  //
  Checkbox as Root,
  CheckboxProvider as Provider,
  CheckboxTrigger as Trigger,
  CheckboxIndicator as Indicator,
  CheckboxBubbleInput as BubbleInput,
};
export type {
  CheckboxProps,
  CheckboxProviderProps,
  CheckboxTriggerProps,
  CheckboxIndicatorProps,
  CheckboxBubbleInputProps,
  CheckedState,
};
