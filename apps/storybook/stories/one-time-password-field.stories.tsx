import * as React from 'react';
import { unstable_OneTimePasswordField as OneTimePasswordField, Separator } from 'radix-ui';
import { Dialog as DialogPrimitive } from 'radix-ui';
import dialogStyles from './dialog.stories.module.css';
import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within, expect } from '@storybook/test';
import styles from './one-time-password-field.stories.module.css';

export default {
  title: 'Components/OneTimePasswordField',
  component: OneTimePasswordField.Root,
} satisfies Meta<typeof OneTimePasswordField.Root>;

type Story = StoryObj<typeof OneTimePasswordField.Root>;

type FormState = { type: 'idle' } | { type: 'valid' } | { type: 'invalid'; error: string };

const VALID_CODE = '123456';

const sharedStoryProps = {
  argTypes: {
    placeholder: {
      control: { type: 'text' },
    },
    validationType: {
      options: ['numeric', 'alphanumeric', 'alpha', 'none'],
      control: { type: 'select' },
    },
    autoSubmit: {
      control: { type: 'boolean' },
    },
  },
} satisfies Story;

export const Uncontrolled = {
  ...sharedStoryProps,
  render: (args) => <UncontrolledImpl {...args} />,
} satisfies Story;

function UncontrolledImpl(props: OneTimePasswordField.OneTimePasswordFieldProps) {
  const [showSuccessMessage, setShowSuccessMessage] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const [formState, setFormState] = React.useState<FormState>({ type: 'idle' });

  return (
    <div className={styles.viewport}>
      <form
        className={styles.form}
        onSubmit={(event) => {
          const formData = new FormData(event.currentTarget);
          const code = formData.get('code') as string;
          event.preventDefault();
          if (code.length === VALID_CODE.length && code !== VALID_CODE) {
            setFormState({ type: 'invalid', error: 'Invalid code' });
          }
          //
          else if (code.length !== VALID_CODE.length) {
            setFormState({ type: 'invalid', error: 'Please fill in all fields' });
          }
          //
          else if (Math.random() > 0.675) {
            setFormState({ type: 'invalid', error: 'Server error' });
          }
          //
          else {
            setFormState({ type: 'valid' });
            setShowSuccessMessage(true);
          }
        }}
      >
        <div className={styles.field}>
          <OneTimePasswordField.Root
            data-state={formState.type}
            className={styles.otpRoot}
            autoFocus
            ref={rootRef}
            {...props}
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
          {formState.type === 'invalid' && <ErrorMessage>{formState.error}</ErrorMessage>}
        </div>
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
}

export const Controlled = {
  ...sharedStoryProps,
  render: (args) => <ControlledImpl {...args} />,
} satisfies Story;

function ControlledImpl(props: OneTimePasswordField.OneTimePasswordFieldProps) {
  const [error, setError] = React.useState<string | null>(null);
  const [code, setCode] = React.useState('');
  const [showSuccessMessage, setShowSuccessMessage] = React.useState(false);
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
        <div className={styles.field}>
          <OneTimePasswordField.Root
            data-state={error || isInvalid ? 'invalid' : isValid ? 'valid' : undefined}
            className={styles.otpRoot}
            autoFocus
            ref={rootRef}
            onValueChange={(value) => setCode(value)}
            value={code}
            {...props}
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
        <output
          data-state={error || isInvalid ? 'invalid' : isValid ? 'valid' : undefined}
          className={styles.output}
        >
          {code || 'code'}
        </output>
      </form>
      <Dialog
        open={showSuccessMessage}
        onOpenChange={setShowSuccessMessage}
        title="Password match"
        content="Success!"
      />
    </div>
  );
}

export const PastedAndDeletedControlled: Story = {
  render: (args) => <ControlledImpl {...args} />,
  name: 'Pasted and deleted (controlled test)',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const inputs = canvas.getAllByRole<HTMLInputElement>('textbox', {
      hidden: false,
    });

    const firstInput = inputs[0]!;
    expect(firstInput).toBeInTheDocument();
    await userEvent.click(firstInput);
    await userEvent.paste('123123');
    expect(getInputValues(inputs)).toBe('1,2,3,1,2,3');
    await userEvent.keyboard('{backspace}{backspace}{backspace}{backspace}{backspace}');
    expect(getInputValues(inputs)).toBe('1,,,,,');
    await userEvent.keyboard('{backspace}');
    expect(getInputValues(inputs)).toBe(',,,,,');
  },
};

export const PastedAndDeletedUncontrolled: Story = {
  render: (args) => <UncontrolledImpl {...args} />,
  name: 'Pasted and deleted (uncontrolled test)',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const inputs = canvas.getAllByRole<HTMLInputElement>('textbox', {
      hidden: false,
    });

    const firstInput = inputs[0]!;
    expect(firstInput).toBeInTheDocument();
    await userEvent.click(firstInput);
    await userEvent.paste('123123');
    expect(getInputValues(inputs)).toBe('1,2,3,1,2,3');
    await userEvent.keyboard('{backspace}{backspace}{backspace}{backspace}{backspace}');
    expect(getInputValues(inputs)).toBe('1,,,,,');
    await userEvent.keyboard('{backspace}');
    // With the current bug, the actual behavior is 1,2,3,1,2,3
    expect(getInputValues(inputs)).toBe(',,,,,');

    // if we keep deleting while the first input is focused, we eventually get ,2,3,1,2,3
  },
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

function getInputValues(inputs: HTMLInputElement[]) {
  return inputs.map((input) => input.value).join(',');
}
