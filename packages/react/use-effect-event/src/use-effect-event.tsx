/* eslint-disable react-hooks/rules-of-hooks */
import * as React from 'react';

type AnyFunction = (...args: any[]) => any;

// See https://github.com/webpack/webpack/issues/14814
const useReactEffectEvent = (React as any)[' useEffectEvent '.trim().toString()];

/**
 * Designed to approximate the behavior on `experimental_useEffectEvent` as best
 * as possible until its stable release, and back-fill it as a shim as needed.
 */
export function useEffectEvent<T extends AnyFunction>(callback?: T): T {
  if (typeof useReactEffectEvent === 'function') {
    return useReactEffectEvent(callback);
  }

  const ref = React.useRef<AnyFunction | undefined>(() => {
    throw new Error('Cannot call an event handler while rendering.');
  });

  // https://github.com/facebook/react/issues/19240
  return React.useMemo(() => ((...args) => ref.current?.(...args)) as T, []);
}
