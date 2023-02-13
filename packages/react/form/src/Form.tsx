import * as React from 'react';
import { composeEventHandlers } from '@radix-ui/primitive';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import { useId } from '@radix-ui/react-id';
import { Label } from '@radix-ui/react-label';
import { Primitive } from '@radix-ui/react-primitive';

/* -------------------------------------------------------------------------------------------------
 * Form
 * -----------------------------------------------------------------------------------------------*/

type AriaDescriptionContextValue = {
  onDescriptionIdAdd: (id: string) => void;
  onDescriptionIdRemove: (id: string) => void;
  getAriaDescription(): string | undefined;
};
const AriaDescriptionContext = React.createContext<AriaDescriptionContextValue>({
  onDescriptionIdAdd: () => {},
  onDescriptionIdRemove: () => {},
  getAriaDescription: () => undefined,
});

interface ServerError {
  code: string;
  message: string;
}
type ServerErrors = {
  [fieldName in string]?: ServerError[];
} & {
  global?: ServerError[];
};
const ServerErrorsContext = React.createContext<ServerErrors>({});

type FormElement = React.ElementRef<typeof Primitive.form>;
type PrimitiveFormProps = React.ComponentPropsWithoutRef<typeof Primitive.form>;
interface FormProps extends PrimitiveFormProps {
  serverErrors?: ServerErrors;
  onServerErrorsChange?: (serverErrors: undefined) => void;
}

const Form = React.forwardRef<FormElement, FormProps>((props, forwardedRef) => {
  const { serverErrors = {}, onServerErrorsChange, ...rootProps } = props;
  const formRef = React.useRef<HTMLFormElement>(null);
  const composedFormRef = useComposedRefs(forwardedRef, formRef);

  // focus first invalid control after server errors are set
  React.useEffect(() => {
    const form = formRef.current;
    const errorKeys = Object.keys(serverErrors);
    if (form && errorKeys.length > 0) {
      // if we only have a global error, focus the submit button which is described by the global error
      if (errorKeys.length === 1 && errorKeys[0] === 'global') {
        const submit: HTMLButtonElement | null = form.querySelector('button[type="submit"]');
        submit?.focus();
      }
      // otherwise, focus the first invalid control
      else {
        const elements = form.elements;
        const [firstInvalidControl] = Array.from(elements).filter(isHTMLElement).filter(isInvalid);
        firstInvalidControl?.focus();
      }
    }
  }, [serverErrors]);

  // allow re-submitting the form over server errors
  React.useEffect(() => {
    const hasErrors = serverErrors && Object.keys(serverErrors).length > 0;
    if (hasErrors) {
      const form = formRef.current;
      const isValidForm = form?.checkValidity();
      const submit: HTMLButtonElement | undefined | null =
        form?.querySelector('button[type="submit"]');
      if (!isValidForm && submit) {
        const handleSubmitClick = (event: Event) => {
          // clear server errors
          onServerErrorsChange?.(undefined);
          // re-submit form
          setTimeout(() => submit.click(), 0);
        };
        submit.addEventListener('click', handleSubmitClick, { once: true });
        return () => {
          submit.removeEventListener('click', handleSubmitClick);
        };
      }
    }
  }, [serverErrors, onServerErrorsChange]);

  const [globalMessageId, setGlobalMessageId] = React.useState<string | undefined>(undefined);
  const handleGlobalMessageIdAdd = React.useCallback((id: string) => setGlobalMessageId(id), []);
  const handleGlobalMessageIdRemove = React.useCallback(
    (id: string) => setGlobalMessageId(undefined),
    []
  );
  const getAriaDescription = React.useCallback(() => globalMessageId, [globalMessageId]);
  const ariaDescriptionContextValue = React.useMemo(
    () => ({
      onDescriptionIdAdd: handleGlobalMessageIdAdd,
      onDescriptionIdRemove: handleGlobalMessageIdRemove,
      getAriaDescription,
    }),
    [getAriaDescription, handleGlobalMessageIdAdd, handleGlobalMessageIdRemove]
  );

  return (
    <AriaDescriptionContext.Provider value={ariaDescriptionContextValue}>
      <ServerErrorsContext.Provider value={serverErrors}>
        <Primitive.form
          {...rootProps}
          ref={composedFormRef}
          onInvalid={(event) => {
            // focus first invalid control
            const elements = event.currentTarget.elements;
            const [firstInvalidControl] = Array.from(elements)
              .filter(isHTMLElement)
              .filter(isInvalid);

            if (firstInvalidControl === event.target) {
              firstInvalidControl.focus();
            }

            // prevent default browser UI for form validation
            event.preventDefault();
          }}
          onReset={composeEventHandlers(props.onReset, (event) => {
            onServerErrorsChange?.(undefined);
          })}
        />
      </ServerErrorsContext.Provider>
    </AriaDescriptionContext.Provider>
  );
});
Form.displayName = 'Form';

