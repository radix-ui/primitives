import * as React from 'react';
import { Primitive } from '@radix-ui/react-primitive';

/* -------------------------------------------------------------------------------------------------
 * Arrow
 * -----------------------------------------------------------------------------------------------*/

type ArrowElement = React.ComponentRef<typeof Primitive.svg>;
type PrimitiveSvgProps = React.ComponentPropsWithoutRef<typeof Primitive.svg>;
interface ArrowProps extends PrimitiveSvgProps {}

const Arrow = /* @__PURE__ */ React.forwardRef<ArrowElement, ArrowProps>(
  // ignore prettier to reduce diff noise
  // prettier-ignore
  function Arrow(props, forwardedRef) {
  const { children, width = 10, height = 5, ...arrowProps } = props;
  return (
    <Primitive.svg
      {...arrowProps}
      ref={forwardedRef}
      width={width}
      height={height}
      viewBox="0 0 30 10"
      preserveAspectRatio="none"
    >
      {/* We use their children if they're slotting to replace the whole svg */}
      {props.asChild ? children : <polygon points="0,0 30,0 15,10" />}
    </Primitive.svg>
  );
},
);

/* -----------------------------------------------------------------------------------------------*/

const Root = Arrow;

export {
  Arrow,
  //
  Root,
};
export type { ArrowProps };
