import * as React from 'react';
import { getSelector } from '@radix-ui/utils';
import { createContext, useCallbackRef, useLayoutEffect } from '@radix-ui/react-utils';
import { forwardRefWithAs } from '@radix-ui/react-polymorphic';
import { Primitive } from '@radix-ui/react-primitive';

import type { OwnProps, MergeOwnProps } from '@radix-ui/react-polymorphic';

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

const Avatar = forwardRefWithAs<typeof AVATAR_DEFAULT_TAG, OwnProps<typeof Primitive>>(
  (props, forwardedRef) => {
    const { children, ...avatarProps } = props;
    const context = React.useState<ImageLoadingStatus>('idle');
    return (
      <Primitive
        as={AVATAR_DEFAULT_TAG}
        selector={getSelector(AVATAR_NAME)}
        {...avatarProps}
        ref={forwardedRef}
      >
        <AvatarContext.Provider value={context}>{children}</AvatarContext.Provider>
      </Primitive>
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
};

const AvatarImage = forwardRefWithAs<
  typeof IMAGE_DEFAULT_TAG,
  MergeOwnProps<typeof Primitive, AvatarImageOwnProps>
>((props, forwardedRef) => {
  const { src, onLoadingStatusChange: onLoadingStatusChangeProp = () => {}, ...imageProps } = props;
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
    <Primitive
      as={IMAGE_DEFAULT_TAG}
      selector={getSelector(IMAGE_NAME)}
      {...imageProps}
      src={src}
      ref={forwardedRef}
    />
  ) : null;
});

AvatarImage.displayName = IMAGE_NAME;

/* -------------------------------------------------------------------------------------------------
 * AvatarFallback
 * -----------------------------------------------------------------------------------------------*/

const FALLBACK_NAME = 'AvatarFallback';
const FALLBACK_DEFAULT_TAG = 'span';

type AvatarFallbackOwnProps = {
  delayMs?: number;
};

const AvatarFallback = forwardRefWithAs<
  typeof FALLBACK_DEFAULT_TAG,
  MergeOwnProps<typeof Primitive, AvatarFallbackOwnProps>
>((props, forwardedRef) => {
  const { delayMs, ...fallbackProps } = props;
  const [imageLoadingStatus] = useAvatarContext(FALLBACK_NAME);
  const [canRender, setCanRender] = React.useState(delayMs === undefined);

  React.useEffect(() => {
    if (delayMs !== undefined) {
      const timerId = window.setTimeout(() => setCanRender(true), delayMs);
      return () => window.clearTimeout(timerId);
    }
  }, [delayMs]);

  return canRender && imageLoadingStatus !== 'loaded' ? (
    <Primitive
      as={FALLBACK_DEFAULT_TAG}
      selector={getSelector(FALLBACK_NAME)}
      {...fallbackProps}
      ref={forwardedRef}
    />
  ) : null;
});

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
