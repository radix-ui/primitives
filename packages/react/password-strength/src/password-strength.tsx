import * as React from 'react';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { Primitive } from '@radix-ui/react-primitive';
import { useIsHydrated } from '@radix-ui/react-use-is-hydrated';
import { unstable_createCollection as createCollection } from '@radix-ui/react-collection';
import type { Scope } from '@radix-ui/react-context';
import { createContextScope } from '@radix-ui/react-context';
import { composeEventHandlers } from '@radix-ui/primitive';

// This reference is for constructing an in-memory input element whose only
// function is to reference the validity property for iterating through all
// validity keys. We're breaking some rules here, so only set this once
// and only when React is hydrated on the client.
const INPUT_CACHE = new WeakMap<typeof PasswordStrength, HTMLInputElement | null>();

const PASSWORD_STRENGTH_NAME = 'PasswordStrength';

/* -------------------------------------------------------------------------------------------------
 * PasswordStrengthProvider
 * -----------------------------------------------------------------------------------------------*/

interface PasswordStrengthContextValue {
  rules: ValidatedRule[];
  progress: number;
  validatedRuleCount: number;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}

const [Collection, { useCollection, createCollectionScope }] =
  createCollection<HTMLDivElement>(PASSWORD_STRENGTH_NAME);
const [createOneTimePasswordFieldContext] = createContextScope(PASSWORD_STRENGTH_NAME, [
  createCollectionScope,
]);

const [PasswordStrengthProvider, usePasswordStrengthContext] =
  createOneTimePasswordFieldContext<PasswordStrengthContextValue>(PASSWORD_STRENGTH_NAME);

type ScopedProps<P> = P & { __scopePasswordStrength?: Scope };

/* -------------------------------------------------------------------------------------------------
 * PasswordStrength
 * -----------------------------------------------------------------------------------------------*/

interface PasswordStrengthProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  rules: PasswordStrengthRule[];
}

const PasswordStrength: React.FC<PasswordStrengthProps> = ({
  __scopePasswordStrength,
  value: valueProp,
  defaultValue,
  onValueChange,
  children,
  rules,
}: ScopedProps<PasswordStrengthProps>) => {
  const [value, setValue] = useControllableState({
    prop: valueProp,
    defaultProp: defaultValue ?? '',
    onChange: onValueChange,
  });
  const { validatedRules, validatedRuleCount, progress } = React.useMemo(() => {
    let validatedRuleCount = 0;
    const validatedRules: ValidatedRule[] = [];
    for (const rule of rules) {
      const isValid = rule.validate(value ?? '');
      if (isValid) {
        validatedRuleCount++;
      }
      validatedRules.push({ label: rule.label, isValid });
    }
    const progress = validatedRuleCount / rules.length;
    return { validatedRuleCount, validatedRules, progress };
  }, [rules, value]);

  const isHydrated = useIsHydrated();
  if (isHydrated && !INPUT_CACHE.has(PasswordStrength)) {
    INPUT_CACHE.set(PasswordStrength, document.createElement('input'));
  }

  return (
    <Collection.Provider scope={__scopePasswordStrength}>
      <Collection.Slot scope={__scopePasswordStrength}>
        <PasswordStrengthProvider
          scope={__scopePasswordStrength}
          progress={progress}
          rules={validatedRules}
          value={value}
          validatedRuleCount={validatedRuleCount}
          setValue={setValue}
        >
          {children}
        </PasswordStrengthProvider>
      </Collection.Slot>
    </Collection.Provider>
  );
};
PasswordStrength.displayName = PASSWORD_STRENGTH_NAME;

/* -------------------------------------------------------------------------------------------------
 * PasswordStrengthProgress
 * -----------------------------------------------------------------------------------------------*/

const PASSWORD_STRENGTH_PROGRESS_NAME = PASSWORD_STRENGTH_NAME + 'Progress';

interface PasswordStrengthProgressOwnProps {
  getAriaValuetext?: (props: {
    rules: ValidatedRule[];
    total: number;
    validated: number;
  }) => string;
}

interface PasswordStrengthProgressProps
  extends Omit<
      React.ComponentPropsWithoutRef<typeof Primitive.div>,
      keyof PasswordStrengthProgressOwnProps
    >,
    PasswordStrengthProgressOwnProps {}

