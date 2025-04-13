import * as React from 'react';
import { OneTimePasswordField, Separator } from 'radix-ui';
import { Dialog as DialogPrimitive } from 'radix-ui';
import dialogStyles from './dialog.stories.module.css';
import styles from './one-time-password-field.stories.module.css';

export default {
  title: 'Components/OneTimePasswordField',
};

export const Controlled = () => {
  const [error, setError] = React.useState<string | null>(null);
  const [code, setCode] = React.useState('');
  const [showSuccessMessage, setShowSuccessMessage] = React.useState(false);
  const [validationType, setValidationType] =
    React.useState<OneTimePasswordField.InputValidationType>('numeric');

  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const VALID_CODE = '123456';
  const isInvalid = code.length === VALID_CODE.length ? code !== VALID_CODE : false;
  const isValid = code.length === VALID_CODE.length ? code === VALID_CODE : false;
  return (
    <div className={styles.viewport}>
      <form
        className={styles.form}
        onSubmit={(event) => {
          event.preventDefault();
          if (isInvalid) {
            setError('Invalid code');
          }
          //
          else if (code.length !== VALID_CODE.length) {
            setError('Please fill in all fields');
          }
          //
          else if (Math.random() > 0.675) {
            setError('Server error');
          }
          //
          else {
            setShowSuccessMessage(true);
          }
        }}
      >
        <label className={styles.selectField}>
          <span>Validation type</span>
          <select
            value={validationType}
            onChange={(e) =>
              setValidationType(e.target.value as OneTimePasswordField.InputValidationType)
            }
          >
            <option value="numeric">Numeric</option>
            <option value="alphanumeric">Alphanumeric</option>
            <option value="alpha">Alpha</option>
            <option value="none">None</option>
          </select>
        </label>
        <div className={styles.field}>
          <OneTimePasswordField.Root
            autoSubmit
            state={error || isInvalid ? 'invalid' : isValid ? 'valid' : undefined}
            className={styles.otpRoot}
            autoFocus
            ref={rootRef}
            validationType={validationType}
            onValueChange={(value) => setCode(value)}
            value={code}
          >
            <OneTimePasswordField.Input />
            <Separator.Root orientation="vertical" className={styles.separator} />
            <OneTimePasswordField.Input />
            <Separator.Root orientation="vertical" className={styles.separator} />
            <OneTimePasswordField.Input />
            <Separator.Root orientation="vertical" className={styles.separator} />
            <OneTimePasswordField.Input />
            <Separator.Root orientation="vertical" className={styles.separator} />
            <OneTimePasswordField.Input />
            <Separator.Root orientation="vertical" className={styles.separator} />
            <OneTimePasswordField.Input />

            <OneTimePasswordField.HiddenInput name="code" />
          </OneTimePasswordField.Root>
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </div>
        <button type="button" onClick={() => setCode('')}>
          Reset state
        </button>
        <button type="reset">Reset form</button>
        <button>Submit</button>
      </form>
      <Dialog
        open={showSuccessMessage}
        onOpenChange={setShowSuccessMessage}
        title="Password match"
        content="Success!"
      />
    </div>
  );
};

function ErrorMessage({ children }: { children: string }) {
  return <div className={styles.errorMessage}>{children}</div>;
}

function Dialog({
  trigger,
  title = 'Hello!',
  content,
  open,
  onOpenChange,
}: {
  title?: string;
  content: string;
  trigger?: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const lastFocusedRef = React.useRef<HTMLElement | null>(null);
  React.useLayoutEffect(() => {
    lastFocusedRef.current = document.activeElement as HTMLElement;
  }, []);
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      {trigger}
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className={dialogStyles.overlay} />
        <DialogPrimitive.Content className={dialogStyles.contentDefault}>
          <DialogPrimitive.Title>{title}</DialogPrimitive.Title>
          <DialogPrimitive.Description>{content}</DialogPrimitive.Description>
          <DialogPrimitive.Close className={dialogStyles.close}>close</DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
