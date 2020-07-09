import * as React from 'react';
import { AvatarIcon } from '@modulz/radix-icons';
import { Image as ImagePrimitive } from '@interop-ui/react-image';
import { cssReset } from '@interop-ui/utils';
import { forwardRef } from '@interop-ui/react-utils';

const DEFAULT_TAG = 'span';

type AvatarDOMProps = React.ComponentPropsWithoutRef<typeof DEFAULT_TAG>;
type AvatarOwnProps = {
  src?: string;
  alt?: string;
};
type AvatarProps = AvatarDOMProps & AvatarOwnProps;

const Avatar = forwardRef<typeof DEFAULT_TAG, AvatarProps>(function Avatar(props, forwardedRef) {
  const { alt, as: Comp = DEFAULT_TAG, children: childrenProp, src, style, ...avatarProps } = props;

  const imageLoadingStatus = useImageLoadingStatus(src);
  const hasImage = Boolean(src);
  const hasWorkingImage = hasImage && imageLoadingStatus !== 'error';

  let children = null;

  if (hasWorkingImage) {
    children = (
      <ImagePrimitive
        src={src}
        alt={alt}
        style={{
          ...cssReset(DEFAULT_TAG),
          width: '100%',
          height: '100%',
          // Make sure images are not distorted
          objectFit: 'cover',
          // Remove alt text (appears in some browsers when image doesn't load)
          color: 'transparent',
          // Hide the image broken icon (Chrome only)
          textIndent: 10000,
        }}
      />
    );
  } else if (childrenProp !== undefined) {
    children = childrenProp;
  } else if (hasImage && alt !== undefined) {
    children = alt[0];
  } else {
    children = <AvatarIcon />;
  }

  return (
    <Comp
      {...avatarProps}
      ref={forwardedRef}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        verticalAlign: 'middle',
        overflow: 'hidden',
        userSelect: 'none',
        ...style,
      }}
    >
      {children}
    </Comp>
  );
});

Avatar.displayName = 'Avatar';

type ImageLoadingStatus = 'idle' | 'loading' | 'loaded' | 'error';

function useImageLoadingStatus(src?: string) {
  const [loadingStatus, setLoadingStatus] = React.useState<ImageLoadingStatus>('idle');

  React.useEffect(() => {
    if (!src) {
      return undefined;
    }

    setLoadingStatus('loading');

    let isMounted = true;
    const image = new Image();
    image.src = src;
    image.onload = () => {
      if (!isMounted) return;
      setLoadingStatus('loaded');
    };
    image.onerror = () => {
      if (!isMounted) return;
      setLoadingStatus('error');
    };

    return () => {
      isMounted = false;
    };
  }, [src]);

  return loadingStatus;
}

export type { AvatarProps };
export { Avatar };
