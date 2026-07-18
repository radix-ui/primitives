import * as React from 'react';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import * as Tooltip from './tooltip';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, it, expect, vi } from 'vitest';

describe('Tooltip', () => {
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

  // Regression test for https://github.com/radix-ui/primitives/issues/3034
  // Content children must be mounted to the DOM a single time so that their
  // effects (analytics, fetches, etc.) do not run twice.
  it('mounts content children a single time', async () => {
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
  // When `aria-label` is provided, the accessible description comes from a
  // visually hidden element while `children` still mount a single time.
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

  // A consumer-provided `id` on the content must stay in sync with the
  // trigger's `aria-describedby` so the accessible description resolves.
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
  // When both `aria-label` and a custom `id` are provided, the id must live on
  // a single element so it is not duplicated in the DOM and the trigger's
  // `aria-describedby` resolves to the accessible label rather than the visible
  // children.
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

  // Regression test for https://github.com/radix-ui/primitives/issues/2375
  // Hovering a trigger inside a shared `TooltipProvider` must not re-render
  // sibling tooltips. The provider keeps its "open delayed" flag in a ref so
  // that opening one tooltip does not change the shared provider context value.
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

  // Regression tests for https://github.com/radix-ui/primitives/issues/2248
  // A trigger can receive focus without the user directly interacting with
  // it, e.g. when a `Popover` or `Dialog` auto-focuses its content on open
  // and the trigger happens to be the first focusable descendant. The
  // tooltip should only open for focus that genuinely originates from the
  // user (such as keyboard navigation), not from that kind of programmatic
  // focus transfer.
  describe('focus origin', () => {
    it('does not open when the trigger is focused programmatically', async () => {
      render(
        <Tooltip.Provider>
          <Tooltip.Root delayDuration={0}>
            <Tooltip.Trigger>Tooltip Trigger</Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content>Tooltip Content</Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Tooltip.Provider>,
      );

      const trigger = screen.getByText('Tooltip Trigger');

      // Simulates what a parent like `Popover.Content`'s auto-focus does: a
      // plain, non-keyboard-driven `element.focus()` call.
      act(() => trigger.focus());
      expect(trigger).toHaveFocus();

      // Give any (regressed) open timers a chance to run.
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(screen.queryByText('Tooltip Content')).not.toBeInTheDocument();
      expect(trigger).toHaveAttribute('data-state', 'closed');

      // Avoid leaking a focused-but-detached element into the next test's
      // `:focus-visible` tracking once this tree unmounts.
      act(() => trigger.blur());
    });

    it('still opens when the trigger is focused via keyboard navigation', async () => {
      render(
        <Tooltip.Provider>
          <Tooltip.Root delayDuration={0}>
            <Tooltip.Trigger>Tooltip Trigger</Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content>Tooltip Content</Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Tooltip.Provider>,
      );

      const user = userEvent.setup();
      await user.tab();

      const trigger = screen.getByText('Tooltip Trigger');
      expect(trigger).toHaveFocus();

      await waitFor(() => {
        expect(screen.getByText('Tooltip Content')).toBeVisible();
      });
      expect(trigger).toHaveAttribute('data-state', 'instant-open');

      // Avoid leaking a focused-but-detached element into the next test's
      // `:focus-visible` tracking once this tree unmounts.
      act(() => trigger.blur());
    });

    it('still closes on blur after a genuine keyboard focus', async () => {
      render(
        <Tooltip.Provider>
          <Tooltip.Root delayDuration={0}>
            <Tooltip.Trigger>Tooltip Trigger</Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content>Tooltip Content</Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
          <button>Next</button>
        </Tooltip.Provider>,
      );

      const user = userEvent.setup();
      await user.tab();
      await waitFor(() => {
        expect(screen.getByText('Tooltip Content')).toBeVisible();
      });

      await user.tab();
      await waitFor(() => {
        expect(screen.queryByText('Tooltip Content')).not.toBeInTheDocument();
      });
    });
  });

  describe('skipDelayDuration', () => {
    function renderTwoTriggers(providerProps: Omit<Tooltip.TooltipProviderProps, 'children'>) {
      render(
        <Tooltip.Provider {...providerProps}>
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
      return {
        triggerA: screen.getByText('Trigger A'),
        triggerB: screen.getByText('Trigger B'),
      };
    }

    it('skips the delay when moving between triggers within skipDelayDuration', () => {
      vi.useFakeTimers();
      try {
        const { triggerA, triggerB } = renderTwoTriggers({
          delayDuration: 100,
          skipDelayDuration: 300,
        });

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
        const { triggerA, triggerB } = renderTwoTriggers({
          delayDuration: 100,
          skipDelayDuration: 0,
        });

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
});
