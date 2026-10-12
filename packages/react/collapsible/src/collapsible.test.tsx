import * as React from 'react';
import { axe } from 'vitest-axe';
import type { RenderResult } from '@testing-library/react';
import { cleanup, render, fireEvent, screen } from '@testing-library/react';
import * as Collapsible from './collapsible';
import { afterEach, describe, it, beforeEach, vi, expect } from 'vitest';

const TRIGGER_TEXT = 'Trigger';
const CONTENT_TEXT = 'Content';

describe('given a default Collapsible', () => {
  let rendered: RenderResult;
  let trigger: HTMLElement;
  let content: HTMLElement | null;

  afterEach(cleanup);

  beforeEach(() => {
    rendered = render(
      <Collapsible.Root>
        <Collapsible.Trigger>{TRIGGER_TEXT}</Collapsible.Trigger>
        <Collapsible.Content>{CONTENT_TEXT}</Collapsible.Content>
      </Collapsible.Root>,
    );
    trigger = rendered.getByText(TRIGGER_TEXT);
  });

  it('should have no accessibility violations', async () => {
    expect(await axe(rendered.container)).toHaveNoViolations();
  });

  describe('when clicking the trigger', () => {
    beforeEach(async () => {
      fireEvent.click(trigger);
      content = rendered.queryByText(CONTENT_TEXT);
    });

    it('should open the content', () => {
      expect(content).toBeVisible();
    });

    describe('and clicking the trigger again', () => {
      beforeEach(() => {
        fireEvent.click(trigger);
      });

      it('should close the content', () => {
        expect(content).not.toBeVisible();
      });
    });
  });
});

describe('aria-controls', () => {
  afterEach(cleanup);

  it('should not reference a non-existent element while closed', () => {
    const rendered = render(
      <Collapsible.Root>
        <Collapsible.Trigger>{TRIGGER_TEXT}</Collapsible.Trigger>
        <Collapsible.Content>{CONTENT_TEXT}</Collapsible.Content>
      </Collapsible.Root>,
    );
    const trigger = rendered.getByText(TRIGGER_TEXT);

    expect(rendered.queryByText(CONTENT_TEXT)).not.toBeInTheDocument();
    expect(trigger).not.toHaveAttribute('aria-controls');
  });

  it('should reference the rendered content while open', () => {
    const rendered = render(
      <Collapsible.Root defaultOpen>
        <Collapsible.Trigger>{TRIGGER_TEXT}</Collapsible.Trigger>
        <Collapsible.Content>{CONTENT_TEXT}</Collapsible.Content>
      </Collapsible.Root>,
    );
    const trigger = rendered.getByText(TRIGGER_TEXT);
    const content = rendered.getByText(CONTENT_TEXT);
    expect(content.id).toBeTruthy();
    expect(trigger).toHaveAttribute('aria-controls', content.id);
    expect(document.getElementById(content.id)).toBe(content);
  });
});

