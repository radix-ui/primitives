import { Avatar } from 'radix-ui';
import styles from './avatar.stories.module.css';
import * as React from 'react';

export default { title: 'Components/Avatar' };

const src = 'https://picsum.photos/id/1005/400/400';
const srcAlternative = 'https://picsum.photos/id/1006/400/400';
const srcBroken = 'https://broken.link.com/broken-pic.jpg';

export const Basic = () => (
  <>
    <h1>Without image & with fallback</h1>
    <Avatar.Root className={styles.root}>
      <Avatar.Fallback className={styles.fallback}>JS</Avatar.Fallback>
    </Avatar.Root>

    <h1>With image & with fallback</h1>
    <Avatar.Root className={styles.root}>
      <Avatar.Image className={styles.image} alt="John Smith" src={src} />
      <Avatar.Fallback delayMs={300} className={styles.fallback}>
        JS
      </Avatar.Fallback>
    </Avatar.Root>

    <h1>With image & with fallback (but broken src)</h1>
    <Avatar.Root className={styles.root}>
      <Avatar.Image
        className={styles.image}
        alt="John Smith"
        src={srcBroken}
        onLoadingStatusChange={console.log}
      />
      <Avatar.Fallback className={styles.fallback}>
        <AvatarIcon />
      </Avatar.Fallback>
    </Avatar.Root>

    <h1>Changing image src</h1>
    <SourceChanger sources={[src, srcAlternative, srcBroken]}>
      {(src) => (
        <Avatar.Root className={styles.root}>
          <Avatar.Image className={styles.image} alt="John Smith" src={src} />
          <Avatar.Fallback delayMs={300} className={styles.fallback}>
            JS
          </Avatar.Fallback>
        </Avatar.Root>
      )}
    </SourceChanger>
  </>
);

export const WithNativeImage = () => (
  <>
    <h1>With image & with fallback</h1>
    <Avatar.Root className={styles.root}>
      <Avatar.Image mode="native" className={styles.image} alt="John Smith" src={src} />
      <Avatar.Fallback delayMs={300} className={styles.fallback}>
        JS
      </Avatar.Fallback>
    </Avatar.Root>

    <h1>With image & with fallback (but broken src)</h1>
    <Avatar.Root className={styles.root}>
      <Avatar.Image
        mode="native"
        className={styles.image}
        alt="John Smith"
        src={srcBroken}
        onLoadingStatusChange={console.log}
      />
      <Avatar.Fallback className={styles.fallback}>
        <AvatarIcon />
      </Avatar.Fallback>
    </Avatar.Root>

    <h1>Changing image src</h1>
    <SourceChanger sources={[src, srcAlternative, srcBroken]}>
      {(src) => (
        <Avatar.Root className={styles.root}>
          <Avatar.Image mode="native" className={styles.image} alt="John Smith" src={src} />
          <Avatar.Fallback delayMs={300} className={styles.fallback}>
            JS
          </Avatar.Fallback>
        </Avatar.Root>
      )}
    </SourceChanger>
  </>
);

export const WithCustomImage = () => (
  <>
    <h1>With image & with fallback</h1>
    <Avatar.Root className={styles.root}>
      <Avatar.Image
        mode="custom"
        className={styles.image}
        alt="John Smith"
        src={src}
        render={({ props, ref, context }) => (
          <NextImage
            {...props}
            data-loading-status={context.loadingStatus}
            ref={ref}
            alt="John Smith"
            sizes="100vw"
            width={100}
            height={100}
            src={props.src!}
            onLoadingComplete={({ naturalWidth, naturalHeight }) => {
              if (naturalWidth === 0 || naturalHeight === 0) {
                context.onLoadingStatusChange('error');
              } else {
                context.onLoadingStatusChange('loaded');
              }
            }}
            onError={() => {
              context.onLoadingStatusChange('error');
            }}
          />
        )}
      />
      <Avatar.Fallback delayMs={300} className={styles.fallback}>
        <AvatarIcon />
      </Avatar.Fallback>
    </Avatar.Root>
  </>
);

export const Chromatic = () => (
  <>
    <h1>Without image & with fallback</h1>
    <Avatar.Root className={styles.root}>
      <Avatar.Fallback className={styles.fallback}>JS</Avatar.Fallback>
    </Avatar.Root>

    <h1>With image & with fallback</h1>
    <Avatar.Root className={styles.root}>
      <Avatar.Image className={styles.image} alt="John Smith" src={src} />
      <Avatar.Fallback delayMs={300} className={styles.fallback}>
        JS
      </Avatar.Fallback>
    </Avatar.Root>

    <h1>With image & with fallback (but broken src)</h1>
    <Avatar.Root className={styles.root}>
      <Avatar.Image className={styles.image} alt="John Smith" src={srcBroken} />
      <Avatar.Fallback className={styles.fallback}>
        <AvatarIcon />
      </Avatar.Fallback>
    </Avatar.Root>

    <h1>Changing image src</h1>
    <SourceChanger sources={[src, srcAlternative, srcBroken]}>
      {(src) => (
        <Avatar.Root className={styles.root}>
          <Avatar.Image className={styles.image} alt="John Smith" src={src} />
          <Avatar.Fallback delayMs={300} className={styles.fallback}>
            JS
          </Avatar.Fallback>
        </Avatar.Root>
      )}
    </SourceChanger>
  </>
);
Chromatic.parameters = { chromatic: { disable: false, delay: 1000 } };

const AvatarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="42" height="42">
    <path
      d="M50 51.7a22.1 22.1 0 100-44.2 22.1 22.1 0 000 44.2zM87.9 69.3a27.8 27.8 0 00-21.2-16.1 4 4 0 00-2.8.7 23.5 23.5 0 01-27.6 0 4 4 0 00-2.8-.7 27.5 27.5 0 00-21.2 16.1c-.3.6-.2 1.3.1 1.8a52.8 52.8 0 007 8.9 43.4 43.4 0 0056.9 3.8 56.3 56.3 0 008.9-8.8c.9-1.2 1.8-2.5 2.6-3.9.3-.6.3-1.2.1-1.8z"
      fill="currentColor"
    />
  </svg>
);

function SourceChanger({
  sources,
  children,
}: {
  sources: [string, ...string[]];
  children: (src: string) => React.ReactElement;
}) {
  const [src, setSrc] = React.useState(sources[0]);
  React.useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (sources.indexOf(src) + 1) % sources.length;
      setSrc(sources[nextIndex]!);
    }, 1000);
    return () => clearInterval(interval);
  }, [sources, src]);
  return children(src);
}

// Stripped-down pseudo implementation of Next.js's Image component to
// demonstrate how to use the AvatarImage with a custom mode. Doesn't really
// matter if blur/etc works or not, just here to illustrate the concept.
// https://github.com/vercel/next.js/blob/canary/packages/next/src/client/image-component.tsx
// MIT license, Copyright (c) 2025 Vercel, Inc.
interface ImageProps {
  ref?: React.Ref<HTMLImageElement>;
  sizes: string;
  src: string;
  alt: string;
  onLoad?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
  onError?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
  onLoadingComplete?: (result: { naturalWidth: number; naturalHeight: number }) => void;
  preload?: boolean;
  priority?: boolean;
  loading?: 'eager' | 'lazy';
  className?: string;
  quality?: number;
  width: number;
  height: number;
  fill?: boolean;
  style?: React.CSSProperties;
  placeholder?: 'empty' | 'blur';
  blurDataURL?: string;
}

interface ImageConfig {
  allSizes: number[];
  imageSizes: number[];
  deviceSizes: number[];
  qualities: number[];
}

const NextImage: React.FC<ImageProps> = (props) => {
  const onLoadRef = React.useRef(props.onLoad);
  React.useEffect(() => {
    onLoadRef.current = props.onLoad;
  }, [props.onLoad]);

  const onLoadingCompleteRef = React.useRef(props.onLoadingComplete);
  React.useEffect(() => {
    onLoadingCompleteRef.current = props.onLoadingComplete;
  }, [props.onLoadingComplete]);

  const config = React.useMemo<ImageConfig>(() => {
    return {
      allSizes: [32, 48, 64, 96, 128, 256, 384],
      imageSizes: [32, 48, 64, 96, 128, 256, 384],
      deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
      qualities: [75],
    };
  }, []);

  const [blurComplete, setBlurComplete] = React.useState(false);
  const { props: imgAttributes, meta: imgMeta } = getImgProps(props, {
    imgConf: config,
    blurComplete,
  });
  const { loading, width, height, style, sizes, srcSet, ...rest } = imgAttributes;
  const { placeholder, fill } = imgMeta;

  return (
    <>
      {/* oxlint-disable-next-line jsx-a11y/alt-text */}
      <img
        {...rest}
        loading={loading}
        width={width}
        height={height}
        data-nimg={fill ? 'fill' : '1'}
        className={props.className}
        style={style}
        // It's intended to keep `src` the last attribute because React updates
        // attributes in order. If we keep `src` the first one, Safari will
        // immediately start to fetch `src`, before `sizes` and `srcSet` are even
        // updated by React. That causes multiple unnecessary requests if `srcSet`
        // and `sizes` are defined.
        // This bug cannot be reproduced in Chrome or Firefox.
        sizes={sizes}
        srcSet={srcSet}
        src={src}
        ref={props.ref}
        onLoad={(event) => {
          const currentImage = event.currentTarget;
          handleLoading(
            currentImage,
            placeholder,
            onLoadRef,
            onLoadingCompleteRef,
            setBlurComplete,
          );
        }}
        onError={(event) => {
          if (placeholder !== 'empty') {
            // If the real image fails to load, this will still remove the placeholder.
            setBlurComplete(true);
          }
          if (props.onError) {
            props.onError(event);
          }
        }}
      />
      {imgMeta.preload ? (
        <link
          key={'__nimg-' + imgAttributes.src + imgAttributes.srcSet + imgAttributes.sizes}
          rel="preload"
          href={imgAttributes.srcSet ? undefined : imgAttributes.src}
          as="image"
          imageSrcSet={imgAttributes.srcSet}
          imageSizes={imgAttributes.sizes}
          crossOrigin={imgAttributes.crossOrigin}
          referrerPolicy={imgAttributes.referrerPolicy}
        />
      ) : null}
    </>
  );
};

