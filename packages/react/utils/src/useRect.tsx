import * as React from 'react';
import { observeElementRect } from '@interop-ui/utils';
import { useLayoutEffect } from './useLayoutEffect';
import type { MeasurableElement } from '@interop-ui/utils';

/**
 * Use this custom hook to get access to an element's rect (getBoundingClientRect)
 * and observe it along time.
 */
export function useRect(
  /** A reference to the element whose rect to observe */
  refToObserve: React.RefObject<MeasurableElement>
) {
  const [rect, setRect] = React.useState<ClientRect>();
  useLayoutEffect(() => {
    if (refToObserve.current) {
      const unobserve = observeElementRect(refToObserve.current, setRect);
      return () => {
        setRect(undefined);
        unobserve();
      };
    }
    return;
  }, [refToObserve]);
  return rect;
}
