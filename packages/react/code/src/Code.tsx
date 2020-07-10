import * as React from 'react';
import { cssReset, interopDataAttrObj } from '@interop-ui/utils';
import { forwardRef } from '@interop-ui/react-utils';

const DEFAULT_TAG = 'code';

type CodeDOMProps = React.ComponentPropsWithoutRef<typeof DEFAULT_TAG>;
type CodeOwnProps = {};
type CodeProps = CodeDOMProps & CodeOwnProps;

const Code = forwardRef<typeof DEFAULT_TAG, CodeProps>(function Code(props, forwardedRef) {
  const { as: Comp = DEFAULT_TAG, ...codeProps } = props;
  return <Comp {...interopDataAttrObj('Code')} ref={forwardedRef} {...codeProps} />;
});

Code.displayName = 'Code';

const styles = {
  code: {
    ...cssReset(DEFAULT_TAG),
    lineHeight: '1',
  },
};

export { Code, styles };
export type { CodeProps };
