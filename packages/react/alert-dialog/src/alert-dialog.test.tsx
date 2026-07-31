import * as React from 'react';
import { axe } from 'vitest-axe';
import type { RenderResult } from '@testing-library/react';
import { cleanup, render, fireEvent, screen } from '@testing-library/react';
import * as AlertDialog from './alert-dialog';
import { afterEach, describe, it, beforeEach, expect, vi } from 'vitest';

const OPEN_TEXT = 'Open';
const CANCEL_TEXT = 'Cancel';
const ACTION_TEXT = 'Do it';
const TITLE_TEXT = 'Warning';
const DESC_TEXT = 'This is a warning';
const OVERLAY_TEST_ID = 'test-overlay';

describe('given a default AlertDialog', () => {
  let rendered: RenderResult;
  let title: HTMLElement;
  let trigger: HTMLElement;
  let cancelButton: HTMLElement;

  afterEach(cleanup);

  beforeEach(() => {
    rendered = render(
      <AlertDialog.Root>
        <AlertDialog.Trigger>{OPEN_TEXT}</AlertDialog.Trigger>
        <AlertDialog.Overlay data-testid={OVERLAY_TEST_ID} />
        <AlertDialog.Content>
          <AlertDialog.Title>{TITLE_TEXT}</AlertDialog.Title>
          <AlertDialog.Description>{DESC_TEXT}</AlertDialog.Description>
          <AlertDialog.Cancel>{CANCEL_TEXT}</AlertDialog.Cancel>
          <AlertDialog.Action>{ACTION_TEXT}</AlertDialog.Action>
        </AlertDialog.Content>
      </AlertDialog.Root>,
    );
    trigger = rendered.getByText(OPEN_TEXT);
  });

  it('should have no accessibility violations in default state', async () => {
    expect(await axe(rendered.container)).toHaveNoViolations();
  });

  describe('after clicking the trigger', () => {
    beforeEach(() => {
      fireEvent.click(trigger);
      title = rendered.getByText(TITLE_TEXT);
      cancelButton = rendered.getByText(CANCEL_TEXT);
    });

    it('should open the content', () => {
      expect(title).toBeVisible();
    });

    it('should have no accessibility violations when open', async () => {
      expect(await axe(rendered.container)).toHaveNoViolations();
    });

    it('should focus the cancel button', () => {
      expect(cancelButton).toHaveFocus();
    });
  });
});

