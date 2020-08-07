import React from 'react';
import {
  Container,
  Box,
  Button,
  Flex,
  Divider,
  AspectRatio,
  Table,
  Link,
  Grid,
  CardLink,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Text,
  Code,
  Input,
  Heading,
} from '@modulz/radix';
import { Navigation } from '../components/Navigation';
import { CodeBlock } from '../components/CodeBlock';
import { PlusIcon } from '@modulz/radix-icons';

export default function InputPage() {
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
          <Heading
            as="h1"
            size={4}
            sx={{
              lineHeight: 9,
            }}
          >
            Input
          </Heading>
          <Heading
            as="h2"
            size={2}
            weight="normal"
            sx={{
              lineHeight: 3,
              color: 'gray700',
              mb: 6,
            }}
          >
            An input is a form control.
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
                <Box
                  sx={{
                    backgroundColor: 'white',
                    height: '35px',
                    width: '75%',
                    maxWidth: '250px',
                    flexShrink: 0,
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'blue400',
                  }}
                ></Box>
              </Flex>
            </AspectRatio>
          </Box>

          <Box
            sx={{
              mt: 7,
              mb: 5,
            }}
          >
            <Heading as="h3" size={3}>
              Installation
            </Heading>
            <Text size={3} sx={{ lineHeight: 2 }}>
              Install the component from your command line:
            </Text>
          </Box>
          <CodeBlock>npm install @radixui/react-input</CodeBlock>
          <Text as="p" size={3} sx={{ lineHeight: 2, my: 4 }}>
            Then import the component:
          </Text>
          <CodeBlock>import Input from "@radixui/react-input";</CodeBlock>

          <Flex
            sx={{
              justifyContent: 'center',
              py: 9,
            }}
          >
            <Divider size={2} sx={{ flexShrink: 0, width: '65px' }} />
          </Flex>

          <Box
            sx={{
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

          <Flex
            sx={{
              justifyContent: 'center',
              py: 9,
            }}
          >
            <Divider size={2} sx={{ flexShrink: 0, width: '65px' }} />
          </Flex>

          <Heading as="h3" size={3} mb={3}>
            Examples
          </Heading>

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
              Simple input
            </Heading>
          </Box>
          <CodeBlock live>
            {`
<Input />
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
              Input with placeholder
            </Heading>
          </Box>
          <CodeBlock live>
            {`
<Input placeholder="Placeholder" />
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
              Input with icon
            </Heading>
          </Box>
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
      <path fill-rule="evenodd" clip-rule="evenodd" d="M10 6.5C10 8.433 8.433 10 6.5 10C4.567 10 3 8.433 3 6.5C3 4.567 4.567 3 6.5 3C8.433 3 10 4.567 10 6.5ZM9.30884 10.0159C8.53901 10.6318 7.56251 11 6.5 11C4.01472 11 2 8.98528 2 6.5C2 4.01472 4.01472 2 6.5 2C8.98528 2 11 4.01472 11 6.5C11 7.56251 10.6318 8.53901 10.0159 9.30884L12.8536 12.1464C13.0488 12.3417 13.0488 12.6583 12.8536 12.8536C12.6583 13.0488 12.3417 13.0488 12.1464 12.8536L9.30884 10.0159Z" fill="#282B2E"/>
    </svg>
  </Flex>
</Box>
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
              Input with right icon
            </Heading>
          </Box>
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
      <path fill-rule="evenodd" clip-rule="evenodd" d="M10 6.5C10 8.433 8.433 10 6.5 10C4.567 10 3 8.433 3 6.5C3 4.567 4.567 3 6.5 3C8.433 3 10 4.567 10 6.5ZM9.30884 10.0159C8.53901 10.6318 7.56251 11 6.5 11C4.01472 11 2 8.98528 2 6.5C2 4.01472 4.01472 2 6.5 2C8.98528 2 11 4.01472 11 6.5C11 7.56251 10.6318 8.53901 10.0159 9.30884L12.8536 12.1464C13.0488 12.3417 13.0488 12.6583 12.8536 12.8536C12.6583 13.0488 12.3417 13.0488 12.1464 12.8536L9.30884 10.0159Z" fill="#282B2E"/>
    </svg>
  </Flex>
</Box>
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
              Input with icons on both sides
            </Heading>
          </Box>
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
      <path fill-rule="evenodd" clip-rule="evenodd" d="M10 6.5C10 8.433 8.433 10 6.5 10C4.567 10 3 8.433 3 6.5C3 4.567 4.567 3 6.5 3C8.433 3 10 4.567 10 6.5ZM9.30884 10.0159C8.53901 10.6318 7.56251 11 6.5 11C4.01472 11 2 8.98528 2 6.5C2 4.01472 4.01472 2 6.5 2C8.98528 2 11 4.01472 11 6.5C11 7.56251 10.6318 8.53901 10.0159 9.30884L12.8536 12.1464C13.0488 12.3417 13.0488 12.6583 12.8536 12.8536C12.6583 13.0488 12.3417 13.0488 12.1464 12.8536L9.30884 10.0159Z" fill="#282B2E"/>
    </svg>
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M10 6.5C10 8.433 8.433 10 6.5 10C4.567 10 3 8.433 3 6.5C3 4.567 4.567 3 6.5 3C8.433 3 10 4.567 10 6.5ZM9.30884 10.0159C8.53901 10.6318 7.56251 11 6.5 11C4.01472 11 2 8.98528 2 6.5C2 4.01472 4.01472 2 6.5 2C8.98528 2 11 4.01472 11 6.5C11 7.56251 10.6318 8.53901 10.0159 9.30884L12.8536 12.1464C13.0488 12.3417 13.0488 12.6583 12.8536 12.8536C12.6583 13.0488 12.3417 13.0488 12.1464 12.8536L9.30884 10.0159Z" fill="#282B2E"/>
    </svg>
  </Flex>
</Box>
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
              Input with interactive content
            </Heading>
            <Text
              as="p"
              size={3}
              sx={{
                mt: 2,
                lineHeight: 2,
              }}
            >
              Does anybody know if it’s possible to make codesandbox use a different version of
              prettier? I’m suspecting they are not using v2 as formatting seems to stop working
              with TS the minute I use things like <Code>??</Code> or <Code>??</Code>.
            </Text>
          </Box>
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
      <path fill-rule="evenodd" clip-rule="evenodd" d="M10 6.5C10 8.433 8.433 10 6.5 10C4.567 10 3 8.433 3 6.5C3 4.567 4.567 3 6.5 3C8.433 3 10 4.567 10 6.5ZM9.30884 10.0159C8.53901 10.6318 7.56251 11 6.5 11C4.01472 11 2 8.98528 2 6.5C2 4.01472 4.01472 2 6.5 2C8.98528 2 11 4.01472 11 6.5C11 7.56251 10.6318 8.53901 10.0159 9.30884L12.8536 12.1464C13.0488 12.3417 13.0488 12.6583 12.8536 12.8536C12.6583 13.0488 12.3417 13.0488 12.1464 12.8536L9.30884 10.0159Z" fill="#282B2E"/>
    </svg>
    <button style={{ lineHeight: '1', border: 'none', padding: '0', width: '15px', height: '15px', pointerEvents: 'auto' }}>
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M11.3536 4.35355C11.5488 4.15829 11.5488 3.84171 11.3536 3.64645C11.1583 3.45118 10.8417 3.45118 10.6464 3.64645L7.5 6.79289L4.35355 3.64645C4.15829 3.45118 3.84171 3.45118 3.64645 3.64645C3.45118 3.84171 3.45118 4.15829 3.64645 4.35355L6.79289 7.5L3.64645 10.6464C3.45118 10.8417 3.45118 11.1583 3.64645 11.3536C3.84171 11.5488 4.15829 11.5488 4.35355 11.3536L7.5 8.20711L10.6464 11.3536C10.8417 11.5488 11.1583 11.5488 11.3536 11.3536C11.5488 11.1583 11.5488 10.8417 11.3536 10.6464L8.20711 7.5L11.3536 4.35355Z" fill="#282B2E"/>
      </svg>
    </button>
  </Flex>
</Box>
`}
          </CodeBlock>

          <Flex
            sx={{
              justifyContent: 'center',
              py: 9,
            }}
          >
            <Divider size={2} sx={{ flexShrink: 0, width: '65px' }} />
          </Flex>

          <Heading as="h3" size={3} mb={3}>
            Styled Examples
          </Heading>

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

          <Flex
            sx={{
              justifyContent: 'space-between',
              my: 9,
            }}
          >
            <Box>
              <Link>
                <Text
                  size={3}
                  sx={{
                    display: 'block',
                    color: 'gray700',
                    mb: 1,
                  }}
                >
                  Previous
                </Text>
                <Text
                  size={6}
                  sx={{
                    display: 'block',
                    color: 'inherit',
                  }}
                >
                  Card
                </Text>
              </Link>
            </Box>

            <Box>
              <Link>
                <Text
                  size={3}
                  sx={{
                    display: 'block',
                    color: 'gray700',
                    textAlign: 'right',
                    mb: 1,
                  }}
                >
                  Next
                </Text>
                <Text
                  size={6}
                  sx={{
                    display: 'block',
                    textAlign: 'right',
                    color: 'inherit',
                  }}
                >
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
