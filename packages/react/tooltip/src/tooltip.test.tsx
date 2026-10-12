import * as React from 'react';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import * as Tooltip from './tooltip';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, it, expect, vi } from 'vitest';

describe('Tooltip rendering', () => {
  afterEach(cleanup);

  it('renders tooltip trigger', () => {
    render(
      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger>Tooltip Trigger</Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content>
              Tooltip Content
              <Tooltip.Arrow />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>,
    );

    expect(screen.getByText('Tooltip Trigger')).toBeInTheDocument();
    expect(screen.queryByText('Tooltip Content')).not.toBeInTheDocument();
  });

  it('renders tooltip content when trigger is hovered', async () => {
    render(
      <Tooltip.Provider>
        <Tooltip.Root delayDuration={0}>
          <Tooltip.Trigger>Tooltip Trigger</Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content>
              Tooltip Content
              <Tooltip.Arrow />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>,
    );

    const trigger = screen.getByText('Tooltip Trigger');
    expect(screen.queryByText('Tooltip Content')).not.toBeInTheDocument();

    userEvent.hover(trigger);
    await waitFor(() => {
      expect(screen.getByText('Tooltip Content')).toBeVisible();
    });
  });

  // Regression test for https://github.com/radix-ui/primitives/issues/2598
  it('appends the tooltip id to an existing aria-describedby', async () => {
    render(
      <Tooltip.Provider>
        <Tooltip.Root delayDuration={0}>
          <Tooltip.Trigger aria-describedby="existing-description">Tooltip Trigger</Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content id="tooltip-description">Tooltip Content</Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
        <span id="existing-description">Existing description</span>
      </Tooltip.Provider>,
    );

    const trigger = screen.getByText('Tooltip Trigger');
    expect(trigger).toHaveAttribute('aria-describedby', 'existing-description');

    await userEvent.hover(trigger);
    await waitFor(() => {
      expect(trigger).toHaveAttribute(
        'aria-describedby',
        'existing-description tooltip-description',
      );
    });

    await userEvent.click(trigger);
    await waitFor(() => {
      expect(trigger).toHaveAttribute('aria-describedby', 'existing-description');
    });
  });

  it('normalizes and deduplicates aria-describedby ids when the tooltip opens', async () => {
    render(
      <Tooltip.Provider>
        <Tooltip.Root delayDuration={0}>
          <Tooltip.Trigger
            aria-describedby={' existing-description\texisting-description tooltip-description '}
          >
            Tooltip Trigger
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content id="tooltip-description">Tooltip Content</Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>,
    );

    const trigger = screen.getByText('Tooltip Trigger');
    await userEvent.hover(trigger);
    await waitFor(() => {
      expect(trigger).toHaveAttribute(
        'aria-describedby',
        'existing-description tooltip-description',
      );
    });
  });

  // Regression test for https://github.com/radix-ui/primitives/issues/2598
  it('appends the tooltip id to aria-describedby on an asChild trigger', async () => {
    render(
      <Tooltip.Provider>
        <Tooltip.Root delayDuration={0}>
          <Tooltip.Trigger asChild>
            <button aria-describedby="existing-description">Tooltip Trigger</button>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content id="tooltip-description">Tooltip Content</Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
        <span id="existing-description">Existing description</span>
      </Tooltip.Provider>,
    );

    const trigger = screen.getByText('Tooltip Trigger');
    expect(trigger).toHaveAttribute('aria-describedby', 'existing-description');

    await userEvent.hover(trigger);
    await waitFor(() => {
      expect(trigger).toHaveAttribute(
        'aria-describedby',
        'existing-description tooltip-description',
      );
    });

    await userEvent.click(trigger);
    await waitFor(() => {
      expect(trigger).toHaveAttribute('aria-describedby', 'existing-description');
    });
  });

  // Regression test for https://github.com/radix-ui/primitives/issues/3034
  it('does not duplicate content children', async () => {
    const onMount = vi.fn();

    function Child() {
      React.useEffect(() => {
        onMount();
      }, []);
      return <span>Tooltip Content</span>;
    }

    render(
      <Tooltip.Provider>
        <Tooltip.Root delayDuration={0}>
          <Tooltip.Trigger>Tooltip Trigger</Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content>
              <Child />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>,
    );

    userEvent.hover(screen.getByText('Tooltip Trigger'));
    await waitFor(() => {
      expect(screen.getByText('Tooltip Content')).toBeVisible();
    });

    expect(screen.getAllByText('Tooltip Content')).toHaveLength(1);
    expect(onMount).toHaveBeenCalledTimes(1);
  });

  // Regression test for https://github.com/radix-ui/primitives/issues/3034
  it('uses aria-label without duplicating content children', async () => {
    const onMount = vi.fn();

    function Child() {
      React.useEffect(() => {
        onMount();
      }, []);
      return <span>Tooltip Content</span>;
    }

    render(
      <Tooltip.Provider>
        <Tooltip.Root delayDuration={0}>
          <Tooltip.Trigger>Tooltip Trigger</Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content aria-label="Accessible label">
              <Child />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>,
    );

    userEvent.hover(screen.getByText('Tooltip Trigger'));
    await waitFor(() => {
      expect(screen.getByText('Tooltip Content')).toBeVisible();
    });

    expect(screen.getAllByText('Tooltip Content')).toHaveLength(1);
    expect(onMount).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('tooltip')).toHaveTextContent('Accessible label');
  });

  it('keeps aria-describedby in sync with a custom content id', async () => {
    render(
      <Tooltip.Provider>
        <Tooltip.Root delayDuration={0}>
          <Tooltip.Trigger>Tooltip Trigger</Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content id="custom-id">Tooltip Content</Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>,
    );

    const trigger = screen.getByText('Tooltip Trigger');
    userEvent.hover(trigger);
    await waitFor(() => {
      expect(trigger).toHaveAttribute('aria-describedby', 'custom-id');
      expect(screen.getByRole('tooltip')).toHaveAttribute('id', 'custom-id');
    });
  });

  // Regression test for https://github.com/radix-ui/primitives/issues/3034
  it('keeps a custom id unique when combined with aria-label', async () => {
    render(
      <Tooltip.Provider>
        <Tooltip.Root delayDuration={0}>
          <Tooltip.Trigger>Tooltip Trigger</Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content aria-label="Accessible label" id="custom-id">
              Tooltip Content
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>,
    );

    const trigger = screen.getByText('Tooltip Trigger');
    userEvent.hover(trigger);
    await waitFor(() => {
      expect(screen.getByText('Tooltip Content')).toBeVisible();
    });

    // The id must not be duplicated across the visible content and the
    // visually hidden description.
    expect(document.querySelectorAll('#custom-id')).toHaveLength(1);

    // `aria-describedby` must resolve to the accessible label, not the visible
    // children.
    expect(trigger).toHaveAttribute('aria-describedby', 'custom-id');
    const description = document.getElementById('custom-id');
    expect(description).toHaveAttribute('role', 'tooltip');
    expect(description).toHaveTextContent('Accessible label');
    expect(description).not.toHaveTextContent('Tooltip Content');
  });

  it('renders tooltip content is dismissed when trigger is clicked', async () => {
    render(
      <Tooltip.Provider>
        <Tooltip.Root delayDuration={0}>
          <Tooltip.Trigger>Tooltip Trigger</Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content>
              Tooltip Content
              <Tooltip.Arrow />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>,
    );

    const trigger = screen.getByText('Tooltip Trigger');
    expect(screen.queryByText('Tooltip Content')).not.toBeInTheDocument();

    userEvent.hover(trigger);
    await waitFor(() => {
      expect(screen.getByText('Tooltip Content')).toBeVisible();
    });

    userEvent.click(trigger);
    await waitFor(() => {
      expect(screen.queryByText('Tooltip Content')).not.toBeInTheDocument();
    });
  });
});

