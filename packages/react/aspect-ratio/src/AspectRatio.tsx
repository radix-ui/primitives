import * as React from 'react';
import { getSelector } from '@radix-ui/utils';
import { Primitive } from '@radix-ui/react-primitive';

import type * as Polymorphic from '@radix-ui/react-polymorphic';
import type { Merge } from '@radix-ui/utils';

/* -------------------------------------------------------------------------------------------------
 * AspectRatio
 * -----------------------------------------------------------------------------------------------*/

const NAME = 'AspectRatio';

type AspectRatioOwnProps = Merge<Polymorphic.OwnProps<typeof Primitive>, { ratio?: number }>;
type AspectRatioPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof Primitive>,
  AspectRatioOwnProps
>;

const AspectRatio = React.forwardRef((props, forwardedRef) => {
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
}) as AspectRatioPrimitive;

AspectRatio.displayName = NAME;

const Root = AspectRatio;

export {
  AspectRatio,
  //
  Root,
};
