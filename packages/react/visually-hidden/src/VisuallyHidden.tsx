import * as React from 'react';

export type VisuallyHiddenProps = React.ComponentPropsWithRef<'span'>;

export const VisuallyHidden = React.forwardRef<HTMLSpanElement, VisuallyHiddenProps>(
  (props, forwardedRef) => (
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
