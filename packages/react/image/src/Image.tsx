/* eslint-disable jsx-a11y/alt-text */
import * as React from 'react';
import { cssReset } from '@interop-ui/utils';

type ImageDOMProps = React.ComponentPropsWithRef<'img'>;
type ImageOwnProps = {};
type ImageProps = ImageOwnProps & ImageDOMProps;

const Image = React.forwardRef<HTMLImageElement, ImageProps>(function Image(props, forwardedRef) {
  return <img data-interop-part-image="" {...props} ref={forwardedRef} />;
});

Image.displayName = 'Image';

const styles = {
  image: {
    ...cssReset('img'),
    display: 'block',
    maxWidth: '100%',
  },
};

export type { ImageProps };
export { Image, styles };
