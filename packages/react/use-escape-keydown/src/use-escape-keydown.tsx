import * as React from 'react';
import { useCallbackRef } from '@radix-ui/react-use-callback-ref';
import { useDocument } from '@radix-ui/react-document-context';

/**
 * Listens for when the escape key is down
 */
function useEscapeKeydown(
  onEscapeKeyDownProp?: (event: KeyboardEvent) => void,
  ownerDocument?: Document
) {
  const providedDocument = useDocument();
  const document = ownerDocument || providedDocument;
  const onEscapeKeyDown = useCallbackRef(onEscapeKeyDownProp);

  React.useEffect(() => {
    const _document = document || globalThis.document;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onEscapeKeyDown(event);
      }
    };
    _document.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => _document.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [onEscapeKeyDown, document]);
}

export { useEscapeKeydown };
