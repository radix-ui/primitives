import * as React from 'react';
import { act, cleanup, render } from '@testing-library/react';
import { afterEach, describe, it, expect } from 'vitest';
import { Slot } from './slot';

// Regression tests for https://github.com/radix-ui/primitives/issues/3799
describe('Slot ref stability', () => {
  afterEach(cleanup);
  it('does not cause an infinite render loop when attaching the ref triggers a render', () => {
    let renderCount = 0;

    function App() {
      renderCount++;
      const [, forceRender] = React.useReducer((c) => c + 1, 0);
      const ref = React.useCallback((node: HTMLElement | null) => {
        if (node) forceRender();
      }, []);

      return (
        <Slot ref={ref}>
          <button type="button">Click me</button>
        </Slot>
      );
    }

    expect(() => render(<App />)).not.toThrow();
    expect(renderCount).toBeLessThan(25);
  });

  it('passes a single stable composed ref to the child across re-renders', () => {
    const refIdentities = new Set<unknown>();
    let bump!: () => void;

    const Child = React.forwardRef<HTMLButtonElement>(function Child(_props, ref) {
      refIdentities.add(ref);
      return <button type="button" ref={ref} />;
    });

    function App() {
      const [, forceRender] = React.useReducer((c) => c + 1, 0);
      bump = forceRender;
      const forwardedRef = React.useRef<HTMLButtonElement>(null);
      return (
        <Slot ref={forwardedRef}>
          <Child />
        </Slot>
      );
    }

    render(<App />);
    act(() => bump());
    act(() => bump());
    expect(refIdentities.size).toBe(1);
  });
});
