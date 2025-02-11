import * as React from 'react';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { Primitive } from '@radix-ui/react-primitive';
import { useIsHydrated } from '@radix-ui/react-use-is-hydrated';
import { composeEventHandlers } from '@radix-ui/primitive';

// This reference is for constructing an in-memory input element whose only
// function is to reference the validity property for iterating through all
// validity keys. We're breaking some rules here, so only set this once
// and only when React is hydrated on the client.
const INPUT_CACHE = new WeakMap<typeof PasswordStrength, HTMLInputElement | null>();

interface PasswordStrengthContextValue {
  rules: ValidatedRule[];
  progress: number;
  validatedRuleCount: number;
  value: string | undefined;
  setValue: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const PasswordStrengthContext = React.createContext<PasswordStrengthContextValue | null>(null);
PasswordStrengthContext.displayName = 'PasswordStrengthContext';

function usePasswordStrengthContext() {
  const context = React.useContext(PasswordStrengthContext);
  if (!context) {
    throw Error('usePasswordStrengthContext must be called in PasswordStrength.Root');
  }
  return context;
}

interface PasswordStrengthProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  rules: PasswordStrengthRule[];
}

const PasswordStrength: React.FC<PasswordStrengthProps> = function PasswordStrength({
  value: valueProp,
  defaultValue,
  onValueChange,
  children,
  rules,
}) {
  const [value, setValue] = useControllableState({
    prop: valueProp,
    defaultProp: defaultValue,
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
    <PasswordStrengthContext.Provider
      value={{
        progress,
        rules: validatedRules,
        value,
        validatedRuleCount,
        setValue,
      }}
    >
      {children}
    </PasswordStrengthContext.Provider>
  );
};

interface PasswordStrengthProgressOwnProps {
  children?: ((args: { rules: Array<ValidatedRule> }) => React.ReactNode) | React.ReactNode;
  'aria-valuetext'?:
    | string
    | ((props: { rules: ValidatedRule[]; total: number; validated: number }) => string);
}

interface PasswordStrengthProgressProps
  extends Omit<
      React.ComponentPropsWithoutRef<typeof Primitive.div>,
      keyof PasswordStrengthProgressOwnProps
    >,
    PasswordStrengthProgressOwnProps {}

const PasswordStrengthProgress = React.forwardRef<HTMLDivElement, PasswordStrengthProgressProps>(
  function PasswordStrengthProgress(
    { children, 'aria-valuetext': ariaValueTextProp, ...props },
    forwardedRef
  ) {
    const { rules, progress, validatedRuleCount } = usePasswordStrengthContext();
    const totalRuleCount = rules.length;

    let ariaValueText: string | undefined;
    if (ariaValueTextProp) {
      ariaValueText =
        typeof ariaValueTextProp === 'function'
          ? ariaValueTextProp({
              rules,
              total: totalRuleCount,
              validated: validatedRuleCount,
            })
          : ariaValueTextProp;
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
        {typeof children === 'function' ? children({ rules }) : children}
      </Primitive.div>
    );
  }
);

interface PasswordStrengthInputProps
  extends Omit<React.ComponentPropsWithoutRef<typeof Primitive.input>, 'value' | 'type'> {
  type?: 'password' | 'text';
}

const PasswordStrengthInput = React.forwardRef<HTMLInputElement, PasswordStrengthInputProps>(
  function PasswordStrengthInput(
    {
      onChange,
      // TODO: warn if value is passed
      // @ts-expect-error
      value: _value,
      type = 'password',
      ...props
    },
    forwardedRef
  ) {
    const { progress, value = '', setValue } = usePasswordStrengthContext();
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

interface PasswordStrengthIndicatorProps
  extends React.ComponentPropsWithoutRef<typeof Primitive.div> {
  index: number;
}

const PasswordStrengthIndicator = React.forwardRef<HTMLDivElement, PasswordStrengthIndicatorProps>(
  function PasswordStrengthIndicator({ style, index, ...props }, forwardedRef) {
    const { progress, rules } = usePasswordStrengthContext();
    const ownScore = calculateElementProgress(progress, index, rules.length);
    return (
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
        ref={forwardedRef}
        {...props}
      />
    );
  }
);

interface PasswordStrengthRulesProps {
  children: (props: { rules: Array<ValidatedRule> }) => React.ReactNode;
}

const PasswordStrengthRules: React.FC<PasswordStrengthRulesProps> = function PasswordStrengthRules({
  children,
}) {
  const { rules } = usePasswordStrengthContext();
  return children({ rules }) as React.ReactElement;
};

interface PasswordStrengthAnnounceProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'children'> {
  message?: (props: { isValid: boolean }) => string;
}

// TODO: Not sure if we need this, test with different
// ATs to see if aria-invalid + error state is sufficient.
const PasswordStrengthAnnounce = React.forwardRef<HTMLDivElement, PasswordStrengthAnnounceProps>(
  function PasswordStrengthAnnounce(
    {
      style,
      message,
      // @ts-expect-error
      children,
      ...props
    },
    forwardedRef
  ) {
    const { rules, progress } = usePasswordStrengthContext();
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

function calculateElementProgress(progress: number, index: number, ruleCount: number): number {
  if (ruleCount <= 1) {
    return progress;
  }
  const elementProgress = progress * ruleCount - index;
  console.log(elementProgress);
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

const Root = PasswordStrength;
const Progress = PasswordStrengthProgress;
const Input = PasswordStrengthInput;
const Indicator = PasswordStrengthIndicator;
const Rules = PasswordStrengthRules;
const Announce = PasswordStrengthAnnounce;

export {
  PasswordStrength,
  PasswordStrengthProgress,
  PasswordStrengthInput,
  PasswordStrengthIndicator,
  PasswordStrengthRules,
  PasswordStrengthAnnounce,
  //
  Root,
  Progress,
  Input,
  Indicator,
  Rules,
  Announce,
};
export type {
  PasswordStrengthProps,
  PasswordStrengthProgressProps,
  PasswordStrengthInputProps,
  PasswordStrengthAnnounceProps,
  PasswordStrengthRule,
};
