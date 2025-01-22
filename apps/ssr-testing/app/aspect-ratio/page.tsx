import * as React from 'react';
import { AspectRatio } from '@radix-ui/react-aspect-ratio';

export default function Page() {
  return (
    <div style={{ width: 500 }}>
      <AspectRatio ratio={2 / 1}>
        <img
          src="https://images.unsplash.com/photo-1605030753481-bb38b08c384a?&auto=format&fit=crop&w=400&q=80"
          alt="A house in a forest"
          style={{ objectFit: 'cover', width: '100%', height: '100%' }}
        />
      </AspectRatio>
    </div>
  );
}
