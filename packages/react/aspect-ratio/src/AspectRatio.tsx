import * as React from 'react';
import { getPartDataAttrObj } from '@interop-ui/utils';
import { forwardRefWithAs } from '@interop-ui/react-polymorphic';

/* -------------------------------------------------------------------------------------------------
 * AspectRatio
 * -----------------------------------------------------------------------------------------------*/

const NAME = 'AspectRatio';
const DEFAULT_TAG = 'div';

type AspectRatioOwnProps = { ratio?: number };

const AspectRatio = forwardRefWithAs<typeof DEFAULT_TAG, AspectRatioOwnProps>(
  (props, forwardedRef) => {
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
  }
);

AspectRatio.displayName = NAME;

export { AspectRatio, AspectRatio as Root };
