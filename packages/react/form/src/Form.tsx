import * as React from 'react';
import { composeEventHandlers } from '@radix-ui/primitive';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import { createContextScope } from '@radix-ui/react-context';
import { useId } from '@radix-ui/react-id';
import { Label } from '@radix-ui/react-label';
import { Primitive } from '@radix-ui/react-primitive';

import type * as Radix from '@radix-ui/react-primitive';
import type { Scope } from '@radix-ui/react-context';

type ScopedProps<P> = P & { __scopeForm?: Scope };
const [createFormContext, createFormScope] = createContextScope('Form');

/* -------------------------------------------------------------------------------------------------
 * Form
 * -----------------------------------------------------------------------------------------------*/

const FORM_NAME = 'Form';

type AriaDescriptionContextValue = {
  onDescriptionIdAdd: (id: string) => void;
  onDescriptionIdRemove: (id: string) => void;
  getAriaDescription(): string | undefined;
};
const [AriaDescriptionProvider, useAriaDescriptionContext] =
  createFormContext<AriaDescriptionContextValue>(FORM_NAME, {
    onDescriptionIdAdd: () => {},
    onDescriptionIdRemove: () => {},
    getAriaDescription: () => undefined,
  });

type FormElement = React.ElementRef<typeof Primitive.form>;
type PrimitiveFormProps = Radix.ComponentPropsWithoutRef<typeof Primitive.form>;
interface FormProps extends PrimitiveFormProps {}

const Form = React.forwardRef<FormElement, FormProps>(
  (props: ScopedProps<FormProps>, forwardedRef) => {
    const { __scopeForm, ...rootProps } = props;
    const formRef = React.useRef<HTMLFormElement>(null);
    const composedFormRef = useComposedRefs(forwardedRef, formRef);

    const [globalMessageId, setGlobalMessageId] = React.useState<string | undefined>(undefined);
    const handleGlobalMessageIdAdd = React.useCallback((id: string) => setGlobalMessageId(id), []);
    const handleGlobalMessageIdRemove = React.useCallback(
      (id: string) => setGlobalMessageId(undefined),
      []
    );
    const getAriaDescription = React.useCallback(() => globalMessageId, [globalMessageId]);

    return (
      <AriaDescriptionProvider
        scope={__scopeForm}
        onDescriptionIdAdd={handleGlobalMessageIdAdd}
        onDescriptionIdRemove={handleGlobalMessageIdRemove}
        getAriaDescription={getAriaDescription}
      >
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
        />
      </AriaDescriptionProvider>
    );
  }
);

Form.displayName = FORM_NAME;

/* -------------------------------------------------------------------------------------------------
 * FormField
 * -----------------------------------------------------------------------------------------------*/

const FIELD_NAME = 'FormField';

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
const [FormFieldProvider, useFormFieldContext] = createFormContext<FormFieldContextValue>(
  FIELD_NAME,
  {} as any
);

type FormFieldElement = React.ElementRef<typeof Primitive.div>;
type PrimitiveDivProps = Radix.ComponentPropsWithoutRef<typeof Primitive.div>;
interface FormFieldProps extends PrimitiveDivProps {
  name: string;
}

const FormField = React.forwardRef<FormFieldElement, FormFieldProps>(
  (props: ScopedProps<FormFieldProps>, forwardedRef) => {
    const { __scopeForm, name, ...fieldProps } = props;

    const id = useId();
    const [validity, setValidity] = React.useState<ValidityState | undefined>(undefined);
    const [customValidators, setCustomValidators] = React.useState<ValidatorEntry[]>([]);
    const [customErrors, setCustomErrors] = React.useState<Record<string, boolean>>({});

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

    return (
      <FormFieldProvider
        scope={__scopeForm}
        id={id}
        name={name}
        validity={validity}
        setValidity={setValidity}
        customValidators={customValidators}
        setCustomValidators={setCustomValidators}
        customErrors={customErrors}
        setCustomErrors={setCustomErrors}
      >
        <AriaDescriptionProvider
          scope={__scopeForm}
          onDescriptionIdAdd={handleFieldMessageIdAdd}
          onDescriptionIdRemove={handleFieldMessageIdRemove}
          getAriaDescription={getAriaDescription}
        >
          <Primitive.div {...fieldProps} ref={forwardedRef} />
        </AriaDescriptionProvider>
      </FormFieldProvider>
    );
  }
);

