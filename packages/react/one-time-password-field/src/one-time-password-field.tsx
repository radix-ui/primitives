import * as Primitive from '@radix-ui/react-primitive';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { composeEventHandlers } from '@radix-ui/primitive';
import { unstable_createCollection as createCollection } from '@radix-ui/react-collection';
import * as RovingFocusGroup from '@radix-ui/react-roving-focus';
import { createRovingFocusGroupScope } from '@radix-ui/react-roving-focus';
import { useIsHydrated } from '@radix-ui/react-use-is-hydrated';
import * as React from 'react';
import { flushSync } from 'react-dom';
import type { Scope } from '@radix-ui/react-context';
import { createContextScope } from '@radix-ui/react-context';
import { useDirection } from '@radix-ui/react-direction';
import { clamp } from '@radix-ui/number';
import { useEffectEvent } from '@radix-ui/react-use-effect-event';

type InputValidationType = 'alpha' | 'numeric' | 'alphanumeric' | 'none';

const INPUT_VALIDATION_MAP = {
  numeric: {
    type: 'numeric',
    regexp: /[^\d]/g,
    pattern: '\\d{1}',
    inputMode: 'numeric',
  },
  alpha: {
    type: 'alpha',
    regexp: /[^a-zA-Z]/g,
    pattern: '[a-zA-Z]{1}',
    inputMode: 'text',
  },
  alphanumeric: {
    type: 'alphanumeric',
    regexp: /[^a-zA-Z0-9]/g,
    pattern: '[a-zA-Z0-9]{1}',
    inputMode: 'text',
  },
  none: null,
} satisfies InputValidation;

/* -------------------------------------------------------------------------------------------------
 * OneTimePasswordFieldProvider
 * -----------------------------------------------------------------------------------------------*/

type RovingFocusGroupProps = RovingFocusGroup.RovingFocusGroupProps;

interface OneTimePasswordFieldContextValue {
  attemptSubmit: () => void;
  autoComplete: AutoComplete;
  autoFocus: boolean;
  disabled: boolean;
  dispatch: Dispatcher;
  form: string | undefined;
  hiddenInputRef: React.RefObject<HTMLInputElement | null>;
  isHydrated: boolean;
  name: string | undefined;
  orientation: Exclude<RovingFocusGroupProps['orientation'], undefined>;
  placeholder: string | undefined;
  readOnly: boolean;
  type: InputType;
  userActionRef: React.RefObject<KeyboardActionDetails | null>;
  validationType: InputValidationType;
  value: string[];
  sanitizeValue: (arg: string | string[]) => string[];
}

const ONE_TIME_PASSWORD_FIELD_NAME = 'OneTimePasswordField';
const [Collection, { useCollection, createCollectionScope, useInitCollection }] =
  createCollection<HTMLInputElement>(ONE_TIME_PASSWORD_FIELD_NAME);
const [createOneTimePasswordFieldContext] = createContextScope(ONE_TIME_PASSWORD_FIELD_NAME, [
  createCollectionScope,
  createRovingFocusGroupScope,
]);
const useRovingFocusGroupScope = createRovingFocusGroupScope();

const [OneTimePasswordFieldContext, useOneTimePasswordFieldContext] =
  createOneTimePasswordFieldContext<OneTimePasswordFieldContextValue>(ONE_TIME_PASSWORD_FIELD_NAME);

/* -------------------------------------------------------------------------------------------------
 * OneTimePasswordField
 * -----------------------------------------------------------------------------------------------*/

