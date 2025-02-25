/// <reference types="resize-observer-browser" />

import * as React from 'react';
import { useLayoutEffect } from '@radix-ui/react-use-layout-effect';

function useSize(element: HTMLElement | null) {
  const [size, setSize] = React.useState<{ width: number; height: number } | undefined>(undefined);

  useLayoutEffect(() => {
    if (element) {
      // provide size as early as possible
      setSize({ width: element.offsetWidth, height: element.offsetHeight });

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
          // we calculate it ourselves to get the correct border box.
          width = element.offsetWidth;
          height = element.offsetHeight;
        }

        setSize({ width, height });
      });

      resizeObserver.observe(element, { box: 'border-box' });

      return () => resizeObserver.unobserve(element);
    } else {
      // We only want to reset to `undefined` when the element becomes `null`,
      // not if it changes to another element.
      setSize(undefined);
    }
  }, [element]);

  return size;
}

export { useSize };
