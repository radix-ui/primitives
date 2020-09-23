import * as React from 'react';
import { forwardRef, createStyleObj } from '@interop-ui/react-utils';
import { cssReset } from '@interop-ui/utils';

const NAME = 'Separator';
const DEFAULT_TAG = 'hr';
const DEFAULT_ORIENTATION = 'horizontal';
const ORIENTATIONS = ['horizontal', 'vertical'] as const;

type Orientation = typeof ORIENTATIONS[number];
type SeparatorDOMProps = React.ComponentPropsWithoutRef<typeof DEFAULT_TAG>;
type SeparatorOwnProps = {
  /**
   * Either `vertical` or `horizontal`. Defaults to `horizontal`.
   */
  orientation?: Orientation;
  /**
   * Whether or not the component is purely decorative. When true, accessibility-related attributes
   * are updated so that that the rendered element is removed from the accessibility tree.
   */
  decorative?: boolean;
};
type SeparatorProps = Omit<SeparatorDOMProps & SeparatorOwnProps, 'aria-orientation'>;

const Separator = forwardRef<typeof DEFAULT_TAG, SeparatorProps>(function Separator(
  props,
  forwardedRef
) {
  const {
    as: Comp = DEFAULT_TAG,
    decorative,
    orientation: orientationProp = DEFAULT_ORIENTATION,
    ...domProps
  } = props;

  const orientation = isValidOrientation(orientationProp) ? orientationProp : DEFAULT_ORIENTATION;
  // `aria-orientation` defaults to `horizontal` so we only need it if `orientation` is vertical
  const ariaOrientation = orientation === 'vertical' ? orientation : undefined;
  const semanticProps = decorative
    ? { role: 'none' }
    : { 'aria-orientation': ariaOrientation, role: 'separator' };

  return (
    <Comp
      {...semanticProps}
      data-orientation={orientation}
      ref={forwardedRef}
      {...interopDataAttrObj('root')}
      {...domProps}
    />
  );
});

Separator.displayName = NAME;

const [styles, interopDataAttrObj] = createStyleObj(NAME, {
  root: {
    ...cssReset(DEFAULT_TAG),
    display: 'block',
  },
});

Separator.propTypes = {
  orientation(props, propName, componentName, location, propFullName) {
    const propValue = props[propName];
    const strVal = String(propValue);
    if (!isValidOrientation(props[propName])) {
      return new Error(
        `Invalid ${location} \`${propFullName}\` of value \`${strVal}\` supplied to \`${componentName}\`, expected one of:
 - horizontal
 - vertical

 Defaulting to \`${DEFAULT_ORIENTATION}\`.`
      );
    }
    return null;
  },
};

export { Separator, styles };
export type { SeparatorProps };

function isValidOrientation(orientation: any): orientation is Orientation {
  return ORIENTATIONS.includes(orientation);
}
