import React from 'react';
import {
  Container,
  Box,
  Text,
  AspectRatio,
  Code,
  Button,
  Heading,
  List,
  Badge,
  ListItem,
  Divider,
  Pipe,
  Table,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
  Grid,
  Flex,
  CardLink,
  Link,
} from '@modulz/radix';
import { Navigation } from '../components/Navigation';

export default function ButtonPage() {
  return (
    <div>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          height: '100%',
          width: '245px',
          flexShrink: 0,
          borderRightWidth: '1px',
          borderRightStyle: 'solid',
          borderRightColor: 'gray300',
          overflowY: 'auto',
          pb: 6,
        }}
      >
        <Navigation />
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          pl: '245px',
          py: 9,
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
            Button
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
            A button enables users to trigger an event, such as submitting a form, opening a dialog, canceling an
            action, or performing a delete operation.
          </Heading>

          <Box sx={{ my: 7, mx: -9 }}>
            <AspectRatio ratio="3:1">
              <Flex
                sx={{
                  border: '1px solid gainsboro',
                  borderRadius: '2',
                  height: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Box sx={{}}>
                  <Button>Button</Button>
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
            <Heading
              as="h4"
              size={1}
              sx={{
                lineHeight: 2,
                mb: 1,
              }}
            >
              Installation
            </Heading>
            <Text size={3} sx={{ lineHeight: 2 }}>
              Install the component from your command line:
            </Text>
          </Box>
          <Box
            sx={{
              border: '1px solid gainsboro',
              borderRadius: '2',
              p: 3,
            }}
          >
            <pre style={{ margin: '0' }}>
              <code style={{ fontSize: '13px', fontFamily: 'Söhne Mono' }}>npm install @componentsorg/button</code>
            </pre>
          </Box>
          <Text as="p" size={3} sx={{ lineHeight: 2, my: 4 }}>
            Then import the component:
          </Text>
          <Box
            sx={{
              border: '1px solid gainsboro',
              borderRadius: '2',
              p: 3,
            }}
          >
            <pre style={{ margin: '0' }}>
              <code style={{ fontSize: '13px', fontFamily: 'Söhne Mono' }}>
                import Button from "@componentsorg/button";
              </code>
            </pre>
          </Box>

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
              Simple button
            </Heading>
          </Box>

          <Box
            sx={{
              border: '1px solid gainsboro',
              borderRadius: '2',
            }}
          >
            <Box
              sx={{
                p: 3,
              }}
            >
              <Button>Button</Button>
            </Box>
            <Box
              sx={{
                borderTop: '1px solid gainsboro',
                p: 3,
              }}
            >
              <pre style={{ margin: '0' }}>
                <code style={{ fontSize: '13px', fontFamily: 'Söhne Mono' }}>&lt;Button&gt;Button&lt;/Button&gt;</code>
              </pre>
            </Box>
          </Box>

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
              Button with icon
            </Heading>
          </Box>

          <Box
            sx={{
              border: '1px solid gainsboro',
              borderRadius: '2',
            }}
          >
            <Box
              sx={{
                p: 3,
              }}
            >
              <Button>
                <Box
                  sx={{
                    mr: 1,
                  }}
                  style={{
                    lineHeight: 1,
                  }}
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ verticalAlign: 'middle' }}
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M5.64683 3.14628C5.84209 2.95102 6.15867 2.95102 6.35394 3.14628L10.3539 7.14628C10.4477 7.24005 10.5004 7.36722 10.5004 7.49983C10.5004 7.63244 10.4477 7.75962 10.3539 7.85339L6.35393 11.8534C6.15867 12.0486 5.84209 12.0486 5.64683 11.8534C5.45157 11.6581 5.45157 11.3415 5.64683 11.1463L9.29328 7.49983L5.64683 3.85339C5.45157 3.65812 5.45157 3.34154 5.64683 3.14628Z"
                      fill="#282B2E"
                    />
                  </svg>
                </Box>
                Button
              </Button>
            </Box>
            <Box
              sx={{
                borderTop: '1px solid gainsboro',
                p: 3,
              }}
            >
              <pre style={{ margin: '0' }}>
                <code style={{ fontSize: '13px', fontFamily: 'Söhne Mono' }}>&lt;Button&gt;Button&lt;/Button&gt;</code>
              </pre>
            </Box>
          </Box>

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
              Button with right icon
            </Heading>
          </Box>

          <Box
            sx={{
              border: '1px solid gainsboro',
              borderRadius: '2',
            }}
          >
            <Box
              sx={{
                p: 3,
              }}
            >
              <Button>
                Button
                <Box
                  sx={{
                    ml: 1,
                  }}
                  style={{
                    lineHeight: 1,
                  }}
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ verticalAlign: 'middle' }}
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M5.64683 3.14628C5.84209 2.95102 6.15867 2.95102 6.35394 3.14628L10.3539 7.14628C10.4477 7.24005 10.5004 7.36722 10.5004 7.49983C10.5004 7.63244 10.4477 7.75962 10.3539 7.85339L6.35393 11.8534C6.15867 12.0486 5.84209 12.0486 5.64683 11.8534C5.45157 11.6581 5.45157 11.3415 5.64683 11.1463L9.29328 7.49983L5.64683 3.85339C5.45157 3.65812 5.45157 3.34154 5.64683 3.14628Z"
                      fill="#282B2E"
                    />
                  </svg>
                </Box>
              </Button>
            </Box>
            <Box
              sx={{
                borderTop: '1px solid gainsboro',
                p: 3,
              }}
            >
              <pre style={{ margin: '0' }}>
                <code style={{ fontSize: '13px', fontFamily: 'Söhne Mono' }}>&lt;Button&gt;Button&lt;/Button&gt;</code>
              </pre>
            </Box>
          </Box>

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
              Button with two icons
            </Heading>
          </Box>

          <Box
            sx={{
              border: '1px solid gainsboro',
              borderRadius: '2',
            }}
          >
            <Box
              sx={{
                p: 3,
              }}
            >
              <Button>
                <Box
                  sx={{
                    mr: 1,
                  }}
                  style={{
                    lineHeight: 1,
                  }}
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ verticalAlign: 'middle' }}
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M5.64683 3.14628C5.84209 2.95102 6.15867 2.95102 6.35394 3.14628L10.3539 7.14628C10.4477 7.24005 10.5004 7.36722 10.5004 7.49983C10.5004 7.63244 10.4477 7.75962 10.3539 7.85339L6.35393 11.8534C6.15867 12.0486 5.84209 12.0486 5.64683 11.8534C5.45157 11.6581 5.45157 11.3415 5.64683 11.1463L9.29328 7.49983L5.64683 3.85339C5.45157 3.65812 5.45157 3.34154 5.64683 3.14628Z"
                      fill="#282B2E"
                    />
                  </svg>
                </Box>
                Button
                <Box
                  sx={{
                    ml: 1,
                  }}
                  style={{
                    lineHeight: 1,
                  }}
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ verticalAlign: 'middle' }}
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M5.64683 3.14628C5.84209 2.95102 6.15867 2.95102 6.35394 3.14628L10.3539 7.14628C10.4477 7.24005 10.5004 7.36722 10.5004 7.49983C10.5004 7.63244 10.4477 7.75962 10.3539 7.85339L6.35393 11.8534C6.15867 12.0486 5.84209 12.0486 5.64683 11.8534C5.45157 11.6581 5.45157 11.3415 5.64683 11.1463L9.29328 7.49983L5.64683 3.85339C5.45157 3.65812 5.45157 3.34154 5.64683 3.14628Z"
                      fill="#282B2E"
                    />
                  </svg>
                </Box>
              </Button>
            </Box>
            <Box
              sx={{
                borderTop: '1px solid gainsboro',
                p: 3,
              }}
            >
              <pre style={{ margin: '0' }}>
                <code style={{ fontSize: '13px', fontFamily: 'Söhne Mono' }}>&lt;Button&gt;Button&lt;/Button&gt;</code>
              </pre>
            </Box>
          </Box>

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

          <Box
            sx={{
              border: '1px solid gainsboro',
              borderRadius: '2',
            }}
          >
            <Box
              sx={{
                p: 3,
              }}
            >
              <Button>
                Follow
                <Pipe sx={{ mx: 2 }} />
                <Text size={1}>58</Text>
              </Button>
            </Box>
            <Box
              sx={{
                borderTop: '1px solid gainsboro',
                p: 3,
              }}
            >
              <pre style={{ margin: '0' }}>
                <code style={{ fontSize: '13px', fontFamily: 'Söhne Mono' }}>&lt;Button&gt;Button&lt;/Button&gt;</code>
              </pre>
            </Box>
          </Box>

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

          <Box
            sx={{
              border: '1px solid gainsboro',
              borderRadius: '2',
            }}
          >
            <Box
              sx={{
                p: 3,
              }}
            >
              <Button>
                Follow
                <Badge
                  sx={{
                    ml: 2,
                  }}
                >
                  58
                </Badge>
              </Button>
            </Box>
            <Box
              sx={{
                borderTop: '1px solid gainsboro',
                p: 3,
              }}
            >
              <pre style={{ margin: '0' }}>
                <code style={{ fontSize: '13px', fontFamily: 'Söhne Mono' }}>&lt;Button&gt;Button&lt;/Button&gt;</code>
              </pre>
            </Box>
          </Box>

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

          <Box
            sx={{
              border: '1px solid gainsboro',
              borderRadius: '2',
            }}
          >
            <Box
              sx={{
                p: 3,
              }}
            >
              <Button>Button</Button>
            </Box>
            <Box
              sx={{
                borderTop: '1px solid gainsboro',
                p: 3,
              }}
            >
              <pre style={{ margin: '0' }}>
                <code style={{ fontSize: '13px', fontFamily: 'Söhne Mono' }}>&lt;Button&gt;Button&lt;/Button&gt;</code>
              </pre>
            </Box>
          </Box>

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
              Button with dropdown
            </Heading>
          </Box>

          <Box
            sx={{
              border: '1px solid gainsboro',
              borderRadius: '2',
            }}
          >
            <Box
              sx={{
                p: 3,
              }}
            >
              <Button>
                Button
                <Box
                  sx={{
                    ml: 1,
                  }}
                  style={{
                    lineHeight: 1,
                  }}
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ verticalAlign: 'middle' }}
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M5.64683 3.14628C5.84209 2.95102 6.15867 2.95102 6.35394 3.14628L10.3539 7.14628C10.4477 7.24005 10.5004 7.36722 10.5004 7.49983C10.5004 7.63244 10.4477 7.75962 10.3539 7.85339L6.35393 11.8534C6.15867 12.0486 5.84209 12.0486 5.64683 11.8534C5.45157 11.6581 5.45157 11.3415 5.64683 11.1463L9.29328 7.49983L5.64683 3.85339C5.45157 3.65812 5.45157 3.34154 5.64683 3.14628Z"
                      fill="#282B2E"
                    />
                  </svg>
                </Box>
              </Button>
            </Box>
            <Box
              sx={{
                borderTop: '1px solid gainsboro',
                p: 3,
              }}
            >
              <pre style={{ margin: '0' }}>
                <code style={{ fontSize: '13px', fontFamily: 'Söhne Mono' }}>&lt;Button&gt;Button&lt;/Button&gt;</code>
              </pre>
            </Box>
          </Box>

          <Box
            sx={{
              pt: 9,
            }}
          >
            <Divider />
          </Box>

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
              <Heading
                as="h4"
                size={1}
                sx={{
                  lineHeight: 2,
                }}
              >
                Related components
              </Heading>
              <ul>
                <li>
                  <Link>
                    <Text size={3}>MenuButton</Text>
                  </Link>
                </li>
                <li>
                  <Link>
                    <Text size={3}>ToggleButton</Text>
                  </Link>
                </li>
                <li>
                  <Link>
                    <Text size={3}>ToolBar</Text>
                  </Link>
                </li>
              </ul>
            </Box>
          </Box>

          <Divider />

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
    </div>
  );
}
