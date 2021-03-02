// This implementation is heavily inspired by react-aria's implementation
// See: https://github.com/adobe/react-spectrum/blob/main/packages/%40react-aria/ssr/src/SSRProvider.tsx

import * as React from 'react';

type IdContextValue = {
  prefix: number;
  current: number;
};

const defaultIdContext: IdContextValue = {
  prefix: Math.round(Math.random() * 10000000000),
  current: 0,
};

const IdContext = React.createContext<IdContextValue>(defaultIdContext);

const IdProvider: React.FC = (props) => {
  const currentContext = React.useContext(IdContext);
  const isRootIdProvider = currentContext === defaultIdContext;
  const context: IdContextValue = React.useMemo(
    () => ({
      prefix: isRootIdProvider ? 0 : ++currentContext.prefix,
      current: 0,
    }),
    [isRootIdProvider, currentContext]
  );

  return <IdContext.Provider value={context} {...props} />;
};

function useId(deterministicId?: string): string {
  const context = React.useContext(IdContext);
  const isBrowser = Boolean(globalThis?.document);

  if (!isBrowser && context === defaultIdContext) {
    console.warn(
      'When server rendering, you must wrap your application in an <IdProvider> to ensure consistent ids are generated between the client and server.'
    );
  }

  return React.useMemo(
    () => deterministicId || `radix-id-${context.prefix}-${++context.current}`,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [deterministicId]
  );
}

export { IdProvider, useId };
