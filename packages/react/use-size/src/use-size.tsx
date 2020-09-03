import * as React from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import { Size } from '@interop-ui/utils';

export function useSize(
  /** A reference to the element whose size to observe */
  refToObserve: React.RefObject<HTMLElement | SVGElement>
) {
  let [size, setSize] = React.useState<Size | undefined>(undefined);

  React.useEffect(() => {
    if (refToObserve.current) {
      let elementToObserver = refToObserve.current;
      let resizeObserver = new ResizeObserver((entries) => {
        if (!Array.isArray(entries)) {
          return;
        }

        // Since we only observe the one element, we don't need to loop over the
        // array
        if (!entries.length) {
          return;
        }

        let entry = entries[0];

        setSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      });

      const elem = refToObserve.current;
      resizeObserver.observe(elementToObserver);

      return () => {
        setSize(undefined);
        resizeObserver.unobserve(elementToObserver);
      };
    }
    return;
  }, [refToObserve]);

  return size;
}
