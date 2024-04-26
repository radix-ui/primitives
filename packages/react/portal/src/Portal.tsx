// @deno-types="npm:@types/react@^18.2.0"
import * as React from 'react';
// @deno-types="npm:@types/react-dom@^18.2.0"
import ReactDOM from 'react-dom';
import { Primitive } from '@radix-ui/react-primitive';

import type * as Radix from '@radix-ui/react-primitive';

/* -------------------------------------------------------------------------------------------------
 * Portal
 * -----------------------------------------------------------------------------------------------*/

const PORTAL_NAME = 'Portal';

type PortalElement = React.ElementRef<typeof Primitive.div>;
type PrimitiveDivProps = Radix.ComponentPropsWithoutRef<typeof Primitive.div>;
interface PortalProps extends PrimitiveDivProps {
  /**
   * An optional container where the portaled content should be appended.
   */
  container?: HTMLElement | null;
}

const Portal: React.ForwardRefExoticComponent<PortalProps & React.RefAttributes<PortalElement>> = React.forwardRef<PortalElement, PortalProps>((props, forwardedRef) => {
  const { container = globalThis?.document?.body, ...portalProps } = props;
  return container
    ? ReactDOM.createPortal(<Primitive.div {...portalProps} ref={forwardedRef} />, container)
    : null;
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
