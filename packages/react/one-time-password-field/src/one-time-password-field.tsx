import { Primitive } from '@radix-ui/react-primitive';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { composeEventHandlers } from '@radix-ui/primitive';
import { useIsHydrated } from '@radix-ui/react-use-is-hydrated';
import * as React from 'react';

type FieldState = 'valid' | 'invalid';
type InputType = 'password' | 'text';
type AutoComplete = 'off' | 'one-time-code';

interface OneTimePasswordFieldContextValue {
  value: string[];
  setValue: React.Dispatch<React.SetStateAction<string[] | undefined>>;
  state?: FieldState;
  onEnterPressed: () => void;
  onChildAdd: (input: HTMLInputElement) => void;
  onCharChange: (char: string, index: number) => void;
  allChildrenAdded: boolean;
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

const OneTimePasswordFieldContext = React.createContext<OneTimePasswordFieldContextValue | null>(
  null
);
OneTimePasswordFieldContext.displayName = 'OneTimePasswordFieldContext';

interface OneTimePasswordFieldOwnProps {
  onValueChange?: (value: string) => void;
  id?: string;
  state?: FieldState;
  value?: string;
  defaultValue?: string;
  autoSubmit?: boolean;
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

interface OneTimePasswordFieldProps
  extends OneTimePasswordFieldOwnProps,
    Omit<
      React.ComponentPropsWithoutRef<typeof Primitive.div>,
      keyof OneTimePasswordFieldOwnProps
    > {}

const OneTimePasswordField = React.forwardRef<HTMLDivElement, OneTimePasswordFieldProps>(
  function OneTimePasswordField(
    {
      id,
      defaultValue,
      value: valueProp,
      onValueChange,
      autoSubmit,
      children,
      state,
      onPaste,
      //
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
    },
    forwardedRef
  ) {
    const [lastCharIndex, setLastCharIndex] = React.useState<number>(0);
    const [allChildrenAdded, setAllChildrenAdded] = React.useState<boolean>(false);
    const childCount = React.Children.count(children);

    const [value, setValue] = useControllableState({
      prop: getValueAsArray(valueProp, childCount),
      defaultProp: getValueAsArray(defaultValue, childCount),
      onChange: (value) => onValueChange?.(value.join('')),
    });

    const hiddenInputRef = React.useRef<HTMLInputElement>(null);
    const childrenRefs = React.useRef<HTMLInputElement[]>([]);

    const attemptAutoSubmit = React.useCallback(
      (enterPressed = false) => {
        if (
          autoSubmit &&
          value &&
          value.every((char) => char !== '') &&
          (enterPressed || lastCharIndex + 1 === childCount)
        ) {
          // TODO: use `form` prop if provided
          hiddenInputRef.current?.form?.requestSubmit();
        }
      },
      [value, childCount, lastCharIndex, autoSubmit]
    );

    const handleEnterPressed = React.useCallback(
      () => attemptAutoSubmit(true),
      [attemptAutoSubmit]
    );

    const handleChildAdd = React.useCallback(
      (input: HTMLInputElement) => {
        if (input) {
          input.dataset.index = `${childrenRefs.current.length}`;
          childrenRefs.current.push(input);
        } else {
          childrenRefs.current.pop();
        }

        if (childrenRefs.current.length === childCount) {
          setAllChildrenAdded(true);
        }
      },
      [childCount]
    );

    const handleCharChange = React.useCallback(
      (char: string, index: number) => {
        setValue((previousValue) => {
          const arrayToCopy = previousValue ?? createEmptyArray(childCount);
          const newValue = [...arrayToCopy];
          newValue[index] = char;
          return newValue;
        });
        setLastCharIndex(index);
      },
      [childCount, setValue]
    );

    const otpContext = React.useMemo<OneTimePasswordFieldContextValue>(
      () => ({
        value: value ?? createEmptyArray(childCount),
        state,
        allChildrenAdded,
        onEnterPressed: handleEnterPressed,
        onChildAdd: handleChildAdd,
        onCharChange: handleCharChange,
        disabled,
        readOnly,
        autoComplete,
        autoFocus,
        form,
        name,
        placeholder,
        required,
        type,
        hiddenInputRef,
        setValue,
        childrenRefs,
      }),
      [
        value,
        allChildrenAdded,
        state,
        childCount,
        handleEnterPressed,
        handleChildAdd,
        handleCharChange,
        disabled,
        readOnly,
        autoComplete,
        autoFocus,
        form,
        name,
        placeholder,
        required,
        type,
        setValue,
      ]
    );

    React.useEffect(attemptAutoSubmit, [attemptAutoSubmit]);

    return (
      <OneTimePasswordFieldContext.Provider value={otpContext}>
        <Primitive.div
          {...domProps}
          ref={forwardedRef}
          data-state={state}
          onPaste={composeEventHandlers(onPaste, (event: React.ClipboardEvent<HTMLDivElement>) => {
            event.preventDefault();
            const pastedValue = event.clipboardData.getData('Text');
            const sanitizedValue = pastedValue.replace(/[^\d]/g, '').slice(0, childCount);
            const value = sanitizedValue
              .padEnd(childCount, '#')
              .split('')
              .map((char) => (char === '#' ? '' : char));

            setValue(value);
            setLastCharIndex(sanitizedValue.length - 1);

            const index = Math.min(sanitizedValue.length, childCount - 1);
            childrenRefs.current?.[index]?.focus();
          })}
        >
          {children}
        </Primitive.div>
      </OneTimePasswordFieldContext.Provider>
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
>(function OneTimePasswordFieldHiddenInput(props, forwardedRef) {
  const { value, hiddenInputRef } = useOneTimePasswordFieldContext();
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
  index?: number;
}

interface OneTimePasswordFieldInputProps
  extends OneTimePasswordFieldInputOwnProps,
    Omit<React.ComponentProps<typeof Primitive.input>, keyof OneTimePasswordFieldInputOwnProps> {}

const OneTimePasswordFieldInput = React.forwardRef<
  HTMLInputElement,
  OneTimePasswordFieldInputProps
>(function OneTimePasswordFieldInput(
  { onChange, onKeyDown, index: indexProp, ...props },
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

  const context = useOneTimePasswordFieldContext();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const composedInputRef = useComposedRefs(forwardedRef, inputRef, context.onChildAdd);
  const isHydrated = useIsHydrated();

  const index =
    indexProp != null ? indexProp : isHydrated ? Number(inputRef.current?.dataset.index ?? -1) : -1;
  const char = context.value[index] ?? '';

  return (
    <Primitive.input
      ref={composedInputRef}
      autoComplete={index === 0 ? context.autoComplete : 'off'}
      inputMode="numeric"
      maxLength={1}
      pattern="\d{1}"
      readOnly={context.readOnly}
      value={char}
      onChange={composeEventHandlers(onChange, (event) => {
        // Only update the value if it matches the input pattern (number only)
        if (event.target.validity.valid) {
          const char = event.target.value;
          const index = Number(event.target.dataset.index ?? -1);
          context.onCharChange(char, index);
          if (char !== '') {
            focusSibling(event.currentTarget, { back: char === '' });
          }
        }
      })}
      onKeyDown={composeEventHandlers(onKeyDown, (event) => {
        if (event.key === 'ArrowLeft') {
          focusSibling(event.currentTarget, { back: true });
          event.preventDefault();
        } else if (event.key === 'ArrowRight') {
          focusSibling(event.currentTarget);
          event.preventDefault();
        } else if (event.key === 'Backspace') {
          if (event.metaKey || event.ctrlKey) {
            context.setValue([]);
            // focus first input
            context.childrenRefs.current?.[0]?.focus();
          } else {
            focusSibling(event.currentTarget, { back: true });
          }
        } else if (event.key === 'Enter' && char !== '') {
          context.onEnterPressed();
        }
      })}
      {...domProps}
    />
  );
});

function useOneTimePasswordFieldContext() {
  const context = React.useContext(OneTimePasswordFieldContext);
  if (!context) {
    throw new Error('TODO: add error message');
  }
  return context;
}

function focusSibling(input: HTMLInputElement, { back = false } = {}) {
  // TODO: update
  const siblingInput = back ? input.previousSibling : input.nextSibling;
  if (siblingInput && siblingInput instanceof HTMLInputElement && siblingInput.type !== 'hidden') {
    siblingInput.focus();
    siblingInput.select();
  }
}

function getValueAsArray(value: string | undefined, length: number) {
  if (!value) {
    return undefined;
  }

  return createEmptyArray(length).map((_, index) => value?.[index] ?? '');
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
