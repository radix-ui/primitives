import * as React from 'react';
import * as OneTimePasswordField from '@radix-ui/react-one-time-password-field';
import styles from './one-time-password-field.stories.module.css';

export default {
  title: 'Components/OneTimePasswordField',
};

export const Styled = () => {
  const [error, setError] = React.useState<string | null>(null);
  const [code, setCode] = React.useState('');
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const VALID_CODE = '123456';
  const isInvalid = code.length === VALID_CODE.length ? code !== VALID_CODE : false;
  const isValid = code.length === VALID_CODE.length ? code === VALID_CODE : false;
  return (
    <div className={styles.viewport}>
      <form
        className={styles.form}
        onChange={() => setError(null)}
        onSubmit={(event) => {
          event.preventDefault();

          const inputs = Array.from(rootRef.current!.querySelectorAll('input')).filter(
            (input) => input.type !== 'hidden'
          );

          console.log(Math.random());

          if (isInvalid) {
            setError('Invalid code');
            const lastInput = inputs.at(-1);
            lastInput?.focus();
          } else if (code.length !== VALID_CODE.length) {
            setError('Please fill in all fields');
            // focus last filled input
            const lastInput = inputs.find((input) => input.value);
            lastInput?.focus();
          } else if (Math.random() > 0.675) {
            setError('Server error');
            const lastInput = inputs.at(-1);
            lastInput?.focus();
          } else {
            window.alert('Success!');
          }
        }}
      >
        <div className={styles.field}>
          <OneTimePasswordField.Root
            autoSubmit
            state={error || isInvalid ? 'invalid' : isValid ? 'valid' : undefined}
            className={styles.otpRoot}
            autoFocus
            ref={rootRef}
            onValueChange={(value) => setCode(value)}
            value={code}
          >
            <OneTimePasswordField.Input />
            <OneTimePasswordField.Input />
            <OneTimePasswordField.Input />
            <OneTimePasswordField.Input />
            <OneTimePasswordField.Input />
            <OneTimePasswordField.Input />

            <OneTimePasswordField.HiddenInput />
          </OneTimePasswordField.Root>
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </div>
        <button>Submit</button>
      </form>
    </div>
  );
};

function ErrorMessage({ children }: { children: string }) {
  return <div className={styles.errorMessage}>{children}</div>;
}
