import * as React from 'react';

import type * as Polymorphic from '@radix-ui/react-polymorphic';

/* -------------------------------------------------------------------------------------------------
 * Primitive
 * -----------------------------------------------------------------------------------------------*/

const NAME = 'Primitive';
const DEFAULT_TAG = 'div';

type PrimitiveOwnProps = {};

const Primitive = React.forwardRef((props, forwardedRef) => {
  const { as: Comp = DEFAULT_TAG, ...primitiveProps } = props;
  return <Comp {...primitiveProps} ref={forwardedRef} />;
}) as Polymorphic.ForwardRefComponent<typeof DEFAULT_TAG, PrimitiveOwnProps>;

Primitive.displayName = NAME;

/* -----------------------------------------------------------------------------------------------*/

const Root = Primitive;

export {
  Primitive,
  //
  Root,
};
