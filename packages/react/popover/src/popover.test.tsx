import * as React from 'react';
import type { RenderResult } from '@testing-library/react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, it, expect, vi } from 'vitest';
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

describe('given a Popover with `asChild` on the Content', () => {
  afterEach(cleanupModal);

  // Regression test for https://github.com/radix-ui/primitives/issues/4077
  it.each([{ modal: true }, { modal: false }])(
    'forwards content props and the ref to the child (modal: $modal)',
    ({ modal }) => {
      const contentRef = React.createRef<HTMLDivElement>();
      const onClick = vi.fn();

      render(
        <Popover.Root defaultOpen modal={modal}>
          <Popover.Trigger>{TRIGGER_TEXT}</Popover.Trigger>
          <Popover.Portal>
            <Popover.Content asChild className="content" onClick={onClick} ref={contentRef}>
              <article data-testid="content">{CONTENT_TEXT}</article>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>,
      );

      const content = screen.getByTestId('content');
      expect(content.tagName).toBe('ARTICLE');
      expect(content).toHaveAttribute('role', 'dialog');
      expect(content).toHaveAttribute('data-state', 'open');
      expect(content).toHaveClass('content');
      expect(contentRef.current).toBe(content);

      fireEvent.click(content);
      expect(onClick).toHaveBeenCalledTimes(1);
    },
  );
});

