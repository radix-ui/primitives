/// <reference types="resize-observer-browser" />

import * as React from 'react';

import type { Size } from '@radix-ui/utils';

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
        let width: number;
        let height: number;

        if ('borderBoxSize' in entry) {
          const borderSizeEntry = entry['borderBoxSize'];
          // iron out differences between browsers
          const borderSize = Array.isArray(borderSizeEntry) ? borderSizeEntry[0] : borderSizeEntry;
          width = borderSize['inlineSize'];
          height = borderSize['blockSize'];
        } else {
          // for browsers that don't support `borderBoxSize`
          // we calculate a rect ourselves to get the correct border box.
          const rect = elementToObserve.getBoundingClientRect();
          width = rect.width;
          height = rect.height;
        }

        setSize({ width, height });
      });

      resizeObserver.observe(elementToObserve, { box: 'border-box' });

      return () => {
        setSize(undefined);
        resizeObserver.unobserve(elementToObserve);
      };
    }
    return;
  }, [refToObserve]);

  return size;
}
