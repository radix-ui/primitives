import * as React from 'react';
import { Slider } from 'radix-ui';

export default function Page() {
  return (
    <Slider.Root
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
      <Slider.Track
        style={{
          backgroundColor: 'grey',
          position: 'relative',
          flexGrow: 1,
          height: 3,
        }}
      >
        <Slider.Range
          style={{
            position: 'absolute',
            backgroundColor: 'blue',
            height: '100%',
          }}
        />
      </Slider.Track>
      <Slider.Thumb
        style={{
          display: 'block',
          width: 20,
          height: 20,
          backgroundColor: 'blue',
        }}
      />
      <Slider.Thumb
        style={{
          display: 'block',
          width: 20,
          height: 20,
          backgroundColor: 'blue',
        }}
      />
    </Slider.Root>
  );
}
