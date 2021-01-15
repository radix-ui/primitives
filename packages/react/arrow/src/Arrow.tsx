import * as React from 'react';
import { forwardRefWithAs } from '@radix-ui/react-polymorphic';
import { getSelector, getSelectorObj } from '@radix-ui/utils';

const NAME = 'Arrow';
const DEFAULT_TAG = 'svg';

type ArrowOwnProps = {
  /**
   * A string to use as the component selector for CSS purposes. It will be added as
   * a data attribute. Pass `null` to remove selector.
   *
   * @defaultValue radix-arrow
   */
  selector?: string | null;
};

const Arrow = forwardRefWithAs<typeof ArrowImpl>((props, forwardedRef) => {
  const { as: Comp = ArrowImpl, ...arrowProps } = props;
  return <Comp {...arrowProps} ref={forwardedRef} />;
});

const ArrowImpl = forwardRefWithAs<typeof DEFAULT_TAG, ArrowOwnProps>((props, forwardedRef) => {
  const {
    as: Comp = DEFAULT_TAG,
    selector = getSelector(NAME),
    width = 10,
    height = 5,
    ...arrowProps
  } = props;
  return (
    <Comp
      {...arrowProps}
      {...getSelectorObj(selector)}
      ref={forwardedRef}
      viewBox="0 0 30 10"
      width={width}
      height={height}
      preserveAspectRatio="none"
    >
      <polygon points="0,0 30,0 15,10" />
    </Comp>
  );
});

Arrow.displayName = NAME;

const Root = Arrow;

export {
  Arrow,
  //
  Root,
};
