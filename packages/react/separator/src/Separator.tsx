import * as React from 'react';
import { forwardRef, createStyleObj } from '@interop-ui/react-utils';
import { cssReset } from '@interop-ui/utils';

const NAME = 'Separator';
const DEFAULT_TAG = 'hr';
const DEFAULT_ORIENTATION = 'horizontal';

type Orientation = 'vertical' | 'horizontal';
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
  let {
    as: Comp = DEFAULT_TAG,
    decorative,
    orientation: orientationProp = DEFAULT_ORIENTATION,
    ...domProps
  } = props;

  let orientation = orientationProp;
  if (!isValidOrientation(orientation)) {
    orientation = DEFAULT_ORIENTATION;
  }

  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    React.useEffect(() => {
      if (orientationProp && !isValidOrientation(orientationProp)) {
        console.warn(
          'An invalid `orientation` prop was passed to ' +
            NAME +
            '. Only `vertical` and `horizontal` are valid orientations. Defaulting to `' +
            DEFAULT_ORIENTATION +
            '`.'
        );
      }
    }, [orientationProp]);
  }

  // `aria-orientation` defaults to `horizontal` so we only need it if `orientation` is vertical
  let ariaOrientation: 'vertical' | undefined;
  if (orientation === 'vertical') {
    ariaOrientation = 'vertical';
  }

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

export { Separator, styles };
export type { SeparatorProps };

function isValidOrientation(orientation: any): orientation is Orientation {
  return ['horizontal', 'vertical'].includes(orientation);
}
