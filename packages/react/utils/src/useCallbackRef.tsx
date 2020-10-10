import * as React from 'react';

/**
 * A custom hook that converts a callback to a ref
 * to avoid triggering re-renders when passed as a prop
 * or avoid re-executing effects when passed as a dependency
 */
export function useCallbackRef<T extends (...args: any[]) => any>(callback?: T): T {
  const callbackRef = React.useRef(callback);

  React.useEffect(() => {
    callbackRef.current = callback;
  });

  return React.useCallback(
    ((...args) => {
      callbackRef.current?.(...args);
    }) as T,
    []
  );
}
