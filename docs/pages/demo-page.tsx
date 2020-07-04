import React from 'react';
import { Container, Box, Text, Heading, List, ListItem, Divider, Grid, Flex, CardLink, Link } from '@modulz/radix';
import { Navigation } from '../components/Navigation';

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
        <Container size={2} pt={2}>
          <Heading
            as="h1"
            size={5}
            sx={{
              lineHeight: 9,
            }}
          >
            What is components?
          </Heading>

          <Box
            sx={{
              my: 9,
            }}
          >
            <Text
              as="p"
              size={5}
              sx={{
                lineHeight: 3,
              }}
            >
              All components are accessible out of the box, strictly following WAI-ARIA standards. All components are
              tested rigorously for screenreader support and keyboard interactions.
            </Text>
            <Text
              as="p"
              size={5}
              sx={{
                lineHeight: 3,
                mb: 4,
              }}
            >
              All components are accessible out of the box.
            </Text>
            <Text
              as="p"
              size={5}
              sx={{
                lineHeight: 3,
              }}
            >
              All components are accessible out of the box, strictly following WAI-ARIA standards. All components are
              tested rigorously for screenreader support and keyboard interactions.
            </Text>
            <Text
              as="p"
              size={5}
              sx={{
                lineHeight: 3,
              }}
            >
              All components are accessible out of the box, strictly following WAI-ARIA standards.
            </Text>
          </Box>

          <Grid sx={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: 7 }}>
            <Box>
              <Heading as="h3" size={1} mb={3} sx={{ fontWeight: 500 }}>
                Accessible
              </Heading>
              <Text as="p" size={4} sx={{ lineHeight: '3' }}>
                Primitives adhere to WAI-ARIA guidelines and are tested regularly in a wide selection of modern browsers
                and assistive technologies.
              </Text>
            </Box>
            <Box>
              <Heading as="h3" size={1} mb={3} sx={{ fontWeight: 500 }}>
                Functional
              </Heading>
              <Text as="p" size={4} sx={{ lineHeight: '3' }}>
                Primitives are feature-rich, with support for keyboard interaction, collision detection, focus trapping,
                dynamic resizing, scroll locking, native fallbacks, and more.
              </Text>
            </Box>
            <Box>
              <Heading as="h3" size={1} mb={3} sx={{ fontWeight: 500 }}>
                Interoperable
              </Heading>
              <Text as="p" size={4} sx={{ lineHeight: '3' }}>
                Fully interoperable with Modulz Editor and compatible with Modulz design tool plugins.
              </Text>
            </Box>
            <Box>
              <Heading as="h3" size={1} mb={3} sx={{ fontWeight: 500 }}>
                Themeable
              </Heading>
              <Text as="p" size={4} sx={{ lineHeight: '3' }}>
                Primitives are built to be themed. No need to override opinionated styles—Primitives ship with zero
                presentational styles.
              </Text>
            </Box>
            <Box>
              <Heading as="h3" size={1} mb={3} sx={{ fontWeight: 500 }}>
                Composable
              </Heading>
              <Text as="p" size={4} sx={{ lineHeight: '3' }}>
                Components were built to be composed.
              </Text>
            </Box>
            <Box>
              <Heading as="h3" size={1} mb={3} sx={{ fontWeight: 500 }}>
                Open-source
              </Heading>
              <Text as="p" size={4} sx={{ lineHeight: '3' }}>
                Primitives are free and open-source under the MIT license.
              </Text>
            </Box>
          </Grid>

          <Flex
            sx={{
              py: 9,
              justifyContent: 'center',
            }}
          >
            <Divider
              sx={{
                width: '65px',
              }}
            />
          </Flex>

          <Box>
            <Grid sx={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: 7 }}>
              <Box>
                <CardLink variant="shadow">
                  <Heading
                    as="h4"
                    size={1}
                    sx={{
                      lineHeight: 2,
                      mb: 1,
                    }}
                  >
                    Icons
                  </Heading>
                  <Text
                    as="p"
                    size={3}
                    sx={{
                      lineHeight: 2,
                      color: 'gray700',
                    }}
                  >
                    Short description for this link.
                  </Text>
                </CardLink>
              </Box>
              <Box>
                <CardLink variant="shadow">
                  <Heading
                    as="h4"
                    size={1}
                    sx={{
                      lineHeight: 2,
                      mb: 1,
                    }}
                  >
                    Layouts
                  </Heading>
                  <Text
                    as="p"
                    size={3}
                    sx={{
                      lineHeight: 2,
                      color: 'gray700',
                    }}
                  >
                    Short description for this link.
                  </Text>
                </CardLink>
              </Box>
              <Box>
                <CardLink variant="shadow">
                  <Heading
                    as="h4"
                    size={1}
                    sx={{
                      lineHeight: 2,
                      mb: 1,
                    }}
                  >
                    Tutorials
                  </Heading>
                  <Text
                    as="p"
                    size={3}
                    sx={{
                      lineHeight: 2,
                      color: 'gray700',
                    }}
                  >
                    Short description for this link.
                  </Text>
                </CardLink>
              </Box>
              <Box>
                <Link>
                  <CardLink variant="shadow" as="a">
                    <Heading
                      as="h4"
                      size={1}
                      sx={{
                        lineHeight: 2,
                        mb: 1,
                      }}
                    >
                      Showcase
                    </Heading>
                    <Text
                      as="p"
                      size={3}
                      sx={{
                        lineHeight: 2,
                        color: 'gray700',
                      }}
                    >
                      Short description for this link.
                    </Text>
                  </CardLink>
                </Link>
              </Box>
            </Grid>
          </Box>

          <Flex
            sx={{
              py: 9,
              justifyContent: 'center',
            }}
          >
            <Divider
              sx={{
                width: '65px',
              }}
            />
          </Flex>

          <Box>
            <Grid sx={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: 7 }}>
              <Box>
                <Heading
                  as="p"
                  size={1}
                  sx={{
                    lineHeight: 2,
                    mb: 1,
                  }}
                >
                  Frequently asked question?
                </Heading>
                <Text
                  as="p"
                  size={4}
                  sx={{
                    lineHeight: 3,
                  }}
                >
                  I hope you're enjoying the first days of summer albeit probably mostly in quarantine! Saw your
                  exciting post the other day, congrats on this and the clearly great response from the industry per the
                  conversation here.
                </Text>
              </Box>
              <Box>
                <Heading
                  as="h4"
                  size={1}
                  sx={{
                    lineHeight: 2,
                    mb: 1,
                  }}
                >
                  Frequently asked question?
                </Heading>
                <Text
                  as="p"
                  size={4}
                  sx={{
                    lineHeight: 3,
                  }}
                >
                  I hope you're enjoying the first days of summer albeit probably mostly in quarantine! Saw your
                  exciting post the other day, congrats on this and the clearly great response from the industry per the
                  conversation here.
                </Text>
              </Box>
              <Box>
                <Heading
                  as="h4"
                  size={1}
                  sx={{
                    lineHeight: 2,
                    mb: 1,
                  }}
                >
                  Frequently asked question?
                </Heading>
                <Text
                  as="p"
                  size={4}
                  sx={{
                    lineHeight: 3,
                  }}
                >
                  I hope you're enjoying the first days of summer albeit probably mostly in quarantine!
                </Text>
              </Box>
              <Box>
                <Heading
                  as="h4"
                  size={1}
                  sx={{
                    lineHeight: 2,
                    mb: 1,
                  }}
                >
                  Frequently asked question?
                </Heading>
                <Text
                  as="p"
                  size={4}
                  sx={{
                    lineHeight: 3,
                  }}
                >
                  I hope you're enjoying the first days of summer albeit probably mostly in quarantine! Saw your
                  exciting post the other day, congrats on this and the clearly great response from the industry per the
                  conversation here.
                </Text>
              </Box>
              <Box>
                <Heading
                  as="h4"
                  size={1}
                  sx={{
                    lineHeight: 2,
                    mb: 1,
                  }}
                >
                  Frequently asked question?
                </Heading>
                <Text
                  as="p"
                  size={4}
                  sx={{
                    lineHeight: 3,
                  }}
                >
                  I hope you're enjoying the first days of summer albeit probably mostly in quarantine!
                </Text>
              </Box>
              <Box>
                <Heading
                  as="h4"
                  size={1}
                  sx={{
                    lineHeight: 2,
                    mb: 1,
                  }}
                >
                  Frequently asked question?
                </Heading>
                <Text
                  as="p"
                  size={4}
                  sx={{
                    lineHeight: 3,
                  }}
                >
                  I hope you're enjoying the first days of summer albeit probably mostly in quarantine!
                </Text>
              </Box>
            </Grid>
          </Box>
        </Container>
      </Box>
    </div>
  );
}
