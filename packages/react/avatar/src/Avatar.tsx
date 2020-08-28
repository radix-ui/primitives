import * as React from 'react';
import { Image as ImagePrimitive } from '@interop-ui/react-image';
import { cssReset } from '@interop-ui/utils';
import {
  createContext,
  forwardRef,
  createStyleObj,
  useCallbackRef,
  useIsomorphicLayoutEffect,
} from '@interop-ui/react-utils';

/* -------------------------------------------------------------------------------------------------
 * Avatar
 * -----------------------------------------------------------------------------------------------*/

const AVATAR_NAME = 'Avatar';
const AVATAR_DEFAULT_TAG = 'span';

type AvatarDOMProps = React.ComponentPropsWithoutRef<typeof AVATAR_DEFAULT_TAG>;
type AvatarOwnProps = { onLoadingStatusChange?: (status: ImageLoadingStatus) => void };
type AvatarProps = AvatarDOMProps & AvatarOwnProps;
type AvatarContextValue = [
  ImageLoadingStatus,
  React.Dispatch<React.SetStateAction<ImageLoadingStatus>>
];

const [AvatarContext, useAvatarContext] = createContext<AvatarContextValue>(
  'AvatarContext',
  AVATAR_NAME
);

const Avatar = forwardRef<typeof AVATAR_DEFAULT_TAG, AvatarProps, AvatarStaticProps>(
  function Avatar(props, forwardedRef) {
    const { as: Comp = AVATAR_DEFAULT_TAG, children, ...avatarProps } = props;
    const context = React.useState<ImageLoadingStatus>('idle');

    return (
      <Comp {...interopDataAttrObj('root')} {...avatarProps} ref={forwardedRef}>
        <AvatarContext.Provider value={context}>{children}</AvatarContext.Provider>
      </Comp>
    );
  }
);

/* -------------------------------------------------------------------------------------------------
 * AvatarImage
 * -----------------------------------------------------------------------------------------------*/

const IMAGE_NAME = 'Avatar.Image';
const IMAGE_DEFAULT_TAG = 'img';

type AvatarImageDOMProps = React.ComponentPropsWithRef<typeof ImagePrimitive>;
type AvatarImageOwnProps = { onLoadingStatusChange?: (status: ImageLoadingStatus) => void };
type AvatarImageProps = AvatarImageDOMProps & AvatarImageOwnProps;

const AvatarImage = forwardRef<
  // This silences type errors for now but will change
  // when the `PrimitiveComponent` type for consumers is added
  React.ElementType<React.ComponentPropsWithRef<typeof ImagePrimitive>>,
  AvatarImageProps
>(function AvatarImage(props, forwardedRef) {
  const {
    as: Comp = ImagePrimitive,
    src,
    onLoadingStatusChange: onLoadingStatusChangeProp = () => {},
    ...imageProps
  } = props;
  const [, setImageLoadingStatus] = useAvatarContext(IMAGE_NAME);
  const imageLoadingStatus = useImageLoadingStatus(src);
  const onLoadingStatusChange = useCallbackRef(onLoadingStatusChangeProp);

  useIsomorphicLayoutEffect(() => {
    if (imageLoadingStatus !== 'idle') {
      onLoadingStatusChange(imageLoadingStatus);
      setImageLoadingStatus(imageLoadingStatus);
    }
  }, [imageLoadingStatus, setImageLoadingStatus, onLoadingStatusChange]);

  return imageLoadingStatus === 'loaded' ? (
    <Comp {...imageProps} {...interopDataAttrObj('image')} src={src} ref={forwardedRef} />
  ) : null;
});

/* -------------------------------------------------------------------------------------------------
 * AvatarFallback
 * -----------------------------------------------------------------------------------------------*/

const FALLBACK_NAME = 'Avatar.Fallback';
const FALLBACK_DEFAULT_TAG = 'span';

type AvatarFallbackDOMProps = React.ComponentPropsWithoutRef<typeof FALLBACK_DEFAULT_TAG>;
type AvatarFallbackOwnProps = {};
type AvatarFallbackProps = AvatarFallbackDOMProps & AvatarFallbackOwnProps;

const AvatarFallback = forwardRef<typeof FALLBACK_DEFAULT_TAG, AvatarFallbackProps>(
  function AvatarFallback(props, forwardedRef) {
    const { as: Comp = FALLBACK_DEFAULT_TAG, ...fallbackProps } = props;
    const [imageLoadingStatus] = useAvatarContext(FALLBACK_NAME);
    return imageLoadingStatus !== 'idle' && imageLoadingStatus !== 'loaded' ? (
      <Comp {...fallbackProps} {...interopDataAttrObj('fallback')} ref={forwardedRef} />
    ) : null;
  }
);

Avatar.Image = AvatarImage;
Avatar.Fallback = AvatarFallback;

Avatar.displayName = AVATAR_NAME;
Avatar.Image.displayName = IMAGE_NAME;
Avatar.Fallback.displayName = FALLBACK_NAME;

interface AvatarStaticProps {
  Image: typeof AvatarImage;
  Fallback: typeof AvatarFallback;
}

type ImageLoadingStatus = 'idle' | 'loading' | 'loaded' | 'error';

function useImageLoadingStatus(src?: string) {
  const [loadingStatus, setLoadingStatus] = React.useState<ImageLoadingStatus>('idle');

  React.useEffect(() => {
    if (!src) {
      setLoadingStatus('error');
      return;
    }

    let isMounted = true;
    const image = new Image();

    const updateStatus = (status: ImageLoadingStatus) => () => {
      if (!isMounted) return;
      setLoadingStatus(status);
    };

    setLoadingStatus('loading');
    image.onload = updateStatus('loaded');
    image.onerror = updateStatus('error');
    image.src = src;

    return () => {
      isMounted = false;
    };
  }, [src]);

  return loadingStatus;
}

const [styles, interopDataAttrObj] = createStyleObj(AVATAR_NAME, {
  root: {
    ...cssReset(AVATAR_DEFAULT_TAG),
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    verticalAlign: 'middle',
    overflow: 'hidden',
    userSelect: 'none',
  },
  image: {
    ...cssReset(IMAGE_DEFAULT_TAG),
    width: '100%',
    height: '100%',
    // Make sure images are not distorted
    objectFit: 'cover',
  },
  fallback: {
    ...cssReset(FALLBACK_DEFAULT_TAG),
  },
});

export type { AvatarProps, AvatarImageProps, AvatarFallbackProps };
export { Avatar, styles };
