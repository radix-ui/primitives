import * as React from 'react';
import { useCallbackRef } from '@radix-ui/react-use-callback-ref';
import { useDocument } from '@radix-ui/react-document-context';

/**
 * Listens for when the escape key is down
 */
function useEscapeKeydown(onEscapeKeyDownProp?: (event: KeyboardEvent) => void) {
  const providedDocument = useDocument();
  const onEscapeKeyDown = useCallbackRef(onEscapeKeyDownProp);

  React.useEffect(() => {
    if (!providedDocument) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onEscapeKeyDown(event);
      }
    };
    providedDocument.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => providedDocument.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [onEscapeKeyDown, providedDocument]);
}

export { useEscapeKeydown };
