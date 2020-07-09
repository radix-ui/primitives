import * as React from 'react';

type ContainerDOMProps = React.ComponentPropsWithoutRef<'div'>;
type ContainerOwnProps = {};
type ContainerProps = ContainerDOMProps & ContainerOwnProps;

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(function Container(
  props,
  forwardedRef
) {
  return <div ref={forwardedRef} />;
});

Container.displayName = 'Container';

export { Container };
export type { ContainerProps };
