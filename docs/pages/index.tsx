import React from 'react';
import { Container, Box, Text, Flex, Link, Heading } from '@modulz/radix';
import { ArrowRightIcon } from '@modulz/radix-icons';
import { FakeComponents } from '../components/FakeComponents';
import { Principles } from '../components/Principles';

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
        <Container size={2} sx={{ textAlign: 'center' }}>
          <Heading size={5} mb={4} sx={{ fontWeight: 500, letterSpacing: '-.052em' }}>
            White-label components for building design systems.
          </Heading>

          <Heading as="h2" size={2} weight="normal" sx={{ color: 'gray700', lineHeight: '4' }}>
            An free and open-source component library for building accessible, React-based design
            systems.
          </Heading>

          <Box sx={{ py: 8 }}>
            <Link href="/overview/introduction" sx={{ display: 'inline-block' }}>
              <Text as="span" size={5} sx={{ color: 'inherit', mr: 1, lineHeight: '1' }}>
                Documentation
              </Text>
              <ArrowRightIcon />
            </Link>
          </Box>
        </Container>

        <FakeComponents />

        <Box sx={{ py: 9 }}>
          <Container size={2}>
            <Principles />
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