/* -------------------------------------------------------------------------------------------------
 * FormField
 * -----------------------------------------------------------------------------------------------*/

type FormFieldContextValue = {
  id: string;
  name: string;
  validity: ValidityState | undefined;
  setValidity: React.Dispatch<React.SetStateAction<ValidityState | undefined>>;
  customValidators: ValidatorEntry[];
  setCustomValidators: React.Dispatch<React.SetStateAction<ValidatorEntry[]>>;
  customErrors: Record<string, boolean>;
  setCustomErrors: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
};
const FormFieldContext = React.createContext<FormFieldContextValue>({} as any);

type FormFieldElement = React.ElementRef<typeof Primitive.div>;
type PrimitiveDivProps = React.ComponentPropsWithoutRef<typeof Primitive.div>;
interface FormFieldProps extends PrimitiveDivProps {
  name: string;
}

const FormField = React.forwardRef<FormFieldElement, FormFieldProps>((props, forwardedRef) => {
  const { name, ...fieldProps } = props;

  const id = useId();
  const [validity, setValidity] = React.useState<ValidityState | undefined>(undefined);
  const [customValidators, setCustomValidators] = React.useState<ValidatorEntry[]>([]);
  const [customErrors, setCustomErrors] = React.useState<Record<string, boolean>>({});

  const fieldContext = React.useMemo(
    () => ({
      id,
      name,
      validity,
      setValidity,
      customValidators,
      setCustomValidators,
      customErrors,
      setCustomErrors,
    }),
    [id, name, validity, customValidators, customErrors]
  );

  const [fieldMessageIds, setFieldMessageIds] = React.useState<Set<string>>(new Set());
  const handleFieldMessageIdAdd = React.useCallback((id: string) => {
    setFieldMessageIds((prev) => new Set(prev).add(id));
  }, []);
  const handleFieldMessageIdRemove = React.useCallback((id: string) => {
    setFieldMessageIds((prev) => {
      const ids = new Set(prev);
      ids.delete(id);
      return ids;
    });
  }, []);
  const getAriaDescription = React.useCallback(() => {
    return Array.from(fieldMessageIds).join(' ') || undefined;
  }, [fieldMessageIds]);
  const ariaDescriptionContextValue = React.useMemo(
    () => ({
      onDescriptionIdAdd: handleFieldMessageIdAdd,
      onDescriptionIdRemove: handleFieldMessageIdRemove,
      getAriaDescription,
    }),
    [getAriaDescription, handleFieldMessageIdAdd, handleFieldMessageIdRemove]
  );

  return (
    <FormFieldContext.Provider value={fieldContext}>
      <AriaDescriptionContext.Provider value={ariaDescriptionContextValue}>
        <Primitive.div {...fieldProps} ref={forwardedRef} />
      </AriaDescriptionContext.Provider>
    </FormFieldContext.Provider>
  );
});
FormField.displayName = 'FormField';

/* -------------------------------------------------------------------------------------------------
 * FormLabel
 * -----------------------------------------------------------------------------------------------*/

type FormLabelElement = React.ElementRef<typeof Label>;
type LabelProps = React.ComponentPropsWithoutRef<typeof Label>;
interface FormLabelProps extends LabelProps {}

const FormLabel = React.forwardRef<FormLabelElement, FormLabelProps>((props, forwardedRef) => {
  const fieldContext = React.useContext(FormFieldContext);
  const htmlFor = props.htmlFor || fieldContext.id;

  return (
    <Label
      data-valid={fieldContext.validity?.valid === true ? true : undefined}
      data-invalid={fieldContext.validity?.valid === false ? true : undefined}
      {...props}
      ref={forwardedRef}
      htmlFor={htmlFor}
    />
  );
});
FormLabel.displayName = 'FormLabel';

