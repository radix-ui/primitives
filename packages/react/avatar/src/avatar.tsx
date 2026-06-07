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
  setImageLoadingStatus: React.Dispatch<React.SetStateAction<ImageLoadingStatus>>;
  imageCount: number;
  setImageCount: React.Dispatch<React.SetStateAction<number>>;
};

const STATIC_IMAGE_COUNT_STATE: [number, React.Dispatch<React.SetStateAction<number>>] = [
  0,
  () => void 0,
];

const [AvatarProvider, useAvatarContext] = createAvatarContext<AvatarContextValue>(AVATAR_NAME);

type AvatarElement = React.ComponentRef<typeof Primitive.span>;
type PrimitiveSpanProps = React.ComponentPropsWithoutRef<typeof Primitive.span>;
interface AvatarProps extends PrimitiveSpanProps {}

const Avatar = React.forwardRef<AvatarElement, AvatarProps>(
  (props: ScopedProps<AvatarProps>, forwardedRef) => {
    const { __scopeAvatar, ...avatarProps } = props;
    const [imageLoadingStatus, setImageLoadingStatus] = React.useState<ImageLoadingStatus>('idle');
    const [imageCount, setImageCount] = useImageCount();

    return (
      <AvatarProvider
        scope={__scopeAvatar}
        imageLoadingStatus={imageLoadingStatus}
        setImageLoadingStatus={setImageLoadingStatus}
        imageCount={imageCount}
        setImageCount={setImageCount}
      >
        <Primitive.span {...avatarProps} ref={forwardedRef} />
      </AvatarProvider>
    );
  },
);

Avatar.displayName = AVATAR_NAME;

/* -------------------------------------------------------------------------------------------------
 * AvatarImage
 * -----------------------------------------------------------------------------------------------*/

const IMAGE_NAME = 'AvatarImage';

type AvatarImageElement = React.ComponentRef<typeof Primitive.img>;
type PrimitiveImageProps = React.ComponentPropsWithoutRef<typeof Primitive.img>;
interface AvatarImageProps extends PrimitiveImageProps {
  onLoadingStatusChange?: (status: ImageLoadingStatus) => void;
}

const AvatarImage = React.forwardRef<AvatarImageElement, AvatarImageProps>(
  (props: ScopedProps<AvatarImageProps>, forwardedRef) => {
    const { __scopeAvatar, src, onLoadingStatusChange, ...imageProps } = props;
    const context = useAvatarContext(IMAGE_NAME, __scopeAvatar);
    useUpdateImageCount(context.setImageCount);

    const imageLoadingStatus = useImageLoadingStatus(src, {
      referrerPolicy: imageProps.referrerPolicy,
      crossOrigin: imageProps.crossOrigin,
      loadingStatus: context.imageLoadingStatus,
      setLoadingStatus: context.setImageLoadingStatus,
    });
    const handleLoadingStatusChange = useCallbackRef((status: ImageLoadingStatus) => {
      onLoadingStatusChange?.(status);
    });

    const loadingStatusRef = React.useRef<ImageLoadingStatus>(imageLoadingStatus);

    useLayoutEffect(() => {
      const previousLoadingStatus = loadingStatusRef.current;
      loadingStatusRef.current = imageLoadingStatus;

      if (imageLoadingStatus !== previousLoadingStatus) {
        handleLoadingStatusChange(imageLoadingStatus);
      }
    }, [imageLoadingStatus, handleLoadingStatusChange]);

    return imageLoadingStatus === 'loaded' ? (
      <Primitive.img {...imageProps} ref={forwardedRef} src={src} />
    ) : null;
  },
);

AvatarImage.displayName = IMAGE_NAME;

/* -------------------------------------------------------------------------------------------------
 * AvatarFallback
 * -----------------------------------------------------------------------------------------------*/

const FALLBACK_NAME = 'AvatarFallback';

type AvatarFallbackElement = React.ComponentRef<typeof Primitive.span>;
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
  },
);

AvatarFallback.displayName = FALLBACK_NAME;

/* -----------------------------------------------------------------------------------------------*/

function useImageLoadingStatus(
  src: string | undefined,
  {
    loadingStatus,
    setLoadingStatus,
    referrerPolicy,
    crossOrigin,
  }: {
    referrerPolicy: React.HTMLAttributeReferrerPolicy | undefined;
    crossOrigin: string | undefined;
    loadingStatus: ImageLoadingStatus;
    setLoadingStatus: React.Dispatch<React.SetStateAction<ImageLoadingStatus>>;
  },
) {
  useLayoutEffect(() => {
    if (!src) {
      setLoadingStatus('error');
      return;
    }

    const image = new window.Image();
    const handleLoad = (event: Event) => {
      const image = event.currentTarget as HTMLImageElement;
      setLoadingStatus(getImageLoadingStatus(image));
    };
    const handleError = () => setLoadingStatus('error');
    image.addEventListener('load', handleLoad);
    image.addEventListener('error', handleError);
    if (referrerPolicy) {
      image.referrerPolicy = referrerPolicy;
    }
    image.crossOrigin = crossOrigin ?? null;
    image.src = src;

    setLoadingStatus(getImageLoadingStatus(image));
    return () => {
      image.removeEventListener('load', handleLoad);
      image.removeEventListener('error', handleError);
      setLoadingStatus('idle');
    };
  }, [src, crossOrigin, referrerPolicy, setLoadingStatus]);

  return loadingStatus;
}

function getImageLoadingStatus(image: HTMLImageElement) {
  return image.complete ? (image.naturalWidth > 0 ? 'loaded' : 'error') : 'loading';
}

// Image count is only used in development to warn about multiple images, which
// is unsupported. Gating behind a development flag to avoid performance
// overhead in production is safe because useState is guaranteed to run
// consistently in the same environment.
// oxlint-disable react-hooks/rules-of-hooks
function useImageCount() {
  let state = STATIC_IMAGE_COUNT_STATE;
  if (process.env.NODE_ENV === 'development') {
    state = React.useState(0);
    const [imageCount] = state;
    const hasWarnedRef = React.useRef(false);
    React.useEffect(() => {
      if (imageCount > 1 && !hasWarnedRef.current) {
        hasWarnedRef.current = true;
        console.warn(
          'Avatar: Only one `Avatar.Image` component should be rendered per `Avatar.Root`, but multiple were detected. This will lead to unexpected behavior.',
        );
      }
    }, [imageCount]);
  }

  return state;
}

function useUpdateImageCount(setImageCount: React.Dispatch<React.SetStateAction<number>>) {
  if (process.env.NODE_ENV === 'development') {
    React.useEffect(() => {
      setImageCount((imageCount) => imageCount + 1);
      return () => {
        setImageCount((imageCount) => imageCount - 1);
      };
    }, [setImageCount]);
  }
}
// oxlint-enable react-hooks/rules-of-hooks

export {
  createAvatarScope,
  //
  Avatar,
  AvatarImage,
  AvatarFallback,
  //
  Avatar as Root,
  AvatarImage as Image,
  AvatarFallback as Fallback,
};
export type { AvatarProps, AvatarImageProps, AvatarFallbackProps };
