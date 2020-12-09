import * as React from 'react';
import ReactDOM from 'react-dom';
import { useLayoutEffect } from '@interop-ui/react-utils';

type PortalProps = {
  children: React.ReactNode;
  containerRef?: React.RefObject<HTMLElement>;
};

const Portal: React.FC<PortalProps> = ({ children, containerRef }) => {
  // Lazy initialization of the host element
  // This is to make sure we don't recreate a new DOM element on each render
  const [hostElement] = React.useState(getHostElement);

  // We append the host element and remove it when necessary
  useLayoutEffect(() => {
    if (!hostElement) {
      return;
    }

    // prioritize a custom container via `containerRef` prop
    if (containerRef && containerRef.current) {
      containerRef.current.appendChild(hostElement);
    }
    // default to `document.body`
    else {
      document.body.appendChild(hostElement);
    }

    return () => {
      hostElement.remove();
    };
  }, [hostElement, containerRef]);

  if (hostElement) {
    // Render the children of `Portal` inside the host element
    return ReactDOM.createPortal(children, hostElement);
  }

  // bail out of ssr
  return null;
};

function getHostElement() {
  if (typeof document !== 'undefined') {
    return document.createElement('interop-portal');
  }

  // bail out of ssr
  return null;
}

const Root = Portal;

export { Portal, Root };
