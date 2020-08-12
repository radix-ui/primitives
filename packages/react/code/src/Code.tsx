import * as React from 'react';
import { cssReset } from '@interop-ui/utils';
import { forwardRef, createStyleObj } from '@interop-ui/react-utils';

const NAME = 'Code';
const DEFAULT_TAG = 'code';

type CodeDOMProps = React.ComponentPropsWithoutRef<typeof DEFAULT_TAG>;
type CodeOwnProps = {};
type CodeProps = CodeDOMProps & CodeOwnProps;

const Code = forwardRef<typeof DEFAULT_TAG, CodeProps>(function Code(props, forwardedRef) {
  const { as: Comp = DEFAULT_TAG, ...codeProps } = props;
  return <Comp {...interopDataAttrObj('root')} ref={forwardedRef} {...codeProps} />;
});

Code.displayName = NAME;

const [styles, interopDataAttrObj] = createStyleObj(NAME, {
  root: {
    ...cssReset(DEFAULT_TAG),
    lineHeight: '1',
  },
});

export { Code, styles };
export type { CodeProps };
