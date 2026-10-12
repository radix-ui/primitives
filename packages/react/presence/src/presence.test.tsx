import * as React from 'react';
import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, it, expect } from 'vitest';
import { Presence } from './presence';

// Regression tests for https://github.com/radix-ui/primitives/issues/3664
describe('ref stability', () => {
  afterEach(cleanup);

  it('does not loop when the child has a stable ref', () => {
    let renderCount = 0;
    function App() {
      renderCount++;
      const ref = React.useRef<HTMLButtonElement>(null);
      return (
        <Presence present>
          <button type="button" ref={ref} />
        </Presence>
      );
    }
    expect(() => render(<App />)).not.toThrow();
    expect(renderCount).toBeLessThan(25);
  });

  it('does not loop when the child has an unstable callback ref that triggers a render on attach', () => {
    let renderCount = 0;
    function App() {
      renderCount++;
      const [, forceRender] = React.useReducer((c) => c + 1, 0);
      return (
        <Presence present>
          <button
            type="button"
            // Inline callback ref => new identity on every render
            ref={(node) => {
              if (node) forceRender();
            }}
          />
        </Presence>
      );
    }
    expect(() => render(<App />)).not.toThrow();
    expect(renderCount).toBeLessThan(25);
  });

  it('forwards the node to the child ref', () => {
    let received: HTMLElement | null = null;
    function App() {
      return (
        <Presence present>
          <button
            type="button"
            ref={(node) => {
              received = node;
            }}
          />
        </Presence>
      );
    }
    render(<App />);
    expect(received).toBeInstanceOf(HTMLButtonElement);
  });
});

describe('mount/unmount behavior', () => {
  afterEach(cleanup);

  it('renders the child when present is true', () => {
    const { queryByRole } = render(
      <Presence present>
        <button type="button">Hello</button>
      </Presence>,
    );
    expect(queryByRole('button')).not.toBeNull();
  });

  it('removes the child when present is false and no exit animation', () => {
    const { queryByRole, rerender } = render(
      <Presence present>
        <button type="button">Hello</button>
      </Presence>,
    );
    rerender(
      <Presence present={false}>
        <button type="button">Hello</button>
      </Presence>,
    );
    expect(queryByRole('button')).toBeNull();
  });

  it('keeps the child mounted when toggling present back to true', () => {
    const { queryByRole, rerender } = render(
      <Presence present>
        <button type="button">Hello</button>
      </Presence>,
    );
    rerender(
      <Presence present={false}>
        <button type="button">Hello</button>
      </Presence>,
    );
    rerender(
      <Presence present>
        <button type="button">Hello</button>
      </Presence>,
    );
    expect(queryByRole('button')).not.toBeNull();
  });
});

describe('render function children', () => {
  afterEach(cleanup);

  it('always renders the child when using a render function', () => {
    const { queryByRole, rerender } = render(
      <Presence present>
        {({ present }) => <button type="button">{present ? 'visible' : 'hidden'}</button>}
      </Presence>,
    );
    expect(queryByRole('button')).not.toBeNull();
    expect(queryByRole('button')!.textContent).toBe('visible');

    rerender(
      <Presence present={false}>
        {({ present }) => <button type="button">{present ? 'visible' : 'hidden'}</button>}
      </Presence>,
    );
    // render function variant force-mounts: element stays in DOM
    expect(queryByRole('button')).not.toBeNull();
    expect(queryByRole('button')!.textContent).toBe('hidden');
  });

  it('passes present=true to the render function when present prop is true', () => {
    let receivedPresent: boolean | undefined;
    render(
      <Presence present>
        {({ present }) => {
          receivedPresent = present;
          return <div />;
        }}
      </Presence>,
    );
    expect(receivedPresent).toBe(true);
  });
});
