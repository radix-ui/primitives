import * as React from 'react';
import ReactDOM from 'react-dom';
import { Primitive } from '@radix-ui/react-primitive';
import { getOwnerDocument } from '@radix-ui/primitive';

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
  const [mountNode, setMountNode] = React.useState<HTMLSpanElement | null>(null);
  const container = containerProp || (mountNode && getOwnerDocument(mountNode).body);
  return container ? (
    ReactDOM.createPortal(<Primitive.div {...portalProps} ref={forwardedRef} />, container)
  ) : (
    <span ref={setMountNode} />
  );
});

Portal.displayName = PORTAL_NAME;

/* -----------------------------------------------------------------------------------------------*/

const Root = Portal;

export {
  Portal,
  //
  Root,
};
export type { PortalProps };
