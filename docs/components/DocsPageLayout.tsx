import * as React from 'react';
import { Box, Container } from '@modulz/radix';
import { MainNavigation } from './MainNavigation';
import { QuickNavContextProvider, QuickNav } from './QuickNav';
import { Divider } from './pageComponents';
import { Pagination } from './Pagination';

function DocsPageLayout({ children }: { children: React.ReactNode }) {
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
        <MainNavigation />
      </Box>
      <QuickNavContextProvider>
        <Box sx={{ flexGrow: 1, px: '245px', py: 7 }}>
          <Container size={2}>
            {children}
            <Divider />
            <Pagination />
          </Container>
        </Box>
        <QuickNav />
      </QuickNavContextProvider>
    </>
  );
}

export { DocsPageLayout };
