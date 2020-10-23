import * as React from 'react';
import { useLayoutEffect } from './useLayoutEffect';

/**
 * Get a reference to the global document object relative to a specific node ref
 * @param forwardedRef
 */
export function useDocumentRef<T extends Element>(
  forwardedRef: React.RefObject<T | null>
): React.MutableRefObject<Document> {
  const ownerDocumentRef = React.useRef(typeof document !== 'undefined' ? document : undefined);
  useLayoutEffect(() => {
    if (forwardedRef.current instanceof Element) {
      ownerDocumentRef.current = forwardedRef.current.ownerDocument || document;
    }
  });
  return ownerDocumentRef as React.MutableRefObject<Document>;
}
