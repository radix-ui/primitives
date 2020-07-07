import * as React from 'react';

type CodeDOMProps = React.ComponentPropsWithoutRef<'div'>;
type CodeOwnProps = {};
type CodeProps = CodeDOMProps & CodeOwnProps;

const Code = React.forwardRef<HTMLDivElement, CodeProps>(function Code(props, forwardedRef) {
  return <div ref={forwardedRef} />;
});

Code.displayName = 'Code';

export { Code };
export type { CodeProps };
