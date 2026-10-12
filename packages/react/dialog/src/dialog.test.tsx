import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { axe } from 'vitest-axe';
import type { RenderResult } from '@testing-library/react';
import { act, render, fireEvent, cleanup, screen } from '@testing-library/react';
import { DismissableLayer } from '@radix-ui/react-dismissable-layer';
import { useFocusScopeBranch } from '@radix-ui/react-focus-scope';
import * as Dialog from './dialog';
import type { MockInstance } from 'vitest';
import { describe, it, afterEach, beforeEach, vi, expect } from 'vitest';

const OPEN_TEXT = 'Open';
const CLOSE_TEXT = 'Close';
const TITLE_TEXT = 'Title';

const DialogTest = (props: React.ComponentProps<typeof Dialog.Root>) => (
  <Dialog.Root {...props}>
    <Dialog.Trigger>{OPEN_TEXT}</Dialog.Trigger>
    <Dialog.Overlay />
    <Dialog.Content>
      <Dialog.Title>{TITLE_TEXT}</Dialog.Title>
      <Dialog.Close>{CLOSE_TEXT}</Dialog.Close>
    </Dialog.Content>
  </Dialog.Root>
);

describe('given a default Dialog', () => {
  let rendered: RenderResult;
  let trigger: HTMLElement;
  let closeButton: HTMLElement;

  beforeEach(() => {
    rendered = render(<DialogTest />);
    trigger = rendered.getByText(OPEN_TEXT);
  });

  afterEach(() => {
    cleanup();
  });

  it('should have no accessibility violations in default state', async () => {
    expect(await axe(rendered.container)).toHaveNoViolations();
  });

  describe('after clicking the trigger', () => {
    beforeEach(() => {
      fireEvent.click(trigger);
      closeButton = rendered.getByText(CLOSE_TEXT);
    });

    it('should open the content', () => {
      expect(closeButton).toBeVisible();
    });

    it('should have no accessibility violations', async () => {
      expect(await axe(rendered.container)).toHaveNoViolations();
    });

    it('should focus the close button', () => {
      expect(closeButton).toHaveFocus();
    });

    describe('when pressing escape', () => {
      beforeEach(() => {
        fireEvent.keyDown(document.activeElement!, { key: 'Escape' });
      });

      it('should close the content', () => {
        expect(closeButton).not.toBeInTheDocument();
      });
    });
  });
});

describe('aria-controls', () => {
  let consoleWarnMock: MockInstance;

  beforeEach(() => {
    consoleWarnMock = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    cleanup();
    consoleWarnMock.mockRestore();
  });

  it('should not reference a non-existent element while closed', () => {
    const rendered = render(<DialogTest />);
    const trigger = rendered.getByText(OPEN_TEXT);

    expect(rendered.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).not.toHaveAttribute('aria-controls');
  });

  it('should reference the rendered content while open', () => {
    const rendered = render(<DialogTest />);
    const trigger = rendered.getByText(OPEN_TEXT);
    fireEvent.click(trigger);
    const content = rendered.getByRole('dialog');
    expect(content.id).toBeTruthy();
    expect(trigger).toHaveAttribute('aria-controls', content.id);
    expect(document.getElementById(content.id)).toBe(content);
  });
});

