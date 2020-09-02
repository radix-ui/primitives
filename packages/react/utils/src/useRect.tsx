import * as React from 'react';
import { observeElementRect } from '@interop-ui/utils';
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

/**
 * Use this custom hook to get access to an element's rect (getBoundingClientRect)
 * and observe it along time.
 */
export function useRect(
  /** A reference to the element whose rect to observe */
  refToObserve: React.RefObject<HTMLElement | SVGElement>
) {
  const [rect, setRect] = React.useState<ClientRect>();
  useIsomorphicLayoutEffect(() => {
    if (refToObserve.current) {
      const unobserve = observeElementRect(refToObserve.current, setRect);
      console.log('observe', refToObserve.current);
      return () => {
        console.log('unobserve', refToObserve.current);
        setRect(undefined);
        unobserve();
      };
    }
    return;
  }, [refToObserve]);
  return rect;
}
