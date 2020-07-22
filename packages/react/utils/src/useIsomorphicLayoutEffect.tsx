import * as React from 'react';
import { canUseDOM } from '@interop-ui/utils';

/**
 * A version of `React.useLayoutEffect` which falls back to `React.useEffect`
 * on the server as `React.useLayoutEffect` does nothing on the server.
 */
export const useIsomorphicLayoutEffect = canUseDOM() ? React.useLayoutEffect : React.useEffect;
