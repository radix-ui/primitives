import { Primitive } from '@radix-ui/react-primitive';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { composeEventHandlers } from '@radix-ui/primitive';
import { unstable_createCollection as createCollection } from '@radix-ui/react-collection';
import * as RovingFocusGroup from '@radix-ui/react-roving-focus';
import { createRovingFocusGroupScope } from '@radix-ui/react-roving-focus';
import * as React from 'react';
import { flushSync } from 'react-dom';
import type { Scope } from '@radix-ui/react-context';
import { createContextScope } from '@radix-ui/react-context';
import { useDirection } from '@radix-ui/react-direction';
import { clamp } from '@radix-ui/number';

type FieldState = 'valid' | 'invalid';
type InputType = 'password' | 'text';
type AutoComplete = 'off' | 'one-time-code';

type KeyboardActionDetails =
  | {
      action: 'keydown';
      key: string;
      metaKey: boolean;
      ctrlKey: boolean;
    }
  | {
      action: 'cut';
      key?: never;
    };

interface OneTimePasswordFieldContextValue {
  value: string[];
  clearValue: () => void;
  state?: FieldState;
  attemptSubmit: () => void;
  onCharChange: (char: string, index: number) => void;
  hiddenInputRef: React.RefObject<HTMLInputElement | null>;
  //
  disabled: boolean;
  readOnly: boolean;
  autoComplete: AutoComplete;
  autoFocus: boolean;
  form: string | undefined;
  name: string | undefined;
  placeholder: string | undefined;
  required: boolean;
  type: InputType;
  keyboardActionRef: React.RefObject<KeyboardActionDetails | null>;
}

const ONE_TIME_PASSWORD_FIELD_NAME = 'OneTimePasswordField';
const [Collection, useCollection, createCollectionScope] = createCollection<HTMLInputElement>(
  ONE_TIME_PASSWORD_FIELD_NAME
);
const [createOneTimePasswordFieldContext] = createContextScope(ONE_TIME_PASSWORD_FIELD_NAME, [
  createCollectionScope,
  createRovingFocusGroupScope,
]);
const useRovingFocusGroupScope = createRovingFocusGroupScope();

const [OneTimePasswordFieldContext, useOneTimePasswordFieldContext] =
  createOneTimePasswordFieldContext<OneTimePasswordFieldContextValue>(ONE_TIME_PASSWORD_FIELD_NAME);

