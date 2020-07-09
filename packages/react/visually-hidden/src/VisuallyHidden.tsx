import * as React from 'react';
import { forwardRef } from '@interop-ui/react-utils';

const DEFAULT_TAG = 'span';

type VisuallyHiddenOwnProps = {};
type VisuallyHiddenDOMProps = React.ComponentPropsWithoutRef<typeof DEFAULT_TAG>;
type VisuallyHiddenProps = VisuallyHiddenOwnProps & VisuallyHiddenDOMProps;

const VisuallyHidden = forwardRef<typeof DEFAULT_TAG, VisuallyHiddenProps>(
  ({ as: Comp = DEFAULT_TAG, ...props }, forwardedRef) => (
    <span
      {...props}
      style={{
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
      ref={forwardedRef}
    />
  )
);

VisuallyHidden.displayName = 'VisuallyHidden';

export { VisuallyHidden };
export type { VisuallyHiddenProps };