describe('Tooltip behavior', () => {
  afterEach(cleanup);

  // Regression test for https://github.com/radix-ui/primitives/issues/2375
  it('hovering one tooltip does not re-render sibling tooltips', async () => {
    const commitCounts: Record<string, number> = {};

    function ProfiledTooltip({ id }: { id: string }) {
      return (
        <React.Profiler
          id={id}
          onRender={() => {
            commitCounts[id] = (commitCounts[id] ?? 0) + 1;
          }}
        >
          <Tooltip.Root delayDuration={0}>
            <Tooltip.Trigger>Trigger {id}</Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content>Content {id}</Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </React.Profiler>
      );
    }

    render(
      <Tooltip.Provider>
        <ProfiledTooltip id="a" />
        <ProfiledTooltip id="b" />
        <ProfiledTooltip id="c" />
      </Tooltip.Provider>,
    );

    const initial = { ...commitCounts };

    await userEvent.hover(screen.getByText('Trigger a'));
    await waitFor(() => {
      expect(screen.queryAllByText('Content a')[0]).toBeVisible();
    });

    // Sanity check: the hovered tooltip must actually re-render, otherwise the
    // assertions below would pass trivially.
    expect(commitCounts.a! - initial.a!).toBeGreaterThan(0);
    // The unrelated tooltips must not re-render at all.
    expect(commitCounts.b! - initial.b!).toBe(0);
    expect(commitCounts.c! - initial.c!).toBe(0);
  });

  it('skips the delay when moving between triggers within skipDelayDuration', () => {
    vi.useFakeTimers();
    try {
      render(
        <Tooltip.Provider delayDuration={100} skipDelayDuration={300}>
          <Tooltip.Root>
            <Tooltip.Trigger>Trigger A</Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content>Content A</Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
          <Tooltip.Root>
            <Tooltip.Trigger>Trigger B</Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content>Content B</Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Tooltip.Provider>,
      );
      const triggerA = screen.getByText('Trigger A');
      const triggerB = screen.getByText('Trigger B');

      // Hovering the first trigger opens it only after the delay elapses
      act(() => void fireEvent.pointerMove(triggerA));
      expect(triggerA).toHaveAttribute('data-state', 'closed');
      act(() => void vi.advanceTimersByTime(100));
      expect(triggerA).toHaveAttribute('data-state', 'delayed-open');

      act(() => void fireEvent.click(triggerA));

      // Moving to the second trigger within the skip window opens instantly
      act(() => void fireEvent.pointerMove(triggerB));
      expect(triggerB).toHaveAttribute('data-state', 'instant-open');
    } finally {
      vi.useRealTimers();
    }
  });

  // Regression test for https://github.com/radix-ui/primitives/issues/3873
  it('does not skip the delay when skipDelayDuration is 0', () => {
    vi.useFakeTimers();
    try {
      render(
        <Tooltip.Provider delayDuration={100} skipDelayDuration={0}>
          <Tooltip.Root>
            <Tooltip.Trigger>Trigger A</Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content>Content A</Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
          <Tooltip.Root>
            <Tooltip.Trigger>Trigger B</Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content>Content B</Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Tooltip.Provider>,
      );

      const triggerA = screen.getByText('Trigger A');
      const triggerB = screen.getByText('Trigger B');

      act(() => void fireEvent.pointerMove(triggerA));
      act(() => void vi.advanceTimersByTime(100));
      expect(triggerA).toHaveAttribute('data-state', 'delayed-open');
      act(() => void fireEvent.click(triggerA));

      // Moving to the second trigger must NOT open it instantly
      act(() => void fireEvent.pointerMove(triggerB));
      expect(triggerB).toHaveAttribute('data-state', 'closed');

      act(() => void vi.advanceTimersByTime(100));
      expect(triggerB).toHaveAttribute('data-state', 'delayed-open');
    } finally {
      vi.useRealTimers();
    }
  });
});

