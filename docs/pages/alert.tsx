import React from 'react';
import {
  Container,
  Box,
  Text,
  Button,
  Heading,
  List,
  Badge,
  ListItem,
  Divider,
  Pipe,
  Grid,
  Flex,
  CardLink,
  Link,
} from '@modulz/radix';
import { Navigation } from '../components/Navigation';
import { PlusIcon } from '@modulz/radix-icons';

export default function DemoPage() {
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
            Alert
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
            An alert displays a brief, important message to attract the user's attention without interrupting them.
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
              Simple alert
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
              <Box
                sx={{
                  backgroundColor: 'gray100',
                  border: '1px solid',
                  borderColor: 'gray300',
                  py: 2,
                  px: 4,
                  borderRadius: '2',
                }}
              >
                <Text size={3}>You might want to check something.</Text>
              </Box>
            </Box>
            <Box
              sx={{
                borderTop: '1px solid gainsboro',
                p: 3,
              }}
            >
              <pre style={{ margin: '0' }}>
                <code style={{ fontSize: '13px', fontFamily: 'Söhne Mono' }}>
                  &lt;Alert&gt;&lt;Text&gt;Attention! You might want to check something.&lt;/Text&gt;&lt;/Alert&gt;
                </code>
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
              Alert with title
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
              <Box
                sx={{
                  backgroundColor: 'gray100',
                  border: '1px solid',
                  borderColor: 'gray300',
                  py: 2,
                  px: 4,
                  borderRadius: '2',
                }}
              >
                <Text
                  size={3}
                  weight="medium"
                  sx={{
                    mr: 1,
                  }}
                >
                  Attention!
                </Text>
                <Text
                  size={3}
                  sx={{
                    color: 'gray700',
                  }}
                >
                  You might want to check something.
                </Text>
              </Box>
            </Box>
            <Box
              sx={{
                borderTop: '1px solid gainsboro',
                p: 3,
              }}
            >
              <pre style={{ margin: '0' }}>
                <code style={{ fontSize: '13px', fontFamily: 'Söhne Mono' }}>
                  &lt;Alert&gt;&lt;Text&gt;Attention! You might want to check something.&lt;/Text&gt;&lt;/Alert&gt;
                </code>
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
              Alert with title
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
              <Box
                sx={{
                  backgroundColor: 'gray900',
                  py: 1,
                  px: 4,
                  position: 'relative',
                }}
              >
                <Flex
                  sx={{
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text
                    size={3}
                    sx={{
                      color: 'white',
                    }}
                  >
                    An important or exciting message from the company.
                  </Text>
                  <Pipe
                    sx={{
                      backgroundColor: 'gray800',
                      mx: 3,
                    }}
                  />
                  <Link
                    href="#"
                    sx={{
                      color: 'white',
                    }}
                  >
                    <Flex
                      sx={{
                        alignItems: 'center',
                      }}
                    >
                      <Text
                        size={3}
                        weight="medium"
                        sx={{
                          color: 'inherit',
                        }}
                      >
                        Read more
                      </Text>
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
                            d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z"
                            fill="currentColor"
                          />
                        </svg>
                      </Box>
                    </Flex>
                  </Link>
                </Flex>
                <Flex
                  sx={{
                    position: 'absolute',
                    top: '0',
                    right: '0',
                    height: '100%',
                    alignItems: 'center',
                    marginRight: '15px',
                  }}
                >
                  <button
                    style={{
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: 'hsl(208, 10%, 46%)',
                      padding: '0',
                      lineHeight: 1,
                      display: 'inline-flex',
                    }}
                  >
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M11.3536 4.35355C11.5488 4.15829 11.5488 3.84171 11.3536 3.64645C11.1583 3.45118 10.8417 3.45118 10.6464 3.64645L7.5 6.79289L4.35355 3.64645C4.15829 3.45118 3.84171 3.45118 3.64645 3.64645C3.45118 3.84171 3.45118 4.15829 3.64645 4.35355L6.79289 7.5L3.64645 10.6464C3.45118 10.8417 3.45118 11.1583 3.64645 11.3536C3.84171 11.5488 4.15829 11.5488 4.35355 11.3536L7.5 8.20711L10.6464 11.3536C10.8417 11.5488 11.1583 11.5488 11.3536 11.3536C11.5488 11.1583 11.5488 10.8417 11.3536 10.6464L8.20711 7.5L11.3536 4.35355Z"
                        fill="currentColor"
                      />
                    </svg>
                  </button>
                </Flex>
              </Box>
            </Box>
            <Box
              sx={{
                borderTop: '1px solid gainsboro',
                p: 3,
              }}
            >
              <pre style={{ margin: '0' }}>
                <code style={{ fontSize: '13px', fontFamily: 'Söhne Mono' }}>
                  &lt;Alert&gt;&lt;Text&gt;Attention! You might want to check something.&lt;/Text&gt;&lt;/Alert&gt;
                </code>
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
              Simple alert
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
              <Box
                sx={{
                  maxWidth: '250px',
                }}
              >
                <Box
                  sx={{
                    backgroundColor: 'gray100',
                    border: '1px solid',
                    borderColor: 'gray300',
                    py: 2,
                    px: 4,
                    borderRadius: '2',
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: 'gray100',
                      mb: 1,
                    }}
                  >
                    <Text size={3} weight="medium">
                      Heading
                    </Text>
                  </Box>
                  <Text
                    size={2}
                    sx={{
                      color: 'gray700',
                      lineHeight: 1,
                    }}
                  >
                    Draw attention to information such as a company message, a new feature highlight, a prompt to take
                    action on something, a reminder to complete a task, or something similar.
                  </Text>
                </Box>
              </Box>
            </Box>
            <Box
              sx={{
                borderTop: '1px solid gainsboro',
                p: 3,
              }}
            >
              <pre style={{ margin: '0' }}>
                <code style={{ fontSize: '13px', fontFamily: 'Söhne Mono' }}>
                  &lt;Alert&gt;&lt;Text&gt;Attention! You might want to check something.&lt;/Text&gt;&lt;/Alert&gt;
                </code>
              </pre>
            </Box>
          </Box>
        </Container>
      </Box>
    </div>
  );
}