describe('aria-labelledby / aria-describedby references', () => {
  afterEach(() => {
    cleanup();
  });

  // A referenced `aria-labelledby`/`aria-describedby` id must resolve to an
  // element in the document, otherwise it is a broken ARIA reference.
  // https://github.com/radix-ui/primitives/issues/2836
  it('should reference `Title` and `Description` when they are rendered', () => {
    const rendered = render(
      <Dialog.Root defaultOpen>
        <Dialog.Content>
          <Dialog.Title>Title</Dialog.Title>
          <Dialog.Description>Description</Dialog.Description>
        </Dialog.Content>
      </Dialog.Root>,
    );
    const content = rendered.getByRole('dialog');
    const labelledBy = content.getAttribute('aria-labelledby');
    const describedBy = content.getAttribute('aria-describedby');
    expect(labelledBy).toBeTruthy();
    expect(describedBy).toBeTruthy();
    expect(document.getElementById(labelledBy!)).toHaveTextContent('Title');
    expect(document.getElementById(describedBy!)).toHaveTextContent('Description');
  });

  // Regression test for https://github.com/radix-ui/primitives/issues/2598
  it('should normalize existing aria-describedby ids and append the Description id', () => {
    const rendered = render(
      <>
        <span id="existing-description">Existing description</span>
        <span id="shared-description">Shared description</span>
        <Dialog.Root defaultOpen>
          <Dialog.Content
            aria-describedby={' existing-description\texisting-description shared-description '}
          >
            <Dialog.Title>Title</Dialog.Title>
            <Dialog.Description>Description</Dialog.Description>
          </Dialog.Content>
        </Dialog.Root>
      </>,
    );

    const content = rendered.getByRole('dialog');
    const description = rendered.getByText('Description');
    expect(content).toHaveAttribute(
      'aria-describedby',
      `existing-description shared-description ${description.id}`,
    );
  });

  it('should not set `aria-labelledby` when no `Title` is rendered', () => {
    const rendered = render(
      <Dialog.Root defaultOpen>
        <Dialog.Content aria-label="Custom label">
          <Dialog.Description>Description</Dialog.Description>
        </Dialog.Content>
      </Dialog.Root>,
    );
    const content = rendered.getByRole('dialog');
    expect(content).not.toHaveAttribute('aria-labelledby');
  });

  it('should not set `aria-describedby` when no `Description` is rendered', () => {
    const rendered = render(
      <Dialog.Root defaultOpen>
        <Dialog.Content>
          <Dialog.Title>Title</Dialog.Title>
        </Dialog.Content>
      </Dialog.Root>,
    );
    const content = rendered.getByRole('dialog');
    expect(content).not.toHaveAttribute('aria-describedby');
  });

  it('should update references when `Title`/`Description` mount and unmount', () => {
    const Test = ({ showText }: { showText: boolean }) => (
      <Dialog.Root defaultOpen>
        <Dialog.Content aria-label="Custom label">
          {showText ? <Dialog.Title>Title</Dialog.Title> : null}
          {showText ? <Dialog.Description>Description</Dialog.Description> : null}
        </Dialog.Content>
      </Dialog.Root>
    );

    const rendered = render(<Test showText={false} />);
    const content = rendered.getByRole('dialog');
    expect(content).not.toHaveAttribute('aria-labelledby');
    expect(content).not.toHaveAttribute('aria-describedby');

    rendered.rerender(<Test showText={true} />);
    expect(content).toHaveAttribute('aria-labelledby');
    expect(content).toHaveAttribute('aria-describedby');

    rendered.rerender(<Test showText={false} />);
    expect(content).not.toHaveAttribute('aria-labelledby');
    expect(content).not.toHaveAttribute('aria-describedby');
  });
});

describe('given a modal Dialog', () => {
  afterEach(cleanupModal);

  it('should restore `body` pointer-events after closing', () => {
    const { getByText } = render(<DialogTest />);
    expect(document.body.style.pointerEvents).toBe('');
    fireEvent.click(getByText(OPEN_TEXT));
    expect(document.body.style.pointerEvents).toBe('none');
    fireEvent.click(getByText(CLOSE_TEXT));
    expect(document.body.style.pointerEvents).toBe('');
  });

  // Regression test for https://github.com/radix-ui/primitives/issues/2860
  // Ctrl + mouse wheel is the browser zoom gesture on Windows (and pinch-zoom on
  // macOS trackpads emits a `wheel` event with `ctrlKey`).
  it('should not prevent ctrl + wheel (page zoom) while open', async () => {
    render(<DialogTest />);
    fireEvent.click(screen.getByText(OPEN_TEXT));

    // `RemoveScroll` attaches its document `wheel` listener from an
    // asynchronously loaded sidecar. Poll until a plain wheel over the isolated
    // `body` is prevented, which confirms the scroll lock is active. If this
    // never happens the test fails loudly rather than passing spuriously.
    async function waitForScrollLock() {
      for (let i = 0; i < 50; i++) {
        const notPrevented = fireEvent.wheel(document.body, { deltaY: 10 });
        if (!notPrevented) {
          return;
        }
        await act(async () => {
          await new Promise((resolve) => window.setTimeout(resolve, 10));
        });
      }
      throw new Error('RemoveScroll did not attach its `wheel` listener');
    }

    await waitForScrollLock();

    // The ctrl + wheel zoom gesture over the dialog must NOT be prevented.
    const content = screen.getByRole('dialog');
    const zoomWheelPrevented = !fireEvent.wheel(content, { ctrlKey: true, deltaY: 10 });
    expect(zoomWheelPrevented).toBe(false);
  });
});