describe('Popover.Anchor', () => {
  afterEach(cleanupModal);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <Popover.Root>
        <Popover.Anchor
          ref={ref}
          data-testid="anchor"
          className="custom-class"
          style={{ outlineColor: 'rgb(1, 2, 3)' }}
          onClick={onClick}
        />
      </Popover.Root>,
    );

    const anchor = screen.getByTestId('anchor');
    expect(anchor).toHaveClass('custom-class');
    expect(anchor.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(anchor);

    fireEvent.click(anchor);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <Popover.Root>
        <Popover.Anchor
          asChild
          ref={ref}
          data-testid="anchor"
          className="custom-class"
          style={{ outlineColor: 'rgb(1, 2, 3)' }}
          onClick={onClick}
        >
          <article />
        </Popover.Anchor>
      </Popover.Root>,
    );

    const anchor = screen.getByTestId('anchor');
    expect(anchor.tagName).toBe('ARTICLE');
    expect(anchor).toHaveClass('custom-class');
    expect(anchor.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(anchor);

    fireEvent.click(anchor);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('Popover.Trigger', () => {
  afterEach(cleanupModal);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLButtonElement>();
    const onClick = vi.fn();

    render(
      <Popover.Root>
        <Popover.Trigger
          ref={ref}
          data-testid="trigger"
          className="custom-class"
          style={{ outlineColor: 'rgb(1, 2, 3)' }}
          onClick={onClick}
        >
          Open
        </Popover.Trigger>
      </Popover.Root>,
    );

    const trigger = screen.getByTestId('trigger');
    expect(trigger).toHaveClass('custom-class');
    expect(trigger.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(trigger);

    // Composed with the trigger's own click handler rather than replaced by it.
    fireEvent.click(trigger);
    expect(onClick).toHaveBeenCalled();
  });

  // With no custom anchor the trigger is also wrapped in a slotted `Popper.Anchor`, so the props
  // have to survive two nested `Slot`s.
  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<HTMLButtonElement>();
    const onClick = vi.fn();

    render(
      <Popover.Root>
        <Popover.Trigger
          asChild
          ref={ref}
          data-testid="trigger"
          className="custom-class"
          style={{ outlineColor: 'rgb(1, 2, 3)' }}
          onClick={onClick}
        >
          <button type="button">Open</button>
        </Popover.Trigger>
      </Popover.Root>,
    );

    const trigger = screen.getByTestId('trigger');
    expect(trigger.tagName).toBe('BUTTON');
    expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveAttribute('data-state', 'closed');
    expect(trigger).toHaveClass('custom-class');
    expect(trigger.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(trigger);

    fireEvent.click(trigger);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('Popover.Content', () => {
  afterEach(cleanupModal);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <Popover.Root defaultOpen>
        <Popover.Trigger>Open</Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            ref={ref}
            data-testid="content"
            className="custom-class"
            style={{ outlineColor: 'rgb(1, 2, 3)' }}
            onClick={onClick}
          >
            <Popover.Title>Title</Popover.Title>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>,
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
      <Popover.Root defaultOpen>
        <Popover.Trigger>Open</Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            asChild
            ref={ref}
            data-testid="content"
            className="custom-class"
            style={{ outlineColor: 'rgb(1, 2, 3)' }}
            onClick={onClick}
          >
            <article>
              <Popover.Title>Title</Popover.Title>
            </article>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>,
    );

    const content = screen.getByTestId('content');
    expect(content.tagName).toBe('ARTICLE');
    expect(content).toHaveAttribute('role', 'dialog');
    expect(content).toHaveAttribute('data-state', 'open');
    expect(content).toHaveAttribute('aria-labelledby', screen.getByText('Title').id);
    expect(content).toHaveClass('custom-class');
    expect(content.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(content);

    fireEvent.click(content);
    expect(onClick).toHaveBeenCalled();
  });

  it('spreads props it does not consume onto the element it renders on a modal popover', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <Popover.Root defaultOpen modal>
        <Popover.Trigger>Open</Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            ref={ref}
            data-testid="content"
            className="custom-class"
            style={{ outlineColor: 'rgb(1, 2, 3)' }}
            onClick={onClick}
          >
            <Popover.Title>Title</Popover.Title>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>,
    );

    const content = screen.getByTestId('content');
    expect(content).toHaveClass('custom-class');
    expect(content.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(content);

    fireEvent.click(content);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set on a modal popover', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <Popover.Root defaultOpen modal>
        <Popover.Trigger>Open</Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            asChild
            ref={ref}
            data-testid="content"
            className="custom-class"
            style={{ outlineColor: 'rgb(1, 2, 3)' }}
            onClick={onClick}
          >
            <article>
              <Popover.Title>Title</Popover.Title>
            </article>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>,
    );

    const content = screen.getByTestId('content');
    expect(content.tagName).toBe('ARTICLE');
    expect(content).toHaveAttribute('role', 'dialog');
    expect(content).toHaveAttribute('data-state', 'open');
    expect(content).toHaveAttribute('aria-labelledby', screen.getByText('Title').id);
    expect(content).toHaveClass('custom-class');
    expect(content.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(content);

    fireEvent.click(content);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('Popover.Title', () => {
  afterEach(cleanupModal);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLHeadingElement>();
    const onClick = vi.fn();

    render(
      <Popover.Root defaultOpen>
        <Popover.Trigger>Open</Popover.Trigger>
        <Popover.Portal>
          <Popover.Content>
            <Popover.Title
              ref={ref}
              data-testid="title"
              className="custom-class"
              style={{ outlineColor: 'rgb(1, 2, 3)' }}
              onClick={onClick}
            >
              Title
            </Popover.Title>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>,
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
      <Popover.Root defaultOpen>
        <Popover.Trigger>Open</Popover.Trigger>
        <Popover.Portal>
          <Popover.Content>
            <Popover.Title
              asChild
              ref={ref}
              data-testid="title"
              className="custom-class"
              style={{ outlineColor: 'rgb(1, 2, 3)' }}
              onClick={onClick}
            >
              <article>Title</article>
            </Popover.Title>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>,
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

describe('Popover.Description', () => {
  afterEach(cleanupModal);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLParagraphElement>();
    const onClick = vi.fn();

    render(
      <Popover.Root defaultOpen>
        <Popover.Trigger>Open</Popover.Trigger>
        <Popover.Portal>
          <Popover.Content>
            <Popover.Title>Title</Popover.Title>
            <Popover.Description
              ref={ref}
              data-testid="description"
              className="custom-class"
              style={{ outlineColor: 'rgb(1, 2, 3)' }}
              onClick={onClick}
            >
              Description
            </Popover.Description>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>,
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
      <Popover.Root defaultOpen>
        <Popover.Trigger>Open</Popover.Trigger>
        <Popover.Portal>
          <Popover.Content>
            <Popover.Title>Title</Popover.Title>
            <Popover.Description
              asChild
              ref={ref}
              data-testid="description"
              className="custom-class"
              style={{ outlineColor: 'rgb(1, 2, 3)' }}
              onClick={onClick}
            >
              <article>Description</article>
            </Popover.Description>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>,
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

describe('Popover.Close', () => {
  afterEach(cleanupModal);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLButtonElement>();
    const onClick = vi.fn();

    render(
      <Popover.Root defaultOpen>
        <Popover.Trigger>Open</Popover.Trigger>
        <Popover.Portal>
          <Popover.Content>
            <Popover.Title>Title</Popover.Title>
            <Popover.Close
              ref={ref}
              data-testid="close"
              className="custom-class"
              style={{ outlineColor: 'rgb(1, 2, 3)' }}
              onClick={onClick}
            >
              Close
            </Popover.Close>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>,
    );

    const close = screen.getByTestId('close');
    expect(close).toHaveClass('custom-class');
    expect(close.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(close);

    // Composed with the close behaviour rather than replaced by it.
    fireEvent.click(close);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<HTMLButtonElement>();
    const onClick = vi.fn();

    render(
      <Popover.Root defaultOpen>
        <Popover.Trigger>Open</Popover.Trigger>
        <Popover.Portal>
          <Popover.Content>
            <Popover.Title>Title</Popover.Title>
            <Popover.Close
              asChild
              ref={ref}
              data-testid="close"
              className="custom-class"
              style={{ outlineColor: 'rgb(1, 2, 3)' }}
              onClick={onClick}
            >
              <button type="button">Close</button>
            </Popover.Close>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>,
    );

    const close = screen.getByTestId('close');
    expect(close.tagName).toBe('BUTTON');
    expect(close).toHaveClass('custom-class');
    expect(close.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(close);

    fireEvent.click(close);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('Popover.Arrow', () => {
  afterEach(cleanupModal);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<SVGSVGElement>();
    const onClick = vi.fn();

    render(
      <Popover.Root defaultOpen>
        <Popover.Trigger>Open</Popover.Trigger>
        <Popover.Portal>
          <Popover.Content>
            <Popover.Title>Title</Popover.Title>
            <Popover.Arrow
              ref={ref}
              data-testid="arrow"
              className="custom-class"
              style={{ outlineColor: 'rgb(1, 2, 3)' }}
              onClick={onClick}
            />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>,
    );

    const arrow = screen.getByTestId('arrow');
    expect(arrow).toHaveClass('custom-class');
    expect(arrow.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(arrow);

    fireEvent.click(arrow);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<SVGSVGElement>();
    const onClick = vi.fn();

    render(
      <Popover.Root defaultOpen>
        <Popover.Trigger>Open</Popover.Trigger>
        <Popover.Portal>
          <Popover.Content>
            <Popover.Title>Title</Popover.Title>
            <Popover.Arrow
              asChild
              ref={ref}
              data-testid="arrow"
              className="custom-class"
              style={{ outlineColor: 'rgb(1, 2, 3)' }}
              onClick={onClick}
            >
              <svg />
            </Popover.Arrow>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>,
    );

    const arrow = screen.getByTestId('arrow');
    // SVG elements report their tag name in lower case.
    expect(arrow.tagName).toBe('svg');
    expect(arrow).toHaveAttribute('viewBox', '0 0 30 10');
    expect(arrow).toHaveClass('custom-class');
    expect(arrow.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(arrow);

    fireEvent.click(arrow);
    expect(onClick).toHaveBeenCalled();
  });
});

function cleanupModal() {
  cleanup();
  // A modal popover sets this on the `body` and only restores it on close.
  document.body.style.pointerEvents = '';
}
