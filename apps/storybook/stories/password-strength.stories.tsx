import * as React from 'react';
import { unstable_PasswordStrength as PasswordStrength } from 'radix-ui';
import type { Meta, StoryObj } from '@storybook/react';
import styles from './password-strength.stories.module.css';

export default {
  title: 'Components/PasswordStrength',
  component: PasswordStrength.Root,
} satisfies Meta<typeof PasswordStrength.Root>;

type Story = StoryObj<typeof PasswordStrength.Root>;

export const Uncontrolled = {
  argTypes: {
    value: { table: { disable: true } },
    defaultValue: { table: { disable: true } },
    children: { table: { disable: true } },
    rules: { table: { disable: true } },
    // @ts-expect-error
    __scopePasswordStrength: { table: { disable: true } },
  },
  render: function Default(args) {
    const rules: PasswordStrength.PasswordStrengthRule[] = [
      {
        label: 'At least 8 characters long.',
        validate: (password) => password.length >= 8,
      },
      {
        label: 'At least one uppercase letter.',
        validate: (password) => /[A-Z]/.test(password),
      },
      {
        label: 'At least one number.',
        validate: (password) => /[0-9]/.test(password),
      },
      {
        label: 'At least one special character.',
        validate: (password) => /[^A-Za-z0-9]/.test(password),
      },
    ];
    return (
      <div className={styles.viewport}>
        <PasswordStrength.Root {...args} rules={rules}>
          <PasswordStrength.Input placeholder="Password" className={styles.input} data-1p-ignore />
          <PasswordStrength.Progress className={styles.bars}>
            <PasswordStrength.Indicator className={styles.bar} />
            <PasswordStrength.Indicator className={styles.bar} />
            <PasswordStrength.Indicator className={styles.bar} />
            <PasswordStrength.Indicator className={styles.bar} />
          </PasswordStrength.Progress>

          <PasswordStrength.Rules
            render={({ rules }) => (
              <RulesList>
                {rules.map(({ label, isValid }) => (
                  <RulesItem key={label} isValid={isValid}>
                    {label}
                  </RulesItem>
                ))}
              </RulesList>
            )}
          />
        </PasswordStrength.Root>
      </div>
    );
  },
} satisfies Story;

export const Circle = {
  argTypes: {
    value: { table: { disable: true } },
    defaultValue: { table: { disable: true } },
    children: { table: { disable: true } },
    rules: { table: { disable: true } },
    // @ts-expect-error
    __scopePasswordStrength: { table: { disable: true } },
  },
  render: function Circle(args) {
    // TODO: get state from useArgs
    const [password, setPassword] = React.useState('');
    const rules: PasswordStrength.PasswordStrengthRule[] = [
      {
        label: 'At least 8 characters long.',
        validate: (password) => password.length >= 8,
      },
      {
        label: 'At least one uppercase letter.',
        validate: (password) => /[A-Z]/.test(password),
      },
      {
        label: 'At least one number.',
        validate: (password) => /[0-9]/.test(password),
      },
      {
        label: 'At least one special character.',
        validate: (password) => /[^A-Za-z0-9]/.test(password),
      },
    ];
    return (
      <div className={styles.viewport}>
        <PasswordStrength.Root {...args} value={password} onValueChange={setPassword} rules={rules}>
          <PasswordStrength.Input placeholder="Password" className={styles.input} data-1p-ignore />

          <PasswordStrength.Progress className={styles.circle} asChild>
            <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <PasswordStrength.Indicator className={styles.circleSegment} asChild>
                <path d="M63.9847 31C63.4666 14.1217 49.8783 0.533422 33 0.0153198V10.0223C44.3547 10.5303 53.4697 19.6453 53.9777 31H63.9847Z" />
              </PasswordStrength.Indicator>
              <PasswordStrength.Indicator className={styles.circleSegment} asChild>
                <path d="M53.9777 33C53.4697 44.3547 44.3547 53.4697 33 53.9777V63.9847C49.8783 63.4666 63.4666 49.8783 63.9847 33H53.9777Z" />
              </PasswordStrength.Indicator>
              <PasswordStrength.Indicator className={styles.circleSegment} asChild>
                <path d="M0.0153198 33C0.533424 49.8783 14.1217 63.4666 31 63.9847V53.9777C19.6453 53.4697 10.5303 44.3547 10.0223 33H0.0153198Z" />
              </PasswordStrength.Indicator>
              <PasswordStrength.Indicator className={styles.circleSegment} asChild>
                <path d="M0.0153198 31C0.53342 14.1217 14.1217 0.533422 31 0.0153198V10.0223C19.6453 10.5303 10.5303 19.6453 10.0223 31H0.0153198Z" />
              </PasswordStrength.Indicator>
            </svg>
          </PasswordStrength.Progress>

          <PasswordStrength.Rules
            render={({ rules }) => (
              <RulesList>
                {rules.map(({ label, isValid }) => (
                  <RulesItem key={label} isValid={isValid}>
                    {label}
                  </RulesItem>
                ))}
              </RulesList>
            )}
          />
        </PasswordStrength.Root>
      </div>
    );
  },
} satisfies Story;

export const WithoutIndicators = {
  argTypes: {
    value: { table: { disable: true } },
    defaultValue: { table: { disable: true } },
    children: { table: { disable: true } },
    rules: { table: { disable: true } },
    // @ts-expect-error
    __scopePasswordStrength: { table: { disable: true } },
  },
  render: function WithoutIndicators(args) {
    const [password, setPassword] = React.useState('');
    const rules: PasswordStrength.PasswordStrengthRule[] = [
      {
        label: 'At least 8 characters long.',
        validate: (password) => password.length >= 8,
      },
      {
        label: 'At least one uppercase letter.',
        validate: (password) => /[A-Z]/.test(password),
      },
      {
        label: 'At least one number.',
        validate: (password) => /[0-9]/.test(password),
      },
      {
        label: 'At least one special character.',
        validate: (password) => /[^A-Za-z0-9]/.test(password),
      },
      {
        label: 'Must contain the word "Radix"',
        validate: (password) => password.includes('Radix'),
      },
    ];
    return (
      <div className={styles.viewport}>
        <PasswordStrength.Root {...args} value={password} onValueChange={setPassword} rules={rules}>
          <PasswordStrength.Input placeholder="Password" className={styles.input} data-1p-ignore />

          <PasswordStrength.Progress className={styles.progressBar} />

          <PasswordStrength.Rules
            render={({ rules }) => (
              <RulesList>
                {rules.map(({ label, isValid }) => (
                  <RulesItem key={label} isValid={isValid}>
                    {label}
                  </RulesItem>
                ))}
              </RulesList>
            )}
          />
        </PasswordStrength.Root>
      </div>
    );
  },
} satisfies Story;

function RulesList({ children }: { children: React.ReactNode }) {
  return <ul className={styles.rules}>{children}</ul>;
}

function RulesItem({ children, isValid }: { isValid: boolean; children: React.ReactNode }) {
  return (
    <li className={styles.rule} style={{ color: isValid ? '#222' : undefined }}>
      <CheckIcon style={{ color: isValid ? '#30a46c' : '#999' }} />
      {children}
    </li>
  );
}

function CheckIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      height="12"
      width="12"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
      className={className}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
