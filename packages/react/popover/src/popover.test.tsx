import * as React from 'react';
import type { RenderResult } from '@testing-library/react';
import { cleanup, fireEvent, render } from '@testing-library/react';
import { afterEach, describe, it, expect } from 'vitest';
import * as Popover from './popover';

const TRIGGER_TEXT = 'Open';
const CONTENT_TEXT = 'Content';

const PopoverTest = (props: React.ComponentProps<typeof Popover.Root>) => (
  <Popover.Root {...props}>
    <Popover.Trigger>{TRIGGER_TEXT}</Popover.Trigger>
    <Popover.Portal>
      <Popover.Content>{CONTENT_TEXT}</Popover.Content>
    </Popover.Portal>
  </Popover.Root>
);

describe('aria-controls', () => {
  let rendered: RenderResult;

  afterEach(cleanup);

  it('should not reference a non-existent element while closed', () => {
    rendered = render(<PopoverTest />);
    const trigger = rendered.getByText(TRIGGER_TEXT);
    // Content is unmounted while closed, so the trigger must not point at it.
    expect(rendered.queryByText(CONTENT_TEXT)).not.toBeInTheDocument();
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).not.toHaveAttribute('aria-controls');
  });

  it('should reference the rendered content while open', () => {
    rendered = render(<PopoverTest />);
    const trigger = rendered.getByText(TRIGGER_TEXT);
    fireEvent.click(trigger);
    const content = rendered.getByText(CONTENT_TEXT);
    expect(content.id).toBeTruthy();
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(trigger).toHaveAttribute('aria-controls', content.id);
    expect(document.getElementById(content.id)).toBe(content);
  });
});


describe('hideWhenDetached', () => {
  let rendered: RenderResult;

  afterEach(cleanup);

  it('defaults hideWhenDetached to true', () => {
    rendered = render(<PopoverTest />);
    fireEvent.click(rendered.getByText(TRIGGER_TEXT));
    const wrapper = document.querySelector('[data-radix-popper-content-wrapper]');
    expect(wrapper).toBeTruthy();
  });

  it('allows overriding hideWhenDetached to false', () => {
    const { getByText } = render(
      <Popover.Root>
        <Popover.Trigger>{TRIGGER_TEXT}</Popover.Trigger>
        <Popover.Portal>
          <Popover.Content hideWhenDetached={false}>{CONTENT_TEXT}</Popover.Content>
        </Popover.Portal>
      </Popover.Root>,
    );
    fireEvent.click(getByText(TRIGGER_TEXT));
    const wrapper = document.querySelector('[data-radix-popper-content-wrapper]');
    expect(wrapper).toBeTruthy();
  });
});
