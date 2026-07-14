import * as React from 'react';
import { Primitive } from '@radix-ui/react-primitive';

/* -------------------------------------------------------------------------------------------------
 * Label
 * -----------------------------------------------------------------------------------------------*/

type LabelElement = React.ComponentRef<typeof Primitive.label>;
type PrimitiveLabelProps = React.ComponentPropsWithoutRef<typeof Primitive.label>;
interface LabelProps extends PrimitiveLabelProps {}

const Label = /* @__PURE__ */ React.forwardRef<LabelElement, LabelProps>(
  // ignore prettier to reduce diff noise
  // prettier-ignore
  function Label(props, forwardedRef) {
  return (
    <Primitive.label
      {...props}
      ref={forwardedRef}
      onMouseDown={(event) => {
        // only prevent text selection if clicking inside the label itself
        const target = event.target as HTMLElement;
        if (target.closest('button, input, select, textarea')) return;

        props.onMouseDown?.(event);
        // prevent text selection when double clicking label
        if (!event.defaultPrevented && event.detail > 1) event.preventDefault();
      }}
    />
  );
},
);

/* -----------------------------------------------------------------------------------------------*/

const Root = Label;

export {
  Label,
  //
  Root,
};
export type { LabelProps };
