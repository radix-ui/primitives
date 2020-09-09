import * as React from 'react';
import { cssReset, interopDataAttr } from '@interop-ui/utils';
import { forwardRef, createStyleObj } from '@interop-ui/react-utils';

/* -------------------------------------------------------------------------------------------------
 * AspectRatio
 * -----------------------------------------------------------------------------------------------*/

const ASPECT_RATIO_NAME = 'AspectRatio';
const ASPECT_RATIO__DEFAULT_TAG = 'div';

const INNER_DATA_ATTR = interopDataAttr('AspectRatio.Inner');
const INNER_DEFAULT_TAG = 'div';

type AspectRatioDOMProps = React.ComponentPropsWithoutRef<typeof ASPECT_RATIO__DEFAULT_TAG>;
type AspectRatioOwnProps = { ratio?: number };
type AspectRatioProps = AspectRatioDOMProps & AspectRatioOwnProps;

const AspectRatio = forwardRef<typeof ASPECT_RATIO__DEFAULT_TAG, AspectRatioProps>(
  function AspectRatio(props, forwardedRef) {
    const {
      as: Comp = ASPECT_RATIO__DEFAULT_TAG,
      ratio = 1 / 1,
      style,
      children,
      ...aspectRatioProps
    } = props;

    const paddingBottom = 100 / ratio;
    const innerDataAttrObj = { [INNER_DATA_ATTR]: '' };
    const Inner = INNER_DEFAULT_TAG;

    return (
      <Comp
        {...aspectRatioProps}
        {...interopDataAttrObj('root')}
        ref={forwardedRef}
        style={{
          ...style,
          // Using `any` here recommended by the React.CSSProperties interface definition:
          // https://github.com/frenic/csstype#what-should-i-do-when-i-get-type-errors
          ['--paddingBottom' as any]: `${paddingBottom}%`,
        }}
      >
        <Inner {...innerDataAttrObj}>{children}</Inner>
      </Comp>
    );
  }
);

AspectRatio.displayName = ASPECT_RATIO_NAME;

const [styles, interopDataAttrObj] = createStyleObj(ASPECT_RATIO_NAME, {
  root: {
    ...cssReset(ASPECT_RATIO__DEFAULT_TAG),
    paddingBottom: 'var(--paddingBottom)',
    position: 'relative',
    width: '100%',

    [`& > [${INNER_DATA_ATTR}]`]: {
      ...cssReset(INNER_DEFAULT_TAG),
      position: 'absolute',
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
      overflow: 'hidden',
    },
  },
});

export { AspectRatio, styles };
export type { AspectRatioProps };
