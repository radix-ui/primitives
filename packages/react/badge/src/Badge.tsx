import * as React from 'react';
import { cssReset, interopDataAttrObj, interopSelector } from '@interop-ui/utils';
import { forwardRef, PrimitiveStyles } from '@interop-ui/react-utils';

const NAME = 'Badge';
const DEFAULT_TAG = 'span';

type BadgeDOMProps = React.ComponentPropsWithoutRef<typeof DEFAULT_TAG>;
type BadgeOwnProps = {};
type BadgeProps = BadgeDOMProps & BadgeOwnProps;

const Badge = forwardRef<typeof DEFAULT_TAG, BadgeProps>(function Badge(props, forwardedRef) {
  const { as: Comp = DEFAULT_TAG, ...badgeProps } = props;
  return <Comp {...interopDataAttrObj(NAME)} ref={forwardedRef} {...badgeProps} />;
});

Badge.displayName = NAME;

const styles: PrimitiveStyles = {
  [interopSelector(NAME)]: {
    ...cssReset(DEFAULT_TAG),
    display: 'inline-flex',
    alignItems: 'center',
    verticalAlign: 'middle',
    lineHeight: '1',
    userSelect: 'none',
    whiteSpace: 'nowrap',
  },
};

export { Badge, styles };
export type { BadgeProps };
