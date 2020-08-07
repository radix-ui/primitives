import * as React from 'react';
import { cssReset, interopDataAttrObj, interopSelector } from '@interop-ui/utils';
import { forwardRef, PrimitiveStyles } from '@interop-ui/react-utils';

const NAME = 'Overlay';
const DEFAULT_TAG = 'div';

type OverlayDOMProps = React.ComponentPropsWithoutRef<typeof DEFAULT_TAG>;
type OverlayOwnProps = {};
type OverlayProps = OverlayDOMProps & OverlayOwnProps;

const Overlay = forwardRef<typeof DEFAULT_TAG, OverlayProps>(function Overlay(props, forwardedRef) {
  const { as: Comp = DEFAULT_TAG, ...overlayProps } = props;
  return <Comp {...interopDataAttrObj(NAME)} ref={forwardedRef} {...overlayProps} />;
});

Overlay.displayName = NAME;

const styles: PrimitiveStyles = {
  [interopSelector(NAME)]: {
    ...cssReset(DEFAULT_TAG),
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
};

export { Overlay, styles };
export type { OverlayProps };
