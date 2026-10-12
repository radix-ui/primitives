import * as React from 'react';
import { PRIMITIVE_NODES } from './nodes.mjs';
import { Providers } from './providers';
import { PrimitiveNode } from './primitive-node';

// IMPORTANT: This is intentionally a Server Component authored in an RSC-safe
// way. For every `Primitive.<node>`, it authors the `asChild` child element
// on the server and renders it inside a client `Providers` component.

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
