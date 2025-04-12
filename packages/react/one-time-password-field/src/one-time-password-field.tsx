import { Primitive } from '@radix-ui/react-primitive';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { composeEventHandlers } from '@radix-ui/primitive';
import { unstable_createCollection as createCollection } from '@radix-ui/react-collection';
import * as React from 'react';
import { flushSync } from 'react-dom';
import type { Scope } from '@radix-ui/react-context';
import { createContextScope } from '@radix-ui/react-context';

type FieldState = 'valid' | 'invalid';
type InputType = 'password' | 'text';
type AutoComplete = 'off' | 'one-time-code';

interface OneTimePasswordFieldContextValue {
  value: string[];
  setValue: React.Dispatch<React.SetStateAction<string[]>>;
  state?: FieldState;
  attemptSubmit: () => void;
  onCharChange: (char: string, index: number) => void;
  hiddenInputRef: React.RefObject<HTMLInputElement | null>;
  childrenRefs: React.RefObject<HTMLInputElement[]>;
  //
  disabled?: boolean;
  readOnly?: boolean;
  autoComplete: AutoComplete;
  autoFocus?: boolean;
  form?: string | undefined;
  name?: string | undefined;
  placeholder?: string | undefined;
  required?: boolean;
  type?: InputType;
}

const ONE_TIME_PASSWORD_FIELD_NAME = 'OneTimePasswordField';
const [Collection, useCollection, createCollectionScope] = createCollection<HTMLInputElement>(
  ONE_TIME_PASSWORD_FIELD_NAME
);
const [createOneTimePasswordFieldContext] = createContextScope(ONE_TIME_PASSWORD_FIELD_NAME, [
  createCollectionScope,
]);

const [OneTimePasswordFieldContext, useOneTimePasswordFieldContext] =
  createOneTimePasswordFieldContext<OneTimePasswordFieldContextValue>(ONE_TIME_PASSWORD_FIELD_NAME);

interface OneTimePasswordFieldOwnProps {
  onValueChange?: (value: string) => void;
  id?: string;
  state?: FieldState;
  value?: string;
  defaultValue?: string;
  autoSubmit?: boolean;
  onAutoSubmit?: (value: string) => void;
  //
  disabled?: boolean;
  readOnly?: boolean;
  autoComplete?: AutoComplete;
  autoFocus?: boolean;
  form?: string | undefined;
  name?: string | undefined;
  placeholder?: string | undefined;
  required?: boolean;
  type?: InputType;
}

type ScopedProps<P> = P & { __scopeOneTimePasswordField?: Scope };

const OneTimePasswordFieldCollectionProvider = ({
  __scopeOneTimePasswordField,
  children,
}: ScopedProps<{ children: React.ReactNode }>) => {
  return (
    <Collection.Provider scope={__scopeOneTimePasswordField}>
      <Collection.Slot scope={__scopeOneTimePasswordField}>{children}</Collection.Slot>
    </Collection.Provider>
  );
};

interface OneTimePasswordFieldProps
  extends OneTimePasswordFieldOwnProps,
    Omit<
      React.ComponentPropsWithoutRef<typeof Primitive.div>,
      keyof OneTimePasswordFieldOwnProps
    > {}

