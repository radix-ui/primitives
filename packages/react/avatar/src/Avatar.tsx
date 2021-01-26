import * as React from 'react';
import { getSelector } from '@radix-ui/utils';
import { createContext, useCallbackRef, useLayoutEffect } from '@radix-ui/react-utils';
import { Primitive } from '@radix-ui/react-primitive';

import type * as Polymorphic from '@radix-ui/react-polymorphic';
import { Merge } from '@radix-ui/utils';

/* -------------------------------------------------------------------------------------------------
 * Avatar
 * -----------------------------------------------------------------------------------------------*/

const AVATAR_NAME = 'Avatar';
const AVATAR_DEFAULT_TAG = 'span';

type ImageLoadingStatus = 'idle' | 'loading' | 'loaded' | 'error';
type AvatarOwnProps = Polymorphic.OwnProps<typeof Primitive>;
type AvatarPrimitive = Polymorphic.ForwardRefComponent<typeof AVATAR_DEFAULT_TAG, AvatarOwnProps>;
type AvatarContextValue = [
  ImageLoadingStatus,
  React.Dispatch<React.SetStateAction<ImageLoadingStatus>>
];

const [AvatarContext, useAvatarContext] = createContext<AvatarContextValue>(
  'AvatarContext',
  AVATAR_NAME
);

const Avatar = React.forwardRef((props, forwardedRef) => {
  const {
    as = AVATAR_DEFAULT_TAG,
    selector = getSelector(AVATAR_NAME),
    children,
    ...avatarProps
  } = props;
  const context = React.useState<ImageLoadingStatus>('idle');
  return (
    <Primitive {...avatarProps} as={as} selector={selector} ref={forwardedRef}>
      <AvatarContext.Provider value={context}>{children}</AvatarContext.Provider>
    </Primitive>
  );
}) as AvatarPrimitive;

Avatar.displayName = AVATAR_NAME;

/* -------------------------------------------------------------------------------------------------
 * AvatarImage
 * -----------------------------------------------------------------------------------------------*/

const IMAGE_NAME = 'AvatarImage';
const IMAGE_DEFAULT_TAG = 'img';

type AvatarImageOwnProps = Merge<
  Polymorphic.OwnProps<typeof Primitive>,
  { onLoadingStatusChange?: (status: ImageLoadingStatus) => void }
>;

type AvatarImagePrimitive = Polymorphic.ForwardRefComponent<
  typeof IMAGE_DEFAULT_TAG,
  AvatarImageOwnProps
>;

const AvatarImage = React.forwardRef((props, forwardedRef) => {
  const {
    as = IMAGE_DEFAULT_TAG,
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
    <Primitive {...imageProps} as={as} selector={selector} ref={forwardedRef} src={src} />
  ) : null;
}) as AvatarImagePrimitive;

AvatarImage.displayName = IMAGE_NAME;

/* -------------------------------------------------------------------------------------------------
 * AvatarFallback
 * -----------------------------------------------------------------------------------------------*/

const FALLBACK_NAME = 'AvatarFallback';
const FALLBACK_DEFAULT_TAG = 'span';

type AvatarFallbackOwnProps = Merge<Polymorphic.OwnProps<typeof Primitive>, { delayMs?: number }>;
type AvatarFallbackPrimitive = Polymorphic.ForwardRefComponent<
  typeof FALLBACK_DEFAULT_TAG,
  AvatarFallbackOwnProps
>;

const AvatarFallback = React.forwardRef((props, forwardedRef) => {
  const {
    as = FALLBACK_DEFAULT_TAG,
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
    <Primitive {...fallbackProps} as={as} selector={selector} ref={forwardedRef} />
  ) : null;
}) as AvatarFallbackPrimitive;

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
