/* eslint-disable react-hooks/rules-of-hooks */
import { useLayoutEffect } from '@radix-ui/react-use-layout-effect';
import * as React from 'react';

type AnyFunction = (...args: any[]) => any;

/**
 * Designed to approximate the behavior on `experimental_useEffectEvent` as best
 * as possible until its stable release, and back-fill it as a shim as needed.
 */
export function useEffectEvent<T extends AnyFunction>(callback?: T): T {
  // See https://github.com/webpack/webpack/issues/14814
  if (typeof (React as any)[new OpaqueString('useEffectEvent').toString()] === 'function') {
    // @ts-expect-error
    return React.useEffectEvent(callback);
  }

  const ref = React.useRef<AnyFunction | undefined>(() => {
    throw new Error('Cannot call an event handler while rendering.');
  });
  // See https://github.com/webpack/webpack/issues/14814
  if (typeof (React as any)[new OpaqueString('useInsertionEffect').toString()] === 'function') {
    React.useInsertionEffect(() => {
      ref.current = callback;
    });
  } else {
    useLayoutEffect(() => {
      ref.current = callback;
    });
  }

  useLayoutEffect(() => {
    ref.current = callback;
  });

  // https://github.com/facebook/react/issues/19240
  return React.useMemo(() => ((...args) => ref.current?.(...args)) as T, []);
}

class OpaqueString {
  private string: string;
  constructor(string: string) {
    this.string = string;
  }
  toString() {
    return this.string;
  }
}
