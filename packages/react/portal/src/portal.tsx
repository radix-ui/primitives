import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Primitive } from '@radix-ui/react-primitive';
import { useLayoutEffect } from '@radix-ui/react-use-layout-effect';

/* -------------------------------------------------------------------------------------------------
 * PortalProvider
 * -----------------------------------------------------------------------------------------------*/

const PortalContext = React.createContext<Element | DocumentFragment | null>(null);
PortalContext.displayName = 'PortalContext';

interface PortalProviderProps {
  children: React.ReactNode;
  /**
   * The default container element for portaled content.
   * @defaultValue document.body
   */
  container: Element | DocumentFragment;
}

const PortalProvider: React.FC<PortalProviderProps> = ({ container, children }) => {
  return <PortalContext.Provider value={container}>{children}</PortalContext.Provider>;
};

PortalProvider.displayName = 'PortalProvider';

/* -------------------------------------------------------------------------------------------------
 * Portal
 * -----------------------------------------------------------------------------------------------*/

const PORTAL_NAME = 'Portal';

type PortalElement = React.ComponentRef<typeof Primitive.div>;
type PrimitiveDivProps = React.ComponentPropsWithoutRef<typeof Primitive.div>;
interface PortalProps extends PrimitiveDivProps {
  /**
   * An optional container where the portaled content should be appended.
   */
  container?: Element | DocumentFragment | null;
}

const Portal = React.forwardRef<PortalElement, PortalProps>((props, forwardedRef) => {
  const { container: containerProp, ...portalProps } = props;
  const contextContainer = React.useContext(PortalContext);
  const [mounted, setMounted] = React.useState(false);
  useLayoutEffect(() => setMounted(true), []);
  const container = containerProp || contextContainer || (mounted && globalThis?.document?.body);
  return container
    ? ReactDOM.createPortal(<Primitive.div {...portalProps} ref={forwardedRef} />, container)
    : null;
});

Portal.displayName = PORTAL_NAME;

/* -----------------------------------------------------------------------------------------------*/

const Root = Portal;

export {
  Portal,
  PortalProvider,
  //
  Root,
};
export type { PortalProps, PortalProviderProps };
