/* eslint-disable react-hooks/rules-of-hooks */
import { useLayoutEffect } from '@radix-ui/react-use-layout-effect';
import * as React from 'react';

type AnyFunction = (...args: any[]) => any;

// See https://github.com/webpack/webpack/issues/14814
const useReactInsertionEffect = (React as any)[' useInsertionEffect '.trim().toString()];

/**
 * A custom hook that converts a callback to a ref to avoid triggering
 * re-renders when passed as a prop or avoid re-executing effects when passed as
 * a dependency.
 */
export function useCallbackRef<T extends AnyFunction>(callback: T | undefined): T {
  const callbackRef = React.useRef<AnyFunction | undefined>(callback);

  // See https://github.com/webpack/webpack/issues/14814
  if (typeof useReactInsertionEffect === 'function') {
    useReactInsertionEffect(() => {
      callbackRef.current = callback;
    });
  } else {
    useLayoutEffect(() => {
      callbackRef.current = callback;
    });
  }

  // https://github.com/facebook/react/issues/19240
  return React.useMemo(() => ((...args) => callbackRef.current?.(...args)) as T, []);
}
