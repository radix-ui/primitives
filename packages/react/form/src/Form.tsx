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

const noop = () => {};

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
interface FormProps extends PrimitiveFormProps {
  onClearServerErrors?: () => void;
}

const Form = React.forwardRef<FormElement, FormProps>(
  (props: ScopedProps<FormProps>, forwardedRef) => {
    const { __scopeForm, onClearServerErrors = noop, ...rootProps } = props;
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
          onInvalid={composeEventHandlers(props.onInvalid, (event) => {
            // focus first invalid control
            const firstInvalidControl = getFirstInvalidControl(event.currentTarget);
            if (firstInvalidControl === event.target) firstInvalidControl.focus();

            // prevent default browser UI for form validation
            event.preventDefault();
          })}
          // clear server errors when the form is re-submitted
          onSubmit={composeEventHandlers(props.onSubmit, onClearServerErrors, {
            checkForDefaultPrevented: false,
          })}
          // clear server errors when the form is reset
          onReset={composeEventHandlers(props.onReset, onClearServerErrors)}
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
  customMatcherEntries: CustomMatcherEntry[];
  setCustomMatcherEntries: React.Dispatch<React.SetStateAction<CustomMatcherEntry[]>>;
  customErrors: Record<string, boolean>;
  setCustomErrors: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  serverInvalid: boolean;
};
const [FormFieldProvider, useFormFieldContext] = createFormContext<FormFieldContextValue>(
  FIELD_NAME,
  {} as any
);

type FormFieldElement = React.ElementRef<typeof Primitive.div>;
type PrimitiveDivProps = Radix.ComponentPropsWithoutRef<typeof Primitive.div>;
interface FormFieldProps extends PrimitiveDivProps {
  name: string;
  serverInvalid?: boolean;
}

const FormField = React.forwardRef<FormFieldElement, FormFieldProps>(
  (props: ScopedProps<FormFieldProps>, forwardedRef) => {
    const { __scopeForm, name, serverInvalid = false, ...fieldProps } = props;

    const id = useId();
    const [validity, setValidity] = React.useState<ValidityState | undefined>(undefined);
    const [customMatcherEntries, setCustomMatcherEntries] = React.useState<CustomMatcherEntry[]>(
      []
    );
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
        customMatcherEntries={customMatcherEntries}
        setCustomMatcherEntries={setCustomMatcherEntries}
        customErrors={customErrors}
        setCustomErrors={setCustomErrors}
        serverInvalid={serverInvalid}
      >
        <AriaDescriptionProvider
          scope={__scopeForm}
          onDescriptionIdAdd={handleFieldMessageIdAdd}
          onDescriptionIdRemove={handleFieldMessageIdRemove}
          getAriaDescription={getAriaDescription}
        >
          <Primitive.div
            data-valid={getValidAttribute({ validity, serverInvalid })}
            data-invalid={getInvalidAttribute({ validity, serverInvalid })}
            {...fieldProps}
            ref={forwardedRef}
          />
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
        data-valid={getValidAttribute(fieldContext)}
        data-invalid={getInvalidAttribute(fieldContext)}
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

    const { setValidity, customMatcherEntries, setCustomErrors } = fieldContext;
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
        // 2. then get all field values to give to custom matchers for cross-comparisons

        const formData = control.form ? new FormData(control.form) : new FormData();
        const matcherArgs: CustomMatcherArgs = [control.value, formData];

        //------------------------------------------------------------------------------------------
        // 3. split sync and async custom matcher entries

        const syncCustomMatcherEntries: Array<SyncCustomMatcherEntry> = [];
        const ayncCustomMatcherEntries: Array<AsyncCustomMatcherEntry> = [];
        customMatcherEntries.forEach((customMatcherEntry) => {
          if (isAsyncCustomMatcher(customMatcherEntry.match, matcherArgs)) {
            ayncCustomMatcherEntries.push(customMatcherEntry as AsyncCustomMatcherEntry);
          } else {
            syncCustomMatcherEntries.push(customMatcherEntry as SyncCustomMatcherEntry);
          }
        });

        //------------------------------------------------------------------------------------------
        // 4. run sync custom matchers and update control validity / internal validity + errors

        const syncCustomErrors = syncCustomMatcherEntries.map(({ id, match }) => {
          return [id, match(...matcherArgs)] as const;
        });
        const syncCustomErrorsById = Object.fromEntries(syncCustomErrors);
        const hasSyncCustomErrors = Object.values(syncCustomErrorsById).some(Boolean);
        const hasCustomError = hasSyncCustomErrors;
        control.setCustomValidity(hasCustomError ? DEFAULT_INVALID_MESSAGE : '');
        const controlValidity = validityStateToObject(control.validity);
        setValidity((prevValidity) => ({ ...prevValidity, ...controlValidity }));
        setCustomErrors((prevErrors) => ({ ...prevErrors, ...syncCustomErrorsById }));

        //------------------------------------------------------------------------------------------
        // 5. run async custom matchers and update control validity / internal validity + errors

        if (!hasSyncCustomErrors && ayncCustomMatcherEntries.length > 0) {
          const promisedCustomErrors = ayncCustomMatcherEntries.map(({ id, match }) =>
            match(...matcherArgs).then((matches) => [id, matches] as const)
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
      [setValidity, customMatcherEntries, setCustomErrors]
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

    React.useEffect(() => {
      const form = controlRef.current?.closest('form');
      if (form && fieldContext.serverInvalid) {
        // focus first invalid control
        const firstInvalidControl = getFirstInvalidControl(form);
        if (firstInvalidControl === controlRef.current) firstInvalidControl.focus();
      }
    }, [fieldContext.serverInvalid]);

    return (
      <Primitive.input
        data-valid={getValidAttribute(fieldContext)}
        data-invalid={getInvalidAttribute(fieldContext)}
        aria-invalid={fieldContext.serverInvalid ? true : undefined}
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
 * FormMessage
 * -----------------------------------------------------------------------------------------------*/

const validityMatchers = [
  'badInput',
  'patternMismatch',
  'rangeOverflow',
  'rangeUnderflow',
  'stepMismatch',
  'tooLong',
  'tooShort',
  'typeMismatch',
  'valid',
  'valueMissing',
] as const;
type ValidityMatcher = typeof validityMatchers[number];

const DEFAULT_INVALID_MESSAGE = 'This value is not valid';
const DEFAULT_BUILT_IN_MESSAGES: Record<ValidityMatcher, string | undefined> = {
  badInput: DEFAULT_INVALID_MESSAGE,
  patternMismatch: 'This value does not match the required pattern',
  rangeOverflow: 'This value is too large',
  rangeUnderflow: 'This value is too small',
  stepMismatch: 'This value does not match the required step',
  tooLong: 'This value is too long',
  tooShort: 'This value is too short',
  typeMismatch: 'This value does not match the required type',
  valid: undefined,
  valueMissing: 'This value is missing',
};

const MESSAGE_NAME = 'FormMessage';

type FormMessageElement = FormMessageImplElement;
interface FormMessageProps extends FormMessageImplProps {
  match?: ValidityMatcher | CustomMatcher;
  forceMatch?: boolean;
}

const FormMessage = React.forwardRef<FormMessageElement, FormMessageProps>(
  (props: ScopedProps<FormMessageProps>, forwardedRef) => {
    const { match, ...messageProps } = props;

    if (match === undefined) {
      return (
        <FormMessageImpl {...messageProps} ref={forwardedRef}>
          {props.children || DEFAULT_INVALID_MESSAGE}
        </FormMessageImpl>
      );
    } else if (typeof match === 'function') {
      return <FormCustomMessage match={match} {...messageProps} ref={forwardedRef} />;
    } else {
      return <FormBuiltInMessage match={match} {...messageProps} ref={forwardedRef} />;
    }
  }
);

FormMessage.displayName = MESSAGE_NAME;

type FormBuiltInMessageElement = FormMessageImplElement;
interface FormBuiltInMessageProps extends FormMessageImplProps {
  match: ValidityMatcher;
  forceMatch?: boolean;
}

const FormBuiltInMessage = React.forwardRef<FormBuiltInMessageElement, FormBuiltInMessageProps>(
  (props: ScopedProps<FormBuiltInMessageProps>, forwardedRef) => {
    const { match, forceMatch = false, children, ...messageProps } = props;
    const fieldContext = useFormFieldContext(MESSAGE_NAME, messageProps.__scopeForm);
    const matches = forceMatch || fieldContext.validity?.[match];

    if (matches) {
      return (
        <FormMessageImpl ref={forwardedRef} {...messageProps}>
          {children ?? DEFAULT_BUILT_IN_MESSAGES[match]}
        </FormMessageImpl>
      );
    }

    return null;
  }
);

type FormCustomMessageElement = React.ElementRef<typeof FormMessageImpl>;
interface FormCustomMessageProps extends Radix.ComponentPropsWithoutRef<typeof FormMessageImpl> {
  match: CustomMatcher;
  forceMatch?: boolean;
}

const FormCustomMessage = React.forwardRef<FormCustomMessageElement, FormCustomMessageProps>(
  (props: ScopedProps<FormCustomMessageProps>, forwardedRef) => {
    const { match, forceMatch = false, id: idProp, children, ...messageProps } = props;
    const ref = React.useRef<FormCustomMessageElement>(null);
    const composedRef = useComposedRefs(forwardedRef, ref);
    const _id = useId();
    const id = idProp ?? _id;
    const fieldContext = useFormFieldContext(MESSAGE_NAME, messageProps.__scopeForm);

    const customMatcherEntry = React.useMemo(() => ({ id, match }), [id, match]);
    const { setCustomMatcherEntries } = fieldContext;
    React.useEffect(() => {
      setCustomMatcherEntries((prev) => [...prev, customMatcherEntry]);
      return () =>
        setCustomMatcherEntries((prev) => prev.filter((v) => v.id !== customMatcherEntry.id));
    }, [setCustomMatcherEntries, customMatcherEntry]);

    const { validity, customErrors } = fieldContext;
    const hasMatchingCustomError = customErrors[id];
    const matches =
      forceMatch || (validity && !hasBuiltInError(validity) && hasMatchingCustomError);

    if (matches) {
      return (
        <FormMessageImpl id={id} ref={composedRef} {...messageProps}>
          {children ?? DEFAULT_INVALID_MESSAGE}
        </FormMessageImpl>
      );
    }

    return null;
  }
);

type FormMessageImplElement = React.ElementRef<typeof Primitive.span>;
type PrimitiveSpanProps = Radix.ComponentPropsWithoutRef<typeof Primitive.span>;
interface FormMessageImplProps extends PrimitiveSpanProps {}

const FormMessageImpl = React.forwardRef<FormMessageImplElement, FormMessageImplProps>(
  (props: ScopedProps<FormMessageProps>, forwardedRef) => {
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
type SyncCustomMatcher = (value: string, formData: FormData) => boolean;
type AsyncCustomMatcher = (value: string, formData: FormData) => Promise<boolean>;
type CustomMatcher = SyncCustomMatcher | AsyncCustomMatcher;
type CustomMatcherEntry = { id: string; match: CustomMatcher };
type SyncCustomMatcherEntry = { id: string; match: SyncCustomMatcher };
type AsyncCustomMatcherEntry = { id: string; match: AsyncCustomMatcher };
type CustomMatcherArgs = [string, FormData];

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
  return (
    isFormControl(control) &&
    (control.validity.valid === false || control.getAttribute('aria-invalid') === 'true')
  );
}

function getFirstInvalidControl(form: HTMLFormElement): HTMLElement | undefined {
  const elements = form.elements;
  const [firstInvalidControl] = Array.from(elements).filter(isHTMLElement).filter(isInvalid);
  return firstInvalidControl;
}

function isAsyncCustomMatcher(
  match: CustomMatcher,
  args: CustomMatcherArgs
): match is AsyncCustomMatcher {
  return match.constructor.name === 'AsyncFunction' || returnsPromise(match, args);
}

function returnsPromise(func: Function, args: CustomMatcherArgs) {
  return func(...args) instanceof Promise;
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

interface ValidityArgs {
  validity: FormFieldContextValue['validity'];
  serverInvalid: FormFieldContextValue['serverInvalid'];
}

function getValidAttribute({ validity, serverInvalid }: ValidityArgs) {
  if (validity?.valid === true && !serverInvalid) return true;
  return undefined;
}
function getInvalidAttribute({ validity, serverInvalid }: ValidityArgs) {
  if (validity?.valid === false || serverInvalid) return true;
  return undefined;
}

/* -----------------------------------------------------------------------------------------------*/

export {
  createFormScope,
  //
  Form,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
  FormValidityState,
  FormSubmit,
  //
  Form as Root,
  FormField as Field,
  FormLabel as Label,
  FormControl as Control,
  FormMessage as Message,
  FormValidityState as ValidityState,
  FormSubmit as Submit,
};

export type {
  FormProps,
  FormFieldProps,
  FormLabelProps,
  FormControlProps,
  FormMessageProps,
  FormValidityStateProps,
  FormSubmitProps,
};
