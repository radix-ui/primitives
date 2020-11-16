import * as React from 'react';
import { getPartDataAttrObj } from '@interop-ui/utils';
import { forwardRef } from '@interop-ui/react-utils';

/* -------------------------------------------------------------------------------------------------
 * AspectRatio
 * -----------------------------------------------------------------------------------------------*/

const NAME = 'AspectRatio';
const DEFAULT_TAG = 'div';

type AspectRatioDOMProps = React.ComponentPropsWithoutRef<typeof DEFAULT_TAG>;
type AspectRatioOwnProps = { ratio?: number };
type AspectRatioProps = AspectRatioDOMProps & AspectRatioOwnProps;

const AspectRatio = forwardRef<typeof DEFAULT_TAG, AspectRatioProps>(function AspectRatio(
  props,
  forwardedRef
) {
  const { as: Comp = DEFAULT_TAG, ratio = 1 / 1, style, children, ...aspectRatioProps } = props;

  return (
    <div
      style={{
        // ensures inner element is contained
        position: 'relative',
        // ensures padding bottom trick maths works
        width: '100%',
        paddingBottom: `${100 / ratio}%`,
      }}
    >
      <Comp
        {...aspectRatioProps}
        {...getPartDataAttrObj(NAME)}
        ref={forwardedRef}
        style={{
          ...style,
          // ensures children expand in ratio
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        }}
      >
        {children}
      </Comp>
    </div>
  );
});

AspectRatio.displayName = NAME;

export { AspectRatio };
export type { AspectRatioProps };
