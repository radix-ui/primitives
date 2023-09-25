import * as React from 'react';
import { useCallbackRef } from '@radix-ui/react-use-callback-ref';

function useDebounceCallback(callback: (...args: any[]) => void, delay: number) {
  const handleCallback = useCallbackRef(callback);
  const debounceTimerRef = React.useRef(0);

  React.useEffect(() => () => window.clearTimeout(debounceTimerRef.current), []);

  return React.useCallback(
    (...args: unknown[]) => {
      window.clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = window.setTimeout(() => {
        handleCallback(...args);
      }, delay);
    },
    [handleCallback, delay]
  );
}

export { useDebounceCallback };
