import * as React from 'react';
import { getPartDataAttrObj } from '@interop-ui/utils';
import {
  createContext,
  forwardRef,
  useCallbackRef,
  useLayoutEffect,
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
      <Comp {...getPartDataAttrObj(AVATAR_NAME)} {...avatarProps} ref={forwardedRef}>
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

type AvatarImageDOMProps = React.ComponentPropsWithoutRef<typeof IMAGE_DEFAULT_TAG>;
type AvatarImageOwnProps = { onLoadingStatusChange?: (status: ImageLoadingStatus) => void };
type AvatarImageProps = AvatarImageDOMProps & AvatarImageOwnProps;

const AvatarImage = forwardRef<typeof IMAGE_DEFAULT_TAG, AvatarImageProps>(function AvatarImage(
  props,
  forwardedRef
) {
  const {
    as: Comp = IMAGE_DEFAULT_TAG,
    src,
    onLoadingStatusChange: onLoadingStatusChangeProp = () => {},
    ...imageProps
  } = props;
  const [, setImageLoadingStatus] = useAvatarContext(IMAGE_NAME);
  const imageLoadingStatus = useImageLoadingStatus(src);
  const onLoadingStatusChange = useCallbackRef(onLoadingStatusChangeProp);

  useLayoutEffect(() => {
    if (imageLoadingStatus !== 'idle') {
      onLoadingStatusChange(imageLoadingStatus);
      setImageLoadingStatus(imageLoadingStatus);
    }
  }, [imageLoadingStatus, setImageLoadingStatus, onLoadingStatusChange]);

  return imageLoadingStatus === 'loaded' ? (
    <Comp {...imageProps} {...getPartDataAttrObj(IMAGE_NAME)} src={src} ref={forwardedRef} />
  ) : null;
});

/* -------------------------------------------------------------------------------------------------
 * AvatarFallback
 * -----------------------------------------------------------------------------------------------*/

const FALLBACK_NAME = 'Avatar.Fallback';
const FALLBACK_DEFAULT_TAG = 'span';

type AvatarFallbackDOMProps = React.ComponentPropsWithoutRef<typeof FALLBACK_DEFAULT_TAG>;
type AvatarFallbackOwnProps = { delayMs?: number };
type AvatarFallbackProps = AvatarFallbackDOMProps & AvatarFallbackOwnProps;

const AvatarFallback = forwardRef<typeof FALLBACK_DEFAULT_TAG, AvatarFallbackProps>(
  function AvatarFallback(props, forwardedRef) {
    const { as: Comp = FALLBACK_DEFAULT_TAG, delayMs, ...fallbackProps } = props;
    const [imageLoadingStatus] = useAvatarContext(FALLBACK_NAME);
    const [canRender, setCanRender] = React.useState(delayMs === undefined);

    React.useEffect(() => {
      if (delayMs !== undefined) {
        const timerId = window.setTimeout(() => setCanRender(true), delayMs);
        return () => window.clearTimeout(timerId);
      }
    }, [delayMs]);

    return canRender && imageLoadingStatus !== 'loaded' ? (
      <Comp {...fallbackProps} {...getPartDataAttrObj(FALLBACK_NAME)} ref={forwardedRef} />
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

export { Avatar };
export type { AvatarProps, AvatarImageProps, AvatarFallbackProps };