const PasswordStrengthProgress = React.forwardRef<HTMLDivElement, PasswordStrengthProgressProps>(
  (
    {
      __scopePasswordStrength,
      children,
      'aria-valuetext': ariaValueTextProp,
      getAriaValuetext,
      ...props
    }: ScopedProps<PasswordStrengthProgressProps>,
    forwardedRef
  ) => {
    const { rules, progress, validatedRuleCount } = usePasswordStrengthContext(
      PASSWORD_STRENGTH_PROGRESS_NAME,
      __scopePasswordStrength
    );
    const totalRuleCount = rules.length;

    let ariaValueText: string | undefined;
    if (ariaValueTextProp) {
      ariaValueText = ariaValueTextProp;
    } else if (typeof getAriaValuetext === 'function') {
      ariaValueText = getAriaValuetext({
        rules,
        total: totalRuleCount,
        validated: validatedRuleCount,
      });
    }
    if (!ariaValueText) {
      ariaValueText = `${validatedRuleCount} of ${totalRuleCount} rules satisfied`;
    }

    return (
      <Primitive.div
        ref={forwardedRef}
        role="progressbar"
        aria-label="Password strength"
        aria-valuemin={0}
        aria-valuemax={1}
        aria-valuetext={ariaValueText}
        aria-valuenow={progress}
        style={
          {
            '--radix-password-strength-progress': progress,
            '--radix-password-strength-rule-count': totalRuleCount,
            '--radix-password-strength-step': Math.ceil(progress * totalRuleCount),
          } as React.CSSProperties
        }
        data-step={Math.ceil(progress * totalRuleCount)}
        {...props}
      >
        {children}
      </Primitive.div>
    );
  }
);
PasswordStrengthProgress.displayName = PASSWORD_STRENGTH_PROGRESS_NAME;

/* -------------------------------------------------------------------------------------------------
 * PasswordStrengthInput
 * -----------------------------------------------------------------------------------------------*/

const PASSWORD_STRENGTH_INPUT_NAME = PASSWORD_STRENGTH_NAME + 'Input';

interface PasswordStrengthInputProps
  extends Omit<React.ComponentPropsWithoutRef<typeof Primitive.input>, 'value' | 'type'> {
  type?: 'password' | 'text';
}

const PasswordStrengthInput = React.forwardRef<HTMLInputElement, PasswordStrengthInputProps>(
  (
    {
      __scopePasswordStrength,
      onChange,
      // TODO: warn if value is passed
      // @ts-expect-error
      value: _value,
      type = 'password',
      ...props
    }: ScopedProps<PasswordStrengthInputProps>,
    forwardedRef
  ) => {
    const { progress, value, setValue } = usePasswordStrengthContext(
      PASSWORD_STRENGTH_INPUT_NAME,
      __scopePasswordStrength
    );
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    const ref = useComposedRefs(forwardedRef, inputRef);

    return (
      <Primitive.input
        ref={ref}
        value={value}
        onChange={composeEventHandlers(onChange, (event) => {
          setValue(event.target.value);
        })}
        type={type}
        aria-invalid={progress !== 1 || undefined}
        {...props}
      />
    );
  }
);
PasswordStrengthInput.displayName = PASSWORD_STRENGTH_INPUT_NAME;

/* -------------------------------------------------------------------------------------------------
 * PasswordStrengthIndicator
 * -----------------------------------------------------------------------------------------------*/

const PASSWORD_STRENGTH_INDICATOR_NAME = PASSWORD_STRENGTH_NAME + 'Indicator';

interface PasswordStrengthIndicatorProps
  extends React.ComponentPropsWithoutRef<typeof Primitive.div> {
  index?: number;
}

const PasswordStrengthIndicator = React.forwardRef<HTMLDivElement, PasswordStrengthIndicatorProps>(
  (
    {
      __scopePasswordStrength,
      style,
      index: indexProp,
      ...props
    }: ScopedProps<PasswordStrengthIndicatorProps>,
    forwardedRef
  ) => {
    const { progress, rules } = usePasswordStrengthContext(
      PASSWORD_STRENGTH_INDICATOR_NAME,
      __scopePasswordStrength
    );
    const collection = useCollection(__scopePasswordStrength);
    const [element, setElement] = React.useState<HTMLDivElement | null>(null);
    const index = indexProp ?? (element ? collection.indexOf(element) : -1);
    const ownScore = calculateElementProgress(progress, index, rules.length);
    const composedRef = useComposedRefs(forwardedRef, setElement);
    return (
      <Collection.ItemSlot scope={__scopePasswordStrength}>
        <Primitive.div
          style={
            {
              ...style,
              '--radix-password-strength-indicator-progress': ownScore,
            } as React.CSSProperties
          }
          aria-hidden
          data-progress={ownScore}
          data-active={ownScore > 0}
          data-index={index}
          ref={composedRef}
          {...props}
        />
      </Collection.ItemSlot>
    );
  }
);
PasswordStrengthIndicator.displayName = PASSWORD_STRENGTH_INDICATOR_NAME;

