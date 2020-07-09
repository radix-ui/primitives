/* eslint-disable jsx-a11y/alt-text */
import * as React from 'react';
import { cssReset } from '@interop-ui/utils';

type ImageDOMProps = React.ComponentPropsWithRef<'img'>;
type ImageOwnProps = {};
type ImageProps = ImageOwnProps & ImageDOMProps;

const Image = React.forwardRef<HTMLImageElement, ImageProps>(function Image(props, forwardedRef) {
  const { style, ...imageProps } = props;

  return (
    <img
      style={{
        ...cssReset('img'),
        display: 'block',
        maxWidth: '100%',
        ...style,
      }}
      {...imageProps}
      ref={forwardedRef}
    />
  );
});

Image.displayName = 'Image';

export type { ImageProps };
export { Image };
