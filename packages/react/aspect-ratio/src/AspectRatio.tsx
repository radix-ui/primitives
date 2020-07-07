import * as React from 'react';
import { cssReset } from '@interop-ui/utils';
import { forwardRef } from '@interop-ui/react-utils';

const DEFAULT_TAG = 'div';

type AspectRatioDOMProps = React.ComponentPropsWithoutRef<typeof DEFAULT_TAG>;
type AspectRatioOwnProps = { ratio?: string };
type AspectRatioProps = AspectRatioDOMProps & AspectRatioOwnProps;

const AspectRatio = forwardRef<typeof DEFAULT_TAG, AspectRatioProps>(function AspectRatio(
  props,
  forwardedRef
) {
  const { as: Comp = DEFAULT_TAG, ratio = '1:1', children, style, ...aspectRatioProps } = props;

  const [n1, n2] = ratio.split(':');
  const paddingBottom = 100 / (Number(n1) / Number(n2));

  return (
    <Comp
      {...aspectRatioProps}
      ref={forwardedRef}
      style={{
        ...cssReset(DEFAULT_TAG),
        position: 'relative',
        width: '100%',
        ...style,
        paddingBottom: `${paddingBottom}%`,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
        }}
      >
        {children}
      </div>
    </Comp>
  );
});

AspectRatio.displayName = 'AspectRatio';

export type { AspectRatioProps };
export { AspectRatio };
