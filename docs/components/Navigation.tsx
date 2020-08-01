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
            width="67"
            height="19"
            viewBox="0 0 67 19"
            fill="none"
          >
            <path
              d="M0 17.95H11.3V15.025H6.75V11.3C6.75 9.19995 8.75 7.92495 10.825 7.92495C11.8 7.92495 12.4 8.04995 13.075 8.24995V4.87495C12.625 4.69995 12.025 4.57495 11.175 4.57495C9.35 4.57495 7.6 5.42495 6.75 6.84995V4.79995H0V7.72495H3.4V15.025H0V17.95Z"
              fill="#200767"
            />
            <path
              d="M17.8904 18.175C19.6654 18.175 21.0404 17.65 21.9154 16.725C22.5154 17.85 23.8904 18.275 26.1904 17.95V15.325C25.3654 15.425 25.0654 15.2 25.0654 14.5V9.125C25.0654 6.075 22.9904 4.55 19.6154 4.55C16.3904 4.55 14.3154 6.35 13.6904 8.575L16.9904 9.225C17.3154 8.05 18.1404 7.425 19.4654 7.425C20.9654 7.425 21.6404 8.15 21.6404 9.275V9.475L18.1404 10.1C15.4154 10.55 13.2904 11.675 13.2904 14.3C13.2904 16.625 15.2404 18.175 17.8904 18.175ZM21.6404 13.275C21.6404 14.75 20.0904 15.525 18.5654 15.525C17.4654 15.525 16.7404 15 16.7404 14.1C16.7404 13.05 17.6654 12.625 18.8404 12.425L21.6404 11.9V13.275Z"
              fill="#200767"
            />
            <path
              d="M31.9807 18.225C33.5307 18.225 34.7307 17.575 35.4557 16.6V17.95H38.9557V0H35.4557V6.15C34.7307 5.2 33.5307 4.55 31.9807 4.55C28.5307 4.55 26.5557 7.65 26.5557 11.375C26.5557 15.125 28.5307 18.225 31.9807 18.225ZM35.5307 11.025V11.75C35.5307 13.975 34.3557 15.225 32.8307 15.225C31.0307 15.225 30.0557 13.65 30.0557 11.375C30.0557 9.125 31.0307 7.55 32.8307 7.55C34.3557 7.55 35.5307 8.775 35.5307 11.025Z"
              fill="#200767"
            />
            <path
              d="M44.9459 3.25H48.5209V0H44.9459V3.25ZM40.4959 17.95H52.7709V15.025H48.4709V4.8H40.5959V7.725H44.9709V15.025H40.4959V17.95Z"
              fill="#200767"
            />
            <path
              d="M62.4611 17.95H66.336L61.6111 11.15L66.011 4.8H62.2611L59.5861 8.775L56.9611 4.8H53.0611L57.4611 11.15L52.7861 17.95H56.5111L59.4611 13.55L62.4611 17.95Z"
              fill="#200767"
            />
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
          <PageLink href="/layouts">Github</PageLink>
          <PageLink href="/layouts">Twitter</PageLink>
          <PageLink href="/layouts">Spectrum</PageLink>
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
