// This implementation is heavily inspired by react-aria's implementation
// See: https://github.com/adobe/react-spectrum/blob/main/packages/%40react-aria/ssr/src/SSRProvider.tsx

import * as React from 'react';

type SSRContextValue = {
  prefix: number;
  current: number;
};

const defaultSSRContext: SSRContextValue = {
  prefix: Math.round(Math.random() * 10000000000),
  current: 0,
};

const SSRContext = React.createContext<SSRContextValue>(defaultSSRContext);

const SSRProvider: React.FC = (props) => {
  const currentContext = React.useContext(SSRContext);
  const isRootSSRProvider = currentContext === defaultSSRContext;
  const context: SSRContextValue = React.useMemo(
    () => ({
      prefix: isRootSSRProvider ? 0 : ++currentContext.prefix,
      current: 0,
    }),
    [isRootSSRProvider, currentContext]
  );

  return <SSRContext.Provider value={context} {...props} />;
};

function useSSRSafeId(deterministicId?: string): string {
  const context = React.useContext(SSRContext);
  const isDOMEnv = canUseDOM();

  if (!isDOMEnv && context === defaultSSRContext) {
    console.warn(
      'When server rendering, you must wrap your application in an <SSRProvider> to ensure consistent ids are generated between the client and server.'
    );
  }

  return React.useMemo(
    () => deterministicId || `radix-id-${context.prefix}-${++context.current}`,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [deterministicId]
  );
}

function canUseDOM() {
  return Boolean(typeof window !== 'undefined' && window.document && window.document.createElement);
}

export { SSRProvider, useSSRSafeId, canUseDOM };
