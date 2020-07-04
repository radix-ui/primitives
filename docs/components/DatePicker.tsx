import React from 'react';
import {
  Container,
  Box,
  Text,
  Link,
  Flex,
  Pipe,
  Popover,
  Grid,
  ChromelessButton,
  Badge,
  Heading,
  Divider,
  VisuallyHidden,
} from '@modulz/radix';
import { PlusIcon } from '@modulz/radix-icons';

export const DatePicker = () => {
  return (
    <Box
      sx={{
        flexShrink: 0,
        backgroundColor: 'white',
        borderRadius: '3',
        position: 'relative',
        p: '3',
        mr: '8',
        boxShadow: '0 10px 38px -10px rgba(22,23,24,0.35), 0 10px 20px -15px rgba(22,23,24,0.2)',
        fontFeatureSettings: "'tnum'",
      }}
    >
      <Flex
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 1,
        }}
      >
        <Flex
          sx={{
            width: 6,
            height: 6,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M9.3534 3.14636C9.54866 3.34162 9.54866 3.65821 9.3534 3.85347L5.70695 7.49992L9.3534 11.1464C9.54866 11.3416 9.54866 11.6582 9.3534 11.8535C9.15814 12.0487 8.84156 12.0487 8.64629 11.8535L4.64629 7.85347C4.45103 7.65821 4.45103 7.34162 4.64629 7.14636L8.64629 3.14636C8.84156 2.9511 9.15814 2.9511 9.3534 3.14636Z"
              fill="#282B2E"
            />
          </svg>
        </Flex>
        <Text
          weight="medium"
          sx={{
            fontSize: 3,
          }}
        >
          July
        </Text>
        <Flex
          sx={{
            width: 6,
            height: 6,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M5.64683 3.14628C5.84209 2.95102 6.15867 2.95102 6.35394 3.14628L10.3539 7.14628C10.4477 7.24005 10.5004 7.36722 10.5004 7.49983C10.5004 7.63244 10.4477 7.75962 10.3539 7.85339L6.35393 11.8534C6.15867 12.0486 5.84209 12.0486 5.64683 11.8534C5.45157 11.6581 5.45157 11.3415 5.64683 11.1463L9.29328 7.49983L5.64683 3.85339C5.45157 3.65812 5.45157 3.34154 5.64683 3.14628Z"
              fill="#282B2E"
            />
          </svg>
        </Flex>
      </Flex>
      <Grid
        sx={{
          gridTemplateColumns: ['repeat(1, 1fr)', 'repeat(7, 1fr)'],
        }}
      >
        <Flex
          sx={{
            width: 6,
            height: 6,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text size={2} sx={{ color: 'gray700' }}>
            Su
          </Text>
        </Flex>
        <Flex
          sx={{
            width: 6,
            height: 6,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text size={2} sx={{ color: 'gray700' }}>
            Mo
          </Text>
        </Flex>
        <Flex
          sx={{
            width: 6,
            height: 6,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text size={2} sx={{ color: 'gray700' }}>
            Tu
          </Text>
        </Flex>
        <Flex
          sx={{
            width: 6,
            height: 6,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text size={2} sx={{ color: 'gray700' }}>
            We
          </Text>
        </Flex>
        <Flex
          sx={{
            width: 6,
            height: 6,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text size={2} sx={{ color: 'gray700' }}>
            Th
          </Text>
        </Flex>
        <Flex
          sx={{
            width: 6,
            height: 6,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text size={2} sx={{ color: 'gray700' }}>
            Fr
          </Text>
        </Flex>
        <Flex
          sx={{
            width: 6,
            height: 6,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text size={2} sx={{ color: 'gray700' }}>
            Sa
          </Text>
        </Flex>
        <Flex
          sx={{
            width: 6,
            height: 6,
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 2,
          }}
        ></Flex>
        <Flex
          sx={{
            width: 6,
            height: 6,
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 2,
          }}
        ></Flex>
        <Flex
          sx={{
            width: 6,
            height: 6,
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 2,
          }}
        ></Flex>
        <Flex
          sx={{
            width: 6,
            height: 6,
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 2,
          }}
        >
          1
        </Flex>
        <Flex
          sx={{
            width: 6,
            height: 6,
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 2,
          }}
        >
          2
        </Flex>
        <Flex
          sx={{
            width: 6,
            height: 6,
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 2,
          }}
        >
          3
        </Flex>
        <Flex
          sx={{
            width: 6,
            height: 6,
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 2,
          }}
        >
          4
        </Flex>
        <Flex
          sx={{
            width: 6,
            height: 6,
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 2,
          }}
        >
          5
        </Flex>
        <Flex
          sx={{
            width: 6,
            height: 6,
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 2,
          }}
        >
          6
        </Flex>
        <Flex
          sx={{
            width: 6,
            height: 6,
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 2,
          }}
        >
          7
        </Flex>
        <Flex
          sx={{
            width: 6,
            height: 6,
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 2,
          }}
        >
          8
        </Flex>
        <Flex
          sx={{
            width: 6,
            height: 6,
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 2,
          }}
        >
          9
        </Flex>
        <Flex
          sx={{
            width: 6,
            height: 6,
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 2,
          }}
        >
          10
        </Flex>
        <Flex
          sx={{
            width: 6,
            height: 6,
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 2,
          }}
        >
          11
        </Flex>
        <Flex
          sx={{
            width: 6,
            height: 6,
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 2,
          }}
        >
          12
        </Flex>
        <Flex
          sx={{
            width: 6,
            height: 6,
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 2,
          }}
        >
          13
        </Flex>
        <Flex
          sx={{
            width: 6,
            height: 6,
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 2,
          }}
        >
          14
        </Flex>
        <Flex
          sx={{
            width: 6,
            height: 6,
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 2,
          }}
        >
          15
        </Flex>
        <Flex
          sx={{
            width: 6,
            height: 6,
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 2,
            backgroundColor: 'gray400',
          }}
        >
          16
        </Flex>
        <Flex
          sx={{
            width: 6,
            height: 6,
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 2,
            backgroundColor: 'gray200',
          }}
        >
          17
        </Flex>
        <Flex
          sx={{
            width: 6,
            height: 6,
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 2,
            backgroundColor: 'gray200',
          }}
        >
          18
        </Flex>
        <Flex
          sx={{
            width: 6,
            height: 6,
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 2,
            backgroundColor: 'gray200',
          }}
        >
          19
        </Flex>
        <Flex
          sx={{
            width: 6,
            height: 6,
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 2,
            backgroundColor: 'gray200',
          }}
        >
          20
        </Flex>
        <Flex
          sx={{
            width: 6,
            height: 6,
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 2,
            backgroundColor: 'gray400',
          }}
        >
          21
        </Flex>
        <Flex
          sx={{
            width: 6,
            height: 6,
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 2,
          }}
        >
          22
        </Flex>
        <Flex
          sx={{
            width: 6,
            height: 6,
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 2,
          }}
        >
          23
        </Flex>
        <Flex
          sx={{
            width: 6,
            height: 6,
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 2,
          }}
        >
          24
        </Flex>
        <Flex
          sx={{
            width: 6,
            height: 6,
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 2,
          }}
        >
          25
        </Flex>
        <Flex
          sx={{
            width: 6,
            height: 6,
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 2,
          }}
        >
          26
        </Flex>
        <Flex
          sx={{
            width: 6,
            height: 6,
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 2,
          }}
        >
          27
        </Flex>
        <Flex
          sx={{
            width: 6,
            height: 6,
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 2,
          }}
        >
          28
        </Flex>
        <Flex
          sx={{
            width: 6,
            height: 6,
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 2,
          }}
        >
          29
        </Flex>
        <Flex
          sx={{
            width: 6,
            height: 6,
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 2,
          }}
        >
          30
        </Flex>
        <Flex
          sx={{
            width: 6,
            height: 6,
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 2,
          }}
        >
          31
        </Flex>
        <Flex
          sx={{
            width: 6,
            height: 6,
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 2,
          }}
        ></Flex>
      </Grid>
    </Box>
  );
};
