import React from 'react';
import {
  Container,
  Box,
  Text,
  AspectRatio,
  Code,
  Divider,
  Grid,
  Table,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
  Flex,
  Link,
} from '@modulz/radix';
import { Navigation } from '../components/Navigation';
import { CodeBlock } from '../components/CodeBlock';
import { QuickNav } from '../components/QuickNav';
import { PageTitle, PageDescription, PageHeading, PageSubHeading } from '../components/Typography';
import { RelatedComponentCard } from '../components/RelatedComponentCard';

export default function ButtonPage() {
  return (
    <div>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          bottom: 0,
          width: '245px',
          flexShrink: 0,
          borderRightWidth: '1px',
          borderRightStyle: 'solid',
          borderRightColor: 'gray300',
        }}
      >
        <Navigation />
      </Box>
      <Box sx={{ flexGrow: 1, px: '245px', py: 7 }}>
        <Container size={2}>
          <PageTitle>Button</PageTitle>
          <PageDescription>
            A button enables users to trigger an event, such as submitting a form, opening a dialog,
            canceling an action, or performing a delete operation.
          </PageDescription>

          <AspectRatio ratio="2:1" sx={{ my: 7 }}>
            <Box sx={{ bg: 'blue200', borderRadius: '2', height: '100%' }} />
          </AspectRatio>

          <Box sx={{ mt: 7, mb: 5 }}>
            <PageHeading>Installation</PageHeading>
            <Text size={3} sx={{ lineHeight: 2 }}>
              Install the component from your command line:
            </Text>
          </Box>
          <CodeBlock>npm install @radixui/react-button</CodeBlock>
          <Text as="p" size={3} sx={{ lineHeight: 2, my: 4 }}>
            Then import the component:
          </Text>
          <CodeBlock>import Button from "@radixui/react-button";</CodeBlock>

          <Box sx={{ mt: 8, mb: 5 }}>
            <PageHeading>Keyboard interaction</PageHeading>
          </Box>

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

          <Box sx={{ mt: 8, mb: 5 }}>
            <PageHeading>Examples</PageHeading>
          </Box>

          <PageSubHeading>Simple button</PageSubHeading>

          <CodeBlock live>
            {`
<Button>Button</Button>
`}
          </CodeBlock>

          <Box sx={{ mt: 7, mb: 5 }}>
            <PageSubHeading>Button with icon</PageSubHeading>
          </Box>
          <CodeBlock live>
            {`
<Button>
  <PlusIcon sx={{ mr: 1 }} />
  Button
</Button>
`}
          </CodeBlock>

          <Box sx={{ mt: 7, mb: 5 }}>
            <PageSubHeading>Button with right icon</PageSubHeading>
          </Box>
          <CodeBlock live>
            {`
<Button>
  Button
  <PlusIcon sx={{ ml: 1 }} /> />
</Button>
`}
          </CodeBlock>

          <Box sx={{ mt: 7, mb: 5 }}>
            <PageSubHeading>Button with two icons</PageSubHeading>
          </Box>
          <CodeBlock live>
            {`
<Button>
  <PlusIcon sx={{ mr: 1 }} />
  Button
  <PlusIcon sx={{ ml: 1 }} />
</Button>
`}
          </CodeBlock>

          <Box sx={{ mt: 7, mb: 5 }}>
            <PageSubHeading>Just the icon</PageSubHeading>
          </Box>
          <CodeBlock live>
            {`
<Button aria-label="Follow">
  <PlusIcon />
</Button>
`}
          </CodeBlock>

          <Box sx={{ mt: 7, mb: 5 }}>
            <PageSubHeading>Button with count</PageSubHeading>
          </Box>
          <CodeBlock live>
            {`
<Button>
  Follow
  <Pipe sx={{ mx: 2 }} />
  <Text>58</Text>
</Button>
`}
          </CodeBlock>

          <Box sx={{ mt: 7, mb: 5 }}>
            <PageSubHeading>Button with Badge</PageSubHeading>
          </Box>

          <CodeBlock live>
            {`
<Button>
  Button
  <Badge sx={{ ml: 2 }}>58</Badge>
</Button>
`}
          </CodeBlock>

          <Box sx={{ mt: 7, mb: 5 }}>
            <PageSubHeading>Button with tooltip</PageSubHeading>
          </Box>
          <CodeBlock live>
            {`
<Tooltip label="Tooltip label" side="top" align="center">
  <Button>
    Hover me
  </Button>
</Tooltip>
`}
          </CodeBlock>

          <Box sx={{ mt: 7, mb: 5 }}>
            <PageHeading>Notes (mention menubutton)</PageHeading>
          </Box>

          <Flex sx={{ justifyContent: 'center', pt: 9 }}>
            <Divider size={2} sx={{ flexShrink: 0, width: '65px' }} />
          </Flex>

          <Box sx={{ py: 9, mb: 5 }}>
            <PageHeading>Related components</PageHeading>

            <Grid sx={{ gap: 5, gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
              <RelatedComponentCard
                href="/introduction"
                name="Menu Button"
                description="A button that opens a menu."
              />
              <RelatedComponentCard
                href="/introduction"
                name="Toggle Button"
                description="A two-state button that can be either off or on."
              />
              <RelatedComponentCard
                href="/introduction"
                name="Tool Bar"
                description="A container for grouping a set of controls, such as buttons, menubuttons, or
                      checkboxes."
              />
            </Grid>
          </Box>

          <Flex sx={{ justifyContent: 'center' }}>
            <Divider size={2} sx={{ flexShrink: 0, width: '65px' }} />
          </Flex>

          <Flex sx={{ justifyContent: 'space-between', my: 9 }}>
            <Box>
              <Link>
                <Text size={3} sx={{ display: 'block', color: 'gray700', mb: 1 }}>
                  Previous
                </Text>
                <Text size={6} sx={{ display: 'block', color: 'inherit' }}>
                  Card
                </Text>
              </Link>
            </Box>

            <Box>
              <Link>
                <Text
                  size={3}
                  sx={{ display: 'block', color: 'gray700', textAlign: 'right', mb: 1 }}
                >
                  Next
                </Text>
                <Text size={6} sx={{ display: 'block', textAlign: 'right', color: 'inherit' }}>
                  CardLink
                </Text>
              </Link>
            </Box>
          </Flex>
        </Container>
      </Box>

      <QuickNav />
    </div>
  );
}
