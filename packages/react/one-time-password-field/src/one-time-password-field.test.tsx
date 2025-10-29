import { axe } from 'vitest-axe';
import type { RenderResult } from '@testing-library/react';
import { act, cleanup, render, screen, fireEvent, waitFor } from '@testing-library/react';
import * as OneTimePasswordField from './one-time-password-field';
import { afterEach, describe, it, beforeEach, expect } from 'vitest';
import { userEvent, type UserEvent } from '@testing-library/user-event';

describe('given a default OneTimePasswordField', () => {
  let rendered: RenderResult;
  let user: UserEvent;

  afterEach(cleanup);

  beforeEach(() => {
    user = userEvent.setup();
    rendered = render(
      <OneTimePasswordField.Root>
        <OneTimePasswordField.Input />
        <OneTimePasswordField.Input />
        <OneTimePasswordField.Input />
        <OneTimePasswordField.Input />
        <OneTimePasswordField.Input />
        <OneTimePasswordField.Input />
        <OneTimePasswordField.HiddenInput name="code" />
      </OneTimePasswordField.Root>,
    );
  });

  afterEach(cleanup);

  it('should have no accessibility violations', async () => {
    expect(await axe(rendered.container)).toHaveNoViolations();
  });

  it('should mask input value when type is password', async () => {
    rendered.rerender(
      <OneTimePasswordField.Root type="password">
        <OneTimePasswordField.Input />
        <OneTimePasswordField.HiddenInput name="code" />
      </OneTimePasswordField.Root>,
    );

    const input = rendered.container.querySelector(
      'input:not([type="hidden"])',
    ) as HTMLInputElement;

    await userEvent.type(input, '1');
    expect(input.type).toBe('password');

    const hiddenInput = rendered.container.querySelector(
      'input[type="hidden"]',
    ) as HTMLInputElement;
    expect(hiddenInput.value).toBe('1');
  });

  it('should disable all inputs when Root is disabled', () => {
    rendered.rerender(
      <OneTimePasswordField.Root disabled>
        <OneTimePasswordField.Input />
        <OneTimePasswordField.Input />
        <OneTimePasswordField.HiddenInput name="code" />
      </OneTimePasswordField.Root>,
    );

    const inputs = rendered.container.querySelectorAll('input:not([type="hidden"])');
    inputs.forEach((input) => {
      expect(input).toBeDisabled();
    });
  });

  // TODO: userEvent paste not behaving as expected. Debug and unskip.
  // Replicated in storybook for now.
  it.todo('pastes the code into the input', async () => {
    const inputs = screen.getAllByRole<HTMLInputElement>('textbox', {
      hidden: false,
    });
    const firstInput = inputs[0]!;
    fireEvent.click(firstInput);
    await act(async () => await user.paste('1,2,3,4,5,6'));
    expect(getInputValues(inputs)).toBe('1,2,3,4,5,6');
  });
});

describe('given a controlled value to OneTimePasswordField', () => {
  afterEach(cleanup);

  it('focuses the input at clamp(value.length, 0, lastIndex) as value grows', async () => {
    const Test = ({ value }: { value: string }) => (
      <OneTimePasswordField.Root value={value} onValueChange={() => {}} autoFocus>
        <OneTimePasswordField.Input />
        <OneTimePasswordField.Input />
        <OneTimePasswordField.Input />
        <OneTimePasswordField.Input />
        <OneTimePasswordField.Input />
        <OneTimePasswordField.Input />
        <OneTimePasswordField.HiddenInput />
      </OneTimePasswordField.Root>
    );

    const { rerender } = render(<Test value="" />);
    const inputs = screen.getAllByRole<HTMLInputElement>('textbox', { hidden: false });

    rerender(<Test value="0" />);
    await waitFor(() => {
      expect(inputs[1]).toHaveFocus();
    });

    rerender(<Test value="012" />);
    await waitFor(() => {
      expect(inputs[3]).toHaveFocus();
    });
  });

  it('clamps focus to the last input when value length exceeds inputs', async () => {
    const Test = ({ value }: { value: string }) => (
      <OneTimePasswordField.Root value={value} onValueChange={() => {}} autoFocus>
        <OneTimePasswordField.Input />
        <OneTimePasswordField.Input />
        <OneTimePasswordField.Input />
        <OneTimePasswordField.Input />
        <OneTimePasswordField.Input />
        <OneTimePasswordField.Input />
        <OneTimePasswordField.HiddenInput />
      </OneTimePasswordField.Root>
    );

    const { rerender } = render(<Test value="" />);
    const inputs = screen.getAllByRole<HTMLInputElement>('textbox', { hidden: false });
    const lastIndex = inputs.length - 1;

    rerender(<Test value="0123456" />);
    await waitFor(() => {
      expect(inputs[lastIndex]).toHaveFocus();
    });
  });
});

function getInputValues(inputs: HTMLInputElement[]) {
  return inputs.map((input) => input.value).join(',');
}
