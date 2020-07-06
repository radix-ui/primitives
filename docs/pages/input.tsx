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

export default function InputPage() {
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
            A button enables users to trigger an event, such as submitting a form, opening a dialog,
            canceling an action, or performing a delete operation.
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
                <code style={{ fontSize: '13px', fontFamily: 'Söhne Mono' }}>
                  &lt;Button&gt;Button&lt;/Button&gt;
                </code>
              </pre>
            </Box>
          </Box>
        </Container>
      </Box>
    </div>
  );
}
