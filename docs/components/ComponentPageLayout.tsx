import * as React from 'react';
import { Box, Container } from '@modulz/radix';
import { Navigation } from '../components/Navigation';
import { QuickNavContextProvider, QuickNav } from '../components/QuickNav';

function ComponentPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          bottom: 0,
          width: '245px',
          borderRight: (t) => `1px solid ${t.colors.gray300}`,
        }}
      >
        <Navigation />
      </Box>
      <QuickNavContextProvider>
        <Box sx={{ flexGrow: 1, px: '245px', py: 7 }}>
          <Container size={2}>{children}</Container>
        </Box>
        <QuickNav />
      </QuickNavContextProvider>
    </>
  );
}

export { ComponentPageLayout };
