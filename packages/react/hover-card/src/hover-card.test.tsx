import * as React from 'react';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import * as HoverCard from './hover-card';
import { afterEach, describe, it, expect, vi } from 'vitest';

function renderHoverCard(props?: HoverCard.HoverCardProps) {
  render(
    <HoverCard.Root openDelay={700} closeDelay={300} {...props}>
      <HoverCard.Trigger>Trigger</HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content>Content</HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>,
  );
  return { trigger: screen.getByText('Trigger') };
}

describe('HoverCard', () => {
  afterEach(cleanup);

  // Regression test for https://github.com/radix-ui/primitives/issues/1248
  it('does not open when leaving the trigger before the open delay elapses', () => {
    vi.useFakeTimers();
    try {
      const { trigger } = renderHoverCard();

      // Enter the trigger, then leave before the open delay finishes.
      act(() => void fireEvent.pointerEnter(trigger, { pointerType: 'mouse' }));
      act(() => void vi.advanceTimersByTime(300));
      act(() => void fireEvent.pointerLeave(trigger, { pointerType: 'mouse' }));

      // Advance well past the original open delay.
      act(() => void vi.advanceTimersByTime(1000));

      expect(screen.queryByText('Content')).not.toBeInTheDocument();
      expect(trigger).toHaveAttribute('data-state', 'closed');
    } finally {
      vi.useRealTimers();
    }
  });

  it('opens after the open delay when the trigger stays hovered', () => {
    vi.useFakeTimers();
    try {
      const { trigger } = renderHoverCard();

      act(() => void fireEvent.pointerEnter(trigger, { pointerType: 'mouse' }));
      expect(screen.queryByText('Content')).not.toBeInTheDocument();

      act(() => void vi.advanceTimersByTime(700));
      expect(screen.getByText('Content')).toBeVisible();
    } finally {
      vi.useRealTimers();
    }
  });

  it('closes after the close delay when leaving an open trigger', () => {
    vi.useFakeTimers();
    try {
      const { trigger } = renderHoverCard();

      act(() => void fireEvent.pointerEnter(trigger, { pointerType: 'mouse' }));
      act(() => void vi.advanceTimersByTime(700));
      expect(screen.getByText('Content')).toBeVisible();

      act(() => void fireEvent.pointerLeave(trigger, { pointerType: 'mouse' }));
      act(() => void vi.advanceTimersByTime(300));
      expect(screen.queryByText('Content')).not.toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  // Regression test for https://github.com/radix-ui/primitives/issues/1248
  // Sweeping a pointer across a list of triggers without pausing on any of them
  // must not leave any card lingering open.
  it('does not leave a card open when sweeping across a list of triggers', () => {
    vi.useFakeTimers();
    try {
      render(
        <>
          {['A', 'B', 'C'].map((id) => (
            <HoverCard.Root key={id} openDelay={700} closeDelay={300}>
              <HoverCard.Trigger>Trigger {id}</HoverCard.Trigger>
              <HoverCard.Portal>
                <HoverCard.Content>Content {id}</HoverCard.Content>
              </HoverCard.Portal>
            </HoverCard.Root>
          ))}
        </>,
      );

      const triggers = ['A', 'B', 'C'].map((id) => screen.getByText(`Trigger ${id}`));

      // Move across each trigger, pausing less than the open delay on each.
      triggers.forEach((trigger) => {
        act(() => void fireEvent.pointerEnter(trigger, { pointerType: 'mouse' }));
        act(() => void vi.advanceTimersByTime(200));
        act(() => void fireEvent.pointerLeave(trigger, { pointerType: 'mouse' }));
      });

      act(() => void vi.advanceTimersByTime(1000));

      ['A', 'B', 'C'].forEach((id) => {
        expect(screen.queryByText(`Content ${id}`)).not.toBeInTheDocument();
      });
    } finally {
      vi.useRealTimers();
    }
  });
});

describe('HoverCard.Trigger', () => {
  afterEach(cleanup);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLAnchorElement>();
    const onClick = vi.fn();

    render(
      <HoverCard.Root>
        <HoverCard.Trigger
          ref={ref}
          data-testid="trigger"
          className="custom-class"
          style={{ outlineColor: 'rgb(1, 2, 3)' }}
          onClick={onClick}
        >
          Trigger
        </HoverCard.Trigger>
      </HoverCard.Root>,
    );

    const trigger = screen.getByTestId('trigger');
    expect(trigger).toHaveClass('custom-class');
    expect(trigger.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(trigger);

    fireEvent.click(trigger);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<HTMLAnchorElement>();
    const onClick = vi.fn();

    render(
      <HoverCard.Root>
        <HoverCard.Trigger
          asChild
          ref={ref}
          data-testid="trigger"
          className="custom-class"
          style={{ outlineColor: 'rgb(1, 2, 3)' }}
          onClick={onClick}
        >
          <article>Trigger</article>
        </HoverCard.Trigger>
      </HoverCard.Root>,
    );

    const trigger = screen.getByTestId('trigger');
    expect(trigger.tagName).toBe('ARTICLE');
    expect(trigger).toHaveAttribute('data-state', 'closed');
    expect(trigger).toHaveClass('custom-class');
    expect(trigger.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(trigger);

    fireEvent.click(trigger);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('HoverCard.Content', () => {
  afterEach(cleanup);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <HoverCard.Root open>
        <HoverCard.Trigger>Trigger</HoverCard.Trigger>
        <HoverCard.Portal>
          <HoverCard.Content
            ref={ref}
            data-testid="content"
            className="custom-class"
            style={{ outlineColor: 'rgb(1, 2, 3)' }}
            onClick={onClick}
          >
            Content
          </HoverCard.Content>
        </HoverCard.Portal>
      </HoverCard.Root>,
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
      <HoverCard.Root open>
        <HoverCard.Trigger>Trigger</HoverCard.Trigger>
        <HoverCard.Portal>
          <HoverCard.Content
            asChild
            ref={ref}
            data-testid="content"
            className="custom-class"
            style={{ outlineColor: 'rgb(1, 2, 3)' }}
            onClick={onClick}
          >
            <article>Content</article>
          </HoverCard.Content>
        </HoverCard.Portal>
      </HoverCard.Root>,
    );

    const content = screen.getByTestId('content');
    expect(content.tagName).toBe('ARTICLE');
    expect(content).toHaveAttribute('data-state', 'open');
    expect(content).toHaveAttribute('data-side', 'bottom');
    expect(content).toHaveClass('custom-class');
    expect(content.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(content);

    fireEvent.click(content);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('HoverCard.Arrow', () => {
  afterEach(cleanup);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<SVGSVGElement>();
    const onClick = vi.fn();

    render(
      <HoverCard.Root open>
        <HoverCard.Trigger>Trigger</HoverCard.Trigger>
        <HoverCard.Portal>
          <HoverCard.Content>
            Content
            <HoverCard.Arrow
              ref={ref}
              data-testid="arrow"
              className="custom-class"
              style={{ outlineColor: 'rgb(1, 2, 3)' }}
              onClick={onClick}
            />
          </HoverCard.Content>
        </HoverCard.Portal>
      </HoverCard.Root>,
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
      <HoverCard.Root open>
        <HoverCard.Trigger>Trigger</HoverCard.Trigger>
        <HoverCard.Portal>
          <HoverCard.Content>
            Content
            <HoverCard.Arrow
              asChild
              ref={ref}
              data-testid="arrow"
              className="custom-class"
              style={{ outlineColor: 'rgb(1, 2, 3)' }}
              onClick={onClick}
            >
              <svg />
            </HoverCard.Arrow>
          </HoverCard.Content>
        </HoverCard.Portal>
      </HoverCard.Root>,
    );

    const arrow = screen.getByTestId('arrow');
    expect(arrow.tagName).toBe('svg');
    expect(arrow).toHaveAttribute('viewBox', '0 0 30 10');
    expect(arrow).toHaveClass('custom-class');
    expect(arrow.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(arrow);

    fireEvent.click(arrow);
    expect(onClick).toHaveBeenCalled();
  });
});
