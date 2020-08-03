import React from 'react';
import {
  Container,
  Box,
  Text,
  AspectRatio,
  Code,
  Button,
  Heading,
  Badge,
  Divider,
  Grid,
  CardLink,
  Pipe,
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
import { PlusIcon } from '@modulz/radix-icons';

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
      <Box
        sx={{
          flexGrow: 1,
          px: '245px',
          py: 7,
        }}
      >
        <Container size={2}>
          <Heading as="h1" size={4} sx={{ lineHeight: 9 }}>
            Button
          </Heading>
          <Heading as="h2" size={2} weight="normal" sx={{ lineHeight: 3, color: 'gray700', mb: 6 }}>
            A button enables users to trigger an event, such as submitting a form, opening a dialog,
            canceling an action, or performing a delete operation.
          </Heading>

          <Box sx={{ my: 7 }}>
            <AspectRatio ratio="2:1">
              <Flex
                sx={{
                  backgroundColor: 'blue200',
                  borderRadius: '2',
                  height: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Box sx={{}}>
                  <Box
                    sx={{
                      backgroundColor: 'blue600',
                      color: 'white',
                      boxShadow: 'none',
                      height: '35px',
                      px: 3,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 3,
                      fontWeight: '500',
                      borderRadius: 1,
                      userSelect: 'none',
                    }}
                    style={{
                      lineHeight: 1,
                    }}
                  >
                    Button
                  </Box>
                </Box>
              </Flex>
            </AspectRatio>
          </Box>

          <Box
            sx={{
              mt: 7,
              mb: 5,
            }}
          >
            <Heading as="h3" size={3} sx={{ mb: 4 }}>
              Installation
            </Heading>
            <Text size={3} sx={{ lineHeight: 2 }}>
              Install the component from your command line:
            </Text>
          </Box>
          <CodeBlock>npm install @radixui/react-button</CodeBlock>
          <Text as="p" size={3} sx={{ lineHeight: 2, my: 4 }}>
            Then import the component:
          </Text>
          <CodeBlock>import Button from "@radixui/react-button";</CodeBlock>

          <Box
            sx={{
              mt: 8,
              mb: 5,
            }}
          >
            <Heading as="h3" size={3}>
              Keyboard interaction
            </Heading>
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

          <Box
            sx={{
              mt: 8,
              mb: 5,
            }}
          >
            <Heading as="h3" size={3} mb={3}>
              Examples
            </Heading>
          </Box>

          <Heading as="h4" size={1} sx={{ mt: 7, mb: 5, lineHeight: 2 }}>
            Simple button
          </Heading>

          <CodeBlock live>
            {`
<Button>Button</Button>
`}
          </CodeBlock>

          <Box sx={{ mt: 7, mb: 5 }}>
            <Heading as="h4" size={1} sx={{ lineHeight: 2 }}>
              Button with icon
            </Heading>
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
            <Heading as="h4" size={1} sx={{ lineHeight: 2 }}>
              Button with right icon
            </Heading>
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
            <Heading as="h4" size={1} sx={{ lineHeight: 2 }}>
              Button with two icons
            </Heading>
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

          <Box
            sx={{
              mt: 7,
              mb: 5,
            }}
          >
            <Heading
              as="h4"
              size={1}
              sx={{
                lineHeight: 2,
              }}
            >
              Just the icon
            </Heading>
          </Box>
          <CodeBlock live>
            {`
<Button aria-label="Follow">
  <PlusIcon />
</Button>
`}
          </CodeBlock>

          <Box
            sx={{
              mt: 7,
              mb: 5,
            }}
          >
            <Heading
              as="h4"
              size={1}
              sx={{
                lineHeight: 2,
              }}
            >
              Button with count
            </Heading>
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

          <Box
            sx={{
              mt: 7,
              mb: 5,
            }}
          >
            <Heading
              as="h4"
              size={1}
              sx={{
                lineHeight: 2,
              }}
            >
              Button with Badge
            </Heading>
          </Box>

          <CodeBlock live>
            {`
<Button>
  Button
  <Badge sx={{ ml: 2 }}>58</Badge>
</Button>
`}
          </CodeBlock>

          <Box
            sx={{
              mt: 7,
              mb: 5,
            }}
          >
            <Heading
              as="h4"
              size={1}
              sx={{
                lineHeight: 2,
              }}
            >
              Button with tooltip
            </Heading>
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

          <Box
            sx={{
              mt: 7,
              mb: 5,
            }}
          >
            <Heading as="h3" size={3}>
              Notes (mention menubutton)
            </Heading>
          </Box>

          <Flex
            sx={{
              justifyContent: 'center',
              pt: 9,
            }}
          >
            <Divider size={2} sx={{ flexShrink: 0, width: '65px' }} />
          </Flex>

          <Box
            sx={{
              py: 9,
            }}
          >
            <Box
              sx={{
                mb: 5,
              }}
            >
              <Heading as="h3" size={3} sx={{ mb: 7 }}>
                Related components
              </Heading>
              <Grid sx={{ gap: 5, gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
                <CardLink href="/introduction" sx={{ padding: 0 }}>
                  <AspectRatio ratio="16:9">
                    <Flex
                      sx={{
                        backgroundColor: 'blue200',
                        height: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderTopLeftRadius: 2,
                        borderTopRightRadius: 2,
                      }}
                    >
                      <Box sx={{}}>
                        <Button
                          sx={{
                            backgroundColor: 'blue600',
                            color: 'white',
                            boxShadow: 'none',
                            padding: '10px 20px',
                            fontSize: 3,
                          }}
                          style={{
                            lineHeight: 1,
                          }}
                        >
                          Button
                        </Button>
                      </Box>
                    </Flex>
                  </AspectRatio>
                  <Box sx={{ padding: 4 }}>
                    <Text as="h6" size={4} sx={{ lineHeight: 1, fontWeight: '500', mb: 2 }}>
                      Menu Button
                    </Text>
                    <Text as="p" size={3} sx={{ color: 'gray700', lineHeight: 2 }}>
                      A button that opens a menu.
                    </Text>
                  </Box>
                </CardLink>
                <CardLink href="/introduction" sx={{ padding: 0 }}>
                  <AspectRatio ratio="16:9">
                    <Flex
                      sx={{
                        backgroundColor: 'blue200',
                        height: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderTopLeftRadius: 2,
                        borderTopRightRadius: 2,
                      }}
                    >
                      <Box sx={{}}>
                        <Button
                          sx={{
                            backgroundColor: 'blue600',
                            color: 'white',
                            boxShadow: 'none',
                            padding: '10px 20px',
                            fontSize: 3,
                          }}
                          style={{
                            lineHeight: 1,
                          }}
                        >
                          Button
                        </Button>
                      </Box>
                    </Flex>
                  </AspectRatio>
                  <Box sx={{ padding: 4 }}>
                    <Text as="h6" size={4} sx={{ lineHeight: 1, fontWeight: '500', mb: 2 }}>
                      Toggle Button
                    </Text>
                    <Text as="p" size={3} sx={{ color: 'gray700', lineHeight: 2 }}>
                      A two-state button that can be either off or on.
                    </Text>
                  </Box>
                </CardLink>
                <CardLink href="/introduction" sx={{ padding: 0 }}>
                  <AspectRatio ratio="16:9">
                    <Flex
                      sx={{
                        backgroundColor: 'blue200',
                        height: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderTopLeftRadius: 2,
                        borderTopRightRadius: 2,
                      }}
                    >
                      <Box sx={{}}>
                        <Button
                          sx={{
                            backgroundColor: 'blue600',
                            color: 'white',
                            boxShadow: 'none',
                            padding: '10px 20px',
                            fontSize: 3,
                          }}
                          style={{
                            lineHeight: 1,
                          }}
                        >
                          Button
                        </Button>
                      </Box>
                    </Flex>
                  </AspectRatio>
                  <Box sx={{ padding: 4 }}>
                    <Text as="h6" size={4} sx={{ lineHeight: 1, fontWeight: '500', mb: 2 }}>
                      Tool Bar
                    </Text>
                    <Text as="p" size={3} sx={{ color: 'gray700', lineHeight: 2 }}>
                      A container for grouping a set of controls, such as buttons, menubuttons, or
                      checkboxes.
                    </Text>
                  </Box>
                </CardLink>
              </Grid>
            </Box>
          </Box>

          <Flex
            sx={{
              justifyContent: 'center',
            }}
          >
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

      <Box
        sx={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '245px',
          flexShrink: 0,
          pt: 7,
          pr: 4,
        }}
      >
        <Heading
          as="h4"
          size={1}
          sx={{
            lineHeight: 2,
            mb: 5,
            mt: 3,
          }}
        >
          Quick nav
        </Heading>
        <nav>
          <ul style={{ margin: '0', padding: '0', listStyle: 'none' }}>
            <li>
              <a
                href=""
                style={{ textDecoration: 'none', padding: '5px 0', display: 'inline-flex' }}
              >
                <Text size={3} sx={{ color: 'gray700' }}>
                  Description
                </Text>
              </a>
            </li>
            <li>
              <a
                href=""
                style={{ textDecoration: 'none', padding: '5px 0', display: 'inline-flex' }}
              >
                <Text size={3} sx={{ color: 'gray700' }}>
                  Installation
                </Text>
              </a>
            </li>
            <li>
              <a
                href=""
                style={{ textDecoration: 'none', padding: '5px 0', display: 'inline-flex' }}
              >
                <Text size={3} sx={{ color: 'gray700' }}>
                  Keyboard Interaction
                </Text>
              </a>
            </li>
            <li>
              <a
                href=""
                style={{ textDecoration: 'none', padding: '5px 0', display: 'inline-flex' }}
              >
                <Text size={3} sx={{ color: 'gray700' }}>
                  Examples
                </Text>
              </a>
              <ul style={{ margin: '0', padding: '0 0 0 25px', listStyle: 'none' }}>
                <li>
                  <a
                    href=""
                    style={{ textDecoration: 'none', padding: '5px 0', display: 'inline-flex' }}
                  >
                    <Text size={3} sx={{ color: 'gray700' }}>
                      Simple input
                    </Text>
                  </a>
                </li>
                <li>
                  <a
                    href=""
                    style={{ textDecoration: 'none', padding: '5px 0', display: 'inline-flex' }}
                  >
                    <Text size={3} sx={{ color: 'gray700' }}>
                      Input with placeholder
                    </Text>
                  </a>
                </li>
                <li>
                  <a
                    href=""
                    style={{ textDecoration: 'none', padding: '5px 0', display: 'inline-flex' }}
                  >
                    <Text size={3} sx={{ color: 'gray700' }}>
                      Input with icon
                    </Text>
                  </a>
                </li>
                <li>
                  <a
                    href=""
                    style={{ textDecoration: 'none', padding: '5px 0', display: 'inline-flex' }}
                  >
                    <Text size={3} sx={{ color: 'gray700' }}>
                      Input with right icon
                    </Text>
                  </a>
                </li>
                <li>
                  <a
                    href=""
                    style={{ textDecoration: 'none', padding: '5px 0', display: 'inline-flex' }}
                  >
                    <Text size={3} sx={{ color: 'gray700' }}>
                      Input with icons on both sides
                    </Text>
                  </a>
                </li>
                <li>
                  <a
                    href=""
                    style={{ textDecoration: 'none', padding: '5px 0', display: 'inline-flex' }}
                  >
                    <Text size={3} sx={{ color: 'gray700' }}>
                      Input with interactive content
                    </Text>
                  </a>
                </li>
              </ul>
            </li>
            <li>
              <a
                href=""
                style={{ textDecoration: 'none', padding: '5px 0', display: 'inline-flex' }}
              >
                <Text size={3} sx={{ color: 'gray700' }}>
                  Styled Examples
                </Text>
              </a>
            </li>
            <li>
              <a
                href=""
                style={{ textDecoration: 'none', padding: '5px 0', display: 'inline-flex' }}
              >
                <Text size={3} sx={{ color: 'gray700' }}>
                  Related components
                </Text>
              </a>
            </li>
          </ul>
        </nav>
      </Box>
    </div>
  );
}
