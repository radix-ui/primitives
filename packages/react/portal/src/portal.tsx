import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Primitive } from '@radix-ui/react-primitive';
import { useLayoutEffect } from '@radix-ui/react-use-layout-effect';

/* -------------------------------------------------------------------------------------------------
 * Portal
 * -----------------------------------------------------------------------------------------------*/

type PortalElement = React.ComponentRef<typeof Primitive.div>;
type PrimitiveDivProps = React.ComponentPropsWithoutRef<typeof Primitive.div>;
interface PortalProps extends PrimitiveDivProps {
  /**
   * An optional container where the portaled content should be appended.
   */
  container?: Element | DocumentFragment | null;
}

const Portal = /* @__PURE__ */ React.forwardRef<PortalElement, PortalProps>(
  // ignore prettier to reduce diff noise
  // prettier-ignore
  function Portal(props, forwardedRef) {
  const { container: containerProp, ...portalProps } = props;
  const [mounted, setMounted] = React.useState(false);
  useLayoutEffect(() => setMounted(true), []);
  const container = containerProp || (mounted && globalThis?.document?.body);
  return container
    ? ReactDOM.createPortal(<Primitive.div {...portalProps} ref={forwardedRef} />, container)
    : null;
},
);

/* -----------------------------------------------------------------------------------------------*/

const Root = Portal;

export {
  Portal,
  //
  Root,
};
export type { PortalProps };
