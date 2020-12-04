import * as React from 'react';
import { getPartDataAttrObj } from '@interop-ui/utils';
import { forwardRefWithAs } from '@interop-ui/react-polymorphic';

const NAME = 'VisuallyHidden';
const DEFAULT_TAG = 'span';

const VisuallyHidden = forwardRefWithAs<typeof DEFAULT_TAG>(
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

const Root = VisuallyHidden;

export { VisuallyHidden, Root };
