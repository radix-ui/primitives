import * as React from 'react';
import { AspectRatio, styles as aspectRatioStyles } from './AspectRatio';

export default { title: 'AspectRatio' };

export function Basic() {
  return (
    <div style={{ display: 'flex', gap: 10 }}>
      <div style={{ width: 200 }}>
        <AspectRatio.Root ratio="3:2" style={{ ...aspectRatioStyles.root }}>
          <AspectRatio.Inner style={{ ...aspectRatioStyles.inner, overflow: 'hidden' }}>
            <img src="https://picsum.photos/400/400" alt="" style={{ width: '100%' }} />
          </AspectRatio.Inner>
        </AspectRatio.Root>
      </div>
      <div style={{ width: 200 }}>
        <AspectRatio.Root ratio="4:2" style={{ ...aspectRatioStyles.root }}>
          <AspectRatio.Inner
            style={{
              ...aspectRatioStyles.inner,
              background: 'crimson',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <p>Red box!</p>
          </AspectRatio.Inner>
        </AspectRatio.Root>
      </div>
    </div>
  );
}