FormField.displayName = FIELD_NAME;

/* -------------------------------------------------------------------------------------------------
 * FormLabel
 * -----------------------------------------------------------------------------------------------*/

const LABEL_NAME = 'FormLabel';

type FormLabelElement = React.ElementRef<typeof Label>;
type LabelProps = Radix.ComponentPropsWithoutRef<typeof Label>;
interface FormLabelProps extends LabelProps {}

const FormLabel = React.forwardRef<FormLabelElement, FormLabelProps>(
  (props: ScopedProps<FormLabelProps>, forwardedRef) => {
    const { __scopeForm, ...labelProps } = props;
    const fieldContext = useFormFieldContext(LABEL_NAME, __scopeForm);
    const htmlFor = labelProps.htmlFor || fieldContext.id;

    return (
      <Label
        data-valid={fieldContext.validity?.valid === true ? true : undefined}
        data-invalid={fieldContext.validity?.valid === false ? true : undefined}
        {...labelProps}
        ref={forwardedRef}
        htmlFor={htmlFor}
      />
    );
  }
);

FormLabel.displayName = LABEL_NAME;

/* -------------------------------------------------------------------------------------------------
 * FormControl
 * -----------------------------------------------------------------------------------------------*/

const CONTROL_NAME = 'FormControl';

type FormControlElement = React.ElementRef<typeof Primitive.input>;
type PrimitiveInputProps = Radix.ComponentPropsWithoutRef<typeof Primitive.input>;
interface FormControlProps extends PrimitiveInputProps {}

