import * as React from 'react';
import { SkipNavLink, SkipNavContent } from './SkipNav';
import { Box, Container } from '@modulz/radix';
import { MainNavigation } from './MainNavigation';
import { QuickNavContextProvider, QuickNav } from './QuickNav';
import { Divider } from './pageComponents';
import { Pagination } from './Pagination';

const MED_BP = 600;
const LRG_BP = 1000;
const SIDEBAR_WIDTH = 245;

function DocsPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SkipNavLink />
      <Box
        as="header"
        sx={{
          width: '100%',
          borderBottom: (t) => `1px solid ${t.colors.gray300}`,
          [`@media screen and (min-width: ${MED_BP}px)`]: {
            position: 'fixed',
            top: 0,
            bottom: 0,
            width: `${SIDEBAR_WIDTH}px`,
            borderBottom: 0,
            borderRight: (t) => `1px solid ${t.colors.gray300}`,
          },
        }}
      >
        <MainNavigation
          sx={{
            [`@media screen and (min-width: ${MED_BP}px)`]: {
              pb: 7,
            },
          }}
        />
      </Box>
      <QuickNavContextProvider>
        <SkipNavContent />
        <Box
          as="main"
          sx={{
            flexGrow: 1,
            py: 7,
            [`@media screen and (min-width: ${MED_BP}px)`]: {
              pl: `${SIDEBAR_WIDTH}px`,
            },
            [`@media screen and (min-width: ${LRG_BP}px)`]: {
              pr: `${SIDEBAR_WIDTH}px`,
            },
          }}
        >
          <Container size={2}>
            {children}
            <Divider />
            <Pagination />
          </Container>
        </Box>
        <QuickNav
          as="aside"
          sx={{
            display: 'none',
            [`@media screen and (min-width: ${LRG_BP}px)`]: {
              display: 'block',
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: `${SIDEBAR_WIDTH}px`,
              flexShrink: 0,
              pt: 7,
              pr: 4,
            },
          }}
        />
      </QuickNavContextProvider>
    </>
  );
}

export { DocsPageLayout };
