import React from 'react';
import { Text, Flex, List, Box, ListItem, Badge, Heading, Divider } from '@modulz/radix';
import { ScrollArea } from './ScrollArea';

export const Navigation = () => {
  return (
    <ScrollArea>
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
        <ListItem
          as="a"
          href=""
          variant="active"
          sx={{
            px: 6,
          }}
        >
          <Text size={2} sx={{ color: 'white' }}>
            Introduction
          </Text>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            px: 6,
          }}
        >
          <Text size={2}>Getting started</Text>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            px: 6,
          }}
        >
          <Text size={2}>Roadmap</Text>
        </ListItem>
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
          Docs
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
        <ListItem
          as="a"
          href=""
          sx={{
            px: 6,
          }}
        >
          <Text size={2}>Styling with Interop</Text>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            px: 6,
          }}
        >
          <Text size={2}>Styling with Styled Components</Text>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            px: 6,
          }}
        >
          <Text size={2}>Styling with Emotion</Text>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            px: 6,
          }}
        >
          <Text size={2}>Styling with Treat</Text>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            px: 6,
          }}
        >
          <Text size={2}>Styling with Stitches</Text>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            px: 6,
          }}
        >
          <Text size={2}>Styling with CSS</Text>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            px: 6,
          }}
        >
          <Text size={2}>Animation</Text>
        </ListItem>
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
        <ListItem
          as="a"
          href=""
          sx={{
            pl: 8,
            pr: 3,
          }}
        >
          <Text size={2}>Box</Text>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            pl: 8,
            pr: 3,
          }}
        >
          <Text size={2}>Container</Text>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            pl: 8,
            pr: 3,
          }}
        >
          <Text size={2}>Flex</Text>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            pl: 8,
            pr: 3,
          }}
        >
          <Text size={2}>Grid</Text>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            pl: 8,
            pr: 3,
          }}
        >
          <Text size={2}>Section</Text>
        </ListItem>
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
        <ListItem
          as="a"
          href=""
          sx={{
            pl: 8,
            pr: 3,
          }}
        >
          <Text size={2}>Autocomplete</Text>
          <Badge sx={{ ml: 1 }}>WIP</Badge>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            pl: 8,
            pr: 3,
          }}
        >
          <Text size={2}>ComboBox</Text>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            pl: 8,
            pr: 3,
          }}
        >
          <Text size={2}>Checkbox</Text>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            pl: 8,
            pr: 3,
          }}
        >
          <Text size={2}>DatePicker</Text>
          <Badge sx={{ ml: 1 }}>WIP</Badge>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            pl: 8,
            pr: 3,
          }}
        >
          <Text size={2}>Input</Text>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            pl: 8,
            pr: 3,
          }}
        >
          <Text size={2}>MultiSelect</Text>
          <Badge sx={{ ml: 1 }}>WIP</Badge>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            pl: 8,
            pr: 3,
          }}
        >
          <Text size={2}>Radio</Text>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            pl: 8,
            pr: 3,
          }}
        >
          <Text size={2}>Slider</Text>
          <Badge sx={{ ml: 1 }}>WIP</Badge>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            pl: 8,
            pr: 3,
          }}
        >
          <Text size={2}>Select</Text>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            pl: 8,
            pr: 3,
          }}
        >
          <Text size={2}>Switch</Text>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            pl: 8,
            pr: 3,
          }}
        >
          <Text size={2}>Textarea</Text>
        </ListItem>
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
        <ListItem
          as="a"
          href=""
          sx={{
            pl: 8,
            pr: 3,
          }}
        >
          <Text size={2}>Alert</Text>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            pl: 8,
            pr: 3,
          }}
        >
          <Text size={2}>AlertDialog</Text>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            pl: 8,
            pr: 3,
          }}
        >
          <Text size={2}>Badge</Text>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            pl: 8,
            pr: 3,
          }}
        >
          <Text size={2}>Dialog</Text>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            pl: 8,
            pr: 3,
          }}
        >
          <Text size={2}>Meter</Text>
          <Badge sx={{ ml: 1 }}>WIP</Badge>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            pl: 8,
            pr: 3,
          }}
        >
          <Text size={2}>Progress</Text>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            pl: 8,
            pr: 3,
          }}
        >
          <Text size={2}>Toast</Text>
        </ListItem>
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
        <ListItem
          as="a"
          href=""
          sx={{
            pl: 8,
            pr: 3,
          }}
        >
          <Text size={2}>Blockquote</Text>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            pl: 8,
            pr: 3,
          }}
        >
          <Text size={2}>Code</Text>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            pl: 8,
            pr: 3,
          }}
        >
          <Text size={2}>Text</Text>
        </ListItem>
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
        <ListItem
          as="a"
          href=""
          sx={{
            pl: 8,
            pr: 3,
          }}
        >
          <Text size={2}>AspectRatio</Text>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            pl: 8,
            pr: 3,
          }}
        >
          <Text size={2}>HoverZone</Text>
          <Badge sx={{ ml: 1 }}>WIP</Badge>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            pl: 8,
            pr: 3,
          }}
        >
          <Text size={2}>Portal</Text>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            pl: 8,
            pr: 3,
          }}
        >
          <Text size={2}>ToolBar</Text>
          <Badge sx={{ ml: 1 }}>WIP</Badge>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            pl: 8,
            pr: 3,
          }}
        >
          <Text size={2}>VisuallyHidden</Text>
          <Badge sx={{ ml: 1 }}>WIP</Badge>
        </ListItem>
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
        <ListItem
          as="a"
          href=""
          sx={{
            pl: 8,
            pr: 3,
          }}
        >
          <Text size={2}>HoverCard</Text>
          <Badge sx={{ ml: 1 }}>WIP</Badge>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            pl: 8,
            pr: 3,
          }}
        >
          <Text size={2}>Overlay</Text>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            pl: 8,
            pr: 3,
          }}
        >
          <Text size={2}>Popover</Text>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            pl: 8,
            pr: 3,
          }}
        >
          <Text size={2}>RightClickMenu</Text>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            pl: 8,
            pr: 3,
          }}
        >
          <Text size={2}>Sheet</Text>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            pl: 8,
            pr: 3,
          }}
        >
          <Text size={2}>Tooltip</Text>
        </ListItem>
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
        <ListItem
          as="a"
          href=""
          sx={{
            pl: 8,
            pr: 3,
          }}
        >
          <Text size={2}>Arrow</Text>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            pl: 8,
            pr: 3,
          }}
        >
          <Text size={2}>Accordion</Text>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            pl: 8,
            pr: 3,
          }}
        >
          <Text size={2}>Avatar</Text>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            pl: 8,
            pr: 3,
          }}
        >
          <Text size={2}>Button</Text>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            pl: 8,
            pr: 3,
          }}
        >
          <Text size={2}>Card</Text>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            pl: 8,
            pr: 3,
          }}
        >
          <Text size={2}>Carousel</Text>
          <Badge sx={{ ml: 1 }}>WIP</Badge>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            pl: 8,
            pr: 3,
          }}
        >
          <Text size={2}>Collapsible</Text>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            pl: 8,
            pr: 3,
          }}
        >
          <Text size={2}>Divider</Text>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            pl: 8,
            pr: 3,
          }}
        >
          <Text size={2}>Header</Text>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            pl: 8,
            pr: 3,
          }}
        >
          <Text size={2}>Image</Text>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            pl: 8,
            pr: 3,
          }}
        >
          <Text size={2}>Link</Text>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            pl: 8,
            pr: 3,
          }}
        >
          <Text size={2}>Menu</Text>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            pl: 8,
            pr: 3,
          }}
        >
          <Text size={2}>MenuItem</Text>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            pl: 8,
            pr: 3,
          }}
        >
          <Text size={2}>Tab</Text>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            pl: 8,
            pr: 3,
          }}
        >
          <Text size={2}>Table</Text>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            pl: 8,
            pr: 3,
          }}
        >
          <Text size={2}>ToggleButton</Text>
        </ListItem>
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
        <ListItem
          as="a"
          href=""
          sx={{
            px: 6,
          }}
        >
          <Text size={2}>Layouts</Text>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            px: 6,
          }}
        >
          <Text size={2}>Tutorials</Text>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            px: 6,
          }}
        >
          <Text size={2}>Showcase</Text>
        </ListItem>
      </List>
    </ScrollArea>
  );
};
