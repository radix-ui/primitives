import * as React from 'react';
import { createContextScope } from '@radix-ui/react-context';
import { useCallbackRef } from '@radix-ui/react-use-callback-ref';
import { useLayoutEffect } from '@radix-ui/react-use-layout-effect';
import { Primitive } from '@radix-ui/react-primitive';

import type { Scope } from '@radix-ui/react-context';

/* -------------------------------------------------------------------------------------------------
 * Avatar
 * -----------------------------------------------------------------------------------------------*/

const AVATAR_NAME = 'Avatar';

type ScopedProps<P> = P & { __scopeAvatar?: Scope };
const [createAvatarContext, createAvatarScope] = createContextScope(AVATAR_NAME);

type ImageLoadingStatus = 'idle' | 'loading' | 'loaded' | 'error';

type AvatarContextValue = {
  imageLoadingStatus: ImageLoadingStatus;
  onImageLoadingStatusChange(status: ImageLoadingStatus): void;
};

const [AvatarProvider, useAvatarContext] = createAvatarContext<AvatarContextValue>(AVATAR_NAME);

type AvatarElement = React.ElementRef<typeof Primitive.span>;
type PrimitiveSpanProps = React.ComponentPropsWithoutRef<typeof Primitive.span>;
interface AvatarProps extends PrimitiveSpanProps {}

const Avatar = React.forwardRef<AvatarElement, AvatarProps>(
  (props: ScopedProps<AvatarProps>, forwardedRef) => {
    const { __scopeAvatar, ...avatarProps } = props;
    const [imageLoadingStatus, setImageLoadingStatus] = React.useState<ImageLoadingStatus>('idle');
    return (
      <AvatarProvider
        scope={__scopeAvatar}
        imageLoadingStatus={imageLoadingStatus}
        onImageLoadingStatusChange={setImageLoadingStatus}
      >
        <Primitive.span {...avatarProps} ref={forwardedRef} />
      </AvatarProvider>
    );
  }
);

Avatar.displayName = AVATAR_NAME;

/* -------------------------------------------------------------------------------------------------
 * AvatarImage
 * -----------------------------------------------------------------------------------------------*/

const IMAGE_NAME = 'AvatarImage';

type AvatarImageElement = React.ElementRef<typeof Primitive.img>;
type PrimitiveImageProps = React.ComponentPropsWithoutRef<typeof Primitive.img>;
interface AvatarImageProps extends PrimitiveImageProps {
  onLoadingStatusChange?: (status: ImageLoadingStatus) => void;
}

const AvatarImage = React.forwardRef<AvatarImageElement, AvatarImageProps>(
  (props: ScopedProps<AvatarImageProps>, forwardedRef) => {
    const { __scopeAvatar, src, onLoadingStatusChange = () => {}, ...imageProps } = props;
    const context = useAvatarContext(IMAGE_NAME, __scopeAvatar);
    const imageLoadingStatus = useImageLoadingStatus(src, imageProps);
    const handleLoadingStatusChange = useCallbackRef((status: ImageLoadingStatus) => {
      onLoadingStatusChange(status);
      context.onImageLoadingStatusChange(status);
    });

    useLayoutEffect(() => {
      if (imageLoadingStatus !== 'idle') {
        handleLoadingStatusChange(imageLoadingStatus);
      }
    }, [imageLoadingStatus, handleLoadingStatusChange]);

    return imageLoadingStatus === 'loaded' ? (
      <Primitive.img {...imageProps} ref={forwardedRef} src={src} />
    ) : null;
  }
);

AvatarImage.displayName = IMAGE_NAME;

/* -------------------------------------------------------------------------------------------------
 * AvatarFallback
 * -----------------------------------------------------------------------------------------------*/

const FALLBACK_NAME = 'AvatarFallback';

type AvatarFallbackElement = React.ElementRef<typeof Primitive.span>;
interface AvatarFallbackProps extends PrimitiveSpanProps {
  delayMs?: number;
}

const AvatarFallback = React.forwardRef<AvatarFallbackElement, AvatarFallbackProps>(
  (props: ScopedProps<AvatarFallbackProps>, forwardedRef) => {
    const { __scopeAvatar, delayMs, ...fallbackProps } = props;
    const context = useAvatarContext(FALLBACK_NAME, __scopeAvatar);
    const [canRender, setCanRender] = React.useState(delayMs === undefined);

    React.useEffect(() => {
      if (delayMs !== undefined) {
        const timerId = window.setTimeout(() => setCanRender(true), delayMs);
        return () => window.clearTimeout(timerId);
      }
    }, [delayMs]);

    return canRender && context.imageLoadingStatus !== 'loaded' ? (
      <Primitive.span {...fallbackProps} ref={forwardedRef} />
    ) : null;
  }
);

AvatarFallback.displayName = FALLBACK_NAME;

/* -----------------------------------------------------------------------------------------------*/

function resolveLoadingStatus(image: HTMLImageElement | null, src?: string): ImageLoadingStatus {
  if (!image) {
    return 'idle';
  }
  if (!src) {
    return 'error';
  }
  if (image.src !== src) {
    image.src = src;
  }
  return image.complete && image.naturalWidth > 0 ? 'loaded' : 'loading';
}

function useImageLoadingStatus(
  src: string | undefined,
  { referrerPolicy, crossOrigin }: AvatarImageProps
) {
  const isHydrated = useIsHydrated();
  const imageRef = React.useRef<HTMLImageElement | null>(null);
  const image = (() => {
    if (!isHydrated) return null;
    if (!imageRef.current) {
      imageRef.current = new window.Image();
    }
    return imageRef.current;
  })();

  const [loadingStatus, setLoadingStatus] = React.useState<ImageLoadingStatus>(() =>
    resolveLoadingStatus(image, src)
  );

  useLayoutEffect(() => {
    setLoadingStatus(resolveLoadingStatus(image, src));
  }, [image, src]);

  useLayoutEffect(() => {
    const updateStatus = (status: ImageLoadingStatus) => () => {
      setLoadingStatus(status);
    };

    if (!image) return;

    const handleLoad = updateStatus('loaded');
    const handleError = updateStatus('error');
    image.addEventListener('load', handleLoad);
    image.addEventListener('error', handleError);
    if (referrerPolicy) {
      image.referrerPolicy = referrerPolicy;
    }
    if (typeof crossOrigin === 'string') {
      image.crossOrigin = crossOrigin;
    }

    return () => {
      image.removeEventListener('load', handleLoad);
      image.removeEventListener('error', handleError);
    };
  }, [image, crossOrigin, referrerPolicy]);

  return loadingStatus;
}

function subscribe() {
  return () => {};
}

function useIsHydrated() {
  return React.useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}

const Root = Avatar;
const Image = AvatarImage;
const Fallback = AvatarFallback;

export {
  createAvatarScope,
  //
  Avatar,
  AvatarImage,
  AvatarFallback,
  //
  Root,
  Image,
  Fallback,
};
export type { AvatarProps, AvatarImageProps, AvatarFallbackProps };
