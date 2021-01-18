import * as React from 'react';
import { getSelector } from '@radix-ui/utils';
import { forwardRefWithAs } from '@radix-ui/react-polymorphic';
import { Primitive } from '@radix-ui/react-primitive';

/* -------------------------------------------------------------------------------------------------
 * AspectRatio
 * -----------------------------------------------------------------------------------------------*/

const NAME = 'AspectRatio';

type AspectRatioOwnProps = {
  ratio?: number;
};

const AspectRatio = forwardRefWithAs<typeof Primitive, AspectRatioOwnProps>(
  (props, forwardedRef) => {
    const { ratio = 1 / 1, style, children, ...aspectRatioProps } = props;
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
        <Primitive
          selector={getSelector(NAME)}
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
        >
          {children}
        </Primitive>
      </div>
    );
  }
);

AspectRatio.displayName = NAME;

const Root = AspectRatio;

export {
  AspectRatio,
  //
  Root,
};
