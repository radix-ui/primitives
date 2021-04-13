import * as React from 'react';
import { observeElementRect } from '@radix-ui/rect';

import type { Measurable } from '@radix-ui/rect';

/**
 * Use this custom hook to get access to an element's rect (getBoundingClientRect)
 * and observe it along time.
 */
function useRect(
  /** A reference to the element whose rect to observe */
  refToObserve: React.RefObject<Measurable>
) {
  const [rect, setRect] = React.useState<ClientRect>();
  React.useEffect(() => {
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

export { useRect };
