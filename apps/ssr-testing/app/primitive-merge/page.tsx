import * as React from 'react';
import { PRIMITIVE_NODES } from './nodes.mjs';
import { Providers } from './providers';
import { PrimitiveNode } from './primitive-node';

// IMPORTANT: This is intentionally a Server Component authored in an RSC-safe
// way. For every `Primitive.<node>`, it authors the `asChild` child element
// HERE (on the server) and renders it inside a client `Slot.Provider` (see
// `providers.tsx`).
//
// Because `@radix-ui/react-primitive` is a client component, each primitive's
// internal `Slot` renders on the client under the provider and must honor the
// consumer's custom `mergeProps`, even if the child crossed the server/client
// boundary.
//
// `scripts/assert-primitive-merge.mjs` reads the prerendered HTML for this
// route and asserts the marker landed on each primitive.

export default function Page() {
  return (
    <Providers>
      <div>
        {PRIMITIVE_NODES.map((node) => {
          const Child = node as React.ElementType;
          return (
            <PrimitiveNode key={node} node={node}>
              <Child data-testid={`primitive-${node}`} />
            </PrimitiveNode>
          );
        })}
      </div>
    </Providers>
  );
}