describe('Tooltip.Trigger', () => {
  afterEach(cleanup);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLButtonElement>();
    const onClick = vi.fn();

    render(
      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger
            ref={ref}
            data-testid="trigger"
            className="custom-class"
            style={{ outlineColor: 'rgb(1, 2, 3)' }}
            onClick={onClick}
          >
            Trigger
          </Tooltip.Trigger>
        </Tooltip.Root>
      </Tooltip.Provider>,
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
      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger
            asChild
            ref={ref}
            data-testid="trigger"
            className="custom-class"
            style={{ outlineColor: 'rgb(1, 2, 3)' }}
            onClick={onClick}
          >
            <button type="button">Trigger</button>
          </Tooltip.Trigger>
        </Tooltip.Root>
      </Tooltip.Provider>,
    );

    const trigger = screen.getByTestId('trigger');
    expect(trigger.tagName).toBe('BUTTON');
    expect(trigger).toHaveAttribute('data-state', 'closed');
    expect(trigger).toHaveClass('custom-class');
    expect(trigger.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(trigger);

    fireEvent.click(trigger);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('Tooltip.Content', () => {
  afterEach(cleanup);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <Tooltip.Provider>
        <Tooltip.Root open>
          <Tooltip.Trigger>Trigger</Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content
              ref={ref}
              data-testid="content"
              className="custom-class"
              style={{ outlineColor: 'rgb(1, 2, 3)' }}
              onClick={onClick}
            >
              Content
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>,
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
      <Tooltip.Provider>
        <Tooltip.Root open>
          <Tooltip.Trigger>Trigger</Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content
              asChild
              ref={ref}
              data-testid="content"
              className="custom-class"
              style={{ outlineColor: 'rgb(1, 2, 3)' }}
              onClick={onClick}
            >
              <article>Content</article>
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>,
    );

    const content = screen.getByTestId('content');
    expect(content.tagName).toBe('ARTICLE');
    expect(content).toHaveAttribute('role', 'tooltip');
    expect(content).toHaveAttribute('data-state', 'instant-open');
    expect(content).toHaveClass('custom-class');
    expect(content.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(content);

    fireEvent.click(content);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('Tooltip.Arrow', () => {
  afterEach(cleanup);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<SVGSVGElement>();
    const onClick = vi.fn();

    render(
      <Tooltip.Provider>
        <Tooltip.Root open>
          <Tooltip.Trigger>Trigger</Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content>
              Content
              <Tooltip.Arrow
                ref={ref}
                data-testid="arrow"
                className="custom-class"
                style={{ outlineColor: 'rgb(1, 2, 3)' }}
                onClick={onClick}
              />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>,
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
      <Tooltip.Provider>
        <Tooltip.Root open>
          <Tooltip.Trigger>Trigger</Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content>
              Content
              <Tooltip.Arrow
                asChild
                ref={ref}
                data-testid="arrow"
                className="custom-class"
                style={{ outlineColor: 'rgb(1, 2, 3)' }}
                onClick={onClick}
              >
                <svg />
              </Tooltip.Arrow>
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>,
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
