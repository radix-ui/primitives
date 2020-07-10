import * as React from 'react';
import { cssReset } from '@interop-ui/utils';
import { forwardRef } from '@interop-ui/react-utils';

const WRAPPER_DEFAULT_TAG = 'div';

type AspectRatioDOMProps = React.ComponentPropsWithoutRef<typeof WRAPPER_DEFAULT_TAG>;
type AspectRatioOwnProps = { ratio?: string };
type AspectRatioProps = AspectRatioDOMProps & AspectRatioOwnProps;

const AspectRatioContainer = forwardRef<typeof WRAPPER_DEFAULT_TAG, AspectRatioProps>(
  function AspectRatioContainer(props, forwardedRef) {
    const { as: Comp = WRAPPER_DEFAULT_TAG, ratio = '1:1', style, ...aspectRatioProps } = props;

    const [n1, n2] = ratio.split(':');
    const paddingBottom = 100 / (Number(n1) / Number(n2));

    return (
      <Comp
        {...aspectRatioProps}
        ref={forwardedRef}
        style={{
          paddingBottom: `${paddingBottom}%`,
          ...style,
        }}
      />
    );
  }
);

AspectRatioContainer.displayName = 'AspectRatio.Container';

const INNER_DEFAULT_TAG = 'div';

type AspectRatioInnerDOMProps = React.ComponentPropsWithoutRef<typeof WRAPPER_DEFAULT_TAG>;
type AspectRatioInnerOwnProps = {};
type AspectRatioInnerProps = AspectRatioInnerDOMProps & AspectRatioInnerOwnProps;

const AspectRatioInner = forwardRef<typeof INNER_DEFAULT_TAG, AspectRatioInnerProps>(
  function AspectRatioInner(props, forwardedRef) {
    const { as: Comp = INNER_DEFAULT_TAG, ...innerProps } = props;

    return <Comp ref={forwardedRef} {...innerProps} />;
  }
);

AspectRatioInner.displayName = 'AspectRatio.Inner';

const AspectRatio = forwardRef<typeof WRAPPER_DEFAULT_TAG, AspectRatioProps>(function AspectRatio(
  props,
  forwardedRef
) {
  const { children, ...aspectRatioProps } = props;

  return (
    <AspectRatioContainer {...aspectRatioProps} ref={forwardedRef}>
      <AspectRatioInner>{children}</AspectRatioInner>
    </AspectRatioContainer>
  );
}) as IAspectRatio;

AspectRatio.displayName = 'AspectRatio';

AspectRatio.Container = AspectRatioContainer;
AspectRatio.Inner = AspectRatioInner;

interface IAspectRatio extends React.ForwardRefExoticComponent<AspectRatioProps> {
  Container: typeof AspectRatioContainer;
  Inner: typeof AspectRatioInner;
}

const styles = {
  container: {
    ...cssReset(WRAPPER_DEFAULT_TAG),
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
  },
};

export { AspectRatio, styles };
export type { AspectRatioProps, AspectRatioInnerProps };
