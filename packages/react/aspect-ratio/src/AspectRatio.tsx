import * as React from 'react';

type AspectRatioDOMProps = React.ComponentPropsWithoutRef<'div'>;
type AspectRatioOwnProps = {};
type AspectRatioProps = AspectRatioDOMProps & AspectRatioOwnProps;

const AspectRatio = React.forwardRef<HTMLDivElement, AspectRatioProps>(function AspectRatio(
  props,
  forwardedRef
) {
  return <div ref={forwardedRef} />;
});

AspectRatio.displayName = 'AspectRatio';

export { AspectRatio };
export type { AspectRatioProps };
