import * as React from 'react';
import { getSelector, getSelectorObj } from '@radix-ui/utils';
import { createContext, useCallbackRef, useLayoutEffect } from '@radix-ui/react-utils';
import { forwardRefWithAs } from '@radix-ui/react-polymorphic';

/* -------------------------------------------------------------------------------------------------
 * Avatar
 * -----------------------------------------------------------------------------------------------*/

const AVATAR_NAME = 'Avatar';
const AVATAR_DEFAULT_TAG = 'span';

type ImageLoadingStatus = 'idle' | 'loading' | 'loaded' | 'error';
type AvatarContextValue = [
  ImageLoadingStatus,
  React.Dispatch<React.SetStateAction<ImageLoadingStatus>>
];

const [AvatarContext, useAvatarContext] = createContext<AvatarContextValue>(
  'AvatarContext',
  AVATAR_NAME
);

type AvatarOwnProps = {
  /**
   * A string to use as the component selector for CSS purposes. It will be added as
   * a data attribute. Pass `null` to remove selector.
   *
   * @defaultValue radix-avatar
   */
  selector?: string | null;
};

const Avatar = forwardRefWithAs<typeof AVATAR_DEFAULT_TAG, AvatarOwnProps>(
  (props, forwardedRef) => {
    const {
      as: Comp = AVATAR_DEFAULT_TAG,
      selector = getSelector(AVATAR_NAME),
      children,
      ...avatarProps
    } = props;
    const context = React.useState<ImageLoadingStatus>('idle');
    return (
      <Comp {...avatarProps} {...getSelectorObj(selector)} ref={forwardedRef}>
        <AvatarContext.Provider value={context}>{children}</AvatarContext.Provider>
      </Comp>
    );
  }
);

Avatar.displayName = AVATAR_NAME;

/* -------------------------------------------------------------------------------------------------
 * AvatarImage
 * -----------------------------------------------------------------------------------------------*/

const IMAGE_NAME = 'AvatarImage';
const IMAGE_DEFAULT_TAG = 'img';

type AvatarImageOwnProps = {
  onLoadingStatusChange?: (status: ImageLoadingStatus) => void;
  /**
   * A string to use as the component selector for CSS purposes. It will be added as
   * a data attribute. Pass `null` to remove selector.
   *
   * @defaultValue radix-avatar-image
   */
  selector?: string | null;
};

const AvatarImage = forwardRefWithAs<typeof IMAGE_DEFAULT_TAG, AvatarImageOwnProps>(
  (props, forwardedRef) => {
    const {
      as: Comp = IMAGE_DEFAULT_TAG,
      selector = getSelector(IMAGE_NAME),
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
      <Comp {...imageProps} {...getSelectorObj(selector)} src={src} ref={forwardedRef} />
    ) : null;
  }
);

AvatarImage.displayName = IMAGE_NAME;

/* -------------------------------------------------------------------------------------------------
 * AvatarFallback
 * -----------------------------------------------------------------------------------------------*/

const FALLBACK_NAME = 'AvatarFallback';
const FALLBACK_DEFAULT_TAG = 'span';

type AvatarFallbackOwnProps = {
  delayMs?: number;
  /**
   * A string to use as the component selector for CSS purposes. It will be added as
   * a data attribute. Pass `null` to remove selector.
   *
   * @defaultValue radix-avatar-fallback
   */
  selector?: string | null;
};

const AvatarFallback = forwardRefWithAs<typeof FALLBACK_DEFAULT_TAG, AvatarFallbackOwnProps>(
  (props, forwardedRef) => {
    const {
      as: Comp = FALLBACK_DEFAULT_TAG,
      selector = getSelector(FALLBACK_NAME),
      delayMs,
      ...fallbackProps
    } = props;
    const [imageLoadingStatus] = useAvatarContext(FALLBACK_NAME);
    const [canRender, setCanRender] = React.useState(delayMs === undefined);

    React.useEffect(() => {
      if (delayMs !== undefined) {
        const timerId = window.setTimeout(() => setCanRender(true), delayMs);
        return () => window.clearTimeout(timerId);
      }
    }, [delayMs]);

    return canRender && imageLoadingStatus !== 'loaded' ? (
      <Comp {...fallbackProps} {...getSelectorObj(selector)} ref={forwardedRef} />
    ) : null;
  }
);

AvatarFallback.displayName = FALLBACK_NAME;

/* -----------------------------------------------------------------------------------------------*/

function useImageLoadingStatus(src?: string) {
  const [loadingStatus, setLoadingStatus] = React.useState<ImageLoadingStatus>('idle');

  React.useEffect(() => {
    if (!src) {
      setLoadingStatus('error');
      return;
    }

    let isMounted = true;
    const image = new window.Image();

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
const Root = Avatar;
const Image = AvatarImage;
const Fallback = AvatarFallback;

export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  //
  Root,
  Image,
  Fallback,
};
