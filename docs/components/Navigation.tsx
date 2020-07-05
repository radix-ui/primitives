import React from 'react';
import { Text, List, ListItem, Heading, Divider } from '@modulz/radix';

export const Navigation = () => {
  return (
    <div>
      <List>
        <ListItem
          as="a"
          href="/"
          sx={{
            px: 4,
          }}
        >
          <Text size={2}>Back to home</Text>
        </ListItem>
      </List>
      <Divider />
      <Text
        as="h3"
        size={3}
        pt={3}
        pb={1}
        px={4}
        weight="medium"
        sx={{
          lineHeight: 1,
        }}
      >
        Overview
      </Text>
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
      <Text
        as="h3"
        size={3}
        pt={3}
        pb={1}
        px={4}
        weight="medium"
        sx={{
          lineHeight: 1,
        }}
      >
        Docs
      </Text>
      <List>
        <ListItem
          as="a"
          href=""
          sx={{
            px: 6,
          }}
        >
          <Text size={2}>Styling</Text>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            px: 6,
          }}
        >
          <Text size={2}>Theming</Text>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            px: 6,
          }}
        >
          <Text size={2}>Using the SX prop</Text>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            px: 6,
          }}
        >
          <Text size={2}>Responsive props</Text>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            px: 6,
          }}
        >
          <Text size={2}>Server-side rendering</Text>
        </ListItem>
      </List>
      <Divider />
      <Text
        as="h3"
        size={3}
        pt={3}
        pb={1}
        px={4}
        weight="medium"
        sx={{
          lineHeight: 1,
        }}
      >
        Components
      </Text>
      <List>
        <ListItem
          as="a"
          href=""
          sx={{
            px: 6,
          }}
        >
          <Text size={2}>Arrow</Text>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            px: 6,
          }}
        >
          <Text size={2}>Accordion</Text>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            px: 6,
          }}
        >
          <Text size={2}>Alert</Text>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            px: 6,
          }}
        >
          <Text size={2}>Autocomplete</Text>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            px: 6,
          }}
        >
          <Text size={2}>Avatar</Text>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            px: 6,
          }}
        >
          <Text size={2}>Badge</Text>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            px: 6,
          }}
        >
          <Text size={2}>Blockquote</Text>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            px: 6,
          }}
        >
          <Text size={2}>Box</Text>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            px: 6,
          }}
        >
          <Text size={2}>Button</Text>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            px: 6,
          }}
        >
          <Text size={2}>Card</Text>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            px: 6,
          }}
        >
          <Text size={2}>Checkbox</Text>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            px: 6,
          }}
        >
          <Text size={2}>Code</Text>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            px: 6,
          }}
        >
          <Text size={2}>Collapsible</Text>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            px: 6,
          }}
        >
          <Text size={2}>Container</Text>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            px: 6,
          }}
        >
          <Text size={2}>Dialog</Text>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            px: 6,
          }}
        >
          <Text size={2}>Divider</Text>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            px: 6,
          }}
        >
          <Text size={2}>Flex</Text>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            px: 6,
          }}
        >
          <Text size={2}>Grid</Text>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            px: 6,
          }}
        >
          <Text size={2}>Header</Text>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            px: 6,
          }}
        >
          <Text size={2}>HoverCard</Text>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            px: 6,
          }}
        >
          <Text size={2}>IconButton</Text>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            px: 6,
          }}
        >
          <Text size={2}>Image</Text>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            px: 6,
          }}
        >
          <Text size={2}>Input</Text>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            px: 6,
          }}
        >
          <Text size={2}>Link</Text>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            px: 6,
          }}
        >
          <Text size={2}>Menu</Text>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            px: 6,
          }}
        >
          <Text size={2}>Overlay</Text>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            px: 6,
          }}
        >
          <Text size={2}>Popover</Text>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            px: 6,
          }}
        >
          <Text size={2}>Progress</Text>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            px: 6,
          }}
        >
          <Text size={2}>Radio</Text>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            px: 6,
          }}
        >
          <Text size={2}>Slider</Text>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            px: 6,
          }}
        >
          <Text size={2}>Select</Text>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            px: 6,
          }}
        >
          <Text size={2}>Switch</Text>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            px: 6,
          }}
        >
          <Text size={2}>Tab</Text>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            px: 6,
          }}
        >
          <Text size={2}>Table</Text>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            px: 6,
          }}
        >
          <Text size={2}>Text</Text>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            px: 6,
          }}
        >
          <Text size={2}>Textarea</Text>
        </ListItem>
        <ListItem
          as="a"
          href=""
          sx={{
            px: 6,
          }}
        >
          <Text size={2}>Tooltip</Text>
        </ListItem>
      </List>
      <Divider />
      <Text
        as="h3"
        size={3}
        pt={3}
        pb={1}
        px={4}
        weight="medium"
        sx={{
          lineHeight: 1,
        }}
      >
        Resources
      </Text>
      <List>
        <ListItem
          as="a"
          href=""
          sx={{
            px: 6,
          }}
        >
          <Text size={2}>Icons</Text>
        </ListItem>
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
          <Text size={2}>Design System</Text>
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
    </div>
  );
};