interface OneTimePasswordFieldOwnProps {
  /**
   * Specifies what—if any—permission the user agent has to provide automated
   * assistance in filling out form field values, as well as guidance to the
   * browser as to the type of information expected in the field. Allows
   * `"one-time-code"` or `"off"`.
   *
   * @defaultValue `"one-time-code"`
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/autocomplete
   */
  autoComplete?: AutoComplete;
  /**
   * Whether or not the first fillable input should be focused on page-load.
   *
   * @defaultValue `false`
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/autofocus
   */
  autoFocus?: boolean;
  /**
   * Whether or not the component should attempt to automatically submit when
   * all fields are filled. If the field is associated with an HTML `form`
   * element, the form's `requestSubmit` method will be called.
   *
   * @defaultValue `false`
   */
  autoSubmit?: boolean;
  /**
   * The initial value of the uncontrolled field.
   */
  defaultValue?: string;
  /**
   * Indicates the horizontal directionality of the parent element's text.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/dir
   */
  dir?: RovingFocusGroupProps['dir'];
  /**
   * Whether or not the the field's input elements are disabled.
   */
  disabled?: boolean;
  /**
   * A string specifying the `form` element with which the input is associated.
   * This string's value, if present, must match the id of a `form` element in
   * the same document.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#form
   */
  form?: string | undefined;
  /**
   * A string specifying a name for the input control. This name is submitted
   * along with the control's value when the form data is submitted.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#name
   */
  name?: string | undefined;
  /**
   * When the `autoSubmit` prop is set to `true`, this callback will be fired
   * before attempting to submit the associated form. It will be called whether
   * or not a form is located, or if submission is not allowed.
   */
  onAutoSubmit?: (value: string) => void;
  /**
   * A callback fired when the field's value changes. When the component is
   * controlled, this should update the state passed to the `value` prop.
   */
  onValueChange?: (value: string) => void;
  /**
   * Indicates the vertical directionality of the input elements.
   *
   * @defaultValue `"horizontal"`
   */
  orientation?: RovingFocusGroupProps['orientation'];
  /**
   * Defines the text displayed in a form control when the control has no value.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/placeholder
   */
  placeholder?: string | undefined;
  /**
   * Whether or not the input elements can be updated by the user.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/readonly
   */
  readOnly?: boolean;
  /**
   * Function for custom sanitization when `validationType` is set to `"none"`.
   * This function will be called before updating values in response to user
   * interactions.
   */
  sanitizeValue?: (value: string) => string;
  /**
   * The input type of the field's input elements. Can be `"password"` or `"text"`.
   */
  type?: InputType;
  /**
   * Specifies the type of input validation to be used. Can be `"alpha"`,
   * `"numeric"`, `"alphanumeric"` or `"none"`.
   *
   * @defaultValue `"numeric"`
   */
  validationType?: InputValidationType;
  /**
   * The controlled value of the field.
   */
  value?: string;
}

type ScopedProps<P> = P & { __scopeOneTimePasswordField?: Scope };

interface OneTimePasswordFieldProps
  extends OneTimePasswordFieldOwnProps,
    Omit<Primitive.PrimitivePropsWithRef<'div'>, keyof OneTimePasswordFieldOwnProps> {}

