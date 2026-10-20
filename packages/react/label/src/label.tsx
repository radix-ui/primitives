import * as React from 'react';
import { Primitive } from '@radix-ui/react-primitive';

/* -------------------------------------------------------------------------------------------------
 * Label
 * -----------------------------------------------------------------------------------------------*/

type LabelElement = React.ComponentRef<typeof Primitive.label>;
type PrimitiveLabelProps = React.ComponentPropsWithoutRef<typeof Primitive.label>;
interface LabelProps extends PrimitiveLabelProps {}

const Label = /* @__PURE__ */ React.forwardRef<LabelElement, LabelProps>(
  function Label(props, forwardedRef) {
    return (
      <Primitive.label
        {...props}
        ref={forwardedRef}
        onMouseDown={(event) => {
          props.onMouseDown?.(event);

          // only prevent text selection if clicking inside the label itself
          const target = event.target as HTMLElement;
          const isTargetNestedControl = target.closest('button, input, select, textarea') !== null;
          if (isTargetNestedControl) {
            return;
          }

          // prevent text selection when double clicking label
          if (!event.defaultPrevented && event.detail > 1) {
            event.preventDefault();
          }
        }}
      />
    );
  },
);

/* -----------------------------------------------------------------------------------------------*/

export {
  Label,
  //
  Label as Root,
};
export type { LabelProps };
