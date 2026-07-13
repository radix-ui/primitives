import * as React from 'react';
import { composeEventHandlers } from '@radix-ui/primitive';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import { createContextScope } from '@radix-ui/react-context';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { useSize } from '@radix-ui/react-use-size';
import { Primitive } from '@radix-ui/react-primitive';

import type { Scope } from '@radix-ui/react-context';

const SWITCH_NAME = 'Switch';

type ScopedProps<P> = P & { __scopeSwitch?: Scope };
const [createSwitchContext, createSwitchScope] = createContextScope(SWITCH_NAME);

type SwitchContextValue = {
  checked: boolean;
  setChecked: React.Dispatch<React.SetStateAction<boolean>>;
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

const [SwitchProviderImpl, useSwitchContext] = createSwitchContext<SwitchContextValue>(SWITCH_NAME);

/* -------------------------------------------------------------------------------------------------
 * SwitchProvider
 * -----------------------------------------------------------------------------------------------*/

interface SwitchProviderProps {
  checked?: boolean;
  defaultChecked?: boolean;
  required?: boolean;
  onCheckedChange?(checked: boolean): void;
  name?: string;
  form?: string;
  disabled?: boolean;
  value?: string | number | readonly string[];
  children?: React.ReactNode;
}

function SwitchProvider(props: ScopedProps<SwitchProviderProps>) {
  const {
    __scopeSwitch,
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
    caller: SWITCH_NAME,
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

  const context: SwitchContextValue = {
    checked,
    setChecked,
    disabled,
    control,
    setControl,
    name,
    form,
    value,
    hasConsumerStoppedPropagationRef,
    userInteractionCount,
    onUserInteraction,
    required,
    defaultChecked,
    isFormControl,
    bubbleInput,
    setBubbleInput,
  };

  return (
    <SwitchProviderImpl scope={__scopeSwitch} {...context}>
      {isFunction(internal_do_not_use_render) ? internal_do_not_use_render(context) : children}
    </SwitchProviderImpl>
  );
}

/* -------------------------------------------------------------------------------------------------
 * SwitchTrigger
 * -----------------------------------------------------------------------------------------------*/

const TRIGGER_NAME = 'SwitchTrigger';

interface SwitchTriggerProps extends Omit<
  React.ComponentPropsWithoutRef<typeof Primitive.button>,
  keyof SwitchProviderProps
> {
  children?: React.ReactNode;
}

const SwitchTrigger = React.forwardRef<HTMLButtonElement, SwitchTriggerProps>(
  ({ __scopeSwitch, onClick, ...switchProps }: ScopedProps<SwitchTriggerProps>, forwardedRef) => {
    const {
      control,
      form,
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
    } = useSwitchContext(TRIGGER_NAME, __scopeSwitch);
    const composedRefs = useComposedRefs(forwardedRef, setControl);

    const initialCheckedStateRef = React.useRef(checked);
    React.useEffect(() => {
      const associatedForm = form ? control?.ownerDocument.getElementById(form) : control?.form;
      if (associatedForm instanceof HTMLFormElement) {
        const reset = () => setChecked(initialCheckedStateRef.current);
        associatedForm.addEventListener('reset', reset);
        return () => associatedForm.removeEventListener('reset', reset);
      }
    }, [control, form, setChecked]);

    return (
      <Primitive.button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-required={required}
        data-state={getState(checked)}
        data-disabled={disabled ? '' : undefined}
        disabled={disabled}
        value={value}
        {...switchProps}
        ref={composedRefs}
        onClick={composeEventHandlers(onClick, (event) => {
          onUserInteraction();
          setChecked((prevChecked) => !prevChecked);
          if (bubbleInput && isFormControl) {
            hasConsumerStoppedPropagationRef.current = event.isPropagationStopped();
            // if switch has a bubble input and is a form control, stop
            // propagation from the button so that we only propagate one click
            // event (from the input). We propagate changes from an input so
            // that native form validation works and form events reflect switch
            // updates.
            if (!hasConsumerStoppedPropagationRef.current) event.stopPropagation();
          }
        })}
      />
    );
  },
);

SwitchTrigger.displayName = TRIGGER_NAME;

/* -------------------------------------------------------------------------------------------------
 * Switch
 * -----------------------------------------------------------------------------------------------*/

type SwitchElement = React.ComponentRef<typeof Primitive.button>;
type PrimitiveButtonProps = React.ComponentPropsWithoutRef<typeof Primitive.button>;
interface SwitchProps extends Omit<PrimitiveButtonProps, 'checked' | 'defaultChecked'> {
  checked?: boolean;
  defaultChecked?: boolean;
  required?: boolean;
  onCheckedChange?(checked: boolean): void;
}

const Switch = React.forwardRef<SwitchElement, SwitchProps>(
  (props: ScopedProps<SwitchProps>, forwardedRef) => {
    const {
      __scopeSwitch,
      name,
      checked,
      defaultChecked,
      required,
      disabled,
      value,
      onCheckedChange,
      form,
      ...switchProps
    } = props;

    return (
      <SwitchProvider
        __scopeSwitch={__scopeSwitch}
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        required={required}
        onCheckedChange={onCheckedChange}
        name={name}
        form={form}
        value={value}
        // @ts-expect-error
        internal_do_not_use_render={({ isFormControl }: SwitchContextValue) => (
          <>
            <SwitchTrigger
              {...switchProps}
              ref={forwardedRef}
              // @ts-expect-error
              __scopeSwitch={__scopeSwitch}
            />
            {isFormControl && (
              <SwitchBubbleInput
                // @ts-expect-error
                __scopeSwitch={__scopeSwitch}
              />
            )}
          </>
        )}
      />
    );
  },
);

Switch.displayName = SWITCH_NAME;

/* -------------------------------------------------------------------------------------------------
 * SwitchThumb
 * -----------------------------------------------------------------------------------------------*/

const THUMB_NAME = 'SwitchThumb';

type SwitchThumbElement = React.ComponentRef<typeof Primitive.span>;
type PrimitiveSpanProps = React.ComponentPropsWithoutRef<typeof Primitive.span>;
interface SwitchThumbProps extends PrimitiveSpanProps {}

const SwitchThumb = React.forwardRef<SwitchThumbElement, SwitchThumbProps>(
  (props: ScopedProps<SwitchThumbProps>, forwardedRef) => {
    const { __scopeSwitch, ...thumbProps } = props;
    const context = useSwitchContext(THUMB_NAME, __scopeSwitch);
    return (
      <Primitive.span
        data-state={getState(context.checked)}
        data-disabled={context.disabled ? '' : undefined}
        {...thumbProps}
        ref={forwardedRef}
      />
    );
  },
);

SwitchThumb.displayName = THUMB_NAME;

/* -------------------------------------------------------------------------------------------------
 * SwitchBubbleInput
 * -----------------------------------------------------------------------------------------------*/

const BUBBLE_INPUT_NAME = 'SwitchBubbleInput';

type InputProps = React.ComponentPropsWithoutRef<typeof Primitive.input>;
interface SwitchBubbleInputProps extends Omit<InputProps, 'checked'> {}

const SwitchBubbleInput = React.forwardRef<HTMLInputElement, SwitchBubbleInputProps>(
  ({ __scopeSwitch, onClick, ...props }: ScopedProps<SwitchBubbleInputProps>, forwardedRef) => {
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
    } = useSwitchContext(BUBBLE_INPUT_NAME, __scopeSwitch);

    const composedRefs = useComposedRefs(forwardedRef, setBubbleInput);
    const controlSize = useSize(control);
    // When the checked change is not driven by a user interaction (e.g. a
    // controlled `checked` update), the `click` event we dispatch to notify
    // forms must not reach ancestor `onClick` handlers. We can't simply make it
    // non-bubbling because React derives the switch's `change` event from a
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
        setChecked.call(input, checked);
        input.dispatchEvent(event);
        shouldStopClickPropagationRef.current = false;
      }
    }, [bubbleInput, checked, hasConsumerStoppedPropagationRef, userInteractionCount]);

    const defaultCheckedRef = React.useRef(checked);
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

SwitchBubbleInput.displayName = BUBBLE_INPUT_NAME;

/* -----------------------------------------------------------------------------------------------*/

function isFunction(value: unknown): value is (...args: any[]) => any {
  return typeof value === 'function';
}

function getState(checked: boolean) {
  return checked ? 'checked' : 'unchecked';
}

export {
  createSwitchScope,
  //
  Switch,
  SwitchProvider,
  SwitchTrigger,
  SwitchThumb,
  SwitchBubbleInput,
  //
  Switch as Root,
  SwitchProvider as Provider,
  SwitchTrigger as Trigger,
  SwitchThumb as Thumb,
  SwitchBubbleInput as BubbleInput,
};
export type {
  SwitchProps,
  SwitchProviderProps,
  SwitchTriggerProps,
  SwitchThumbProps,
  SwitchBubbleInputProps,
};
