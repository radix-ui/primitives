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
    ownerDocumentRef.current = getOwnerDocument(forwardedRef);
  });
  return ownerDocumentRef as React.MutableRefObject<Document>;
}

export function getOwnerDocument(nodeRef: React.RefObject<Element | null | undefined>) {
  if (nodeRef.current instanceof Element) {
    return nodeRef.current.ownerDocument || document;
  }
  return document;
}

export function getOwnerWindow(nodeRef: React.RefObject<Element | null | undefined>) {
  if (nodeRef.current instanceof Element) {
    return getOwnerDocument(nodeRef).defaultView || window;
  }
  return window;
}

export function getOwnerGlobals(nodeRef: React.RefObject<Element | null | undefined>) {
  const ownerDocument = getOwnerDocument(nodeRef);
  return {
    ownerDocument,
    ownerWindow: ownerDocument.defaultView || window,
  };
}