const FormControl = React.forwardRef<FormControlElement, FormControlProps>(
  (props: ScopedProps<FormControlProps>, forwardedRef) => {
    const { __scopeForm, ...controlProps } = props;

    const fieldContext = useFormFieldContext(CONTROL_NAME, __scopeForm);
    const ariaDescriptionContext = useAriaDescriptionContext(CONTROL_NAME, __scopeForm);
    const controlRef = React.useRef<FormControlElement>(null);
    const composedRef = useComposedRefs(forwardedRef, controlRef);
    const name = controlProps.name || fieldContext.name;
    const id = controlProps.id || fieldContext.id;

    const { setValidity, customValidators, setCustomErrors } = fieldContext;
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
          if (isAsyncValidator(validatorEntry.validate)) {
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

        const syncCustomErrors = syncCustomValidators.map(({ id, validate }) => {
          return [id, !validate(control.value, fields)] as const;
        });
        const syncCustomErrorsById = Object.fromEntries(syncCustomErrors);
        const hasSyncCustomErrors = Object.values(syncCustomErrorsById).some(Boolean);
        const hasCustomError = hasSyncCustomErrors;
        control.setCustomValidity(hasCustomError ? DEFAULT_INVALID_MESSAGE : '');
        const controlValidity = validityStateToObject(control.validity);
        setValidity((prevValidity) => ({ ...prevValidity, ...controlValidity }));
        setCustomErrors((prevErrors) => ({ ...prevErrors, ...syncCustomErrorsById }));

        //------------------------------------------------------------------------------------------
        // 5. run async custom validators and update control validity / internal validity + errors

        if (!hasSyncCustomErrors && ayncCustomValidators.length > 0) {
          const promisedCustomErrors = ayncCustomValidators.map(({ id, validate }) =>
            validate(control.value, fields).then((isValid) => [id, !isValid] as const)
          );
          const asyncCustomErrors = await Promise.all(promisedCustomErrors);
          const asyncCustomErrorsById = Object.fromEntries(asyncCustomErrors);
          const hasAsyncCustomErrors = Object.values(asyncCustomErrorsById).some(Boolean);
          const hasCustomError = hasAsyncCustomErrors;
          control.setCustomValidity(hasCustomError ? DEFAULT_INVALID_MESSAGE : '');
          const controlValidity = validityStateToObject(control.validity);
          setValidity((prevValidity) => ({ ...prevValidity, ...controlValidity }));
          setCustomErrors((prevErrors) => ({ ...prevErrors, ...asyncCustomErrorsById }));
        }
      },
      [setValidity, customValidators, setCustomErrors]
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
        {...controlProps}
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

FormControl.displayName = CONTROL_NAME;

/* -------------------------------------------------------------------------------------------------
 * FormValidationMessage
 * -----------------------------------------------------------------------------------------------*/

const VALIDATION_MESSAGE_NAME = 'FormValidationMessage';

type FormValidationMessageElement = React.ElementRef<typeof FormMessageImpl>;
interface FormBuiltInMessageProps extends FormValidationMessageImplBuiltInProps {}
interface FormCustomMessageProps extends FormValidationMessageImplCustomProps {
  type: 'customError';
}
type FormValidationMessageProps = FormBuiltInMessageProps | FormCustomMessageProps;

const FormValidationMessage = React.forwardRef<
  FormValidationMessageElement,
  FormValidationMessageProps
>((props: ScopedProps<FormValidationMessageProps>, forwardedRef) => {
  const { type, ...messageProps } = props;
  if (type === 'customError') {
    const typedMessageProps = messageProps as FormCustomMessageProps;
    return <FormValidationMessageImplCustom ref={forwardedRef} {...typedMessageProps} />;
  } else {
    const typedMessageProps = { type, ...messageProps } as FormBuiltInMessageProps;
    return <FormValidationMessageImplBuiltIn ref={forwardedRef} {...typedMessageProps} />;
  }
});

FormValidationMessage.displayName = VALIDATION_MESSAGE_NAME;

const DEFAULT_INVALID_MESSAGE = 'This value is not valid.';
const DEFAULT_BUILT_IN_MESSAGES: Record<
  FormValidationMessageImplBuiltInProps['type'],
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

type FormValidationMessageImplBuiltInElement = React.ElementRef<typeof FormMessageImpl>;
interface FormValidationMessageImplBuiltInProps
  extends Radix.ComponentPropsWithoutRef<typeof FormMessageImpl> {
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
  defaultVisible?: boolean;
}

const FormValidationMessageImplBuiltIn = React.forwardRef<
  FormValidationMessageImplBuiltInElement,
  FormValidationMessageImplBuiltInProps
>((props: ScopedProps<FormValidationMessageImplBuiltInProps>, forwardedRef) => {
  const { defaultVisible = false, type, children, ...messageProps } = props;
  const fieldContext = useFormFieldContext(VALIDATION_MESSAGE_NAME, messageProps.__scopeForm);
  const matches = defaultVisible || fieldContext.validity?.[type as ValidityStateKey];

  if (matches) {
    return (
      <FormMessageImpl ref={forwardedRef} {...messageProps}>
        {children ?? DEFAULT_BUILT_IN_MESSAGES[type]}
      </FormMessageImpl>
    );
  }

  return null;
});

type FormValidationMessageImplCustomElement = React.ElementRef<typeof FormMessageImpl>;
interface FormValidationMessageImplCustomProps
  extends Radix.ComponentPropsWithoutRef<typeof FormMessageImpl> {
  validate: CustomValidatorFn;
  defaultVisible?: boolean;
}

const FormValidationMessageImplCustom = React.forwardRef<
  FormValidationMessageImplCustomElement,
  FormValidationMessageImplCustomProps
>((props: ScopedProps<FormValidationMessageImplCustomProps>, forwardedRef) => {
  const { defaultVisible, validate, id: idProp, children, ...messageProps } = props;
  const _id = useId();
  const id = idProp ?? _id;
  const fieldContext = useFormFieldContext(VALIDATION_MESSAGE_NAME, messageProps.__scopeForm);

  const validatorEntry = React.useMemo(() => ({ id, validate }), [id, validate]);
  const { setCustomValidators } = fieldContext;
  React.useEffect(() => {
    setCustomValidators((prev) => [...prev, validatorEntry]);
    return () => setCustomValidators((prev) => prev.filter((v) => v.id !== validatorEntry.id));
  }, [setCustomValidators, validatorEntry]);

  const { validity, customErrors } = fieldContext;
  const hasMatchingCustomError = customErrors[id];
  const matches =
    defaultVisible || (validity && !hasBuiltInError(validity) && hasMatchingCustomError);

  if (matches) {
    return (
      <FormMessageImpl id={id} ref={forwardedRef} {...messageProps}>
        {children ?? DEFAULT_INVALID_MESSAGE}
      </FormMessageImpl>
    );
  }

  return null;
});

type FormMessageImplElement = React.ElementRef<typeof Primitive.span>;
type PrimitiveSpanProps = Radix.ComponentPropsWithoutRef<typeof Primitive.span>;
interface FormMessageImplProps extends PrimitiveSpanProps {}

const FormMessageImpl = React.forwardRef<FormMessageImplElement, FormMessageImplProps>(
  (props: ScopedProps<FormMessageImplProps>, forwardedRef) => {
    const { __scopeForm, id: idProp, ...messageProps } = props;
    const ariaDescriptionContext = useAriaDescriptionContext('FormMessage', __scopeForm);
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

/* -------------------------------------------------------------------------------------------------
 * FormValidityState
 * -----------------------------------------------------------------------------------------------*/

const VALIDITY_STATE_NAME = 'FormValidityState';

interface FormValidityStateProps {
  children: (validity: ValidityState | undefined) => React.ReactNode;
}

const FormValidityState = (props: ScopedProps<FormValidityStateProps>) => {
  const { __scopeForm, children } = props;
  const fieldContext = useFormFieldContext(VALIDITY_STATE_NAME, __scopeForm);
  return <>{children(fieldContext.validity)}</>;
};

FormValidityState.displayName = VALIDITY_STATE_NAME;

/* -------------------------------------------------------------------------------------------------
 * FormSubmit
 * -----------------------------------------------------------------------------------------------*/

const SUBMIT_NAME = 'FormSubmit';

type FormSubmitElement = React.ElementRef<typeof Primitive.button>;
type PrimitiveButtonProps = Radix.ComponentPropsWithoutRef<typeof Primitive.button>;
interface FormSubmitProps extends PrimitiveButtonProps {}

const FormSubmit = React.forwardRef<FormSubmitElement, FormSubmitProps>(
  (props: ScopedProps<FormSubmitProps>, forwardedRef) => {
    const { __scopeForm, ...submitProps } = props;
    const ariaDescriptionContext = useAriaDescriptionContext(SUBMIT_NAME, __scopeForm);
    return (
      <Primitive.button
        type="submit"
        aria-describedby={ariaDescriptionContext.getAriaDescription()}
        {...submitProps}
        ref={forwardedRef}
      />
    );
  }
);

FormSubmit.displayName = SUBMIT_NAME;

/* -----------------------------------------------------------------------------------------------*/

type ValidityStateKey = keyof ValidityState;
type FormFields = { [index in string]?: FormDataEntryValue };
type ValidatorSyncFn = (value: string, fields: FormFields) => boolean;
type ValidatorAsyncFn = (value: string, fields: FormFields) => Promise<boolean>;
type CustomValidatorFn = ValidatorSyncFn | ValidatorAsyncFn;
type ValidatorEntry = { id: string; validate: CustomValidatorFn };
type SyncValidatorEntry = { id: string; validate: ValidatorSyncFn };
type AsyncValidatorEntry = { id: string; validate: ValidatorAsyncFn };

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
  createFormScope,
  //
  Form,
  FormField,
  FormLabel,
  FormControl,
  FormValidationMessage,
  FormValidityState,
  FormSubmit,
  //
  Form as Root,
  FormField as Field,
  FormLabel as Label,
  FormControl as Control,
  FormValidationMessage as ValidationMessage,
  FormValidityState as ValidityState,
  FormSubmit as Submit,
};

export type {
  FormProps,
  FormFieldProps,
  FormLabelProps,
  FormControlProps,
  FormValidationMessageProps,
  FormValidityStateProps,
  FormSubmitProps,
};
