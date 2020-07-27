import * as React from 'react';
import { forwardRef, PrimitiveStyles } from '@interop-ui/react-utils';

const DEFAULT_TAG = 'span';

type VisuallyHiddenParts = 'visuallyHidden';
type VisuallyHiddenOwnProps = {
  bypassInlineStyles?: boolean;
};
type VisuallyHiddenDOMProps = React.ComponentPropsWithoutRef<typeof DEFAULT_TAG>;
type VisuallyHiddenProps = VisuallyHiddenOwnProps & VisuallyHiddenDOMProps;

const VisuallyHidden = forwardRef<typeof DEFAULT_TAG, VisuallyHiddenProps>(
  ({ as: Comp = DEFAULT_TAG, bypassInlineStyles = false, style, ...props }, forwardedRef) => (
    <Comp
      {...props}
      ref={forwardedRef}
      style={bypassInlineStyles ? style : { ...styles.visuallyHidden, ...style }}
    />
  )
);

VisuallyHidden.displayName = 'VisuallyHidden';

const styles: PrimitiveStyles = {
  visuallyHidden: {
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
  },
};

export { VisuallyHidden, styles };
export type { VisuallyHiddenProps };
