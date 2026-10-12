'use client';

import * as React from 'react';
import { Primitive } from 'radix-ui/internal';

const PrimitiveByNode = Primitive as unknown as Record<string, React.ElementType>;

export function PrimitiveNode({ node, children }: { node: string; children: React.ReactNode }) {
  const Component = PrimitiveByNode[node];
  if (!Component) {
    throw new Error(`Unknown primitive node: ${node}`);
  }
  return <Component asChild>{children}</Component>;
}
