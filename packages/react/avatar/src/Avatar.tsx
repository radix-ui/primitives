import * as React from 'react';
import { AvatarIcon as RadixIcon } from '@modulz/radix-icons';
import { Image as ImagePrimitive } from '@interop-ui/react-image';
import { cssReset, interopDataAttrObj, isFunction, interopSelector } from '@interop-ui/utils';
import { createContext, forwardRef, PrimitiveStyles } from '@interop-ui/react-utils';

const CONTAINER_NAME = 'Avatar.Root';
const CONTAINER_DEFAULT_TAG = 'span';

type AvatarDOMProps = React.ComponentPropsWithoutRef<typeof CONTAINER_DEFAULT_TAG>;
type AvatarOwnProps = {
  src?: string;
  alt?: string;
  renderFallback?: React.ReactNode;
  renderLoading?: React.ReactNode;
};
type AvatarProps = AvatarDOMProps & AvatarOwnProps;

type AvatarRenderType = 'LOADING' | 'ICON' | 'IMAGE' | 'FALLBACK' | 'ALT_ABBR';

interface AvatarContextValue {
  src: string | undefined;
  alt: string | undefined;
  whatToRender: AvatarRenderType;
}

const [AvatarContext, useAvatarContext] = createContext<AvatarContextValue>(
  'AvatarContext',
  CONTAINER_NAME
);

const AvatarRoot = forwardRef<typeof CONTAINER_DEFAULT_TAG, AvatarProps>(function AvatarRoot(
  props,
  forwardedRef
) {
  const {
    alt,
    as: Comp = CONTAINER_DEFAULT_TAG,
    children,
    renderFallback,
    renderLoading,
    src,
    style,
    ...avatarProps
  } = props;

  let imageLoadingStatus = useImageLoadingStatus(src);
  let hasImage = Boolean(src);

  let whatToRender: AvatarRenderType = 'ICON';
  if (hasImage) {
    if (imageLoadingStatus === 'loading') {
      whatToRender = isFunction(renderLoading) ? 'LOADING' : 'IMAGE';
    } else if (imageLoadingStatus === 'error') {
      whatToRender = isFunction(renderFallback)
        ? 'FALLBACK'
        : alt !== undefined
        ? 'ALT_ABBR'
        : 'ICON';
    } else {
      whatToRender = 'IMAGE';
    }
  } else {
    whatToRender = isFunction(renderFallback) ? 'FALLBACK' : 'ICON';
  }

  const ctx = React.useMemo(() => {
    return {
      alt,
      src,
      whatToRender,
    };
  }, [alt, src, whatToRender]);

  return (
    <AvatarContext.Provider value={ctx}>
      <Comp {...interopDataAttrObj(CONTAINER_NAME)} {...avatarProps} ref={forwardedRef}>
        {whatToRender === 'FALLBACK'
          ? (renderFallback as Function)()
          : whatToRender === 'LOADING'
          ? (renderLoading as Function)()
          : children}
      </Comp>
    </AvatarContext.Provider>
  );
});

const IMAGE_NAME = 'Avatar.Image';
const IMAGE_DEFAULT_TAG = 'img';

type AvatarImageDOMProps = React.ComponentPropsWithRef<typeof IMAGE_DEFAULT_TAG>;
type AvatarImageOwnProps = {};
type AvatarImageProps = AvatarImageDOMProps & AvatarImageOwnProps;

const AvatarImage = forwardRef<typeof IMAGE_DEFAULT_TAG, AvatarImageProps>(function AvatarImage(
  props,
  forwardedRef
) {
  let { as: Comp = ImagePrimitive, children: _, ...imageProps } = props;
  let { src, alt, whatToRender } = useAvatarContext(IMAGE_NAME);
  return whatToRender === 'IMAGE' ? (
    <Comp
      {...interopDataAttrObj(IMAGE_NAME)}
      ref={forwardedRef}
      src={src}
      alt={alt}
      {...imageProps}
    />
  ) : null;
});

const ICON_NAME = 'Avatar.Icon';
const ICON_DEFAULT_TAG = 'svg';

