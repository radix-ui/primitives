import * as React from 'react';
import { observeElementRect } from '@interop-ui/utils';
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

type UseRectOptions = {
  /** A reference to the element whose rect to observe */
  refToObserve: React.RefObject<HTMLElement | SVGElement>;
  /** Whether we want to currently observe or not */
  isObserving: boolean;
  shouldResetWhenNotObserving?: boolean;
};

/**
 * Use this custom hook to get access to an element's rect (getBoundingClientRect)
 * and observe it along time.
 */
export function useRect({
  refToObserve,
  isObserving = true,
  shouldResetWhenNotObserving = false,
}: UseRectOptions) {
  const [rect, setRect] = React.useState<ClientRect>();
  useIsomorphicLayoutEffect(() => {
    if (isObserving && refToObserve.current) {
      const unobserve = observeElementRect(refToObserve.current, setRect);
      return () => {
        if (shouldResetWhenNotObserving) {
          setRect(undefined);
        }
        unobserve();
      };
    }
    return;
  }, [isObserving, refToObserve, shouldResetWhenNotObserving]);
  return rect;
}
