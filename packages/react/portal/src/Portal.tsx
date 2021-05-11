import * as React from 'react';
import ReactDOM from 'react-dom';
import { useLayoutEffect } from '@radix-ui/react-use-layout-effect';
import { Primitive } from '@radix-ui/react-primitive';

import type * as Polymorphic from '@radix-ui/react-polymorphic';

const MAX_Z_INDEX = 2147483647;

/* -------------------------------------------------------------------------------------------------
 * Portal
 * -----------------------------------------------------------------------------------------------*/

const PORTAL_NAME = 'Portal';

type PortalOwnProps = Polymorphic.Merge<
  Polymorphic.OwnProps<typeof Primitive>,
  {
    containerRef?: React.RefObject<HTMLElement>;
  }
>;

type PortalPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof Primitive>,
  PortalOwnProps
>;

const Portal = React.forwardRef((props, forwardedRef) => {
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
      <Primitive
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
}) as PortalPrimitive;

Portal.displayName = PORTAL_NAME;

const Root = Portal;

export {
  Portal,
  //
  Root,
};
export type { PortalPrimitive };
