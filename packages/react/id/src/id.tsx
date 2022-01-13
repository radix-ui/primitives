import * as React from 'react';
import { useLayoutEffect } from '@radix-ui/react-use-layout-effect';

// We `toString()` to prevent bundlers from trying to `import { useId } from 'react';`
const useReactId = (React as any)['useId'.toString()] || (() => undefined);
let count = 0;

function useId(deterministicId?: string): string {
  const [id, setId] = React.useState<string | undefined>(useReactId());
  // React versions older than 18 will have client-side ids only.
  useLayoutEffect(() => {
    if (!deterministicId) setId((reactId) => reactId ?? String(count++));
  }, [deterministicId]);
  return deterministicId || (id ? `radix-${id}` : '');
}

// DEPRECATED
function IdProvider({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.warn(ID_PROVIDER_DEPRECATED);
    }
  }, []);
  return <>{children}</>;
}

const ID_PROVIDER_DEPRECATED = `Warning: The \`IdProvider\` has been deprecated. For details, see https://radix-ui.com/docs/primitives/utilities/id-provider`;

export { IdProvider, useId };