const OneTimePasswordFieldImpl = React.forwardRef<HTMLDivElement, OneTimePasswordFieldProps>(
  function OneTimePasswordFieldImpl(
    {
      __scopeOneTimePasswordField,
      id,
      defaultValue,
      value: valueProp,
      onValueChange,
      autoSubmit,
      children,
      state,
      onPaste,
      onAutoSubmit,
      disabled = false,
      readOnly = false,
      autoComplete = 'one-time-code',
      autoFocus = false,
      form,
      name,
      placeholder,
      required = false,
      type = 'password',
      ...domProps
    }: ScopedProps<OneTimePasswordFieldProps>,
    forwardedRef
  ) {
    const [lastCharIndex, setLastCharIndex] = React.useState<number>(0);
    const [value, setValue] = useControllableState({
      prop: valueProp != null ? getValueAsArray(valueProp, valueProp.length) : undefined,
      defaultProp: defaultValue != null ? getValueAsArray(defaultValue, defaultValue.length) : [],
      onChange: (value) => onValueChange?.(value.join('')),
    });

    const hiddenInputRef = React.useRef<HTMLInputElement>(null);
    const childrenRefs = React.useRef<HTMLInputElement[]>([]);

    const rootRef = React.useRef<HTMLDivElement | null>(null);
    const composedRefs = useComposedRefs(forwardedRef, rootRef);

    const attemptSubmit = React.useCallback(() => {
      const formElement = form
        ? ((rootRef.current?.ownerDocument ?? document).getElementById(form) as HTMLFormElement)
        : hiddenInputRef.current?.form;

      if (isFormElement(formElement)) {
        formElement.requestSubmit();
      }
    }, [form]);

    const collection = useCollection(__scopeOneTimePasswordField);
    const length = collection.size;
    console.log(collection);

    useAutoSubmit({
      attemptSubmit,
      autoSubmit,
      lastCharIndex,
      length,
      onAutoSubmit,
      value,
    });

    const handleCharChange = React.useCallback(
      (char: string, index: number) => {
        setValue((previousValue) => {
          const arrayToCopy = previousValue ?? createEmptyArray(length);
          const newValue = [...arrayToCopy];
          newValue[index] = char;
          return newValue;
        });
        setLastCharIndex(index);
      },
      [length, setValue]
    );

    return (
      <OneTimePasswordFieldContext
        scope={__scopeOneTimePasswordField}
        value={value}
        state={state}
        attemptSubmit={attemptSubmit}
        onCharChange={handleCharChange}
        disabled={disabled}
        readOnly={readOnly}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        form={form}
        name={name}
        placeholder={placeholder}
        required={required}
        type={type}
        hiddenInputRef={hiddenInputRef}
        setValue={setValue}
        childrenRefs={childrenRefs}
      >
        <Primitive.div
          {...domProps}
          ref={composedRefs}
          data-state={state}
          onPaste={composeEventHandlers(onPaste, (event: React.ClipboardEvent<HTMLDivElement>) => {
            event.preventDefault();
            const pastedValue = event.clipboardData.getData('Text');
            const sanitizedValue = pastedValue.replace(/[^\d]/g, '').slice(0, length);
            const value = sanitizedValue
              .padEnd(length, '#')
              .split('')
              .map((char) => (char === '#' ? '' : char));

            setValue(value);
            setLastCharIndex(sanitizedValue.length - 1);

            const index = Math.min(sanitizedValue.length, length - 1);
            childrenRefs.current?.[index]?.focus();
          })}
        >
          {children}
        </Primitive.div>
      </OneTimePasswordFieldContext>
    );
  }
);

const OneTimePasswordField = React.forwardRef<HTMLDivElement, OneTimePasswordFieldProps>(
  function OneTimePasswordField(props, ref) {
    return (
      <OneTimePasswordFieldCollectionProvider>
        <OneTimePasswordFieldImpl {...props} ref={ref} />
      </OneTimePasswordFieldCollectionProvider>
    );
  }
);

interface OneTimePasswordFieldHiddenInputProps
  extends Omit<
    React.ComponentProps<'input'>,
    | keyof 'value'
    | 'defaultValue'
    | 'type'
    | 'onChange'
    | 'readOnly'
    | 'disabled'
    | 'autoComplete'
    | 'autoFocus'
  > {}

const OneTimePasswordFieldHiddenInput = React.forwardRef<
  HTMLInputElement,
  OneTimePasswordFieldHiddenInputProps
>(function OneTimePasswordFieldHiddenInput(
  { __scopeOneTimePasswordField, ...props }: ScopedProps<OneTimePasswordFieldHiddenInputProps>,
  forwardedRef
) {
  const { value, hiddenInputRef } = useOneTimePasswordFieldContext(
    'OneTimePasswordFieldHiddenInput',
    __scopeOneTimePasswordField
  );
  const ref = useComposedRefs(hiddenInputRef, forwardedRef);
  return (
    <input
      ref={ref}
      {...props}
      type="hidden"
      readOnly
      value={value}
      autoComplete="off"
      autoFocus={false}
      autoCapitalize="off"
      autoCorrect="off"
      autoSave="off"
      spellCheck={false}
    />
  );
});

interface OneTimePasswordFieldInputOwnProps {
  autoComplete?: 'one-time-code' | 'off';
}

interface OneTimePasswordFieldInputProps
  extends OneTimePasswordFieldInputOwnProps,
    Omit<React.ComponentProps<typeof Primitive.input>, keyof OneTimePasswordFieldInputOwnProps> {}

const OneTimePasswordFieldInput = React.forwardRef<
  HTMLInputElement,
  OneTimePasswordFieldInputProps
