import * as React from 'react';
import { useLayoutEffect } from '@radix-ui/react-use-layout-effect';

// We spaces with `.trim().toString()` to prevent bundlers from trying to `import { useId } from 'react';`
const useReactId = (React as any)[' useId '.trim().toString()] || (() => undefined);
let count = 0;

function useId(deterministicId?: string): string {
  const [id, setId] = React.useState<string | undefined>(useReactId());
  // React versions older than 18 will have client-side ids only.
  useLayoutEffect(() => {
    if (!deterministicId) setId((reactId) => reactId ?? String(count++));
  }, [deterministicId]);
  return deterministicId || (id ? `radix-${id}` : '');
}

export { useId };
