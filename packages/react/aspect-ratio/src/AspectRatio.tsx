import * as React from 'react';
import { cssReset, interopDataAttrObj, interopSelector } from '@interop-ui/utils';
import { forwardRef, PrimitiveStyles } from '@interop-ui/react-utils';

const WRAPPER_NAME = 'AspectRatio.Root';
const WRAPPER_DEFAULT_TAG = 'div';

type AspectRatioDOMProps = React.ComponentPropsWithoutRef<typeof WRAPPER_DEFAULT_TAG>;
type AspectRatioOwnProps = { ratio?: string };
type AspectRatioProps = AspectRatioDOMProps & AspectRatioOwnProps;

const AspectRatioRoot = forwardRef<typeof WRAPPER_DEFAULT_TAG, AspectRatioProps>(
  function AspectRatioRoot(props, forwardedRef) {
    const { as: Comp = WRAPPER_DEFAULT_TAG, ratio = '1:1', style, ...aspectRatioProps } = props;

    const [n1, n2] = ratio.split(':');
    const paddingBottom = 100 / (Number(n1) / Number(n2));

    return (
      <Comp
        {...aspectRatioProps}
        {...interopDataAttrObj(WRAPPER_NAME)}
        ref={forwardedRef}
        style={{
          paddingBottom: `${paddingBottom}%`,
          ...style,
        }}
      />
    );
  }
);

const INNER_NAME = 'AspectRatio.Inner';
const INNER_DEFAULT_TAG = 'div';

type AspectRatioInnerDOMProps = React.ComponentPropsWithoutRef<typeof WRAPPER_DEFAULT_TAG>;
type AspectRatioInnerOwnProps = {};
type AspectRatioInnerProps = AspectRatioInnerDOMProps & AspectRatioInnerOwnProps;

const AspectRatioInner = forwardRef<typeof INNER_DEFAULT_TAG, AspectRatioInnerProps>(
  function AspectRatioInner(props, forwardedRef) {
    const { as: Comp = INNER_DEFAULT_TAG, ...innerProps } = props;

    return <Comp ref={forwardedRef} {...innerProps} {...interopDataAttrObj(INNER_NAME)} />;
  }
);

const ASPECT_RATIO_NAME = 'AspectRatio';

const AspectRatio = forwardRef<
  typeof WRAPPER_DEFAULT_TAG,
  AspectRatioProps,
  AspectRatioStaticProps
>(function AspectRatio(props, forwardedRef) {
  const { children, ...aspectRatioProps } = props;

  return (
    <AspectRatioRoot
      {...aspectRatioProps}
      {...interopDataAttrObj(ASPECT_RATIO_NAME)}
      ref={forwardedRef}
    >
      <AspectRatioInner>{children}</AspectRatioInner>
    </AspectRatioRoot>
  );
});

AspectRatio.Root = AspectRatioRoot;
AspectRatio.Inner = AspectRatioInner;

AspectRatio.displayName = ASPECT_RATIO_NAME;
AspectRatio.Root.displayName = WRAPPER_NAME;
AspectRatio.Inner.displayName = INNER_NAME;

interface AspectRatioStaticProps {
  Root: typeof AspectRatioRoot;
  Inner: typeof AspectRatioInner;
}

const styles: PrimitiveStyles = {
  [interopSelector(WRAPPER_NAME)]: {
    ...cssReset(WRAPPER_DEFAULT_TAG),
    position: 'relative',
    width: '100%',
  },
  [interopSelector(INNER_NAME)]: {
    ...cssReset(INNER_DEFAULT_TAG),
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
  },
};

export { AspectRatio, styles };
export type { AspectRatioProps, AspectRatioInnerProps };
