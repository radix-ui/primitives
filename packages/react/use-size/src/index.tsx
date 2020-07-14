import * as React from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import { Size } from '@interop-ui/utils';

type UseSizeOptions = {
  /** A reference to the element whose size to observe */
  refToObserve: React.RefObject<HTMLElement | SVGElement>;
  /** Whether we want to currently observe or not */
  isObserving: boolean;
};

export function useSize({ refToObserve, isObserving }: UseSizeOptions) {
  let [size, setSize] = React.useState<Size | undefined>(undefined);

  React.useEffect(() => {
    if (isObserving && refToObserve.current) {
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

      resizeObserver.observe(elementToObserver);

      return () => resizeObserver.unobserve(elementToObserver);
    }
    return;
  }, [isObserving, refToObserve]);

  return size;
}
