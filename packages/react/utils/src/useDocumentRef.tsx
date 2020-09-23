import * as React from 'react';
import { useIsomorphicLayoutEffect as useLayoutEffect } from './useIsomorphicLayoutEffect';

export function useDocumentRef<T extends Element>(
  forwardedRef: React.RefObject<T | null>
): React.MutableRefObject<Document> {
  const ownerDocumentRef = React.useRef(document);
  useLayoutEffect(() => {
    if (forwardedRef.current instanceof Element) {
      ownerDocumentRef.current = forwardedRef.current.ownerDocument;
    }
  });
  return ownerDocumentRef;
}