const OneTimePasswordField = React.forwardRef<HTMLDivElement, OneTimePasswordFieldProps>(
  function OneTimePasswordFieldImpl(
    {
      __scopeOneTimePasswordField,
      defaultValue,
      value: valueProp,
      onValueChange,
      autoSubmit = false,
      children,
      onPaste,
      onAutoSubmit,
      disabled = false,
      readOnly = false,
      autoComplete = 'one-time-code',
      autoFocus = false,
      form,
      name,
      placeholder,
      type = 'text',
      // TODO: Change default to vertical when inputs use vertical writing mode
      orientation = 'horizontal',
      dir,
      validationType = 'numeric',
      sanitizeValue: sanitizeValueProp,
      ...domProps
    }: ScopedProps<OneTimePasswordFieldProps>,
    forwardedRef
  ) {
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeOneTimePasswordField);
    const direction = useDirection(dir);
    const collectionState = useInitCollection();
    const [collection] = collectionState;

    const validation = INPUT_VALIDATION_MAP[validationType]
      ? INPUT_VALIDATION_MAP[validationType as keyof InputValidation]
      : null;

    const sanitizeValue = React.useCallback(
      (value: string | string[]) => {
        if (Array.isArray(value)) {
          value = value.map(removeWhitespace).join('');
        } else {
          value = removeWhitespace(value);
        }

        if (validation) {
          // global regexp is stateful, so we clone it for each call
          const regexp = new RegExp(validation.regexp);
          value = value.replace(regexp, '');
        } else if (sanitizeValueProp) {
          value = sanitizeValueProp(value);
        }

        return value.split('');
      },
      [validation, sanitizeValueProp]
    );

    const controlledValue = React.useMemo(() => {
      return valueProp != null ? sanitizeValue(valueProp) : undefined;
    }, [valueProp, sanitizeValue]);

    const [value, setValue] = useControllableState({
      caller: 'OneTimePasswordField',
      prop: controlledValue,
      defaultProp: defaultValue != null ? sanitizeValue(defaultValue) : [],
      onChange: React.useCallback(
        (value: string[]) => onValueChange?.(value.join('')),
        [onValueChange]
      ),
    });

    // Update function *specifically* for event handlers.
    const dispatch = useEffectEvent<Dispatcher>((action) => {
      switch (action.type) {
        case 'SET_CHAR': {
          const { index, char } = action;
          const currentTarget = collection.at(index)?.element;
          if (value[index] === char) {
            const next = currentTarget && collection.from(currentTarget, 1)?.element;
            focusInput(next);
            return;
          }

          // empty values should be handled in the CLEAR_CHAR action
          if (char === '') {
            return;
          }

          if (validation) {
            const regexp = new RegExp(validation.regexp);
            const clean = char.replace(regexp, '');
            if (clean !== char) {
              // not valid; ignore
              return;
            }
          }

          // no more space
          if (value.length >= collection.size) {
            // replace current value; move to next input
            const newValue = [...value];
            newValue[index] = char;
            flushSync(() => setValue(newValue));
            const next = currentTarget && collection.from(currentTarget, 1)?.element;
            focusInput(next);
            return;
          }

          const newValue = [...value];
          newValue[index] = char;

          const lastElement = collection.at(-1)?.element;
          flushSync(() => setValue(newValue));
          if (currentTarget !== lastElement) {
            const next = currentTarget && collection.from(currentTarget, 1)?.element;
            focusInput(next);
          } else {
            currentTarget?.select();
          }
          return;
        }

        case 'CLEAR_CHAR': {
          const { index, reason } = action;
          if (!value[index]) {
            return;
          }

          const newValue = value.filter((_, i) => i !== index);
          const currentTarget = collection.at(index)?.element;
          const previous = currentTarget && collection.from(currentTarget, -1)?.element;

          flushSync(() => setValue(newValue));
          if (reason === 'Backspace') {
            focusInput(previous);
          } else if (reason === 'Delete' || reason === 'Cut') {
            focusInput(currentTarget);
          }
          return;
        }

        case 'CLEAR': {
          if (value.length === 0) {
            return;
          }

          if (action.reason === 'Backspace' || action.reason === 'Delete') {
            flushSync(() => setValue([]));
            focusInput(collection.at(0)?.element);
          } else {
            setValue([]);
          }
          return;
        }

        case 'PASTE': {
          const { value: pastedValue } = action;
          const value = sanitizeValue(pastedValue);
          if (!value) {
            return;
          }

          flushSync(() => setValue(value));
          focusInput(collection.at(value.length - 1)?.element);
          return;
        }
      }
    });

    // re-validate when the validation type changes
    const validationTypeRef = React.useRef(validation);
    React.useEffect(() => {
      if (!validation) {
        return;
      }

      if (validationTypeRef.current?.type !== validation.type) {
        validationTypeRef.current = validation;
        setValue(sanitizeValue(value.join('')));
      }
    }, [sanitizeValue, setValue, validation, value]);

    const hiddenInputRef = React.useRef<HTMLInputElement>(null);

    const userActionRef = React.useRef<KeyboardActionDetails | null>(null);
    const rootRef = React.useRef<HTMLDivElement | null>(null);
    const composedRefs = useComposedRefs(forwardedRef, rootRef);

    const firstInput = collection.at(0)?.element;
    const locateForm = React.useCallback(() => {
      let formElement: HTMLFormElement | null | undefined;
      if (form) {
        const associatedElement = (rootRef.current?.ownerDocument ?? document).getElementById(form);
        if (isFormElement(associatedElement)) {
          formElement = associatedElement;
        }
      } else if (hiddenInputRef.current) {
        formElement = hiddenInputRef.current.form;
      } else if (firstInput) {
        formElement = firstInput.form;
      }

      return formElement ?? null;
    }, [form, firstInput]);

    const attemptSubmit = React.useCallback(() => {
      const formElement = locateForm();
      formElement?.requestSubmit();
    }, [locateForm]);

    React.useEffect(() => {
      const form = locateForm();
      if (form) {
        const reset = () => dispatch({ type: 'CLEAR', reason: 'Reset' });
        form.addEventListener('reset', reset);
        return () => form.removeEventListener('reset', reset);
      }
    }, [dispatch, locateForm]);

    const currentValue = value.join('');
    const valueRef = React.useRef(currentValue);
    const length = collection.size;
    React.useEffect(() => {
      const previousValue = valueRef.current;
      valueRef.current = currentValue;
      if (previousValue === currentValue) {
        return;
      }

      if (autoSubmit && value.every((char) => char !== '') && value.length === length) {
        onAutoSubmit?.(value.join(''));
        attemptSubmit();
      }
    }, [attemptSubmit, autoSubmit, currentValue, length, onAutoSubmit, value]);
    const isHydrated = useIsHydrated();

    return (
      <OneTimePasswordFieldContext
        scope={__scopeOneTimePasswordField}
        value={value}
        attemptSubmit={attemptSubmit}
        disabled={disabled}
        readOnly={readOnly}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        form={form}
        name={name}
        placeholder={placeholder}
        type={type}
        hiddenInputRef={hiddenInputRef}
        userActionRef={userActionRef}
        dispatch={dispatch}
        validationType={validationType}
        orientation={orientation}
        isHydrated={isHydrated}
        sanitizeValue={sanitizeValue}
      >
        <Collection.Provider scope={__scopeOneTimePasswordField} state={collectionState}>
          <Collection.Slot scope={__scopeOneTimePasswordField}>
            <RovingFocusGroup.Root
              asChild
              {...rovingFocusGroupScope}
              orientation={orientation}
              dir={direction}
            >
              <Primitive.Root.div
                {...domProps}
                role="group"
                ref={composedRefs}
                onPaste={composeEventHandlers(
                  onPaste,
                  (event: React.ClipboardEvent<HTMLDivElement>) => {
                    event.preventDefault();
                    const pastedValue = event.clipboardData.getData('Text');
                    dispatch({ type: 'PASTE', value: pastedValue });
                  }
                )}
              >
                {children}
              </Primitive.Root.div>
            </RovingFocusGroup.Root>
          </Collection.Slot>
        </Collection.Provider>
      </OneTimePasswordFieldContext>
    );
  }
);

