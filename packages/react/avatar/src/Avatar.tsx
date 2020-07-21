import * as React from 'react';
import { AvatarIcon as RadixIcon } from '@modulz/radix-icons';
import { Image as ImagePrimitive } from '@interop-ui/react-image';
import { cssReset, interopDataAttrObj } from '@interop-ui/utils';
import { createContext, forwardRef } from '@interop-ui/react-utils';

const CONTAINER_DEFAULT_TAG = 'span';

type AvatarDOMProps = React.ComponentPropsWithoutRef<typeof CONTAINER_DEFAULT_TAG>;
type AvatarOwnProps = {
  src?: string;
  alt?: string;
  renderFallback?: React.ReactNode;
};
type AvatarProps = AvatarDOMProps & AvatarOwnProps;

type AvatarRenderType = 'ICON' | 'IMAGE' | 'FALLBACK' | 'ALT_ABBR';

interface AvatarContextValue {
  src: string | undefined;
  alt: string | undefined;
  whatToRender: AvatarRenderType;
}

const [AvatarContext, useAvatarContext] = createContext<AvatarContextValue>(
  'AvatarContext',
  'Avatar.Root'
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
    src,
    style,
    ...avatarProps
  } = props;

  let imageLoadingStatus = useImageLoadingStatus(src);
  let hasImage = Boolean(src);
  let hasWorkingImage = hasImage && imageLoadingStatus !== 'error';

  let whatToRender: AvatarRenderType = 'ICON';
  if (hasWorkingImage) {
    whatToRender = 'IMAGE';
  } else if (typeof renderFallback === 'function') {
    whatToRender = 'FALLBACK';
  } else if (hasImage && alt !== undefined) {
    whatToRender = 'ALT_ABBR';
  } else {
    whatToRender = 'ICON';
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
      <Comp {...interopDataAttrObj('AvatarRoot')} {...avatarProps} ref={forwardedRef}>
        {whatToRender === 'FALLBACK' ? (renderFallback as Function)() : children}
      </Comp>
    </AvatarContext.Provider>
  );
});

AvatarRoot.displayName = 'Avatar.Root';

type AvatarImageDOMProps = React.ComponentPropsWithRef<'img'>;
type AvatarImageOwnProps = {};
type AvatarImageProps = AvatarImageDOMProps & AvatarImageOwnProps;

const IMAGE_DEFAULT_TAG = 'img';

const AvatarImage = forwardRef<typeof IMAGE_DEFAULT_TAG, AvatarImageProps>(function AvatarImage(
  props,
  forwardedRef
) {
  let { as: Comp = ImagePrimitive, children: _, ...imageProps } = props;
  let { src, alt, whatToRender } = useAvatarContext('Avatar.Image');
  return whatToRender === 'IMAGE' ? (
    <Comp
      {...interopDataAttrObj('AvatarImage')}
      ref={forwardedRef}
      src={src}
      alt={alt}
      {...imageProps}
    />
  ) : null;
});

AvatarImage.displayName = 'Avatar.Image';

const ICON_DEFAULT_TAG = 'svg';

type AvatarIconDOMProps = React.ComponentPropsWithoutRef<typeof ICON_DEFAULT_TAG>;
type AvatarIconOwnProps = {};
type AvatarIconProps = AvatarIconDOMProps & AvatarIconOwnProps;

const AvatarIcon = forwardRef<typeof ICON_DEFAULT_TAG, AvatarIconProps>(function AvatarIcon(
  props,
  forwardedRef
) {
  let { as: Comp = RadixIcon as any, ...iconProps } = props;
  let { whatToRender } = useAvatarContext('Avatar.Icon');
  return whatToRender === 'ICON' ? (
    <Comp {...interopDataAttrObj('AvatarIcon')} ref={forwardedRef} {...iconProps} />
  ) : null;
});

AvatarIcon.displayName = 'Avatar.Icon';

const ABBR_DEFAULT_TAG = 'span';

type AvatarAbbrDOMProps = React.ComponentPropsWithoutRef<typeof ABBR_DEFAULT_TAG>;
type AvatarAbbrOwnProps = {};
type AvatarAbbrProps = AvatarAbbrDOMProps & AvatarAbbrOwnProps;

const AvatarAbbr = forwardRef<typeof ABBR_DEFAULT_TAG, AvatarAbbrProps>(function AvatarAbbr(
  props,
  forwardedRef
) {
  let { as: Comp = 'span', children, ...abbrProps } = props;
  let { alt, whatToRender } = useAvatarContext('Avatar.Abbr');
  return alt && whatToRender === 'ALT_ABBR' ? (
    <Comp {...interopDataAttrObj('AvatarAbbr')} aria-hidden ref={forwardedRef} {...abbrProps}>
      {alt[0]}
    </Comp>
  ) : null;
});

AvatarAbbr.displayName = 'Avatar.Abbr';

const Avatar = forwardRef<typeof CONTAINER_DEFAULT_TAG, AvatarProps, AvatarStaticProps>(
  function Avatar(props, forwardedRef) {
    const { children, ...avatarProps } = props;

    return (
      <AvatarRoot ref={forwardedRef} {...avatarProps}>
        <AvatarImage />
        <AvatarIcon />
        <AvatarAbbr />
      </AvatarRoot>
    );
  }
);

Avatar.Root = AvatarRoot;
Avatar.Image = AvatarImage;
Avatar.Abbr = AvatarAbbr;
Avatar.Icon = AvatarIcon;

Avatar.displayName = 'Avatar';

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

    return () => {
      isMounted = false;
    };
  }, [src]);

  return loadingStatus;
}

const styles = {
  root: {
    ...cssReset(CONTAINER_DEFAULT_TAG),
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
    // Remove alt text (appears in some browsers when image doesn't load)
    color: 'transparent',
    // Hide the image broken icon (Chrome only)
    textIndent: 10000,
  },
  abbr: {
    ...cssReset(ABBR_DEFAULT_TAG),
  },
  icon: {
    ...cssReset(ICON_DEFAULT_TAG),
  },
};

export type { AvatarProps, AvatarImageProps, AvatarIconProps, AvatarAbbrProps };
export { Avatar, styles };
