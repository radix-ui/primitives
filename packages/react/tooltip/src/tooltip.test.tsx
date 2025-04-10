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
      </Tooltip.Provider>
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
      </Tooltip.Provider>
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
      </Tooltip.Provider>
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
});
