import * as React from 'react';
import { Primitive } from '@radix-ui/react-primitive';

import type * as Radix from '@radix-ui/react-primitive';

/* -------------------------------------------------------------------------------------------------
 * AspectRatio
 * -----------------------------------------------------------------------------------------------*/

const NAME = 'AspectRatio';

type AspectRatioElement = React.ElementRef<typeof Primitive.div>;
type AspectRatioProps = Radix.MergeProps<
  Radix.ComponentPropsWithoutRef<typeof Primitive.div>,
  { ratio?: number }
>;

const AspectRatio = React.forwardRef<AspectRatioElement, AspectRatioProps>(
  (props, forwardedRef) => {
    const { ratio = 1 / 1, style, ...aspectRatioProps } = props;
    return (
      <div
        style={{
          // ensures inner element is contained
          position: 'relative',
          // ensures padding bottom trick maths works
          width: '100%',
          paddingBottom: `${100 / ratio}%`,
        }}
        data-radix-aspect-ratio-wrapper=""
      >
        <Primitive.div
          {...aspectRatioProps}
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
        />
      </div>
    );
  }
);

AspectRatio.displayName = NAME;

/* -----------------------------------------------------------------------------------------------*/

const Root = AspectRatio;

export {
  AspectRatio,
  //
  Root,
};