describe('AlertDialog.Trigger', () => {
  afterEach(cleanupModal);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLButtonElement>();
    const onClick = vi.fn();

    render(
      <AlertDialog.Root>
        <AlertDialog.Trigger
          ref={ref}
          data-testid="trigger"
          className="custom-class"
          style={{ outlineColor: 'rgb(1, 2, 3)' }}
          onClick={onClick}
        >
          Open
        </AlertDialog.Trigger>
      </AlertDialog.Root>,
    );

    const trigger = screen.getByTestId('trigger');
    expect(trigger).toHaveClass('custom-class');
    expect(trigger.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(trigger);

    // Composed with the trigger's own click handler rather than replaced by it.
    fireEvent.click(trigger);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<HTMLButtonElement>();
    const onClick = vi.fn();

    render(
      <AlertDialog.Root>
        <AlertDialog.Trigger
          asChild
          ref={ref}
          data-testid="trigger"
          className="custom-class"
          style={{ outlineColor: 'rgb(1, 2, 3)' }}
          onClick={onClick}
        >
          <button type="button">Open</button>
        </AlertDialog.Trigger>
      </AlertDialog.Root>,
    );

    const trigger = screen.getByTestId('trigger');
    expect(trigger.tagName).toBe('BUTTON');
    expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveClass('custom-class');
    expect(trigger.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(trigger);

    fireEvent.click(trigger);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('AlertDialog.Overlay', () => {
  afterEach(cleanupModal);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <AlertDialog.Root defaultOpen>
        <AlertDialog.Portal>
          <AlertDialog.Overlay
            ref={ref}
            data-testid="overlay"
            className="custom-class"
            style={{ outlineColor: 'rgb(1, 2, 3)' }}
            onClick={onClick}
          />
        </AlertDialog.Portal>
      </AlertDialog.Root>,
    );

    const overlay = screen.getByTestId('overlay');
    expect(overlay).toHaveClass('custom-class');
    expect(overlay.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(overlay);

    fireEvent.click(overlay);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <AlertDialog.Root defaultOpen>
        <AlertDialog.Portal>
          <AlertDialog.Overlay
            asChild
            ref={ref}
            data-testid="overlay"
            className="custom-class"
            style={{ outlineColor: 'rgb(1, 2, 3)' }}
            onClick={onClick}
          >
            <article />
          </AlertDialog.Overlay>
        </AlertDialog.Portal>
      </AlertDialog.Root>,
    );

    const overlay = screen.getByTestId('overlay');
    expect(overlay.tagName).toBe('ARTICLE');
    expect(overlay).toHaveAttribute('data-state', 'open');
    expect(overlay).toHaveClass('custom-class');
    expect(overlay.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(overlay);

    fireEvent.click(overlay);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('AlertDialog.Content', () => {
  afterEach(cleanupModal);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <AlertDialog.Root defaultOpen>
        <AlertDialog.Portal>
          <AlertDialog.Content
            ref={ref}
            data-testid="content"
            className="custom-class"
            style={{ outlineColor: 'rgb(1, 2, 3)' }}
            onClick={onClick}
          >
            <AlertDialog.Title>Title</AlertDialog.Title>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>,
    );

    const content = screen.getByTestId('content');
    expect(content).toHaveClass('custom-class');
    expect(content.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(content);

    fireEvent.click(content);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <AlertDialog.Root defaultOpen>
        <AlertDialog.Portal>
          <AlertDialog.Content
            asChild
            ref={ref}
            data-testid="content"
            className="custom-class"
            style={{ outlineColor: 'rgb(1, 2, 3)' }}
            onClick={onClick}
          >
            <article>
              <AlertDialog.Title>Title</AlertDialog.Title>
            </article>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>,
    );

    const content = screen.getByTestId('content');
    expect(content.tagName).toBe('ARTICLE');
    expect(content).toHaveAttribute('role', 'alertdialog');
    expect(content).toHaveAttribute('data-state', 'open');
    expect(content).toHaveAttribute('aria-labelledby', screen.getByText('Title').id);
    expect(content).toHaveClass('custom-class');
    expect(content.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(content);

    fireEvent.click(content);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('AlertDialog.Title', () => {
  afterEach(cleanupModal);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLHeadingElement>();
    const onClick = vi.fn();

    render(
      <AlertDialog.Root defaultOpen>
        <AlertDialog.Portal>
          <AlertDialog.Content>
            <AlertDialog.Title
              ref={ref}
              data-testid="title"
              className="custom-class"
              style={{ outlineColor: 'rgb(1, 2, 3)' }}
              onClick={onClick}
            >
              Title
            </AlertDialog.Title>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>,
    );

    const title = screen.getByTestId('title');
    expect(title).toHaveClass('custom-class');
    expect(title.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(title);

    fireEvent.click(title);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<HTMLHeadingElement>();
    const onClick = vi.fn();

    render(
      <AlertDialog.Root defaultOpen>
        <AlertDialog.Portal>
          <AlertDialog.Content>
            <AlertDialog.Title
              asChild
              ref={ref}
              data-testid="title"
              className="custom-class"
              style={{ outlineColor: 'rgb(1, 2, 3)' }}
              onClick={onClick}
            >
              <article>Title</article>
            </AlertDialog.Title>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>,
    );

    const title = screen.getByTestId('title');
    expect(title.tagName).toBe('ARTICLE');
    expect(title).toHaveClass('custom-class');
    expect(title.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(title);

    fireEvent.click(title);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('AlertDialog.Description', () => {
  afterEach(cleanupModal);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLParagraphElement>();
    const onClick = vi.fn();

    render(
      <AlertDialog.Root defaultOpen>
        <AlertDialog.Portal>
          <AlertDialog.Content>
            <AlertDialog.Title>Title</AlertDialog.Title>
            <AlertDialog.Description
              ref={ref}
              data-testid="description"
              className="custom-class"
              style={{ outlineColor: 'rgb(1, 2, 3)' }}
              onClick={onClick}
            >
              Description
            </AlertDialog.Description>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>,
    );

    const description = screen.getByTestId('description');
    expect(description).toHaveClass('custom-class');
    expect(description.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(description);

    fireEvent.click(description);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<HTMLParagraphElement>();
    const onClick = vi.fn();

    render(
      <AlertDialog.Root defaultOpen>
        <AlertDialog.Portal>
          <AlertDialog.Content>
            <AlertDialog.Title>Title</AlertDialog.Title>
            <AlertDialog.Description
              asChild
              ref={ref}
              data-testid="description"
              className="custom-class"
              style={{ outlineColor: 'rgb(1, 2, 3)' }}
              onClick={onClick}
            >
              <article>Description</article>
            </AlertDialog.Description>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>,
    );

    const description = screen.getByTestId('description');
    expect(description.tagName).toBe('ARTICLE');
    expect(description).toHaveClass('custom-class');
    expect(description.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(description);

    fireEvent.click(description);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('AlertDialog.Action', () => {
  afterEach(cleanupModal);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLButtonElement>();
    const onClick = vi.fn();

    render(
      <AlertDialog.Root defaultOpen>
        <AlertDialog.Portal>
          <AlertDialog.Content>
            <AlertDialog.Title>Title</AlertDialog.Title>
            <AlertDialog.Action
              ref={ref}
              data-testid="action"
              className="custom-class"
              style={{ outlineColor: 'rgb(1, 2, 3)' }}
              onClick={onClick}
            >
              Action
            </AlertDialog.Action>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>,
    );

    const action = screen.getByTestId('action');
    expect(action).toHaveClass('custom-class');
    expect(action.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(action);

    // Composed with the close behaviour rather than replaced by it.
    fireEvent.click(action);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<HTMLButtonElement>();
    const onClick = vi.fn();

    render(
      <AlertDialog.Root defaultOpen>
        <AlertDialog.Portal>
          <AlertDialog.Content>
            <AlertDialog.Title>Title</AlertDialog.Title>
            <AlertDialog.Action
              asChild
              ref={ref}
              data-testid="action"
              className="custom-class"
              style={{ outlineColor: 'rgb(1, 2, 3)' }}
              onClick={onClick}
            >
              <button type="button">Action</button>
            </AlertDialog.Action>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>,
    );

    const action = screen.getByTestId('action');
    expect(action.tagName).toBe('BUTTON');
    expect(action).toHaveClass('custom-class');
    expect(action.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(action);

    fireEvent.click(action);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('AlertDialog.Cancel', () => {
  afterEach(cleanupModal);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLButtonElement>();
    const onClick = vi.fn();

    render(
      <AlertDialog.Root defaultOpen>
        <AlertDialog.Portal>
          <AlertDialog.Content>
            <AlertDialog.Title>Title</AlertDialog.Title>
            <AlertDialog.Cancel
              ref={ref}
              data-testid="cancel"
              className="custom-class"
              style={{ outlineColor: 'rgb(1, 2, 3)' }}
              onClick={onClick}
            >
              Cancel
            </AlertDialog.Cancel>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>,
    );

    const cancel = screen.getByTestId('cancel');
    expect(cancel).toHaveClass('custom-class');
    expect(cancel.style.outlineColor).toBe('rgb(1, 2, 3)');
    // `Cancel` composes the consumer's ref with the one `Content` uses to focus it on open.
    expect(ref.current).toBe(cancel);

    fireEvent.click(cancel);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<HTMLButtonElement>();
    const onClick = vi.fn();

    render(
      <AlertDialog.Root defaultOpen>
        <AlertDialog.Portal>
          <AlertDialog.Content>
            <AlertDialog.Title>Title</AlertDialog.Title>
            <AlertDialog.Cancel
              asChild
              ref={ref}
              data-testid="cancel"
              className="custom-class"
              style={{ outlineColor: 'rgb(1, 2, 3)' }}
              onClick={onClick}
            >
              <button type="button">Cancel</button>
            </AlertDialog.Cancel>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>,
    );

    const cancel = screen.getByTestId('cancel');
    expect(cancel.tagName).toBe('BUTTON');
    expect(cancel).toHaveClass('custom-class');
    expect(cancel.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(cancel);

    fireEvent.click(cancel);
    expect(onClick).toHaveBeenCalled();
  });
});

function cleanupModal() {
  cleanup();
  // Modal menus set this on the `body` and only restore it on close.
  document.body.style.pointerEvents = '';
}
