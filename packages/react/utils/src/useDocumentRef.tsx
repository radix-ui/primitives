import * as React from 'react';
import { useLayoutEffect } from './useLayoutEffect';

export function useDocumentRef(
  forwardedRef: React.RefObject<Element | null | undefined>
): React.MutableRefObject<Document> {
  const ownerDocumentRef = React.useRef(getOwnerDocument(forwardedRef));
  useLayoutEffect(() => {
    if (forwardedRef.current instanceof Element) {
      ownerDocumentRef.current = getOwnerDocument(forwardedRef);
    }
  });
  return ownerDocumentRef;
}

export function getOwnerDocument(nodeRef: React.RefObject<Element | null | undefined>) {
  return nodeRef.current?.ownerDocument || document;
}

export function getOwnerWindow(nodeRef: React.RefObject<Element | null | undefined>) {
  return getOwnerDocument(nodeRef).defaultView || window;
}

export function getOwnerGlobals(nodeRef: React.RefObject<Element | null | undefined>) {
  const doc = getOwnerDocument(nodeRef);
  return {
    doc,
    win: doc.defaultView || window,
  };
}
