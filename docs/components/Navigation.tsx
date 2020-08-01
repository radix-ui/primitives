import React from 'react';
import { Text, Flex, List, Box, ListItem, Badge, Heading, Divider } from '@modulz/radix';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ScrollArea } from './ScrollArea';

export const Navigation = () => {
  return (
    <ScrollArea>
      <Box sx={{ pb: 7 }}>
        <Box
          as="a"
          href="/"
          sx={{
            display: 'inline-flex',
            m: 3,
          }}
        >
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
        </Box>
        <Divider />
        <Flex
          sx={{
            pt: 3,
            pb: 1,
            px: 4,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Text
            as="h3"
            size={3}
            weight="medium"
            sx={{
              lineHeight: 1,
            }}
          >
            Overview
          </Text>
          <Box
            sx={{
              mr: -2,
            }}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ lineHeight: 1 }}
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M8 3C8 2.72386 7.77614 2.5 7.5 2.5C7.22386 2.5 7 2.72386 7 3V7H3C2.72386 7 2.5 7.22386 2.5 7.5C2.5 7.77614 2.72386 8 3 8H7V12C7 12.2761 7.22386 12.5 7.5 12.5C7.77614 12.5 8 12.2761 8 12V8H12C12.2761 8 12.5 7.77614 12.5 7.5C12.5 7.22386 12.2761 7 12 7H8V3Z"
                fill="#282B2E"
              />
            </svg>
          </Box>
        </Flex>
        <List>
          <PageLink href="/introduction">Introduction</PageLink>
          <PageLink href="/getting-started">Installation</PageLink>
          <PageLink href="/getting-started">Styling</PageLink>
          <PageLink href="/getting-started">Animation</PageLink>
          <PageLink href="/roadmap">Roadmap</PageLink>
        </List>
        <Divider />
        <Flex
          sx={{
            pt: 3,
            pb: 1,
            px: 4,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Text
            as="h3"
            size={3}
            weight="medium"
            sx={{
              lineHeight: 1,
            }}
          >
            Components
          </Text>
          <Box
            sx={{
              mr: -2,
            }}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ lineHeight: 1 }}
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M8 3C8 2.72386 7.77614 2.5 7.5 2.5C7.22386 2.5 7 2.72386 7 3V7H3C2.72386 7 2.5 7.22386 2.5 7.5C2.5 7.77614 2.72386 8 3 8H7V12C7 12.2761 7.22386 12.5 7.5 12.5C7.77614 12.5 8 12.2761 8 12V8H12C12.2761 8 12.5 7.77614 12.5 7.5C12.5 7.22386 12.2761 7 12 7H8V3Z"
                fill="#282B2E"
              />
            </svg>
          </Box>
        </Flex>
        <Text
          as="h4"
          size={2}
          pt={2}
          pb={1}
          px={4}
          weight="medium"
          sx={{
            lineHeight: 1,
            px: 6,
          }}
        >
          Layout
        </Text>
        <List>
          <PageLink href="/box" isNested>
            Box
          </PageLink>
          <PageLink href="/flex" isNested>
            Flex
          </PageLink>
        </List>
        <Text
          as="h4"
          size={2}
          pt={2}
          pb={1}
          px={4}
          weight="medium"
          sx={{
            lineHeight: 1,
            px: 6,
          }}
        >
          Input
        </Text>
        <List>
          <PageLink href="/combobox" isNested>
            ComboBox
          </PageLink>
          <PageLink href="/checkbox" isNested>
            Checkbox
          </PageLink>
          <PageLink href="/input" isNested>
            Input
          </PageLink>
          <PageLink href="/radio" isNested>
            Radio
          </PageLink>
          <PageLink href="/slider" isNested>
            Slider
          </PageLink>
          <PageLink href="/select" isNested>
            Select
          </PageLink>
          <PageLink href="/switch" isNested>
            Switch
          </PageLink>
          <PageLink href="/textarea" isNested>
            Textarea
          </PageLink>
        </List>
        <Text
          as="h4"
          size={2}
          pt={2}
          pb={1}
          px={4}
          weight="medium"
          sx={{
            lineHeight: 1,
            px: 6,
          }}
        >
          Feedback
        </Text>
        <List>
          <PageLink href="/alert-dialog" isNested>
            AlertDialog
          </PageLink>
          <PageLink href="/badge" isNested>
            Badge
          </PageLink>
          <PageLink href="/dialog" isNested>
            Dialog
          </PageLink>
          <PageLink href="/progres" isNested>
            Progress
          </PageLink>
          <PageLink href="/toast" isNested>
            Toast
          </PageLink>
        </List>
        <Text
          as="h4"
          size={2}
          pt={2}
          pb={1}
          px={4}
          weight="medium"
          sx={{
            lineHeight: 1,
            px: 6,
          }}
        >
          Text
        </Text>
        <List>
          <PageLink href="/blockquote" isNested>
            Blockquote
          </PageLink>
          <PageLink href="/code" isNested>
            Code
          </PageLink>
          <PageLink href="/text" isNested>
            Text
          </PageLink>
        </List>
        <Text
          as="h4"
          size={2}
          pt={2}
          pb={1}
          px={4}
          weight="medium"
          sx={{
            lineHeight: 1,
            px: 6,
          }}
        >
          Utilities
        </Text>
        <List>
          <PageLink href="/aspect-ratio" isNested>
            AspectRatio
          </PageLink>
          <PageLink href="/hover-zone" isNested>
            HoverZone
          </PageLink>
          <PageLink href="/alert" isNested>
            LiveRegion
          </PageLink>
          <PageLink href="/portal" isNested>
            Portal
          </PageLink>
          <PageLink href="/visually-hidden" isNested>
            <Flex sx={{ alignItems: 'center' }}>
              VisuallyHidden
              <Badge variant="blue" sx={{ ml: 1 }}>
                New
              </Badge>
            </Flex>
          </PageLink>
        </List>
        <Text
          as="h4"
          size={2}
          pt={2}
          pb={1}
          px={4}
          weight="medium"
          sx={{
            lineHeight: 1,
            px: 6,
          }}
        >
          Contextual
        </Text>
        <List>
          <PageLink href="/overlay" isNested>
            Overlay
          </PageLink>
          <PageLink href="/popover" isNested>
            Popover
          </PageLink>
          <PageLink href="/right-click-menu" isNested>
            ContextMenu
          </PageLink>
          <PageLink href="/sheet" isNested>
            Sheet
          </PageLink>
          <PageLink href="/tooltip" isNested>
            tooltip
          </PageLink>
        </List>
        <Text
          as="h4"
          size={2}
          pt={2}
          pb={1}
          px={4}
          weight="medium"
          sx={{
            lineHeight: 1,
            px: 6,
          }}
        >
          Undecided
        </Text>
        <List>
          <PageLink href="/accordion" isNested>
            Accordion
          </PageLink>
          <PageLink href="/avatar" isNested>
            Avatar
          </PageLink>
          <PageLink href="/button" isNested>
            Button
          </PageLink>
          <PageLink href="/card" isNested>
            Card
          </PageLink>
          <PageLink href="/collapsible" isNested>
            Collapsible
          </PageLink>
          <PageLink href="/divider" isNested>
            Divider
          </PageLink>
          <PageLink href="/header" isNested>
            Header
          </PageLink>
          <PageLink href="/image" isNested>
            Image
          </PageLink>
          <PageLink href="/link" isNested>
            Link
          </PageLink>
          <PageLink href="/menu" isNested>
            Menu
          </PageLink>
          <PageLink href="/tab" isNested>
            Tab
          </PageLink>
          <PageLink href="/table" isNested>
            Table
          </PageLink>
          <PageLink href="/toggle-button" isNested>
            ToggleButton
          </PageLink>
        </List>
        <Divider />
        <Flex
          sx={{
            pt: 3,
            pb: 1,
            px: 4,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Text
            as="h3"
            size={3}
            weight="medium"
            sx={{
              lineHeight: 1,
            }}
          >
            Resources
          </Text>
          <Box
            sx={{
              mr: -2,
            }}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ lineHeight: 1 }}
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M8 3C8 2.72386 7.77614 2.5 7.5 2.5C7.22386 2.5 7 2.72386 7 3V7H3C2.72386 7 2.5 7.22386 2.5 7.5C2.5 7.77614 2.72386 8 3 8H7V12C7 12.2761 7.22386 12.5 7.5 12.5C7.77614 12.5 8 12.2761 8 12V8H12C12.2761 8 12.5 7.77614 12.5 7.5C12.5 7.22386 12.2761 7 12 7H8V3Z"
                fill="#282B2E"
              />
            </svg>
          </Box>
        </Flex>
        <List>
          <PageLink href="/layouts">Layouts</PageLink>
          <PageLink href="/tutorials">Tutorials</PageLink>
          <PageLink href="/showcase">Showcase</PageLink>
        </List>
      </Box>
    </ScrollArea>
  );
};

const PageLink = ({ children, isNested = false, ...props }) => {
  const router = useRouter();
  const isActive = router.pathname === props.href;

  return (
    <Link {...props} passHref>
      <ListItem
        as="a"
        sx={{
          pl: isNested ? 8 : 6,
        }}
        variant={isActive ? 'active' : undefined}
      >
        <Text size={2} sx={{ color: isActive ? 'white' : undefined }}>
          {children}
        </Text>
      </ListItem>
    </Link>
  );
};
