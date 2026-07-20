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

describe('Title and Description', () => {
  afterEach(cleanup);

  const TITLE_TEXT = 'Title';
  const DESCRIPTION_TEXT = 'Description';

  const openContent = (rendered: RenderResult) => {
    fireEvent.click(rendered.getByText(TRIGGER_TEXT));
    return rendered.getByRole('dialog');
  };

  it('should not reference a title or description when none are rendered', () => {
    const rendered = render(<PopoverTest />);
    const content = openContent(rendered);
    expect(content).not.toHaveAttribute('aria-labelledby');
    expect(content).not.toHaveAttribute('aria-describedby');
  });

  it('should label the content via aria-labelledby when a Title is rendered', () => {
    const rendered = render(
      <Popover.Root>
        <Popover.Trigger>{TRIGGER_TEXT}</Popover.Trigger>
        <Popover.Portal>
          <Popover.Content>
            <Popover.Title>{TITLE_TEXT}</Popover.Title>
            {CONTENT_TEXT}
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>,
    );
    const content = openContent(rendered);
    const title = rendered.getByText(TITLE_TEXT);
    expect(title.id).toBeTruthy();
    expect(content).toHaveAttribute('aria-labelledby', title.id);
    expect(content).not.toHaveAttribute('aria-describedby');
  });

  it('should describe the content via aria-describedby when a Description is rendered', () => {
    const rendered = render(
      <Popover.Root>
        <Popover.Trigger>{TRIGGER_TEXT}</Popover.Trigger>
        <Popover.Portal>
          <Popover.Content>
            <Popover.Description>{DESCRIPTION_TEXT}</Popover.Description>
            {CONTENT_TEXT}
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>,
    );
    const content = openContent(rendered);
    const description = rendered.getByText(DESCRIPTION_TEXT);
    expect(description.id).toBeTruthy();
    expect(content).toHaveAttribute('aria-describedby', description.id);
    expect(content).not.toHaveAttribute('aria-labelledby');
  });

  it('should reference both Title and Description when rendered together', () => {
    const rendered = render(
      <Popover.Root>
        <Popover.Trigger>{TRIGGER_TEXT}</Popover.Trigger>
        <Popover.Portal>
          <Popover.Content>
            <Popover.Title>{TITLE_TEXT}</Popover.Title>
            <Popover.Description>{DESCRIPTION_TEXT}</Popover.Description>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>,
    );
    const content = openContent(rendered);
    expect(content).toHaveAttribute('aria-labelledby', rendered.getByText(TITLE_TEXT).id);
    expect(content).toHaveAttribute('aria-describedby', rendered.getByText(DESCRIPTION_TEXT).id);
  });
});