/* -------------------------------------------------------------------------------------------------
 * FormControl
 * -----------------------------------------------------------------------------------------------*/

type FormControlElement = React.ElementRef<typeof Primitive.input>;
type PrimitiveInputProps = React.ComponentPropsWithoutRef<typeof Primitive.input>;
interface FormControlProps extends PrimitiveInputProps {}

const FormControl = React.forwardRef<FormControlElement, FormControlProps>(
  (props, forwardedRef) => {
    const fieldContext = React.useContext(FormFieldContext);
    const ariaDescriptionContext = React.useContext(AriaDescriptionContext);
    const serverErrors = React.useContext(ServerErrorsContext);
    const controlRef = React.useRef<FormControlElement>(null);
    const composedRef = useComposedRefs(forwardedRef, controlRef);
    const name = props.name || fieldContext.name;
    const id = props.id || fieldContext.id;
    const hasServerError = Boolean(fieldContext.name in serverErrors);

    const { setValidity } = fieldContext;
    React.useEffect(() => {
      const control = controlRef.current;
      if (hasServerError && control) {
        control.setCustomValidity('server error');
        const controlValidity = validityStateToObject(control.validity);
        setValidity((prevValidity) => ({ ...prevValidity, ...controlValidity }));
      }
    }, [hasServerError, setValidity]);

    const { customValidators, setCustomErrors } = fieldContext;
    const updateControlValidity = React.useCallback(
      async (control: FormControlElement) => {
        //------------------------------------------------------------------------------------------
        // 1. first, if we have built-in errors we stop here

        if (hasBuiltInError(control.validity)) {
          const controlValidity = validityStateToObject(control.validity);
          setValidity((prevValidity) => ({ ...prevValidity, ...controlValidity }));
          return;
        }

        //------------------------------------------------------------------------------------------
        // 2. split sync and async validators

        const syncCustomValidators: Array<SyncValidatorEntry> = [];
        const ayncCustomValidators: Array<AsyncValidatorEntry> = [];
        customValidators.forEach((validatorEntry) => {
          if (isAsyncValidator(validatorEntry.validator)) {
            ayncCustomValidators.push(validatorEntry as AsyncValidatorEntry);
          } else {
            syncCustomValidators.push(validatorEntry as SyncValidatorEntry);
          }
        });

        //------------------------------------------------------------------------------------------
        // 3. then get all field values to give to validators for cross-comparisons

        const fields = control.form ? Object.fromEntries(new FormData(control.form)) : {};

        //------------------------------------------------------------------------------------------
        // 4. run sync custom validators and update control validity / internal validity + errors

        const syncCustomErrors = syncCustomValidators.map(({ id, validator }) => {
          return [id, !validator(control.value, fields)] as const;
        });
        const syncCustomErrorsById = Object.fromEntries(syncCustomErrors);
        const hasSyncCustomErrors = Object.values(syncCustomErrorsById).some(Boolean);
        const hasCustomError = hasServerError || hasSyncCustomErrors;
        control.setCustomValidity(hasCustomError ? DEFAULT_INVALID_MESSAGE : '');
        const controlValidity = validityStateToObject(control.validity);
        setValidity((prevValidity) => ({ ...prevValidity, ...controlValidity }));
        setCustomErrors((prevErrors) => ({ ...prevErrors, ...syncCustomErrorsById }));

        //------------------------------------------------------------------------------------------
        // 5. run async custom validators and update control validity / internal validity + errors

        if (!hasSyncCustomErrors && ayncCustomValidators.length > 0) {
          const promisedCustomErrors = ayncCustomValidators.map(({ id, validator }) =>
            validator(control.value, fields).then((isValid) => [id, !isValid] as const)
          );
          const asyncCustomErrors = await Promise.all(promisedCustomErrors);
          const asyncCustomErrorsById = Object.fromEntries(asyncCustomErrors);
          const hasAsyncCustomErrors = Object.values(asyncCustomErrorsById).some(Boolean);
          const hasCustomError = hasServerError || hasAsyncCustomErrors;
          control.setCustomValidity(hasCustomError ? DEFAULT_INVALID_MESSAGE : '');
          const controlValidity = validityStateToObject(control.validity);
          setValidity((prevValidity) => ({ ...prevValidity, ...controlValidity }));
          setCustomErrors((prevErrors) => ({ ...prevErrors, ...asyncCustomErrorsById }));
        }
      },
      [setValidity, customValidators, setCustomErrors, hasServerError]
    );

    React.useEffect(() => {
      const control = controlRef.current;
      if (control) {
        // we only want validate on change (native "change" event, not React's "onChange")
        const handleChange = () => updateControlValidity(control);
        control.addEventListener('change', handleChange);
        return () => control.removeEventListener('change', handleChange);
      }
    }, [updateControlValidity]);

    const resetControlValidity = React.useCallback(() => {
      const control = controlRef.current;
      if (control) {
        control.setCustomValidity('');
        setValidity(undefined);
        setCustomErrors({});
      }
    }, [setCustomErrors, setValidity]);

    // reset validity and errors when the form is reset
    React.useEffect(() => {
      const form = controlRef.current?.form;
      if (form) {
        form.addEventListener('reset', resetControlValidity);
        return () => form.removeEventListener('reset', resetControlValidity);
      }
    }, [resetControlValidity]);

    return (
      <Primitive.input
        data-valid={fieldContext.validity?.valid === true ? true : undefined}
        data-invalid={fieldContext.validity?.valid === false ? true : undefined}
        aria-describedby={ariaDescriptionContext.getAriaDescription()}
        // disable default browser behaviour of showing built-in error message on hover
        title=""
        {...props}
        ref={composedRef}
        id={id}
        name={name}
        onInvalid={composeEventHandlers(props.onInvalid, (event) => {
          const control = event.currentTarget;
          updateControlValidity(control);
        })}
        onChange={composeEventHandlers(props.onChange, (event) => {
          // reset validity when user changes value
          resetControlValidity();
        })}
      />
    );
  }
);
FormControl.displayName = 'FormControl';

