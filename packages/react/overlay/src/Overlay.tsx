import * as React from 'react';
import { cssReset } from '@interop-ui/utils';
import { forwardRef, createStyleObj } from '@interop-ui/react-utils';

const NAME = 'Overlay';
const DEFAULT_TAG = 'div';

type OverlayDOMProps = React.ComponentPropsWithoutRef<typeof DEFAULT_TAG>;
type OverlayOwnProps = {};
type OverlayProps = OverlayDOMProps & OverlayOwnProps;

const Overlay = forwardRef<typeof DEFAULT_TAG, OverlayProps>(function Overlay(props, forwardedRef) {
  const { as: Comp = DEFAULT_TAG, ...overlayProps } = props;
  return <Comp {...interopDataAttrObj('root')} ref={forwardedRef} {...overlayProps} />;
});

Overlay.displayName = NAME;

const [styles, interopDataAttrObj] = createStyleObj(NAME, {
  root: {
    ...cssReset(DEFAULT_TAG),
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
});

export { Overlay, styles };
export type { OverlayProps };
