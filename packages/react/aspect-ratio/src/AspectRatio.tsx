import * as React from 'react';
import { getSelector, getSelectorObj } from '@radix-ui/utils';
import { Primitive } from '@radix-ui/react-primitive';

import type * as Polymorphic from '@radix-ui/react-polymorphic';

/* -------------------------------------------------------------------------------------------------
 * AspectRatio
 * -----------------------------------------------------------------------------------------------*/

const NAME = 'AspectRatio';

type AspectRatioOwnProps = Polymorphic.Merge<
  Polymorphic.OwnProps<typeof Primitive>,
  { ratio?: number }
>;
type AspectRatioPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof Primitive>,
  AspectRatioOwnProps
>;

const AspectRatio = React.forwardRef((props, forwardedRef) => {
  const { selector = getSelector(NAME), ratio = 1 / 1, style, ...aspectRatioProps } = props;
  return (
    <div
      style={{
        // ensures inner element is contained
        position: 'relative',
        // ensures padding bottom trick maths works
        width: '100%',
        paddingBottom: `${100 / ratio}%`,
      }}
      {...(selector ? getSelectorObj(selector + '-wrapper') : undefined)}
    >
      <Primitive
        {...aspectRatioProps}
        selector={selector}
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
}) as AspectRatioPrimitive;

AspectRatio.displayName = NAME;

const Root = AspectRatio;

export {
  AspectRatio,
  //
  Root,
};
