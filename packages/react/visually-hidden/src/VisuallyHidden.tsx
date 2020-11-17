import * as React from 'react';
import { getPartDataAttrObj } from '@interop-ui/utils';
import { forwardRef } from '@interop-ui/react-utils';

const NAME = 'VisuallyHidden';
const DEFAULT_TAG = 'span';

type VisuallyHiddenDOMProps = React.ComponentPropsWithoutRef<typeof DEFAULT_TAG>;
type VisuallyHiddenProps = VisuallyHiddenDOMProps;

const VisuallyHidden = forwardRef<typeof DEFAULT_TAG, VisuallyHiddenProps>(
  ({ as: Comp = DEFAULT_TAG, style, ...visuallyHiddenProps }, forwardedRef) => (
    <Comp
      {...visuallyHiddenProps}
      {...getPartDataAttrObj(NAME)}
      ref={forwardedRef}
      style={{
        ...style,
        // See: https://github.com/twbs/bootstrap/blob/master/scss/mixins/_screen-reader.scss
        position: 'absolute',
        border: 0,
        width: 1,
        height: 1,
        padding: 0,
        margin: -1,
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        wordWrap: 'normal',
      }}
    />
  )
);

VisuallyHidden.displayName = NAME;

export { VisuallyHidden };
export type { VisuallyHiddenProps };
