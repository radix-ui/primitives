import * as React from 'react';
import { getSelector, getSelectorObj } from '@radix-ui/utils';
import { forwardRefWithAs } from '@radix-ui/react-polymorphic';

/* -------------------------------------------------------------------------------------------------
 * Primitive
 * -----------------------------------------------------------------------------------------------*/

const NAME = 'Primitive';
const DEFAULT_TAG = 'div';

type PrimitiveOwnProps = {
  /**
   * A string to use as the component selector for CSS purposes. It will be added as
   * a data attribute. Pass `null` to remove selector.
   *
   * @defaultValue radix-{component-name}
   *
   * @example
   * `AccordionItem` component will have `radix-accordion-item` selector by
   * default. Passing `selector="org-accordion-item"` will replace selector
   * with `org-accordion-item`.
   */
  selector?: string | null;
};

const Primitive = forwardRefWithAs<typeof DEFAULT_TAG, PrimitiveOwnProps>((props, forwardedRef) => {
  const { as: Comp = DEFAULT_TAG, selector = getSelector(NAME), ...primitiveProps } = props;
  return <Comp {...primitiveProps} {...getSelectorObj(selector)} ref={forwardedRef} />;
});

Primitive.displayName = 'Primitive';

/* -----------------------------------------------------------------------------------------------*/

const Root = Primitive;

export {
  Primitive,
  //
  Root,
};
