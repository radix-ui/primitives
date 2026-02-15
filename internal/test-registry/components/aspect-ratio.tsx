import * as React from 'react';
import { AspectRatio } from 'radix-ui';

export function Basic() {
  return (
    <div
      style={{
        width: '400px',
        maxWidth: '100%',
        borderRadius: '6px',
        overflow: 'hidden',
        boxShadow: '0 2px 10px var(--black-a7)',
      }}
    >
      <AspectRatio.Root ratio={16 / 9}>
        <img
          src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=300&dpr=2&q=80"
          alt="Landscape photograph by Tobias Tullius"
          style={{ objectFit: 'cover', width: '100%', height: '100%' }}
        />
      </AspectRatio.Root>
    </div>
  );
}
