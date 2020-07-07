import * as React from 'react';

type ImageDOMProps = React.ComponentPropsWithRef<'div'>;
type ImageOwnProps = {};
type ImageProps = ImageDOMProps & ImageOwnProps;

const Image = React.forwardRef<HTMLDivElement, ImageProps>(function Image(props, forwardedRef) {
  return <div ref={forwardedRef} />;
});

Image.displayName = 'Image';

export { Image };
export type { ImageProps };
