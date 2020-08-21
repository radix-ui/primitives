/* eslint-disable jsx-a11y/alt-text */
import * as React from 'react';
import { cssReset } from '@interop-ui/utils';
import { forwardRef, createStyleObj } from '@interop-ui/react-utils';

const NAME = 'Image';
const DEFAULT_TAG = 'img';

type ImageDOMProps = React.ComponentPropsWithRef<typeof DEFAULT_TAG>;
type ImageOwnProps = {};
type ImageProps = ImageOwnProps & ImageDOMProps;

const Image = forwardRef<typeof DEFAULT_TAG, ImageProps>(function Image(props, forwardedRef) {
  const { as: Comp = DEFAULT_TAG, ...imgProps } = props;
  return <Comp {...interopDataAttrObj('root')} {...imgProps} ref={forwardedRef} />;
});

Image.displayName = NAME;

const [styles, interopDataAttrObj] = createStyleObj(NAME, {
  root: {
    ...cssReset(DEFAULT_TAG),
    display: 'block',
    maxWidth: '100%',
  },
});

export type { ImageProps };
export { Image, styles };