>(function OneTimePasswordFieldInput(
  {
    __scopeOneTimePasswordField,
    onChange,
    onKeyDown,
    ...props
  }: ScopedProps<OneTimePasswordFieldInputProps>,
  forwardedRef
) {
  // TODO: warn if these values are passed
  const {
    value: _value,
    defaultValue: _defaultValue,
    disabled: _disabled,
    readOnly: _readOnly,
    autoComplete: _autoComplete,
    autoFocus: _autoFocus,
    form: _form,
    name: _name,
    placeholder: _placeholder,
    required: _required,
    type: _type,
    ...domProps
  } = props as any;

  const context = useOneTimePasswordFieldContext(
    'OneTimePasswordFieldInput',
    __scopeOneTimePasswordField
  );
  const collection = useCollection(__scopeOneTimePasswordField);

  const inputRef = React.useRef<HTMLInputElement>(null);
  const [element, setElement] = React.useState<HTMLInputElement | null>(null);
  const index = element ? collection.indexOf(element) : -1;
  console.log({ index });
  const composedInputRef = useComposedRefs(forwardedRef, inputRef, setElement);
  const char = context.value[index] ?? '';

  return (
    <Collection.ItemSlot scope={__scopeOneTimePasswordField}>
      <Primitive.input
        ref={composedInputRef}
        autoComplete={index === 0 ? context.autoComplete : 'off'}
        inputMode="numeric"
        maxLength={1}
        pattern="\d{1}"
        readOnly={context.readOnly}
        value={char}
        data-radix-otp-input=""
        data-radix-index={index}
        onChange={composeEventHandlers(onChange, (event) => {
          // Only update the value if it matches the input pattern (number only)
          if (event.target.validity.valid) {
            const char = event.target.value;
            flushSync(() => {
              context.onCharChange(char, index);
            });
            if (char !== '') {
              focusSibling(event.currentTarget, { back: char === '' });
            }
          }
        })}
        onKeyDown={composeEventHandlers(onKeyDown, (event) => {
          switch (event.key) {
            case 'ArrowLeft': {
              focusSibling(event.currentTarget, { back: true });
              event.preventDefault();
              return;
            }
            case 'ArrowRight': {
              focusSibling(event.currentTarget);
              event.preventDefault();
              return;
            }
            case 'Backspace': {
              if (event.metaKey || event.ctrlKey) {
                context.setValue([]);
                // focus first input
                context.childrenRefs.current?.[0]?.focus();
              } else {
                focusSibling(event.currentTarget, { back: true });
              }
              return;
            }
            case 'Enter': {
              event.preventDefault();
              context.attemptSubmit();
              return;
            }
          }
        })}
        {...domProps}
      />
    </Collection.ItemSlot>
  );
});

function focusSibling(input: HTMLInputElement, { back = false } = {}) {
  const parent = input.parentElement;
  const index = input.dataset.radixIndex ? Number.parseInt(input.dataset.radixIndex) : Number.NaN;
  if (Number.isNaN(index)) {
    return;
  }

  const siblingInput = parent?.querySelector<HTMLElement>(
    `[data-radix-otp-input][data-radix-index="${index + (back ? -1 : 1)}"]`
  );
  if (siblingInput) {
    siblingInput.focus();
    if (siblingInput instanceof HTMLInputElement) {
      siblingInput.select();
    }
  }
}

function getValueAsArray(value: string, length: number) {
  return createEmptyArray(length).map((_, index) => value[index] ?? '');
}

function createEmptyArray(length: number): string[] {
  return Array.from<string>({ length }).fill('');
}

const Root = OneTimePasswordField;
const Input = OneTimePasswordFieldInput;
const HiddenInput = OneTimePasswordFieldHiddenInput;

export {
  OneTimePasswordField,
  OneTimePasswordFieldInput,
  OneTimePasswordFieldHiddenInput,
  //
  Root,
  Input,
  HiddenInput,
};
export type {
  OneTimePasswordFieldProps,
  OneTimePasswordFieldInputProps,
  OneTimePasswordFieldHiddenInputProps,
};

function isFormElement(element: Element | null | undefined): element is HTMLFormElement {
  return element?.tagName === 'FORM';
}

function useAutoSubmit({
  autoSubmit = false,
  value,
  length,
  lastCharIndex,
  attemptSubmit,
  onAutoSubmit,
}: {
  value: string[];
  autoSubmit: boolean | undefined;
  length: number;
  lastCharIndex: number;
  attemptSubmit: () => void;
  onAutoSubmit: ((value: string) => void) | undefined;
}) {
  const currentValue = value.join('');
  const valueRef = React.useRef(currentValue);
  React.useEffect(() => {
    const previousValue = valueRef.current;
    valueRef.current = currentValue;
    if (previousValue === currentValue) {
      return;
    }

    console.log({ lastCharIndex });

    if (autoSubmit && value.every((char) => char !== '') && lastCharIndex + 1 === length) {
      onAutoSubmit?.(value.join(''));
      attemptSubmit();
    }
  }, [attemptSubmit, autoSubmit, currentValue, lastCharIndex, length, onAutoSubmit, value]);
}
