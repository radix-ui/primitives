import { axe } from 'vitest-axe';
import type { RenderResult } from '@testing-library/react';
import { cleanup, render, screen } from '@testing-library/react';
import * as OneTimePasswordField from './one-time-password-field';
import { afterEach, describe, it, beforeEach, expect } from 'vitest';

const WIDTH = 40;
const HEIGHT = 30;

describe('given a default OneTimePasswordField', () => {
  let root: HTMLElement;
  let rendered: RenderResult;

  afterEach(cleanup);

  beforeEach(() => {
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
    root = screen.getByRole('group');
  });

  afterEach(cleanup);

  it('should have no accessibility violations', async () => {
    expect(await axe(rendered.container)).toHaveNoViolations();
  });

  it.todo('pastes the code into the input', async () => {});
});