function getImgProps(
  {
    src,
    sizes,
    priority = false,
    preload = false,
    loading,
    className,
    quality = 100,
    width,
    height,
    fill = false,
    style,
    onLoad,
    onLoadingComplete,
    placeholder = 'empty',
    blurDataURL,
    ...rest
  }: ImageProps,
  state: {
    imgConf: ImageConfig;
    blurComplete: boolean | undefined;
  },
): {
  props: React.ComponentProps<'img'>;
  meta: {
    placeholder: 'empty' | 'blur';
    preload: boolean;
    fill: boolean;
  };
} {
  const { imgConf: config, blurComplete } = state;

  let blurWidth: number | undefined;
  let blurHeight: number | undefined;

  const isLazy = !priority && !preload && (loading === 'lazy' || typeof loading === 'undefined');
  const imgStyle = Object.assign(
    fill
      ? {
          position: 'absolute',
          height: '100%',
          width: '100%',
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          objectFit: 'cover',
          objectPosition: '50% 50%',
        }
      : {},
    style,
  );

  const backgroundImage =
    !blurComplete && placeholder !== 'empty'
      ? placeholder === 'blur'
        ? `url("data:image/svg+xml;charset=utf-8,${getImageBlurSvg({
            widthInt: width,
            heightInt: height,
            blurWidth,
            blurHeight,
            blurDataURL: blurDataURL || '',
            objectFit: imgStyle.objectFit,
          })}")`
        : `url("${placeholder}")` // assume `data:image/`
      : null;

  const backgroundSize = !['contain', 'cover', 'fill'].includes(imgStyle.objectFit!)
    ? imgStyle.objectFit
    : imgStyle.objectFit === 'fill'
      ? '100% 100%' // the background-size equivalent of `fill`
      : 'cover';

  const placeholderStyle: React.CSSProperties = backgroundImage
    ? {
        backgroundSize,
        backgroundPosition: imgStyle.objectPosition || '50% 50%',
        backgroundRepeat: 'no-repeat',
        backgroundImage,
      }
    : {};

  const imgAttributes = generateImgAttrs({
    config,
    src,
    width,
    quality,
    sizes,
    loader: ({ src, quality, width }) => `${src}?w=${width}&q=${quality}`,
  });

  const loadingFinal = isLazy ? 'lazy' : loading;

  const props: React.ComponentProps<'img'> = {
    ...rest,
    loading: loadingFinal,
    width,
    height,
    className,
    style: { ...imgStyle, ...placeholderStyle },
    sizes: imgAttributes.sizes,
    srcSet: imgAttributes.srcSet,
    src: imgAttributes.src,
  };

  return { props, meta: { placeholder, preload: preload || priority, fill } };
}

function getImageBlurSvg({
  widthInt,
  heightInt,
  blurWidth,
  blurHeight,
  blurDataURL,
  objectFit,
}: {
  widthInt?: number;
  heightInt?: number;
  blurWidth?: number;
  blurHeight?: number;
  blurDataURL: string;
  objectFit?: string;
}): string {
  const std = 20;
  const svgWidth = blurWidth ? blurWidth * 40 : widthInt;
  const svgHeight = blurHeight ? blurHeight * 40 : heightInt;

  const viewBox = svgWidth && svgHeight ? `viewBox='0 0 ${svgWidth} ${svgHeight}'` : '';
  const preserveAspectRatio = viewBox
    ? 'none'
    : objectFit === 'contain'
      ? 'xMidYMid'
      : objectFit === 'cover'
        ? 'xMidYMid slice'
        : 'none';

  return `%3Csvg xmlns='http://www.w3.org/2000/svg' ${viewBox}%3E%3Cfilter id='b' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='${std}'/%3E%3CfeColorMatrix values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 100 -1' result='s'/%3E%3CfeFlood x='0' y='0' width='100%25' height='100%25'/%3E%3CfeComposite operator='out' in='s'/%3E%3CfeComposite in2='SourceGraphic'/%3E%3CfeGaussianBlur stdDeviation='${std}'/%3E%3C/filter%3E%3Cimage width='100%25' height='100%25' x='0' y='0' preserveAspectRatio='${preserveAspectRatio}' style='filter: url(%23b);' href='${blurDataURL}'/%3E%3C/svg%3E`;
}