/* -------------------------------------------------------------------------------------------------
 * OneTimePasswordFieldHiddenInput
 * -----------------------------------------------------------------------------------------------*/

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
  const { value, hiddenInputRef, name } = useOneTimePasswordFieldContext(
    'OneTimePasswordFieldHiddenInput',
    __scopeOneTimePasswordField
  );
  const ref = useComposedRefs(hiddenInputRef, forwardedRef);
  return (
    <input
      ref={ref}
      name={name}
      value={value.join('').trim()}
      autoComplete="off"
      autoFocus={false}
      autoCapitalize="off"
      autoCorrect="off"
      autoSave="off"
      spellCheck={false}
      {...props}
      type="hidden"
      readOnly
    />
  );
});

/* -------------------------------------------------------------------------------------------------
 * OneTimePasswordFieldInput
 * -----------------------------------------------------------------------------------------------*/

interface OneTimePasswordFieldInputProps
  extends Omit<
    Primitive.PrimitivePropsWithRef<'input'>,
    | 'value'
    | 'defaultValue'
    | 'disabled'
    | 'readOnly'
    | 'autoComplete'
    | 'autoFocus'
    | 'form'
    | 'name'
    | 'placeholder'
    | 'type'
  > {
  /**
   * Callback fired when the user input fails native HTML input validation.
   */
  onInvalidChange?: (character: string) => void;
  /**
   * User-provided index to determine the order of the inputs. This is useful if
   * you need certain index-based attributes to be set on the initial render,
   * often to prevent flickering after hydration.
   */
  index?: number;
}

const OneTimePasswordFieldInput = React.forwardRef<
  HTMLInputElement,
  OneTimePasswordFieldInputProps
