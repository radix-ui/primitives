import * as React from 'react';
import { cssReset, interopDataAttrObj, interopSelector } from '@interop-ui/utils';
import { forwardRef, PrimitiveStyles } from '@interop-ui/react-utils';

const NAME = 'Card';
const DEFAULT_TAG = 'div';

type CardDOMProps = React.ComponentPropsWithoutRef<typeof DEFAULT_TAG>;
type CardOwnProps = {};
type CardProps = CardDOMProps & CardOwnProps;

const Card = forwardRef<typeof DEFAULT_TAG, CardProps>(function Card(props, forwardedRef) {
  const { as: Comp = DEFAULT_TAG, ...cardProps } = props;
  return <Comp {...interopDataAttrObj(NAME)} ref={forwardedRef} {...cardProps} />;
});

Card.displayName = NAME;

const styles: PrimitiveStyles = {
  [interopSelector(NAME)]: {
    ...cssReset(DEFAULT_TAG),
  },
};

export { Card, styles };
export type { CardProps };
