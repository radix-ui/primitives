import React from 'react';
import { Text, Code, Table, Thead, Tr, Th, Td, Tbody } from '@modulz/radix';
import { TitleDescription } from '../../components/TitleDescription';
import { Hero, Heading, SubHeading, Paragraph, Divider } from '../../components/pageComponents';
import { CodeBlock } from '../../components/CodeBlock';
import { RelatedComponents, RelatedComponentCard } from '../../components/RelatedComponentCard';

export default function InputPage() {
  return (
    <>
      <TitleDescription />

      <Hero />

      <Heading>Installation</Heading>

      <Paragraph>Install the component from your command line:</Paragraph>
      <CodeBlock>npm install @radixui/react-input</CodeBlock>
      <Paragraph>Then import the component:</Paragraph>
      <CodeBlock>import Input from "@radixui/react-input";</CodeBlock>

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
              {/* @ts-ignore */}
              <Code as="kbd">Space</Code>
            </Td>
            <Td>
              <Text>Activates the button.</Text>
            </Td>
          </Tr>
          <Tr>
            <Td>
              {/* @ts-ignore */}
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

      <SubHeading>Simple input</SubHeading>
      <CodeBlock live>
        {`
<Input />
`}
      </CodeBlock>

      <SubHeading>Input with placeholder</SubHeading>
      <CodeBlock live>
        {`
<Input placeholder="Placeholder" />
`}
      </CodeBlock>

      <SubHeading>Input with icon</SubHeading>
      <CodeBlock live>
        {`
<Box sx={{ position: 'relative' }}>
  <Input placeholder="Placeholder" sx={{ paddingLeft: '25px' }} />
  <Flex sx={{
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    pointerEvents: 'none',
    px: '5px'
  }}>
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M10 6.5C10 8.433 8.433 10 6.5 10C4.567 10 3 8.433 3 6.5C3 4.567 4.567 3 6.5 3C8.433 3 10 4.567 10 6.5ZM9.30884 10.0159C8.53901 10.6318 7.56251 11 6.5 11C4.01472 11 2 8.98528 2 6.5C2 4.01472 4.01472 2 6.5 2C8.98528 2 11 4.01472 11 6.5C11 7.56251 10.6318 8.53901 10.0159 9.30884L12.8536 12.1464C13.0488 12.3417 13.0488 12.6583 12.8536 12.8536C12.6583 13.0488 12.3417 13.0488 12.1464 12.8536L9.30884 10.0159Z" fill="#282B2E"/>
    </svg>
  </Flex>
</Box>
`}
      </CodeBlock>

      <SubHeading>Input with right icon</SubHeading>
      <CodeBlock live>
        {`
<Box sx={{ position: 'relative' }}>
  <Input placeholder="Placeholder" sx={{ paddingRight: '25px' }} />
  <Flex sx={{
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'flex-end',
    pointerEvents: 'none',
    px: '5px'
  }}>
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M10 6.5C10 8.433 8.433 10 6.5 10C4.567 10 3 8.433 3 6.5C3 4.567 4.567 3 6.5 3C8.433 3 10 4.567 10 6.5ZM9.30884 10.0159C8.53901 10.6318 7.56251 11 6.5 11C4.01472 11 2 8.98528 2 6.5C2 4.01472 4.01472 2 6.5 2C8.98528 2 11 4.01472 11 6.5C11 7.56251 10.6318 8.53901 10.0159 9.30884L12.8536 12.1464C13.0488 12.3417 13.0488 12.6583 12.8536 12.8536C12.6583 13.0488 12.3417 13.0488 12.1464 12.8536L9.30884 10.0159Z" fill="#282B2E"/>
    </svg>
  </Flex>
</Box>
`}
      </CodeBlock>

      <SubHeading>Input with icons on both sides</SubHeading>
      <CodeBlock live>
        {`
<Box sx={{ position: 'relative' }}>
  <Input placeholder="Placeholder" sx={{ px: '25px' }} />
  <Flex sx={{
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'space-between',
    pointerEvents: 'none',
    px: '5px'
  }}>
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M10 6.5C10 8.433 8.433 10 6.5 10C4.567 10 3 8.433 3 6.5C3 4.567 4.567 3 6.5 3C8.433 3 10 4.567 10 6.5ZM9.30884 10.0159C8.53901 10.6318 7.56251 11 6.5 11C4.01472 11 2 8.98528 2 6.5C2 4.01472 4.01472 2 6.5 2C8.98528 2 11 4.01472 11 6.5C11 7.56251 10.6318 8.53901 10.0159 9.30884L12.8536 12.1464C13.0488 12.3417 13.0488 12.6583 12.8536 12.8536C12.6583 13.0488 12.3417 13.0488 12.1464 12.8536L9.30884 10.0159Z" fill="#282B2E"/>
    </svg>
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M10 6.5C10 8.433 8.433 10 6.5 10C4.567 10 3 8.433 3 6.5C3 4.567 4.567 3 6.5 3C8.433 3 10 4.567 10 6.5ZM9.30884 10.0159C8.53901 10.6318 7.56251 11 6.5 11C4.01472 11 2 8.98528 2 6.5C2 4.01472 4.01472 2 6.5 2C8.98528 2 11 4.01472 11 6.5C11 7.56251 10.6318 8.53901 10.0159 9.30884L12.8536 12.1464C13.0488 12.3417 13.0488 12.6583 12.8536 12.8536C12.6583 13.0488 12.3417 13.0488 12.1464 12.8536L9.30884 10.0159Z" fill="#282B2E"/>
    </svg>
  </Flex>
</Box>
`}
      </CodeBlock>

      <SubHeading>Input with interactive content</SubHeading>
      <Paragraph>
        Does anybody know if it’s possible to make codesandbox use a different version of prettier?
        I’m suspecting they are not using v2 as formatting seems to stop working with TS the minute
        I use things like <Code>??</Code> or <Code>??</Code>.
      </Paragraph>
      <CodeBlock live>
        {`
<Box sx={{ position: 'relative' }}>
  <Input placeholder="Placeholder" sx={{ px: '25px' }} />
  <Flex sx={{
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'space-between',
    pointerEvents: 'none',
    px: '5px'
  }}>
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M10 6.5C10 8.433 8.433 10 6.5 10C4.567 10 3 8.433 3 6.5C3 4.567 4.567 3 6.5 3C8.433 3 10 4.567 10 6.5ZM9.30884 10.0159C8.53901 10.6318 7.56251 11 6.5 11C4.01472 11 2 8.98528 2 6.5C2 4.01472 4.01472 2 6.5 2C8.98528 2 11 4.01472 11 6.5C11 7.56251 10.6318 8.53901 10.0159 9.30884L12.8536 12.1464C13.0488 12.3417 13.0488 12.6583 12.8536 12.8536C12.6583 13.0488 12.3417 13.0488 12.1464 12.8536L9.30884 10.0159Z" fill="#282B2E"/>
    </svg>
    <button style={{ lineHeight: '1', border: 'none', padding: '0', width: '15px', height: '15px', pointerEvents: 'auto' }}>
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M11.3536 4.35355C11.5488 4.15829 11.5488 3.84171 11.3536 3.64645C11.1583 3.45118 10.8417 3.45118 10.6464 3.64645L7.5 6.79289L4.35355 3.64645C4.15829 3.45118 3.84171 3.45118 3.64645 3.64645C3.45118 3.84171 3.45118 4.15829 3.64645 4.35355L6.79289 7.5L3.64645 10.6464C3.45118 10.8417 3.45118 11.1583 3.64645 11.3536C3.84171 11.5488 4.15829 11.5488 4.35355 11.3536L7.5 8.20711L10.6464 11.3536C10.8417 11.5488 11.1583 11.5488 11.3536 11.3536C11.5488 11.1583 11.5488 10.8417 11.3536 10.6464L8.20711 7.5L11.3536 4.35355Z" fill="#282B2E"/>
      </svg>
    </button>
  </Flex>
</Box>
`}
      </CodeBlock>

      <Divider />

      <Heading>Styled Examples</Heading>

      <CodeBlock live>
        {`
<Input placeholder="Placeholder" />
`}
      </CodeBlock>

      <CodeBlock live>
        {`
<Input placeholder="Placeholder" />
`}
      </CodeBlock>

      <CodeBlock live>
        {`
<Input placeholder="Placeholder" />
`}
      </CodeBlock>

      <CodeBlock live>
        {`
<Input placeholder="Placeholder" />
`}
      </CodeBlock>

      <Divider />

      <Heading>Related components</Heading>
      <RelatedComponents>
        <RelatedComponentCard id="components/button" />
        <RelatedComponentCard id="components/button" />
      </RelatedComponents>
    </>
  );
}
