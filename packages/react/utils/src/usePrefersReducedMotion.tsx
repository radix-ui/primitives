import * as React from 'react';
import { getOwnerWindow } from './useDocumentRef';

const QUERY = '(prefers-reduced-motion: no-preference)';

export function usePrefersReducedMotion(nodeRef: React.RefObject<Element>) {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(
    () => !(getOwnerWindow(nodeRef).matchMedia?.(QUERY).matches || true)
  );

  React.useEffect(() => {
    try {
      const mediaQueryList = getOwnerWindow(nodeRef).matchMedia(QUERY);
      function listener(event: MediaQueryListEvent) {
        setPrefersReducedMotion(!event.matches);
      }
      mediaQueryList.addEventListener('change', listener);
      return function () {
        mediaQueryList.removeEventListener('change', listener);
      };
    } catch (e) {}
  }, [nodeRef]);
  return prefersReducedMotion;
}
