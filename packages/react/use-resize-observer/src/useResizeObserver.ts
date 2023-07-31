/// <reference types="resize-observer-browser" />

import { useCallbackRef } from '@radix-ui/react-use-callback-ref';
import { useLayoutEffect } from '@radix-ui/react-use-layout-effect';

function useResizeObserver(
  element: HTMLElement | null,
  onResize: (entries: ResizeObserverEntry[]) => void
) {
  const handleResize = useCallbackRef(onResize);
  useLayoutEffect(() => {
    let rAF = 0;
    if (element) {
      /**
       * Resize Observer will throw an often benign error that says `ResizeObserver loop
       * completed with undelivered notifications`. This means that ResizeObserver was not
       * able to deliver all observations within a single animation frame, so we use
       * `requestAnimationFrame` to ensure we don't deliver unnecessary observations.
       * Further reading: https://github.com/WICG/resize-observer/issues/38
       */
      const resizeObserver = new ResizeObserver((entries) => {
        cancelAnimationFrame(rAF);
        rAF = window.requestAnimationFrame(() => {
          handleResize(entries);
        });
      });

      resizeObserver.observe(element);

      return () => {
        window.cancelAnimationFrame(rAF);
        resizeObserver.unobserve(element);
      };
    }
  }, [element, handleResize]);
}

export { useResizeObserver };
