import React from 'react';
import { Container, Box, Text, Flex, Link, Grid, Heading } from '@modulz/radix';
import { ArrowRightIcon } from '@modulz/radix-icons';
import { FakeComponents } from '../components/FakeComponents';

export default function Home() {
  return (
    <Box>
      <Box as="header" sx={{ mb: 8, p: 3 }}>
        <Flex sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Logo />
          </Box>
          <Flex as="nav">
            <Link href="https://www.github.com/modulz" variant="fade" sx={{ ml: 5 }}>
              <Flex sx={{ alignItems: 'center' }}>
                <Text as="span" size={3} sx={{ color: 'inherit', mr: 1, lineHeight: '1' }}>
                  Github
                </Text>
                <ArrowRightIcon />
              </Flex>
            </Link>
            <Link href="https://www.twitter.com/modulz" variant="fade" sx={{ ml: 5 }}>
              <Flex sx={{ alignItems: 'center' }}>
                <Text as="span" size={3} sx={{ color: 'inherit', mr: 1, lineHeight: '1' }}>
                  Twitter
                </Text>
                <ArrowRightIcon />
              </Flex>
            </Link>
          </Flex>
        </Flex>
      </Box>
      <Box mt={6} mb={8}>
        <Container size={2}>
          <Heading
            size={5}
            mb={4}
            sx={{ textAlign: 'center', fontWeight: 500, letterSpacing: '-.052em' }}
          >
            White-label components for building design systems.
          </Heading>

          <Heading
            as="h2"
            size={2}
            weight="normal"
            sx={{ textAlign: 'center', color: 'gray700', lineHeight: '4' }}
          >
            An free and open-source component library for building accessible, React-based design
            systems.
          </Heading>

          <Flex sx={{ py: 8, justifyContent: 'center' }}>
            <Box>
              <Link href="/overview/introduction">
                <Flex sx={{ alignItems: 'center' }}>
                  <Text as="span" size={5} sx={{ color: 'inherit', mr: 1, lineHeight: '1' }}>
                    Documentation
                  </Text>
                  <ArrowRightIcon />
                </Flex>
              </Link>
            </Box>
          </Flex>
        </Container>

        <FakeComponents />

        <Box sx={{ py: 9 }}>
          <Container size={2}>
            <Grid sx={{ gridTemplateColumns: ['repeat(1, 1fr)', 'repeat(2, 1fr)'], gap: 7 }}>
              <Box>
                <Heading as="h3" size={1} mb={3}>
                  Accessible
                </Heading>
                <Text as="p" size={4} sx={{ lineHeight: '3' }}>
                  Primitives adhere to WAI-ARIA guidelines and are tested regularly in a wide
                  selection of modern browsers and assistive technologies.
                </Text>
              </Box>
              <Box>
                <Heading as="h3" size={1} mb={3}>
                  Functional
                </Heading>
                <Text as="p" size={4} sx={{ lineHeight: '3' }}>
                  Primitives are feature-rich, with support for keyboard interaction, collision
                  detection, focus trapping, dynamic resizing, scroll locking, native fallbacks, and
                  more.
                </Text>
              </Box>
              <Box>
                <Heading as="h3" size={1} mb={3}>
                  Interoperable
                </Heading>
                <Text as="p" size={4} sx={{ lineHeight: '3' }}>
                  Fully interoperable with Modulz Editor and compatible with Modulz design tool
                  plugins.
                </Text>
              </Box>
              <Box>
                <Heading as="h3" size={1} mb={3}>
                  Themeable
                </Heading>
                <Text as="p" size={4} sx={{ lineHeight: '3' }}>
                  Primitives are built to be themed. No need to override opinionated
                  styles—Primitives ship with zero presentational styles.
                </Text>
              </Box>
              <Box>
                <Heading as="h3" size={1} mb={3}>
                  Composable
                </Heading>
                <Text as="p" size={4} sx={{ lineHeight: '3' }}>
                  Components were built to be composed.
                </Text>
              </Box>
              <Box>
                <Heading as="h3" size={1} mb={3}>
                  Open-source
                </Heading>
                <Text as="p" size={4} sx={{ lineHeight: '3' }}>
                  Primitives are free and open-source under the MIT license.
                </Text>
              </Box>
            </Grid>
          </Container>
        </Box>
      </Box>
    </Box>
  );
}

export function Logo() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="35"
      height="35"
      viewBox="0 0 35 35"
      fill="none"
      style={{ verticalAlign: 'middle' }}
    >
      <circle cx="12.5" cy="22.5" r="8" stroke="black" />
      <circle cx="22.5" cy="22.5" r="8" stroke="black" />
      <circle cx="17.5" cy="12.5" r="8" stroke="black" />
    </svg>
  );
}