describe('given a Dialog with `asChild` on the Content', () => {
  afterEach(cleanupModal);

  // Regression test for https://github.com/radix-ui/primitives/issues/4077
  it.each([{ modal: true }, { modal: false }])(
    'forwards content props and the ref to the child (modal: $modal)',
    ({ modal }) => {
      const contentRef = React.createRef<HTMLDivElement>();
      const onClick = vi.fn();

      render(
        <Dialog.Root defaultOpen modal={modal}>
          <Dialog.Portal>
            <Dialog.Content asChild className="content" onClick={onClick} ref={contentRef}>
              <article data-testid="content">
                <Dialog.Title>{TITLE_TEXT}</Dialog.Title>
                <Dialog.Close>{CLOSE_TEXT}</Dialog.Close>
              </article>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>,
      );

      const content = screen.getByTestId('content');
      expect(content.tagName).toBe('ARTICLE');
      expect(content).toHaveAttribute('role', 'dialog');
      expect(content).toHaveAttribute('data-state', 'open');
      expect(content).toHaveAttribute('aria-labelledby', screen.getByText(TITLE_TEXT).id);
      expect(content).toHaveClass('content');
      expect(contentRef.current).toBe(content);

      fireEvent.click(content);
      expect(onClick).toHaveBeenCalledTimes(1);
    },
  );

  it('registers portalled descendants as focus scope branches', () => {
    function PortalledBranch() {
      const [node, setNode] = React.useState<HTMLElement | null>(null);
      useFocusScopeBranch(node);
      return ReactDOM.createPortal(
        <div ref={setNode}>
          <button type="button">branch</button>
        </div>,
        document.body,
      );
    }

    render(
      <Dialog.Root defaultOpen>
        <Dialog.Portal>
          <Dialog.Content asChild>
            <article>
              <Dialog.Title>{TITLE_TEXT}</Dialog.Title>
              <Dialog.Close>{CLOSE_TEXT}</Dialog.Close>
              <PortalledBranch />
            </article>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>,
    );

    // The branch lives outside the dialog's DOM subtree, so a trapped focus
    // scope would normally reclaim focus from it.
    const branch = screen.getByText('branch');
    act(() => branch.focus());
    expect(branch).toHaveFocus();
  });

  it('still dismisses on escape when slotted', () => {
    const onOpenChange = vi.fn();
    render(
      <Dialog.Root defaultOpen onOpenChange={onOpenChange}>
        <Dialog.Portal>
          <Dialog.Content asChild>
            <article>
              <Dialog.Title>{TITLE_TEXT}</Dialog.Title>
            </article>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>,
    );

    fireEvent.keyDown(document.activeElement!, { key: 'Escape' });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});

describe('given two overlapping modal Dialogs (forceMount)', () => {
  // Forcing mount keeps the content (and its `DismissableLayer`) mounted while
  // `open` toggles, which mirrors what happens during exit animations or when
  // controlling presence with an animation library. This is the scenario that
  // leaks `pointer-events: none` on the `body` when multiple layers overlap.
  // https://github.com/radix-ui/primitives/issues/3645
  const TwoDialogsTest = () => {
    const [openA, setOpenA] = React.useState(true);
    const [openB, setOpenB] = React.useState(true);
    return (
      <>
        <Dialog.Root open={openA} onOpenChange={setOpenA}>
          <Dialog.Portal forceMount>
            <Dialog.Overlay />
            <Dialog.Content forceMount>
              <Dialog.Title>A</Dialog.Title>
              <Dialog.Description>A</Dialog.Description>
              <button onClick={() => setOpenA(false)}>close-a</button>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
        <Dialog.Root open={openB} onOpenChange={setOpenB}>
          <Dialog.Portal forceMount>
            <Dialog.Overlay />
            <Dialog.Content forceMount>
              <Dialog.Title>B</Dialog.Title>
              <Dialog.Description>B</Dialog.Description>
              <button onClick={() => setOpenB(false)}>close-b</button>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </>
    );
  };

  afterEach(cleanupModal);

  it('should restore `body` pointer-events after both close', () => {
    render(<TwoDialogsTest />);
    expect(document.body.style.pointerEvents).toBe('none');
    fireEvent.click(screen.getByText('close-a'));
    fireEvent.click(screen.getByText('close-b'));
    expect(document.body.style.pointerEvents).toBe('');
  });
});

describe('given a modal Dialog containing a nested modal layer (eg. a DropdownMenu)', () => {
  async function waitForDocumentPointerDownListener() {
    // `DismissableLayer` registers its `pointerdown` listener in a `setTimeout`.
    await act(async () => {
      await new Promise((resolve) => window.setTimeout(resolve, 0));
    });
  }

  function firePointerMouseClick(target: Element) {
    fireEvent.pointerDown(target, { pointerType: 'mouse' });
    fireEvent.mouseDown(target);
    fireEvent.pointerUp(target, { pointerType: 'mouse' });
    fireEvent.mouseUp(target);
    fireEvent.click(target);
  }

  afterEach(cleanupModal);

  // Regression test for https://github.com/radix-ui/primitives/issues/4035
  it('does not call `onOpenChange(false)` on a controlled dialog when the nested layer is dismissed by an outside interaction', async () => {
    const onOpenChange = vi.fn();
    const onNestedLayerDismiss = vi.fn();

    function ControlledDialog() {
      const [open, setOpen] = React.useState(true);
      const [menuOpen, setMenuOpen] = React.useState(false);
      return (
        <>
          <Dialog.Root
            open={open}
            onOpenChange={(nextOpen) => {
              onOpenChange(nextOpen);
              setOpen(nextOpen);
            }}
          >
            <Dialog.Portal>
              <Dialog.Overlay />
              <Dialog.Content>
                <Dialog.Title>Title</Dialog.Title>
                <button type="button" onClick={() => setMenuOpen(true)}>
                  open menu
                </button>
                {menuOpen ? (
                  <DismissableLayer disableOutsidePointerEvents onDismiss={onNestedLayerDismiss}>
                    <button type="button">menu item</button>
                  </DismissableLayer>
                ) : null}
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
          <button type="button">outside</button>
        </>
      );
    }

    render(<ControlledDialog />);
    await waitForDocumentPointerDownListener();

    // Open the nested layer so it becomes the top-most layer.
    fireEvent.click(screen.getByText('open menu'));
    await waitForDocumentPointerDownListener();

    // An outside interaction dismisses the (higher) nested layer but must leave
    // the dialog open, since the dialog is not the top-most layer.
    firePointerMouseClick(screen.getByText('outside'));
    await waitForDocumentPointerDownListener();

    expect(onNestedLayerDismiss).toHaveBeenCalledTimes(1);
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(screen.getByText('open menu')).toBeInTheDocument();
  });
});

describe('Dialog.Trigger', () => {
  afterEach(cleanupModal);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLButtonElement>();
    const onClick = vi.fn();

    render(
      <Dialog.Root>
        <Dialog.Trigger
          ref={ref}
          data-testid="trigger"
          className="custom-class"
          style={{ outlineColor: 'rgb(1, 2, 3)' }}
          onClick={onClick}
        >
          Open
        </Dialog.Trigger>
      </Dialog.Root>,
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
      <Dialog.Root>
        <Dialog.Trigger
          asChild
          ref={ref}
          data-testid="trigger"
          className="custom-class"
          style={{ outlineColor: 'rgb(1, 2, 3)' }}
          onClick={onClick}
        >
          <button type="button">Open</button>
        </Dialog.Trigger>
      </Dialog.Root>,
    );

    const trigger = screen.getByTestId('trigger');
    expect(trigger.tagName).toBe('BUTTON');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveClass('custom-class');
    expect(trigger.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(trigger);

    fireEvent.click(trigger);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('Dialog.Overlay', () => {
  afterEach(cleanupModal);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <Dialog.Root defaultOpen>
        <Dialog.Portal>
          <Dialog.Overlay
            ref={ref}
            data-testid="overlay"
            className="custom-class"
            style={{ outlineColor: 'rgb(1, 2, 3)' }}
            onClick={onClick}
          />
        </Dialog.Portal>
      </Dialog.Root>,
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
      <Dialog.Root defaultOpen>
        <Dialog.Portal>
          <Dialog.Overlay
            asChild
            ref={ref}
            data-testid="overlay"
            className="custom-class"
            style={{ outlineColor: 'rgb(1, 2, 3)' }}
            onClick={onClick}
          >
            <article />
          </Dialog.Overlay>
        </Dialog.Portal>
      </Dialog.Root>,
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

describe('Dialog.Content', () => {
  afterEach(cleanupModal);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <Dialog.Root defaultOpen>
        <Dialog.Portal>
          <Dialog.Content
            ref={ref}
            data-testid="content"
            className="custom-class"
            style={{ outlineColor: 'rgb(1, 2, 3)' }}
            onClick={onClick}
          >
            <Dialog.Title>Title</Dialog.Title>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>,
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
      <Dialog.Root defaultOpen>
        <Dialog.Portal>
          <Dialog.Content
            asChild
            ref={ref}
            data-testid="content"
            className="custom-class"
            style={{ outlineColor: 'rgb(1, 2, 3)' }}
            onClick={onClick}
          >
            <article>
              <Dialog.Title>Title</Dialog.Title>
            </article>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>,
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

  // A non-modal dialog renders a different tree: no overlay, no scroll lock,
  // and an untrapped focus scope, so it needs covering separately.
  it('forwards props to the child element when `asChild` is set on a non-modal dialog', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <Dialog.Root defaultOpen modal={false}>
        <Dialog.Portal>
          <Dialog.Content
            asChild
            ref={ref}
            data-testid="content"
            className="custom-class"
            style={{ outlineColor: 'rgb(1, 2, 3)' }}
            onClick={onClick}
          >
            <article>
              <Dialog.Title>Title</Dialog.Title>
            </article>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>,
    );

    const content = screen.getByTestId('content');
    expect(content.tagName).toBe('ARTICLE');
    expect(content).toHaveAttribute('role', 'dialog');
    expect(content).toHaveClass('custom-class');
    expect(content.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(content);

    fireEvent.click(content);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('Dialog.Title', () => {
  afterEach(cleanupModal);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLHeadingElement>();
    const onClick = vi.fn();

    render(
      <Dialog.Root defaultOpen>
        <Dialog.Portal>
          <Dialog.Content>
            <Dialog.Title
              ref={ref}
              data-testid="title"
              className="custom-class"
              style={{ outlineColor: 'rgb(1, 2, 3)' }}
              onClick={onClick}
            >
              Title
            </Dialog.Title>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>,
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
      <Dialog.Root defaultOpen>
        <Dialog.Portal>
          <Dialog.Content>
            <Dialog.Title
              asChild
              ref={ref}
              data-testid="title"
              className="custom-class"
              style={{ outlineColor: 'rgb(1, 2, 3)' }}
              onClick={onClick}
            >
              <article>Title</article>
            </Dialog.Title>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>,
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

describe('Dialog.Description', () => {
  afterEach(cleanupModal);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLParagraphElement>();
    const onClick = vi.fn();

    render(
      <Dialog.Root defaultOpen>
        <Dialog.Portal>
          <Dialog.Content>
            <Dialog.Title>Title</Dialog.Title>
            <Dialog.Description
              ref={ref}
              data-testid="description"
              className="custom-class"
              style={{ outlineColor: 'rgb(1, 2, 3)' }}
              onClick={onClick}
            >
              Description
            </Dialog.Description>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>,
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
      <Dialog.Root defaultOpen>
        <Dialog.Portal>
          <Dialog.Content>
            <Dialog.Title>Title</Dialog.Title>
            <Dialog.Description
              asChild
              ref={ref}
              data-testid="description"
              className="custom-class"
              style={{ outlineColor: 'rgb(1, 2, 3)' }}
              onClick={onClick}
            >
              <article>Description</article>
            </Dialog.Description>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>,
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

describe('Dialog.Close', () => {
  afterEach(cleanupModal);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLButtonElement>();
    const onClick = vi.fn();

    render(
      <Dialog.Root defaultOpen>
        <Dialog.Portal>
          <Dialog.Content>
            <Dialog.Title>Title</Dialog.Title>
            <Dialog.Close
              ref={ref}
              data-testid="close"
              className="custom-class"
              style={{ outlineColor: 'rgb(1, 2, 3)' }}
              onClick={onClick}
            >
              Close
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>,
    );

    const close = screen.getByTestId('close');
    expect(close).toHaveClass('custom-class');
    expect(close.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(close);

    fireEvent.click(close);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<HTMLButtonElement>();
    const onClick = vi.fn();

    render(
      <Dialog.Root defaultOpen>
        <Dialog.Portal>
          <Dialog.Content>
            <Dialog.Title>Title</Dialog.Title>
            <Dialog.Close
              asChild
              ref={ref}
              data-testid="close"
              className="custom-class"
              style={{ outlineColor: 'rgb(1, 2, 3)' }}
              onClick={onClick}
            >
              <button type="button">Close</button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>,
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

function cleanupModal() {
  cleanup();
  // Modal dialogs set this on the `body` and only restore it on close.
  document.body.style.pointerEvents = '';
}
