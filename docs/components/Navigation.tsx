import React from 'react';
import { Text, Flex, List, Box, ListItem, Badge, Divider } from '@modulz/radix';
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
            width="61"
            height="18"
            viewBox="0 0 61 18"
            fill="none"
          >
            <path
              d="M0.264648 17H10.4996V14.654H6.17565V10.629C6.17565 8.58196 8.10765 7.38596 9.97065 7.38596C10.9366 7.38596 11.5116 7.52396 12.1326 7.73096V5.01696C11.6956 4.83296 11.0976 4.69496 10.2466 4.69496C8.56765 4.69496 6.93465 5.49996 6.17565 6.87996V4.92496H0.264648V7.27096H3.46165V14.654H0.264648V17Z"
              fill="#1F0D53"
            />
            <path
              d="M16.4477 17.207C18.0807 17.207 19.3917 16.724 20.1967 15.85C20.6337 16.839 21.7147 17.23 23.7847 17V14.861C23.0027 14.953 22.6807 14.746 22.6807 14.056V8.85796C22.6807 6.07496 20.8637 4.69496 17.8737 4.69496C15.0907 4.69496 13.2507 6.25896 12.6297 8.25996L15.2057 8.88096C15.5507 7.70796 16.4017 7.06396 17.7587 7.06396C19.2997 7.06396 19.9897 7.79996 19.9897 8.94996V9.15696L16.4247 9.84696C14.0097 10.307 12.2387 11.342 12.2387 13.642C12.2387 15.804 14.0557 17.207 16.4477 17.207ZM19.9897 12.745C19.9897 14.217 18.3797 14.999 16.8387 14.999C15.7347 14.999 14.9987 14.47 14.9987 13.527C14.9987 12.446 15.9417 12.032 17.1377 11.802L19.9897 11.25V12.745Z"
              fill="#1F0D53"
            />
            <path
              d="M29.5027 17.253C30.9517 17.253 32.0327 16.632 32.7457 15.735V17H35.5057V0.485962H32.7457V6.21296C32.0327 5.31596 30.9517 4.69496 29.5027 4.69496C26.3057 4.69496 24.4427 7.54696 24.4427 10.974C24.4427 14.401 26.3057 17.253 29.5027 17.253ZM32.8147 10.629V11.342C32.8147 13.573 31.6187 14.838 30.0777 14.838C28.2377 14.838 27.2487 13.274 27.2487 10.974C27.2487 8.67396 28.2377 7.10996 30.0777 7.10996C31.6187 7.10996 32.8147 8.35196 32.8147 10.629Z"
              fill="#1F0D53"
            />
            <path
              d="M41.4077 3.31496H44.2597V0.485962H41.4077V3.31496ZM37.3597 17H48.3077V14.654H44.2137V4.92496H37.3597V7.27096H41.4537V14.654H37.3597V17Z"
              fill="#1F0D53"
            />
            <path
              d="M57.6137 17H60.6957L56.3027 10.744L60.3737 4.92496H57.3837L54.6467 8.92696L51.9787 4.92496H48.8737L52.9447 10.744L48.5747 17H51.5417L54.5547 12.584L57.6137 17Z"
              fill="#1F0D53"
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
                fillRule="evenodd"
                clipRule="evenodd"
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
                fillRule="evenodd"
                clipRule="evenodd"
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
                fillRule="evenodd"
                clipRule="evenodd"
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
      <ListItem as="a" sx={{ pl: isNested ? 8 : 6 }} variant={isActive ? 'active' : undefined}>
        <Text size={2} sx={{ color: isActive ? 'white' : undefined }}>
          {children}
        </Text>
      </ListItem>
    </Link>
  );
};
