import { createStyled } from '@stitches/react';

if (!(createStyled as any)._hmr) {
  process.nextTick(() => {
    (createStyled as any)._hmr = true;
    (module as any).hot.invalidate();
    (module as any).hot.apply({});
  });
}

export const { styled } = createStyled({
  tokens: {
    colors: {
      $white: '#fff',
      $gray100: '#ccc',
      $gray300: '#aaa',
      $black: '#111',
      $red: 'crimson',
      $green: 'green',
    },
  },
});
