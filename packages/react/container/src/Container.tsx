import * as React from 'react';
import { cssReset, interopDataAttrObj } from '@interop-ui/utils';
import { forwardRef, PrimitiveStyles } from '@interop-ui/react-utils';

const DEFAULT_TAG = 'span';

type ContainerDOMProps = React.ComponentPropsWithoutRef<typeof DEFAULT_TAG>;
type ContainerOwnProps = {};
type ContainerProps = ContainerDOMProps & ContainerOwnProps;

const Container = forwardRef<typeof DEFAULT_TAG, ContainerProps>(function Container(
  props,
  forwardedRef
) {
  const { as: Comp = DEFAULT_TAG, ...containerProps } = props;
  return <Comp {...interopDataAttrObj('Container')} ref={forwardedRef} {...containerProps} />;
});

Container.displayName = 'Container';

const styles: PrimitiveStyles = {
  container: {
    ...cssReset(DEFAULT_TAG),
    marginLeft: 'auto',
    marginRight: 'auto',
    flex: 1, // make sure the element is always full-width
  },
};

export { Container, styles };
export type { ContainerProps };
