import * as React from 'react';
import { cssReset, interopDataAttrObj } from '@interop-ui/utils';
import { forwardRef } from '@interop-ui/react-utils';

const DEFAULT_TAG = 'div';

type CardDOMProps = React.ComponentPropsWithoutRef<typeof DEFAULT_TAG>;
type CardOwnProps = {};
type CardProps = CardDOMProps & CardOwnProps;

const Card = forwardRef<typeof DEFAULT_TAG, CardProps>(function Card(props, forwardedRef) {
  const { as: Comp = DEFAULT_TAG, ...cardProps } = props;
  return <Comp {...interopDataAttrObj('Card')} ref={forwardedRef} {...cardProps} />;
});

Card.displayName = 'Card';

const styles = {
  card: {
    ...cssReset(DEFAULT_TAG),
  },
};

export { Card, styles };
export type { CardProps };