/* -------------------------------------------------------------------------------------------------
 * FormClientMessage
 * -----------------------------------------------------------------------------------------------*/

type FormClientMessageElement = React.ElementRef<typeof FormMessageImpl>;
interface FormBuiltInMessageProps extends FormClientMessageImplBuiltInProps {}
interface FormCustomMessageProps extends FormClientMessageImplCustomProps {
  type: 'customError';
}
type FormClientMessageProps = FormBuiltInMessageProps | FormCustomMessageProps;

const FormClientMessage = React.forwardRef<FormClientMessageElement, FormClientMessageProps>(
  ({ type, ...props }, forwardedRef) => {
    if (type === 'customError') {
      const messageProps = props as FormCustomMessageProps;
      return <FormClientMessageImplCustom ref={forwardedRef} {...messageProps} />;
    } else {
      const messageProps = { type, ...props } as FormBuiltInMessageProps;
      return <FormClientMessageImplBuiltIn ref={forwardedRef} {...messageProps} />;
    }
  }
);
FormClientMessage.displayName = 'FormClientMessage';

const DEFAULT_INVALID_MESSAGE = 'This value is not valid.';
const DEFAULT_BUILT_IN_MESSAGES: Record<
  FormClientMessageImplBuiltInProps['type'],
  string | undefined
> = {
  badInput: DEFAULT_INVALID_MESSAGE,
  patternMismatch: 'This value does not match the required pattern.',
  rangeOverflow: 'This value is too large.',
  rangeUnderflow: 'This value is too small.',
  stepMismatch: 'This value does not match the required step.',
  tooLong: 'This value is too long.',
  tooShort: 'This value is too short.',
  typeMismatch: 'This value does not match the required type.',
  valid: undefined,
  valueMissing: 'This value is missing.',
};

type FormClientMessageImplBuiltInElement = React.ElementRef<typeof FormMessageImpl>;
interface FormClientMessageImplBuiltInProps
  extends React.ComponentPropsWithoutRef<typeof FormMessageImpl> {
  // We have to spell out the type rather than use `Omit<ValidityStateKey, 'customError'>`
  // in order for autocomplete to work correctly in IDEs.
  type:
    | 'badInput'
    | 'patternMismatch'
    | 'rangeOverflow'
    | 'rangeUnderflow'
    | 'stepMismatch'
    | 'tooLong'
    | 'tooShort'
    | 'typeMismatch'
    | 'valid'
    | 'valueMissing';
}

