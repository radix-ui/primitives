import * as React from 'react';
import { cssReset } from '@interop-ui/utils';
import { forwardRef, createStyleObj } from '@interop-ui/react-utils';

const NAME = 'Container';
const DEFAULT_TAG = 'span';

type ContainerDOMProps = React.ComponentPropsWithoutRef<typeof DEFAULT_TAG>;
type ContainerOwnProps = {};
type ContainerProps = ContainerDOMProps & ContainerOwnProps;

const Container = forwardRef<typeof DEFAULT_TAG, ContainerProps>(function Container(
  props,
  forwardedRef
) {
  const { as: Comp = DEFAULT_TAG, ...containerProps } = props;
  return <Comp {...interopDataAttrObj('root')} ref={forwardedRef} {...containerProps} />;
});

Container.displayName = NAME;

const [styles, interopDataAttrObj] = createStyleObj(NAME, {
  root: {
    ...cssReset(DEFAULT_TAG),
    marginLeft: 'auto',
    marginRight: 'auto',
    flex: 1, // make sure the element is always full-width
  },
});

export { Container, styles };
export type { ContainerProps };
