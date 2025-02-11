import * as React from 'react';
import * as PasswordStrength from '@radix-ui/react-password-strength';
import styles from './password-strength.stories.module.css';

export default {
  title: 'Components/PasswordStrength',
};

export const Styled = () => {
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
      <PasswordStrength.Root value={password} onValueChange={setPassword} rules={rules}>
        <PasswordStrength.Input placeholder="Password" className={styles.input} data-1p-ignore />
        <PasswordStrength.Progress className={styles.bars}>
          <PasswordStrength.Indicator className={styles.bar} />
          <PasswordStrength.Indicator className={styles.bar} />
          <PasswordStrength.Indicator className={styles.bar} />
          <PasswordStrength.Indicator className={styles.bar} />
        </PasswordStrength.Progress>

        <PasswordStrength.Rules>
          {({ rules }) => (
            <ul className={styles.rules}>
              {rules.map(({ label, isValid }) => (
                <li
                  className={styles.rule}
                  key={label}
                  style={{ color: isValid ? '#222' : undefined }}
                >
                  <CheckIcon style={{ color: isValid ? '#30a46c' : '#999' }} />
                  {label}
                </li>
              ))}
            </ul>
          )}
        </PasswordStrength.Rules>
      </PasswordStrength.Root>
    </div>
  );
};

export const Circle = () => {
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
      <PasswordStrength.Root value={password} onValueChange={setPassword} rules={rules}>
        <PasswordStrength.Input placeholder="Password" className={styles.input} data-1p-ignore />

        <PasswordStrength.Progress className={styles.circle} asChild>
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <PasswordStrength.Indicator className={styles.circleSegment} asChild>
              <path
                d="M63.9847 31C63.4666 14.1217 49.8783 0.533422 33 0.0153198V10.0223C44.3547 10.5303 53.4697 19.6453 53.9777 31H63.9847Z"
                fill="purple"
              />
            </PasswordStrength.Indicator>
            <PasswordStrength.Indicator className={styles.circleSegment} asChild>
              <path
                d="M53.9777 33C53.4697 44.3547 44.3547 53.4697 33 53.9777V63.9847C49.8783 63.4666 63.4666 49.8783 63.9847 33H53.9777Z"
                fill="green"
              />
            </PasswordStrength.Indicator>
            <PasswordStrength.Indicator className={styles.circleSegment} asChild>
              <path
                d="M0.0153198 33C0.533424 49.8783 14.1217 63.4666 31 63.9847V53.9777C19.6453 53.4697 10.5303 44.3547 10.0223 33H0.0153198Z"
                fill="red"
              />
            </PasswordStrength.Indicator>
            <PasswordStrength.Indicator className={styles.circleSegment} asChild>
              <path
                d="M0.0153198 31C0.53342 14.1217 14.1217 0.533422 31 0.0153198V10.0223C19.6453 10.5303 10.5303 19.6453 10.0223 31H0.0153198Z"
                fill="yellow"
              />
            </PasswordStrength.Indicator>
          </svg>
        </PasswordStrength.Progress>

        <PasswordStrength.Rules>
          {({ rules }) => (
            <ul className={styles.rules}>
              {rules.map(({ label, isValid }) => (
                <li
                  className={styles.rule}
                  key={label}
                  style={{ color: isValid ? '#222' : undefined }}
                >
                  <CheckIcon style={{ color: isValid ? '#30a46c' : '#999' }} />
                  {label}
                </li>
              ))}
            </ul>
          )}
        </PasswordStrength.Rules>
      </PasswordStrength.Root>
    </div>
  );
};

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