>(function OneTimePasswordFieldInput(
  {
    __scopeOneTimePasswordField,
    onInvalidChange,
    index: indexProp,
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
    type: _type,
    ...domProps
  } = props as Primitive.PrimitivePropsWithRef<'input'>;

  const context = useOneTimePasswordFieldContext(
    'OneTimePasswordFieldInput',
    __scopeOneTimePasswordField
  );
  const { dispatch, userActionRef, validationType, isHydrated, disabled } = context;
  const collection = useCollection(__scopeOneTimePasswordField);
  const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeOneTimePasswordField);

  const inputRef = React.useRef<HTMLInputElement>(null);
  const [element, setElement] = React.useState<HTMLInputElement | null>(null);

  const index = indexProp ?? (element ? collection.indexOf(element) : -1);
  const canSetPlaceholder = indexProp != null || isHydrated;
  let placeholder: string | undefined;
  if (canSetPlaceholder && context.placeholder && context.value.length === 0) {
    // only set placeholder after hydration to prevent flickering when indices
    // are re-calculated
    placeholder = context.placeholder[index];
  }

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
        {({ hasTabStop, isCurrentTabStop }) => {
          const supportsAutoComplete = hasTabStop ? isCurrentTabStop : index === 0;
          return (
            <Primitive.Root.input
              ref={composedInputRef}
              type={context.type}
              disabled={disabled}
              aria-label={`Character ${index + 1} of ${collection.size}`}
              autoComplete={supportsAutoComplete ? context.autoComplete : 'off'}
              data-1p-ignore={supportsAutoComplete ? undefined : 'true'}
              data-lpignore={supportsAutoComplete ? undefined : 'true'}
              data-protonpass-ignore={supportsAutoComplete ? undefined : 'true'}
              data-bwignore={supportsAutoComplete ? undefined : 'true'}
              inputMode={validation?.inputMode}
              maxLength={1}
              pattern={validation?.pattern}
              readOnly={context.readOnly}
              value={char}
              placeholder={placeholder}
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
              onInput={composeEventHandlers(props.onInput, (event) => {
                const value = event.currentTarget.value;
                if (value.length > 1) {
                  // Password managers may try to insert the code into a single
                  // input, in which case form validation will fail to prevent
                  // additional input. Handle this the same as if a user were
                  // pasting a value.
                  event.preventDefault();
                  dispatch({ type: 'PASTE', value });
                }
              })}
              onChange={composeEventHandlers(props.onChange, (event) => {
                const value = event.target.value;
                event.preventDefault();
                const action = userActionRef.current;
                userActionRef.current = null;

                if (action) {
                  switch (action.type) {
                    case 'cut':
                      // TODO: do we want to assume the user wantt to clear the
                      // entire value here and copy the code to the clipboard instead
                      // of just the value of the given input?
                      dispatch({ type: 'CLEAR_CHAR', index, reason: 'Cut' });
                      return;
                    case 'keydown': {
                      if (action.key === 'Char') {
                        // update resulting from a keydown event that set a value
                        // directly. Ignore.
                        return;
                      }

                      const isClearing =
                        action.key === 'Backspace' && (action.metaKey || action.ctrlKey);
                      if (action.key === 'Clear' || isClearing) {
                        dispatch({ type: 'CLEAR', reason: 'Backspace' });
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
                  if (value === '') {
                    let reason: 'Backspace' | 'Delete' | 'Cut' = 'Backspace';
                    if (isInputEvent(event.nativeEvent)) {
                      const inputType = event.nativeEvent.inputType;
                      if (inputType === 'deleteContentBackward') {
                        reason = 'Backspace';
                      } else if (inputType === 'deleteByCut') {
                        reason = 'Cut';
                      }
                    }
                    dispatch({ type: 'CLEAR_CHAR', index, reason });
                  } else {
                    dispatch({ type: 'SET_CHAR', char: value, index, event });
                  }
                } else {
                  const element = event.target;
                  onInvalidChange?.(element.value);
                  requestAnimationFrame(() => {
                    if (element.ownerDocument.activeElement === element) {
                      element.select();
                    }
                  });
                }
              })}
              onKeyDown={composeEventHandlers(props.onKeyDown, (event) => {
                switch (event.key) {
                  case 'Clear':
                  case 'Delete':
                  case 'Backspace': {
                    const currentValue = event.currentTarget.value;
                    // if current value is empty, no change event will fire
                    if (currentValue === '') {
                      // if the user presses delete when there is no value, noop
                      if (event.key === 'Delete') return;

                      const isClearing = event.key === 'Clear' || event.metaKey || event.ctrlKey;
                      if (isClearing) {
                        dispatch({ type: 'CLEAR', reason: 'Backspace' });
                      } else {
                        const element = event.currentTarget;
                        requestAnimationFrame(() => {
                          focusInput(collection.from(element, -1)?.element);
                        });
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
                  case 'ArrowDown':
                  case 'ArrowUp': {
                    if (context.orientation === 'horizontal') {
                      // in horizontal orientation, the up/down will de-select the
                      // input instead of moving focus
                      event.preventDefault();
                    }
                    return;
                  }
                  // TODO: Handle left/right arrow keys in vertical writing mode
                  default: {
                    if (event.currentTarget.value === event.key) {
                      // if current value is same as the key press, no change event
                      // will fire. Focus the next input.
                      const element = event.currentTarget;
                      event.preventDefault();
                      focusInput(collection.from(element, 1)?.element);
                      return;
                    } else if (
                      // input already has a value, but...
                      event.currentTarget.value &&
                      // the value is not selected
                      !(
                        event.currentTarget.selectionStart === 0 &&
                        event.currentTarget.selectionEnd != null &&
                        event.currentTarget.selectionEnd > 0
                      )
                    ) {
                      const attemptedValue = event.key;
                      if (event.key.length > 1 || event.key === ' ') {
                        // not a character; do nothing
                        return;
                      } else {
                        // user is attempting to enter a character, but the input
                        // will not update by default since it's limited to a single
                        // character.
                        const nextInput = collection.from(event.currentTarget, 1)?.element;
                        const lastInput = collection.at(-1)?.element;
                        if (nextInput !== lastInput && event.currentTarget !== lastInput) {
                          // if selection is before the value, set the value of the
                          // current input. Otherwise set the value of the next
                          // input.
                          if (event.currentTarget.selectionStart === 0) {
                            dispatch({ type: 'SET_CHAR', char: attemptedValue, index, event });
                          } else {
                            dispatch({
                              type: 'SET_CHAR',
                              char: attemptedValue,
                              index: index + 1,
                              event,
                            });
                          }

                          userActionRef.current = {
                            type: 'keydown',
                            key: 'Char',
                            metaKey: event.metaKey,
                            ctrlKey: event.ctrlKey,
                          };
                          keyboardActionTimeoutRef.current = window.setTimeout(() => {
                            userActionRef.current = null;
                          }, 10);
                        }
                      }
                    }
                  }
                }
              })}
              onPointerDown={composeEventHandlers(props.onPointerDown, (event) => {
                event.preventDefault();
                const indexToFocus = Math.min(index, lastSelectableIndex);
                const element = collection.at(indexToFocus)?.element;
                focusInput(element);
              })}
            />
          );
        }}
      </RovingFocusGroup.Item>
    </Collection.ItemSlot>
  );
});

export {
  OneTimePasswordField,
  OneTimePasswordFieldInput,
  OneTimePasswordFieldHiddenInput,
  //
  OneTimePasswordField as Root,
  OneTimePasswordFieldInput as Input,
  OneTimePasswordFieldHiddenInput as HiddenInput,
};
export type {
  OneTimePasswordFieldProps,
  OneTimePasswordFieldInputProps,
  OneTimePasswordFieldHiddenInputProps,
  InputValidationType,
};

/* -----------------------------------------------------------------------------------------------*/

function isFormElement(element: Element | null | undefined): element is HTMLFormElement {
  return element?.tagName === 'FORM';
}

function removeWhitespace(value: string) {
  return value.replace(/\s/g, '');
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

function isInputEvent(event: Event): event is InputEvent {
  return event.type === 'input';
}

type InputType = 'password' | 'text';
type AutoComplete = 'off' | 'one-time-code';
type KeyboardActionDetails =
  | {
      type: 'keydown';
      key: 'Backspace' | 'Delete' | 'Clear' | 'Char';
      metaKey: boolean;
      ctrlKey: boolean;
    }
  | { type: 'cut' };

type UpdateAction =
  | {
      type: 'SET_CHAR';
      char: string;
      index: number;
      event: React.KeyboardEvent | React.ChangeEvent;
    }
  | { type: 'CLEAR_CHAR'; index: number; reason: 'Backspace' | 'Delete' | 'Cut' }
  | { type: 'CLEAR'; reason: 'Reset' | 'Backspace' | 'Delete' | 'Clear' }
  | { type: 'PASTE'; value: string };
type Dispatcher = React.Dispatch<UpdateAction>;
type InputValidation = Record<
  InputValidationType,
  {
    type: InputValidationType;
    regexp: RegExp;
    pattern: string;
    inputMode: 'text' | 'numeric';
  } | null
>;
