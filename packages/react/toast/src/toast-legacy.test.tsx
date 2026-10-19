import * as React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import * as Toast from './toast';

vi.mock('react', async (importOriginal) => {
  const react = await importOriginal<typeof React>();
  return { ...react, startTransition: undefined };
});

describe('Toast without React.startTransition', () => {
  afterEach(cleanup);

  it('renders an open toast into the viewport', () => {
    render(
      <Toast.Provider>
        <Toast.Root open duration={Infinity}>
          <Toast.Title>Saved</Toast.Title>
        </Toast.Root>
        <Toast.Viewport />
      </Toast.Provider>,
    );

    expect(screen.getByRole('listitem')).toHaveTextContent('Saved');
  });

  it('updates the viewport when toasts are added and removed', () => {
    function App({ showToast }: { showToast: boolean }) {
      return (
        <Toast.Provider>
          {showToast && (
            <Toast.Root open duration={Infinity}>
              <Toast.Title>Saved</Toast.Title>
            </Toast.Root>
          )}
          <Toast.Viewport />
        </Toast.Provider>
      );
    }

    const { rerender } = render(<App showToast={false} />);
    const region = screen.getByRole('region');
    expect(region.style.pointerEvents).toBe('none');

    rerender(<App showToast />);
    expect(screen.getByRole('listitem')).toHaveTextContent('Saved');
    expect(region.style.pointerEvents).toBe('');

    rerender(<App showToast={false} />);
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
    expect(region.style.pointerEvents).toBe('none');
  });
});
