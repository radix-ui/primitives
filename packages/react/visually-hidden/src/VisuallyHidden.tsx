import * as React from 'react';
import { getSelector } from '@radix-ui/utils';
import { Primitive } from '@radix-ui/react-primitive';

import type * as Polymorphic from '@radix-ui/react-polymorphic';

const NAME = 'VisuallyHidden';
const DEFAULT_TAG = 'span';

type VisuallyHiddenOwnProps = Polymorphic.OwnProps<typeof Primitive>;
type VisuallyHiddenPrimitive = Polymorphic.ForwardRefComponent<
  typeof DEFAULT_TAG,
  VisuallyHiddenOwnProps
>;

const VisuallyHidden = React.forwardRef((props, forwardedRef) => (
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
)) as VisuallyHiddenPrimitive;

VisuallyHidden.displayName = NAME;

const Root = VisuallyHidden;

export {
  VisuallyHidden,
  //
  Root,
};
