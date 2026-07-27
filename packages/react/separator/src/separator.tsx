import * as React from 'react';
import { Primitive } from '@radix-ui/react-primitive';

/* -------------------------------------------------------------------------------------------------
 *  Separator
 * -----------------------------------------------------------------------------------------------*/
const Orientation = {
  Horizontal: 'horizontal',
  Vertical: 'vertical',
} as const;

const DEFAULT_ORIENTATION = Orientation.Horizontal;
const ORIENTATIONS = Object.values(Orientation);

type Orientation = (typeof Orientation)[keyof typeof Orientation];

type SeparatorElement = React.ComponentRef<typeof Primitive.div>;
type PrimitiveDivProps = React.ComponentPropsWithoutRef<typeof Primitive.div>;
interface SeparatorProps extends PrimitiveDivProps {
  /**
   * Either `vertical` or `horizontal`. Defaults to `horizontal`.
   */
  orientation?: Orientation;
  /**
   * Whether or not the component is purely decorative. When true, accessibility-related attributes
   * are updated so that that the rendered element is removed from the accessibility tree.
   */
  decorative?: boolean;
}

const Separator = /* @__PURE__ */ React.forwardRef<SeparatorElement, SeparatorProps>(
  function Separator(props, forwardedRef) {
    const { decorative, orientation: orientationProp = DEFAULT_ORIENTATION, ...domProps } = props;
    const orientation = isValidOrientation(orientationProp) ? orientationProp : DEFAULT_ORIENTATION;
    // `aria-orientation` defaults to `horizontal` so we only need it if `orientation` is vertical
    const ariaOrientation = orientation === Orientation.Vertical ? orientation : undefined;
    const semanticProps = decorative
      ? { role: 'none' }
      : { 'aria-orientation': ariaOrientation, role: 'separator' };

    return (
      <Primitive.div
        data-orientation={orientation}
        {...semanticProps}
        {...domProps}
        ref={forwardedRef}
      />
    );
  },
);

/* -----------------------------------------------------------------------------------------------*/

function isValidOrientation(orientation: any): orientation is Orientation {
  return ORIENTATIONS.includes(orientation);
}

export {
  Separator,
  //
  Separator as Root,
};
export type { SeparatorProps };
