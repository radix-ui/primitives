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
      // Get the first instance of the tooltip content because the second is
      // the visually hidden primitive.
      expect(screen.queryAllByText('Tooltip Content')[0]).toBeVisible();
    });
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
      // Get the first instance of the tooltip content because the second is
      // the visually hidden primitive.
      expect(screen.queryAllByText('Tooltip Content')[0]).toBeVisible();
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
