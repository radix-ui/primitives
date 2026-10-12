import * as React from 'react';
import { axe } from 'vitest-axe';
import type { RenderResult } from '@testing-library/react';
import { act, cleanup, render, screen, fireEvent } from '@testing-library/react';
import * as OneTimePasswordField from './one-time-password-field';
import { afterEach, describe, it, beforeEach, expect, vi } from 'vitest';
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

  it('should type digits and advance focus', async () => {
    const inputs = screen.getAllByRole<HTMLInputElement>('textbox', { hidden: false });
    await user.click(inputs[0]!);
    await user.keyboard('1');
    expect(inputs[0]!.value).toBe('1');
    // focus should have moved to second input
    expect(document.activeElement).toBe(inputs[1]);
    await user.keyboard('2');
    expect(inputs[1]!.value).toBe('2');
    expect(document.activeElement).toBe(inputs[2]);
  });

  it('should navigate with arrow keys', async () => {
    const inputs = screen.getAllByRole<HTMLInputElement>('textbox', { hidden: false });
    await user.click(inputs[0]!);
    await user.keyboard('1');
    // now on input 1
    expect(document.activeElement).toBe(inputs[1]);
    await user.keyboard('{ArrowLeft}');
    expect(document.activeElement).toBe(inputs[0]);
    await user.keyboard('{ArrowRight}');
    expect(document.activeElement).toBe(inputs[1]);
  });

  it('pastes the code into the input', async () => {
    const inputs = screen.getAllByRole<HTMLInputElement>('textbox', {
      hidden: false,
    });
    const firstInput = inputs[0]!;
    await user.click(firstInput);
    await act(async () => await user.paste('1,2,3,4,5,6'));
    expect(getInputValues(inputs)).toBe('1,2,3,4,5,6');
  });

  it('should truncate pasted characters to the number of inputs', async () => {
    const inputs = screen.getAllByRole<HTMLInputElement>('textbox', {
      hidden: false,
    });
    const firstInput = inputs[0]!;
    await user.click(firstInput);
    await act(async () => await user.paste('123456789'));
    expect(getInputValues(inputs)).toBe('1,2,3,4,5,6');
  });
});

function getInputValues(inputs: HTMLInputElement[]) {
  return inputs.map((input) => input.value).join(',');
}

describe('OneTimePasswordField.Root', () => {
  afterEach(cleanup);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <OneTimePasswordField.Root
        ref={ref}
        data-testid="root"
        className="custom-class"
        style={{ outlineColor: 'rgb(1, 2, 3)' }}
        onClick={onClick}
      >
        <OneTimePasswordField.Input />
      </OneTimePasswordField.Root>,
    );

    const root = screen.getByTestId('root');
    expect(root.tagName).toBe('DIV');
    expect(root).toHaveClass('custom-class');
    expect(root.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(root);

    fireEvent.click(root);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <OneTimePasswordField.Root
        asChild
        ref={ref}
        data-testid="root"
        className="custom-class"
        style={{ outlineColor: 'rgb(1, 2, 3)' }}
        onClick={onClick}
      >
        <article>
          <OneTimePasswordField.Input />
        </article>
      </OneTimePasswordField.Root>,
    );

    const root = screen.getByTestId('root');
    expect(root.tagName).toBe('ARTICLE');
    // The root's own `role` has to land on the slotted element too.
    expect(root).toHaveAttribute('role', 'group');
    expect(root).toHaveClass('custom-class');
    expect(root.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(root);

    fireEvent.click(root);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('OneTimePasswordField.Input', () => {
  afterEach(cleanup);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLInputElement>();
    const onClick = vi.fn();

    render(
      <OneTimePasswordField.Root defaultValue="1">
        <OneTimePasswordField.Input
          ref={ref}
          data-testid="input"
          className="custom-class"
          style={{ outlineColor: 'rgb(1, 2, 3)' }}
          onClick={onClick}
        />
      </OneTimePasswordField.Root>,
    );

    const input = screen.getByTestId('input');
    expect(input.tagName).toBe('INPUT');
    expect(input).toHaveClass('custom-class');
    expect(input.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(input);

    fireEvent.click(input);
    expect(onClick).toHaveBeenCalled();
  });

  // The part renders an `input`, so the slotted element is an `input` with no
  // children.
  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<HTMLInputElement>();
    const onClick = vi.fn();

    render(
      <OneTimePasswordField.Root defaultValue="1">
        <OneTimePasswordField.Input
          asChild
          ref={ref}
          data-testid="input"
          className="custom-class"
          style={{ outlineColor: 'rgb(1, 2, 3)' }}
          onClick={onClick}
        >
          <input />
        </OneTimePasswordField.Input>
      </OneTimePasswordField.Root>,
    );

    const input = screen.getByTestId('input');
    expect(input.tagName).toBe('INPUT');
    // The attributes the part sets itself have to reach the slotted element, including the ones the
    // roving focus group and the collection contribute.
    expect(input).toHaveAttribute('data-radix-otp-input');
    expect(input).toHaveAttribute('data-radix-index', '0');
    expect(input).toHaveClass('custom-class');
    expect(input.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(input);

    fireEvent.click(input);
    expect(onClick).toHaveBeenCalled();
  });
});

// `HiddenInput` renders a plain `input`, not a `Primitive`, so it has no
// `asChild` prop and there is no slotted variant to test. It is also always
// `type="hidden"`, which a real browser never dispatches a click to, so the
// click assertion is left out rather than faked.
describe('OneTimePasswordField.HiddenInput', () => {
  afterEach(cleanup);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLInputElement>();

    render(
      <OneTimePasswordField.Root defaultValue="1" name="code">
        <OneTimePasswordField.Input />
        <OneTimePasswordField.HiddenInput
          ref={ref}
          data-testid="hidden-input"
          className="custom-class"
          style={{ outlineColor: 'rgb(1, 2, 3)' }}
        />
      </OneTimePasswordField.Root>,
    );

    const hiddenInput = screen.getByTestId('hidden-input');
    expect(hiddenInput.tagName).toBe('INPUT');
    expect(hiddenInput).toHaveAttribute('type', 'hidden');
    expect(hiddenInput).toHaveAttribute('name', 'code');
    expect(hiddenInput).toHaveClass('custom-class');
    expect(hiddenInput.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(hiddenInput);
  });
});
