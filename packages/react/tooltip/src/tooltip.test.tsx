import * as React from 'react';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import * as Tooltip from './tooltip';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, it, expect } from 'vitest';

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
});
