import * as React from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import { Size } from '@interop-ui/utils';

export function useSize(
  /** A reference to the element whose size to observe */
  refToObserve: React.RefObject<HTMLElement | SVGElement>
) {
  const [size, setSize] = React.useState<Size | undefined>(undefined);

  React.useEffect(() => {
    if (refToObserve.current) {
      const elementToObserve = refToObserve.current;
      const resizeObserver = new ResizeObserver((entries) => {
        if (!Array.isArray(entries)) {
          return;
        }

        // Since we only observe the one element, we don't need to loop over the
        // array
        if (!entries.length) {
          return;
        }

        const entry = entries[0];

        setSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      });

      resizeObserver.observe(elementToObserve);

      return () => {
        setSize(undefined);
        resizeObserver.unobserve(elementToObserve);
      };
    }
    return;
  }, [refToObserve]);

  return size;
}
