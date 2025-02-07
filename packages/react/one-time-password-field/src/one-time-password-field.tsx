import { Primitive } from '@radix-ui/react-primitive';
import { composeRefs, useComposedRefs } from '@radix-ui/react-compose-refs';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { composeEventHandlers } from '@radix-ui/primitive';
import * as React from 'react';

interface OneTimePasswordFieldContextValue {
  value: string[];
  readOnly?: boolean;
  state?: 'valid' | 'invalid';
  onEnterPressed: () => void;
  onChildAdd: (input: HTMLInputElement) => void;
  onCharChange: (char: string, index: number) => void;
  allChildrenAdded: boolean;
}

const OneTimePasswordFieldContext = React.createContext<OneTimePasswordFieldContextValue | null>(
  null
);
OneTimePasswordFieldContext.displayName = 'OneTimePasswordFieldContext';

type OneTimePasswordFieldProps = React.ComponentPropsWithoutRef<typeof Primitive.div> & {
  onValueChange?: (value: string) => void;
  id?: string;
  name?: string;
  readOnly?: boolean;
  state?: 'valid' | 'invalid';
  value?: string;
  defaultValue?: string;
  autoSubmit?: boolean;
};

const OneTimePasswordField = React.forwardRef<HTMLDivElement, OneTimePasswordFieldProps>(
  function OneTimePasswordField(
    {
      name,
      id,
      defaultValue,
      value: valueProp,
      onValueChange,
      autoSubmit,
      children,
      readOnly,
      state,
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

    const otpContext = React.useMemo(
      () => ({
        value: value ?? createEmptyArray(childCount),
        readOnly,
        state,
        allChildrenAdded,
        onEnterPressed: handleEnterPressed,
        onChildAdd: handleChildAdd,
        onCharChange: handleCharChange,
      }),
      [
        value,
        allChildrenAdded,
        readOnly,
        state,
        childCount,
        handleEnterPressed,
        handleChildAdd,
        handleCharChange,
      ]
    );

    React.useEffect(attemptAutoSubmit, [attemptAutoSubmit]);

    return (
      <OneTimePasswordFieldContext.Provider value={otpContext}>
        <Primitive.div
          {...domProps}
          onPaste={(event: React.ClipboardEvent<HTMLDivElement>) => {
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
          }}
        >
          {children}
          <input
            ref={composeRefs(forwardedRef, hiddenInputRef)}
            defaultValue={value?.join('')}
            minLength={childCount}
            name={name}
            type="hidden"
          />
        </Primitive.div>
      </OneTimePasswordFieldContext.Provider>
    );
  }
);

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
  { readOnly, autoComplete = 'off', onChange, onKeyDown, ...props },
  forwardedRef
) {
  const otpContext = useOneTimePasswordFieldContext();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const composedInputRef = useComposedRefs(forwardedRef, inputRef, otpContext.onChildAdd);

  const index = Number(inputRef.current?.dataset.index ?? -1);
  const char = otpContext.value[index] ?? '';

  return (
    <Primitive.input
      ref={composedInputRef}
      autoComplete={index === 0 ? autoComplete : 'off'}
      color={otpContext.state === 'invalid' ? 'red' : undefined}
      inputMode="numeric"
      maxLength={1}
      pattern="\d{1}"
      readOnly={readOnly ?? otpContext.readOnly}
      value={char}
      onChange={composeEventHandlers(onChange, (event) => {
        // Only update the value if it matches the input pattern (number only)
        if (event.target.validity.valid) {
          const char = event.target.value;
          const index = Number(event.target.dataset.index ?? -1);
          otpContext.onCharChange(char, index);
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
        } else if (event.key === 'Backspace' && char === '') {
          focusSibling(event.currentTarget, { back: true });
        } else if (event.key === 'Enter' && char !== '') {
          otpContext.onEnterPressed();
        }
      })}
      {...props}
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
  const sibling = back ? input.parentElement?.previousSibling : input.parentElement?.nextSibling;
  const siblingInput = sibling?.firstChild;
  if (siblingInput && siblingInput instanceof HTMLInputElement) {
    siblingInput?.focus();
    siblingInput?.select();
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

export {
  OneTimePasswordField,
  OneTimePasswordFieldInput,
  //
  Root,
  Input,
};
export type { OneTimePasswordFieldProps, OneTimePasswordFieldInputProps };
