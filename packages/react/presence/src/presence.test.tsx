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
