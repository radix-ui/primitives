import * as React from 'react';
import * as ReactIs from 'react-is';
import { useComposedRefs } from '@interop-ui/react-utils';
import { createFocusTrap } from './createFocusTrap';

function useFocusTrap(ref: React.RefObject<HTMLElement>) {
  React.useEffect(() => {
    const container = ref.current;
    if (container) {
      return createFocusTrap(container);
    }
    return () => {};
  }, [ref]);
}

type FocusTrapProps = { children: React.ReactNode };

function FocusTrap({ children }: FocusTrapProps) {
  const child = React.Children.only(children);
  if (!React.isValidElement(child) || ReactIs.isFragment(child)) {
    throw new Error('FocusTrap needs to have a single valid React child.');
  }
  return <FocusTrapImpl>{child}</FocusTrapImpl>;
}

type FocusTrapImplProps = { children: React.ReactElement };

function FocusTrapImpl({ children: child }: FocusTrapImplProps) {
  const containerRef = React.useRef<HTMLElement>(null);
  const ref = useComposedRefs((child as any).ref, containerRef);

  useFocusTrap(containerRef);

  return React.cloneElement(child, { ref });
}

export { useFocusTrap, FocusTrap };
