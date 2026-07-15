import * as React from 'react';
import { axe } from 'vitest-axe';
import type { RenderResult } from '@testing-library/react';
import { render, fireEvent, cleanup, screen } from '@testing-library/react';
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
  afterEach(() => {
    cleanup();
    document.body.style.pointerEvents = '';
  });

  it('should restore `body` pointer-events after closing', () => {
    const { getByText } = render(<DialogTest />);
    expect(document.body.style.pointerEvents).toBe('');
    fireEvent.click(getByText(OPEN_TEXT));
    expect(document.body.style.pointerEvents).toBe('none');
    fireEvent.click(getByText(CLOSE_TEXT));
    expect(document.body.style.pointerEvents).toBe('');
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

  afterEach(() => {
    cleanup();
    document.body.style.pointerEvents = '';
  });

  it('should restore `body` pointer-events after both close', () => {
    render(<TwoDialogsTest />);
    expect(document.body.style.pointerEvents).toBe('none');
    fireEvent.click(screen.getByText('close-a'));
    fireEvent.click(screen.getByText('close-b'));
    expect(document.body.style.pointerEvents).toBe('');
  });
});
