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

type CheckboxContextValue = {
  checked: CheckedState;
  setChecked: React.Dispatch<React.SetStateAction<CheckedState>>;
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
};

const [CheckboxProviderImpl, useCheckboxContext] =
  createCheckboxContext<CheckboxContextValue>(CHECKBOX_NAME);

/* -------------------------------------------------------------------------------------------------
 * CheckboxProvider
 * -----------------------------------------------------------------------------------------------*/

interface CheckboxProviderProps {
  checked?: CheckedState;
  defaultChecked?: CheckedState;
  required?: boolean;
  onCheckedChange?(checked: CheckedState): void;
  name?: string;
  form?: string;
  disabled?: boolean;
  value?: string | number | readonly string[];
  children:
    | React.ReactNode
    /**
     * Note that this API is only used internally to maintain backwards
     * compatibility. Users should not need to read the context, and this will
     * be removed in the next major version when the core API changes.
     * @internal
     * @deprecated
     */
    | ((context: CheckboxContextValue) => React.ReactNode);
}

const CheckboxProvider: React.FC<ScopedProps<CheckboxProviderProps>> = ({
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
}) => {
  const [checked, setChecked] = useControllableState({
    prop: checkedProp,
    defaultProp: defaultChecked ?? false,
    onChange: onCheckedChange,
    caller: CHECKBOX_NAME,
  });
  const [control, setControl] = React.useState<HTMLButtonElement | null>(null);
  const hasConsumerStoppedPropagationRef = React.useRef(false);
  const isFormControl = control
    ? !!form || !!control.closest('form')
    : // We set this to true by default so that events bubble to forms without JS (SSR)
      true;

  const context: CheckboxContextValue = {
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
  };

  return (
    <CheckboxProviderImpl scope={__scopeCheckbox} {...context}>
      {isFunction(children) ? children(context) : children}
    </CheckboxProviderImpl>
  );
};

/* -------------------------------------------------------------------------------------------------
 * CheckboxTrigger
 * -----------------------------------------------------------------------------------------------*/

const TRIGGER_NAME = 'CheckboxTrigger';

interface CheckboxTriggerProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof Primitive.button>,
    keyof CheckboxProviderProps
  > {}

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
          if (isFormControl) {
            hasConsumerStoppedPropagationRef.current = event.isPropagationStopped();
            // if checkbox is in a form, stop propagation from the button so that we only propagate
            // one click event (from the input). We propagate changes from an input so that native
            // form validation works and form events reflect checkbox updates.
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

type CheckboxElement = React.ElementRef<typeof Primitive.button>;
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
      >
        {({ isFormControl }) => (
          <>
            <CheckboxTrigger {...checkboxProps} ref={forwardedRef} />
            {isFormControl && <CheckboxBubbleInput />}
          </>
        )}
      </CheckboxProvider>
    );
  }
);

Checkbox.displayName = CHECKBOX_NAME;

/* -------------------------------------------------------------------------------------------------
 * CheckboxIndicator
 * -----------------------------------------------------------------------------------------------*/

const INDICATOR_NAME = 'CheckboxIndicator';

type CheckboxIndicatorElement = React.ElementRef<typeof Primitive.span>;
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
  (
    {
      __scopeCheckbox,

      ...props
    }: ScopedProps<CheckboxBubbleInputProps>,
    forwardedRef
  ) => {
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
    } = useCheckboxContext(BUBBLE_INPUT_NAME, __scopeCheckbox);
    const ref = React.useRef<HTMLInputElement>(null);
    const composedRefs = useComposedRefs(ref, forwardedRef);
    const prevChecked = usePrevious(checked);
    const controlSize = useSize(control);

    // Bubble checked change to parents (e.g form change event)
    React.useEffect(() => {
      const input = ref.current;
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
    }, [prevChecked, checked, hasConsumerStoppedPropagationRef]);

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

const Provider = CheckboxProvider;
const Trigger = CheckboxTrigger;
const Root = Checkbox;
const Indicator = CheckboxIndicator;

export {
  createCheckboxScope,
  //
  Checkbox,
  CheckboxProvider,
  CheckboxTrigger,
  CheckboxIndicator,
  //
  Root,
  Trigger,
  Provider,
  Indicator,
};
export type {
  CheckboxProps,
  CheckboxProviderProps,
  CheckboxTriggerProps,
  CheckboxIndicatorProps,
  CheckedState,
};
