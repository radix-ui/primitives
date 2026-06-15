import * as React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'vitest';

const DEFAULT_MAX_RENDERS = 25;

interface AssertStableComposedRefOptions {
  /**
   * The render count at which we consider the component to be stuck in a render
   * loop. Defaults to {@link DEFAULT_MAX_RENDERS}.
   */
  maxRenders?: number;
}

/**
 * Regression guard for unstable composed refs.
 * See https://github.com/radix-ui/primitives/issues/3963.
 *
 * Renders the component under test with a *stable* callback ref that forces a
 * re-render the first time it receives a node. If the component composes that
 * forwarded ref with an unstable member — e.g. an inline
 * `useComposedRefs(ref, (node) => setX(node))` or a render-inline
 * `composeRefs(...)` used directly as a `ref` — React 19 detaches and
 * re-attaches the ref on every commit. That re-runs our forced render forever
 * and throws "Maximum update depth exceeded". A correctly stabilized composed
 * ref settles after a couple of renders.
 *
 * @example
 * assertStableComposedRef((ref) => (
 *   <DismissableLayer.Root ref={ref}>
 *     <button type="button">inside</button>
 *   </DismissableLayer.Root>
 * ));
 */
export function assertStableComposedRef(
  renderWithRef: (ref: React.RefCallback<any>) => React.ReactElement,
  { maxRenders = DEFAULT_MAX_RENDERS }: AssertStableComposedRefOptions = {},
) {
  let renderCount = 0;

  function Probe() {
    renderCount++;
    const [, forceRender] = React.useReducer(() => Object.create(null), null);
    // The probe ref is intentionally stable (empty deps) so that any render loop
    // is caused by the component under test, not by this helper.
    const ref = React.useCallback((node: unknown) => {
      if (node) forceRender();
    }, []);
    return renderWithRef(ref);
  }

  expect(() => render(<Probe />)).not.toThrow();
  expect(
    renderCount,
    `Expected the component to settle, but it rendered ${renderCount} times ` +
      `(>= ${maxRenders}). This usually means a composed ref callback is being ` +
      `recreated on every render. Pass stable refs (e.g. state setters) directly ` +
      `to \`useComposedRefs\`, or wrap inline callbacks in \`useCallbackRef\`.`,
  ).toBeLessThan(maxRenders);
}
