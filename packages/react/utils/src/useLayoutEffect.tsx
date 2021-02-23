import * as React from 'react';
import { canUseDOM } from '@radix-ui/react-ssr';

/**
 * On the server, React emits a warning when calling `useLayoutEffect`.
 * This is because neither `useLayoutEffect` nor `useEffect` run on the server.
 * We use this safe version which suppresses the warning by replacing it with a noop on the server.
 *
 * See: https://reactjs.org/docs/hooks-reference.html#uselayouteffect
 */
export const useLayoutEffect = canUseDOM() ? React.useLayoutEffect : () => {};
