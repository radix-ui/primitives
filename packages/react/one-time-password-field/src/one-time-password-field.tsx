import { Primitive } from '@radix-ui/react-primitive';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import { useControllableStateReducer } from '@radix-ui/react-use-controllable-state';
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
      type: 'keydown';
      key: 'Backspace' | 'Delete';
      metaKey: boolean;
      ctrlKey: boolean;
    }
  | { type: 'cut' };

type ReducerAction =
  | { type: 'SET_CHAR'; char: string; index: number }
  | { type: 'CLEAR_CHAR'; index: number; reason?: 'Backspace' | 'Delete' | null }
  | { type: 'CLEAR' }
  | { type: 'PASTE'; value: string }
  | { type: 'SET_VALUE'; value: string[] };
type Dispatcher = React.Dispatch<ReducerAction>;

type InputValidationType = 'alpha' | 'numeric' | 'alphanumeric' | 'none';
type InputValidation = Record<
  Exclude<InputValidationType, 'none'>,
  { regexp: RegExp; pattern: string; inputMode: string }
>;

const INPUT_VALIDATION_MAP = {
  numeric: {
    regexp: /[^\d]/g,
    pattern: '\\d{1}',
    inputMode: 'numeric',
  },
  alpha: {
    regexp: /[^a-zA-Z]/g,
    pattern: '[a-zA-Z]{1}',
    inputMode: 'text',
  },
  alphanumeric: {
    regexp: /[^a-zA-Z0-9]/g,
    pattern: '[a-zA-Z0-9]{1}',
    inputMode: 'text',
  },
} satisfies InputValidation;

