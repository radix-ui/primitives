import * as React from 'react';
import { Arrow } from './Arrow';

export default { title: 'Arrow' };

export function Basic() {
  return (
    <blockquote
      style={{
        position: 'relative',
        width: 'max-content',
        background: 'lemonchiffon',
        borderRadius: 12,
        padding: 22,
      }}
    >
      <p style={{ marginTop: 0 }}>You miss 100% of the shots you don't take.</p>
      <cite>
        <small>- Wayne Gretzky</small>
        <br />- Michael Scott
      </cite>
      <Arrow
        aria-hidden
        style={{
          fill: 'lemonchiffon',
          width: 40,
          height: 20,
          position: 'absolute',
          bottom: -20,
          right: 40,
        }}
      />
    </blockquote>
  );
}

export function WithFills() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
      <Arrow style={{ fill: 'crimson', width: 10, height: 5 }} />
      <Arrow style={{ fill: 'orangered', width: 20, height: 10 }} />
      <Arrow style={{ fill: 'goldenrod', width: 40, height: 30 }} />
      <Arrow style={{ fill: 'yellowgreen', width: 60, height: 60 }} />
      <Arrow
        style={{ fill: 'darkturquoise', width: 60, height: 60, transform: 'rotate(180deg)' }}
      />
      <Arrow style={{ fill: 'dodgerblue', width: 40, height: 30, transform: 'rotate(180deg)' }} />
      <Arrow style={{ fill: 'mediumpurple', width: 20, height: 10, transform: 'rotate(180deg)' }} />
      <Arrow style={{ fill: 'orchid', width: 10, height: 5, transform: 'rotate(180deg)' }} />
    </div>
  );
}
