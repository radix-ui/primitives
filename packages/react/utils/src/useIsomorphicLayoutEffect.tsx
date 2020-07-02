import * as React from 'react';

/**
 * A version of `React.useLayoutEffect` which falls back to `React.useEffect`
 * on the server as `React.useLayoutEffect` does nothing on the server.
 */
export const useIsomorphicLayoutEffect =
  typeof window === 'undefined' || typeof document === 'undefined'
    ? React.useEffect
    : React.useLayoutEffect;
