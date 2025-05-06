import * as React from 'react';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import { createContextScope } from '@radix-ui/react-context';
import { composeEventHandlers } from '@radix-ui/primitive';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { usePrevious } from '@radix-ui/react-use-previous';
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
  props: ScopedProps<CheckboxProviderProps<State>>
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

interface CheckboxTriggerProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof Primitive.button>,
    keyof CheckboxProviderProps
  > {
  children?: React.ReactNode;
}

const CheckboxTrigger = React.forwardRef<HTMLButtonElement, CheckboxTriggerProps>(
  (
    { __scopeCheckbox, onKeyDown, onClick, ...checkboxProps }: ScopedProps<CheckboxTriggerProps>,
    forwardedRef
  ) => {
    const {
      control,
      value,
      disabled,
      checked,
      required,
      setControl,
      setChecked,
      hasConsumerStoppedPropagationRef,
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
  }
);

CheckboxTrigger.displayName = TRIGGER_NAME;

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

const Checkbox = React.forwardRef<CheckboxElement, CheckboxProps>(
  (props: ScopedProps<CheckboxProps>, forwardedRef) => {
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
  }
);

Checkbox.displayName = CHECKBOX_NAME;

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

const CheckboxIndicator = React.forwardRef<CheckboxIndicatorElement, CheckboxIndicatorProps>(
  (props: ScopedProps<CheckboxIndicatorProps>, forwardedRef) => {
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
  }
);

CheckboxIndicator.displayName = INDICATOR_NAME;

/* -------------------------------------------------------------------------------------------------
 * CheckboxBubbleInput
 * -----------------------------------------------------------------------------------------------*/

const BUBBLE_INPUT_NAME = 'CheckboxBubbleInput';

type InputProps = React.ComponentPropsWithoutRef<typeof Primitive.input>;
interface CheckboxBubbleInputProps extends Omit<InputProps, 'checked'> {}

const CheckboxBubbleInput = React.forwardRef<HTMLInputElement, CheckboxBubbleInputProps>(
  ({ __scopeCheckbox, ...props }: ScopedProps<CheckboxBubbleInputProps>, forwardedRef) => {
    const {
      control,
      hasConsumerStoppedPropagationRef,
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
    const prevChecked = usePrevious(checked);
    const controlSize = useSize(control);

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

      const bubbles = !hasConsumerStoppedPropagationRef.current;
      if (prevChecked !== checked && setChecked) {
        const event = new Event('click', { bubbles });
        input.indeterminate = isIndeterminate(checked);
        setChecked.call(input, isIndeterminate(checked) ? false : checked);
        input.dispatchEvent(event);
      }
    }, [bubbleInput, prevChecked, checked, hasConsumerStoppedPropagationRef]);

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
  }
);

CheckboxBubbleInput.displayName = BUBBLE_INPUT_NAME;

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
