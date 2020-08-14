import * as React from 'react';
import { Box, Grid } from '@modulz/radix';
import { SubHeading, Paragraph } from './pageComponents';

export function Principles() {
  return (
    <Grid sx={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: 7 }}>
      <Box>
        <SubHeading hideInQuickNav>Accessible</SubHeading>
        <Paragraph>
          Primitives adhere to WAI-ARIA guidelines and are tested regularly in a wide selection of
          modern browsers and assistive technologies.
        </Paragraph>
      </Box>
      <Box>
        <SubHeading hideInQuickNav>Functional</SubHeading>
        <Paragraph>
          Primitives are feature-rich, with support for keyboard interaction, collision detection,
          focus trapping, dynamic resizing, scroll locking, native fallbacks, and more.
        </Paragraph>
      </Box>
      <Box>
        <SubHeading hideInQuickNav>Interoperable</SubHeading>
        <Paragraph>
          Fully interoperable with Modulz Editor and compatible with Modulz design tool plugins.
        </Paragraph>
      </Box>
      <Box>
        <SubHeading hideInQuickNav>Themeable</SubHeading>
        <Paragraph>
          Primitives are built to be themed. No need to override opinionated styles—Primitives ship
          with zero presentational styles.
        </Paragraph>
      </Box>
      <Box>
        <SubHeading hideInQuickNav>Composable</SubHeading>
        <Paragraph>Components were built to be composed.</Paragraph>
      </Box>
      <Box>
        <SubHeading hideInQuickNav>Open-source</SubHeading>
        <Paragraph>Primitives are free and open-source under the MIT license.</Paragraph>
      </Box>
    </Grid>
  );
}
