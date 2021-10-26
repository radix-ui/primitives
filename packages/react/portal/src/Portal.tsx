import * as React from 'react';
import ReactDOM from 'react-dom';
import { useLayoutEffect } from '@radix-ui/react-use-layout-effect';
import { Primitive } from '@radix-ui/react-primitive';

import type * as Radix from '@radix-ui/react-primitive';

const MAX_Z_INDEX = 2147483647;

/* -------------------------------------------------------------------------------------------------
 * Portal
 * -----------------------------------------------------------------------------------------------*/

const PORTAL_NAME = 'Portal';

type PortalElement = React.ElementRef<typeof Primitive.div>;
type PrimitiveDivProps = Radix.ComponentPropsWithoutRef<typeof Primitive.div>;
interface PortalProps extends PrimitiveDivProps {
  containerRef?: React.RefObject<HTMLElement>;
}

const Portal = React.forwardRef<PortalElement, PortalProps>((props, forwardedRef) => {
  const { containerRef, style, ...portalProps } = props;
  const hostElement = containerRef?.current ?? globalThis?.document?.body;
  const [, forceUpdate] = React.useState({});

  /**
   * containerRef.current won't be set on first render, so we force a re-render.
   * Because we do this in `useLayoutEffect`, we still avoid a flash.
   */
  useLayoutEffect(() => {
    forceUpdate({});
  }, []);

  if (hostElement) {
    return ReactDOM.createPortal(
      <Primitive.div
        data-radix-portal=""
        {...portalProps}
        ref={forwardedRef}
        style={
          /**
           * If the Portal is injected in `body`, we assume we want whatever is portalled
           * to appear on top of everything. Ideally this would be handled by making sure the
           * app root creates a new stacking context, however this is quite hard to automate.
           * For this reason, we have opted for setting the max z-index on the portal itself.
           */
          hostElement === document.body
            ? {
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: MAX_Z_INDEX,
                ...style,
              }
            : undefined
        }
      />,
      hostElement
    );
  }

  // bail out of ssr
  return null;
});

Portal.displayName = PORTAL_NAME;

/* -------------------------------------------------------------------------------------------------
 * UnstablePortal
 * -----------------------------------------------------------------------------------------------*/

const UNSTABLE_PORTAL_NAME = 'Portal';

interface UnstablePortalProps {
  container?: HTMLElement | null;
}

const UnstablePortal: React.FC<UnstablePortalProps> = (props) => {
  const { container = globalThis?.document?.body, children } = props;
  return container ? ReactDOM.createPortal(<>{children}</>, container) : null;
};

Portal.displayName = UNSTABLE_PORTAL_NAME;

/* -----------------------------------------------------------------------------------------------*/

const Root = Portal;

export {
  Portal,
  UnstablePortal,
  //
  Root,
};
export type { PortalProps, UnstablePortalProps };
