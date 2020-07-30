import * as React from 'react';
import { cssReset, interopDataAttrObj } from '@interop-ui/utils';
import { createContext, forwardRef, PrimitiveStyles, useHasContext } from '@interop-ui/react-utils';

/* -------------------------------------------------------------------------------------------------
 * Root level context
 * -----------------------------------------------------------------------------------------------*/

type CodeContextValue = {};
const [CodeContext] = createContext<CodeContextValue>('CodeContext', 'Code');

/* -------------------------------------------------------------------------------------------------
 * Code
 * -----------------------------------------------------------------------------------------------*/

const DEFAULT_TAG = 'code';

type CodeDOMProps = React.ComponentPropsWithoutRef<typeof DEFAULT_TAG>;
type CodeOwnProps = {};
type CodeProps = CodeDOMProps & CodeOwnProps;

const Code = forwardRef<typeof DEFAULT_TAG, CodeProps>(function Code(props, forwardedRef) {
  const { as: Comp = DEFAULT_TAG, ...codeProps } = props;
  return (
    <CodeContext.Provider value={React.useMemo(() => ({}), [])}>
      <Comp {...interopDataAttrObj('Code')} ref={forwardedRef} {...codeProps} />
    </CodeContext.Provider>
  );
});

Code.displayName = 'Code';

/* ---------------------------------------------------------------------------------------------- */

const useHasCodeContext = () => useHasContext(CodeContext);

const styles: PrimitiveStyles = {
  code: {
    ...cssReset(DEFAULT_TAG),
    lineHeight: '1',
  },
};

export { Code, styles, useHasCodeContext };
export type { CodeProps };
