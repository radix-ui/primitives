import * as React from 'react';
import { Root, Track, Range, Thumb } from '@radix-ui/react-slider';

export default function Page() {
  return (
    <Root
      defaultValue={[20, 50]}
      max={100}
      step={1}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        width: 200,
        height: 20,
      }}
    >
      <Track
        style={{
          backgroundColor: 'grey',
          position: 'relative',
          flexGrow: 1,
          height: 3,
        }}
      >
        <Range
          style={{
            position: 'absolute',
            backgroundColor: 'blue',
            height: '100%',
          }}
        />
      </Track>
      <Thumb
        style={{
          display: 'block',
          width: 20,
          height: 20,
          backgroundColor: 'blue',
        }}
      />
      <Thumb
        style={{
          display: 'block',
          width: 20,
          height: 20,
          backgroundColor: 'blue',
        }}
      />
    </Root>
  );
}