interface OneTimePasswordFieldContextValue {
  value: string[];
  state?: FieldState;
  attemptSubmit: () => void;
  hiddenInputRef: React.RefObject<HTMLInputElement | null>;
  validationType: InputValidationType;
  disabled: boolean;
  readOnly: boolean;
  autoComplete: AutoComplete;
  autoFocus: boolean;
  form: string | undefined;
  name: string | undefined;
  placeholder: string | undefined;
  required: boolean;
  type: InputType;
  userActionRef: React.RefObject<KeyboardActionDetails | null>;
  dispatch: Dispatcher;
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
  validationType?: InputValidationType;
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
      state: fieldState,
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
      validationType = 'numeric',
      ...domProps
    }: ScopedProps<OneTimePasswordFieldProps>,
    forwardedRef
  ) {
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeOneTimePasswordField);
    const direction = useDirection(dir);
    const collection = useCollection(__scopeOneTimePasswordField);

    const validation =
      validationType in INPUT_VALIDATION_MAP
        ? INPUT_VALIDATION_MAP[validationType as keyof InputValidation]
        : undefined;

    const [state, dispatch] = useControllableStateReducer(
      (state, action: ReducerAction) => {
        switch (action.type) {
          case 'SET_CHAR': {
            const { index, char } = action;
            if (state.state[index] === char) {
              return state;
            }

            const newValue = [...state.state];
            newValue[index] = char;
            const currentTarget = collection.at(index)?.element;
            const lastElement = collection.at(-1)?.element;
            state.effects.add(() => {
              if (char !== '' && currentTarget !== lastElement) {
                const next = currentTarget && collection.from(currentTarget, 1)?.element;
                focusInput(next);
              }
            });

            return {
              effects: state.effects,
              state: newValue,
              lastCharIndex: action.index,
            };
          }

          case 'CLEAR_CHAR': {
            const { index, reason } = action;
            if (!state.state[index]) {
              return state;
            }

            const newValue = state.state.filter((_, i) => i !== index);
            const currentTarget = collection.at(index)?.element;
            const previous = currentTarget && collection.from(currentTarget, -1)?.element;
            state.effects.add(() => {
              if (reason === 'Backspace') {
                focusInput(previous);
              } else if (reason === 'Delete') {
                focusInput(currentTarget);
              }
            });

            return {
              effects: state.effects,
              state: newValue,
              lastCharIndex: action.index,
            };
          }

          case 'CLEAR': {
            const { state: value } = state;
            if (value.length === 0) {
              return state;
            }

            state.effects.add(() => {
              focusInput(collection.at(0)?.element);
            });
            return {
              effects: state.effects,
              state: [],
              lastCharIndex: 0,
            };
          }

          case 'PASTE': {
            const { value: pastedValue } = action;
            const value = sanitizeValue(pastedValue, validation?.regexp);
            if (!value) {
              return state;
            }

            state.effects.add(() => {
              focusInput(collection.at(value.length - 1)?.element);
            });
            return {
              effects: state.effects,
              state: value,
              lastCharIndex: value.length - 1,
            };
          }

          case 'SET_VALUE': {
            const value = sanitizeValue(action.value, validation?.regexp);
            return {
              effects: state.effects,
              state: value,
              lastCharIndex: value.length - 1,
            };
          }

          default:
            return state;
        }
      },
      {
        caller: 'OneTimePasswordField',
        prop: valueProp != null ? sanitizeValue(valueProp, validation?.regexp) : undefined,
        defaultProp: defaultValue != null ? sanitizeValue(defaultValue, validation?.regexp) : [],
        onChange: (value) => onValueChange?.(value.filter(Boolean).join('')),
      },
      { lastCharIndex: 0, effects: new Set<() => void>() }
    );

    React.useEffect(() => {
      for (const effect of state.effects) {
        state.effects.delete(effect);
        effect();
      }
    }, [state]);

    const validationTypeRef = React.useRef(validationType);
    // update the value in the hidden input when the validation type changes
    React.useEffect(() => {
      if (validationTypeRef.current !== validationType) {
        validationTypeRef.current = validationType;
        dispatch({ type: 'SET_VALUE', value: state.state });
      }
    }, [dispatch, validationType, state.state]);

    const { state: value, lastCharIndex } = state;

    const hiddenInputRef = React.useRef<HTMLInputElement>(null);

    const userActionRef = React.useRef<KeyboardActionDetails | null>(null);
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

    useAutoSubmit({
      attemptSubmit,
      autoSubmit,
      lastCharIndex,
      length: collection.size,
      onAutoSubmit,
      value,
    });

    return (
      <OneTimePasswordFieldContext
        scope={__scopeOneTimePasswordField}
        value={value}
        state={fieldState}
        attemptSubmit={attemptSubmit}
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
        userActionRef={userActionRef}
        dispatch={dispatch}
        validationType={validationType}
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
            data-state={fieldState}
            onPaste={composeEventHandlers(
              onPaste,
              (event: React.ClipboardEvent<HTMLDivElement>) => {
                event.preventDefault();
                const pastedValue = event.clipboardData.getData('Text');
                const value = sanitizeValue(pastedValue, validation?.regexp);
                if (!value) {
                  return;
                }

                flushSync(() => {
                  dispatch({ type: 'PASTE', value: pastedValue });
                });
                focusInput(collection.at(value.length - 1)?.element);
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
  { __scopeOneTimePasswordField, ...props }: ScopedProps<OneTimePasswordFieldInputProps>,
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
  const { dispatch, userActionRef, validationType } = context;
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

  const validation =
    validationType in INPUT_VALIDATION_MAP
      ? INPUT_VALIDATION_MAP[validationType as keyof InputValidation]
      : undefined;

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
          type="text"
          autoComplete={index === 0 ? context.autoComplete : 'off'}
          inputMode={validation?.inputMode}
          maxLength={1}
          pattern={validation?.pattern}
          readOnly={context.readOnly}
          value={char}
          data-radix-otp-input=""
          data-radix-index={index}
          {...domProps}
          onFocus={composeEventHandlers(props.onFocus, (event) => {
            event.currentTarget.select();
          })}
          onCut={composeEventHandlers(props.onCut, (event) => {
            const currentValue = event.currentTarget.value;
            if (currentValue !== '') {
              // In this case the value will be cleared, but we don't want to
              // set it directly because the user may want to prevent default
              // behavior in the onChange handler. The userActionRef will
              // is set temporarily so the change handler can behave correctly
              // in response to the action.
              userActionRef.current = {
                type: 'cut',
              };
              // Set a short timeout to clear the action tracker after the change
              // handler has had time to complete.
              keyboardActionTimeoutRef.current = window.setTimeout(() => {
                userActionRef.current = null;
              }, 10);
            }
          })}
          onChange={composeEventHandlers(props.onChange, (event) => {
            const action = userActionRef.current;
            userActionRef.current = null;

            if (action) {
              switch (action.type) {
                case 'cut':
                  // TODO: do we want to assume the user wantt to clear the
                  // entire value here and copy the code to the clipboard instead
                  // of just the value of the given input?
                  dispatch({ type: 'CLEAR_CHAR', index });
                  return;
                case 'keydown': {
                  const isClearing =
                    action.key === 'Backspace' && (action.metaKey || action.ctrlKey);
                  if (isClearing) {
                    dispatch({ type: 'CLEAR' });
                  } else {
                    dispatch({ type: 'CLEAR_CHAR', index, reason: action.key });
                  }
                  return;
                }
                default:
                  return;
              }
            }

            // Only update the value if it matches the input pattern
            if (event.target.validity.valid) {
              dispatch({ type: 'SET_CHAR', char: event.target.value, index });
            } else {
              const element = event.target;
              requestAnimationFrame(() => {
                if (element.ownerDocument.activeElement === element) {
                  element.select();
                }
              });
            }
          })}
          onKeyDown={composeEventHandlers(props.onKeyDown, (event) => {
            switch (event.key) {
              case 'Delete':
              case 'Backspace': {
                const currentValue = event.currentTarget.value;
                // if current value is empty, no change event will fire
                if (currentValue === '') {
                  // if the user presses delete when there is no value, noop
                  if (event.key === 'Delete') return;

                  const isClearing = event.metaKey || event.ctrlKey;
                  if (isClearing) {
                    dispatch({ type: 'CLEAR' });
                  } else {
                    const element = event.currentTarget;
                    focusInput(collection.from(element, -1)?.element);
                  }
                } else {
                  // In this case the value will be cleared, but we don't want
                  // to set it directly because the user may want to prevent
                  // default behavior in the onChange handler. The userActionRef
                  // will is set temporarily so the change handler can behave
                  // correctly in response to the key vs. clearing the value by
                  // setting state externally.
                  userActionRef.current = {
                    type: 'keydown',
                    key: event.key,
                    metaKey: event.metaKey,
                    ctrlKey: event.ctrlKey,
                  };
                  // Set a short timeout to clear the action tracker after the change
                  // handler has had time to complete.
                  keyboardActionTimeoutRef.current = window.setTimeout(() => {
                    userActionRef.current = null;
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
                  focusInput(collection.from(element, 1)?.element);
                }
              }
            }
          })}
          onPointerDown={composeEventHandlers(props.onPointerDown, (event) => {
            if (index > lastSelectableIndex) {
              event.preventDefault();
              const element = collection.at(lastSelectableIndex)?.element;
              focusInput(element);
            }
          })}
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
  InputValidationType,
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

function sanitizeValue(value: string | string[], regexp: RegExp | undefined | null) {
  if (Array.isArray(value)) {
    value = value.join('');
  }
  if (regexp) {
    // global regexp is stateful, so we clone it for each call
    regexp = new RegExp(regexp);
    return value.replace(regexp, '').split('').filter(Boolean);
  }
  return value.split('').filter(Boolean);
}

function focusInput(element: HTMLInputElement | null | undefined) {
  if (!element) return;
  if (element.ownerDocument.activeElement === element) {
    // if the element is already focused, select the value in the next
    // animation frame
    window.requestAnimationFrame(() => {
      element.select?.();
    });
  } else {
    element.focus();
  }
}