type AvatarIconDOMProps = React.ComponentPropsWithoutRef<typeof ICON_DEFAULT_TAG>;
type AvatarIconOwnProps = {};
type AvatarIconProps = AvatarIconDOMProps & AvatarIconOwnProps;

const AvatarIcon = forwardRef<typeof ICON_DEFAULT_TAG, AvatarIconProps>(function AvatarIcon(
  props,
  forwardedRef
) {
  let { as: Comp = RadixIcon as any, ...iconProps } = props;
  let { whatToRender } = useAvatarContext(ICON_NAME);
  return whatToRender === 'ICON' ? (
    <Comp {...interopDataAttrObj(ICON_NAME)} ref={forwardedRef} {...iconProps} />
  ) : null;
});

const ABBR_NAME = 'Avatar.Abbr';
const ABBR_DEFAULT_TAG = 'span';

type AvatarAbbrDOMProps = React.ComponentPropsWithoutRef<typeof ABBR_DEFAULT_TAG>;
type AvatarAbbrOwnProps = {};
type AvatarAbbrProps = AvatarAbbrDOMProps & AvatarAbbrOwnProps;

const AvatarAbbr = forwardRef<typeof ABBR_DEFAULT_TAG, AvatarAbbrProps>(function AvatarAbbr(
  props,
  forwardedRef
) {
  let { as: Comp = 'span', children, ...abbrProps } = props;
  let { alt, whatToRender } = useAvatarContext(ABBR_NAME);
  return alt && whatToRender === 'ALT_ABBR' ? (
    <Comp {...interopDataAttrObj(ABBR_NAME)} aria-hidden ref={forwardedRef} {...abbrProps}>
      {alt[0]}
    </Comp>
  ) : null;
});

const AVATAR_NAME = 'Avatar';
const AVATAR_DEFAULT_TAG = CONTAINER_DEFAULT_TAG;

const Avatar = forwardRef<typeof AVATAR_DEFAULT_TAG, AvatarProps, AvatarStaticProps>(
  function Avatar(props, forwardedRef) {
    const { children, ...avatarProps } = props;

    return (
      <AvatarRoot ref={forwardedRef} {...avatarProps} {...interopDataAttrObj(AVATAR_NAME)}>
        <AvatarImage />
        <AvatarIcon />
        <AvatarAbbr />
      </AvatarRoot>
    );
  }
);

Avatar.Root = AvatarRoot;
Avatar.Image = AvatarImage;
Avatar.Icon = AvatarIcon;
Avatar.Abbr = AvatarAbbr;

Avatar.displayName = AVATAR_NAME;
Avatar.Root.displayName = CONTAINER_NAME;
Avatar.Image.displayName = IMAGE_NAME;
Avatar.Icon.displayName = ICON_NAME;
Avatar.Abbr.displayName = ABBR_NAME;

interface AvatarStaticProps {
  Root: typeof AvatarRoot;
  Image: typeof AvatarImage;
  Abbr: typeof AvatarAbbr;
  Icon: typeof AvatarIcon;
}

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
    image.oninvalid = () => {
      // TODO
    };

    return () => {
      isMounted = false;
    };
  }, [src]);

  return loadingStatus;
}

const styles: PrimitiveStyles = {
  [interopSelector(CONTAINER_NAME)]: {
    ...cssReset(CONTAINER_DEFAULT_TAG),
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    verticalAlign: 'middle',
    overflow: 'hidden',
    userSelect: 'none',
  },
  [interopSelector(IMAGE_NAME)]: {
    ...cssReset(IMAGE_DEFAULT_TAG),
    width: '100%',
    height: '100%',
    // Make sure images are not distorted
    objectFit: 'cover',
    // Remove alt text (appears in some browsers when image doesn't load)
    color: 'transparent',
    // Hide the image broken icon (Chrome only)
    textIndent: 10000,
  },
  [interopSelector(ABBR_NAME)]: {
    ...cssReset(ABBR_DEFAULT_TAG),
  },
  [interopSelector(ICON_NAME)]: {
    ...cssReset(ICON_DEFAULT_TAG),
  },
};

export type { AvatarProps, AvatarImageProps, AvatarIconProps, AvatarAbbrProps };
export { Avatar, styles };
