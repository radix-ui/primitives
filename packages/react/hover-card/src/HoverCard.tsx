import * as React from 'react';
import { cssReset, interopDataAttrObj } from '@interop-ui/utils';
import { forwardRef, PrimitiveStyles } from '@interop-ui/react-utils';

const DEFAULT_TAG = 'div';

type HoverCardDOMProps = React.ComponentProps<typeof DEFAULT_TAG>;
type HoverCardOwnProps = {};
type HoverCardProps = HoverCardDOMProps & HoverCardOwnProps;

const HoverCard = forwardRef<typeof DEFAULT_TAG, HoverCardProps>(function HoverCard(
  props,
  forwardedRef
) {
  const { as: Comp = DEFAULT_TAG, ...hoverCardProps } = props;
  return <Comp {...hoverCardProps} {...interopDataAttrObj('HoverCard')} ref={forwardedRef} />;
});

HoverCard.displayName = 'HoverCard';

const styles: PrimitiveStyles = {
  hoverCard: {
    ...cssReset(DEFAULT_TAG),
  },
};

export { styles, HoverCard };
export type { HoverCardProps };
