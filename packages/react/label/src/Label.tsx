import * as React from 'react';
import { Primitive } from '@radix-ui/react-primitive';

import type * as Radix from '@radix-ui/react-primitive';

/* -------------------------------------------------------------------------------------------------
 * Label
 * -----------------------------------------------------------------------------------------------*/

const NAME = 'Label';

type LabelElement = React.ElementRef<typeof Primitive.label>;
type PrimitiveLabelProps = Radix.ComponentPropsWithoutRef<typeof Primitive.label>;
interface LabelProps extends PrimitiveLabelProps {}

const Label = React.forwardRef<LabelElement, LabelProps>((props, forwardedRef) => {
  return (
    <Primitive.label
      {...props}
      ref={forwardedRef}
      onMouseDown={(event) => {
        props.onMouseDown?.(event);
        // prevent text selection when double clicking label
        if (!event.defaultPrevented && event.detail > 1) event.preventDefault();
      }}
    />
  );
});

Label.displayName = NAME;

/* -----------------------------------------------------------------------------------------------*/

const Root = Label;

export {
  Label,
  //
  Root,
};
export type { LabelProps };
