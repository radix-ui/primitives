'use client';
import * as React from 'react';
import { Direction } from 'radix-ui';

export function Basic({ dir }: { dir: 'ltr' | 'rtl' }) {
  return (
    <Direction.Provider dir={dir}>
      <DirectionReader />
    </Direction.Provider>
  );
}

function DirectionReader() {
  const dir = Direction.useDirection();
  return <div dir={dir}>Direction is {dir}</div>;
}
