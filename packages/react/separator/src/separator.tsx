import * as React from 'react';
import { Primitive } from '@radix-ui/react-primitive';

/* -------------------------------------------------------------------------------------------------
 *  Separator
 * -----------------------------------------------------------------------------------------------*/

const NAME = 'Separator';
const DEFAULT_ORIENTATION = 'horizontal';
const ORIENTATIONS = ['horizontal', 'vertical'] as const;

type Orientation = (typeof ORIENTATIONS)[number];
type SeparatorElement = React.ElementRef<typeof Primitive.div>;
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

const Separator = React.forwardRef<SeparatorElement, SeparatorProps>((props, forwardedRef) => {
  const { decorative, orientation: orientationProp = DEFAULT_ORIENTATION, ...domProps } = props;
  const orientation = isValidOrientation(orientationProp) ? orientationProp : DEFAULT_ORIENTATION;
  // `aria-orientation` defaults to `horizontal` so we only need it if `orientation` is vertical
  const ariaOrientation = orientation === 'vertical' ? orientation : undefined;
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
});

Separator.displayName = NAME;

/* -----------------------------------------------------------------------------------------------*/

function isValidOrientation(orientation: any): orientation is Orientation {
  return ORIENTATIONS.includes(orientation);
}

const Root = Separator;

export {
  Separator,
  //
  Root,
};
export type { SeparatorProps };
