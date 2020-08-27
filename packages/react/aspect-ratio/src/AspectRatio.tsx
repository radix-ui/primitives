import * as React from 'react';
import { cssReset } from '@interop-ui/utils';
import { forwardRef, createStyleObj } from '@interop-ui/react-utils';

/* -------------------------------------------------------------------------------------------------
 * AspectRatio
 * -----------------------------------------------------------------------------------------------*/

const ASPECT_RATIO_NAME = 'AspectRatio';
const ASPECT_RATIO__DEFAULT_TAG = 'div';

type AspectRatioDOMProps = React.ComponentPropsWithoutRef<typeof ASPECT_RATIO__DEFAULT_TAG>;
type AspectRatioOwnProps = { ratio?: string };
type AspectRatioProps = AspectRatioDOMProps & AspectRatioOwnProps;

const AspectRatio = forwardRef<
  typeof ASPECT_RATIO__DEFAULT_TAG,
  AspectRatioProps,
  AspectRatioStaticProps
>(function AspectRatio(props, forwardedRef) {
  const { as: Comp = ASPECT_RATIO__DEFAULT_TAG, ratio = '1:1', style, ...aspectRatioProps } = props;

  const [n1, n2] = ratio.split(':');
  const paddingBottom = 100 / (Number(n1) / Number(n2));

  return (
    <Comp
      {...aspectRatioProps}
      {...interopDataAttrObj('root')}
      ref={forwardedRef}
      style={{
        ...style,
        ['--paddingBottom' as any]: `${paddingBottom}%`,
      }}
    />
  );
});

/* -------------------------------------------------------------------------------------------------
 * AspectRatioInner
 * -----------------------------------------------------------------------------------------------*/

const INNER_NAME = 'AspectRatio.Inner';
const INNER_DEFAULT_TAG = 'div';

type AspectRatioInnerDOMProps = React.ComponentPropsWithoutRef<typeof ASPECT_RATIO__DEFAULT_TAG>;
type AspectRatioInnerOwnProps = {};
type AspectRatioInnerProps = AspectRatioInnerDOMProps & AspectRatioInnerOwnProps;

const AspectRatioInner = forwardRef<typeof INNER_DEFAULT_TAG, AspectRatioInnerProps>(
  function AspectRatioInner(props, forwardedRef) {
    const { as: Comp = INNER_DEFAULT_TAG, ...innerProps } = props;

    return <Comp ref={forwardedRef} {...innerProps} {...interopDataAttrObj('inner')} />;
  }
);

AspectRatio.Inner = AspectRatioInner;

AspectRatio.displayName = ASPECT_RATIO_NAME;
AspectRatio.Inner.displayName = INNER_NAME;

interface AspectRatioStaticProps {
  Inner: typeof AspectRatioInner;
}

const [styles, interopDataAttrObj] = createStyleObj(ASPECT_RATIO_NAME, {
  root: {
    ...cssReset(ASPECT_RATIO__DEFAULT_TAG),
    paddingBottom: 'var(--paddingBottom)',
    position: 'relative',
    width: '100%',
  },
  inner: {
    ...cssReset(INNER_DEFAULT_TAG),
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
});

export { AspectRatio, styles };
export type { AspectRatioProps, AspectRatioInnerProps };
