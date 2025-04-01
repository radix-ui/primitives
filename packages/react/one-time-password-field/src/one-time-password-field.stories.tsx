import * as React from 'react';
import * as OneTimePasswordField from '@radix-ui/react-one-time-password-field';
import * as Separator from '@radix-ui/react-separator';
import styles from './one-time-password-field.stories.module.css';
import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within, expect } from '@storybook/test';

export default {
  title: 'Components/OneTimePasswordField',
  component: OneTimePasswordField.Root,
} satisfies Meta<typeof OneTimePasswordField.Root>;

type Story = StoryObj<typeof OneTimePasswordField.Root>;

const Styled = () => {
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
            length={6}
          >
            {({ inputs }) => (
              <React.Fragment>
                {inputs.map((input, index) => {
                  const isLastInput = index === inputs.length - 1;
                  if (isLastInput) {
                    return <OneTimePasswordField.Input key={input.index} index={input.index} />;
                  } else {
                    return (
                      <React.Fragment key={input.index}>
                        <OneTimePasswordField.Input key={input.index} index={input.index} />
                        <Separator.Root orientation="vertical" className={styles.separator} />
                      </React.Fragment>
                    );
                  }
                })}
                <OneTimePasswordField.HiddenInput />
              </React.Fragment>
            )}
          </OneTimePasswordField.Root>
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </div>
        <button>Submit</button>
      </form>
    </div>
  );
};

function getInputValues(inputs: HTMLInputElement[]) {
  return inputs.map((input) => input.value).join(',');
}

export const Controlled: Story = {
  render: () => <Styled />,
};

export const FilledThenDeleted: Story = {
  render: () => <Styled />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const inputs = canvas.getAllByRole<HTMLInputElement>('textbox', {
      hidden: false,
    });

    const firstInput = inputs[0];
    expect(firstInput).toBeInTheDocument();
    await userEvent.click(firstInput);
    await userEvent.keyboard('123123');
    expect(getInputValues(inputs)).toBe('1,2,3,1,2,3');
    await userEvent.keyboard('{backspace}{backspace}{backspace}{backspace}{backspace}');
    // what's weird is when typing manually, I get 3,,,,,
    expect(getInputValues(inputs)).toBe('1,,,,,');
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    await userEvent.keyboard('{backspace}');
    expect(getInputValues(inputs)).toBe(',,,,,');
  },
};

export const PastedAndDeleted: Story = {
  render: () => <Styled />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const inputs = canvas.getAllByRole<HTMLInputElement>('textbox', {
      hidden: false,
    });

    const firstInput = inputs[0];
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
