import React from 'react';
import { Text, Code, Table, Thead, Tr, Th, Td, Tbody } from '@modulz/radix';
import {
  Hero,
  Title,
  Description,
  Heading,
  SubHeading,
  Paragraph,
  Divider,
} from '../../components/pageComponents';
import { CodeBlock } from '../../components/CodeBlock';
import { RelatedComponents, RelatedComponentCard } from '../../components/RelatedComponentCard';

export default function ButtonPage() {
  return (
    <>
      <Title>Button</Title>
      <Description>
        A button enables users to trigger an event, such as submitting a form, opening a dialog,
        canceling an action, or performing a delete operation.
      </Description>

      <Hero />

      <Heading>Installation</Heading>

      <Paragraph>Install the component from your command line:</Paragraph>
      <CodeBlock>npm install @radixui/react-button</CodeBlock>
      <Paragraph>Then import the component:</Paragraph>
      <CodeBlock>import Button from "@radixui/react-button";</CodeBlock>

      <Divider />

      <Heading>Keyboard interaction</Heading>

      <Table>
        <Thead>
          <Tr>
            <Th>Interaction</Th>
            <Th>Result</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>
              <Code as="kbd">Space</Code>
            </Td>
            <Td>
              <Text>Activates the button.</Text>
            </Td>
          </Tr>
          <Tr>
            <Td>
              <Code as="kbd">Enter</Code>
            </Td>
            <Td>
              <Text>Activates the button.</Text>
            </Td>
          </Tr>
        </Tbody>
      </Table>

      <Divider />

      <Heading>Examples</Heading>

      <SubHeading>Simple button</SubHeading>
      <CodeBlock live>
        {`
<Button>Button</Button>
`}
      </CodeBlock>

      <SubHeading>Button with icon</SubHeading>
      <CodeBlock live>
        {`
<Button>
  <PlusIcon sx={{ mr: 1 }} />
  Button
</Button>
`}
      </CodeBlock>

      <SubHeading>Button with right icon</SubHeading>
      <CodeBlock live>
        {`
<Button>
  Button
  <PlusIcon sx={{ ml: 1 }} />
</Button>
`}
      </CodeBlock>

      <SubHeading>Button with two icons</SubHeading>
      <CodeBlock live>
        {`
<Button>
  <PlusIcon sx={{ mr: 1 }} />
  Button
  <PlusIcon sx={{ ml: 1 }} />
</Button>
`}
      </CodeBlock>

      <SubHeading>Just the icon</SubHeading>
      <CodeBlock live>
        {`
<Button aria-label="Follow">
  <PlusIcon />
</Button>
`}
      </CodeBlock>

      <SubHeading>Button with count</SubHeading>
      <CodeBlock live>
        {`
<Button>
  Follow
  <Pipe sx={{ mx: 2 }} />
  <Text>58</Text>
</Button>
`}
      </CodeBlock>

      <SubHeading>Button with Badge</SubHeading>
      <CodeBlock live>
        {`
<Button>
  Button
  <Badge sx={{ ml: 2 }}>58</Badge>
</Button>
`}
      </CodeBlock>

      <SubHeading>Button with tooltip</SubHeading>
      <CodeBlock live>
        {`
<Tooltip label="Tooltip label" side="top" align="center">
  <Button>
    Hover me
  </Button>
</Tooltip>
`}
      </CodeBlock>

      <Heading>Notes</Heading>
      <Paragraph>Mention MenuButton…</Paragraph>

      <Divider />

      <Heading>Related components</Heading>
      <RelatedComponents>
        <RelatedComponentCard
          href="/menu-button"
          name="Menu Button"
          description="A button that opens a menu."
        />
        <RelatedComponentCard
          href="/toggle-button"
          name="Toggle Button"
          description="A two-state button that can be either off or on."
        />
      </RelatedComponents>
    </>
  );
}
