import * as React from 'react';

type AnyFunction = (...args: any[]) => any;

/**
 * Designed to approximate the behavior on `experimental_useEffectEvent` as best
 * as possible until its stable release, and back-fill it as a shim as needed.
 */
export function useEffectEvent<T extends AnyFunction>(callback?: T) {
  const ref = React.useRef<AnyFunction | undefined>(() => {
    throw new Error('Cannot call an event handler while rendering.');
  });
  // @ts-expect-error: See https://github.com/webpack/webpack/issues/14814
  if (typeof React['useInsertionEffect'.toString()] === 'function') {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    React.useInsertionEffect(() => {
      ref.current = callback;
    });
  } else {
    // Prior to React 18's concurrent rendering model, updating the ref during
    // render is safe enough for our the purpose of updating event handlers.
    ref.current = callback;
  }
  return React.useCallback<AnyFunction>((...args) => ref.current?.(...args), []) as T;
}
