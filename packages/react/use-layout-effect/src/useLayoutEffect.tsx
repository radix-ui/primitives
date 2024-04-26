// @deno-types="npm:@types/react@^18.2.0"
import * as React from "react";

/**
 * On the server, React emits a warning when calling `useLayoutEffect`.
 * This is because neither `useLayoutEffect` nor `useEffect` run on the server.
 * We use this safe version which suppresses the warning by replacing it with a noop on the server.
 *
 * See: https://reactjs.org/docs/hooks-reference.html#uselayouteffect
 */
const useLayoutEffect: (
  effect: React.EffectCallback,
  deps?: React.DependencyList | undefined,
) => void = Boolean(globalThis?.document) ? React.useLayoutEffect : () => {};

export { useLayoutEffect };
