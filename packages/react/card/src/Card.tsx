import * as React from 'react';
import { cssReset, interopDataAttrObj, interopSelector } from '@interop-ui/utils';
import { createContext, forwardRef, PrimitiveStyles, useHasContext } from '@interop-ui/react-utils';

/* -------------------------------------------------------------------------------------------------
 * Root level context
 * -----------------------------------------------------------------------------------------------*/

type CardContextValue = {};
const [CardContext] = createContext<CardContextValue>('CardContext', 'Card');

/* -------------------------------------------------------------------------------------------------
 * Card
 * -----------------------------------------------------------------------------------------------*/

const NAME = 'Card';
const DEFAULT_TAG = 'div';

type CardDOMProps = React.ComponentPropsWithoutRef<typeof DEFAULT_TAG>;
type CardOwnProps = {};
type CardProps = CardDOMProps & CardOwnProps;

const Card = forwardRef<typeof DEFAULT_TAG, CardProps>(function Card(props, forwardedRef) {
  const { as: Comp = DEFAULT_TAG, ...cardProps } = props;
  return (
    <CardContext.Provider value={React.useMemo(() => ({}), [])}>
      <Comp {...interopDataAttrObj(NAME)} ref={forwardedRef} {...cardProps} />
    </CardContext.Provider>
  );
});

Card.displayName = NAME;

/* ---------------------------------------------------------------------------------------------- */

const useHasCardContext = () => useHasContext(CardContext);

const styles: PrimitiveStyles = {
  [interopSelector(NAME)]: {
    ...cssReset(DEFAULT_TAG),
  },
};

export { Card, styles, useHasCardContext };
export type { CardProps };