type RovingFocusGroupProps = React.ComponentPropsWithoutRef<typeof RovingFocusGroup.Root>;

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
  //
  dir?: RovingFocusGroupProps['dir'];
  orientation?: RovingFocusGroupProps['orientation'];
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
      orientation,
      dir,
      ...domProps
    }: ScopedProps<OneTimePasswordFieldProps>,
    forwardedRef
  ) {
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeOneTimePasswordField);
    const direction = useDirection(dir);
    const [lastCharIndex, setLastCharIndex] = React.useState<number>(0);
    const [value, setValue] = useControllableState({
      prop: valueProp != null ? sanitizeValue(valueProp.split('')) : undefined,
      defaultProp: defaultValue != null ? sanitizeValue(defaultValue.split('')) : [],
      onChange: (value) => onValueChange?.(value.join('')),
    });

    const hiddenInputRef = React.useRef<HTMLInputElement>(null);

    const keyboardActionRef = React.useRef<KeyboardActionDetails | null>(null);
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

    useAutoSubmit({
      attemptSubmit,
      autoSubmit,
      lastCharIndex,
      length: collection.size,
      onAutoSubmit,
      value,
    });

    const onCharChange = React.useCallback(
      (char: string, index: number) => {
        setValue((previousValue) => {
          const newValue = [...previousValue];
          newValue[index] = char;
          return newValue;
        });
        setLastCharIndex(index);
      },
      [setValue]
    );

    const clearValue = React.useCallback(() => {
      setValue((value) => (value.length === 0 ? value : []));
      setLastCharIndex(0);
    }, [setValue]);

    return (
      <OneTimePasswordFieldContext
        scope={__scopeOneTimePasswordField}
        value={value}
        state={state}
        attemptSubmit={attemptSubmit}
        onCharChange={onCharChange}
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
        clearValue={clearValue}
        keyboardActionRef={keyboardActionRef}
      >
        <RovingFocusGroup.Root
          asChild
          {...rovingFocusGroupScope}
          orientation={orientation}
          dir={direction}
        >
          <Primitive.div
            {...domProps}
            ref={composedRefs}
            data-state={state}
            onPaste={composeEventHandlers(
              onPaste,
              (event: React.ClipboardEvent<HTMLDivElement>) => {
                event.preventDefault();
                const pastedValue = event.clipboardData.getData('Text');
                const value = sanitizeValue(pastedValue.split(''));
                if (!value) {
                  return;
                }

                setValue(value);
                setLastCharIndex(value.length - 1);
                collection.at(value.length - 1)?.element.focus();
              }
            )}
          >
            {children}
          </Primitive.div>
        </RovingFocusGroup.Root>
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
      value={value.join('').trim()}
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
    onPointerDown,
    onCut,
    onFocus,
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
    pattern: _pattern,
    inputMode: _inputMode,
    ...domProps
  } = props as any;

  const context = useOneTimePasswordFieldContext(
    'OneTimePasswordFieldInput',
    __scopeOneTimePasswordField
  );
  const { keyboardActionRef } = context;
  const collection = useCollection(__scopeOneTimePasswordField);
  const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeOneTimePasswordField);

  const inputRef = React.useRef<HTMLInputElement>(null);
  const [element, setElement] = React.useState<HTMLInputElement | null>(null);
  const index = element ? collection.indexOf(element) : -1;
  const composedInputRef = useComposedRefs(forwardedRef, inputRef, setElement);
  const char = context.value[index] ?? '';

  const keyboardActionTimeoutRef = React.useRef<number | null>(null);
  React.useEffect(() => {
    return () => {
      window.clearTimeout(keyboardActionTimeoutRef.current!);
    };
  }, []);

  const totalValue = context.value.join('').trim();
  const lastSelectableIndex = clamp(totalValue.length, [0, collection.size - 1]);
  const isFocusable = index <= lastSelectableIndex;

  return (
    <Collection.ItemSlot scope={__scopeOneTimePasswordField}>
      <RovingFocusGroup.Item
        {...rovingFocusGroupScope}
        asChild
        focusable={!context.disabled && isFocusable}
        active={index === lastSelectableIndex}
      >
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
          onFocus={composeEventHandlers(onFocus, (event) => {
            event.currentTarget.select();
          })}
          onCut={composeEventHandlers(onCut, (event) => {
            const currentValue = event.currentTarget.value;
            if (currentValue !== '') {
              // In this case the value will be cleared, but we don't want to
              // set it directly because the user may want to prevent default
              // behavior in the onChange handler. The keyboardActionRef will
              // is set temporarily so the change handler can behave correctly
              // in response to the action.
              keyboardActionRef.current = {
                action: 'cut',
              };
              // Set a short timeout to clear the action tracker after the change
              // handler has had time to complete.
              keyboardActionTimeoutRef.current = window.setTimeout(() => {
                keyboardActionRef.current = null;
              }, 10);
            }
          })}
          onChange={composeEventHandlers(onChange, (event) => {
            const keyboardAction = keyboardActionRef.current;
            keyboardActionRef.current = null;
            if (keyboardAction?.action === 'cut' || keyboardAction?.key === 'Backspace') {
              const isClearing =
                keyboardAction.action === 'keydown' &&
                (keyboardAction.metaKey || keyboardAction.ctrlKey);

              if (isClearing) {
                flushSync(() => {
                  context.clearValue();
                });
                collection.at(0)?.element.focus();
              } else {
                flushSync(() => {
                  context.onCharChange('', index);
                });
                if (index === totalValue.length - 1) {
                  const previous = collection.from(event.currentTarget, -1)?.element;
                  if (previous) {
                    previous.focus();
                  }
                } else {
                  event.currentTarget.select();
                }
              }

              return;
            }

            // Only update the value if it matches the input pattern
            if (event.target.validity.valid) {
              const character = event.target.value;
              flushSync(() => {
                context.onCharChange(character, index);
              });

              const lastElement = collection.at(-1)?.element;
              if (character !== '' && event.currentTarget !== lastElement) {
                const next = collection.from(event.currentTarget, 1)?.element;
                if (next) {
                  next.focus();
                }
              }
            } else {
              const element = event.target;
              requestAnimationFrame(() => {
                if (element.ownerDocument.activeElement === element) {
                  element.select();
                }
              });
            }
          })}
          onKeyDown={composeEventHandlers(onKeyDown, (event) => {
            switch (event.key) {
              case 'Backspace': {
                const currentValue = event.currentTarget.value;
                // if current value is empty, no change event will fire when the
                // user backspaces.
                if (currentValue === '') {
                  const isClearing = event.metaKey || event.ctrlKey;
                  if (isClearing) {
                    flushSync(() => {
                      context.clearValue();
                    });
                    collection.at(0)?.element.focus();
                  } else {
                    const element = event.currentTarget;
                    collection.from(element, -1)?.element.focus();
                  }
                } else {
                  // In this case the value will be cleared, but we don't want to
                  // set it directly because the user may want to prevent default
                  // behavior in the onChange handler. The keyboardActionRef will
                  // is set temporarily so the change handler can behave correctly
                  // in response to the backspace key vs. clearing the value by
                  // setting state externally.
                  keyboardActionRef.current = {
                    action: 'keydown',
                    key: 'Backspace',
                    metaKey: event.metaKey,
                    ctrlKey: event.ctrlKey,
                  };
                  // Set a short timeout to clear the action tracker after the change
                  // handler has had time to complete.
                  keyboardActionTimeoutRef.current = window.setTimeout(() => {
                    keyboardActionRef.current = null;
                  }, 10);
                }

                return;
              }
              case 'Enter': {
                event.preventDefault();
                context.attemptSubmit();
                return;
              }
              default: {
                const isValueSelected =
                  event.currentTarget.selectionStart === 0 &&
                  event.currentTarget.selectionEnd === 1;
                if (isValueSelected && event.currentTarget.value === event.key) {
                  // if current value is same as the key press with a value
                  // selected, no change event will fire. Focus the next input.
                  const element = event.currentTarget;
                  collection.from(element, 1)?.element.focus();
                }
              }
            }
          })}
          onPointerDown={composeEventHandlers(onPointerDown, (event) => {
            if (index > lastSelectableIndex) {
              event.preventDefault();
              const element = collection.at(lastSelectableIndex)?.element;
              if (element) {
                element.focus();
                element.select();
              }
            }
          })}
          {...domProps}
        />
      </RovingFocusGroup.Item>
    </Collection.ItemSlot>
  );
});

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

    if (autoSubmit && value.every((char) => char !== '') && lastCharIndex + 1 === length) {
      onAutoSubmit?.(value.join(''));
      attemptSubmit();
    }
  }, [attemptSubmit, autoSubmit, currentValue, lastCharIndex, length, onAutoSubmit, value]);
}

function sanitizeValue(value: string[]) {
  return value.join('').replace(/[^\d]/g, '').split('').filter(Boolean);
}
