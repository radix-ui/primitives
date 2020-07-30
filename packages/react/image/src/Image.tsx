/* eslint-disable jsx-a11y/alt-text */
import * as React from 'react';
import { cssReset, interopDataAttrObj } from '@interop-ui/utils';
import { createContext, forwardRef, PrimitiveStyles, useHasContext } from '@interop-ui/react-utils';

/* -------------------------------------------------------------------------------------------------
 * Root level context
 * -----------------------------------------------------------------------------------------------*/

type ImageContextValue = {};
const [ImageContext] = createContext<ImageContextValue>('ImageContext', 'Image');

/* -------------------------------------------------------------------------------------------------
 * Image
 * -----------------------------------------------------------------------------------------------*/

const DEFAULT_TAG = 'img';

type ImageDOMProps = React.ComponentPropsWithoutRef<typeof DEFAULT_TAG>;
type ImageOwnProps = {};
type ImageProps = ImageOwnProps & ImageDOMProps;

const Image = forwardRef<typeof DEFAULT_TAG, ImageProps>(function Image(props, forwardedRef) {
  const { as: Comp = DEFAULT_TAG, ...imgProps } = props;
  return (
    <ImageContext.Provider value={React.useMemo(() => ({}), [])}>
      <Comp {...interopDataAttrObj('Image')} ref={forwardedRef} {...imgProps} />;
    </ImageContext.Provider>
  );
});

Image.displayName = 'Image';

/* ---------------------------------------------------------------------------------------------- */

const useHasImageContext = () => useHasContext(ImageContext);

const styles: PrimitiveStyles = {
  image: {
    ...cssReset('img'),
    display: 'block',
    maxWidth: '100%',
  },
};

export type { ImageProps, useHasImageContext };
export { Image, styles };
