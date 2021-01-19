import * as React from 'react';
import { getSelector } from '@radix-ui/utils';
import { forwardRefWithAs } from '@radix-ui/react-polymorphic';
import { Primitive } from '@radix-ui/react-primitive';

import type { OwnProps } from '@radix-ui/react-polymorphic';

const NAME = 'VisuallyHidden';
const DEFAULT_TAG = 'span';

const VisuallyHidden = forwardRefWithAs<typeof DEFAULT_TAG, OwnProps<typeof Primitive>>(
  (props, forwardedRef) => (
    <Primitive
      as={DEFAULT_TAG}
      selector={getSelector(NAME)}
      {...props}
      ref={forwardedRef}
      style={{
        ...props.style,
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

export {
  VisuallyHidden,
  //
  Root,
};
