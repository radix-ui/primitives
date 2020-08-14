import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Flex, Box, Link as RadixLink, Text } from '@modulz/radix';
import { allPages } from '../utils/pages';
import { getPageIdFromUrl } from '../utils/getPageIdFromUrl';

export function Pagination() {
  const router = useRouter();
  const currentPageId = getPageIdFromUrl(router.pathname);
  const currentPageIndex = allPages.findIndex((page) => page.id === currentPageId);
  const prevPage = allPages[currentPageIndex - 1];
  const nextPage = allPages[currentPageIndex + 1];

  if (!prevPage && !nextPage) return null;

  return (
    <Flex
      key={currentPageId}
      as="nav"
      aria-label="Pagination navigation"
      sx={{ justifyContent: 'space-between', my: 9 }}
    >
      {prevPage ? (
        <Box>
          <Text size={3} sx={{ display: 'block', color: 'gray700', mb: 1 }}>
            Previous
          </Text>
          <Text size={6}>
            <Link href={`/${prevPage.id}`} passHref>
              <RadixLink aria-label={`Previous page: ${prevPage.label}`}>
                {prevPage.label}
              </RadixLink>
            </Link>
          </Text>
        </Box>
      ) : (
        <Box />
      )}

      {nextPage ? (
        <Box sx={{ textAlign: 'right' }}>
          <Text size={3} sx={{ display: 'block', color: 'gray700', mb: 1 }}>
            Next
          </Text>
          <Text size={6}>
            <Link href={`/${nextPage.id}`} passHref>
              <RadixLink aria-label={`Next page: ${nextPage.label}`}>{nextPage.label}</RadixLink>
            </Link>
          </Text>
        </Box>
      ) : (
        <Box />
      )}
    </Flex>
  );
}
