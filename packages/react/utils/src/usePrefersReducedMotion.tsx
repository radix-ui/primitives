import * as React from 'react';

const QUERY = '(prefers-reduced-motion: no-preference)';

export function usePrefersReducedMotion(nodeRef: React.RefObject<Element>) {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);
  React.useEffect(() => {
    return onPrefersReducedMotionChange(
      setPrefersReducedMotion,
      nodeRef.current?.ownerDocument.defaultView || window
    );
  }, [nodeRef]);
  return prefersReducedMotion;
}

export function prefersReducedMotion(globalWindow: Window & typeof globalThis = window) {
  try {
    return !globalWindow.matchMedia(QUERY).matches;
  } catch (err) {
    return false;
  }
}

export function onPrefersReducedMotionChange(
  callback: (prefers: boolean) => any,
  globalWindow: Window & typeof globalThis = window
) {
  try {
    const mediaQueryList = globalWindow.matchMedia(QUERY);
    mediaQueryList.addEventListener('change', listener);
    return function () {
      mediaQueryList.removeEventListener('change', listener);
    };
  } catch (e) {}

  return function () {};

  function listener(event: MediaQueryListEvent) {
    callback(!event.matches);
  }
}