const FormClientMessageImplBuiltIn = React.forwardRef<
  FormClientMessageImplBuiltInElement,
  FormClientMessageImplBuiltInProps
>((props, forwardedRef) => {
  const { type, children, ...messageProps } = props;
  const fieldContext = React.useContext(FormFieldContext);
  const matches = fieldContext.validity?.[type as ValidityStateKey];

  if (matches) {
    return (
      <FormMessageImpl ref={forwardedRef} {...messageProps}>
        {children ?? DEFAULT_BUILT_IN_MESSAGES[type]}
      </FormMessageImpl>
    );
  }

  return null;
});
FormClientMessageImplBuiltIn.displayName = 'FormClientMessageImplBuiltIn';

type FormClientMessageImplCustomElement = React.ElementRef<typeof FormMessageImpl>;
interface FormClientMessageImplCustomProps
  extends React.ComponentPropsWithoutRef<typeof FormMessageImpl> {
  isValid: CustomValidatorFn;
}

const FormClientMessageImplCustom = React.forwardRef<
  FormClientMessageImplCustomElement,
  FormClientMessageImplCustomProps
>((props, forwardedRef) => {
  const { isValid, id: idProp, children, ...messageProps } = props;
  const _id = useId();
  const id = idProp ?? _id;
  const fieldContext = React.useContext(FormFieldContext);
  const serverErrors = React.useContext(ServerErrorsContext);
  const hasServerError = fieldContext.name in serverErrors;

  const validatorEntry = React.useMemo(() => ({ id, validator: isValid }), [id, isValid]);
  const { setCustomValidators } = fieldContext;
  React.useEffect(() => {
    setCustomValidators((prev) => [...prev, validatorEntry]);
    return () => setCustomValidators((prev) => prev.filter((v) => v.id !== validatorEntry.id));
  }, [setCustomValidators, validatorEntry]);

  const { validity, customErrors } = fieldContext;
  const hasMatchingCustomError = customErrors[id];
  const matches =
    validity && !hasBuiltInError(validity) && !hasServerError && hasMatchingCustomError;

  if (matches) {
    return (
      <FormMessageImpl id={id} ref={forwardedRef} {...messageProps}>
        {children ?? DEFAULT_INVALID_MESSAGE}
      </FormMessageImpl>
    );
  }

  return null;
});
FormClientMessageImplCustom.displayName = 'FormClientMessageImplCustom';

type FormMessageImplElement = React.ElementRef<typeof Primitive.span>;
type PrimitiveSpanProps = React.ComponentPropsWithoutRef<typeof Primitive.span>;
interface FormMessageImplProps extends PrimitiveSpanProps {}

const FormMessageImpl = React.forwardRef<FormMessageImplElement, FormMessageImplProps>(
  (props, forwardedRef) => {
    const { id: idProp, ...messageProps } = props;
    const ariaDescriptionContext = React.useContext(AriaDescriptionContext);
    const _id = useId();
    const id = idProp ?? _id;

    const { onDescriptionIdAdd, onDescriptionIdRemove } = ariaDescriptionContext;
    React.useEffect(() => {
      onDescriptionIdAdd(id);
      return () => onDescriptionIdRemove(id);
    }, [id, onDescriptionIdAdd, onDescriptionIdRemove]);

    return <Primitive.span id={id} {...messageProps} ref={forwardedRef} />;
  }
);
FormMessageImpl.displayName = 'FormMessageImpl';

/* -------------------------------------------------------------------------------------------------
 * FormServerMessage
 * -----------------------------------------------------------------------------------------------*/

type FormServerMessageElement = React.ElementRef<typeof FormMessageImpl>;
interface FormServerMessageProps extends Omit<FormMessageImplProps, 'children'> {
  children?: React.ReactNode | ((errors: ServerError[]) => React.ReactNode);
}