function generateImgAttrs({
  config,
  src,
  width,
  quality,
  sizes,
  loader,
}: {
  config: ImageConfig;
  src: string;
  width: number;
  quality: number;
  sizes: string;
  loader: (props: { config: ImageConfig; src: string; quality: number; width: number }) => string;
}) {
  const { widths, kind } = getWidths(config, width, sizes);
  const last = widths.length - 1;
  return {
    sizes: !sizes && kind === 'w' ? '100vw' : sizes,
    srcSet: widths
      .map(
        (w, i) =>
          `${loader({ config, src, quality, width: w })} ${kind === 'w' ? w : i + 1}${kind}`,
      )
      .join(', '),
    src: loader({ config, src, quality, width: widths[last]! }),
  };
}

function getWidths(
  config: { deviceSizes: number[]; imageSizes: number[]; qualities: number[]; allSizes: number[] },
  width: number | undefined,
  sizes: string | undefined,
): { widths: number[]; kind: 'w' | 'x' } {
  const { deviceSizes, allSizes } = config;
  if (sizes) {
    // Find all the "vw" percent sizes used in the sizes prop
    const viewportWidthRe = /(^|\s)(1?\d?\d)vw/g;
    const percentSizes = [];
    for (let match; (match = viewportWidthRe.exec(sizes)); match) {
      percentSizes.push(parseInt(match[2]!));
    }
    if (percentSizes.length) {
      const smallestRatio = Math.min(...percentSizes) * 0.01;
      return {
        widths: allSizes.filter((s) => s >= deviceSizes[0]! * smallestRatio),
        kind: 'w',
      };
    }
    return { widths: allSizes, kind: 'w' };
  }
  if (typeof width !== 'number') {
    return { widths: deviceSizes, kind: 'w' };
  }

  const widths = [
    ...new Set(
      // > This means that most OLED screens that say they are 3x resolution,
      // > are actually 3x in the green color, but only 1.5x in the red and
      // > blue colors. Showing a 3x resolution image in the app vs a 2x
      // > resolution image will be visually the same, though the 3x image
      // > takes significantly more data. Even true 3x resolution screens are
      // > wasteful as the human eye cannot see that level of detail without
      // > something like a magnifying glass.
      // https://blog.twitter.com/engineering/en_us/topics/infrastructure/2019/capping-image-fidelity-on-ultra-high-resolution-devices.html
      [width, width * 2 /*, width * 3*/].map(
        (w) => allSizes.find((p) => p >= w) || allSizes[allSizes.length - 1]!,
      ),
    ),
  ];
  return { widths, kind: 'x' };
}

// See https://stackoverflow.com/q/39777833/266535 for why we use this ref
// handler instead of the img's onLoad attribute.
function handleLoading(
  img: HTMLImageElement,
  placeholder: 'empty' | 'blur',
  onLoadRef: React.RefObject<((event: React.SyntheticEvent<HTMLImageElement>) => void) | undefined>,
  onLoadingCompleteRef: React.RefObject<
    ((result: { naturalWidth: number; naturalHeight: number }) => void) | undefined
  >,
  setBlurComplete: (b: boolean) => void,
) {
  const src = img?.src;
  if (!img || (img as any)['data-loaded-src'] === src) {
    return;
  }
  (img as any)['data-loaded-src'] = src;
  const p = 'decode' in img ? img.decode() : Promise.resolve();
  p.catch(() => {}).then(() => {
    if (!img.parentElement || !img.isConnected) {
      // Exit early in case of race condition:
      // - onload() is called
      // - decode() is called but incomplete
      // - unmount is called
      // - decode() completes
      return;
    }
    if (placeholder !== 'empty') {
      setBlurComplete(true);
    }
    if (onLoadRef?.current) {
      // Since we don't have the SyntheticEvent here,
      // we must create one with the same shape.
      // See https://reactjs.org/docs/events.html
      const event = new Event('load');
      Object.defineProperty(event, 'target', { writable: false, value: img });
      let prevented = false;
      let stopped = false;
      onLoadRef.current({
        ...event,
        nativeEvent: event,
        currentTarget: img,
        target: img,
        isDefaultPrevented: () => prevented,
        isPropagationStopped: () => stopped,
        persist: () => {},
        preventDefault: () => {
          prevented = true;
          event.preventDefault();
        },
        stopPropagation: () => {
          stopped = true;
          event.stopPropagation();
        },
      });
    }
    if (onLoadingCompleteRef?.current) {
      onLoadingCompleteRef.current(img);
    }
  });
}
