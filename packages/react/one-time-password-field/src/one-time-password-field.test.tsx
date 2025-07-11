import { axe } from 'vitest-axe';
import type { RenderResult } from '@testing-library/react';
import { act, cleanup, render, screen, fireEvent } from '@testing-library/react';
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
      </OneTimePasswordField.Root>
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
      </OneTimePasswordField.Root>
    );

    const input = rendered.container.querySelector(
      'input:not([type="hidden"])'
    ) as HTMLInputElement;

    await userEvent.type(input, '1');
    expect(input.type).toBe('password');

    const hiddenInput = rendered.container.querySelector(
      'input[type="hidden"]'
    ) as HTMLInputElement;
    expect(hiddenInput.value).toBe('1');
  });

  it('should disable all inputs when Root is disabled', () => {
    rendered.rerender(
      <OneTimePasswordField.Root disabled>
        <OneTimePasswordField.Input />
        <OneTimePasswordField.Input />
        <OneTimePasswordField.HiddenInput name="code" />
      </OneTimePasswordField.Root>
    );

    const inputs = rendered.container.querySelectorAll('input:not([type="hidden"])');
    inputs.forEach(input => {
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

function getInputValues(inputs: HTMLInputElement[]) {
  return inputs.map((input) => input.value).join(',');
}