const FormServerMessage = React.forwardRef<FormServerMessageElement, FormServerMessageProps>(
  (props, forwardedRef) => {
    const { children, ...messageProps } = props;
    const fieldContext = React.useContext(FormFieldContext);
    const serverErrors = React.useContext(ServerErrorsContext);
    const name = fieldContext.name || 'global';
    const errors = serverErrors[name];

    if (errors?.length) {
      const child = typeof children === 'function' ? children(errors) : children;
      return (
        <FormMessageImpl {...messageProps} ref={forwardedRef}>
          {child || errors.map((error) => error.message).join(' ')}
        </FormMessageImpl>
      );
    }

    return null;
  }
);
FormServerMessage.displayName = 'FormServerMessage';

/* -------------------------------------------------------------------------------------------------
 * FormValidityState
 * -----------------------------------------------------------------------------------------------*/

interface FormValidityStateProps {
  children: (validity: ValidityState | undefined) => React.ReactNode;
}

const FormValidityState = ({ children }: FormValidityStateProps) => {
  const fieldContext = React.useContext(FormFieldContext);
  return <>{children(fieldContext.validity)}</>;
};
FormValidityState.displayName = 'FormValidityState';

/* -------------------------------------------------------------------------------------------------
 * FormSubmit
 * -----------------------------------------------------------------------------------------------*/

type FormSubmitElement = React.ElementRef<typeof Primitive.button>;
type PrimitiveButtonProps = React.ComponentPropsWithoutRef<typeof Primitive.button>;
interface FormSubmitProps extends PrimitiveButtonProps {}

const FormSubmit = React.forwardRef<FormSubmitElement, FormSubmitProps>((props, forwardedRef) => {
  const ariaDescriptionContext = React.useContext(AriaDescriptionContext);
  return (
    <Primitive.button
      type="submit"
      aria-describedby={ariaDescriptionContext.getAriaDescription()}
      {...props}
      ref={forwardedRef}
    />
  );
});
FormSubmit.displayName = 'FormSubmit';

/* -----------------------------------------------------------------------------------------------*/

type ValidityStateKey = keyof ValidityState;
type FormFields = { [index in string]?: FormDataEntryValue };
type ValidatorSyncFn = (value: string, fields: FormFields) => boolean;
type ValidatorAsyncFn = (value: string, fields: FormFields) => Promise<boolean>;
type CustomValidatorFn = ValidatorSyncFn | ValidatorAsyncFn;
type ValidatorEntry = { id: string; validator: CustomValidatorFn };
type SyncValidatorEntry = { id: string; validator: ValidatorSyncFn };
type AsyncValidatorEntry = { id: string; validator: ValidatorAsyncFn };

function validityStateToObject(validity: ValidityState) {
  const object: any = {};
  for (const key in validity) {
    object[key] = validity[key as ValidityStateKey];
  }
  return object as Record<ValidityStateKey, boolean>;
}

function isHTMLElement(element: any): element is HTMLElement {
  return element instanceof HTMLElement;
}

function isFormControl(element: any): element is { validity: ValidityState } {
  return 'validity' in element;
}

function isInvalid(control: HTMLElement) {
  return isFormControl(control) && control.validity.valid === false;
}

function isAsyncValidator(validator: CustomValidatorFn): validator is ValidatorAsyncFn {
  return validator.constructor.name === 'AsyncFunction' || returnsPromise(validator);
}

function returnsPromise(func: Function) {
  return func() instanceof Promise;
}

function hasBuiltInError(validity: ValidityState) {
  let error = false;
  for (const validityKey in validity) {
    const key = validityKey as ValidityStateKey;
    if (key !== 'valid' && key !== 'customError' && validity[key]) {
      error = true;
      break;
    }
  }
  return error;
}

/* -----------------------------------------------------------------------------------------------*/

export {
  Form,
  FormField,
  FormLabel,
  FormControl,
  FormClientMessage,
  FormServerMessage,
  FormValidityState,
  FormSubmit,
  //
  Form as Root,
  FormField as Field,
  FormLabel as Label,
  FormControl as Control,
  FormClientMessage as ClientMessage,
  FormServerMessage as ServerMessage,
  FormValidityState as ValidityState,
  FormSubmit as Submit,
};

export type {
  FormProps,
  FormFieldProps,
  FormLabelProps,
  FormControlProps,
  FormClientMessageProps,
  FormServerMessageProps,
  FormValidityStateProps,
  FormSubmitProps,
  //
  ServerError,
  ServerErrors,
};
