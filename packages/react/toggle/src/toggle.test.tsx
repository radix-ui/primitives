import type { RenderResult } from '@testing-library/react';
import { cleanup, fireEvent, render } from '@testing-library/react';
import * as Toggle from './toggle';
import { axe } from 'vitest-axe';
import { afterEach, describe, it, beforeEach, vi, expect } from 'vitest';

const TEXT_CHILD = 'Like';

describe('given a Toggle with text', () => {
  let rendered: RenderResult;

  beforeEach(() => {
    rendered = render(<Toggle.Root>{TEXT_CHILD}</Toggle.Root>);
  });

  afterEach(cleanup);

  it('should have no accessibility violations', async () => {
    expect(await axe(rendered.container)).toHaveNoViolations();
  });

  it('should render with attributes as false/off by default', () => {
    const button = rendered.getByRole('button', { name: TEXT_CHILD });

    expect(button).toHaveAttribute('aria-pressed', 'false');
    expect(button).toHaveAttribute('data-state', 'off');
  });

  it('Click event should change pressed attributes to true/on', () => {
    const button = rendered.getByRole('button', { name: TEXT_CHILD });

    fireEvent(
      button,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      })
    );

    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(button).toHaveAttribute('data-state', 'on');
  });
});

describe('given a Toggle with text and defaultPressed="true"', () => {
  let rendered: RenderResult;

  beforeEach(() => {
    rendered = render(<Toggle.Root defaultPressed>{TEXT_CHILD}</Toggle.Root>);
  });

  afterEach(cleanup);

  it('should render with attributes true/on by default', () => {
    const button = rendered.getByRole('button', { name: TEXT_CHILD });

    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(button).toHaveAttribute('data-state', 'on');
  });

  it('Click event should change attributes back to off/false', () => {
    const button = rendered.getByRole('button', { name: TEXT_CHILD });

    fireEvent(
      button,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      })
    );

    expect(button).toHaveAttribute('aria-pressed', 'false');
    expect(button).toHaveAttribute('data-state', 'off');
  });
});

describe('given a Toggle with text and disabled="true"', () => {
  let rendered: RenderResult;

  beforeEach(() => {
    rendered = render(<Toggle.Root disabled>{TEXT_CHILD}</Toggle.Root>);
  });

  afterEach(cleanup);

  it('on click the attributes do not change', () => {
    const button = rendered.getByRole('button', { name: TEXT_CHILD });

    expect(button).toHaveAttribute('aria-pressed', 'false');
    expect(button).toHaveAttribute('data-state', 'off');
    expect(button).toHaveAttribute('disabled', '');

    fireEvent(
      button,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      })
    );

    expect(button).toHaveAttribute('aria-pressed', 'false');
    expect(button).toHaveAttribute('data-state', 'off');
  });
});

describe('given a controlled Toggle (with pressed and onPressedChange)', () => {
  let rendered: RenderResult;
  const onPressedChangeMock = vi.fn();

  beforeEach(() => {
    rendered = render(
      <Toggle.Root pressed onPressedChange={onPressedChangeMock}>
        {TEXT_CHILD}
      </Toggle.Root>
    );
  });

  afterEach(cleanup);

  it('Click event should keep the same attributes, and pass the new state to onPressedChange', () => {
    const button = rendered.getByRole('button', { name: TEXT_CHILD });

    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(button).toHaveAttribute('data-state', 'on');

    fireEvent(
      button,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      })
    );

    expect(onPressedChangeMock).toHaveBeenCalledTimes(1);
    expect(onPressedChangeMock).toHaveBeenCalledWith(false);

    // The attributes do not change, they keep the same
    // because it's a controlled component.
    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(button).toHaveAttribute('data-state', 'on');
  });
});
