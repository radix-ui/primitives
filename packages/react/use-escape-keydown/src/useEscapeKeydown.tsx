import * as React from 'react';
import { useCallbackRef } from '@radix-ui/react-use-callback-ref';

/**
 * Listens for when the escape key is down
 */
function useEscapeKeydown(onEscapeKeyDownProp?: (event: KeyboardEvent) => void) {
  const onEscapeKeyDown = useCallbackRef(onEscapeKeyDownProp);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onEscapeKeyDown(event);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onEscapeKeyDown]);
}

export { useEscapeKeydown };
