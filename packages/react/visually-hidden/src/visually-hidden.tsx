import * as React from 'react';
import { Primitive } from '@radix-ui/react-primitive';

/* -------------------------------------------------------------------------------------------------
 * VisuallyHidden
 * -----------------------------------------------------------------------------------------------*/

const VISUALLY_HIDDEN_STYLES = Object.freeze({
  // See: https://github.com/twbs/bootstrap/blob/main/scss/mixins/_visually-hidden.scss
  position: 'absolute',
  border: 0,
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  wordWrap: 'normal',
}) satisfies React.CSSProperties;

const NAME = 'VisuallyHidden';

type VisuallyHiddenElement = React.ComponentRef<typeof Primitive.span>;
type PrimitiveSpanProps = React.ComponentPropsWithoutRef<typeof Primitive.span>;
interface VisuallyHiddenProps extends PrimitiveSpanProps {}

const VisuallyHidden = React.forwardRef<VisuallyHiddenElement, VisuallyHiddenProps>(
  (props, forwardedRef) => {
    return (
      <Primitive.span
        {...props}
        ref={forwardedRef}
        style={{ ...VISUALLY_HIDDEN_STYLES, ...props.style }}
      />
    );
  }
);

VisuallyHidden.displayName = NAME;

/* -----------------------------------------------------------------------------------------------*/

const Root = VisuallyHidden;

export {
  VisuallyHidden,
  //
  Root,
  //
  VISUALLY_HIDDEN_STYLES,
};
export type { VisuallyHiddenProps };
