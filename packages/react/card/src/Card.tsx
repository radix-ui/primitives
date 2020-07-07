import * as React from 'react';

type CardDOMProps = React.ComponentPropsWithRef<'div'>;
type CardOwnProps = {};
type CardProps = CardDOMProps & CardOwnProps;

const Card = React.forwardRef<HTMLDivElement, CardProps>(function Card(props, forwardedRef) {
  return <div ref={forwardedRef} />;
});

Card.displayName = 'Card';

export { Card };
export type { CardProps };