describe('given an open uncontrolled Collapsible', () => {
  let rendered: RenderResult;
  let content: HTMLElement | null;
  const onOpenChange = vi.fn();

  afterEach(cleanup);

  beforeEach(() => {
    rendered = render(
      <Collapsible.Root defaultOpen onOpenChange={onOpenChange}>
        <Collapsible.Trigger>{TRIGGER_TEXT}</Collapsible.Trigger>
        <Collapsible.Content>{CONTENT_TEXT}</Collapsible.Content>
      </Collapsible.Root>,
    );
  });

  describe('when clicking the trigger', () => {
    beforeEach(async () => {
      const trigger = rendered.getByText(TRIGGER_TEXT);
      content = rendered.getByText(CONTENT_TEXT);
      fireEvent.click(trigger);
    });

    it('should close the content', () => {
      expect(content).not.toBeVisible();
    });

    it('should call `onOpenChange` prop with `false` value', () => {
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });
});

describe('given an open controlled Collapsible', () => {
  let rendered: RenderResult;
  let content: HTMLElement;
  const onOpenChange = vi.fn();

  afterEach(cleanup);

  beforeEach(() => {
    rendered = render(
      <Collapsible.Root open onOpenChange={onOpenChange}>
        <Collapsible.Trigger>{TRIGGER_TEXT}</Collapsible.Trigger>
        <Collapsible.Content>{CONTENT_TEXT}</Collapsible.Content>
      </Collapsible.Root>,
    );
    content = rendered.getByText(CONTENT_TEXT);
  });

  describe('when clicking the trigger', () => {
    beforeEach(() => {
      const trigger = rendered.getByText(TRIGGER_TEXT);
      fireEvent.click(trigger);
    });

    it('should call `onOpenChange` prop with `false` value', () => {
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('should not close the content', () => {
      expect(content).toBeVisible();
    });
  });
});

describe('Collapsible.Root', () => {
  afterEach(cleanup);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <Collapsible.Root
        defaultOpen
        ref={ref}
        data-testid="root"
        className="custom-class"
        style={{ outlineColor: 'rgb(1, 2, 3)' }}
        onClick={onClick}
      >
        <Collapsible.Trigger>Trigger</Collapsible.Trigger>
      </Collapsible.Root>,
    );

    const root = screen.getByTestId('root');
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
      <Collapsible.Root
        defaultOpen
        asChild
        ref={ref}
        data-testid="root"
        className="custom-class"
        style={{ outlineColor: 'rgb(1, 2, 3)' }}
        onClick={onClick}
      >
        <article>
          <Collapsible.Trigger>Trigger</Collapsible.Trigger>
        </article>
      </Collapsible.Root>,
    );

    const root = screen.getByTestId('root');
    expect(root.tagName).toBe('ARTICLE');
    expect(root).toHaveAttribute('data-state', 'open');
    expect(root).toHaveClass('custom-class');
    expect(root.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(root);

    fireEvent.click(root);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('Collapsible.Trigger', () => {
  afterEach(cleanup);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLButtonElement>();
    const onClick = vi.fn();

    render(
      <Collapsible.Root defaultOpen>
        <Collapsible.Trigger
          ref={ref}
          data-testid="trigger"
          className="custom-class"
          style={{ outlineColor: 'rgb(1, 2, 3)' }}
          onClick={onClick}
        >
          Trigger
        </Collapsible.Trigger>
      </Collapsible.Root>,
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
      <Collapsible.Root defaultOpen>
        <Collapsible.Trigger
          asChild
          ref={ref}
          data-testid="trigger"
          className="custom-class"
          style={{ outlineColor: 'rgb(1, 2, 3)' }}
          onClick={onClick}
        >
          <button type="button">Trigger</button>
        </Collapsible.Trigger>
      </Collapsible.Root>,
    );

    const trigger = screen.getByTestId('trigger');
    expect(trigger.tagName).toBe('BUTTON');
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(trigger).toHaveAttribute('data-state', 'open');
    expect(trigger).toHaveClass('custom-class');
    expect(trigger.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(trigger);

    fireEvent.click(trigger);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('Collapsible.Content', () => {
  afterEach(cleanup);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <Collapsible.Root defaultOpen>
        <Collapsible.Content
          ref={ref}
          data-testid="content"
          className="custom-class"
          style={{ outlineColor: 'rgb(1, 2, 3)' }}
          onClick={onClick}
        >
          Content
        </Collapsible.Content>
      </Collapsible.Root>,
    );

    const content = screen.getByTestId('content');
    expect(content).toHaveClass('custom-class');
    // Merged with the content's own `--radix-collapsible-content-*` custom properties.
    expect(content.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(content);

    fireEvent.click(content);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <Collapsible.Root defaultOpen>
        <Collapsible.Content
          asChild
          ref={ref}
          data-testid="content"
          className="custom-class"
          style={{ outlineColor: 'rgb(1, 2, 3)' }}
          onClick={onClick}
        >
          <article>Content</article>
        </Collapsible.Content>
      </Collapsible.Root>,
    );

    const content = screen.getByTestId('content');
    expect(content.tagName).toBe('ARTICLE');
    expect(content).toHaveAttribute('data-state', 'open');
    expect(content).toHaveClass('custom-class');
    expect(content.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(content);

    fireEvent.click(content);
    expect(onClick).toHaveBeenCalled();
  });
});
