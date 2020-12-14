import * as React from 'react';
import ReactDOM from 'react-dom';
import { useLayoutEffect } from '@interop-ui/react-utils';

type PortalProps = {
  children: React.ReactNode;
  containerRef?: React.RefObject<HTMLElement>;
};

const Portal: React.FC<PortalProps> = ({ children, containerRef }) => {
  const hostElement =
    containerRef?.current ?? (typeof document !== 'undefined' ? document.body : undefined);
  const [, forceUpdate] = React.useState({});

  /**
   * containerRef.current won't be set on first render, so we force a re-render.
   * Because we do this in `useLayoutEffect`, we still avoid a flash.
   */
  useLayoutEffect(() => {
    forceUpdate({});
  }, []);

  if (hostElement) {
    const RadixPortal = 'radix-portal' as any;
    return ReactDOM.createPortal(<RadixPortal>{children}</RadixPortal>, hostElement);
  }

  // bail out of ssr
  return null;
};

const Root = Portal;

export {
  Portal,
  //
  Root,
};