/* -------------------------------------------------------------------------------------------------
 * PasswordStrengthRules
 * -----------------------------------------------------------------------------------------------*/

const PASSWORD_STRENGTH_RULES_NAME = PASSWORD_STRENGTH_NAME + 'Rules';

interface PasswordStrengthRulesProps {
  render: (props: { rules: Array<ValidatedRule> }) => React.ReactNode;
}

const PasswordStrengthRules: React.FC<PasswordStrengthRulesProps> = ({
  __scopePasswordStrength,
  render,
}: ScopedProps<PasswordStrengthRulesProps>) => {
  const { rules } = usePasswordStrengthContext(
    PASSWORD_STRENGTH_RULES_NAME,
    __scopePasswordStrength
  );
  return render({ rules });
};
PasswordStrengthRules.displayName = PASSWORD_STRENGTH_RULES_NAME;

/* -------------------------------------------------------------------------------------------------
 * PasswordStrengthAnnounce
 * -----------------------------------------------------------------------------------------------*/

const PASSWORD_STRENGTH_ANNOUNCE_NAME = PASSWORD_STRENGTH_NAME + 'Announce';

interface PasswordStrengthAnnounceProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'children'> {
  message?: (props: { isValid: boolean }) => string;
}

// TODO: Not sure if we need this, test with different
// ATs to see if aria-invalid + error state is sufficient.
const PasswordStrengthAnnounce = React.forwardRef<HTMLDivElement, PasswordStrengthAnnounceProps>(
  (
    {
      __scopePasswordStrength,
      style,
      message,
      // @ts-expect-error
      children,
      ...props
    }: ScopedProps<PasswordStrengthAnnounceProps>,
    forwardedRef
  ) => {
    const { rules, progress } = usePasswordStrengthContext(
      PASSWORD_STRENGTH_ANNOUNCE_NAME,
      __scopePasswordStrength
    );
    const isValid = progress >= 1;
    const [wasValid, setWasValid] = React.useState(isValid);
    const validationHasChanged = React.useRef(false);
    if (!validationHasChanged.current && isValid !== wasValid) {
      setWasValid(isValid);
      validationHasChanged.current = true;
    }

    // TODO: add fallback based on rules
    let announcement = isValid
      ? 'Password is valid'
      : rules.reduce((message, rule) => {
          if (!rule.isValid) {
            return message
              ? `; ${message} ${rule.label}`
              : `Password does not meet the following requirements: ${rule.label}`;
          }
          return message;
        }, '');
    if (message) {
      const results = message({ isValid });
      if (typeof results === 'string' && results !== '') {
        announcement = results;
      }
    }

    return (
      <Primitive.div role="region" aria-live="polite" ref={forwardedRef} {...props}>
        {!validationHasChanged.current
          ? // Live region should only announce changes to the validation state
            ''
          : announcement}
      </Primitive.div>
    );
  }
);
PasswordStrengthAnnounce.displayName = PASSWORD_STRENGTH_ANNOUNCE_NAME;

/* -----------------------------------------------------------------------------------------------*/

function calculateElementProgress(progress: number, index: number, ruleCount: number): number {
  if (ruleCount <= 1) {
    return progress;
  }
  const elementProgress = progress * ruleCount - index;
  return Math.min(1, Math.max(0, elementProgress));
}

interface PasswordStrengthRule {
  label: string;
  validate: (value: string) => boolean;
}

interface ValidatedRule {
  label: string;
  isValid: boolean;
}

export {
  PasswordStrength,
  PasswordStrengthProgress,
  PasswordStrengthInput,
  PasswordStrengthIndicator,
  PasswordStrengthRules,
  PasswordStrengthAnnounce,
  //
  PasswordStrength as Root,
  PasswordStrengthProgress as Progress,
  PasswordStrengthInput as Input,
  PasswordStrengthIndicator as Indicator,
  PasswordStrengthRules as Rules,
  PasswordStrengthAnnounce as Announce,
};
export type {
  PasswordStrengthProps,
  PasswordStrengthProgressProps,
  PasswordStrengthInputProps,
  PasswordStrengthAnnounceProps,
  PasswordStrengthRule,
};
