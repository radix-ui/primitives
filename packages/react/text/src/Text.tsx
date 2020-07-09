import * as React from 'react';

type TextDOMProps = React.ComponentProps<'div'>;
type TextOwnProps = {};
type TextProps = TextDOMProps & TextOwnProps;

const Text = React.forwardRef<HTMLDivElement, TextProps>(function Text(props, forwardedRef) {
  return <div ref={forwardedRef} />;
});

Text.displayName = 'Text';

export { Text };
export type { TextProps };
