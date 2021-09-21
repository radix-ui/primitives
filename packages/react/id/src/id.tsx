// This implementation is heavily inspired by react-aria's implementation
// See: https://github.com/adobe/react-spectrum/blob/main/packages/%40react-aria/ssr/src/SSRProvider.tsx

import * as React from 'react';
import { createContext } from '@radix-ui/react-context';

const PROVIDER_NAME = 'IdProvider';

const defaultIdContext = {
  prefix: Math.round(Math.random() * 10000000000),
  current: 0,
};

const [IdProviderImpl, useIdContext] = createContext(PROVIDER_NAME, defaultIdContext);

const IdProvider: React.FC<{ children: React.ReactNode }> = (props) => {
  const currentContext = useIdContext(PROVIDER_NAME);
  const isRootIdProvider = currentContext === defaultIdContext;
  return (
    <IdProviderImpl
      prefix={isRootIdProvider ? 0 : ++currentContext.prefix}
      current={0}
      {...props}
    />
  );
};

function useId(deterministicId?: string): string {
  const context = useIdContext('IdProviderConsumer');
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
